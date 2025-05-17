# server.py
# FastAPI-Server für Conversational Therapy AI

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .llm import chat_with_llm
from .speech_to_text import transcribe_audio
from .text_to_speech import synthesize_speech
from .analysis import analyze_mood, find_thought_patterns, calculate_blob_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],  # Replace with trusted domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred. Please try again later."},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={"message": "Invalid input. Please check your data and try again."},
    )

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

@app.get("/blobs")
def get_blobs():
    """Returns dynamic blob data for the frontend."""
    return calculate_blob_data()

class SpeakRequest(BaseModel):
    text: str

@app.post("/speak")
def speak(req: SpeakRequest):
    audio_url = synthesize_speech(req.text)
    return {"audio_url": audio_url}
