import React, { useState } from 'react';
import UniversalOrbAnimation from './UniversalOrbAnimation';
import OrganicOrbPrototype from './OrganicOrbPrototype';
import './UniversalOrbDemo.css';

const UniversalOrbDemo = () => {
  const [mode, setMode] = useState('base');
  const [emotionalState, setEmotionalState] = useState('neutral');
  const [intensity, setIntensity] = useState(1.0);
  const [size, setSize] = useState(347.04);
  const [showDebug, setShowDebug] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  
  // Audio-Simulation für Audio-Modus
  const [simulatedAudio, setSimulatedAudio] = useState({
    amplitude: 0.5,
    frequency: 0.3,
    rhythm: 0.4
  });

  const modes = [
    { key: 'base', label: '🌿 Basis', description: 'Kontinuierliche organische Animation' },
    { key: 'audio', label: '🎵 Audio', description: 'Audio-reaktive Animation' },
    { key: 'text', label: '💬 Text', description: 'Text-reaktive Animation' },
    { key: 'emotional', label: '🎭 Emotional', description: 'Emotionale Aufgaben' },
    { key: 'ambient', label: '🌅 Ambient', description: 'Ambiente Animation' }
  ];

  const emotionalStates = [
    { key: 'neutral', label: '🌿 Neutral', description: 'Ruhiger Grundzustand' },
    { key: 'freude', label: '😊 Freude', description: 'Warme, lebendige Farben' },
    { key: 'trauer', label: '😔 Trauer', description: 'Kühle, beruhigende Farben' },
    { key: 'wut', label: '😠 Wut', description: 'Intensive, warme Farben' },
    { key: 'trauma', label: '💔 Trauma', description: 'Tiefe, intensive Farben' }
  ];

  const sizePresets = [
    { value: 200, label: 'Klein' },
    { value: 277.96, label: 'ChatFlow07' },
    { value: 347.04, label: 'ChatFlow (Standard)' },
    { value: 400, label: 'Groß' }
  ];

  return (
    <div className="universal-orb-demo">
      {/* Haupt-Display */}
      <div className="demo-display">
        {compareMode ? (
          <div className="comparison-view">
            <div className="comparison-side">
              <h3>🆕 UniversalOrbAnimation (Neu)</h3>
              <UniversalOrbAnimation
                mode={mode}
                emotionalState={emotionalState}
                intensity={intensity}
                baseSize={size}
                audioData={mode === 'audio' ? simulatedAudio : null}
                urgencyLevel={mode === 'text' ? intensity * 0.8 : 0.5}
                enableDebug={showDebug}
                onClick={(e, data) => console.log('UniversalOrb clicked:', data)}
              />
            </div>
            <div className="comparison-side">
              <h3>🔬 OrganicOrbPrototype (Alt)</h3>
              <OrganicOrbPrototype
                emotionalState={emotionalState}
                intensity={intensity}
                size={size}
                showDebug={false} // Nur ein Debug-Panel
              />
            </div>
          </div>
        ) : (
          <div className="single-view">
            <UniversalOrbAnimation
              mode={mode}
              emotionalState={emotionalState}
              intensity={intensity}
              baseSize={size}
              audioData={mode === 'audio' ? simulatedAudio : null}
              urgencyLevel={mode === 'text' ? intensity * 0.8 : 0.5}
              taskType={mode === 'emotional' ? 'breathing-exercise' : null}
              ambientData={mode === 'ambient' ? { healthScore: 0.8 } : null}
              enableDebug={showDebug}
              onClick={(e, data) => console.log('UniversalOrb clicked:', data)}
              onStateChange={(newState, oldState) => 
                console.log('State changed:', { newState, oldState })
              }
              onPerformanceUpdate={(metrics) => 
                console.log('Performance:', metrics)
              }
            />
          </div>
        )}
      </div>
      
      {/* Kontrollpanel */}
      <div className="demo-controls">
        <h2>🎮 UniversalOrbAnimation Demo</h2>
        
        {/* Vergleichsmodus Toggle */}
        <div className="control-section">
          <label className="compare-toggle">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(e) => setCompareMode(e.target.checked)}
            />
            Vergleichsmodus (Alt vs. Neu)
          </label>
        </div>
        
        {/* Modi */}
        <div className="control-section">
          <h3>🎯 Animation-Modus</h3>
          <div className="mode-grid">
            {modes.map(modeOption => (
              <button
                key={modeOption.key}
                className={`mode-button ${mode === modeOption.key ? 'active' : ''}`}
                onClick={() => setMode(modeOption.key)}
                title={modeOption.description}
              >
                {modeOption.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Audio-Simulation (nur im Audio-Modus) */}
        {mode === 'audio' && (
          <div className="control-section">
            <h3>🎵 Audio-Simulation</h3>
            <div className="audio-controls">
              <label>
                Amplitude: {(simulatedAudio.amplitude * 100).toFixed(0)}%
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={simulatedAudio.amplitude}
                  onChange={(e) => setSimulatedAudio(prev => ({
                    ...prev,
                    amplitude: parseFloat(e.target.value)
                  }))}
                />
              </label>
              <label>
                Frequenz: {(simulatedAudio.frequency * 100).toFixed(0)}%
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={simulatedAudio.frequency}
                  onChange={(e) => setSimulatedAudio(prev => ({
                    ...prev,
                    frequency: parseFloat(e.target.value)
                  }))}
                />
              </label>
              <label>
                Rhythmus: {(simulatedAudio.rhythm * 100).toFixed(0)}%
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={simulatedAudio.rhythm}
                  onChange={(e) => setSimulatedAudio(prev => ({
                    ...prev,
                    rhythm: parseFloat(e.target.value)
                  }))}
                />
              </label>
            </div>
          </div>
        )}
        
        {/* Emotionale Zustände */}
        <div className="control-section">
          <h3>🎨 Emotionaler Zustand (Rudolf Steiner)</h3>
          <div className="emotion-grid">
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
          <div className="intensity-control">
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              className="intensity-slider"
            />
            <div className="intensity-display">{(intensity * 100).toFixed(0)}%</div>
          </div>
          <div className="intensity-presets">
            {[0.3, 0.6, 1.0, 1.5, 2.0].map(preset => (
              <button
                key={preset}
                className={`preset-button ${Math.abs(intensity - preset) < 0.05 ? 'active' : ''}`}
                onClick={() => setIntensity(preset)}
              >
                {preset === 0.3 ? 'Sehr subtil' :
                 preset === 0.6 ? 'Subtil' :
                 preset === 1.0 ? 'Normal' :
                 preset === 1.5 ? 'Verstärkt' : 'Intensiv'}
              </button>
            ))}
          </div>
        </div>
        
        {/* Größe */}
        <div className="control-section">
          <h3>📏 Orb-Größe</h3>
          <div className="size-grid">
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
        
        {/* Debug */}
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
          <h3>ℹ️ System-Informationen</h3>
          <div className="info-text">
            <p><strong>UniversalOrbAnimation:</strong> Neue universelle Implementierung mit Multi-Modus-Support</p>
            <p><strong>Performance-Adaptive:</strong> Automatische Anpassung an Geräteleistung</p>
            <p><strong>Multi-Layer-Animation:</strong> Basis + Audio/Text/Emotional Layer</p>
            <p><strong>Rudolf Steiner Farben:</strong> Therapeutisches Farbsystem</p>
            {compareMode && (
              <p><strong>Vergleichsmodus:</strong> Zeigt alte vs. neue Implementation</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalOrbDemo;