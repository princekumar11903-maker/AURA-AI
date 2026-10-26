import React, { useEffect, useState } from 'react';
import { Battery, BatteryCharging, Wifi, WifiOff, Volume2, VolumeX, Settings, ShieldAlert, Cpu, Smartphone, Download } from 'lucide-react';
import { BatteryInfo, UserSettings } from '../types';

interface HUDHeaderProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenSettings: () => void;
  onTriggerDiagnostic: () => void;
  onOpenDownloadModal: () => void;
}

export const HUDHeader: React.FC<HUDHeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenSettings,
  onTriggerDiagnostic,
  onOpenDownloadModal,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [battery, setBattery] = useState<BatteryInfo>({
    supported: false,
    level: 100,
    charging: false,
  });

  // Digital clock and date ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCurrentDate(
        now
          .toLocaleDateString('en-US', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
          .toUpperCase()
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Battery status API
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batteryManager: any) => {
        const updateBattery = () => {
          setBattery({
            supported: true,
            level: Math.round(batteryManager.level * 100),
            charging: batteryManager.charging,
          });
        };

        updateBattery();
        batteryManager.addEventListener('levelchange', updateBattery);
        batteryManager.addEventListener('chargingchange', updateBattery);
      }).catch(() => {
        setBattery((prev) => ({ ...prev, supported: false }));
      });
    } else {
      setBattery((prev) => ({ ...prev, supported: false }));
    }
  }, []);

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="relative z-30 w-full px-4 py-2.5 bg-black/60 backdrop-blur-md border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 shadow-lg">
      {/* Top Left: Logo & Model identifier */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-950/50 border border-cyan-400/60 shadow-[0_0_12px_rgba(0,243,255,0.4)]">
          {/* Animated Arc Reactor miniature */}
          <div className="w-5 h-5 rounded-full border border-cyan-400 border-dashed animate-spin-slow flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#00f3ff]" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-orbitron font-extrabold text-base tracking-wider text-cyan-300 text-glow-cyan">
              A.U.R.A.
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-mono-tech rounded bg-cyan-900/60 text-cyan-200 border border-cyan-500/40">
              MARK LXXXV
            </span>
            <span className="hidden md:inline-flex px-1.5 py-0.5 text-[9px] font-mono-tech font-bold rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-[0_0_8px_rgba(0,255,196,0.3)]">
              DEV: PRINCE SHARMA
            </span>
          </div>
          <div className="text-[10px] font-mono-tech text-cyan-400/90 tracking-wider flex items-center space-x-1.5">
            <span className="text-cyan-500/80">Holographic JARVIS</span>
            <span className="text-cyan-600">//</span>
            <span className="text-emerald-400 font-semibold">Dev: Prince Sharma</span>
          </div>
        </div>
      </div>

      {/* Center: Digital Clock & Date Display */}
      <div className="hidden sm:flex items-center space-x-4 px-4 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20">
        <div className="text-center font-mono-tech">
          <div className="text-cyan-400 text-sm font-bold tracking-widest text-glow-cyan flex items-center space-x-1.5">
            <span>{currentTime || '00:00:00'}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div className="text-[9px] text-cyan-600 tracking-wider">
            {currentDate || 'CALCULATING...'}
          </div>
        </div>
      </div>

      {/* Right: Telemetry Badges & Quick Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Battery Telemetry (Only if supported) */}
        {battery.supported ? (
          <div
            className="flex items-center space-x-1.5 px-2 py-1 rounded bg-black/50 border border-cyan-500/30 text-xs font-mono-tech text-cyan-300"
            title={battery.charging ? 'Arc Power Supply: Charging' : `Internal Core: ${battery.level}%`}
          >
            {battery.charging ? (
              <BatteryCharging className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            ) : (
              <Battery className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span>{battery.level}%</span>
          </div>
        ) : (
          <div
            className="hidden md:flex items-center space-x-1 px-2 py-1 rounded bg-black/50 border border-cyan-500/20 text-[10px] font-mono-tech text-cyan-500/60"
            title="External Grid / ARC Reactor Link"
          >
            <Cpu className="w-3 h-3 text-cyan-500/60" />
            <span>GRID: 100%</span>
          </div>
        )}

        {/* Network Status */}
        <div
          className={`flex items-center space-x-1.5 px-2 py-1 rounded border text-xs font-mono-tech ${
            isOnline
              ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
              : 'bg-red-950/60 border-red-500/50 text-red-400'
          }`}
          title={isOnline ? 'Neural Net Connected' : 'Comms Severed'}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xs:inline">ONLINE</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-red-400" />
              <span>OFFLINE</span>
            </>
          )}
        </div>

        {/* Diagnostic Action Trigger */}
        <button
          onClick={onTriggerDiagnostic}
          className="p-1.5 rounded bg-black/60 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/60 hover:text-cyan-200 transition-colors shadow-sm"
          title="Run System Diagnostic"
          aria-label="Diagnostic Scan"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>

        {/* Audio Mute/Unmute toggle */}
        <button
          onClick={() =>
            onUpdateSettings({
              speechOutputEnabled: !settings.speechOutputEnabled,
            })
          }
          className={`p-1.5 rounded border transition-colors shadow-sm ${
            settings.speechOutputEnabled
              ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,243,255,0.3)]'
              : 'bg-black/60 border-gray-700 text-gray-500'
          }`}
          title={settings.speechOutputEnabled ? 'Speech Output: Active' : 'Speech Output: Muted'}
          aria-label="Toggle Voice"
        >
          {settings.speechOutputEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded bg-black/60 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/60 hover:text-cyan-200 transition-colors"
          title="AURA Configuration"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* TOP-RIGHT CORNER: Prominent Mobile Download & Install Button */}
        <button
          onClick={onOpenDownloadModal}
          className="relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-black hover:brightness-110 active:scale-95 transition-all shadow-[0_0_18px_rgba(0,255,196,0.7)] text-xs font-mono-tech font-extrabold tracking-wider border-2 border-emerald-300 cursor-pointer"
          title="Download & Install App on Mobile (फोन में डाउनलोड / इंस्टॉल करें)"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
          </span>
          <Download className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          <span className="hidden md:inline">📥 APK / ऐप डाउनलोड</span>
          <span className="md:hidden">APK डाउनलोड</span>
        </button>
      </div>
    </header>
  );
};
