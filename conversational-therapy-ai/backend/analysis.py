# analysis.py
# Mood Detection & Thought Pattern Recognition

def analyze_mood(text: str) -> str:
    """Einfache Stimmungsanalyse (Dummy)."""
    if any(w in text.lower() for w in ["traurig", "depressiv", "schlecht"]):
        return "negativ"
    if any(w in text.lower() for w in ["glücklich", "zufrieden", "gut"]):
        return "positiv"
    return "neutral"

from datetime import datetime, timedelta

def find_thought_patterns(text: str) -> list:
    """Einfache Mustererkennung (Dummy)."""
    patterns = []
    if "immer" in text or "nie" in text:
        patterns.append("Schwarz-Weiß-Denken")
    if "muss" in text:
        patterns.append("Muss-Denken")
    return patterns

def calculate_blob_data() -> dict:
    """Calculates dynamic blob data based on emotion severity and recency."""
    # Example data structure for demonstration
    return {
        "Grief": {"size": 80, "transparency": 0.8},
        "Joy": {"size": 50, "transparency": 0.5},
        "Anxiety": {"size": 70, "transparency": 0.7},
    }
    """Einfache Mustererkennung (Dummy)."""
    patterns = []
    if "immer" in text or "nie" in text:
        patterns.append("Schwarz-Weiß-Denken")
    if "muss" in text:
        patterns.append("Muss-Denken")
    return patterns
