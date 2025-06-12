import React from 'react';
import './EnhancedMessageBubble.css';

const EnhancedMessageBubble = ({ 
  message, 
  type, 
  emotionalState, 
  facialExpression,
  threadInfo,
  isStreaming = false,
  showTimestamp = false
}) => {
  const renderThreadIndicator = () => {
    if (!threadInfo) return null;
    
    return (
      <div className="thread-indicator">
        {threadInfo.isFirstInThread && (
          <div className="thread-start">
            <div className="thread-icon">💬</div>
            <span className="thread-label">New Thread</span>
          </div>
        )}
        {threadInfo.threadPosition > 1 && (
          <div className="thread-continuation">
            <div className="thread-line"></div>
            <span className="thread-count">{threadInfo.threadPosition}</span>
          </div>
        )}
      </div>
    );
  };

  const renderEmotionalStateIndicator = () => {
    if (!emotionalState || emotionalState === 'neutral') return null;
    
    const emotionalIcons = {
      empathetic: '🤝',
      celebratory: '🎉',
      calming: '🌊',
      understanding: '💙',
      contemplative: '🤔',
      supportive: '🤗'
    };

    return (
      <div className={`emotional-indicator ${emotionalState}`}>
        <span className="emotional-icon">{emotionalIcons[emotionalState] || '💙'}</span>
      </div>
    );
  };

  const renderMessageActions = () => {
    if (type === 'user') return null;

    return (
      <div className="message-actions">
        <button className="action-btn" title="Helpful">👍</button>
        <button className="action-btn" title="Not helpful">👎</button>
        <button className="action-btn" title="Copy">📋</button>
      </div>
    );
  };

  const renderTimestamp = () => {
    if (!showTimestamp) return null;
    
    return (
      <div className="message-timestamp">
        {new Date(message.timestamp || Date.now()).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
    );
  };

  return (
    <div className={`enhanced-message-container ${type}-message ${facialExpression ? `expression-${facialExpression}` : ''}`}>
      {renderThreadIndicator()}
      
      <div className="message-content-wrapper">
        <div className="message-metadata">
          {renderEmotionalStateIndicator()}
          {renderTimestamp()}
        </div>
        
        <div className={`enhanced-message-bubble ${emotionalState ? `emotional-${emotionalState}` : ''}`}>
          <div className="message-text">
            {message.text}
            {isStreaming && <span className="streaming-cursor">|</span>}
          </div>
          
          {message.isSegment && (
            <div className="segment-indicator">
              <span className="segment-badge">Part {message.segmentIndex + 1}</span>
            </div>
          )}
        </div>
        
        {renderMessageActions()}
      </div>
    </div>
  );
};

export default EnhancedMessageBubble;