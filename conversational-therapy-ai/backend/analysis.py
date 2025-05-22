# analysis.py
# Mood Detection & Thought Pattern Recognition

def analyze_mood(text: str) -> str:
    """Erweiterte Stimmungsanalyse mit mehr Kategorien."""
    text_lower = text.lower()
    
    # Krisenstimmungen
    if any(w in text_lower for w in ["suizid", "selbstmord", "sterben", "nicht mehr leben"]):
        return "krise"
    
    # Negative Stimmungen
    if any(w in text_lower for w in ["traurig", "depressiv", "schlecht", "hoffnungslos", "verzweifelt", 
                                    "ängstlich", "wütend", "einsam", "müde", "erschöpft"]):
        return "negativ"
    
    # Positive Stimmungen
    if any(w in text_lower for w in ["glücklich", "zufrieden", "gut", "freude", "dankbar", 
                                    "optimistisch", "entspannt", "energiegeladen"]):
        return "positiv"
    
    # Gemischte/neutrale Stimmungen
    if any(w in text_lower for w in ["verwirrt", "unentschlossen", "gemischt", "durcheinander"]):
        return "gemischt"
        
    return "neutral"

def extract_themes(text: str) -> dict:
    """Extrahiert emotionale Themen aus dem Text."""
    themes = {}
    text_lower = text.lower()
    
    # Arbeit & Karriere
    work_keywords = ["arbeit", "job", "beruf", "chef", "kollegen", "stress", "überstunden", "büro", "karriere"]
    if any(keyword in text_lower for keyword in work_keywords):
        themes["Arbeit & Stress"] = 1
    
    # Beziehungen
    relationship_keywords = ["partner", "freund", "familie", "beziehung", "streit", "trennung", "liebe", "verlassen"]
    if any(keyword in text_lower for keyword in relationship_keywords):
        themes["Beziehungen"] = 1
    
    # Selbstwert
    selfworth_keywords = ["versagen", "unfähig", "wertlos", "dumm", "nicht gut genug", "schlecht", "schuld"]
    if any(keyword in text_lower for keyword in selfworth_keywords):
        themes["Selbstwert"] = 1
    
    # Zukunftsangst
    future_keywords = ["zukunft", "angst", "sorge", "was wird", "schaffe ich", "versagen", "prüfung"]
    if any(keyword in text_lower for keyword in future_keywords):
        themes["Zukunftsängste"] = 1
    
    # Einsamkeit
    loneliness_keywords = ["einsam", "allein", "niemand", "isoliert", "kontakt", "freunde"]
    if any(keyword in text_lower for keyword in loneliness_keywords):
        themes["Einsamkeit"] = 1
    
    # Gesundheit
    health_keywords = ["krank", "müde", "erschöpft", "schmerzen", "gesundheit", "schlaf"]
    if any(keyword in text_lower for keyword in health_keywords):
        themes["Gesundheit"] = 1
    
    return themes

from datetime import datetime, timedelta

def find_thought_patterns(text: str) -> list:
    """Erweiterte Mustererkennung für kognitive Verzerrungen."""
    patterns = []
    text_lower = text.lower()
    
    # Kognitive Verzerrungen erkennen
    if "immer" in text_lower or "nie" in text_lower or "alles" in text_lower or "nichts" in text_lower:
        patterns.append("Schwarz-Weiß-Denken")
    
    if "muss" in text_lower or "sollte" in text_lower or "müsste" in text_lower:
        patterns.append("Muss-Denken")
    
    if "katastrophe" in text_lower or "schrecklich" in text_lower or "furchtbar" in text_lower:
        patterns.append("Katastrophisieren")
    
    if "alle denken" in text_lower or "jeder sagt" in text_lower or "niemand mag" in text_lower:
        patterns.append("Gedankenlesen")
    
    if "kann nicht" in text_lower or "schaffe es nicht" in text_lower or "bin unfähig" in text_lower:
        patterns.append("Selbstabwertung")
    
    if "wenn nur" in text_lower or "hätte ich" in text_lower or "wäre ich" in text_lower:
        patterns.append("Grübeln")
    
    return patterns

def calculate_blob_data(emotion_tracker: dict) -> dict:
    """Berechnet dynamische Blob-Daten basierend auf Chat-Verlauf."""
    blob_data = {}
    
    # Standard-Bubbles falls noch keine Daten vorhanden
    if not emotion_tracker.get("themes") or len(emotion_tracker["themes"]) == 0:
        return {
            "Willkommen": {
                "size": 40, 
                "transparency": 0.6, 
                "color": "#8ef",
                "frequency": 1,
                "intensity": 0.5
            },
            "Wie geht es dir?": {
                "size": 35, 
                "transparency": 0.5, 
                "color": "#8f8",
                "frequency": 1,
                "intensity": 0.5
            }
        }
    
    # Berechne Bubble-Größen basierend auf Häufigkeit und Intensität
    for theme, data in emotion_tracker["themes"].items():
        frequency = data.get("count", 0)
        avg_intensity = data.get("avg_intensity", 0.5)
        
        # Größe basiert auf Häufigkeit (20-100px)
        size = min(100, max(20, 20 + frequency * 15))
        
        # Transparenz basiert auf durchschnittlicher Intensität
        transparency = min(1.0, max(0.3, avg_intensity))
        
        # Farbe basiert auf Thema
        color_map = {
            "Arbeit & Stress": "#ff6b6b",
            "Beziehungen": "#ff8cc8", 
            "Selbstwert": "#ffd93d",
            "Zukunftsängste": "#6bcf7f",
            "Einsamkeit": "#4d96ff",
            "Gesundheit": "#95e1d3"
        }
        
        blob_data[theme] = {
            "size": size,
            "transparency": transparency,
            "color": color_map.get(theme, "#ddd"),
            "frequency": frequency,  # Frequenz für das Frontend hinzugefügt
            "intensity": avg_intensity  # Intensität für das Frontend hinzugefügt
        }
    
    return blob_data

def update_emotion_tracker(emotion_tracker: dict, user_text: str, mood: str) -> dict:
    """Aktualisiert den Emotionstracker mit neuen Chat-Daten."""
    
    # Themen extrahieren
    themes = extract_themes(user_text)
    
    # Session-Daten hinzufügen
    from datetime import datetime
    session_data = {
        "timestamp": datetime.now().isoformat(),
        "text": user_text,
        "mood": mood,
        "themes": list(themes.keys())
    }
    emotion_tracker["sessions"].append(session_data)
    
    # Themen-Häufigkeiten und Intensitäten aktualisieren
    for theme in themes:
        if theme not in emotion_tracker["themes"]:
            emotion_tracker["themes"][theme] = {
                "count": 0,
                "intensities": [],
                "avg_intensity": 0.0
            }
        
        # Intensität basierend auf Stimmung berechnen
        intensity_map = {
            "krise": 1.0,
            "negativ": 0.8,
            "gemischt": 0.5,
            "neutral": 0.3,
            "positiv": 0.2
        }
        
        intensity = intensity_map.get(mood, 0.5)
        emotion_tracker["themes"][theme]["count"] += 1
        emotion_tracker["themes"][theme]["intensities"].append(intensity)
        
        # Durchschnittsintensität neu berechnen
        intensities = emotion_tracker["themes"][theme]["intensities"]
        emotion_tracker["themes"][theme]["avg_intensity"] = sum(intensities) / len(intensities)
    
    return emotion_tracker
