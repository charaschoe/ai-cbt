import React, { useState, useEffect } from 'react';
import './EmotionalBlobsWidget.css';

const EmotionalBlobsWidget = ({ 
  className, 
  onMindClick, 
  onBodyClick, 
  onConnectionClick, 
  ...props 
}) => {
  const [loadingStates, setLoadingStates] = useState({
    mental: false,
    energy: false,
    connection: false
  });

  // Blob configuration with exact Figma positions
  const blobConfig = [
    {
      id: 'mental',
      text: ['Mental Load', 'Detected'],
      svg: 'blob-mental-negative0.svg',
      containerStyle: {
        width: '358.82px',
        height: '341.11px',
        left: '-68.47px',
        top: '87px'
      },
      textStyle: {
        left: '149.86px',
        top: '155.99px'
      },
      onClick: onMindClick
    },
    {
      id: 'energy',
      text: ['Low energy today'],
      svg: 'blob-negative-body0.svg',
      containerStyle: {
        width: '316.02px',
        height: '294.12px',
        left: '108.74px',
        top: '313.44px'
      },
      textStyle: {
        left: '61.64px',
        top: '98.87px',
        padding: '20.03px',
        width: '152.69px'
      },
      onClick: onBodyClick
    },
    {
      id: 'connection',
      text: ['Craving connection'],
      svg: 'blob-40.svg',
      containerStyle: {
        width: '343.79px',
        height: '302.86px',
        left: '15.07px',
        top: '512.07px'
      },
      textStyle: {
        left: '75.71px',
        top: '125px',
        width: '160px',
        height: '51px',
        position: 'absolute'
      },
      onClick: onConnectionClick
    }
  ];

  const handleBlobClick = (blob) => {
    if (blob.onClick) {
      // Set loading state
      setLoadingStates(prev => ({ ...prev, [blob.id]: true }));
      
      // Call navigation function
      blob.onClick();
      
      // Reset loading state after short delay
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, [blob.id]: false }));
      }, 300);
    }
  };

  const renderBlob = (blob) => {
    const isLoading = loadingStates[blob.id];
    
    if (blob.id === 'connection') {
      // Connection blob uses CSS radial gradient instead of SVG
      return (
        <React.Fragment key={blob.id}>
          <div
            className={`blob-container blob-${blob.id} ${isLoading ? 'loading' : ''}`}
            style={blob.containerStyle}
            onClick={() => handleBlobClick(blob)}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${blob.text.join(' ')} section`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBlobClick(blob);
              }
            }}
          >
            <div
              className="blob-gradient"
              style={{
                background: `radial-gradient(
                  closest-side,
                  rgba(255, 164, 112, 0.7) 0%,
                  rgba(248, 184, 132, 0.7) 48.557645082473755%,
                  rgba(255, 223, 205, 0.7) 80.28920888900757%,
                  rgba(255, 244, 237, 0.7) 100%
                )`,
                width: '253.41px',
                height: '214.27px',
                position: 'absolute',
                transformOrigin: '0 0',
                transform: 'rotate(20.294deg) scale(1, 1)',
                left: '0px',
                top: '0px'
              }}
            />
          </div>
          <div
            className="blob-text blob-text-separate"
            style={{
              position: 'absolute',
              left: '75.71px',
              top: '580px',
              width: '160px',
              height: '51px',
              color: '#543c3c',
              textAlign: 'center',
              fontFamily: '"PpWriter-RegularText", sans-serif',
              fontSize: '20px',
              fontWeight: '400'
            }}
            onClick={() => handleBlobClick(blob)}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${blob.text.join(' ')} section`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBlobClick(blob);
              }
            }}
          >
            {blob.text.map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < blob.text.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        </React.Fragment>
      );
    }

    // Regular blob layout (mental and energy)
    return (
      <div
        key={blob.id}
        className={`blob-container blob-${blob.id} ${isLoading ? 'loading' : ''}`}
        style={blob.containerStyle}
        onClick={() => handleBlobClick(blob)}
        role="button"
        tabIndex={0}
        aria-label={`Navigate to ${blob.text.join(' ')} section`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleBlobClick(blob);
          }
        }}
      >
        <img
          className="blob-image"
          src={blob.svg}
          alt=""
          style={{
            height: 'auto',
            position: 'absolute',
            left: '0px',
            top: '0px',
            overflow: 'visible'
          }}
        />
        <div
          className="blob-text"
          style={blob.textStyle}
        >
          {blob.text.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < blob.text.length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`emotional-blobs-widget ${className || ''}`}>
      <div className="widget-container">
        {/* Header Title */}
        <div className="header-title">
          <div className="title-text">
            What's Surfacing Today
          </div>
        </div>

        {/* Blobs Container */}
        <div className="blobs-container">
          {blobConfig.map(renderBlob)}
        </div>
      </div>
    </div>
  );
};

export default EmotionalBlobsWidget;