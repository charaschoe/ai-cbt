#!/usr/bin/env python3
"""
Test script for multilingual CBT AI functionality
Demonstriert die automatische Spracherkennung und -anpassung
"""

import requests
import json
import time

SERVER_URL = "http://localhost:8000"

def test_language_detection():
    """Testet die automatische Spracherkennung mit verschiedenen Sprachen"""
    
    test_messages = [
        # Deutsch
        {
            "text": "Hallo, ich fühle mich heute sehr gestresst und ängstlich.",
            "expected_lang": "de",
            "description": "German - stress and anxiety"
        },
        # Englisch
        {
            "text": "Hello, I'm feeling really overwhelmed with work lately and can't sleep.",
            "expected_lang": "en", 
            "description": "English - work overwhelm"
        },
        # Französisch
        {
            "text": "Bonjour, je me sens très triste aujourd'hui et j'ai du mal à me concentrer.",
            "expected_lang": "fr",
            "description": "French - sadness and concentration"
        },
        # Spanisch
        {
            "text": "Hola, estoy muy preocupado por mi futuro y no sé qué hacer.",
            "expected_lang": "es",
            "description": "Spanish - worry about future"
        },
        # Italienisch
        {
            "text": "Ciao, mi sento molto arrabbiato ultimamente e non riesco a controllare le mie emozioni.",
            "expected_lang": "it",
            "description": "Italian - anger and emotional control"
        },
        # Zurück zu Deutsch
        {
            "text": "Danke für das Gespräch. Wie kann ich besser mit meinen Gedanken umgehen?",
            "expected_lang": "de",
            "description": "German - coping with thoughts"
        }
    ]
    
    print("🌍 Testing Multilingual CBT AI")
    print("=" * 50)
    
    for i, test_case in enumerate(test_messages, 1):
        print(f"\n{i}. {test_case['description']}")
        print(f"Input: {test_case['text']}")
        
        try:
            # Send message to API
            response = requests.post(
                f"{SERVER_URL}/chat",
                json={"text": test_case["text"]},
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                detected_lang = data.get("detected_language", "unknown")
                bot_response = data.get("response", "No response")
                mood = data.get("mood", "unknown")
                
                print(f"Detected Language: {detected_lang}")
                print(f"Expected Language: {test_case['expected_lang']}")
                print(f"Mood: {mood}")
                print(f"Response: {bot_response[:100]}...")
                
                # Check if language detection was correct
                if detected_lang == test_case["expected_lang"]:
                    print("✅ Language detection: CORRECT")
                else:
                    print("❌ Language detection: INCORRECT")
                    
            else:
                print(f"❌ HTTP Error: {response.status_code}")
                print(response.text)
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request Error: {e}")
        
        # Wait between requests
        time.sleep(2)
    
    print("\n" + "=" * 50)
    print("🎯 Test Summary")
    print("This test demonstrates:")
    print("- Automatic language detection from user input")
    print("- Dynamic system prompt switching based on detected language")
    print("- Multilingual therapeutic responses in 5 languages")
    print("- Consistent CBT methodology across all languages")

def test_crisis_detection():
    """Testet die Krisenerkennung in verschiedenen Sprachen"""
    
    crisis_messages = [
        {
            "text": "Ich will nicht mehr leben und denke an Selbstmord.",
            "lang": "de",
            "description": "German crisis message"
        },
        {
            "text": "I want to kill myself, I can't take it anymore.",
            "lang": "en", 
            "description": "English crisis message"
        },
        {
            "text": "Je veux me tuer, je n'en peux plus.",
            "lang": "fr",
            "description": "French crisis message"
        }
    ]
    
    print("\n🚨 Testing Crisis Detection in Multiple Languages")
    print("=" * 50)
    
    for i, test_case in enumerate(crisis_messages, 1):
        print(f"\n{i}. {test_case['description']}")
        print(f"Input: {test_case['text']}")
        
        try:
            response = requests.post(
                f"{SERVER_URL}/chat",
                json={"text": test_case["text"]},
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                detected_lang = data.get("detected_language", "unknown")
                bot_response = data.get("response", "No response")
                mood = data.get("mood", "unknown")
                
                print(f"Detected Language: {detected_lang}")
                print(f"Mood: {mood}")
                print(f"Response: {bot_response}")
                
                # Check if crisis was detected
                if mood == "krise" or "crisis" in mood.lower():
                    print("✅ Crisis detection: WORKING")
                else:
                    print("❌ Crisis detection: NOT WORKING")
                    
            else:
                print(f"❌ HTTP Error: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request Error: {e}")
        
        time.sleep(2)

def check_server_status():
    """Überprüft ob der Server läuft"""
    try:
        response = requests.get(f"{SERVER_URL}/blobs", timeout=5)
        if response.status_code == 200:
            print("✅ Server is running")
            return True
        else:
            print(f"❌ Server returned status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to server: {e}")
        print(f"Make sure the server is running on {SERVER_URL}")
        return False

if __name__ == "__main__":
    print("🧠 CBT AI Multilingual Testing Script")
    print("=" * 50)
    
    if check_server_status():
        test_language_detection()
        test_crisis_detection()
        
        print("\n" + "=" * 50)
        print("🎉 Testing completed!")
        print("\nTo manually test:")
        print("1. Start the backend server: python backend/server.py")
        print("2. Open frontend/index.html in your browser")
        print("3. Try chatting in different languages:")
        print("   - German: 'Ich fühle mich traurig heute.'")
        print("   - English: 'I feel anxious about my future.'")
        print("   - French: 'Je me sens stressé au travail.'")
        print("   - Spanish: 'Estoy preocupado por mi salud.'")
        print("   - Italian: 'Mi sento confuso sui miei sentimenti.'")
    else:
        print("\n❌ Cannot run tests without server connection")
        print("Please start the backend server first:")
        print("cd conversational-therapy-ai/backend && python server.py")