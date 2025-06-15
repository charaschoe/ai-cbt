/**
 * Animation State Manager Service
 * Koordiniert alle Animation-Layer und Zustandsübergänge
 */

import steinerColorSystem from './steinerColorSystem.js';
import performanceManager from './performanceManager.js';

class AnimationStateManager {
  constructor() {
    // Animation-Layer
    this.baseLayer = new BaseOrganicAnimation();
    this.audioLayer = new AudioReactiveLayer();
    this.textLayer = new TextReactiveLayer();
    
    // Aktueller Zustand
    this.currentState = {
      mode: 'base',
      emotionalState: 'neutral',
      intensity: 1.0,
      isActive: false
    };
    
    // Animation-Pipeline
    this.animationId = null;
    this.isRunning = false;
    this.startTime = Date.now();
    
    // State-History für Übergänge
    this.stateHistory = [];
    this.maxHistoryLength = 5;
    
    // Callbacks
    this.onStateChange = null;
    this.onAnimationFrame = null;
    this.onPerformanceUpdate = null;
  }

  /**
   * Animation starten
   */
  start(config = {}) {
    if (this.isRunning) return;
    
    this.currentState = {
      ...this.currentState,
      ...config,
      isActive: true
    };
    
    this.isRunning = true;
    this.startTime = Date.now();
    this.animate();
    
    console.log('🎬 Animation State Manager gestartet:', this.currentState);
  }

  /**
   * Animation stoppen
   */
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    this.currentState.isActive = false;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    console.log('⏹️ Animation State Manager gestoppt');
  }

  /**
   * Zustand aktualisieren
   */
  updateState(newState) {
    const previousState = { ...this.currentState };
    
    // Neuen Zustand anwenden
    this.currentState = {
      ...this.currentState,
      ...newState
    };
    
    // State-History aktualisieren
    this.addToHistory(previousState);
    
    // State-Change Callback
    if (this.onStateChange) {
      this.onStateChange(this.currentState, previousState);
    }
    
    console.log('🔄 State aktualisiert:', this.currentState);
  }

  /**
   * State zur Historie hinzufügen
   */
  addToHistory(state) {
    this.stateHistory.push({
      ...state,
      timestamp: Date.now()
    });
    
    if (this.stateHistory.length > this.maxHistoryLength) {
      this.stateHistory.shift();
    }
  }

  /**
   * Hauptanimationsschleife
   */
  animate() {
    if (!this.isRunning) return;
    
    const now = Date.now();
    const elapsed = now - this.startTime;
    
    // Performance messen
    const performanceMetrics = performanceManager.measureFramePerformance();
    
    // Frame-Rate anpassen
    const targetFrameRate = performanceManager.getAdaptiveFrameRate(this.currentState.mode);
    const frameInterval = 1000 / targetFrameRate;
    
    // Animations-Pipeline ausführen
    const animationState = this.processAnimationPipeline(elapsed, performanceMetrics);
    
    // Callbacks ausführen
    if (this.onAnimationFrame) {
      this.onAnimationFrame(animationState);
    }
    
    if (this.onPerformanceUpdate && performanceMetrics.fps !== this.lastReportedFPS) {
      this.onPerformanceUpdate(performanceMetrics);
      this.lastReportedFPS = performanceMetrics.fps;
    }
    
    // Nächster Frame mit angepasster Rate
    const nextFrameDelay = Math.max(0, frameInterval - (Date.now() - now));
    
    if (nextFrameDelay > 0) {
      setTimeout(() => {
        this.animationId = requestAnimationFrame(() => this.animate());
      }, nextFrameDelay);
    } else {
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  }

  /**
   * Animation-Pipeline verarbeiten
   */
  processAnimationPipeline(elapsed, performanceMetrics) {
    // Basis-Layer (immer aktiv)
    const baseState = this.baseLayer.getState(elapsed, this.currentState.intensity);
    
    // Reaktive Layer basierend auf Modus
    let reactiveState = {};
    
    switch (this.currentState.mode) {
      case 'audio':
        reactiveState = this.audioLayer.getState(this.currentState.audioData, baseState);
        break;
      case 'text':
        reactiveState = this.textLayer.getState(this.currentState, baseState);
        break;
      case 'emotional':
      case 'ambient':
        reactiveState = this.getEmotionalState(this.currentState, baseState);
        break;
      default:
        reactiveState = { intensity: 1.0, sizeMultiplier: 1.0, colorState: 'neutral' };
    }
    
    // Zustände kombinieren
    const combinedState = this.combineStates(baseState, reactiveState);
    
    // Farben berechnen
    const colorData = steinerColorSystem.getColorForState(
      this.currentState.emotionalState,
      combinedState.intensity,
      this.getTherapeuticContext()
    );
    
    return {
      ...combinedState,
      colors: colorData,
      performance: performanceMetrics,
      timestamp: Date.now()
    };
  }

  /**
   * Basis- und reaktive Zustände kombinieren
   */
  combineStates(baseState, reactiveState) {
    return {
      // Breathing kombinieren
      breathing: {
        phase: baseState.breathing.phase,
        scale: baseState.breathing.scale * (reactiveState.sizeMultiplier || 1.0)
      },
      
      // Morphing kombinieren
      morphing: {
        phase: baseState.morphing.phase,
        borderRadius: baseState.morphing.borderRadius,
        variation: baseState.morphing.variation,
        intensity: baseState.morphing.intensity * (reactiveState.morphingMultiplier || 1.0)
      },
      
      // Glow kombinieren
      glowing: {
        phase: baseState.glowing.phase,
        intensity: baseState.glowing.intensity * (reactiveState.glowMultiplier || 1.0),
        color: reactiveState.glowColor || baseState.glowing.color
      },
      
      // Reaktive Eigenschaften
      reactive: {
        mode: this.currentState.mode,
        intensity: (baseState.intensity || 1.0) * (reactiveState.intensity || 1.0),
        sizeMultiplier: reactiveState.sizeMultiplier || 1.0,
        colorState: reactiveState.colorState || this.currentState.emotionalState || 'neutral'
      }
    };
  }

  /**
   * Emotionalen Zustand für emotional/ambient Modi
   */
  getEmotionalState(currentState, baseState) {
    const emotionalIntensity = currentState.urgencyLevel || 0.5;
    
    return {
      intensity: 1.0 + (emotionalIntensity * 0.5),
      sizeMultiplier: 0.9 + (emotionalIntensity * 0.3),
      morphingMultiplier: 0.8 + (emotionalIntensity * 0.4),
      glowMultiplier: 0.8 + (emotionalIntensity * 0.6),
      colorState: currentState.emotionalState || 'neutral'
    };
  }

  /**
   * Therapeutischen Kontext für Farbberechnung
   */
  getTherapeuticContext() {
    const now = new Date();
    const hour = now.getHours();
    
    let timeOfDay;
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';
    
    return {
      timeOfDay,
      sessionDuration: Date.now() - this.startTime,
      stressLevel: this.calculateStressLevel(),
      sessionProgress: this.calculateSessionProgress()
    };
  }

  /**
   * Stress-Level basierend auf Nutzungsmustern
   */
  calculateStressLevel() {
    const recentStates = this.stateHistory.slice(-3);
    if (recentStates.length === 0) return 0.3;
    
    // Häufige Zustandswechsel = höherer Stress
    const stateChanges = recentStates.filter((state, index) => 
      index > 0 && state.emotionalState !== recentStates[index - 1].emotionalState
    ).length;
    
    return Math.min(1.0, 0.2 + (stateChanges * 0.2));
  }

  /**
   * Session-Fortschritt berechnen
   */
  calculateSessionProgress() {
    const sessionDuration = Date.now() - this.startTime;
    const maxSessionTime = 30 * 60 * 1000; // 30 Minuten
    
    return Math.min(1.0, sessionDuration / maxSessionTime);
  }

  /**
   * Callbacks registrieren
   */
  setCallbacks({ onStateChange, onAnimationFrame, onPerformanceUpdate }) {
    this.onStateChange = onStateChange;
    this.onAnimationFrame = onAnimationFrame;
    this.onPerformanceUpdate = onPerformanceUpdate;
  }

  /**
   * Aktuellen Zustand abrufen
   */
  getCurrentState() {
    return { ...this.currentState };
  }

  /**
   * State-Historie abrufen
   */
  getStateHistory() {
    return [...this.stateHistory];
  }

  /**
   * Debug-Informationen
   */
  getDebugInfo() {
    return {
      currentState: this.currentState,
      isRunning: this.isRunning,
      stateHistory: this.stateHistory,
      performance: performanceManager.getPerformanceMetrics(),
      sessionDuration: Date.now() - this.startTime
    };
  }
}

/**
 * Base Organic Animation Layer
 * Kontinuierliche organische Basis-Animation
 */
class BaseOrganicAnimation {
  constructor() {
    this.config = {
      breathing: {
        duration: 4000,           // 4 Sekunden
        amplitude: 0.03,          // ±3% Größenänderung
        easing: Math.PI * 2       // Vollständige Sinuswelle
      },
      
      morphing: {
        duration: 8000,           // 8 Sekunden
        variations: [
          '50%',                    // Perfekter Kreis
          '45% 55% 52% 48%',       // Organische Variation 1
          '52% 48% 45% 55%',       // Organische Variation 2
          '48% 52% 55% 45%',       // Organische Variation 3
          '47% 53% 49% 51%'        // Organische Variation 4
        ],
        intensity: 0.05           // 5% max Abweichung
      },
      
      glowing: {
        duration: 6000,           // 6 Sekunden
        minIntensity: 0.3,
        maxIntensity: 0.6
      }
    };
  }

  getState(elapsed, intensityMultiplier = 1.0) {
    // Breathing Animation
    const breathingPhase = (elapsed % this.config.breathing.duration) / this.config.breathing.duration;
    const breathingScale = 1 + (Math.sin(breathingPhase * this.config.breathing.easing) * 
                               this.config.breathing.amplitude * intensityMultiplier);
    
    // Organic Morphing
    const morphingPhase = (elapsed % this.config.morphing.duration) / this.config.morphing.duration;
    const morphingIndex = Math.floor(morphingPhase * this.config.morphing.variations.length);
    const currentMorphing = this.config.morphing.variations[morphingIndex];
    
    // Glow Animation
    const glowPhase = (elapsed % this.config.glowing.duration) / this.config.glowing.duration;
    const glowIntensity = this.config.glowing.minIntensity + 
                         (Math.sin(glowPhase * Math.PI * 2) * 
                          (this.config.glowing.maxIntensity - this.config.glowing.minIntensity) * 
                          intensityMultiplier);
    
    return {
      breathing: {
        phase: breathingPhase,
        scale: breathingScale
      },
      morphing: {
        phase: morphingPhase,
        borderRadius: currentMorphing,
        variation: morphingIndex,
        intensity: this.config.morphing.intensity * intensityMultiplier
      },
      glowing: {
        phase: glowPhase,
        intensity: glowIntensity,
        color: 'rgba(0, 255, 161, 0.6)' // Standard-Glow
      },
      intensity: intensityMultiplier
    };
  }
}

/**
 * Audio Reactive Layer
 * Reaktion auf Audio-Eingaben
 */
class AudioReactiveLayer {
  constructor() {
    this.config = {
      amplitudeMapping: {
        minSize: 0.8,             // 80% bei Stille
        maxSize: 1.4,             // 140% bei max Lautstärke
        sensitivity: 0.8,
        smoothing: 0.3
      },
      
      frequencyMapping: {
        lowFreq: { range: [0, 0.3], effect: 'size', multiplier: 1.2 },
        midFreq: { range: [0.3, 0.7], effect: 'morphing', multiplier: 1.5 },
        highFreq: { range: [0.7, 1.0], effect: 'glow', multiplier: 2.0 }
      }
    };
    
    this.smoothedAmplitude = 0;
    this.smoothedFrequency = 0;
  }

  getState(audioData, baseState) {
    if (!audioData) {
      return { intensity: 1.0, sizeMultiplier: 1.0, colorState: 'neutral' };
    }
    
    const { amplitude = 0, frequency = 0 } = audioData;
    
    // Smoothing anwenden
    this.smoothedAmplitude += (amplitude - this.smoothedAmplitude) * this.config.amplitudeMapping.smoothing;
    this.smoothedFrequency += (frequency - this.smoothedFrequency) * this.config.amplitudeMapping.smoothing;
    
    // Größen-Multiplikator berechnen
    const sizeMultiplier = this.config.amplitudeMapping.minSize + 
                          (this.smoothedAmplitude * 
                           (this.config.amplitudeMapping.maxSize - this.config.amplitudeMapping.minSize));
    
    // Frequenz-basierte Effekte
    const morphingMultiplier = this.calculateFrequencyEffect('morphing', this.smoothedFrequency);
    const glowMultiplier = this.calculateFrequencyEffect('glow', this.smoothedFrequency);
    
    return {
      intensity: 1 + this.smoothedAmplitude,
      sizeMultiplier,
      morphingMultiplier,
      glowMultiplier,
      colorState: this.getAudioColorState(this.smoothedAmplitude, this.smoothedFrequency)
    };
  }

  calculateFrequencyEffect(effectType, frequency) {
    const mapping = Object.values(this.config.frequencyMapping)
      .find(map => map.effect === effectType && 
                   frequency >= map.range[0] && frequency <= map.range[1]);
    
    return mapping ? mapping.multiplier : 1.0;
  }

  getAudioColorState(amplitude, frequency) {
    if (amplitude > 0.7) return 'wut';        // Intensive Sounds
    if (frequency > 0.7) return 'freude';     // High-frequency sounds
    if (amplitude < 0.2) return 'trauer';     // Quiet sounds
    return 'neutral';
  }
}

/**
 * Text Reactive Layer
 * Reaktion auf Text-Eingaben
 */
class TextReactiveLayer {
  constructor() {
    this.emotionalMappings = {
      neutral: { sizeMultiplier: 1.0, intensity: 1.0 },
      freude: { sizeMultiplier: 1.2, intensity: 1.5 },
      trauer: { sizeMultiplier: 0.8, intensity: 0.7 },
      wut: { sizeMultiplier: 1.3, intensity: 2.0 },
      trauma: { sizeMultiplier: 0.9, intensity: 0.8 }
    };
  }

  getState(currentState, baseState) {
    const emotionalState = currentState.emotionalState || 'neutral';
    const urgencyLevel = currentState.urgencyLevel || 0.5;
    
    const mapping = this.emotionalMappings[emotionalState] || this.emotionalMappings.neutral;
    
    return {
      intensity: mapping.intensity * (1 + urgencyLevel * 0.5),
      sizeMultiplier: mapping.sizeMultiplier * (1 + urgencyLevel * 0.2),
      morphingMultiplier: 1 + urgencyLevel,
      glowMultiplier: 1 + urgencyLevel * 0.5,
      colorState: emotionalState
    };
  }
}

// Singleton-Instanz exportieren
export const animationStateManager = new AnimationStateManager();
export default animationStateManager;