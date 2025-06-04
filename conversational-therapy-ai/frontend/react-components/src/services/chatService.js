// Chat service to handle AI interactions with multilingual support
class ChatService {
  constructor() {
    this.baseUrl = 'http://localhost:8000'; // FastAPI backend server URL
    this.currentLanguage = 'de'; // Default language
    this.onLanguageChange = null; // Callback for language changes
  }

  // Helper function to make responses more focused and shorter
  processResponse(rawResponse) {
    if (!rawResponse) return rawResponse;
    
    // Split into sentences
    const sentences = rawResponse.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // If response has more than 3 sentences, keep only the most relevant ones
    if (sentences.length > 3) {
      // Keep first sentence and last 2 sentences for continuity
      const processedSentences = [
        sentences[0],
        ...sentences.slice(-2)
      ];
      return processedSentences.join('. ').trim() + '.';
    }
    
    // If response has multiple questions, limit to max 2 questions
    let questionCount = 0;
    const filteredSentences = sentences.filter(sentence => {
      const isQuestion = sentence.includes('?');
      if (isQuestion) {
        questionCount++;
        return questionCount <= 2; // Keep only first 2 questions
      }
      return true;
    });
    
    return filteredSentences.join('. ').trim() + '.';
  }

  async sendMessage(message) {
    console.log('Sending message to backend:', message);
    console.log('Backend URL:', `${this.baseUrl}/chat`);
    
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message }), // FastAPI expects 'text' field
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Backend response received:', data); // Debug log
      
      // Handle language detection and update
      if (data.detected_language && data.detected_language !== this.currentLanguage) {
        this.currentLanguage = data.detected_language;
        console.log('🌍 Language detected:', this.currentLanguage);
        
        // Notify listeners about language change
        if (this.onLanguageChange) {
          this.onLanguageChange(this.currentLanguage);
        }
      }
      
      // Process response to make it more focused
      const processedResponse = this.processResponse(data.response) || this.getFallbackResponse(message);
      
      return {
        response: processedResponse,
        mood: data.mood || 'neutral',
        patterns: data.patterns || [],
        detectedLanguage: data.detected_language || this.currentLanguage
      };
    } catch (error) {
      console.error('❌ Error sending message:', error);
      console.log('Using fallback response instead');
      // Return a fallback response when backend is not available
      return {
        response: this.getFallbackResponse(message),
        mood: 'neutral',
        patterns: [],
        detectedLanguage: this.currentLanguage
      };
    }
  }

  getFallbackResponse(message) {
    // Shorter, more focused multilingual fallback responses
    const fallbackResponses = {
      de: [
        "Ich höre dir zu. Was beschäftigt dich gerade am meisten?",
        "Das klingt herausfordernd. Magst du mir mehr dazu erzählen?",
        "Wie geht es dir mit dieser Situation?",
        "Was denkst du, könnte dir jetzt helfen?",
        "Ich verstehe. Wie fühlst du dich dabei?",
        "Das ist nicht einfach. Was war heute besonders schwer?",
        "Danke fürs Teilen. Was würdest du gerne als nächstes besprechen?"
      ],
      en: [
        "I'm listening. What's weighing on you most right now?",
        "That sounds challenging. Can you tell me more?",
        "How are you feeling about this situation?",
        "What do you think might help you right now?",
        "I understand. How does that make you feel?",
        "That's not easy. What was particularly difficult today?",
        "Thank you for sharing. What would you like to explore next?"
      ],
      fr: [
        "Je t'écoute. Qu'est-ce qui te préoccupe le plus en ce moment?",
        "Cela semble difficile. Peux-tu m'en dire plus?",
        "Comment te sens-tu face à cette situation?",
        "Qu'est-ce qui pourrait t'aider maintenant?",
        "Je comprends. Comment cela te fait-il ressentir?",
        "Ce n'est pas facile. Qu'est-ce qui a été particulièrement dur aujourd'hui?",
        "Merci de partager. Que veux-tu explorer ensuite?"
      ],
      es: [
        "Te escucho. ¿Qué es lo que más te preocupa ahora?",
        "Eso suena desafiante. ¿Puedes contarme más?",
        "¿Cómo te sientes sobre esta situación?",
        "¿Qué crees que podría ayudarte ahora?",
        "Entiendo. ¿Cómo te hace sentir eso?",
        "No es fácil. ¿Qué fue particularmente difícil hoy?",
        "Gracias por compartir. ¿Qué te gustaría explorar después?"
      ],
      it: [
        "Ti ascolto. Cosa ti preoccupa di più in questo momento?",
        "Sembra difficile. Puoi dirmi di più?",
        "Come ti senti riguardo a questa situazione?",
        "Cosa pensi che potrebbe aiutarti ora?",
        "Capisco. Come ti fa sentire?",
        "Non è facile. Cosa è stato particolarmente difficile oggi?",
        "Grazie per aver condiviso. Cosa vorresti esplorare dopo?"
      ]
    };
    
    const responses = fallbackResponses[this.currentLanguage] || fallbackResponses.en;
    const index = message.length % responses.length;
    return responses[index];
  }

  async startConversation() {
    const welcomeMessages = {
      de: "Erzähl mir, was dich beschäftigt?",
      en: "Tell me, what's on your mind?",
      fr: "Dis-moi, qu'est-ce qui te préoccupe?",
      es: "Dime, ¿qué tienes en mente?",
      it: "Dimmi, cosa hai in mente?"
    };
    
    return welcomeMessages[this.currentLanguage] || welcomeMessages.en;
  }

  // Method to set language change callback
  setLanguageChangeCallback(callback) {
    this.onLanguageChange = callback;
  }

  // Method to get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Method to manually set language
  setLanguage(language) {
    this.currentLanguage = language;
    if (this.onLanguageChange) {
      this.onLanguageChange(language);
    }
  }

  // Method to get language display name
  getLanguageDisplayName(language = this.currentLanguage) {
    const languageNames = {
      de: "Deutsch",
      en: "English",
      fr: "Français",
      es: "Español",
      it: "Italiano"
    };
    return languageNames[language] || language;
  }
}

export default new ChatService();
