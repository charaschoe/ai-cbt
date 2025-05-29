// Chat service to handle AI interactions
class ChatService {
  constructor() {
    this.baseUrl = 'http://localhost:8000'; // FastAPI backend server URL
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
      return data.response || 'I\'m here to help. Can you tell me more about how you\'re feeling?';
    } catch (error) {
      console.error('❌ Error sending message:', error);
      console.log('Using fallback response instead');
      // Return a fallback response when backend is not available
      return this.getFallbackResponse(message);
    }
  }

  getFallbackResponse(message) {
    const fallbackResponses = [
      "I understand you're going through something difficult. Can you tell me more about what's on your mind?",
      "Thank you for sharing that with me. How are you feeling right now?",
      "It sounds like you're dealing with a lot. What would be most helpful for you to talk about today?",
      "I'm here to listen and support you. What's been weighing on you lately?",
      "That's a lot to process. How has this been affecting your daily life?",
    ];
    
    // Simple hash to pick a consistent response based on message length
    const index = message.length % fallbackResponses.length;
    return fallbackResponses[index];
  }

  async startConversation() {
    return "Tell me, what's on your mind?";
  }
}

export default new ChatService();
