import React from 'react';
import './App.css';
import SwipeContainer from './components/SwipeContainer';
import PrototypeDemo from './components/PrototypeDemo';
import UniversalOrbDemo from './components/UniversalOrbDemo';

function App() {
  // Check URL parameters for demo modes
  const urlParams = new URLSearchParams(window.location.search);
  const showPrototype = urlParams.get('prototype') === 'true';
  const showUniversal = urlParams.get('universal') === 'true';

  // Universal Orb Demo (New System)
  if (showUniversal) {
    return (
      <div className="App">
        <main className="app-content">
          <UniversalOrbDemo />
          {/* Navigation buttons */}
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            gap: '10px'
          }}>
            <button
              onClick={() => window.location.search = ''}
              style={{
                padding: '10px 16px',
                background: '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)'
              }}
            >
              ← Hauptapp
            </button>
            <button
              onClick={() => window.location.search = '?prototype=true'}
              style={{
                padding: '10px 16px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(108, 117, 125, 0.3)'
              }}
            >
              🔬 Alter Prototyp
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Original Prototype Demo
  if (showPrototype) {
    return (
      <div className="App">
        <main className="app-content">
          <PrototypeDemo />
          {/* Navigation buttons */}
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            gap: '10px'
          }}>
            <button
              onClick={() => window.location.search = ''}
              style={{
                padding: '10px 16px',
                background: '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)'
              }}
            >
              ← Hauptapp
            </button>
            <button
              onClick={() => window.location.search = '?universal=true'}
              style={{
                padding: '10px 16px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
              }}
            >
              🚀 Neues System
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Main App
  return (
    <div className="App">
      <main className="app-content">
        <SwipeContainer />
        {/* Demo buttons */}
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={() => window.location.search = '?prototype=true'}
            style={{
              padding: '6px 12px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(108, 117, 125, 0.3)'
            }}
          >
            🔬 Prototyp
          </button>
          <button
            onClick={() => window.location.search = '?universal=true'}
            style={{
              padding: '6px 12px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)'
            }}
          >
            🚀 Universal
          </button>
          <button
            onClick={() => window.location.search = '?enhanced=true'}
            style={{
              padding: '6px 12px',
              background: '#ff6b35',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
            }}
          >
            🎵 Audio Enhanced
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
