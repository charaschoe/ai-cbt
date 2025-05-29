import React, { useState } from 'react';
import './SwipeContainer.css';
import ChatFlow from './ChatFlow';
import WidgetsLeft from './WidgetsLeft';
import { ChatFlow05 } from './ChatFlow05';

const SwipeContainer = () => {
  const [currentScreen, setCurrentScreen] = useState('chat'); // 'widgets', 'chat', or 'chatflow05'

  const showWidgets = () => setCurrentScreen('widgets');
  const showChat = () => setCurrentScreen('chat');
  const toggleChatFlow = () => {
    if (currentScreen === 'chatflow05') {
      setCurrentScreen('chat');
    } else {
      setCurrentScreen('chatflow05');
    }
  };

  return (
    <div className="swipe-container-wrapper">
      {/* Debug info */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        Current: {currentScreen}
        <br/>
        <button onClick={showWidgets} style={{margin: '2px', fontSize: '10px'}}>Widgets</button>
        <button onClick={showChat} style={{margin: '2px', fontSize: '10px'}}>Chat</button>
        <button onClick={toggleChatFlow} style={{margin: '2px', fontSize: '10px'}}>Toggle Flow</button>
      </div>
      
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
      </div>
    </div>
  );
};

export default SwipeContainer;
