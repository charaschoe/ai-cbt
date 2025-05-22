# 🧠 Conversational Therapy AI

A privacy-focused, web-based Cognitive Behavioral Therapy (CBT) interface with AI-powered emotional analysis, speech interaction, and dynamic emotion visualization.

## 🚀 Features

### Core Functionality
- **CBT-Based Therapy Sessions**: Professional therapeutic conversations following CBT principles with Socratic questioning and cognitive pattern recognition
- **Dual Interaction Modes**: Switch seamlessly between text and voice chat based on environment or preference
- **Real-time Emotion Analysis**: Automatic mood detection and cognitive pattern recognition from user input
- **Dynamic Emotion Visualization**: Interactive emotion bubbles that grow and change based on conversation themes and intensity
- **Face Emotion Recognition**: Camera-based emotion detection using computer vision
- **Crisis Detection**: Automatic identification of crisis situations with immediate support resource recommendations
- **Ambient Noise Detection**: Smart mode switching based on environmental noise levels

### Therapeutic Tools
- **Thought Pattern Recognition**: Identifies cognitive distortions like black-and-white thinking, catastrophizing, and self-deprecation
- **Theme Extraction**: Automatically categorizes conversations into themes (work stress, relationships, self-worth, etc.)
- **Emotion Dashboard**: Visual timeline and intensity tracking of emotional states over time
- **Session History**: Persistent tracking of therapeutic progress and recurring patterns

## 🛠 Technology Stack

### Backend
- **Framework**: FastAPI (0.95.2) with Uvicorn ASGI server
- **AI/ML Libraries**:
  - OpenAI Whisper (1.0) for speech-to-text
  - Transformers (4.33.2) and PyTorch (2.0.1) for ML processing
  - FER (22.9) for facial emotion recognition
  - OpenCV (4.8.0.76) for computer vision
- **Audio Processing**: Pydub (0.25.1) and SpeechRecognition (3.10.0)
- **LLM Integration**: Custom API integration with Kitegg chat service using Mistral-Small-3.1-24B-Instruct model
- **File Handling**: python-multipart for file uploads

### Frontend
- **Core**: Vanilla JavaScript with modern Web APIs
- **Web APIs Used**:
  - Web Audio API for ambient noise detection
  - MediaDevices API for camera and microphone access
  - Canvas API for image processing
  - Fetch API for backend communication
- **Styling**: Modern CSS with Google Fonts (Inter)
- **UI Features**: Responsive design, touch/swipe gestures, real-time visual feedback

### External Services
- **Text-to-Speech**: ElevenLabs API integration (optional)
- **LLM Processing**: Kitegg AI service with Mistral model

## 📋 Prerequisites

### Required Software
1. **Python 3.9+**
   - Download from [python.org](https://www.python.org/downloads/)
   - pip package manager (usually included)

2. **Git** (optional, for cloning)
   - Download from [git-scm.com](https://git-scm.com/downloads/)

### Required API Keys
1. **Kitegg API Key** (Required for LLM functionality)
   - Contact Kitegg service for API access
   - Used for CBT therapy conversation processing

2. **ElevenLabs API Key** (Optional for enhanced TTS)
   - Register at [elevenlabs.io](https://elevenlabs.io/)
   - Only needed if implementing full text-to-speech features

### Browser Requirements
- Modern browser with support for:
  - Web Audio API
  - MediaDevices API (camera/microphone access)
  - Canvas API
  - ES6+ JavaScript features

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd conversational-therapy-ai
```

### 2. Backend Setup
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create configuration file
cp config_example.py config_secret.py
```

### 3. Configure API Keys
Edit `backend/config_secret.py`:
```python
# Required for LLM functionality
CHAT_KITEGG_API_KEY = "your_kitegg_api_key_here"

# Optional for enhanced TTS
ELEVENLABS_API_KEY = "your_elevenlabs_key_here"  # or leave as placeholder
```

### 4. Start the Backend Server
```bash
# From the backend directory
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

The server will start at `http://localhost:8000`

### 5. Frontend Setup
```bash
# From project root, serve the frontend
# Option 1: Using Python's built-in server
cd frontend
python -m http.server 8080

# Option 2: Using any static file server
# Or simply open index.html in a modern browser
```

Access the application at `http://localhost:8080`

## 💡 How It Works

### Architecture Overview
```
User Input → Web Interface → FastAPI Backend → AI Processing → Response
     ↓              ↓              ↓              ↓             ↓
Text/Voice → Audio Processing → LLM Analysis → Emotion Detection → UI Update
```

### Conversation Flow
1. **Input Processing**: User provides text or voice input
2. **Transcription**: Voice input converted to text using Whisper
3. **AI Analysis**: Text processed by Mistral LLM with CBT-specific prompting
4. **Emotion Detection**: Mood and cognitive patterns analyzed
5. **Response Generation**: Therapeutic response generated following CBT principles
6. **Visualization Update**: Emotion bubbles and dashboard updated in real-time

### API Endpoints
- `POST /chat`: Main therapy conversation endpoint
- `POST /transcribe`: Speech-to-text conversion
- `POST /speak`: Text-to-speech synthesis
- `POST /analyze-face`: Facial emotion recognition
- `GET /blobs`: Emotion visualization data

### Data Processing
- **Mood Analysis**: Keyword-based emotion classification (positive, negative, neutral, crisis, mixed)
- **Pattern Recognition**: Detection of cognitive distortions and thought patterns
- **Theme Extraction**: Categorization into therapeutic themes (work, relationships, self-worth, etc.)
- **Bubble Calculation**: Dynamic sizing and coloring based on frequency and intensity

## 🔧 Configuration Options

### Backend Configuration
- **Server Settings**: Modify host, port, and CORS settings in `server.py`
- **LLM Parameters**: Adjust model settings and prompts in `llm.py`
- **Analysis Sensitivity**: Customize mood detection keywords in `analysis.py`

### Frontend Customization
- **Visual Themes**: Modify colors and styling in `styles.css`
- **Interaction Modes**: Adjust noise detection sensitivity in `script.js`
- **UI Behavior**: Customize animation and feedback settings

## 🔒 Privacy & Security

- **Local Processing**: Core emotion analysis performed locally
- **No Data Storage**: Session data kept in memory only (not persisted to disk)
- **User Control**: Camera and microphone access requires explicit permission
- **API Security**: Secure API key handling with environment-based configuration

## 🚧 Development Status

### Fully Implemented
- ✅ CBT-based conversation system
- ✅ Real-time emotion analysis
- ✅ Dynamic emotion visualization
- ✅ Facial emotion recognition
- ✅ Ambient noise detection
- ✅ Crisis intervention detection

### Placeholder/TODO
- ⚠️ Whisper speech-to-text integration (currently placeholder)
- ⚠️ ElevenLabs text-to-speech implementation (currently placeholder)
- ⚠️ Session persistence and user accounts
- ⚠️ Advanced biometric integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## ⚠️ Disclaimer

This application is designed for therapeutic support and self-reflection purposes. It is **not a replacement for professional mental health care**. If you are experiencing a mental health crisis, please contact:

- **Emergency Services**: 911 (US) or your local emergency number
- **Crisis Text Line**: Text HOME to 741741
- **National Suicide Prevention Lifeline**: 988 (US)
- **International**: Contact your local crisis support services

Always consult with qualified mental health professionals for serious mental health concerns.
