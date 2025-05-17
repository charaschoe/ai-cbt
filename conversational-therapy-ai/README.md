# 🧠 Conversational Therapy AI

A private, local, speech-based therapy interface powered by Whisper, Ollama, and ElevenLabs.

## Prerequisites (Installation)

Ensure the following are installed on your computer:

### 1. Python 3.9+

Download Python from https://www.python.org/downloads/

### 2. pip (Python Package Manager)

Usually included with Python. If not, install it from https://pip.pypa.io/en/stable/installation/

### 3. Ollama (for local LLMs)

Install Ollama: https://ollama.com/download

### 3a. Recommended Ollama Models for Apple Silicon (M1/M2/M3)

-   **llama2:7b** – High quality, runs smoothly on MacBook Air M2
-   **phi3:mini** – Very fast, lightweight, for simple tasks
-   **mistral:7b** – Good balance of speed and quality
-   **gemma:2b** – Very resource-efficient

Download models using:

```bash
ollama pull llama2:7b
ollama pull phi3:mini
ollama pull mistral:7b
```

Explore all models: https://ollama.com/library

### 4. Git (optional, for source code management)

Download Git: https://git-scm.com/downloads

### 5. ElevenLabs API Key (for TTS, registration required)

Register and get your API key: https://elevenlabs.io/

### 6. (Optional) Node.js (for frontend tools or npm packages)

Download Node.js: https://nodejs.org/

---

## Quick Start

```bash
cd backend
pip install -r requirements.txt
export ELEVENLABS_API_KEY=your_key_here
ollama pull llama2
ollama serve
uvicorn server:app --reload
```

Access the frontend at: http://localhost:8000

---

## Features

### Backend
- **Endpoints**:
  - `/chat`: Processes user input and provides a response using the LLM.
  - `/transcribe`: Converts audio input to text (Whisper integration).
  - `/speak`: Converts text to speech (ElevenLabs integration).
  - `/blobs`: Returns dynamic emotion blob data for visualization.

### Frontend
- **Dynamic Mode Selection**:
  - Automatically switches between text and voice modes based on ambient noise levels.
  - Uses the Web Audio API to analyze microphone input.
- **Emotion Blobs**:
  - Visualizes emotions dynamically based on user input.
  - Adjusts size and color based on emotion severity and type.
- **Guided Breathing Exercises**:
  - Provides a step-by-step breathing guide with animations.
- **Insights and Dashboards**:
  - Displays emotion timelines and insights for self-reflection.

---

## Architecture

-   Microphone → Whisper → Ollama → ElevenLabs → Speaker
-   Parallel mood and pattern analysis

---

## Contributing

Feel free to contribute by submitting issues or pull requests. Ensure your code adheres to the project's style and guidelines.

---

## License

This project is licensed under the MIT License.
