# Audio-Reaktive SVG Blob Animation

Eine React-Komponente, die eine SVG Blob-Animation basierend auf Audio-Eingaben in Echtzeit steuert.

## Features

### 🎵 Audio-Reaktivität
- **Sprachaktivität**: Das Blob pulsiert und skaliert basierend auf der Audio-Amplitude
- **Tonhöhen-Reaktion**: Form und Farbe ändern sich entsprechend der dominanten Frequenz
- **"Listening"-Status**: Spezielle Animation zeigt aktive Audio-Eingabe an
- **Echtzeit-Performance**: Flüssige Animationen mit Web Audio API und Framer Motion

### 🎨 Visuelle Effekte
- Organische Blob-Formen mit Morphing-Animationen
- Dynamische Farbänderungen basierend auf Audio-Eigenschaften
- Glow-Effekte und Kontur-Animationen
- Responsive Design für verschiedene Bildschirmgrößen

### ⚡ Technische Details
- **Web Audio API** für Audio-Analyse
- **Framer Motion** für flüssige SVG-Animationen
- **React Hooks** für State-Management
- **CSS3** für styling und Fallback-Animationen

## Komponenten-Struktur

```
src/components/
├── AudioReactiveBlob.jsx     # Haupt-Komponente mit Web Audio API
├── AudioReactiveBlob.css     # Styling für Haupt-Komponente
├── BlobShape.jsx             # SVG Blob-Rendering mit Framer Motion
├── BlobShape.css             # Styling für Blob-Animation
├── AudioBlobDemo.jsx         # Demo-Komponente
└── AudioBlobDemo.css         # Demo-Styling
```

## Verwendung

### Basis-Implementierung

```jsx
import AudioReactiveBlob from './components/AudioReactiveBlob';

function App() {
  return (
    <div>
      <AudioReactiveBlob 
        audioSrc="path/to/your/audio.mp3"
        className="my-blob"
      />
    </div>
  );
}
```

### Props

#### AudioReactiveBlob
- `audioSrc` (string, erforderlich): Pfad zur MP3-Audio-Datei
- `className` (string, optional): Zusätzliche CSS-Klasse

#### BlobShape (intern verwendet)
- `amplitude` (number, 0-1): Audio-Amplitude für Skalierung
- `pitch` (number, 0-1): Normalisierte Tonhöhe für Form/Farbe
- `isListening` (boolean): Status für "Listening"-Animation

## Audio-Verarbeitung

### Web Audio API Setup
```javascript
// AudioContext erstellen
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// AnalyserNode für Frequenz-/Amplitude-Analyse
const analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
analyser.smoothingTimeConstant = 0.8;

// Audio-Graph: audio element -> analyser -> destination
const source = audioContext.createMediaElementSource(audioElement);
source.connect(analyser);
analyser.connect(audioContext.destination);
```

### Audio-Feature-Extraktion
- **Amplitude**: RMS (Root Mean Square) der Time-Domain-Daten
- **Tonhöhe**: Dominante Frequenz aus Frequency-Domain-Daten
- **Listening-Status**: Amplitude-Schwellenwert-Erkennung

## Animation-System

### Framer Motion Varianten
```javascript
const blobVariants = {
  idle: {
    scale: 1,
    transition: { duration: 2, repeat: Infinity }
  },
  listening: {
    scale: 1 + (amplitude * 0.3),
    rotate: [0, 5, -5, 0],
    transition: { duration: 0.5 }
  },
  speaking: {
    scale: 1 + (amplitude * 0.5),
    transition: { duration: 0.1 + (amplitude * 0.2) }
  }
};
```

### SVG-Morphing
- Basis-Blob-Form mit 5 verschiedenen Varianten
- Dynamische Pfad-Interpolation basierend auf Tonhöhe
- Graduelle Übergänge zwischen Formen

## Installation & Setup

### 1. Abhängigkeiten installieren
```bash
npm install framer-motion
```

### 2. Komponenten einbinden
```jsx
import AudioReactiveBlob from './components/AudioReactiveBlob';
```

### 3. Audio-Datei bereitstellen
- MP3, WAV, oder andere Web-Audio-kompatible Formate
- Lokale Dateien oder URLs

## Browser-Kompatibilität

### Unterstützt
- Chrome 66+
- Firefox 60+
- Safari 14+
- Edge 79+

### Fallbacks
- CSS-Animationen für `prefers-reduced-motion`
- WebKit-AudioContext für ältere Safari-Versionen
- Graceful Degradation bei fehlendem Web Audio API Support

## Performance-Optimierung

### Best Practices
- `React.memo()` für Blob-Shape-Komponente
- `useCallback()` für Event-Handler
- `useMemo()` für berechnete Werte
- Optimierte SVG-Pfade mit minimalen Punkten

### Monitoring
- Debug-Info in Development-Mode
- Performance-Metriken über `requestAnimationFrame`
- Audio-Context-State-Management

## Anpassungen

### Blob-Formen modifizieren
```javascript
// In BlobShape.jsx
const morphPaths = [
  "M60,20 C80,10 120,10 140,20...", // Basis-Form
  "M70,15 C90,5 110,5 130,15...",   // Hohe Tonhöhe
  // Weitere Formen hinzufügen
];
```

### Farb-Schema anpassen
```javascript
// Dynamische Farbe basierend auf Tonhöhe
const blobColor = useMemo(() => {
  const hue = Math.floor(pitch * 240); // 0-240 (blau zu rot)
  const saturation = 70 + (amplitude * 30);
  const lightness = 50 + (amplitude * 20);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}, [pitch, amplitude]);
```

### Animation-Parameter anpassen
```javascript
// Amplitude-Skalierung
scale: 1 + (amplitude * 0.5), // 0.5 = max scale factor

// Listening-Schwellenwert
const amplitudeThreshold = 0.01; // Anpassen für Sensitivität
```

## Troubleshooting

### Häufige Probleme

1. **Audio lädt nicht**
   - CORS-Einstellungen für externe URLs prüfen
   - Audio-Format-Kompatibilität testen

2. **Keine Animation**
   - Browser-Autoplay-Richtlinien (User-Interaction erforderlich)
   - AudioContext-Zustand (`suspended` -> `running`)

3. **Performance-Probleme**
   - FFT-Größe reduzieren (`analyser.fftSize = 1024`)
   - Animation-Loop-Optimierung

### Debug-Modus
```javascript
// In BlobShape.jsx - Debug-Info aktivieren
{process.env.NODE_ENV === 'development' && (
  <div className="blob-debug">
    <div>Amplitude: {amplitude.toFixed(3)}</div>
    <div>Pitch: {pitch.toFixed(3)}</div>
  </div>
)}
```

## Demo

Die Komponente wird mit einer vollständigen Demo-Seite geliefert:
- Audio-Datei-Upload
- Beispiel-Audio-Dateien
- Feature-Übersicht
- Verwendungsanweisungen

Starten Sie die Demo mit:
```bash
npm start
```

## Lizenz

Diese Komponente ist Teil des Conversational Therapy AI Projekts.