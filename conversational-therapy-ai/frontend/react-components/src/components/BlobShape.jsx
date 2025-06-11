import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import './BlobShape.css';

const BlobShape = ({ amplitude = 0, pitch = 0, isListening = false }) => {
  // Dynamische Größe basierend auf Amplitude (basierend auf den Spezifikationen)
  const blobSize = useMemo(() => {
    const smallSize = 347.04;  // Small state
    const mediumSize = 386;    // Medium state  
    const largeSize = 482;     // Large state
    
    if (amplitude < 0.3) return smallSize;
    if (amplitude < 0.7) return mediumSize;
    return largeSize;
  }, [amplitude]);

  // "Calmly tuned in" Gradient basierend auf den CSS-Spezifikationen
  const gradientId = `blobGradient-${Math.random().toString(36).substr(2, 9)}`;
  
  // Dynamische Intensität basierend auf Audio-Features
  const intensityFactor = useMemo(() => {
    return 0.5 + (amplitude * 0.5); // 0.5 - 1.0
  }, [amplitude]);

  // Pitch-basierte Farbmodulation
  const colorShift = useMemo(() => {
    return pitch * 30; // 0-30 Grad Hue-Shift
  }, [pitch]);

  // Animation-Varianten für verschiedene Zustände
  const blobVariants = {
    idle: {
      scale: 1,
      opacity: 0.8,
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    },
    listening: {
      scale: 1 + (amplitude * 0.1),
      opacity: 0.9 + (amplitude * 0.1),
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    speaking: {
      scale: 1 + (amplitude * 0.2),
      opacity: 1,
      transition: {
        duration: 0.1,
        ease: "easeOut"
      }
    }
  };

  // Pulsing-Animation für "Listening"-Status
  const pulseVariants = {
    idle: {
      scale: 1,
      opacity: 0.3
    },
    listening: {
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity
      }
    },
    speaking: {
      scale: 1 + (amplitude * 0.15),
      opacity: 0.4 + (amplitude * 0.3),
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  // Bestimme aktuellen Zustand
  const currentState = useMemo(() => {
    if (amplitude > 0.1) return 'speaking';
    if (isListening) return 'listening';
    return 'idle';
  }, [amplitude, isListening]);

  // ViewBox dynamisch anpassen
  const viewBoxSize = 600;
  const center = viewBoxSize / 2;

  return (
    <div className="blob-shape">
      <svg 
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="blob-svg"
        width="100%" 
        height="100%"
      >
        <defs>
          {/* Haupt-Gradient basierend auf "calmly tuned in" Spezifikation */}
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop 
              offset="11.06%" 
              stopColor="#00FFA2" 
              stopOpacity={intensityFactor}
              style={{
                filter: `hue-rotate(${colorShift}deg)`
              }}
            />
            <stop 
              offset="61.54%" 
              stopColor="rgba(68, 140, 255, 0.5)" 
              stopOpacity={intensityFactor * 0.8}
              style={{
                filter: `hue-rotate(${colorShift * 0.5}deg)`
              }}
            />
            <stop 
              offset="100%" 
              stopColor="rgba(255, 187, 148, 0)" 
              stopOpacity="0"
            />
          </radialGradient>

          {/* Glow-Filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Pulse-Filter für Listening-Status */}
          <filter id="pulse" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Pulse Ring für Listening-Status */}
        {isListening && (
          <motion.circle
            cx={center}
            cy={center}
            r={blobSize * 0.7}
            fill="none"
            stroke="#00FFA2"
            strokeWidth="2"
            strokeOpacity="0.6"
            variants={pulseVariants}
            animate={currentState}
            filter="url(#pulse)"
          />
        )}

        {/* Haupt-Blob (Kreis basierend auf den Spezifikationen) */}
        <motion.circle
          cx={center}
          cy={center}
          r={blobSize / 2}
          fill={`url(#${gradientId})`}
          className="blob-main"
          variants={blobVariants}
          animate={currentState}
          filter="url(#glow)"
          initial="idle"
        />

        {/* Inner Highlight für Speaking-Status */}
        {amplitude > 0.1 && (
          <motion.circle
            cx={center}
            cy={center}
            r={blobSize * 0.2}
            fill="#00FFA2"
            opacity={amplitude * 0.6}
            className="blob-inner-highlight"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [amplitude * 0.6, amplitude * 0.8, amplitude * 0.6]
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              repeat: Infinity
            }}
          />
        )}
      </svg>

      {/* Debug-Info (nur in Development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="blob-debug">
          <div>Amplitude: {amplitude.toFixed(3)}</div>
          <div>Pitch: {pitch.toFixed(3)}</div>
          <div>Size: {blobSize.toFixed(0)}px</div>
          <div>Status: {currentState}</div>
          <div>Listening: {isListening ? 'Ja' : 'Nein'}</div>
        </div>
      )}
    </div>
  );
};

export default BlobShape;