import React, { useState, useEffect } from 'react';
import { OrbsV3Property1Variant4 } from './OrbsV3Property1Variant4';
import EmotionalUrgencyBlob from './EmotionalUrgencyBlob';
import './OrbContainer.css';

const OrbContainer = ({ 
  activeBlobs = [], 
  className = '',
  property1 = 'variant-4',
  ...props 
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showEmotionalBlob, setShowEmotionalBlob] = useState(false);

  // Bestimme den dominantesten Blob (höchste Priorität)
  const dominantBlob = activeBlobs.length > 0 
    ? activeBlobs.reduce((prev, current) => 
        (prev.priority > current.priority) ? prev : current
      )
    : null;

  useEffect(() => {
    const shouldShowEmotional = dominantBlob && dominantBlob.isVisible;
    
    if (shouldShowEmotional !== showEmotionalBlob) {
      setIsTransitioning(true);
      
      // Kurze Delay für nahtlose Transition
      const timer = setTimeout(() => {
        setShowEmotionalBlob(shouldShowEmotional);
        setIsTransitioning(false);
      }, 150); // 150ms für sanfte Transition

      return () => clearTimeout(timer);
    }
  }, [dominantBlob, showEmotionalBlob]);

  return (
    <div className={`orb-container ${className}`} {...props}>
      {/* Standard Orb */}
      <div 
        className={`standard-orb ${showEmotionalBlob ? 'hidden' : 'visible'} ${isTransitioning ? 'transitioning' : ''}`}
      >
        <OrbsV3Property1Variant4
          property1={property1}
          className="orbs-v-3-instance"
        />
      </div>

      {/* Emotional Urgency Blob */}
      {dominantBlob && (
        <div 
          className={`emotional-orb ${showEmotionalBlob ? 'visible' : 'hidden'} ${isTransitioning ? 'transitioning' : ''}`}
        >
          <EmotionalUrgencyBlob
            size={dominantBlob.size}
            emotionType={dominantBlob.type}
            urgencyLevel={dominantBlob.urgencyLevel}
            isVisible={showEmotionalBlob}
            animationIntensity={dominantBlob.animationIntensity}
          />
        </div>
      )}

      {/* Debug Info (nur im Development) */}
      {process.env.NODE_ENV === 'development' && dominantBlob && (
        <div className="orb-debug-info">
          <div className="debug-text">
            {dominantBlob.type} ({dominantBlob.urgencyLevel})
          </div>
          <div className="debug-text">
            Size: {dominantBlob.size}, Intensity: {dominantBlob.animationIntensity?.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrbContainer;
