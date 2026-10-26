import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, Sparkles, AlertCircle, RefreshCw, Globe } from 'lucide-react';
import { ChatMessage, LanguageMode, AvatarState } from '../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  avatarState: AvatarState;
  isListening: boolean;
  interimTranscript?: string;
  onToggleListening: () => void;
  micAmplitude: number;
  micFrequencies: Uint8Array;
  onReplayAudio: (message: ChatMessage) => void;
  selectedLanguage: LanguageMode;
  onChangeLanguage: (lang: LanguageMode) => void;
  errorMessage: string | null;
  onClearError: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  avatarState,
  isListening,
  interimTranscript = '',
  onToggleListening,
  micAmplitude,
  micFrequencies,
  onReplayAudio,
  selectedLanguage,
  onChangeLanguage,
  errorMessage,
  onClearError,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, avatarState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || avatarState === 'thinking') return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  // Quick suggestion chips including Hindi developer inquiries
  const quickPrompts = [
    { label: '👨‍💻 Developer: Prince Sharma', text: 'AURA, tumhara developer kaun hai aur tumhe kisne banaya hai?' },
    { label: 'नमस्ते AURA (Hindi)', text: 'नमस्ते AURA, आप कैसी हैं? सब ठीक है ना?' },
    { label: 'सिस्टम स्टेटस', text: 'AURA, सभी सिस्टम्स का स्टेटस रिपोर्ट दीजिए।' },
    { label: 'Mark 85 Protocol', text: 'AURA, Mark 85 armor status check kijiye.' },
  ];

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl">
      {/* Panel Header with Language Selector & Developer info */}
      <div className="px-4 py-2.5 bg-cyan-950/40 border-b border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f3ff]" />
          <h2 className="font-orbitron font-bold text-sm tracking-wider text-cyan-300">
            COMMS HUD // LOG
          </h2>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono-tech bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
            Dev: Prince Sharma
          </span>
        </div>

        {/* Language selector toggle */}
        <div className="flex items-center space-x-1 bg-black/60 p-0.5 rounded-lg border border-cyan-500/30 text-xs font-mono-tech">
          <Globe className="w-3.5 h-3.5 ml-1 text-cyan-400" />
          {(['auto', 'hinglish', 'hi', 'en'] as LanguageMode[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onChangeLanguage(lang)}
              className={`px-2 py-0.5 rounded transition-all uppercase text-[10px] ${
                selectedLanguage === lang
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_8px_rgba(0,243,255,0.8)]'
                  : 'text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/60'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Error notification banner */}
      {errorMessage && (
        <div className="px-3 py-2 bg-red-950/80 border-b border-red-500/50 flex items-center justify-between text-xs text-red-200">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={onClearError}
            className="text-red-400 hover:text-white ml-2 text-sm font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 font-rajdhani">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full border border-cyan-500/40 bg-cyan-950/20 flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-cyan-300/80 font-mono-tech text-xs tracking-wider uppercase">
              Neural Subsystem Initialized. Say or type a directive.
            </p>
            <p className="text-xs text-cyan-600 max-w-xs">
              Supports Hindi, Hinglish, and English voice commands with synchronized holographic lip movement.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} transition-all`}
              >
                <div className="flex items-center space-x-2 mb-1 px-1 text-[10px] font-mono-tech tracking-wider text-cyan-600">
                  <span>{isUser ? 'USER // TACTICAL' : 'AURA // ARTIFICIAL INTELLIGENCE'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed backdrop-blur-md shadow-md ${
                    isUser
                      ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-100 rounded-br-none'
                      : 'bg-black/60 border border-cyan-400/60 text-cyan-200 rounded-bl-none shadow-[0_0_15px_rgba(0,243,255,0.1)]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Audio replay button for model response */}
                  {!isUser && (
                    <div className="mt-2 pt-1 border-t border-cyan-500/20 flex items-center justify-between text-[11px] text-cyan-400">
                      <span className="font-mono-tech text-[9px] opacity-70">
                        VOCAL ENGINE: READY
                      </span>
                      <button
                        onClick={() => onReplayAudio(msg)}
                        className="flex items-center space-x-1 hover:text-cyan-200 transition-colors p-0.5 rounded"
                        title="Vocalize response"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase font-mono-tech">Play</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Animated Thinking State */}
        {avatarState === 'thinking' && (
          <div className="flex flex-col items-start space-y-1">
            <div className="text-[10px] font-mono-tech text-cyan-500 tracking-wider">
              AURA // QUANTUM SYNAPSE
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-400/50 text-cyan-300 text-xs flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="font-mono-tech tracking-widest text-[11px] animate-pulse">
                PROCESSING DIRECTIVE VIA GEMINI...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Real-time Glowing Waveform & Live Spoken Transcript */}
      {isListening && (
        <div className="px-4 py-2.5 bg-gradient-to-r from-cyan-950/80 via-emerald-950/70 to-cyan-950/80 border-t border-cyan-400/50 flex flex-col space-y-1.5 shadow-[0_0_15px_rgba(0,255,196,0.2)]">
          <div className="flex items-center justify-between text-xs font-mono-tech">
            <span className="text-[11px] font-bold text-emerald-400 tracking-wider flex items-center space-x-1.5 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00ffc4]" />
              <span>AURA IS LISTENING // BOLNA SHURU KIJIYE:</span>
            </span>
            <button
              type="button"
              onClick={onToggleListening}
              className="text-[10px] text-red-400 hover:text-red-200 border border-red-500/40 px-2 py-0.5 rounded bg-black/60"
            >
              FINISH & SEND
            </button>
          </div>

          {/* Live Transcript Text (what user is currently saying) */}
          <div className="text-sm font-rajdhani text-cyan-100 italic bg-black/50 p-2 rounded-lg border border-cyan-500/30 min-h-[32px] flex items-center">
            {interimTranscript ? (
              <span className="text-white font-medium not-italic">"{interimTranscript}"</span>
            ) : (
              <span className="text-cyan-500/70">Listening to your voice... say anything in Hindi or English...</span>
            )}
          </div>

          {/* Glowing Animated Waveform */}
          <div className="flex items-center justify-center space-x-1 h-5 pt-1">
            {Array.from({ length: 28 }).map((_, i) => {
              const freqVal = micFrequencies[i] || 0;
              const barHeight = Math.max(3, (freqVal / 255) * 18 + micAmplitude * 8);
              return (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-emerald-400 to-cyan-300 rounded-full transition-all duration-75"
                  style={{
                    height: `${barHeight}px`,
                    boxShadow: '0 0 6px rgba(0, 255, 196, 0.8)',
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Prompts Carousel */}
      <div className="px-3 py-1.5 bg-black/60 border-t border-cyan-500/20 flex items-center space-x-2 overflow-x-auto no-scrollbar">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(q.text)}
            disabled={avatarState === 'thinking'}
            className="flex-shrink-0 px-2.5 py-1 rounded bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-500/30 text-[11px] font-mono-tech text-cyan-400 hover:text-cyan-200 transition-colors"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Input Field & Microphone Action */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-black/70 border-t border-cyan-500/30 flex items-center space-x-2"
      >
        {/* Voice Recognition Microphone Button */}
        <button
          type="button"
          onClick={onToggleListening}
          className={`relative p-2.5 rounded-xl border transition-all flex items-center justify-center ${
            isListening
              ? 'bg-emerald-500 text-black border-emerald-300 shadow-[0_0_20px_#00ffc4] scale-105'
              : 'bg-cyan-950/50 border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/60 hover:text-cyan-200'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice recognition'}
        >
          {isListening ? (
            <MicOff className="w-5 h-5 animate-pulse" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        {/* Text Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? 'Speak now, AURA is listening...'
                : 'Enter directive for AURA (English, Hindi, Hinglish)...'
            }
            disabled={avatarState === 'thinking'}
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-cyan-500/40 text-cyan-100 placeholder-cyan-600/70 text-sm font-rajdhani focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_12px_rgba(0,243,255,0.4)] disabled:opacity-50"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || avatarState === 'thinking'}
          className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-800 disabled:text-gray-600 text-black font-bold transition-all shadow-[0_0_12px_rgba(0,243,255,0.5)] flex items-center justify-center"
          title="Send command"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
