# server.py
# FastAPI Server für Conversational Therapy AI

from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import uvicorn
import json
import os
import tempfile
import random

# Lokale Module importieren
from llm import chat_with_llm
from analysis import analyze_mood, find_thought_patterns, calculate_blob_data, update_emotion_tracker, extract_themes
from speech_to_text import transcribe_audio
from text_to_speech import synthesize_speech
from config_secret import ELEVENLABS_API_KEY, CHAT_KITEGG_API_KEY

app = FastAPI(title="Conversational Therapy AI")

# CORS-Einstellungen für Frontend-Zugriffe
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Für Produktion einschränken!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Datenmodelle
class ChatRequest(BaseModel):
    text: str

class ChatResponse(BaseModel):
    response: str
    mood: str
    patterns: list

# Globaler Chat-Verlauf mit CBT-Therapie-System-Prompt
chat_history = [
    {
        "role": "system", 
        "content": """Du bist ein professioneller CBT-Therapeut (Kognitive Verhaltenstherapie). Führe ein therapeutisches Gespräch nach CBT-Prinzipien.

CBT-GESPRÄCHSFÜHRUNG:
- Stelle offene, explorative Fragen (Was, Wie, Wann statt Warum)
- Erkunde Gedanken, Gefühle und Verhaltensweisen systematisch
- Verwende Sokratische Fragentechnik
- Identifiziere kognitive Verzerrungen behutsam
- Hilf beim Erkennen von Gedanken-Gefühls-Verhaltens-Zyklen
- Arbeite mit konkreten Situationen und Beispielen

THERAPEUTISCHE HALTUNG:
- Empathisch und nicht-wertend
- Kollaborativ (wir arbeiten zusammen)
- Strukturiert aber warm
- Validiere Gefühle, hinterfrage Gedanken
- Fokus auf Hier und Jetzt

TECHNIKEN:
- Gedankenprotokoll-Ansätze
- Verhaltensexperimente vorschlagen
- Realitätstests durchführen
- Alternative Perspektiven entwickeln
- Konkrete Beispiele erfragen

SAFEGUARDS:
- Bei Krisen: Sofort professionelle Hilfe empfehlen
- Keine Diagnosen stellen
- Bei Überforderung: Tempo drosseln

Führe jetzt ein CBT-basiertes therapeutisches Gespräch auf Deutsch. Stelle 1-2 gezielte Fragen pro Antwort."""
    }
]

# Globaler Emotionstracker für dynamische Bubbles
emotion_tracker = {
    "sessions": [],  # Speichert Sitzungsdaten (Zeitstempel, Text, Stimmung, Themen)
    "themes": {},    # Speichert Themenhäufigkeiten und Intensitäten
    "thought_patterns": {} # Speichert identifizierte Denkmuster und ihre Häufigkeit
}

# Endpunkte
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    global chat_history
    global emotion_tracker
    user_input = request.text.strip()

    if not user_input:
        return ChatResponse(
            response="Ich bin hier, um dir zuzuhören. Möchtest du mir erzählen, was dich beschäftigt?",
            mood="neutral",
            patterns=[]
        )

    # Sicherheitsprüfungen
    crisis_keywords = ["suizid", "selbstmord", "umbringen", "sterben wollen", "nicht mehr leben", 
                      "selbstverletzung", "ritzen", "schneiden", "schmerzen zufügen"]
    
    if any(keyword in user_input.lower() for keyword in crisis_keywords):
        mood = "krise"
        response_text = "Ich merke, dass du gerade in einer sehr schweren Zeit bist. Bitte wende dich sofort an professionelle Hilfe: Telefonseelsorge 0800 111 0 111 oder 0800 111 0 222 (kostenfrei, 24h). Du bist nicht allein, und es gibt Menschen, die dir helfen können."
        update_emotion_tracker(emotion_tracker, user_input, mood) # Corrected call
        thought_pattern = [] # Initialize for crisis case
    else:
        chat_history.append({"role": "user", "content": user_input})

        try:
            response = chat_with_llm(chat_history, CHAT_KITEGG_API_KEY)
            response_text = response.strip()
            chat_history.append({"role": "assistant", "content": response_text})
        except Exception as e:
            response_text = "Entschuldige, ich hatte einen kurzen Moment der Unaufmerksamkeit. Könntest du das nochmal sagen?"
            if chat_history and chat_history[-1]["role"] == "user": # Added check for non-empty chat_history
                chat_history.pop()


        # Analysiere Stimmung und Gedankenmuster
        mood = analyze_mood(user_input)
        thought_pattern = find_thought_patterns(user_input)
        # themes = extract_themes(user_input) # REMOVED - themes are handled in update_emotion_tracker

        # Aktualisiere Emotionstracker
        update_emotion_tracker(emotion_tracker, user_input, mood) # Corrected call


    return ChatResponse(
        response=response_text,
        mood=mood,
        patterns=thought_pattern # Corrected assignment
    )

@app.post("/transcribe")
async def process_transcription(file: UploadFile = File(...)):
    """Transkribiert Audiodatei und gibt Text zurück."""
    try:
        # Audio-Datei verarbeiten und transkribieren
        transcript = transcribe_audio(file)
        return {"success": True, "transcript": transcript}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)},
        )

@app.post("/speak")
async def process_speech_synthesis(text: str = Form(...)):
    """Generiert Sprachdatei aus Text und gibt URL zurück."""
    try:
        audio_url = synthesize_speech(text)
        return {"success": True, "audio_url": audio_url}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)},
        )

@app.get("/blobs")
async def get_blobs_data():
    global emotion_tracker
    # Ensure emotion_tracker is passed to calculate_blob_data
    blob_data = calculate_blob_data(emotion_tracker)
    return blob_data

@app.post("/analyze-face")
async def analyze_face(image: UploadFile = File(...)):
    """Analysiert ein Bild und erkennt die Emotion des Gesichts."""
    try:
        # Speichere das hochgeladene Bild temporär
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            temp_file_path = temp_file.name
            content = await image.read()
            temp_file.write(content)
        
        # In einer realen Anwendung würden wir hier OpenCV verwenden, um:
        # 1. Das Gesicht im Bild zu erkennen (cv2.CascadeClassifier)
        # 2. Das Gesicht für die Emotionsanalyse zu extrahieren
        # 3. Ein trainiertes Modell zu verwenden, um die Emotion zu bestimmen
        
        # Temporäre Datei löschen
        os.unlink(temp_file_path)
        
        # Simulierte Emotionserkennung für Demo-Zwecke 
        # In einer echten Anwendung würde hier ein ML-Modell verwendet werden
        emotions = {
            "freudig": random.uniform(0.0, 0.6),
            "traurig": random.uniform(0.0, 0.6),
            "wütend": random.uniform(0.0, 0.6),
            "überrascht": random.uniform(0.0, 0.6),
            "neutral": random.uniform(0.0, 0.6)
        }
        
        # Wähle eine Emotion zufällig aus und verstärke sie
        chosen_emotion = random.choice(list(emotions.keys()))
        emotions[chosen_emotion] += 0.4  # Erhöhe den Wert der gewählten Emotion
        
        # Normalisiere die Werte
        max_value = max(emotions.values())
        if max_value > 0:
            for emotion in emotions:
                emotions[emotion] = emotions[emotion] / max_value
                
        # Die Emotion mit dem höchsten Wert ist das Ergebnis
        max_emotion = max(emotions.items(), key=lambda x: x[1])[0]
        confidence = emotions[max_emotion]
        
        # Aktualisiere Emotionstracker im Backend
        update_emotion_tracker(emotion_tracker, f"Gesichtserkennung: {max_emotion}", max_emotion)
        
        return {
            "success": True,
            "emotion": max_emotion,
            "confidence": round(confidence, 2),
            "emotions": {k: round(v, 2) for k, v in emotions.items()}
        }
        
    except Exception as e:
        print(f"Fehler bei der Gesichtserkennung: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)},
        )

# Hauptfunktion zum Starten des Servers
if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
