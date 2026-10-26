import React, { useState } from 'react';
import { Cpu, Download, Sparkles, RefreshCw, AlertCircle, Layers } from 'lucide-react';
import { generateAIImage } from '../services/geminiService';

interface ImageForgeProps {
  onSetThinkingState: (isThinking: boolean) => void;
}

export const ImageForge: React.FC<ImageForgeProps> = ({ onSetThinkingState }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    imageUrl: string;
    prompt: string;
    isSchematic?: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { label: 'Arc Reactor Core', text: 'Mark 85 chest arc reactor core blueprint with electromagnetic coils and luminous cyan energy glow' },
    { label: 'Nano-Gauntlet', text: 'Stark nanotech gauntlet with glowing cosmic conduits and vibranium weave' },
    { label: 'Holographic Drone', text: 'Futuristic autonomous Stark surveillance drone with cyan thrusters and sensor array' },
    { label: 'Stark Tower Skyline', text: 'Holographic Stark Tower blueprint at dusk with neon cyan grid overlay' },
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      onSetThinkingState(true);

      const result = await generateAIImage(prompt.trim(), aspectRatio);
      setGeneratedResult(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate visual schematic.');
    } finally {
      setIsLoading(false);
      onSetThinkingState(false);
    }
  };

  const handleDownload = () => {
    if (!generatedResult?.imageUrl) return;
    const a = document.createElement('a');
    a.href = generatedResult.imageUrl;
    a.download = `stark-forge-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col h-full bg-black/50 backdrop-blur-md border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h2 className="font-orbitron font-bold text-sm tracking-wider text-cyan-300">
            HOLOGRAPHIC FORGE // AI SCHEMATICS
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-[10px] font-mono-tech text-cyan-300">
          STARK PROTOCOL
        </span>
      </div>

      {/* Error alert */}
      {error && (
        <div className="px-3 py-2 bg-red-950/80 border border-red-500/50 rounded-lg text-xs text-red-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Generation Viewport / Display */}
      <div className="relative flex-1 min-h-[260px] bg-black/70 rounded-xl border border-cyan-500/40 overflow-hidden flex items-center justify-center p-2">
        {generatedResult ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center group">
            <img
              src={generatedResult.imageUrl}
              alt={generatedResult.prompt}
              className="max-h-[300px] w-auto max-w-full object-contain rounded-lg border border-cyan-400/40 shadow-[0_0_25px_rgba(0,243,255,0.25)]"
            />
            {/* Download and info overlay */}
            <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/80 backdrop-blur-md border border-cyan-500/30 flex items-center justify-between text-xs font-mono-tech">
              <span className="truncate max-w-[200px] text-cyan-300 text-[11px]">
                {generatedResult.prompt}
              </span>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[10px] transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>EXPORT</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="font-orbitron text-xs font-semibold text-cyan-300">
              FORGE COMPILER READY
            </h3>
            <p className="text-[11px] text-cyan-600 max-w-xs font-rajdhani">
              Describe any futuristic equipment, armor upgrade, or Stark blueprint to generate a holographic visualization.
            </p>
          </div>
        )}

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 z-20">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin shadow-[0_0_12px_#00f3ff]" />
            <div className="font-mono-tech text-xs tracking-widest text-cyan-300 animate-pulse">
              CONSTRUCTING HOLOGRAPHIC SCHEMATIC...
            </div>
          </div>
        )}
      </div>

      {/* Preset prompt pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => setPrompt(preset.text)}
            className="flex-shrink-0 px-2.5 py-1 rounded-md bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-[10px] font-mono-tech text-cyan-400 hover:text-cyan-200 transition-all"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Controls Form */}
      <form onSubmit={handleGenerate} className="space-y-2">
        <div className="flex items-center space-x-2">
          {/* Aspect Ratio Selector */}
          <div className="flex bg-black/60 rounded-lg border border-cyan-500/30 p-0.5 text-[10px] font-mono-tech">
            {(['1:1', '16:9', '9:16', '4:3'] as const).map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setAspectRatio(ratio)}
                className={`px-2 py-1 rounded transition-all ${
                  aspectRatio === ratio
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-cyan-400 hover:text-cyan-200'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g. Mark 85 Arc Reactor core with glowing cyan energy..."
              disabled={isLoading}
              className="w-full px-3 py-2 rounded-lg bg-black/50 border border-cyan-500/40 text-cyan-100 placeholder-cyan-600/70 text-xs font-rajdhani focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_10px_rgba(0,243,255,0.4)] disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-800 disabled:text-gray-600 text-black font-bold text-xs font-mono-tech tracking-wider transition-all shadow-[0_0_12px_rgba(0,243,255,0.5)] flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>FORGE</span>
          </button>
        </div>
      </form>
    </div>
  );
};
