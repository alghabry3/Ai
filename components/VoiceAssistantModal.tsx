import React from 'react';
import { useLiveApi } from '../hooks/useLiveApi';
import { AudioVisualizer } from './AudioVisualizer';
import { X, Mic, MicOff, AlertCircle } from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const { status, connect, disconnect, isAiSpeaking, volume } = useLiveApi();

  // Auto-connect when modal opens
  React.useEffect(() => {
    if (isOpen && status === 'disconnected') {
      connect();
    } else if (!isOpen && status !== 'disconnected') {
      disconnect();
    }
  }, [isOpen]); // Intentionally not including status/connect/disconnect to avoid loops, only reacting to isOpen change

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full sm:w-[400px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 pointer-events-auto transform transition-transform duration-300 ease-out animate-in slide-in-from-bottom-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAiSpeaking ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
               <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">مساعد سفرة</h3>
              <p className="text-xs text-slate-500">
                {status === 'connecting' && 'جاري الاتصال...'}
                {status === 'connected' && (isAiSpeaking ? 'يتحدث الآن...' : 'استمع إليك...')}
                {status === 'error' && 'حدث خطأ'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visualizer Area */}
        <div className="bg-slate-50 rounded-xl p-6 mb-6 flex items-center justify-center border border-slate-100 h-32">
           {status === 'error' ? (
             <div className="text-center text-red-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">عذراً، فشل الاتصال</p>
                <button onClick={() => connect()} className="mt-2 text-xs font-semibold underline">إعادة المحاولة</button>
             </div>
           ) : (
             <AudioVisualizer 
                status={status} 
                isAiSpeaking={isAiSpeaking} 
                isUserSpeaking={!isAiSpeaking && volume > 0.1} 
                volume={volume} 
             />
           )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
           {status === 'connected' ? (
             <button 
                onClick={disconnect}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-full font-semibold hover:bg-red-100 transition-colors"
             >
                <MicOff className="w-5 h-5" />
                <span>إنهاء المحادثة</span>
             </button>
           ) : (
             <button 
                onClick={() => connect()}
                disabled={status === 'connecting'}
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
             >
                <Mic className="w-5 h-5" />
                <span>{status === 'connecting' ? 'جاري الاتصال...' : 'بدء المحادثة'}</span>
             </button>
           )}
        </div>
        
        <p className="text-center text-xs text-slate-400 mt-4">
          مدعوم بواسطة Gemini Live Audio
        </p>

      </div>
    </div>
  );
};
