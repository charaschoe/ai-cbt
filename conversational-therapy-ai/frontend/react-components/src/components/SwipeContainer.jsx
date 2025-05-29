import React, { useState } from 'react';
import './SwipeContainer.css';
import ChatFlow from './ChatFlow';
import WidgetsLeft from './WidgetsLeft';
import { ChatFlow05 } from './ChatFlow05';
import { ChatFlow07 } from './ChatFlow07';
import chatService from '../services/chatService';

const SwipeContainer = () => {
  const [currentScreen, setCurrentScreen] = useState('chat'); // 'widgets', 'chat', 'chatflow05', or 'chatflow07'
  const [aiResponse, setAiResponse] = useState('');

  const showWidgets = () => setCurrentScreen('widgets');
  const showChat = () => setCurrentScreen('chat');
  const toggleChatFlow = () => {
    if (currentScreen === 'chatflow05') {
      setCurrentScreen('chatflow07');
    } else if (currentScreen === 'chatflow07') {
      setCurrentScreen('chat');
    } else {
      setCurrentScreen('chatflow05');
    }
  };

  // Get AI response when navigating to ChatFlow07
  const handleNavigateToChat = async () => {
    setCurrentScreen('chatflow07');
    try {
      const response = await chatService.startConversation();
      setAiResponse(response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setAiResponse('Hi Anna, I\'m here to help you. What\'s on your mind today?');
    }
  };

  // Handle sending a message in chat mode
  const handleSendMessage = async (message) => {
    try {
      const response = await chatService.sendMessage(message);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      return 'I\'m sorry, I\'m having trouble connecting right now. Please try again.';
    }
  };

  return (
    <div className="swipe-container-wrapper">
      {/* Debug Chat Button */}
      <button 
        onClick={handleNavigateToChat}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#007AFF',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 16px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)'
        }}
      >
        💬 Start Chat
      </button>
      
      <div className="simple-container">
        {currentScreen === 'widgets' && (
          <div className="screen active">
            <WidgetsLeft />
          </div>
        )}
        
        {currentScreen === 'chat' && (
          <div className="screen active">
            <ChatFlow onArrowClick={toggleChatFlow} />
          </div>
        )}
        
        {currentScreen === 'chatflow05' && (
          <div className="screen active">
            <ChatFlow05 onArrowClick={toggleChatFlow} />
          </div>
        )}
        
        {currentScreen === 'chatflow07' && (
          <div className="screen active">
            <ChatFlow07 
              onArrowClick={toggleChatFlow} 
              aiResponse={aiResponse} 
              onSendMessage={handleSendMessage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeContainer;
