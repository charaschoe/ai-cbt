import React, { useRef, useEffect, useState, useCallback } from 'react';
import './OrganicOrbPrototype.css';

const OrganicOrbPrototype = ({
  size = 347.04,
  emotionalState = 'neutral',
  intensity = 1.0,
  showDebug = true,
  className = '',
  ...props
}) => {
  const orbRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  
  // Animation state
  const [animationState, setAnimationState] = useState({
    breathing: { phase: 0, scale: 1 },
    morphing: { phase: 0, borderRadius: '50%' },
    glowing: { phase: 0, intensity: 0.4 }
  });
  
  // Performance monitoring
  const [fps, setFps] = useState(60);
  const frameCountRef = useRef(0);
  const lastFpsUpdateRef = useRef(Date.now());
  
  // Rudolf Steiner Farbzustände
  const colorStates = {
    neutral: {
      primary: 'rgba(0, 255, 161, 0.8)',
      secondary: 'rgba(68, 140, 255, 0.6)',
      tertiary: 'rgba(255, 187, 148, 0.4)',
      name: 'Neutral (Ruhe)'
    },
    freude: {
      primary: 'rgba(255, 220, 100, 0.9)',
      secondary: 'rgba(255, 187, 148, 0.7)',
      tertiary: 'rgba(255, 255, 200, 0.5)',
      name: 'Freude (Wärme)'
    },
    trauer: {
      primary: 'rgba(100, 150, 255, 0.8)',
      secondary: 'rgba(68, 140, 255, 0.9)',
      tertiary: 'rgba(150, 200, 255, 0.6)',
      name: 'Trauer (Kühle)'
    },
    wut: {
      primary: 'rgba(255, 120, 120, 0.9)',
      secondary: 'rgba(255, 80, 80, 0.8)',
      tertiary: 'rgba(200, 100, 100, 0.7)',
      name: 'Wut (Intensität)'
    },
    trauma: {
      primary: 'rgba(180, 80, 80, 1.0)',
      secondary: 'rgba(150, 60, 60, 0.9)',
      tertiary: 'rgba(120, 40, 40, 0.8)',
      name: 'Trauma (Tiefe)'
    }
  };
  
  // Organische Morphing-Variationen
  const morphingVariations = [
    '50%',                    // Perfekter Kreis
    '45% 55% 52% 48%',       // Organische Variation 1
    '52% 48% 45% 55%',       // Organische Variation 2
    '48% 52% 55% 45%',       // Organische Variation 3
    '47% 53% 49% 51%'        // Organische Variation 4
  ];
  
  // Hauptanimationsschleife
  const animate = useCallback(() => {
    if (!orbRef.current) return;
    
    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    
    // Breathing Animation (4 Sekunden Zyklus)
    const breathingPhase = (elapsed % 4000) / 4000;
    const breathingScale = 1 + (Math.sin(breathingPhase * Math.PI * 2) * 0.03 * intensity);
    
    // Organic Morphing (8 Sekunden Zyklus)
    const morphingPhase = (elapsed % 8000) / 8000;
    const morphingIndex = Math.floor(morphingPhase * morphingVariations.length);
    const currentMorphing = morphingVariations[morphingIndex];
    
    // Glow Animation (6 Sekunden Zyklus)
    const glowPhase = (elapsed % 6000) / 6000;
    const glowIntensity = 0.3 + (Math.sin(glowPhase * Math.PI * 2) * 0.15 * intensity);
    
    // Aktueller Farbzustand
    const currentColors = colorStates[emotionalState] || colorStates.neutral;
    
    // DOM-Updates anwenden
    const finalSize = size * breathingScale;
    orbRef.current.style.width = `${finalSize}px`;
    orbRef.current.style.height = `${finalSize}px`;
    orbRef.current.style.borderRadius = currentMorphing;
    orbRef.current.style.background = `radial-gradient(
      50% 50% at 50% 50%,
      ${currentColors.primary} 11%,
      ${currentColors.secondary} 62%,
      ${currentColors.tertiary} 100%
    )`;
    orbRef.current.style.filter = `drop-shadow(0 0 ${20 * glowIntensity}px ${currentColors.primary})`;
    
    // Debug-Informationen aktualisieren
    setAnimationState({
      breathing: { phase: breathingPhase, scale: breathingScale },
      morphing: { phase: morphingPhase, borderRadius: currentMorphing },
      glowing: { phase: glowPhase, intensity: glowIntensity }
    });
    
    // FPS-Monitoring
    frameCountRef.current++;
    if (now - lastFpsUpdateRef.current > 1000) {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
      lastFpsUpdateRef.current = now;
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [size, emotionalState, intensity]);
  
  // Animation starten/stoppen
  useEffect(() => {
    startTimeRef.current = Date.now();
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);
  
  return (
    <div className={`organic-orb-prototype ${className}`} {...props}>
      {/* Hauptorb */}
      <div className="orb-container">
        <div
          ref={orbRef}
          className="organic-orb"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'background 0.8s cubic-bezier(0.4, 0, 0.6, 1)',
            willChange: 'transform, filter, border-radius'
          }}
        />
      </div>
      
      {/* Debug Panel */}
      {showDebug && (
        <div className="debug-panel">
          <h3>🔬 Organische Orb Animation - Prototyp</h3>
          
          <div className="debug-section">
            <h4>📊 Performance</h4>
            <div>FPS: {fps}</div>
            <div>Größe: {size.toFixed(1)}px</div>
            <div>Intensität: {(intensity * 100).toFixed(0)}%</div>
          </div>
          
          <div className="debug-section">
            <h4>🎨 Aktueller Zustand</h4>
            <div>Emotion: {colorStates[emotionalState]?.name}</div>
            <div>Breathing: {(animationState.breathing.phase * 100).toFixed(1)}%</div>
            <div>Morphing: {(animationState.morphing.phase * 100).toFixed(1)}%</div>
            <div>Glow: {(animationState.glowing.intensity * 100).toFixed(1)}%</div>
          </div>
          
          <div className="debug-section">
            <h4>⚙️ Rudolf Steiner Farbsystem</h4>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Primär: {colorStates[emotionalState]?.primary}<br/>
              Sekundär: {colorStates[emotionalState]?.secondary}<br/>
              Tertiär: {colorStates[emotionalState]?.tertiary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganicOrbPrototype;
