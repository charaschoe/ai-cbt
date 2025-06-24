/**
 * UniversalOrbAnimation - Hauptkomponente
 * Universelle organische Orb-Animation für alle Screens
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import animationStateManager from '../services/animationStateManager.js';
import emotionStateManager from '../services/emotionStateManager.js';
import performanceManager from '../services/performanceManager.js';
import steinerColorSystem from '../services/steinerColorSystem.js';
import './UniversalOrbAnimation.css';

const UniversalOrbAnimation = ({
  // Modus-Konfiguration
  mode = 'base',                          // 'base', 'audio', 'text', 'emotional', 'ambient'
  
  // Basis-Eigenschaften
  baseSize = 347.04,                      // Standard-Größe in px
  className = '',
  style = {},
  
  // Audio-Modus Props
  audioData = null,                       // { amplitude, frequency, rhythm, spectrum }
  
  // Text-Modus Props
  emotionalState = 'neutral',             // 'neutral', 'freude', 'trauer', 'wut', 'trauma'
  urgencyLevel = 0.5,                     // 0-1, Dringlichkeit
  textInput = '',                         // Aktueller Text für Analyse
  sentimentScore = 0,                     // -1 bis 1, Sentiment
  
  // Emotional/Ambient-Modus Props
  taskType = null,
  emotionalContext = null,
  ambientData = null,
  
  // Gemeinsame Eigenschaften
  intensity = 1.0,                        // 0.1-3.0, Animation-Intensität
  steinerState = null,                    // Override für Rudolf Steiner Farbzustand
  isVisible = true,                       // Sichtbarkeit
  
  // Performance
  targetFPS = null,                       // null = automatisch
  enableDebug = false,                    // Debug-Informationen
  
  // Callbacks
  onAnimationFrame = null,
  onStateChange = null,
  onPerformanceUpdate = null,
  onDebugUpdate = null,                   // Neue Callback für Debug-Daten
  
  // Event Handlers
  onClick = null,
  onHover = null,
  
  ...otherProps
}) => {
  const orbRef = useRef(null);
  const containerRef = useRef(null);
  const [animationState, setAnimationState] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  
  // Internal state
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentColors, setCurrentColors] = useState(null);
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [animation, setAnimation] = useState("gentle-breath");

  // Subscribe to EmotionStateManager updates
  useEffect(() => {
    const unsubscribe = emotionStateManager.subscribe((state) => {
      setCurrentEmotion(state.emotion);
      setCurrentColors(state.colors);
      setAnimation(state.animation);
    });

    return () => {
      unsubscribe(); // Cleanup subscription on unmount
    };
  }, []);
  
  /**
   * Komponente initialisieren
   */
  useEffect(() => {
    initializeAnimation();
    
    return () => {
      cleanup();
    };
  }, []);
  
  /**
   * State-Updates an Animation State Manager weiterleiten
   */
  useEffect(() => {
    if (!isInitialized) return;
    
    const newState = {
      mode,
      emotionalState: steinerState || emotionalState,
      intensity,
      audioData,
      urgencyLevel,
      textInput,
      sentimentScore,
      taskType,
      emotionalContext,
      ambientData
    };
    
    animationStateManager.updateState(newState);
  }, [
    mode, emotionalState, steinerState, intensity, audioData, 
    urgencyLevel, textInput, sentimentScore, taskType, 
    emotionalContext, ambientData, isInitialized
  ]);
  
  /**
   * Animation initialisieren
   */
  const initializeAnimation = useCallback(() => {
    // Callbacks registrieren
    animationStateManager.setCallbacks({
      onStateChange: handleStateChange,
      onAnimationFrame: handleAnimationFrame,
      onPerformanceUpdate: handlePerformanceUpdate
    });
    
    // Animation starten
    animationStateManager.start({
      mode,
      emotionalState: steinerState || emotionalState,
      intensity,
      audioData,
      urgencyLevel
    });
    
    setIsInitialized(true);
    console.log('🎬 UniversalOrbAnimation initialisiert:', { mode, emotionalState, intensity });
  }, []);
  
  /**
   * State-Change Handler
   */
  const handleStateChange = useCallback((newState, previousState) => {
    // Farben aktualisieren
    const colors = emotionStateManager.getEmotionColor(newState.emotionalState);
    setCurrentColors(colors);
    
    // External Callback
    if (onStateChange) {
      onStateChange(newState, previousState);
    }
  }, [onStateChange]);
  
  /**
   * Animation-Frame Handler
   */
  const handleAnimationFrame = useCallback((frameState) => {
    setAnimationState(frameState);
    
    // DOM-Updates anwenden
    if (orbRef.current && frameState) {
      applyAnimationToDom(frameState);
    }
    
    // External Callback
    if (onAnimationFrame) {
      onAnimationFrame(frameState);
    }
  }, [onAnimationFrame, baseSize]);
  
  /**
   * Performance-Update Handler
   */
  const handlePerformanceUpdate = useCallback((metrics) => {
    setPerformanceMetrics(metrics);
    
    // Debug-Info aktualisieren
    if (enableDebug) {
      const debugData = animationStateManager.getDebugInfo();
      setDebugInfo(debugData);
      
      // Debug-Daten nach außen übertragen
      if (onDebugUpdate) {
        onDebugUpdate('UniversalOrbAnimation', {
          debugInfo: debugData,
          performanceMetrics: metrics,
          animationState,
          currentColors
        });
      }
    }
    
    // External Callback
    if (onPerformanceUpdate) {
      onPerformanceUpdate(metrics);
    }
  }, [onPerformanceUpdate, enableDebug, onDebugUpdate, animationState, currentColors]);
  
  /**
   * Animation auf DOM anwenden
   */
  const applyAnimationToDom = useCallback((frameState) => {
    if (!orbRef.current || !frameState) return;
    
    const { breathing, morphing, glowing, colors } = frameState;
    
    // Größe berechnen und anwenden
    const finalSize = baseSize * (breathing?.scale || 1);
    orbRef.current.style.width = `${finalSize}px`;
    orbRef.current.style.height = `${finalSize}px`;
    
    // Organisches Morphing anwenden
    if (morphing?.borderRadius) {
      orbRef.current.style.borderRadius = morphing.borderRadius;
    }
    
    // Hintergrund-Gradient anwenden
    if (colors?.gradient) {
      orbRef.current.style.background = colors.gradient;
    }
    
    // Glow-Effekt anwenden
    if (glowing?.intensity && colors?.glow) {
      orbRef.current.style.filter = colors.glow.css;
    }
    
    // CSS Custom Properties für erweiterte Styling-Optionen
    if (colors?.css) {
      Object.entries(colors.css).forEach(([property, value]) => {
        orbRef.current.style.setProperty(property, value);
      });
    }
  }, [baseSize]);
  
  /**
   * Therapeutischen Kontext für Farbberechnung erstellen
   */
  const getTherapeuticContext = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();
    
    let timeOfDay;
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';
    
    return {
      timeOfDay,
      mode,
      urgencyLevel,
      sessionContext: emotionalContext
    };
  }, [mode, urgencyLevel, emotionalContext]);
  
  /**
   * Click Handler
   */
  const handleClick = useCallback((event) => {
    if (onClick) {
      onClick(event, {
        animationState,
        performanceMetrics,
        currentState: animationStateManager.getCurrentState()
      });
    }
  }, [onClick, animationState, performanceMetrics]);
  
  /**
   * Hover Handler
   */
  const handleMouseEnter = useCallback((event) => {
    if (onHover) {
      onHover(event, 'enter', {
        animationState,
        currentState: animationStateManager.getCurrentState()
      });
    }
  }, [onHover, animationState]);
  
  const handleMouseLeave = useCallback((event) => {
    if (onHover) {
      onHover(event, 'leave', {
        animationState,
        currentState: animationStateManager.getCurrentState()
      });
    }
  }, [onHover, animationState]);
  
  /**
   * Cleanup
   */
  const cleanup = useCallback(() => {
    animationStateManager.stop();
    console.log('🧹 UniversalOrbAnimation cleanup');
  }, []);
  
  // Sichtbarkeit kontrollieren
  if (!isVisible) {
    return null;
  }
  
  return (
    <div 
      ref={containerRef}
      className={`universal-orb-animation ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
      {...otherProps}
    >
      {/* Hauptorb */}
      <div
        ref={orbRef}
        className={`universal-orb mode-${mode} state-${emotionalState}`}
        style={{
          width: `${baseSize}px`,
          height: `${baseSize}px`,
          borderRadius: '50%',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          cursor: onClick ? 'pointer' : 'default',
          transition: currentColors ? 
            `background ${steinerColorSystem.transitionDuration}ms cubic-bezier(0.4, 0, 0.6, 1)` : 
            'none',
          willChange: 'transform, filter, border-radius, background'
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Debug Panel wurde entfernt - Debug-Daten werden über Props übertragen */}
    </div>
  );
};

export default UniversalOrbAnimation;