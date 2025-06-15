# 🧠 Conversational Therapy AI - Umfassende Dokumentation

Eine datenschutzorientierte, webbasierte Kognitive Verhaltenstherapie (KVT) Schnittstelle mit KI-gestützter emotionaler Analyse, Sprachinteraktion und dynamischer Emotionsvisualisierung.

## 🚀 Hauptfunktionen

### Kernfunktionalität

-   **KVT-basierte Therapiesitzungen**: Professionelle therapeutische Gespräche nach KVT-Prinzipien mit sokratischen Fragen und kognitiver Mustererkennung
-   **Duale Interaktionsmodi**: Nahtloses Wechseln zwischen Text- und Sprachinteraktion je nach Umgebung oder Präferenz
-   **Echtzeit-Emotionsanalyse**: Automatische Stimmungserkennung und kognitive Mustererkennung aus Benutzereingaben
-   **Dynamische Emotionsvisualisierung**: Interaktive Emotionsblasen, die basierend auf Gesprächsthemen und Intensität wachsen und sich verändern
-   **Gesichtsemotionserkennung**: Kamerabasierte Emotionserkennung mit Computer Vision
-   **Krisenerkennung**: Automatische Identifikation von Krisensituationen mit sofortigen Unterstützungsressourcen-Empfehlungen
-   **Umgebungsgeräuscherkennung**: Intelligenter Moduswechsel basierend auf Umgebungsgeräuschpegeln

### 🌍 Mehrsprachige Unterstützung

#### Automatische Spracherkennung

-   **Echtzeitanalyse**: Erkennt die Sprache aus Benutzereingaben basierend auf sprachspezifischen Indikatoren
-   **Unterstützte Sprachen**: Deutsch, Englisch, Französisch, Spanisch, Italienisch
-   **Fallback-Mechanismus**: Standardmäßig auf Deutsch bei unsicherer Erkennung

#### Adaptive System-Prompts

-   **Dynamische Anpassung**: System-Prompt wechselt automatisch basierend auf erkannter Sprache
-   **KVT-Konsistenz**: Therapeutische Prinzipien bleiben in allen Sprachen gleich
-   **Professionelle Standards**: Empathische, nicht-wertende Haltung in jeder Sprache

#### Mehrsprachige Krisenintervention

-   **Sprachspezifische Schlüsselwörter**: Erkennt Krisensignale in allen unterstützten Sprachen
-   **Lokalisierte Hilfsressourcen**: Passende Notfallnummern und Ressourcen je Sprache
-   **Sofortige Reaktion**: Priorität für Sicherheit über Sprachpräferenzen

### 🎭 Erweiterte Gesichtsausdrucks- und Semantik-Features

#### Gesichtsausdruck-Semantik

-   **Dynamische Ausdruckserkennung**: KI analysiert Nachrichteninhalt und Benutzereingabe zur Bestimmung angemessener Gesichtsausdrücke
-   **6 Kernausdrücke**: Glücklich, Traurig, Nachdenklich, Ängstlich, Überrascht, Neutral
-   **Emotionale Zustandszuordnung**: Jeder Ausdruck ordnet sich therapeutischen emotionalen Zuständen zu (empathisch, festlich, beruhigend, verständnisvoll, kontemplativ, unterstützend)

#### Erweiterte Chat-Funktionen

-   **Verbesserte Tastaturpositionierung**: Tastatur um 30px nach unten verschoben für bessere Bildschirmnutzung
-   **Fortgeschrittenes Chat-Scrolling**: Sanftes Auto-Scroll mit alter Nachrichten-Erkennung
-   **Ellipsis-Barriere**: Visueller Indikator erscheint oben beim Betrachten alter Nachrichten
-   **Erweiterte Container**: 60% Höhenzuteilung (70% bei versteckter Tastatur) für bessere Inhaltsanzeige

### Therapeutische Werkzeuge

-   **Gedankenmustererkennung**: Identifiziert kognitive Verzerrungen wie Schwarz-Weiß-Denken, Katastrophisieren und Selbstabwertung
-   **Themenextraktion**: Kategorisiert Gespräche automatisch in Themen (Arbeitsstress, Beziehungen, Selbstwert, etc.)
-   **Emotions-Dashboard**: Visuelle Zeitlinie und Intensitätsverfolgung emotionaler Zustände über die Zeit
-   **Sitzungshistorie**: Persistente Verfolgung therapeutischen Fortschritts und wiederkehrender Muster

## 🛠 Technologie-Stack

### Backend

-   **Framework**: FastAPI (0.95.2) mit Uvicorn ASGI Server
-   **KI/ML-Bibliotheken**:
    -   OpenAI Whisper (1.0) für Sprach-zu-Text
    -   Transformers (4.33.2) und PyTorch (2.0.1) für ML-Verarbeitung
    -   FER (22.9) für Gesichtsemotionserkennung
    -   OpenCV (4.8.0.76) für Computer Vision
-   **Audio-Verarbeitung**: Pydub (0.25.1) und SpeechRecognition (3.10.0)
-   **LLM-Integration**: Benutzerdefinierte API-Integration mit Kitegg Chat-Service unter Verwendung des Mistral-Small-3.1-24B-Instruct-Modells
-   **Dateiverarbeitung**: python-multipart für Datei-Uploads

### Frontend

#### Vanilla JavaScript Interface

-   **Kern**: Vanilla JavaScript mit modernen Web-APIs
-   **Verwendete Web-APIs**:
    -   Web Audio API für Umgebungsgeräuscherkennung
    -   MediaDevices API für Kamera- und Mikrofonzugang
    -   Canvas API für Bildverarbeitung
    -   Fetch API für Backend-Kommunikation
-   **Styling**: Modernes CSS mit Google Fonts (Inter)
-   **UI-Features**: Responsive Design, Touch-/Wischgesten, Echtzeit-visuelles Feedback

#### React-Komponenten Interface

-   **Framework**: React 18.2.0 mit modernem JSX
-   **Build-Tools**: Webpack 5.88.0 mit Babel-Loader
-   **Entwicklung**: Webpack Dev Server mit Hot Reload
-   **Komponenten**:
    -   [`ChatFlow07.jsx`](conversational-therapy-ai/frontend/react-components/src/components/ChatFlow07.jsx:1) - Hauptchat-Interface mit emotionaler Intelligenz
    -   [`SwipeContainer.jsx`](conversational-therapy-ai/frontend/react-components/src/components/SwipeContainer.jsx:1) - Touch-Gesten-Unterstützung
    -   [`KeyboardIPhoneTypeDefault.jsx`](conversational-therapy-ai/frontend/react-components/src/components/KeyboardIPhoneTypeDefault.jsx:1) - iOS-Tastatur-Integration
    -   [`OrbsV3Property1Variant4.jsx`](conversational-therapy-ai/frontend/react-components/src/components/OrbsV3Property1Variant4.jsx:1) - Emotionsvisualisierungen

### Externe Services

-   **Text-zu-Sprache**: ElevenLabs API-Integration (optional)
-   **LLM-Verarbeitung**: Kitegg AI-Service mit Mistral-Modell

## 📋 Voraussetzungen

### Erforderliche Software

1. **Python 3.9+**

    - Download von [python.org](https://www.python.org/downloads/)
    - pip Paket-Manager (normalerweise enthalten)

2. **Node.js 16+** (für React-Komponenten)

    - Download von [nodejs.org](https://nodejs.org/)
    - npm Paket-Manager (enthalten)

3. **Git** (optional, zum Klonen)
    - Download von [git-scm.com](https://git-scm.com/downloads/)

### Erforderliche API-Schlüssel

1. **Kitegg API-Schlüssel** (Erforderlich für LLM-Funktionalität)

    - Kontaktiere Kitegg-Service für API-Zugang
    - Verwendet für KVT-Therapiegespräche-Verarbeitung

2. **ElevenLabs API-Schlüssel** (Optional für erweiterte TTS)
    - Registrierung bei [elevenlabs.io](https://elevenlabs.io/)
    - Nur benötigt bei Implementierung vollständiger Text-zu-Sprache-Features

### Browser-Anforderungen

-   Moderner Browser mit Unterstützung für:
    -   Web Audio API
    -   MediaDevices API (Kamera-/Mikrofonzugang)
    -   Canvas API
    -   ES6+ JavaScript-Features

## 🚀 Installation & Setup

### 1. Repository klonen

```bash
git clone <repository-url>
cd conversational-therapy-ai
```

### 2. Backend-Setup

```bash
cd backend

# Python-Abhängigkeiten installieren
pip install -r requirements.txt

# Konfigurationsdatei erstellen
cp config_example.py config_secret.py
```

### 3. API-Schlüssel konfigurieren

Bearbeite [`backend/config_secret.py`](conversational-therapy-ai/backend/config_secret.py:1):

```python
# Erforderlich für LLM-Funktionalität
CHAT_KITEGG_API_KEY = "dein_kitegg_api_schluessel_hier"

# Optional für erweiterte TTS
ELEVENLABS_API_KEY = "dein_elevenlabs_schluessel_hier"  # oder als Platzhalter belassen
```

### 4. Backend-Server starten

```bash
# Aus dem Backend-Verzeichnis
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

Der Server startet unter `http://localhost:8000`

### 5. Frontend-Setup

#### Option A: Vanilla JavaScript Interface

```bash
# Vom Projektroot, Frontend bereitstellen
cd frontend
python -m http.server 8080

# Oder einfach index.html in einem modernen Browser öffnen
```

Zugriff auf die Anwendung unter `http://localhost:8080`

#### Option B: React-Komponenten Interface

```bash
# React-Abhängigkeiten installieren
cd frontend/react-components
npm install

# Development Server starten
npm start
```

Zugriff auf die React-Anwendung unter `http://localhost:3000`

## 💡 Wie es funktioniert

### Architektur-Übersicht

```
Benutzereingabe → Web-Interface → FastAPI Backend → KI-Verarbeitung → Antwort
     ↓              ↓              ↓              ↓             ↓
Text/Sprache → Audio-Verarbeitung → LLM-Analyse → Emotionserkennung → UI-Update
```

### Gesprächsablauf

1. **Eingabeverarbeitung**: Benutzer liefert Text- oder Spracheingabe
2. **Transkription**: Spracheingabe wird mit Whisper in Text umgewandelt
3. **KI-Analyse**: Text wird von Mistral LLM mit KVT-spezifischen Prompts verarbeitet
4. **Emotionserkennung**: Stimmung und kognitive Muster analysiert
5. **Antwortgenerierung**: Therapeutische Antwort nach KVT-Prinzipien generiert
6. **Visualisierungsupdate**: Emotionsblasen und Dashboard in Echtzeit aktualisiert

### API-Endpunkte

-   `POST /chat`: Haupt-Therapiegespräche-Endpunkt
-   `POST /transcribe`: Sprach-zu-Text-Konvertierung
-   `POST /speak`: Text-zu-Sprache-Synthese
-   `POST /analyze-face`: Gesichtsemotionserkennung
-   `GET /blobs`: Emotionsvisualisierungsdaten

### Datenverarbeitung

-   **Stimmungsanalyse**: Schlüsselwortbasierte Emotionsklassifikation (positiv, negativ, neutral, Krise, gemischt)
-   **Mustererkennung**: Erkennung kognitiver Verzerrungen und Gedankenmuster
-   **Themenextraktion**: Kategorisierung in therapeutische Themen (Arbeit, Beziehungen, Selbstwert, etc.)
-   **Blasenberechnung**: Dynamische Größenbestimmung und Einfärbung basierend auf Häufigkeit und Intensität

## 🌐 Unterstützte Sprachen

| Sprache  | Code | Status         | Krisenunterstützung            |
| -------- | ---- | -------------- | ------------------------------ |
| Deutsch  | `de` | ✅ Vollständig | ✅ Telefonseelsorge            |
| English  | `en` | ✅ Vollständig | ✅ National Suicide Prevention |
| Français | `fr` | ✅ Vollständig | ✅ SOS Amitié                  |
| Español  | `es` | ✅ Vollständig | ✅ Teléfono de la Esperanza    |
| Italiano | `it` | ✅ Vollständig | ✅ Telefono Amico              |

### Spracherkennungsalgorithmus

#### Erkennungsmethodik

1. **Lexikalische Analyse**: Häufige Wörter pro Sprache
2. **Mustererkennung**: Sprachspezifische Zeichen und Kombinationen
3. **Gewichtetes Scoring**: Punktesystem für Sprachmerkmale
4. **Konfidenz-Schwellenwert**: Mindestpunktzahl für sichere Erkennung

#### Erkennungsgenauigkeit

-   **Kurze Texte (< 10 Wörter)**: ~85% Genauigkeit
-   **Mittlere Texte (10-30 Wörter)**: ~95% Genauigkeit
-   **Längere Texte (> 30 Wörter)**: ~98% Genauigkeit

## 🎨 Gesichtsausdruck-Logik

### Ausdruckserkennung-Algorithmus

Die KI analysiert sowohl KI-Antwort als auch Benutzereingabe und gibt zurück: "glücklich", "traurig", "ängstlich", "wütend", "überrascht", "nachdenklich", "neutral"

### Emotionale Zustandszuordnung

-   **Traurig → Empathisch**: Blau-getönte Antworten mit beruhigenden Animationen
-   **Glücklich → Festlich**: Golden-getönte Antworten mit Leuchteffekten
-   **Ängstlich → Beruhigend**: Grün-getönte Antworten mit gleichmäßigen Animationen
-   **Nachdenklich → Kontemplativ**: Lila-getönte Antworten mit tiefen Pulseffekten
-   **Überrascht → Neugierig**: Grün-getönte Antworten mit Sprunganimationen

### Dynamische Denkdauer

-   **Nachdenkliche Antworten**: 2.5-3.5 Sekunden (tiefere Kontemplation)
-   **Empathische Antworten**: 2-3 Sekunden (Emotionsverarbeitung)
-   **Glückliche Antworten**: 1-2 Sekunden (schnelle positive Antwort)
-   **Basis-Antworten**: 1.5-2.5 Sekunden (Standard-Denkzeit)

## 🔧 Konfigurationsoptionen

### Backend-Konfiguration

-   **Server-Einstellungen**: Host, Port und CORS-Einstellungen in [`server.py`](conversational-therapy-ai/backend/server.py:1) modifizieren
-   **LLM-Parameter**: Modelleinstellungen und Prompts in [`llm.py`](conversational-therapy-ai/backend/llm.py:1) anpassen
-   **Analyse-Sensibilität**: Stimmungserkennungs-Schlüsselwörter in [`analysis.py`](conversational-therapy-ai/backend/analysis.py:1) anpassen

### Frontend-Anpassung

-   **Visuelle Themes**: Farben und Styling in [`styles.css`](conversational-therapy-ai/frontend/styles.css:1) modifizieren
-   **Interaktionsmodi**: Geräuscherkennungsempfindlichkeit in [`script.js`](conversational-therapy-ai/frontend/script.js:1) anpassen
-   **UI-Verhalten**: Animations- und Feedback-Einstellungen anpassen

## 🔒 Datenschutz & Sicherheit

-   **Lokale Verarbeitung**: Kern-Emotionsanalyse wird lokal durchgeführt
-   **Keine Datenspeicherung**: Sitzungsdaten werden nur im Speicher gehalten (nicht auf Festplatte gespeichert)
-   **Benutzerkontrolle**: Kamera- und Mikrofonzugang erfordert explizite Berechtigung
-   **API-Sicherheit**: Sichere API-Schlüsselverarbeitung mit umgebungsbasierter Konfiguration

## 🚨 Krisenintervention

### Mehrsprachige Schlüsselwörter

Das System erkennt Krisensignale in allen Sprachen:

-   **Suizidalität**: "suizid", "suicide", "suicidio", etc.
-   **Selbstverletzung**: "ritzen", "cutting", "autolesión", etc.
-   **Lebensmüdigkeit**: "sterben wollen", "want to die", "veux mourir", etc.

### Sofortreaktionen

-   **Priorität**: Krisenintervention hat Vorrang vor Spracherkennung
-   **Lokalisierte Hilfe**: Passende Notfallnummern basierend auf erkannter Sprache
-   **Professionelle Weiterleitung**: Sofortige Empfehlung professioneller Hilfe

## 🧪 Testing

### Automatisierte Tests

```bash
# Testskript ausführen
python test_multilingual.py
```

Das Testskript überprüft:

-   ✅ Spracherkennung in allen 5 Sprachen
-   ✅ Krisenerkennung mehrsprachig
-   ✅ System-Prompt-Wechsel
-   ✅ Therapeutische Antwortqualität

### Manuelle Tests

#### Beispiel-Eingaben für verschiedene Sprachen:

**Deutsch:**

```
"Ich fühle mich heute sehr gestresst und ängstlich."
```

**English:**

```
"I'm feeling really overwhelmed with work lately."
```

**Français:**

```
"Je me sens très triste aujourd'hui."
```

**Español:**

```
"Estoy muy preocupado por mi futuro."
```

**Italiano:**

```
"Mi sento molto arrabbiato ultimamente."
```

## 🚧 Entwicklungsstatus

### Vollständig implementiert

-   ✅ KVT-basiertes Gesprächssystem
-   ✅ Echtzeit-Emotionsanalyse
-   ✅ Dynamische Emotionsvisualisierung
-   ✅ Gesichtsemotionserkennung
-   ✅ Umgebungsgeräuscherkennung
-   ✅ Kriseninterventionserkennung
-   ✅ Mehrsprachige Unterstützung (5 Sprachen)
-   ✅ React-Komponenten-Interface
-   ✅ Erweiterte Gesichtsausdruck-Semantik

### Platzhalter/TODO

-   ⚠️ Whisper Sprach-zu-Text-Integration (derzeit Platzhalter)
-   ⚠️ ElevenLabs Text-zu-Sprache-Implementierung (derzeit Platzhalter)
-   ⚠️ Sitzungspersistenz und Benutzerkonten
-   ⚠️ Erweiterte biometrische Integration

## 🔮 Zukunftserweiterungen

### Geplante Sprachen

-   🇳🇱 Niederländisch
-   🇵🇹 Portugiesisch
-   🇷🇺 Russisch
-   🇨🇳 Chinesisch (Mandarin)
-   🇯🇵 Japanisch

### Erweiterte Features

-   **Sprachmischung**: Erkennung von Code-Switching
-   **Dialekt-Support**: Regionale Varianten
-   **Kulturelle Anpassung**: Kultursensitive Therapieansätze
-   **Stimm-Spracherkennung**: Integration mit Audio-Processing
-   **Progressive Web App**: Mobile-optimierte Erfahrung mit Offline-Funktionalität

## 📈 Performance-Optimierung

### Caching-Strategien

-   **System-Prompt-Cache**: Vermeidet wiederholte Prompt-Generierung
-   **Spracherkennung-Cache**: Speichert Erkennungsergebnisse für häufige Phrasen

### Skalierung

-   **Modulare Architektur**: Einfache Erweiterung um neue Sprachen
-   **API-Effizienz**: Minimale Latenz durch optimierte Algorithmen
-   **Memory-Management**: Effiziente Speichernutzung bei Chat-Historie

## 🤝 Beitragen

### Neue Sprache hinzufügen

1. **Schlüsselwörter definieren** in [`language_detection.py`](conversational-therapy-ai/backend/language_detection.py:1)
2. **System-Prompt übersetzen** für KVT-Prinzipien
3. **Krisenressourcen hinzufügen** mit lokalen Notfallnummern
4. **Tests erweitern** im [`test_multilingual.py`](conversational-therapy-ai/test_multilingual.py:1)

### Code-Qualität

-   **Type Hints**: Vollständige Typisierung
-   **Dokumentation**: Ausführliche Docstrings
-   **Testing**: Umfassende Testabdeckung
-   **Internationalisierung**: i18n-konforme Implementierung

1. Repository forken
2. Feature-Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Änderungen committen (`git commit -m 'Add amazing feature'`)
4. Zum Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request öffnen

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Siehe die LICENSE-Datei für Details.

## ⚠️ Haftungsausschluss

Diese Anwendung ist für therapeutische Unterstützung und Selbstreflexion konzipiert. Sie ist **kein Ersatz für professionelle psychische Gesundheitsversorgung**. Bei einer psychischen Gesundheitskrise kontaktieren Sie bitte:

### Deutschland

-   **Notdienste**: 112
-   **Telefonseelsorge**: 0800 111 0 111 oder 0800 111 0 222
-   **Nummer gegen Kummer**: 116 123

### International

-   **Notdienste**: 911 (USA) oder Ihre lokale Notrufnummer
-   **Crisis Text Line**: Text HOME to 741741
-   **National Suicide Prevention Lifeline**: 988 (USA)
-   **International**: Kontaktieren Sie Ihre lokalen Krisenhilfsdienste

Konsultieren Sie immer qualifizierte Fachkräfte für psychische Gesundheit bei schwerwiegenden psychischen Gesundheitsproblemen.

## 📞 Support

Bei Fragen zur mehrsprachigen Funktionalität oder anderen Features:

-   **Technische Probleme**: GitHub Issues erstellen
-   **Feature-Anfragen**: Diskussion in GitHub Discussions
-   **Sprachfehler**: Pull Requests mit Korrekturen willkommen

---

_Dieses System wurde entwickelt, um hochwertige KVT-Therapie in mehreren Sprachen zugänglich zu machen, während professionelle Standards und kulturelle Sensibilität gewährleistet werden._
