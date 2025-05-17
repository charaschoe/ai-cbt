# server.py
# FastAPI-Server für Conversational Therapy AI

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llm import chat_with_llm
from speech_to_text import transcribe_audio
from text_to_speech import synthesize_speech
from analysis import analyze_mood, find_thought_patterns

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Conversational Therapy AI Backend läuft!"}

class ChatRequest(BaseModel):
    text: str

@app.post("/chat")
def chat(req: ChatRequest):
    llm_response = chat_with_llm(req.text)
    mood = analyze_mood(req.text)
    patterns = find_thought_patterns(req.text)
    return {"response": llm_response, "mood": mood, "patterns": patterns}

@app.post("/transcribe")
def transcribe(file: UploadFile = File(...)):
    text = transcribe_audio(file)
    mood = analyze_mood(text)
    patterns = find_thought_patterns(text)
    return {"transcript": text, "mood": mood, "patterns": patterns}

class SpeakRequest(BaseModel):
    text: str

@app.post("/speak")
def speak(req: SpeakRequest):
    audio_url = synthesize_speech(req.text)
    return {"audio_url": audio_url}
