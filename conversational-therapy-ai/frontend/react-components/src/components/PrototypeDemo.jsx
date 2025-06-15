import React, { useState } from 'react';
import OrganicOrbPrototype from './OrganicOrbPrototype';
import './PrototypeDemo.css';

const PrototypeDemo = () => {
  const [emotionalState, setEmotionalState] = useState('neutral');
  const [intensity, setIntensity] = useState(1.0);
  const [size, setSize] = useState(347.04);
  const [showDebug, setShowDebug] = useState(true);

  const emotionalStates = [
    { key: 'neutral', label: '🌿 Neutral', description: 'Ruhiger Grundzustand' },
    { key: 'freude', label: '😊 Freude', description: 'Warme, lebendige Farben' },
    { key: 'trauer', label: '😔 Trauer', description: 'Kühle, beruhigende Farben' },
    { key: 'wut', label: '😠 Wut', description: 'Intensive, warme Farben' },
    { key: 'trauma', label: '💔 Trauma', description: 'Tiefe, intensive Farben' }
  ];

  const intensityLevels = [
    { value: 0.3, label: 'Sehr subtil' },
    { value: 0.6, label: 'Subtil' },
    { value: 1.0, label: 'Normal' },
    { value: 1.5, label: 'Verstärkt' },
    { value: 2.0, label: 'Intensiv' }
  ];

  const sizePresets = [
    { value: 200, label: 'Klein' },
    { value: 277.96, label: 'ChatFlow07' },
    { value: 347.04, label: 'ChatFlow (Standard)' },
    { value: 400, label: 'Groß' }
  ];

  return (
    <div className="prototype-demo">
      {/* Hauptorb-Anzeige */}
      <OrganicOrbPrototype
        emotionalState={emotionalState}
        intensity={intensity}
        size={size}
        showDebug={showDebug}
      />
      
      {/* Kontrollpanel */}
      <div className="control-panel">
        <h2>🎮 Prototyp-Kontrollen</h2>
        
        {/* Emotionale Zustände */}
        <div className="control-section">
          <h3>🎨 Emotionaler Zustand (Rudolf Steiner Farbsystem)</h3>
          <div className="button-grid">
            {emotionalStates.map(state => (
              <button
                key={state.key}
                className={`emotion-button ${emotionalState === state.key ? 'active' : ''}`}
                onClick={() => setEmotionalState(state.key)}
                title={state.description}
              >
                {state.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Intensität */}
        <div className="control-section">
          <h3>⚡ Animation-Intensität</h3>
          <div className="slider-container">
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              className="intensity-slider"
            />
            <div className="slider-labels">
              <span>Sehr subtil</span>
              <span className="current-value">{(intensity * 100).toFixed(0)}%</span>
              <span>Sehr intensiv</span>
            </div>
          </div>
          <div className="quick-intensity-buttons">
            {intensityLevels.map(level => (
              <button
                key={level.value}
                className={`intensity-button ${Math.abs(intensity - level.value) < 0.1 ? 'active' : ''}`}
                onClick={() => setIntensity(level.value)}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Größe */}
        <div className="control-section">
          <h3>📏 Orb-Größe</h3>
          <div className="size-controls">
            {sizePresets.map(preset => (
              <button
                key={preset.value}
                className={`size-button ${Math.abs(size - preset.value) < 1 ? 'active' : ''}`}
                onClick={() => setSize(preset.value)}
              >
                {preset.label}
                <small>{preset.value}px</small>
              </button>
            ))}
          </div>
        </div>
        
        {/* Debug-Optionen */}
        <div className="control-section">
          <h3>🔧 Debug-Optionen</h3>
          <label className="debug-toggle">
            <input
              type="checkbox"
              checked={showDebug}
              onChange={(e) => setShowDebug(e.target.checked)}
            />
            Debug-Panel anzeigen
          </label>
        </div>
        
        {/* Informationen */}
        <div className="control-section">
          <h3>ℹ️ Prototyp-Informationen</h3>
          <div className="info-text">
            <p><strong>Basis-Animation:</strong> Kontinuierliches sanftes Atmen (4s) und organisches Morphing (8s)</p>
            <p><strong>Rudolf Steiner Farben:</strong> Emotionale Zustände werden durch therapeutische Farbpaletten dargestellt</p>
            <p><strong>Zentrierte Position:</strong> Der Orb bleibt immer exakt in der Mitte, unabhängig von der Animation</p>
            <p><strong>Performance:</strong> Optimiert für 30-60 FPS mit Hardware-beschleunigten Animationen</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrototypeDemo;