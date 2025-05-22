# text_to_speech.py
# ElevenLabs TTS Integration

import requests
from config_secret import ELEVENLABS_API_KEY

def synthesize_speech(text: str) -> str:
    """Sendet Text an ElevenLabs API, gibt URL zum Audio zurück (Dummy)."""
    # TODO: Echte Audio-Datei generieren und bereitstellen
    if not ELEVENLABS_API_KEY:
        return "[Kein ElevenLabs API-Key]"
    try:
        # Beispiel-Request (Dummy, gibt keine echte URL zurück)
        return "[Audio-URL folgt]"
    except Exception as e:
        return f"[TTS Fehler: {e}]"
