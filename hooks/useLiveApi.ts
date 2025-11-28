import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality } from "@google/genai";
import { createPcmBlob, base64ToUint8Array, decodeAudioData } from '../utils/audioUtils';
import { LiveStatus } from '../types';

interface UseLiveApiReturn {
  status: LiveStatus;
  connect: () => Promise<void>;
  disconnect: () => void;
  isAiSpeaking: boolean;
  volume: number; // For visualization 0-1
}

export const useLiveApi = (): UseLiveApiReturn => {
  const [status, setStatus] = useState<LiveStatus>('disconnected');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);

  // Refs for persistent objects across renders
  const sessionRef = useRef<LiveSession | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const analysisIntervalRef = useRef<number | null>(null);

  // Clean up function to stop all audio and connections
  const disconnect = useCallback(() => {
    console.log("Disconnecting Live API...");
    
    // 1. Close session
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }

    // 2. Stop microphone
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // 3. Stop input processing
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }

    // 4. Close output context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (analysisIntervalRef.current) {
      window.clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }

    setStatus('disconnected');
    setIsAiSpeaking(false);
    setVolume(0);
  }, []);

  const connect = useCallback(async () => {
    if (!process.env.API_KEY) {
      console.error("API Key not found");
      setStatus('error');
      return;
    }

    try {
      setStatus('connecting');

      // Initialize GenAI
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // Initialize Audio Contexts
      // Input: 16kHz for Gemini
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputAudioContextRef.current = inputCtx;

      // Output: 24kHz for Gemini playback
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      // Get Microphone Access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Establish Connection
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `You are "Mosaed" (Assistant), a helpful and friendly AI assistant for "Sufra", a popular food delivery application in the Middle East. 
          Your role is to help customers find food, check their order status, and resolve issues. 
          Speak in a friendly, conversational tone. You can speak English or Arabic depending on the user.
          Current available categories: Burgers, Pizza, Shawarma, Sushi, Desserts.
          If asked about order status, ask for an order ID.
          Keep responses concise and helpful.`,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
        },
        callbacks: {
          onopen: () => {
            console.log("Live API Connected");
            setStatus('connected');

            // Setup Audio Input Streaming
            const source = inputCtx.createMediaStreamSource(stream);
            sourceRef.current = source;

            // Use ScriptProcessor for raw PCM access (Worklets are harder in single-file setup)
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              // Calculate simple volume for visualizer from input
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
              const rms = Math.sqrt(sum / inputData.length);
              // Only set volume if AI isn't speaking (simple priority)
              if (!isAiSpeaking) setVolume(Math.min(1, rms * 5));

              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
             // Handle Audio Output
             const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (base64Audio && outputCtx) {
                setIsAiSpeaking(true);
                // Reset speaking flag after roughly the duration of the chunk (approximation)
                // In a real app, you'd track source 'ended' events more rigorously
                setTimeout(() => setIsAiSpeaking(false), 200); // Visualizer fallback
                setVolume(Math.random() * 0.5 + 0.3); // Fake volume for AI speech visualization

                const audioData = base64ToUint8Array(base64Audio);
                const audioBuffer = await decodeAudioData(audioData, outputCtx, 24000);
                
                const source = outputCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputCtx.destination);
                
                // Scheduling
                const now = outputCtx.currentTime;
                // Ensure we don't schedule in the past
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, now);
                
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
             }

             // Handle Turn Complete (useful for clearing states if needed)
             if (msg.serverContent?.turnComplete) {
                setIsAiSpeaking(false);
             }
          },
          onclose: () => {
            console.log("Live API Closed");
            disconnect();
          },
          onerror: (err) => {
            console.error("Live API Error", err);
            setStatus('error');
            disconnect();
          }
        }
      });
      
      sessionRef.current = await sessionPromise;

    } catch (error) {
      console.error("Connection failed:", error);
      setStatus('error');
      disconnect();
    }
  }, [disconnect, isAiSpeaking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return {
    status,
    connect,
    disconnect,
    isAiSpeaking,
    volume
  };
};
