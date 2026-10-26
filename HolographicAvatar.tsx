import React, { useEffect, useState, useRef } from 'react';
import { AvatarState } from '../types';

interface HolographicAvatarProps {
  state: AvatarState;
  audioAmplitude: number; // 0 to 1 from Web Audio API
  glowIntensity?: 'low' | 'med' | 'high';
  isListening?: boolean;
  onToggleListening?: () => void;
  className?: string;
}

export const HolographicAvatar: React.FC<HolographicAvatarProps> = ({
  state,
  audioAmplitude,
  glowIntensity = 'med',
  isListening = false,
  onToggleListening,
  className = '',
}) => {
  // Smoothly interpolated mouth openness for fluid lip-sync
  const [smoothMouth, setSmoothMouth] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [headTilt, setHeadTilt] = useState({ x: 0, y: 0 });
  const [idleTime, setIdleTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth audio amplitude into mouth movement
  useEffect(() => {
    let animId: number;
    const updateMouth = () => {
      // When not speaking, snap mouth closed
      const targetMouth = state === 'speaking' ? Math.min(1, audioAmplitude * 1.6) : 0;
      setSmoothMouth((prev) => {
        const delta = targetMouth - prev;
        return prev + delta * 0.45;
      });
      animId = requestAnimationFrame(updateMouth);
    };
    animId = requestAnimationFrame(updateMouth);
    return () => cancelAnimationFrame(animId);
  }, [state, audioAmplitude]);

  // Natural blinking cycle with randomized interval
  useEffect(() => {
    let blinkTimer: any;
    const scheduleBlink = () => {
      const nextBlinkDelay = 2600 + Math.random() * 3200; // 2.6s - 5.8s
      blinkTimer = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          // 20% chance of double-blink like natural human
          if (Math.random() < 0.22) {
            setTimeout(() => {
              setIsBlinking(true);
              setTimeout(() => {
                setIsBlinking(false);
                scheduleBlink();
              }, 110);
            }, 120);
          } else {
            scheduleBlink();
          }
        }, 130);
      }, nextBlinkDelay);
    };

    scheduleBlink();
    return () => clearTimeout(blinkTimer);
  }, []);

  // Force a natural blink when state changes from thinking to speaking
  useEffect(() => {
    if (state === 'speaking') {
      setIsBlinking(true);
      const timer = setTimeout(() => setIsBlinking(false), 120);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Subtle breathing and idle drift
  useEffect(() => {
    let frameId: number;
    let t = 0;
    const animateIdle = () => {
      t += 0.035;
      setIdleTime(t);
      frameId = requestAnimationFrame(animateIdle);
    };
    frameId = requestAnimationFrame(animateIdle);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Head tracking response to mouse / touch
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const normX = ((clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 3; // -3 to 3 deg
      const normY = ((clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * 2; // -2 to 2 deg

      setHeadTilt({
        x: Math.max(-4, Math.min(4, normX)),
        y: Math.max(-3, Math.min(3, normY)),
      });
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  // Breathing vertical offset
  const breathY = Math.sin(idleTime * 1.8) * 2.2;
  const reactorPulse = 1 + (Math.sin(idleTime * 2.8) * 0.06) + (state === 'speaking' ? smoothMouth * 0.12 : 0);

  // Theme colors based on state
  const stateColors = {
    idle: {
      primary: '#00f3ff',
      secondary: '#0088ff',
      core: '#ffffff',
      glow: glowIntensity === 'high' ? 'rgba(0, 243, 255, 0.9)' : 'rgba(0, 243, 255, 0.5)',
      ringSpeed: '30s',
    },
    listening: {
      primary: '#00ffc4',
      secondary: '#00c3ff',
      core: '#e6ffff',
      glow: 'rgba(0, 255, 196, 0.8)',
      ringSpeed: '12s',
    },
    thinking: {
      primary: '#38bdf8',
      secondary: '#818cf8',
      core: '#c7d2fe',
      glow: 'rgba(99, 102, 241, 0.85)',
      ringSpeed: '6s',
    },
    speaking: {
      primary: '#00f3ff',
      secondary: '#38bdf8',
      core: '#ffffff',
      glow: 'rgba(0, 243, 255, 0.95)',
      ringSpeed: '16s',
    },
  }[state];

  // Eyebrow offset based on expression state
  const browOffsetY = state === 'thinking' ? 2 : state === 'listening' ? -2.5 : 0;
  const browRotate = state === 'thinking' ? 3 : 0;

  // Mouth dynamic parameters (Lip Sync)
  const mouthH = smoothMouth * 15; // vertical opening
  const mouthW = 28 + smoothMouth * 4; // slight horizontal expansion when speaking
  const lowerLipY = 440 + mouthH;

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{
        perspective: '1000px',
      }}
    >
      {/* Background radial holographic aura */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${stateColors.glow} 0%, rgba(0, 102, 255, 0.08) 45%, transparent 70%)`,
          filter: glowIntensity === 'high' ? 'blur(30px)' : 'blur(20px)',
          opacity: state === 'speaking' ? 0.9 : 0.65,
        }}
      />

      {/* SVG Avatar Canvas */}
      <svg
        viewBox="0 0 600 700"
        className="w-full h-full max-h-[680px] drop-shadow-2xl overflow-visible transition-transform duration-300 ease-out"
        style={{
          transform: `rotateY(${headTilt.x}deg) rotateX(${-headTilt.y}deg)`,
        }}
      >
        <defs>
          {/* Hologram glow filter */}
          <filter id="auraGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="9" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Intense core filter for Arc Reactor */}
          <filter id="reactorGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Cybernetic Skin Gradient */}
          <linearGradient id="cyberskin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#090d16" />
          </linearGradient>

          {/* Armor Gradient */}
          <linearGradient id="armorMetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="30%" stopColor="#0d1b2a" />
            <stop offset="100%" stopColor="#050a12" />
          </linearGradient>

          {/* Arc Reactor Core Radial Gradient */}
          <radialGradient id="arcCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={stateColors.core} />
            <stop offset="40%" stopColor={stateColors.primary} />
            <stop offset="75%" stopColor={stateColors.secondary} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Neon strip gradient */}
          <linearGradient id="neonStrip" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={stateColors.secondary} stopOpacity="0.2" />
            <stop offset="50%" stopColor={stateColors.primary} stopOpacity="1" />
            <stop offset="100%" stopColor={stateColors.secondary} stopOpacity="0.2" />
          </linearGradient>

          {/* Cyber Hair Gradient */}
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0d1f33" />
            <stop offset="50%" stopColor="#06101c" />
            <stop offset="100%" stopColor="#02060b" />
          </linearGradient>

          {/* Eye Iris Gradient */}
          <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor={stateColors.primary} />
            <stop offset="80%" stopColor={stateColors.secondary} />
            <stop offset="100%" stopColor="#051424" />
          </radialGradient>
        </defs>

        {/* ======================================================== */}
        {/* 1. HOLOGRAPHIC SURROUNDING RINGS (Iron Man / HUD Style) */}
        {/* ======================================================== */}
        <g id="hologram-rings" className="pointer-events-none">
          {/* Outer Gyroscope Ring */}
          <circle
            cx="300"
            cy="360"
            r="280"
            fill="none"
            stroke={stateColors.primary}
            strokeWidth="1.2"
            strokeDasharray="16 12 4 12"
            opacity="0.35"
            style={{
              transformOrigin: '300px 360px',
              animation: `spin-slow ${stateColors.ringSpeed} linear infinite`,
            }}
          />

          {/* Segmented Ring with Telemetry Ticks */}
          <circle
            cx="300"
            cy="360"
            r="260"
            fill="none"
            stroke={stateColors.secondary}
            strokeWidth="2.5"
            strokeDasharray="4 28"
            opacity="0.5"
            style={{
              transformOrigin: '300px 360px',
              animation: `spin-reverse-slow ${stateColors.ringSpeed} linear infinite`,
            }}
          />

          {/* Fine HUD Target Ring */}
          <circle
            cx="300"
            cy="360"
            r="230"
            fill="none"
            stroke={stateColors.primary}
            strokeWidth="0.8"
            strokeDasharray="40 10 10 10"
            opacity="0.4"
          />

          {/* Floating HUD Angle Markers */}
          <g opacity="0.6" stroke={stateColors.primary} strokeWidth="1">
            <line x1="300" y1="75" x2="300" y2="85" />
            <line x1="300" y1="635" x2="300" y2="645" />
            <line x1="20" y1="360" x2="30" y2="360" />
            <line x1="570" y1="360" x2="580" y2="360" />
          </g>

          {/* Telemetry Readouts around avatar */}
          <text x="70" y="210" fill={stateColors.primary} fontSize="9" fontFamily="monospace" letterSpacing="2" opacity="0.75">
            AURA // CORE: ACTIVE
          </text>
          <text x="70" y="224" fill={stateColors.secondary} fontSize="8" fontFamily="monospace" letterSpacing="1" opacity="0.6">
            FREQ: 432.84 MHZ
          </text>
          <text x="440" y="210" fill={stateColors.primary} fontSize="9" fontFamily="monospace" letterSpacing="2" opacity="0.75">
            NEURAL SYNC: 100%
          </text>
          <text x="440" y="224" fill={stateColors.secondary} fontSize="8" fontFamily="monospace" letterSpacing="1" opacity="0.6">
            STATE: {state.toUpperCase()}
          </text>
        </g>

        {/* ======================================================== */}
        {/* 2. BODY, SHOULDERS & DARK ARMOR (Iron Man Inspired) */}
        {/* ======================================================== */}
        <g id="armor-and-torso" style={{ transform: `translateY(${breathY}px)` }}>
          {/* Base Torso & Cybernetic Suit */}
          <path
            d="M 170 700 L 190 540 Q 220 500 250 490 L 350 490 Q 380 500 410 540 L 430 700 Z"
            fill="url(#armorMetal)"
            stroke="#1e3a5f"
            strokeWidth="2"
          />

          {/* Shoulder Armor Pauldrons (Left & Right) */}
          <path
            d="M 80 700 L 120 560 L 210 515 L 240 550 L 190 700 Z"
            fill="#091422"
            stroke={stateColors.secondary}
            strokeWidth="1.5"
            opacity="0.9"
          />
          <path
            d="M 520 700 L 480 560 L 390 515 L 360 550 L 410 700 Z"
            fill="#091422"
            stroke={stateColors.secondary}
            strokeWidth="1.5"
            opacity="0.9"
          />

          {/* Collarbones & Armor Bevels */}
          <path
            d="M 230 520 Q 300 550 370 520 L 360 500 Q 300 525 240 500 Z"
            fill="#0f2438"
            stroke={stateColors.primary}
            strokeWidth="1"
            opacity="0.8"
          />

          {/* Luminous Armor Seams (Glowing Cyan Accents) */}
          <path
            d="M 190 550 L 250 590 L 250 670"
            fill="none"
            stroke={stateColors.primary}
            strokeWidth="2"
            filter="url(#auraGlow)"
            opacity="0.85"
          />
          <path
            d="M 410 550 L 350 590 L 350 670"
            fill="none"
            stroke={stateColors.primary}
            strokeWidth="2"
            filter="url(#auraGlow)"
            opacity="0.85"
          />
          <path
            d="M 210 515 L 250 490"
            fill="none"
            stroke={stateColors.primary}
            strokeWidth="1.5"
            opacity="0.7"
          />
          <path
            d="M 390 515 L 350 490"
            fill="none"
            stroke={stateColors.primary}
            strokeWidth="1.5"
            opacity="0.7"
          />

          {/* ======================================================== */}
          {/* 3. CHEST ARC REACTOR WITH FUTURISTIC MICROPHONE ICON */}
          {/* ======================================================== */}
          <g
            id="arc-reactor"
            transform="translate(300, 595)"
            onClick={onToggleListening}
            className="cursor-pointer group"
            style={{ pointerEvents: 'all' }}
            role="button"
            tabIndex={0}
            aria-label={isListening ? "Stop listening" : "Start voice listening"}
          >
            {/* Listening Soundwave Expansion Rings */}
            {isListening && (
              <>
                <circle
                  cx="0"
                  cy="0"
                  r="56"
                  fill="none"
                  stroke="#00ffc4"
                  strokeWidth="1.5"
                  className="animate-ping"
                  opacity="0.6"
                  style={{ transformOrigin: '0px 0px' }}
                />
                <circle
                  cx="0"
                  cy="0"
                  r="68"
                  fill="none"
                  stroke="#00f3ff"
                  strokeWidth="1"
                  opacity="0.35"
                />
              </>
            )}

            {/* Outer Reactor Housing Ring */}
            <circle
              cx="0"
              cy="0"
              r="48"
              fill={isListening ? "#031416" : "#030811"}
              stroke={isListening ? "#00ffc4" : "#172e48"}
              strokeWidth="4"
              className="transition-colors duration-300"
            />
            <circle
              cx="0"
              cy="0"
              r="44"
              fill="none"
              stroke={isListening ? "#00ffc4" : stateColors.secondary}
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.8"
              style={{
                transformOrigin: '0px 0px',
                animation: isListening ? 'spin-slow 6s linear infinite' : 'spin-slow 20s linear infinite',
              }}
            />

            {/* Reactor 10 Electromagnetic Copper/Cyan Coils */}
            {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, idx) => (
              <line
                key={idx}
                x1="0"
                y1="-44"
                x2="0"
                y2="-32"
                stroke={isListening ? "#00ffc4" : stateColors.primary}
                strokeWidth="2.5"
                transform={`rotate(${angle})`}
                filter="url(#auraGlow)"
                opacity="0.95"
              />
            ))}

            {/* Inner Glowing Reactor Ring */}
            <circle
              cx="0"
              cy="0"
              r="30"
              fill={isListening ? "#062224" : "none"}
              stroke={isListening ? "#00ffc4" : stateColors.primary}
              strokeWidth="3"
              filter="url(#auraGlow)"
              opacity="0.95"
            />
            <circle
              cx="0"
              cy="0"
              r="22"
              fill="none"
              stroke={isListening ? "#ffffff" : "#ffffff"}
              strokeWidth="1.5"
              opacity="0.85"
            />

            {/* Luminous Reactor Core Background */}
            <circle
              cx="0"
              cy="0"
              r="20"
              fill={isListening ? "#022a27" : "#041624"}
              filter="url(#reactorGlow)"
              style={{
                transform: `scale(${isListening ? 1.15 : reactorPulse})`,
                transformOrigin: '0px 0px',
                transition: 'transform 0.08s ease-out',
              }}
            />

            {/* ======================================================== */}
            {/* FUTURISTIC NEON MICROPHONE ICON IN CHEST REACTOR CORE */}
            {/* ======================================================== */}
            <g
              id="chest-mic-icon"
              filter="url(#auraGlow)"
              className="transition-transform duration-200 group-hover:scale-110"
              style={{ transformOrigin: '0px 0px' }}
            >
              {/* Mic Capsule */}
              <rect
                x="-4.5"
                y="-11"
                width="9"
                height="14"
                rx="4.5"
                fill={isListening ? "#00ffc4" : "#00f3ff"}
              />
              {/* Mic Inner Grille Lines */}
              <line x1="-3" y1="-7" x2="3" y2="-7" stroke="#001824" strokeWidth="1" />
              <line x1="-3" y1="-4" x2="3" y2="-4" stroke="#001824" strokeWidth="1" />
              <line x1="-3" y1="-1" x2="3" y2="-1" stroke="#001824" strokeWidth="1" />

              {/* Mic U-bracket */}
              <path
                d="M -7.5 -3 C -7.5 5 7.5 5 7.5 -3"
                fill="none"
                stroke={isListening ? "#ffffff" : "#00f3ff"}
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Mic Stem & Base Stand */}
              <line
                x1="0"
                y1="5"
                x2="0"
                y2="9.5"
                stroke={isListening ? "#ffffff" : "#00f3ff"}
                strokeWidth="2"
              />
              <line
                x1="-5"
                y1="9.5"
                x2="5"
                y2="9.5"
                stroke={isListening ? "#ffffff" : "#00f3ff"}
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Acoustic Soundwave Wings */}
              <path
                d="M -11 -6 C -13.5 -1.5 -13.5 2.5 -11 7"
                fill="none"
                stroke={isListening ? "#00ffc4" : "#00f3ff"}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity={isListening ? "1" : "0.5"}
              />
              <path
                d="M 11 -6 C 13.5 -1.5 13.5 2.5 11 7"
                fill="none"
                stroke={isListening ? "#00ffc4" : "#00f3ff"}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity={isListening ? "1" : "0.5"}
              />
            </g>

            {/* Micro label underneath chest reactor */}
            <text
              x="0"
              y="38"
              fill={isListening ? "#00ffc4" : "#00f3ff"}
              fontSize="7"
              fontFamily="monospace"
              fontWeight="bold"
              letterSpacing="1.5"
              textAnchor="middle"
              opacity="0.9"
            >
              {isListening ? "● LISTENING..." : "TAP MIC TO SPEAK"}
            </text>
          </g>

          {/* ======================================================== */}
          {/* 4. CYBERNETIC NECK */}
          {/* ======================================================== */}
          <g id="neck">
            <path
              d="M 270 450 L 265 500 Q 300 515 335 500 L 330 450 Z"
              fill="#0b1726"
              stroke="#1b3552"
              strokeWidth="1.5"
            />
            {/* Neck Fiber Optic Circuits */}
            <line x1="288" y1="455" x2="284" y2="495" stroke={stateColors.primary} strokeWidth="1.5" opacity="0.75" />
            <line x1="300" y1="458" x2="300" y2="502" stroke={stateColors.secondary} strokeWidth="1.5" opacity="0.6" />
            <line x1="312" y1="455" x2="316" y2="495" stroke={stateColors.primary} strokeWidth="1.5" opacity="0.75" />
          </g>
        </g>

        {/* ======================================================== */}
        {/* 5. HEAD & FEMALE FACE (Recognizable Eyes, Nose, Mouth) */}
        {/* ======================================================== */}
        <g
          id="head-group"
          style={{
            transform: `translate(${headTilt.x * 1.5}px, ${breathY * 0.7 + headTilt.y}px)`,
            transformOrigin: '300px 380px',
          }}
        >
          {/* Back Hair Silhouette */}
          <path
            d="M 210 260 C 180 340 180 430 205 480 C 220 500 240 510 250 510 C 240 450 240 370 250 320 Z"
            fill="url(#hairGrad)"
            opacity="0.9"
          />
          <path
            d="M 390 260 C 420 340 420 430 395 480 C 380 500 360 510 350 510 C 360 450 360 370 350 320 Z"
            fill="url(#hairGrad)"
            opacity="0.9"
          />

          {/* Cybernetic Headset / Ear Nodes (Left & Right) */}
          <g id="ear-nodes">
            {/* Left Ear Com-node */}
            <rect x="210" y="325" width="14" height="34" rx="4" fill="#09182a" stroke={stateColors.primary} strokeWidth="1.5" />
            <line x1="217" y1="332" x2="217" y2="352" stroke={stateColors.primary} strokeWidth="2" filter="url(#auraGlow)" />
            {/* Right Ear Com-node */}
            <rect x="376" y="325" width="14" height="34" rx="4" fill="#09182a" stroke={stateColors.primary} strokeWidth="1.5" />
            <line x1="383" y1="332" x2="383" y2="352" stroke={stateColors.primary} strokeWidth="2" filter="url(#auraGlow)" />
          </g>

          {/* Female Face Shape / Jawline */}
          <path
            d="M 224 280 C 224 200 376 200 376 280 C 376 345 365 400 330 445 C 315 462 285 462 270 445 C 235 400 224 345 224 280 Z"
            fill="url(#cyberskin)"
            stroke="#1b3a5c"
            strokeWidth="1.5"
          />

          {/* Cheekbone & Chin Holographic Accents */}
          <path
            d="M 238 340 Q 255 365 272 385"
            fill="none"
            stroke={stateColors.primary}
            strokeWidth="0.8"
            opacity="0.35"
          />
          <path
            d="M 362 340 Q 345 365 328 385"
            fill="none"
            stroke={stateColors.primary}
            strokeWidth="0.8"
            opacity="0.35"
          />
          {/* Chin subtle contour plate */}
          <path
            d="M 284 442 Q 300 448 316 442"
            fill="none"
            stroke={stateColors.primary}
            strokeWidth="1"
            opacity="0.5"
          />

          {/* ======================================================== */}
          {/* 6. NOSE */}
          {/* ======================================================== */}
          <g id="nose">
            {/* Subtle nose bridge shadow & light highlight */}
            <path
              d="M 298 335 L 297 385 L 293 392 Q 300 395 307 392 L 303 385"
              fill="none"
              stroke="#224263"
              strokeWidth="1.2"
            />
            {/* Gentle cyan nose tip highlight */}
            <circle cx="300" cy="388" r="1.5" fill={stateColors.primary} opacity="0.6" filter="url(#auraGlow)" />
            {/* Nostril contours */}
            <path d="M 291 392 Q 295 394 298 393" fill="none" stroke="#122538" strokeWidth="1" />
            <path d="M 309 392 Q 305 394 302 393" fill="none" stroke="#122538" strokeWidth="1" />
          </g>

          {/* ======================================================== */}
          {/* 7. EYEBROWS (State-reactive angle & subtle elevation) */}
          {/* ======================================================== */}
          <g id="eyebrows" style={{ transform: `translateY(${browOffsetY}px)` }}>
            {/* Left Eyebrow */}
            <path
              d="M 248 296 Q 268 288 286 295"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.4"
              strokeLinecap="round"
              transform={`rotate(${browRotate} 267 292)`}
              opacity="0.85"
            />
            {/* Right Eyebrow */}
            <path
              d="M 314 295 Q 332 288 352 296"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.4"
              strokeLinecap="round"
              transform={`rotate(${-browRotate} 333 292)`}
              opacity="0.85"
            />
          </g>

          {/* ======================================================== */}
          {/* 8. EYES (Natural Blinking, Cyan Cyber Iris, Sclera) */}
          {/* ======================================================== */}
          <g id="eyes">
            {/* Left Eye Socket Background */}
            <path d="M 246 318 Q 268 305 288 318 Q 268 330 246 318 Z" fill="#061220" />
            {/* Right Eye Socket Background */}
            <path d="M 312 318 Q 332 305 354 318 Q 332 330 312 318 Z" fill="#061220" />

            {/* Left Eyeball Clip Container */}
            <g clipPath="url(#leftEyeClip)">
              <clipPath id="leftEyeClip">
                <path d="M 246 318 Q 268 305 288 318 Q 268 330 246 318 Z" />
              </clipPath>
              {/* Sclera */}
              <ellipse cx="267" cy="318" rx="20" ry="11" fill="#0a2238" />
              {/* Glowing Iris */}
              <circle cx="268" cy="318" r="7.5" fill="url(#irisGrad)" filter="url(#auraGlow)" />
              {/* Concentric Pupil Ring */}
              <circle cx="268" cy="318" r="3.2" fill="#030811" />
              <circle cx="268" cy="318" r="1.5" fill="#ffffff" />
            </g>

            {/* Right Eyeball Clip Container */}
            <g clipPath="url(#rightEyeClip)">
              <clipPath id="rightEyeClip">
                <path d="M 312 318 Q 332 305 354 318 Q 332 330 312 318 Z" />
              </clipPath>
              {/* Sclera */}
              <ellipse cx="333" cy="318" rx="20" ry="11" fill="#0a2238" />
              {/* Glowing Iris */}
              <circle cx="332" cy="318" r="7.5" fill="url(#irisGrad)" filter="url(#auraGlow)" />
              {/* Concentric Pupil Ring */}
              <circle cx="332" cy="318" r="3.2" fill="#030811" />
              <circle cx="332" cy="318" r="1.5" fill="#ffffff" />
            </g>

            {/* Eyelash & Cybernetic Eyeliner Frame */}
            <path
              d="M 244 318 Q 268 303 290 317"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M 310 317 Q 332 303 356 318"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Eyelids for Natural Blinking (Smoothly Closes when isBlinking is true) */}
            <g
              id="eyelids-overlay"
              style={{
                transition: 'transform 0.09s ease-in-out',
                transformOrigin: '300px 318px',
                transform: isBlinking ? 'scaleY(1)' : 'scaleY(0)',
              }}
            >
              {/* Left Eyelid */}
              <path
                d="M 244 306 Q 268 303 290 306 L 290 328 Q 268 332 244 328 Z"
                fill="#0f172a"
                stroke="#0284c7"
                strokeWidth="1.2"
              />
              {/* Right Eyelid */}
              <path
                d="M 310 306 Q 332 303 356 306 L 356 328 Q 332 332 310 328 Z"
                fill="#0f172a"
                stroke="#0284c7"
                strokeWidth="1.2"
              />
            </g>
          </g>

          {/* ======================================================== */}
          {/* 9. MOUTH & LIPS (Synchronized with Speech & Web Audio) */}
          {/* ======================================================== */}
          <g id="mouth">
            {/* Open Mouth Interior (Renders dynamically when speaking) */}
            {smoothMouth > 0.05 ? (
              <path
                d={`M ${300 - mouthW / 2} 425 Q 300 ${425 + mouthH * 1.3} ${300 + mouthW / 2} 425 Q 300 ${425 - mouthH * 0.4} ${300 - mouthW / 2} 425 Z`}
                fill="#040b14"
                stroke={stateColors.primary}
                strokeWidth="1.5"
                filter="url(#auraGlow)"
              />
            ) : null}

            {/* Inside Mouth Soft Light Pulse */}
            {smoothMouth > 0.15 ? (
              <ellipse
                cx="300"
                cy={425 + mouthH * 0.4}
                rx={mouthW * 0.3}
                ry={mouthH * 0.45}
                fill={stateColors.primary}
                opacity="0.3"
                filter="url(#auraGlow)"
              />
            ) : null}

            {/* Upper Lip with Cupid's Bow */}
            <path
              d={`M ${300 - mouthW / 2} 425 Q 290 422 296 420 Q 300 423 304 420 Q 310 422 ${300 + mouthW / 2} 425`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Lower Lip (Moves downward with speech amplitude) */}
            <path
              d={`M ${300 - mouthW / 2} 425 Q 300 ${lowerLipY} ${300 + mouthW / 2} 425`}
              fill="none"
              stroke="#0284c7"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Subtle smile creases at mouth corners when idle */}
            {smoothMouth < 0.1 ? (
              <>
                <path d="M 284 425 Q 282 423 280 424" stroke="#00f3ff" strokeWidth="0.8" opacity="0.4" />
                <path d="M 316 425 Q 318 423 320 424" stroke="#00f3ff" strokeWidth="0.8" opacity="0.4" />
              </>
            ) : null}
          </g>

          {/* ======================================================== */}
          {/* 10. FUTURISTIC CYBERNETIC HAIR & FOREHEAD VISOR */}
          {/* ======================================================== */}
          <g id="hair-and-headgear">
            {/* Forehead Holographic Interface Crown / Diadem */}
            <path
              d="M 245 238 L 290 248 L 300 252 L 310 248 L 355 238"
              fill="none"
              stroke={stateColors.primary}
              strokeWidth="2"
              filter="url(#auraGlow)"
              opacity="0.8"
            />
            <circle cx="300" cy="252" r="3" fill="#ffffff" filter="url(#auraGlow)" />

            {/* Front Cybernetic Hair Locks */}
            <path
              d="M 224 275 C 220 220 260 180 300 180 C 340 180 380 220 376 275 C 365 240 340 220 300 220 C 260 220 235 240 224 275 Z"
              fill="url(#hairGrad)"
              stroke="#132c48"
              strokeWidth="1.5"
            />

            {/* Luminous Neon Hair Highlight Strands */}
            <path
              d="M 250 200 Q 230 250 228 320"
              fill="none"
              stroke={stateColors.primary}
              strokeWidth="1.8"
              filter="url(#auraGlow)"
              opacity="0.75"
            />
            <path
              d="M 350 200 Q 370 250 372 320"
              fill="none"
              stroke={stateColors.primary}
              strokeWidth="1.8"
              filter="url(#auraGlow)"
              opacity="0.75"
            />
            <path
              d="M 270 190 Q 255 230 248 290"
              fill="none"
              stroke={stateColors.secondary}
              strokeWidth="1.2"
              opacity="0.6"
            />
            <path
              d="M 330 190 Q 345 230 352 290"
              fill="none"
              stroke={stateColors.secondary}
              strokeWidth="1.2"
              opacity="0.6"
            />
          </g>

          {/* ======================================================== */}
          {/* 11. HOLOGRAPHIC SCANNING BEAM & PARTICLES */}
          {/* ======================================================== */}
          {state === 'thinking' ? (
            <g id="thinking-scan-beam" className="pointer-events-none">
              <line
                x1="220"
                y1={260 + (Math.sin(idleTime * 6) * 120 + 120)}
                x2="380"
                y2={260 + (Math.sin(idleTime * 6) * 120 + 120)}
                stroke="#60a5fa"
                strokeWidth="2.5"
                filter="url(#auraGlow)"
                opacity="0.75"
              />
              <text x="300" y="215" fill="#93c5fd" fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="3" opacity="0.9">
                SYNAPSE PROCESSING...
              </text>
            </g>
          ) : null}

          {state === 'listening' ? (
            <g id="listening-audio-waves" className="pointer-events-none">
              {/* Concentric voice detection waves around ear coms */}
              <circle cx="217" cy="342" r={16 + Math.sin(idleTime * 8) * 8} fill="none" stroke="#00ffc4" strokeWidth="1.2" opacity="0.6" />
              <circle cx="383" cy="342" r={16 + Math.sin(idleTime * 8) * 8} fill="none" stroke="#00ffc4" strokeWidth="1.2" opacity="0.6" />
              <text x="300" y="215" fill="#00ffc4" fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="3" opacity="0.9">
                AURAL SENSORS ACTIVE
              </text>
            </g>
          ) : null}
        </g>
      </svg>

      {/* Floating State Badge underneath avatar */}
      <div className="absolute bottom-1 px-4 py-1.5 rounded-full bg-black/70 border border-cyan-500/40 backdrop-blur-md flex items-center space-x-2 text-xs font-mono-tech tracking-widest text-cyan-300 shadow-lg">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: stateColors.primary,
            boxShadow: `0 0 8px ${stateColors.primary}`,
          }}
        />
        <span className="uppercase">{state}</span>
        {state === 'speaking' && (
          <span className="text-[10px] text-cyan-400 font-bold opacity-80 animate-pulse">
            [{Math.round(smoothMouth * 100)}% AMPLITUDE]
          </span>
        )}
      </div>
    </div>
  );
};
