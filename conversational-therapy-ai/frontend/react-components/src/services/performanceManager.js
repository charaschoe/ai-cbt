/**
 * Performance Manager Service
 * Optimiert Animation-Performance für verschiedene Geräte und Modi
 */

class PerformanceManager {
  constructor() {
    this.targetFPS = 30;
    this.audioTargetFPS = 60;
    this.minFPS = 15;
    this.maxFPS = 60;
    
    // Performance-Metriken
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
    this.lastFPSUpdate = performance.now();
    this.currentFPS = 60;
    this.frameTimeHistory = [];
    this.maxHistoryLength = 60; // 1 Sekunde bei 60fps
    
    // Device Capabilities
    this.deviceCapabilities = this.detectDeviceCapabilities();
    this.adaptiveSettings = this.calculateAdaptiveSettings();
    
    // Memory Management
    this.memoryUsage = { heap: 0, used: 0, limit: 0 };
    this.cleanupInterval = null;
    this.startMemoryMonitoring();
  }

  /**
   * Geräteleistung erkennen
   */
  detectDeviceCapabilities() {
    const navigator = window.navigator;
    
    const capabilities = {
      // Hardware-Informationen
      deviceMemory: navigator.deviceMemory || 4, // GB
      hardwareConcurrency: navigator.hardwareConcurrency || 4, // CPU Cores
      
      // Browser-Features
      supportsWebGL: this.detectWebGL(),
      supportsHardwareAcceleration: this.detectHardwareAcceleration(),
      
      // Performance-Indikatoren
      connectionType: this.getConnectionType(),
      batteryLevel: null, // Wird asynchron geladen
      powerMode: 'unknown',
      
      // Screen-Eigenschaften
      devicePixelRatio: window.devicePixelRatio || 1,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height
      }
    };
    
    // Battery API (falls verfügbar)
    this.loadBatteryInfo(capabilities);
    
    return capabilities;
  }

  /**
   * WebGL-Support erkennen
   */
  detectWebGL() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  }

  /**
   * Hardware-Beschleunigung erkennen
   */
  detectHardwareAcceleration() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Test für Hardware-beschleunigte Canvas-Operationen
      const imageData = ctx.createImageData(100, 100);
      const start = performance.now();
      ctx.putImageData(imageData, 0, 0);
      const duration = performance.now() - start;
      
      return duration < 5; // Unter 5ms deutet auf Hardware-Beschleunigung hin
    } catch (e) {
      return false;
    }
  }

  /**
   * Verbindungstyp ermitteln
   */
  getConnectionType() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection) return 'unknown';
    
    return {
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false
    };
  }

  /**
   * Battery-Informationen laden
   */
  async loadBatteryInfo(capabilities) {
    try {
      if ('getBattery' in navigator) {
        const battery = await navigator.getBattery();
        capabilities.batteryLevel = battery.level;
        capabilities.powerMode = battery.charging ? 'charging' : 'battery';
        
        // Battery-Events überwachen
        battery.addEventListener('levelchange', () => {
          capabilities.batteryLevel = battery.level;
          this.adaptiveSettings = this.calculateAdaptiveSettings();
        });
        
        battery.addEventListener('chargingchange', () => {
          capabilities.powerMode = battery.charging ? 'charging' : 'battery';
          this.adaptiveSettings = this.calculateAdaptiveSettings();
        });
      }
    } catch (e) {
      console.log('Battery API nicht verfügbar');
    }
  }

  /**
   * Adaptive Einstellungen basierend auf Geräteleistung berechnen
   */
  calculateAdaptiveSettings() {
    const caps = this.deviceCapabilities;
    
    let performanceTier = 'medium';
    
    // Performance-Tier bestimmen
    if (caps.deviceMemory >= 8 && caps.hardwareConcurrency >= 8 && caps.supportsHardwareAcceleration) {
      performanceTier = 'high';
    } else if (caps.deviceMemory >= 4 && caps.hardwareConcurrency >= 4) {
      performanceTier = 'medium';
    } else {
      performanceTier = 'low';
    }
    
    // Battery-basierte Anpassungen
    if (caps.batteryLevel !== null && caps.batteryLevel < 0.2 && caps.powerMode === 'battery') {
      performanceTier = 'low';
    }
    
    // Connection-basierte Anpassungen
    if (caps.connectionType.saveData || caps.connectionType.effectiveType === 'slow-2g') {
      performanceTier = 'low';
    }
    
    return {
      tier: performanceTier,
      settings: this.getSettingsForTier(performanceTier)
    };
  }

  /**
   * Einstellungen für Performance-Tier
   */
  getSettingsForTier(tier) {
    const settings = {
      high: {
        targetFPS: 60,
        audioTargetFPS: 60,
        animationComplexity: 1.0,
        enableAdvancedEffects: true,
        bufferSize: 512,
        historyLength: 120,
        morphingVariations: 5,
        colorInterpolation: 'smooth'
      },
      medium: {
        targetFPS: 30,
        audioTargetFPS: 45,
        animationComplexity: 0.8,
        enableAdvancedEffects: true,
        bufferSize: 256,
        historyLength: 60,
        morphingVariations: 4,
        colorInterpolation: 'smooth'
      },
      low: {
        targetFPS: 20,
        audioTargetFPS: 30,
        animationComplexity: 0.6,
        enableAdvancedEffects: false,
        bufferSize: 128,
        historyLength: 30,
        morphingVariations: 3,
        colorInterpolation: 'fast'
      }
    };
    
    return settings[tier] || settings.medium;
  }

  /**
   * Adaptive Frame-Rate für spezifischen Modus
   */
  getAdaptiveFrameRate(mode) {
    const settings = this.adaptiveSettings.settings;
    
    switch (mode) {
      case 'audio':
        return settings.audioTargetFPS;
      case 'text':
        return Math.max(20, settings.targetFPS);
      case 'ambient':
        return Math.max(15, settings.targetFPS - 10);
      case 'base':
      default:
        return settings.targetFPS;
    }
  }

  /**
   * Frame-Performance messen
   */
  measureFramePerformance() {
    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    this.lastFrameTime = now;
    
    // Frame-Zeit zur Historie hinzufügen
    this.frameTimeHistory.push(frameTime);
    if (this.frameTimeHistory.length > this.maxHistoryLength) {
      this.frameTimeHistory.shift();
    }
    
    this.frameCount++;
    
    // FPS alle 500ms aktualisieren
    if (now - this.lastFPSUpdate > 500) {
      this.currentFPS = Math.round(1000 / this.getAverageFrameTime());
      this.lastFPSUpdate = now;
      
      // Performance-Anpassung wenn nötig
      this.adaptPerformanceIfNeeded();
    }
    
    return {
      frameTime,
      fps: this.currentFPS,
      averageFrameTime: this.getAverageFrameTime()
    };
  }

  /**
   * Durchschnittliche Frame-Zeit berechnen
   */
  getAverageFrameTime() {
    if (this.frameTimeHistory.length === 0) return 16.67; // 60fps Fallback
    
    const sum = this.frameTimeHistory.reduce((a, b) => a + b, 0);
    return sum / this.frameTimeHistory.length;
  }

  /**
   * Performance anpassen wenn nötig
   */
  adaptPerformanceIfNeeded() {
    const avgFrameTime = this.getAverageFrameTime();
    const targetFrameTime = 1000 / this.targetFPS;
    
    // Wenn Frame-Zeit konsistent über Ziel liegt, reduziere Komplexität
    if (avgFrameTime > targetFrameTime * 1.5) {
      this.reduceComplexity();
    }
    // Wenn Performance gut ist, erhöhe Komplexität graduell
    else if (avgFrameTime < targetFrameTime * 0.8 && this.canIncreaseComplexity()) {
      this.increaseComplexity();
    }
  }

  /**
   * Animations-Komplexität reduzieren
   */
  reduceComplexity() {
    const settings = this.adaptiveSettings.settings;
    
    if (settings.animationComplexity > 0.3) {
      settings.animationComplexity = Math.max(0.3, settings.animationComplexity - 0.1);
      settings.morphingVariations = Math.max(2, settings.morphingVariations - 1);
      
      console.log('🔧 Performance: Komplexität reduziert auf', settings.animationComplexity);
    }
  }

  /**
   * Animations-Komplexität erhöhen
   */
  increaseComplexity() {
    const settings = this.adaptiveSettings.settings;
    const maxComplexity = this.getSettingsForTier(this.adaptiveSettings.tier).animationComplexity;
    
    if (settings.animationComplexity < maxComplexity) {
      settings.animationComplexity = Math.min(maxComplexity, settings.animationComplexity + 0.05);
      settings.morphingVariations = Math.min(5, settings.morphingVariations + 1);
      
      console.log('🔧 Performance: Komplexität erhöht auf', settings.animationComplexity);
    }
  }

  /**
   * Kann Komplexität erhöht werden?
   */
  canIncreaseComplexity() {
    const settings = this.adaptiveSettings.settings;
    const maxComplexity = this.getSettingsForTier(this.adaptiveSettings.tier).animationComplexity;
    
    return settings.animationComplexity < maxComplexity;
  }

  /**
   * Memory-Monitoring starten
   */
  startMemoryMonitoring() {
    // Alle 5 Sekunden Memory-Status checken
    this.cleanupInterval = setInterval(() => {
      this.updateMemoryUsage();
      this.performMemoryCleanupIfNeeded();
    }, 5000);
  }

  /**
   * Memory-Nutzung aktualisieren
   */
  updateMemoryUsage() {
    if ('memory' in performance) {
      this.memoryUsage = {
        heap: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024), // MB
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),  // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) // MB
      };
    }
  }

  /**
   * Memory-Cleanup falls nötig
   */
  performMemoryCleanupIfNeeded() {
    const usage = this.memoryUsage.used / this.memoryUsage.limit;
    
    // Wenn über 80% Memory-Nutzung, aggressive Bereinigung
    if (usage > 0.8) {
      this.aggressiveCleanup();
    }
    // Wenn über 60%, normale Bereinigung
    else if (usage > 0.6) {
      this.normalCleanup();
    }
  }

  /**
   * Normale Memory-Bereinigung
   */
  normalCleanup() {
    // Frame-History kürzen
    if (this.frameTimeHistory.length > 30) {
      this.frameTimeHistory = this.frameTimeHistory.slice(-30);
    }
  }

  /**
   * Aggressive Memory-Bereinigung
   */
  aggressiveCleanup() {
    // Frame-History stark kürzen
    this.frameTimeHistory = this.frameTimeHistory.slice(-15);
    
    // Performance-Tier reduzieren
    if (this.adaptiveSettings.tier !== 'low') {
      console.log('🔧 Memory: Reduziere Performance-Tier wegen hoher Memory-Nutzung');
      this.adaptiveSettings = {
        tier: 'low',
        settings: this.getSettingsForTier('low')
      };
    }
  }

  /**
   * Performance-Metriken abrufen
   */
  getPerformanceMetrics() {
    return {
      fps: this.currentFPS,
      averageFrameTime: this.getAverageFrameTime(),
      memoryUsage: this.memoryUsage,
      deviceCapabilities: this.deviceCapabilities,
      adaptiveSettings: this.adaptiveSettings,
      frameCount: this.frameCount
    };
  }

  /**
   * Cleanup beim Zerstören
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Singleton-Instanz
export const performanceManager = new PerformanceManager();
export default performanceManager;