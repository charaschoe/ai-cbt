# llm.py
# Schnittstelle zum LLM API

import requests
import json # Added for potential future use, though not strictly necessary for current implementation

def chat_with_llm(messages: list, api_key: str) -> str:
    """Sendet Nachrichten an das LLM API und gibt die Antwort zurück."""
    url = "https://chat1.kitegg.de/api/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "Qwen/Qwen3-32B",
        "messages": messages,
        "stream": False,
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()  # Raises an HTTPError for bad responses (4XX or 5XX)

        data = response.json()
        
        if data.get("choices") and len(data["choices"]) > 0:
            first_choice = data["choices"][0]
            if first_choice.get("message") and first_choice["message"].get("content"):
                return first_choice["message"]["content"]
            else:
                return "[LLM API Error: Antwortformat unerwartet - fehlender Inhalt]"
        else:
            return "[LLM API Error: Antwortformat unerwartet - keine Auswahlmöglichkeiten]"

    except requests.exceptions.HTTPError as http_err:
        # Attempt to get more details from the response body if available
        error_detail = ""
        try:
            error_content = response.json()
            error_detail = f" - Details: {json.dumps(error_content)}"
        except json.JSONDecodeError:
            error_detail = f" - Details: {response.text}" # Fallback to raw text if not JSON
        return f"[LLM API HTTP Error: {http_err}{error_detail}]"
    except requests.exceptions.RequestException as req_err:
        return f"[LLM Network Error: {req_err}]"
    except Exception as e:
        # Catch any other unexpected errors
        return f"[LLM Unexpected Error: {e}]"
