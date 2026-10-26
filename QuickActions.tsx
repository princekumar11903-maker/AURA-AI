import React from 'react';
import { ShieldCheck, CloudSun, Zap, Trash2, Languages, Activity, Smartphone } from 'lucide-react';
import { LanguageMode } from '../types';

interface QuickActionsProps {
  onRunDiagnostic: () => void;
  onSelectLanguage: (lang: LanguageMode) => void;
  onAskWeather: () => void;
  onAskDeveloper?: () => void;
  onOpenDownloadModal?: () => void;
  onToggleOverdrive: () => void;
  isOverdrive: boolean;
  onClearChat: () => void;
  onTestVoice?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onRunDiagnostic,
  onSelectLanguage,
  onAskWeather,
  onAskDeveloper,
  onOpenDownloadModal,
  onToggleOverdrive,
  isOverdrive,
  onClearChat,
  onTestVoice,
}) => {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-xl p-3 shadow-lg">
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-cyan-500/20 text-xs font-mono-tech text-cyan-400">
        <span className="flex items-center space-x-1.5 font-bold tracking-wider">
          <Activity className="w-3.5 h-3.5" />
          <span>TACTICAL OVERRIDES</span>
        </span>
        <span className="text-[10px] text-emerald-400 font-mono-tech">DEV: PRINCE SHARMA</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
        {/* Real Human Voice Test Button */}
        <button
          onClick={onTestVoice}
          className="flex items-center space-x-1.5 px-2.5 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-200 text-xs font-mono-tech transition-all shadow-sm hover:border-cyan-300 font-bold"
          title="AURA की रियलिस्टिक इंसानी आवाज़ टेस्ट करें"
        >
          <span className="text-sm">🔊</span>
          <span className="truncate">REAL VOICE</span>
        </button>

        {/* Mobile Download Button */}
        <button
          onClick={onOpenDownloadModal}
          className="flex items-center space-x-1.5 px-2.5 py-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-400 text-emerald-300 text-xs font-mono-tech transition-all shadow-sm hover:border-emerald-300 font-bold"
          title="मोबाइल पर डाउनलोड / इंस्टॉल करें"
        >
          <Smartphone className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-pulse" />
          <span className="truncate">APK डाउनलोड</span>
        </button>

        {/* Developer Info Button */}
        <button
          onClick={onAskDeveloper}
          className="flex items-center space-x-2 px-2.5 py-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono-tech transition-all shadow-sm hover:border-emerald-300"
          title="Ask AURA about developer Prince Sharma"
        >
          <span className="text-sm">👨‍💻</span>
          <span className="truncate font-semibold">PRINCE SHARMA</span>
        </button>

        {/* Diagnostic Scan */}
        <button
          onClick={onRunDiagnostic}
          className="flex items-center space-x-2 px-2.5 py-2 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono-tech transition-all shadow-sm hover:border-cyan-400"
        >
          <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="truncate">DIAGNOSTIC</span>
        </button>

        {/* Hindi Mode */}
        <button
          onClick={() => onSelectLanguage('hi')}
          className="flex items-center space-x-2 px-2.5 py-2 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono-tech transition-all shadow-sm hover:border-cyan-400"
        >
          <Languages className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="truncate">हिन्दी MODE</span>
        </button>

        {/* Hinglish Mode */}
        <button
          onClick={() => onSelectLanguage('hinglish')}
          className="flex items-center space-x-2 px-2.5 py-2 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono-tech transition-all shadow-sm hover:border-cyan-400"
        >
          <Languages className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="truncate">HINGLISH</span>
        </button>

        {/* Weather Protocol */}
        <button
          onClick={onAskWeather}
          className="flex items-center space-x-2 px-2.5 py-2 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono-tech transition-all shadow-sm hover:border-cyan-400"
        >
          <CloudSun className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="truncate">WEATHER</span>
        </button>

        {/* Arc Reactor Overdrive */}
        <button
          onClick={onToggleOverdrive}
          className={`flex items-center space-x-2 px-2.5 py-2 rounded-lg border text-xs font-mono-tech transition-all shadow-sm ${
            isOverdrive
              ? 'bg-cyan-500 text-black font-bold border-cyan-300 shadow-[0_0_15px_#00f3ff]'
              : 'bg-cyan-950/40 hover:bg-cyan-900/60 border-cyan-500/30 text-cyan-300 hover:border-cyan-400'
          }`}
        >
          <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="truncate">OVERDRIVE</span>
        </button>

        {/* Clear History */}
        <button
          onClick={onClearChat}
          className="flex items-center space-x-2 px-2.5 py-2 rounded-lg bg-black/50 hover:bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono-tech transition-all shadow-sm hover:border-red-500"
        >
          <Trash2 className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="truncate">PURGE LOG</span>
        </button>
      </div>
    </div>
  );
};
