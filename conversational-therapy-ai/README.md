# 🧠 Conversational Therapy AI

Ein privates, lokales, sprachbasiertes Therapie-Interface mit Whisper, Ollama & ElevenLabs.

## Voraussetzungen (Installation)

Folgendes muss auf deinem Computer installiert sein:

### 1. Python 3.9+

Installiere Python von https://www.python.org/downloads/

### 2. pip (Python-Paketmanager)

Kommt meist mit Python, sonst: https://pip.pypa.io/en/stable/installation/

### 3. Ollama (für lokale LLMs)

Installiere Ollama: https://ollama.com/download

### 3a. Empfohlene Ollama-Modelle für Apple Silicon (M1/M2/M3)

-   **llama2:7b** – Gute Qualität, läuft flüssig auf MacBook Air M2
-   **phi3:mini** – Sehr schnell, klein, für einfache Aufgaben
-   **mistral:7b** – Gute Balance aus Geschwindigkeit und Qualität
-   **gemma:2b** – Sehr ressourcenschonend

Modelle laden z.B. mit:

```bash
ollama pull llama2:7b
ollama pull phi3:mini
ollama pull mistral:7b
```

Alle Modelle: https://ollama.com/library

### 4. Git (optional, für Quellcodeverwaltung)

https://git-scm.com/downloads

### 5. ElevenLabs API-Key (für TTS, Registrierung nötig)

https://elevenlabs.io/

### 6. (Optional) Node.js, falls du Frontend-Tools oder npm-Pakete nutzen willst

https://nodejs.org/

---

## Schnellstart

```bash
cd backend
pip install -r requirements.txt
export ELEVENLABS_API_KEY=your_key_here
ollama pull llama2
ollama serve
uvicorn server:app --reload
```

Frontend: http://localhost:8000

## Architektur

-   Mic → Whisper → Ollama → ElevenLabs → Speaker
-   Mood & Pattern Analysis parallel
