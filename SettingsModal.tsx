import React from 'react';
import { X, Sliders, Volume2, Sparkles, Globe, Monitor, Cpu } from 'lucide-react';
import { UserSettings, LanguageMode } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenDownloadModal?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenDownloadModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-gray-950 border border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_35px_rgba(0,243,255,0.3)] space-y-5 font-rajdhani text-cyan-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="font-orbitron font-bold text-base tracking-wider text-cyan-300">
              AURA // SYSTEM CONFIG
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/60 border border-cyan-500/30 hover:bg-cyan-950/60 text-cyan-400 hover:text-cyan-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Creator & Developer Recognition Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/50 via-cyan-950/40 to-black/60 border border-emerald-500/50 shadow-inner">
          <div className="flex items-center space-x-2 text-emerald-300 font-mono-tech text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00ffc4]" />
            <span>LEAD DEVELOPER & ARCHITECT</span>
          </div>
          <div className="text-base font-orbitron font-bold text-white mt-1 text-glow-cyan">
            Prince Sharma
          </div>
          <div className="text-[11px] text-cyan-400/90 font-mono-tech mt-0.5">
            AURA Mark LXXXV Neural Systems Engineer & Creator
          </div>
        </div>

        {/* Mobile App Download Card */}
        {onOpenDownloadModal && (
          <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/40 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold font-mono-tech text-emerald-300 flex items-center space-x-1">
                <span>📲 MOBILE APP DOWNLOAD</span>
              </div>
              <div className="text-[11px] text-cyan-400/80">मोबाइल पर इंस्टॉल करें / लिंक व QR कोड</div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDownloadModal();
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono-tech text-xs transition-all shadow-[0_0_10px_#00ffc4]"
            >
              DOWNLOAD
            </button>
          </div>
        )}

        {/* Setting: Preferred Language */}
        <div className="space-y-2">
          <label className="text-xs font-mono-tech text-cyan-400 tracking-wider flex items-center space-x-1.5">
            <Globe className="w-4 h-4" />
            <span>LINGUISTIC PROTOCOL (HINDI FIRST)</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5 text-xs font-mono-tech">
            {[
              { id: 'hi', label: 'हिन्दी' },
              { id: 'hinglish', label: 'Hinglish' },
              { id: 'auto', label: 'Auto' },
              { id: 'en', label: 'English' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onUpdateSettings({ language: item.id as LanguageMode })}
                className={`py-2 rounded-lg border text-center transition-all ${
                  settings.language === item.id
                    ? 'bg-cyan-500 text-black font-bold border-cyan-300 shadow-[0_0_10px_rgba(0,243,255,0.6)]'
                    : 'bg-black/60 border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-emerald-400/90 font-mono-tech">
            ✓ AURA is optimized to always speak in natural Hindi with realistic voice cadence.
          </p>
        </div>

        {/* Setting: Voice Engine (Realistic Neural vs Local) */}
        <div className="space-y-2">
          <label className="text-xs font-mono-tech text-cyan-400 tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>VOICE REALISM ENGINE</span>
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
            <button
              type="button"
              onClick={() => onUpdateSettings({ voiceEngine: 'neural' })}
              className={`p-2 rounded-lg border text-left transition-all ${
                settings.voiceEngine !== 'browser'
                  ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-[0_0_12px_rgba(0,255,196,0.4)]'
                  : 'bg-black/60 border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/50'
              }`}
            >
              <div className="font-bold flex items-center space-x-1 text-emerald-300">
                <span>★ STUDIO NEURAL (Realistic)</span>
              </div>
              <div className="text-[10px] text-cyan-300/80">Gemini 3.8 Neural Speech</div>
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ voiceEngine: 'browser' })}
              className={`p-2 rounded-lg border text-left transition-all ${
                settings.voiceEngine === 'browser'
                  ? 'bg-cyan-500 text-black font-bold border-cyan-300 shadow-[0_0_10px_rgba(0,243,255,0.6)]'
                  : 'bg-black/60 border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/50'
              }`}
            >
              <div className="font-bold">FAST LOCAL SPEECH</div>
              <div className="text-[10px] opacity-80">Device Web Speech API</div>
            </button>
          </div>
          <p className="text-[11px] text-cyan-400/80">
            Studio Neural uses Gemini's advanced audio model for lifelike human breathing and Hindi pronunciation.
          </p>
        </div>

        {/* Setting: Vocal Synthesis Voice Persona */}
        <div className="space-y-2">
          <label className="text-xs font-mono-tech text-cyan-400 tracking-wider flex items-center space-x-1.5">
            <Volume2 className="w-4 h-4" />
            <span>REALISTIC AI VOICE PERSONA</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-tech">
            {[
              { id: 'Aoede', label: 'Aoede (Studio Human - Best)' },
              { id: 'Kore', label: 'Kore (Warm Female)' },
              { id: 'Zephyr', label: 'Zephyr (Calm Female)' },
              { id: 'Puck', label: 'Puck (Energetic)' },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => onUpdateSettings({ voiceName: v.id })}
                className={`py-2 px-1 rounded-lg border text-center transition-all ${
                  (settings.voiceName || 'Aoede') === v.id
                    ? 'bg-cyan-500 text-black font-bold border-cyan-300 shadow-[0_0_8px_rgba(0,243,255,0.5)]'
                    : 'bg-black/60 border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/50'
                }`}
              >
                <div className="text-[11px] font-bold">{v.id}</div>
                <div className="text-[9px] opacity-80 truncate">{v.label.split(' ')[1] || ''}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Setting: Voice Output Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-cyan-500/30">
          <div>
            <div className="text-sm font-semibold text-cyan-200">Spoken Voice Synthesis</div>
            <div className="text-[11px] text-cyan-600">Vocalize AURA's replies in real-time</div>
          </div>
          <input
            type="checkbox"
            checked={settings.speechOutputEnabled}
            onChange={(e) => onUpdateSettings({ speechOutputEnabled: e.target.checked })}
            className="w-5 h-5 accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Setting: Speech Rate */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono-tech">
            <span>VOCAL CADENCE (SPEECH RATE)</span>
            <span>{settings.speechRate.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.3"
            step="0.05"
            value={settings.speechRate}
            onChange={(e) => onUpdateSettings({ speechRate: parseFloat(e.target.value) })}
            className="w-full accent-cyan-400"
          />
        </div>

        {/* Setting: Holographic Glow Intensity */}
        <div className="space-y-2">
          <label className="text-xs font-mono-tech text-cyan-400 tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4" />
            <span>HOLOGRAPHIC GLOW LUMINESCENCE</span>
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono-tech">
            {(['low', 'med', 'high'] as const).map((glow) => (
              <button
                key={glow}
                type="button"
                onClick={() => onUpdateSettings({ hologramGlow: glow })}
                className={`py-1.5 rounded-lg border uppercase transition-all ${
                  settings.hologramGlow === glow
                    ? 'bg-cyan-500 text-black font-bold border-cyan-300 shadow-[0_0_8px_rgba(0,243,255,0.6)]'
                    : 'bg-black/60 border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/50'
                }`}
              >
                {glow}
              </button>
            ))}
          </div>
        </div>

        {/* Setting: Scanlines */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-cyan-500/30">
          <div className="flex items-center space-x-2">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-sm font-semibold text-cyan-200">CRT Hologram Scanlines</div>
              <div className="text-[11px] text-cyan-600">Cinematic HUD scanline overlay</div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.showScanlines}
            onChange={(e) => onUpdateSettings({ showScanlines: e.target.checked })}
            className="w-5 h-5 accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Model Spec Footer */}
        <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-mono-tech text-cyan-500">
          <span className="flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>CORE: GEMINI 3.8 FLASH</span>
          </span>
          <span>BUILD: 2026.10-MARK85</span>
        </div>
      </div>
    </div>
  );
};
