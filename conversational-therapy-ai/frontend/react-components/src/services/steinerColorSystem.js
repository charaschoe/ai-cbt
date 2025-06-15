/**
 * Rudolf Steiner Color System Service
 * Therapeutisches Farbsystem basierend auf Rudolf Steiners Farbprinzipien
 */

export const STEINER_COLOR_PALETTES = {
  neutral: {
    primary: 'rgba(0, 255, 161, 0.8)',      // Beruhigendes Grün
    secondary: 'rgba(68, 140, 255, 0.6)',   // Harmonisches Blau
    tertiary: 'rgba(255, 187, 148, 0.4)',   // Warmes Beige
    glow: 'rgba(0, 255, 161, 0.6)',
    emotion: 'balanced',
    therapy: 'calming',
    name: 'Neutral (Ruhe)'
  },
  
  freude: {
    primary: 'rgba(255, 220, 100, 0.9)',    // Sonniges Gelb
    secondary: 'rgba(255, 187, 148, 0.7)',  // Warmes Orange
    tertiary: 'rgba(255, 255, 200, 0.5)',   // Helles Gelb
    glow: 'rgba(255, 220, 100, 0.7)',
    emotion: 'uplifting',
    therapy: 'energizing',
    name: 'Freude (Wärme)'
  },
  
  trauer: {
    primary: 'rgba(100, 150, 255, 0.8)',    // Sanftes Blau
    secondary: 'rgba(68, 140, 255, 0.9)',   // Tieferes Blau
    tertiary: 'rgba(150, 200, 255, 0.6)',   // Helles Blau
    glow: 'rgba(100, 150, 255, 0.6)',
    emotion: 'soothing',
    therapy: 'comforting',
    name: 'Trauer (Kühle)'
  },
  
  wut: {
    primary: 'rgba(255, 120, 120, 0.9)',    // Energisches Rot
    secondary: 'rgba(255, 80, 80, 0.8)',    // Intensives Rot
    tertiary: 'rgba(200, 100, 100, 0.7)',   // Gedämpftes Rot
    glow: 'rgba(255, 120, 120, 0.7)',
    emotion: 'intense',
    therapy: 'releasing',
    name: 'Wut (Intensität)'
  },
  
  trauma: {
    primary: 'rgba(180, 80, 80, 1.0)',      // Tiefes Rot
    secondary: 'rgba(150, 60, 60, 0.9)',    // Sehr tiefes Rot
    tertiary: 'rgba(120, 40, 40, 0.8)',     // Dunkles Rot
    glow: 'rgba(180, 80, 80, 0.8)',
    emotion: 'deep',
    therapy: 'grounding',
    name: 'Trauma (Tiefe)'
  }
};

class SteinerColorSystem {
  constructor() {
    this.currentState = 'neutral';
    this.transitionDuration = 800; // ms
    this.intensityRange = { min: 0.1, max: 3.0 };
  }

  /**
   * Hauptfunktion zur Farbberechnung
   */
  getColorForState(emotionalState = 'neutral', intensity = 1.0, context = {}) {
    const palette = STEINER_COLOR_PALETTES[emotionalState] || STEINER_COLOR_PALETTES.neutral;
    
    // Intensität normalisieren
    const normalizedIntensity = Math.max(
      this.intensityRange.min, 
      Math.min(this.intensityRange.max, intensity)
    );
    
    // Farben basierend auf Intensität anpassen
    const adjustedColors = this.adjustColorIntensity(palette, normalizedIntensity);
    
    // Kontext-basierte Anpassungen anwenden
    const contextualColors = this.applyTherapeuticContext(adjustedColors, context);
    
    return {
      gradient: this.createRadialGradient(
        contextualColors.primary,
        contextualColors.secondary,
        contextualColors.tertiary
      ),
      glow: this.calculateGlowColor(contextualColors.glow, normalizedIntensity),
      therapeutic: palette.therapy,
      emotion: palette.emotion,
      css: this.generateCSSProperties(contextualColors, normalizedIntensity),
      state: emotionalState,
      intensity: normalizedIntensity
    };
  }

  /**
   * Farbintensität basierend auf Animation-Intensität anpassen
   */
  adjustColorIntensity(palette, intensity) {
    const factor = intensity;
    
    return {
      primary: this.adjustRGBAOpacity(palette.primary, factor),
      secondary: this.adjustRGBAOpacity(palette.secondary, factor),
      tertiary: this.adjustRGBAOpacity(palette.tertiary, factor),
      glow: this.adjustRGBAOpacity(palette.glow, factor)
    };
  }

  /**
   * RGBA-Opazität anpassen
   */
  adjustRGBAOpacity(rgbaString, factor) {
    const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([0-9.]*)\)/);
    if (!match) return rgbaString;
    
    const [, r, g, b, a = 1] = match;
    const newOpacity = Math.max(0.1, Math.min(1, parseFloat(a) * factor));
    
    return `rgba(${r}, ${g}, ${b}, ${newOpacity.toFixed(2)})`;
  }

  /**
   * Therapeutischen Kontext anwenden
   */
  applyTherapeuticContext(colors, context) {
    if (!context || typeof context !== 'object') return colors;
    
    // Tageszeit-Anpassung
    if (context.timeOfDay) {
      return this.adjustForTimeOfDay(colors, context.timeOfDay);
    }
    
    // Stress-Level Anpassung
    if (context.stressLevel) {
      return this.adjustForStressLevel(colors, context.stressLevel);
    }
    
    // Session-Fortschritt Anpassung
    if (context.sessionProgress) {
      return this.adjustForSessionProgress(colors, context.sessionProgress);
    }
    
    return colors;
  }

  /**
   * Tageszeit-basierte Anpassung
   */
  adjustForTimeOfDay(colors, timeOfDay) {
    const adjustments = {
      morning: { warmth: 1.1, brightness: 1.0 },
      afternoon: { warmth: 1.0, brightness: 1.1 },
      evening: { warmth: 0.9, brightness: 0.9 },
      night: { warmth: 0.8, brightness: 0.7 }
    };
    
    const adjustment = adjustments[timeOfDay] || adjustments.afternoon;
    
    return {
      ...colors,
      primary: this.adjustColorTemperature(colors.primary, adjustment.warmth, adjustment.brightness),
      secondary: this.adjustColorTemperature(colors.secondary, adjustment.warmth, adjustment.brightness)
    };
  }

  /**
   * Radialen Gradient erstellen
   */
  createRadialGradient(primary, secondary, tertiary) {
    return `radial-gradient(
      50% 50% at 50% 50%,
      ${primary} 11%,
      ${secondary} 62%,
      ${tertiary} 100%
    )`;
  }

  /**
   * Glow-Farbe berechnen
   */
  calculateGlowColor(baseGlowColor, intensity) {
    const baseIntensity = 20; // Basis-Glow in px
    const maxIntensity = 40;  // Maximum-Glow in px
    
    const glowSize = baseIntensity + ((maxIntensity - baseIntensity) * (intensity - 1));
    const glowOpacity = Math.max(0.2, Math.min(0.8, intensity * 0.4));
    
    return {
      size: Math.max(baseIntensity, glowSize),
      color: this.adjustRGBAOpacity(baseGlowColor, glowOpacity),
      css: `drop-shadow(0 0 ${Math.max(baseIntensity, glowSize)}px ${baseGlowColor})`
    };
  }

  /**
   * CSS Custom Properties generieren
   */
  generateCSSProperties(colors, intensity) {
    return {
      '--orb-primary': colors.primary,
      '--orb-secondary': colors.secondary,
      '--orb-tertiary': colors.tertiary,
      '--orb-glow': colors.glow,
      '--orb-intensity': intensity,
      '--orb-transition-duration': `${this.transitionDuration}ms`
    };
  }

  /**
   * Farbtemperatur anpassen (vereinfacht)
   */
  adjustColorTemperature(rgbaString, warmth, brightness) {
    const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([0-9.]*)\)/);
    if (!match) return rgbaString;
    
    let [, r, g, b, a = 1] = match.map((val, idx) => idx === 0 ? val : parseFloat(val));
    
    // Wärme anpassen (mehr Rot bei Wärme, mehr Blau bei Kälte)
    if (warmth > 1) {
      r = Math.min(255, r * warmth);
      b = Math.max(0, b / warmth);
    } else if (warmth < 1) {
      r = Math.max(0, r * warmth);
      b = Math.min(255, b / warmth);
    }
    
    // Helligkeit anpassen
    r = Math.min(255, r * brightness);
    g = Math.min(255, g * brightness);
    b = Math.min(255, b * brightness);
    
    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
  }

  /**
   * Verfügbare Zustände abrufen
   */
  getAvailableStates() {
    return Object.keys(STEINER_COLOR_PALETTES);
  }

  /**
   * Zustandsinformationen abrufen
   */
  getStateInfo(state) {
    return STEINER_COLOR_PALETTES[state] || null;
  }

  /**
   * Farbübergang zwischen zwei Zuständen
   */
  interpolateStates(fromState, toState, progress = 0) {
    progress = Math.max(0, Math.min(1, progress));
    
    const fromPalette = STEINER_COLOR_PALETTES[fromState] || STEINER_COLOR_PALETTES.neutral;
    const toPalette = STEINER_COLOR_PALETTES[toState] || STEINER_COLOR_PALETTES.neutral;
    
    return {
      primary: this.interpolateColors(fromPalette.primary, toPalette.primary, progress),
      secondary: this.interpolateColors(fromPalette.secondary, toPalette.secondary, progress),
      tertiary: this.interpolateColors(fromPalette.tertiary, toPalette.tertiary, progress),
      glow: this.interpolateColors(fromPalette.glow, toPalette.glow, progress)
    };
  }

  /**
   * Zwei RGBA-Farben interpolieren
   */
  interpolateColors(color1, color2, progress) {
    const parseRGBA = (rgba) => {
      const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([0-9.]*)\)/);
      return match ? [
        parseInt(match[1]),
        parseInt(match[2]),
        parseInt(match[3]),
        parseFloat(match[4] || 1)
      ] : [0, 0, 0, 1];
    };
    
    const [r1, g1, b1, a1] = parseRGBA(color1);
    const [r2, g2, b2, a2] = parseRGBA(color2);
    
    const r = Math.round(r1 + (r2 - r1) * progress);
    const g = Math.round(g1 + (g2 - g1) * progress);
    const b = Math.round(b1 + (b2 - b1) * progress);
    const a = (a1 + (a2 - a1) * progress).toFixed(2);
    
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
}

// Singleton-Instanz exportieren
export const steinerColorSystem = new SteinerColorSystem();
export default steinerColorSystem;