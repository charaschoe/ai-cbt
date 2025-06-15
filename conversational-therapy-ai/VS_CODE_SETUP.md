# VS Code Setup für Conversational Therapy AI

Dieses Projekt ist vollständig für Visual Studio Code konfiguriert mit automatisierten Launch- und Task-Konfigurationen.

## 🚀 Schnellstart

### Option 1: Launch-Konfiguration verwenden
1. Öffne VS Code im `conversational-therapy-ai` Ordner
2. Gehe zu "Run and Debug" (Ctrl+Shift+D / Cmd+Shift+D)
3. Wähle "🚀 Launch Full App (Frontend + Backend)" aus der Dropdown-Liste
4. Klicke auf den grünen "Play" Button

### Option 2: Tasks verwenden
1. Öffne die Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Tippe "Tasks: Run Task"
3. Wähle "🚀 Start Full Stack App"

## 📋 Verfügbare Konfigurationen

### Launch-Konfigurationen (F5)
- **🚀 Launch Full App (Frontend + Backend)** - Startet beide Services gleichzeitig
- **🎯 Frontend Only (React)** - Nur das React Frontend
- **🐍 Backend Only (Python)** - Nur den Python Backend Server

### Tasks (Ctrl+Shift+P → Tasks: Run Task)
- **🚀 Start Full Stack App** - Startet Frontend und Backend parallel
- **🎯 Start Frontend (React)** - React Development Server
- **🐍 Start Backend (Python)** - Python FastAPI Server mit venv
- **📦 Install Frontend Dependencies** - `npm install` für React App
- **🐍 Install Backend Dependencies** - `pip install -r requirements.txt`
- **🧹 Clean Build** - Löscht Build-Caches

## 🔧 Projektstruktur

```
conversational-therapy-ai/
├── .vscode/
│   ├── launch.json     # Debug/Launch-Konfigurationen
│   ├── tasks.json      # Task-Definitionen
│   └── settings.json   # Workspace-spezifische Einstellungen
├── frontend/
│   └── react-components/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── webpack.config.js
├── backend/
│   ├── venv/           # Python Virtual Environment
│   ├── server.py       # FastAPI Server
│   └── requirements.txt
└── VS_CODE_SETUP.md   # Diese Datei
```

## 🛠️ Erweiterte Nutzung

### Debugging
- **Frontend**: Automatisches Browser-Öffnen bei Start
- **Backend**: Python Debugger mit Breakpoint-Support
- **Full Stack**: Beide Services mit separaten Debug-Konsolen

### Terminal-Integration
- Alle Tasks nutzen integrierte VS Code Terminals
- Separate Terminal-Gruppen für Frontend/Backend
- Hot-Reload für beide Services aktiviert

### Workspace-Einstellungen
- Python Interpreter auf `./backend/venv/bin/python` gesetzt
- ESLint für JavaScript/React konfiguriert
- Automatische Formatierung beim Speichern
- Optimierte Datei-Ausschlüsse für bessere Performance

## 🚦 Status-Indikatoren

### Frontend (React)
- ✅ Webpack Dev Server gestartet
- 🌐 Browser öffnet automatisch auf `http://localhost:3000`
- 🔄 Hot Module Replacement aktiviert

### Backend (Python)
- ✅ FastAPI Server läuft mit aktivierter venv
- 🐍 Python Virtual Environment automatisch aktiviert
- 📡 API verfügbar (normalerweise auf Port 8000)

## 📝 Hinweise

- Die erste Ausführung kann länger dauern (Dependency-Installation)
- Bei Problemen verwende die "Clean Build" Task
- Alle Pfade sind relativ zum Workspace-Root konfiguriert
- Die Launch-Konfiguration öffnet automatisch den Browser