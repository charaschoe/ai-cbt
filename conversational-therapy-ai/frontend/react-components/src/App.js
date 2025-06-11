import React, { useState } from 'react';
import './App.css';
import SwipeContainer from './components/SwipeContainer';
import AudioBlobDemo from './components/AudioBlobDemo';

function App() {
  const [currentView, setCurrentView] = useState('blob-demo'); // 'swipe' oder 'blob-demo'

  return (
    <div className="App">
      <nav className="app-navigation">
        <button
          className={currentView === 'swipe' ? 'active' : ''}
          onClick={() => setCurrentView('swipe')}
        >
          Swipe Container
        </button>
        <button
          className={currentView === 'blob-demo' ? 'active' : ''}
          onClick={() => setCurrentView('blob-demo')}
        >
          Audio Blob Demo
        </button>
      </nav>
      
      <main className="app-content">
        {currentView === 'swipe' && <SwipeContainer />}
        {currentView === 'blob-demo' && <AudioBlobDemo />}
      </main>
    </div>
  );
}

export default App;
