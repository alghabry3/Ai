import React, { useEffect, useRef } from 'react';
import { AudioVisualizerProps } from '../types';

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ status, volume, isAiSpeaking }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    
    // Animation Loop
    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      if (status === 'disconnected') {
         // Draw a simple line
         ctx.beginPath();
         ctx.moveTo(0, centerY);
         ctx.lineTo(width, centerY);
         ctx.strokeStyle = '#cbd5e1'; // slate-300
         ctx.lineWidth = 2;
         ctx.stroke();
         return;
      }

      // Dynamic Wave Configuration
      const color = isAiSpeaking ? '#10b981' : '#f59e0b'; // Emerald (AI) vs Amber (User)
      const bars = 5;
      const spacing = width / bars;
      
      for (let i = 0; i < bars; i++) {
        // Create a distinct height for each bar based on volume and time
        const timeOffset = Date.now() / 200 + i;
        const activeMultiplier = (status === 'connecting') ? 0.3 : (volume * 2.5); // Pulse when connecting
        const baseHeight = 4;
        const waveHeight = Math.sin(timeOffset) * 10 * activeMultiplier;
        const totalHeight = Math.max(baseHeight, Math.abs(waveHeight) + (baseHeight * (activeMultiplier * 2)));

        const x = (i * spacing) + (spacing / 2);
        
        ctx.beginPath();
        ctx.moveTo(x, centerY - totalHeight);
        ctx.lineTo(x, centerY + totalHeight);
        ctx.strokeStyle = color;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [status, volume, isAiSpeaking]);

  return (
    <canvas 
      ref={canvasRef} 
      width={100} 
      height={50} 
      className="w-full h-12"
    />
  );
};
