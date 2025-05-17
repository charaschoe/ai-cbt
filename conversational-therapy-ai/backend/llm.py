# llm.py
# Schnittstelle zu Ollama LLM

import requests

def chat_with_llm(text: str) -> str:
    """Sendet Text an Ollama LLM und gibt die Antwort zurück."""
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "llama2", "prompt": text, "stream": False},
            timeout=30
        )
        data = response.json()
        return data.get("response", "[LLM keine Antwort]")
    except Exception as e:
        return f"[LLM Fehler: {e}]"
