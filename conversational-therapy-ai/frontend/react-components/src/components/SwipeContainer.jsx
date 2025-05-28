import React, { useState } from 'react';
import './SwipeContainer.css';
import ChatFlow from './ChatFlow';
import WidgetsLeft from './WidgetsLeft';

const SwipeContainer = () => {
  const [currentScreen, setCurrentScreen] = useState('chat'); // 'widgets' or 'chat'

  const showWidgets = () => setCurrentScreen('widgets');
  const showChat = () => setCurrentScreen('chat');

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
      </div>
      
      <div className="simple-container">
        {currentScreen === 'widgets' && (
          <div className="screen active">
            <WidgetsLeft />
          </div>
        )}
        
        {currentScreen === 'chat' && (
          <div className="screen active">
            <ChatFlow />
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeContainer;
