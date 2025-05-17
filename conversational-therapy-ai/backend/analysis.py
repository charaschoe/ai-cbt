# analysis.py
# Mood Detection & Thought Pattern Recognition

def analyze_mood(text: str) -> str:
    """Einfache Stimmungsanalyse (Dummy)."""
    if any(w in text.lower() for w in ["traurig", "depressiv", "schlecht"]):
        return "negativ"
    if any(w in text.lower() for w in ["glücklich", "zufrieden", "gut"]):
        return "positiv"
    return "neutral"

def find_thought_patterns(text: str) -> list:
    """Einfache Mustererkennung (Dummy)."""
    patterns = []
    if "immer" in text or "nie" in text:
        patterns.append("Schwarz-Weiß-Denken")
    if "muss" in text:
        patterns.append("Muss-Denken")
    return patterns
