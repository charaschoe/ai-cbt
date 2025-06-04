# language_detection.py
# Spracherkennung und mehrsprachige CBT-System-Prompts

import re
from typing import Dict, Tuple

def detect_language(text: str) -> str:
    """
    Erkennt die Sprache des eingegebenen Texts basierend auf sprachspezifischen Indikatoren.
    Unterstützt: Deutsch, Englisch, Französisch, Spanisch, Italienisch
    """
    if not text or len(text.strip()) < 3:
        return "de"  # Default zu Deutsch
    
    text_lower = text.lower()
    
    # Sprachspezifische Wörter und Muster
    language_indicators = {
        "de": {
            "common_words": ["ich", "bin", "das", "ist", "und", "der", "die", "ein", "eine", "mit", "für", "auf", "nicht", "von", "zu", "sich", "haben", "werden", "sein", "was", "wie", "wenn", "aber", "auch", "nur", "kann", "mich", "mir", "mein", "meine", "heute", "gestern", "morgen", "sehr", "gut", "schlecht", "fühle", "denke", "weil", "dass", "sollte", "könnte", "würde"],
            "patterns": [r"\b(ä|ö|ü|ß)\b", r"ch\b", r"\bst\b", r"ung\b", r"keit\b", r"lich\b"],
            "weight": 0
        },
        "en": {
            "common_words": ["i", "am", "is", "the", "and", "of", "to", "a", "in", "that", "have", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us", "feel", "should", "very"],
            "patterns": [r"\bthe\b", r"\band\b", r"ing\b", r"tion\b", r"ly\b"],
            "weight": 0
        },
        "fr": {
            "common_words": ["je", "suis", "est", "le", "la", "les", "un", "une", "de", "du", "des", "et", "à", "ce", "qui", "que", "pour", "avec", "sur", "dans", "par", "ne", "pas", "se", "me", "te", "nous", "vous", "ils", "elles", "mon", "ma", "mes", "ton", "ta", "tes", "son", "sa", "ses", "notre", "votre", "leur", "leurs", "très", "bien", "mal", "aujourd'hui", "hier", "demain", "parce", "que", "comme", "si", "mais", "aussi", "seulement", "peut", "dois", "peux", "veux", "sens", "pense"],
            "patterns": [r"ç", r"é|è|ê|ë", r"à|â", r"ô", r"û|ù", r"ï|î", r"\bqu\b", r"tion\b", r"ment\b"],
            "weight": 0
        },
        "es": {
            "common_words": ["yo", "soy", "es", "el", "la", "los", "las", "un", "una", "de", "del", "y", "a", "en", "que", "para", "con", "por", "se", "me", "te", "nos", "os", "le", "les", "mi", "tu", "su", "nuestro", "vuestro", "muy", "bien", "mal", "hoy", "ayer", "mañana", "porque", "como", "si", "pero", "también", "solo", "puede", "debo", "puedo", "quiero", "siento", "pienso", "estoy", "tengo"],
            "patterns": [r"ñ", r"á|é|í|ó|ú", r"ción\b", r"mente\b", r"\bque\b"],
            "weight": 0
        },
        "it": {
            "common_words": ["io", "sono", "è", "il", "la", "i", "le", "un", "una", "di", "del", "della", "e", "a", "in", "che", "per", "con", "da", "si", "mi", "ti", "ci", "vi", "lo", "gli", "mio", "tuo", "suo", "nostro", "vostro", "molto", "bene", "male", "oggi", "ieri", "domani", "perché", "come", "se", "ma", "anche", "solo", "può", "devo", "posso", "voglio", "sento", "penso", "sto", "ho"],
            "patterns": [r"zione\b", r"mente\b", r"gli\b", r"gn", r"\bche\b"],
            "weight": 0
        }
    }
    
    # Punkte für jede Sprache berechnen
    for lang, indicators in language_indicators.items():
        score = 0
        
        # Häufige Wörter zählen
        words = re.findall(r'\b\w+\b', text_lower)
        for word in words:
            if word in indicators["common_words"]:
                score += 2
        
        # Sprachmuster prüfen
        for pattern in indicators["patterns"]:
            matches = len(re.findall(pattern, text_lower))
            score += matches * 1.5
        
        language_indicators[lang]["weight"] = score
    
    # Sprache mit höchstem Score zurückgeben
    detected_lang = max(language_indicators.keys(), 
                       key=lambda x: language_indicators[x]["weight"])
    
    # Mindestpunktzahl für Erkennung
    if language_indicators[detected_lang]["weight"] < 3:
        return "de"  # Default zu Deutsch bei unsicherer Erkennung
    
    return detected_lang


def get_system_prompt(language: str) -> str:
    """
    Gibt den CBT-System-Prompt in der angegebenen Sprache zurück.
    """
    prompts = {
        "de": """Du bist ein professioneller CBT-Therapeut (Kognitive Verhaltenstherapie). Führe ein therapeutisches Gespräch nach CBT-Prinzipien.

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

Führe jetzt ein CBT-basiertes therapeutisches Gespräch auf Deutsch. Stelle 1-2 gezielte Fragen pro Antwort.""",

        "en": """You are a professional CBT therapist (Cognitive Behavioral Therapy). Conduct a therapeutic conversation following CBT principles.

CBT CONVERSATION GUIDANCE:
- Ask open, explorative questions (What, How, When instead of Why)
- Systematically explore thoughts, feelings, and behaviors
- Use Socratic questioning technique
- Gently identify cognitive distortions
- Help recognize thought-feeling-behavior cycles
- Work with concrete situations and examples

THERAPEUTIC STANCE:
- Empathetic and non-judgmental
- Collaborative (we work together)
- Structured but warm
- Validate feelings, question thoughts
- Focus on here and now

TECHNIQUES:
- Thought record approaches
- Suggest behavioral experiments
- Conduct reality tests
- Develop alternative perspectives
- Ask for concrete examples

SAFEGUARDS:
- In crises: Immediately recommend professional help
- Don't make diagnoses
- When overwhelmed: Slow down the pace

Now conduct a CBT-based therapeutic conversation in English. Ask 1-2 targeted questions per response.""",

        "fr": """Tu es un thérapeute CBT professionnel (Thérapie Cognitive et Comportementale). Mène une conversation thérapeutique selon les principes CBT.

GUIDANCE DE CONVERSATION CBT:
- Pose des questions ouvertes et exploratoires (Quoi, Comment, Quand au lieu de Pourquoi)
- Explore systématiquement les pensées, sentiments et comportements
- Utilise la technique de questionnement socratique
- Identifie délicatement les distorsions cognitives
- Aide à reconnaître les cycles pensée-sentiment-comportement
- Travaille avec des situations et exemples concrets

ATTITUDE THÉRAPEUTIQUE:
- Empathique et sans jugement
- Collaborative (nous travaillons ensemble)
- Structurée mais chaleureuse
- Valide les sentiments, questionne les pensées
- Focus sur l'ici et maintenant

TECHNIQUES:
- Approches de journal de pensées
- Suggérer des expériences comportementales
- Effectuer des tests de réalité
- Développer des perspectives alternatives
- Demander des exemples concrets

SÉCURITÉS:
- En cas de crise: Recommander immédiatement une aide professionnelle
- Ne pas faire de diagnostics
- En cas de surcharge: Ralentir le rythme

Mène maintenant une conversation thérapeutique basée sur la CBT en français. Pose 1-2 questions ciblées par réponse.""",

        "es": """Eres un terapeuta TCC profesional (Terapia Cognitivo-Conductual). Conduce una conversación terapéutica siguiendo los principios TCC.

GUÍA DE CONVERSACIÓN TCC:
- Haz preguntas abiertas y exploratorias (Qué, Cómo, Cuándo en lugar de Por qué)
- Explora sistemáticamente pensamientos, sentimientos y comportamientos
- Usa la técnica de cuestionamiento socrático
- Identifica suavemente las distorsiones cognitivas
- Ayuda a reconocer los ciclos pensamiento-sentimiento-comportamiento
- Trabaja con situaciones y ejemplos concretos

ACTITUD TERAPÉUTICA:
- Empática y sin juicios
- Colaborativa (trabajamos juntos)
- Estructurada pero cálida
- Valida sentimientos, cuestiona pensamientos
- Enfoque en el aquí y ahora

TÉCNICAS:
- Enfoques de registro de pensamientos
- Sugerir experimentos conductuales
- Realizar pruebas de realidad
- Desarrollar perspectivas alternativas
- Pedir ejemplos concretos

SALVAGUARDAS:
- En crisis: Recomendar inmediatamente ayuda profesional
- No hacer diagnósticos
- Cuando hay sobrecarga: Reducir el ritmo

Ahora conduce una conversación terapéutica basada en TCC en español. Haz 1-2 preguntas específicas por respuesta.""",

        "it": """Sei un terapeuta TCC professionale (Terapia Cognitivo-Comportamentale). Conduci una conversazione terapeutica seguendo i principi TCC.

GUIDA ALLA CONVERSAZIONE TCC:
- Fai domande aperte ed esplorative (Cosa, Come, Quando invece di Perché)
- Esplora sistematicamente pensieri, sentimenti e comportamenti
- Usa la tecnica del questionamento socratico
- Identifica delicatamente le distorsioni cognitive
- Aiuta a riconoscere i cicli pensiero-sentimento-comportamento
- Lavora con situazioni ed esempi concreti

ATTEGGIAMENTO TERAPEUTICO:
- Empatico e non giudicante
- Collaborativo (lavoriamo insieme)
- Strutturato ma caloroso
- Valida i sentimenti, questiona i pensieri
- Focus su qui e ora

TECNICHE:
- Approcci di diario dei pensieri
- Suggerire esperimenti comportamentali
- Condurre test di realtà
- Sviluppare prospettive alternative
- Chiedere esempi concreti

SALVAGUARDIE:
- In crisi: Raccomandare immediatamente aiuto professionale
- Non fare diagnosi
- Quando sovraccarico: Rallentare il ritmo

Ora conduci una conversazione terapeutica basata sulla TCC in italiano. Fai 1-2 domande mirate per risposta."""
    }
    
    return prompts.get(language, prompts["de"])


def get_crisis_response(language: str) -> str:
    """
    Gibt eine krisenspezifische Antwort in der angegebenen Sprache zurück.
    """
    crisis_responses = {
        "de": "Ich merke, dass du gerade in einer sehr schweren Zeit bist. Bitte wende dich sofort an professionelle Hilfe: Telefonseelsorge 0800 111 0 111 oder 0800 111 0 222 (kostenfrei, 24h). Du bist nicht allein, und es gibt Menschen, die dir helfen können.",
        
        "en": "I notice you're going through a very difficult time right now. Please reach out to professional help immediately: National Suicide Prevention Lifeline 988 (free, 24/7). You are not alone, and there are people who can help you.",
        
        "fr": "Je remarque que tu traverses une période très difficile en ce moment. S'il te plaît, contacte immédiatement une aide professionnelle: SOS Amitié 09 72 39 40 50 (gratuit, 24h/24). Tu n'es pas seul(e), et il y a des personnes qui peuvent t'aider.",
        
        "es": "Noto que estás pasando por un momento muy difícil ahora mismo. Por favor, busca ayuda profesional inmediatamente: Teléfono de la Esperanza 717 003 717 (gratuito, 24h). No estás solo/a, y hay personas que pueden ayudarte.",
        
        "it": "Noto che stai attraversando un momento molto difficile in questo momento. Per favore, cerca aiuto professionale immediatamente: Telefono Amico 02 2327 2327 (gratuito, 24h). Non sei solo/a, e ci sono persone che possono aiutarti."
    }
    
    return crisis_responses.get(language, crisis_responses["de"])


def get_empty_input_response(language: str) -> str:
    """
    Gibt eine Antwort für leere Eingaben in der angegebenen Sprache zurück.
    """
    empty_responses = {
        "de": "Ich bin hier, um dir zuzuhören. Möchtest du mir erzählen, was dich beschäftigt?",
        "en": "I'm here to listen to you. Would you like to tell me what's on your mind?",
        "fr": "Je suis là pour t'écouter. Voudrais-tu me dire ce qui te préoccupe?",
        "es": "Estoy aquí para escucharte. ¿Te gustaría contarme qué te preocupa?",
        "it": "Sono qui per ascoltarti. Vorresti raccontarmi cosa ti preoccupa?"
    }
    
    return empty_responses.get(language, empty_responses["de"])


def get_crisis_keywords(language: str) -> list:
    """
    Gibt eine Liste von Krisen-Schlüsselwörtern in der angegebenen Sprache zurück.
    """
    crisis_keywords = {
        "de": ["suizid", "selbstmord", "umbringen", "sterben wollen", "nicht mehr leben", 
               "selbstverletzung", "ritzen", "schneiden", "schmerzen zufügen", "töten"],
        
        "en": ["suicide", "kill myself", "end my life", "want to die", "don't want to live",
               "self-harm", "cutting", "hurt myself", "take my life", "overdose"],
        
        "fr": ["suicide", "me tuer", "finir ma vie", "veux mourir", "veux plus vivre",
               "automutilation", "me couper", "me faire mal", "overdose", "en finir"],
        
        "es": ["suicidio", "matarme", "quitarme la vida", "quiero morir", "no quiero vivir",
               "autolesión", "cortarme", "hacerme daño", "sobredosis", "acabar"],
        
        "it": ["suicidio", "uccidermi", "togliermi la vita", "voglio morire", "non voglio vivere",
               "autolesionismo", "tagliarmi", "farmi male", "overdose", "farla finita"]
    }
    
    return crisis_keywords.get(language, crisis_keywords["de"])