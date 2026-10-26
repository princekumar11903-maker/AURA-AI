import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Scan, AlertCircle, RefreshCw, Eye } from 'lucide-react';
import { analyzeVisionSnapshot } from '../services/geminiService';

interface VisionHUDProps {
  onAnalysisResult: (text: string) => void;
  onSetThinkingState: (isThinking: boolean) => void;
}

export const VisionHUD: React.FC<VisionHUDProps> = ({
  onAnalysisResult,
  onSetThinkingState,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'cyan' | 'matrix' | 'normal'>('cyan');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      setStream(mediaStream);
      setIsActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please grant access in your browser settings.');
      } else {
        setError(`Failed to activate camera feed: ${err.message || err}`);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsActive(false);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || isScanning) return;

    try {
      setIsScanning(true);
      onSetThinkingState(true);
      setError(null);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas rendering fault');

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      const result = await analyzeVisionSnapshot(
        dataUrl,
        'Perform a Stark tactical scan of this camera feed. Identify subjects, environment, biometric observations, and tactical readiness. Keep it sharp and in AURA persona.'
      );

      setAnalysisText(result);
      onAnalysisResult(result);
    } catch (err: any) {
      setError(err?.message || 'Vision scan analysis failed.');
    } finally {
      setIsScanning(false);
      onSetThinkingState(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/50 backdrop-blur-md border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <h2 className="font-orbitron font-bold text-sm tracking-wider text-cyan-300">
            STARK VISION // HUD FEED
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          {isActive && (
            <div className="flex space-x-1 text-[10px] font-mono-tech">
              {(['cyan', 'matrix', 'normal'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-2 py-0.5 rounded uppercase border ${
                    filterMode === mode
                      ? 'bg-cyan-500 text-black border-cyan-300 font-bold'
                      : 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={isActive ? stopCamera : startCamera}
            className={`px-3 py-1 rounded-lg text-xs font-mono-tech flex items-center space-x-1.5 transition-all ${
              isActive
                ? 'bg-red-950/60 border border-red-500/50 text-red-300 hover:bg-red-900/80'
                : 'bg-cyan-500 text-black font-bold hover:bg-cyan-400 shadow-[0_0_12px_rgba(0,243,255,0.4)]'
            }`}
          >
            {isActive ? (
              <>
                <CameraOff className="w-3.5 h-3.5" />
                <span>DEACTIVATE</span>
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5" />
                <span>LINK CAMERA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="px-3 py-2 bg-red-950/80 border border-red-500/50 rounded-lg text-xs text-red-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Video Viewport with HUD Overlay */}
      <div className="relative flex-1 min-h-[260px] bg-black/80 rounded-xl border border-cyan-500/40 overflow-hidden flex items-center justify-center">
        {isActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-all ${
                filterMode === 'cyan'
                  ? 'brightness-110 contrast-125 hue-rotate-180 saturate-150'
                  : filterMode === 'matrix'
                  ? 'brightness-90 contrast-150 grayscale sepia hue-rotate-50'
                  : ''
              }`}
            />

            {/* Iron Man HUD Graphical Overlay */}
            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
              {/* Corner brackets */}
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_8px_#00f3ff]" />
                <div className="w-8 h-8 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_8px_#00f3ff]" />
              </div>

              {/* Central Target Reticle */}
              <div className="self-center flex flex-col items-center">
                <div className="relative w-28 h-28 rounded-full border border-cyan-400/60 border-dashed animate-spin-slow flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-cyan-300 opacity-70" />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f3ff]" />
                </div>
                <div className="mt-2 text-[10px] font-mono-tech text-cyan-300 tracking-widest bg-black/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  TARGET LOCK: 98.4%
                </div>
              </div>

              {/* Bottom brackets */}
              <div className="flex justify-between items-end">
                <div className="w-8 h-8 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_8px_#00f3ff]" />
                <div className="text-[10px] font-mono-tech text-cyan-400/80 bg-black/70 px-2 py-1 rounded border border-cyan-500/30">
                  ISO: AUTO // FPS: 60 // SPECTRUM: {filterMode.toUpperCase()}
                </div>
                <div className="w-8 h-8 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_8px_#00f3ff]" />
              </div>
            </div>

            {/* Scanning beam animation */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent h-16 w-full animate-hud-scan border-b border-cyan-300" />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-center">
              <Camera className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="font-orbitron text-sm font-semibold text-cyan-300">
              OPTICAL SENSOR OFFLINE
            </h3>
            <p className="text-xs text-cyan-600 max-w-xs font-rajdhani">
              Enable your camera to project a holographic tactical HUD and have AURA analyze your environment.
            </p>
            <button
              onClick={startCamera}
              className="mt-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono-tech tracking-wider shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all"
            >
              INITIALIZE OPTICS
            </button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Action Controls & Analysis Feedback */}
      {isActive && (
        <div className="flex flex-col space-y-2">
          <button
            onClick={captureAndAnalyze}
            disabled={isScanning}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-800 disabled:text-gray-500 text-black font-bold text-xs font-mono-tech tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>ANALYZING TACTICAL SCAN WITH GEMINI...</span>
              </>
            ) : (
              <>
                <Scan className="w-4 h-4" />
                <span>TRIGGER TACTICAL RECON SCAN</span>
              </>
            )}
          </button>

          {analysisText && (
            <div className="p-3 rounded-lg bg-black/60 border border-cyan-500/30 text-xs font-rajdhani text-cyan-200 max-h-28 overflow-y-auto">
              <div className="font-mono-tech text-[10px] text-cyan-400 tracking-wider mb-1 font-bold">
                RECON REPORT:
              </div>
              <p>{analysisText}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
