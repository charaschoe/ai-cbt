# Audio-Reaktive Bubble - Screen 1 Integration

Eine vollständig integrierte audio-reaktive Bubble-Animation für die Conversational Therapy AI Hauptseite.

## ✨ Features

### 🎵 Audio-Reaktivität
- **Echtzeit-Audio-Analyse** mit Web Audio API
- **Amplitude-basierte Größenänderung**: Bubble wächst/schrumpft basierend auf Audio-Lautstärke
- **Tonhöhen-responsive Farbmodulation**: Bubble-Farbe ändert sich mit Audio-Frequenzen
- **"Listening" vs "Speaking" Zustände**: Unterschiedliche visuelle Effekte

### 🎨 Visuelle Effekte
- **Calmly Tuned In Design**: Verwendet exakte CSS-Spezifikationen vom Design
- **Drei Größenzustände**: Small (347px), Medium (386px), Large (482px)
- **Dynamische Glow-Effekte**: Intensität basierend auf Audio-Amplitude
- **Sanfte Übergänge**: Smooth CSS-Transitionen für alle Änderungen

### 🎛️ Bedienelemente
- **Play/Pause Button**: Startet/stoppt Audio-Wiedergabe
- **Debug Panel**: Zeigt Echtzeit-Audio-Daten (togglebar)
- **Responsive Design**: Funktioniert auf Desktop und mobilen Geräten

## 🔧 Technische Implementierung

### Web Audio API Integration
```javascript
// AudioContext Setup
const AudioContext = window.AudioContext || window.webkitAudioContext;
this.audioContext = new AudioContext();

// AnalyserNode für Frequenz-/Amplitude-Analyse
this.analyser = this.audioContext.createAnalyser();
this.analyser.fftSize = 2048;
this.analyser.smoothingTimeConstant = 0.8;

// Audio-Graph: audio element -> analyser -> destination
this.source = this.audioContext.createMediaElementSource(this.audioElement);
this.source.connect(this.analyser);
this.analyser.connect(this.audioContext.destination);
```

### Audio-Feature-Extraktion
```javascript
// Amplitude (RMS) Berechnung
let sum = 0;
for (let i = 0; i < this.timeDomainData.length; i++) {
  const sample = (this.timeDomainData[i] - 128) / 128;
  sum += sample * sample;
}
this.currentAmplitude = Math.sqrt(sum / this.timeDomainData.length);

// Dominante Frequenz/Tonhöhe
let maxIndex = 0, maxValue = 0;
for (let i = 0; i < this.frequencyData.length; i++) {
  if (this.frequencyData[i] > maxValue) {
    maxValue = this.frequencyData[i];
    maxIndex = i;
  }
}
```

### Bubble-Animation-Logic
```javascript
// Größe basierend auf Amplitude
let targetSize;
if (this.currentAmplitude < 0.3) targetSize = this.bubbleSizes.small;
else if (this.currentAmplitude < 0.7) targetSize = this.bubbleSizes.medium;
else targetSize = this.bubbleSizes.large;

// Fine-grained Skalierung
const scaleMultiplier = 1 + (this.currentAmplitude * 0.1);
this.orbContainer.style.transform = `translate(-50%, -50%) scale(${scaleMultiplier})`;

// Farbmodulation basierend auf Tonhöhe
const hueShift = this.currentPitch * 30; // 0-30 degrees
this.bubble.style.filter = `hue-rotate(${hueShift}deg) drop-shadow(...)`;
```

## 🎯 Bubble-Zustände

### 1. Idle (Ruhe)
- **Größe**: 347.04px (Small)
- **Effekt**: Subtiler Standard-Glow
- **Trigger**: Keine Audio-Aktivität

### 2. Listening (Zuhören) 
- **Größe**: Basierend auf Amplitude
- **Effekt**: Verstärkter Glow mit `listening` CSS-Klasse
- **Trigger**: Amplitude > 0.01 (Schwellenwert)
- **Filter**: `drop-shadow(0 0 20px rgba(0, 255, 161, 0.6))`

### 3. Speaking (Sprechen)
- **Größe**: Medium (386px) bis Large (482px)
- **Effekt**: Intensiver Glow mit `speaking` CSS-Klasse
- **Trigger**: Amplitude > 0.1 (Hoher Schwellenwert)
- **Filter**: `drop-shadow(0 0 30px rgba(0, 255, 161, 0.8))`

## 📱 Bedienung

### Audio-Steuerung
1. **Play Button (▶️)**: Startet Audio-Wiedergabe
2. **Pause Button (⏸️)**: Pausiert Audio-Wiedergabe
3. **Debug Button (🔧)**: Toggles Debug-Panel

### Audio-Datei
- **Datei**: `ElevenLabs_2025-06-11T12_10_17_Juniper_pvc_sp100_s50_sb75_v3.mp3`
- **Pfad**: `public/ElevenLabs_2025-06-11T12_10_17_Juniper_pvc_sp100_s50_sb75_v3.mp3`
- **Typ**: MP3 (Web Audio API kompatibel)

### Debug-Panel
Zeigt Echtzeit-Werte:
- **Amplitude**: 0.000 - 1.000+
- **Pitch**: 0.000 - 1.000 (normalisiert)
- **Size**: Aktuelle Bubble-Größe in px
- **Status**: idle | listening | speaking
- **Audio**: playing | stopped

## 🌐 Browser-Kompatibilität

### Unterstützte Browser
- **Chrome 66+**: Vollständige Unterstützung
- **Firefox 60+**: Vollständige Unterstützung
- **Safari 14+**: Unterstützt (mit webkitAudioContext Fallback)
- **Edge 79+**: Vollständige Unterstützung

### Fallback-Verhalten
```javascript
// Safari Compatibility
const AudioContext = window.AudioContext || window.webkitAudioContext;

// User Interaction Required (Autoplay Policies)
if (this.audioContext.state === 'suspended') {
  await this.audioContext.resume();
}
```

## 🔧 Anpassungen

### Schwellenwerte anpassen
```javascript
// Listening-Schwellenwert
const amplitudeThreshold = 0.01; // Niedriger = sensibler

// Speaking-Schwellenwert  
if (this.currentAmplitude > 0.1) // Höher = weniger sensitiv
```

### Bubble-Größen modifizieren
```javascript
this.bubbleSizes = {
  small: 347.04,   // Basis-Größe
  medium: 386,     // Mittlere Aktivität
  large: 482       // Hohe Aktivität
};
```

### Animations-Geschwindigkeiten
```css
.ellipse-1 {
  transition: width 0.2s ease-out, height 0.2s ease-out, filter 0.3s ease-out;
}

.orbs-v-1 {
  transition: transform 0.1s ease-out;
}
```

### Farb-Effekte anpassen
```javascript
// Hue-Shift Range (0-30 Grad)
const hueShift = this.currentPitch * 30;

// Glow-Intensität
const glowIntensity = 20 + this.currentAmplitude * 30; // 20-50px
const glowOpacity = 0.6 + this.currentAmplitude * 0.4; // 0.6-1.0
```

## 🐛 Troubleshooting

### Audio lädt nicht
- Überprüfe Datei-Pfad: `public/ElevenLabs_2025-06-11T12_10_17_Juniper_pvc_sp100_s50_sb75_v3.mp3`
- Browser-Konsole auf Fehler prüfen
- CORS-Einstellungen bei externen Audio-URLs

### Keine Animation
- **User Interaction Required**: Browser-Autoplay-Richtlinien erfordern Benutzer-Klick
- **AudioContext Suspended**: Wird automatisch beim ersten Play resumed
- **Debug Panel**: Aktivieren um Audio-Werte zu überwachen

### Performance-Probleme
- FFT-Größe reduzieren: `analyser.fftSize = 1024` (von 2048)
- Smoothing anpassen: `analyser.smoothingTimeConstant = 0.9` (höher = weniger responsiv, aber stabiler)

## 📋 Checkliste für Integration

### ✅ Implementiert
- [x] Web Audio API Integration
- [x] Echtzeit-Audio-Analyse
- [x] Amplitude-responsive Bubble-Größe
- [x] Tonhöhen-responsive Farbmodulation
- [x] "Calmly Tuned In" Design-Treue
- [x] Listening/Speaking Zustände
- [x] Audio-Steuerung (Play/Pause)
- [x] Debug-Panel für Entwicklung
- [x] Browser-Kompatibilität (Safari Fallbacks)
- [x] Responsive Design
- [x] CSS-Transitionen für smooth Animationen

### 🔄 Erweiterungsmöglichkeiten
- [ ] Mikrofon-Input für Echtzeit-Interaktion
- [ ] Mehrere Audio-Quellen
- [ ] Preset-Modi (Meditation, Therapie, etc.)
- [ ] Touch-Interaktionen für Mobile
- [ ] Audio-Visualisierung (Spektrum)
- [ ] Accessibility Features (Screen Reader Support)

## 🚀 Deployment

Die Seite ist ready-to-deploy und erfordert nur:
1. Webserver mit statischen Dateien
2. Moderne Browser-Unterstützung  
3. HTTPS für optimale Web Audio API Performance

Öffne einfach `index.html` im Browser oder stelle sie auf einem Webserver bereit.