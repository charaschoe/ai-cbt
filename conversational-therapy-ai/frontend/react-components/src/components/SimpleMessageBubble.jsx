import React from 'react';
import './SimpleMessageBubble.css';

const SimpleMessageBubble = ({ 
  message, 
  type, 
  showTimestamp = false 
}) => {
  const renderTimestamp = () => {
    if (!showTimestamp) return null;
    
    return (
      <div className="simple-message-timestamp">
        {new Date(message.timestamp || Date.now()).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
    );
  };

  return (
    <div className={`simple-message-container ${type}-message`}>
      <div className="simple-message-bubble">
        <div className="simple-message-text">
          {message.text}
        </div>
        
        {renderTimestamp()}
      </div>
    </div>
  );
};

export default SimpleMessageBubble;