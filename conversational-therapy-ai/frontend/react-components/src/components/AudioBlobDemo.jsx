import React, { useState } from 'react';
import AudioReactiveBlob from './AudioReactiveBlob';
import './AudioBlobDemo.css';

const AudioBlobDemo = () => {
  const [selectedAudio, setSelectedAudio] = useState('');
  const [customAudio, setCustomAudio] = useState(null);

  // Beispiel-Audio-URLs mit echter Audio-Datei
  const sampleAudios = [
    {
      name: 'Juniper Voice Sample',
      url: '/sample-audio.mp3', // Echte Audio-Datei kopiert
      description: '"Calmly tuned in" Sprachsample - Perfekt für Blob-Animation'
    }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setCustomAudio({ name: file.name, url });
      setSelectedAudio(url);
    }
  };

  const handleSampleSelect = (audioUrl) => {
    setSelectedAudio(audioUrl);
  };

  return (
    <div className="audio-blob-demo">
      <div className="demo-header">
        <h1>Audio-Reaktive SVG Blob Animation</h1>
        <p>
          Diese Demo zeigt eine audio-reaktive SVG Blob-Animation, die in Echtzeit 
          auf Audioeingaben reagiert. Das Blob ändert Form, Farbe und Größe basierend 
          auf Amplitude und Tonhöhe der Audio-Signale.
        </p>
      </div>

      <div className="demo-content">
        <div className="audio-selection">
          <h3>Audio-Datei auswählen</h3>
          
          <div className="file-upload">
            <label htmlFor="audio-upload" className="upload-button">
              📁 Eigene MP3-Datei hochladen
            </label>
            <input
              id="audio-upload"
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>

          {customAudio && (
            <div className="custom-audio-info">
              <span>✅ Geladen: {customAudio.name}</span>
            </div>
          )}

          <div className="sample-audios">
            <h4>Oder wählen Sie ein Beispiel:</h4>
            {sampleAudios.map((audio, index) => (
              <button
                key={index}
                className={`sample-button ${selectedAudio === audio.url ? 'active' : ''}`}
                onClick={() => handleSampleSelect(audio.url)}
              >
                <strong>{audio.name}</strong>
                <small>{audio.description}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="blob-demo-container">
          {selectedAudio ? (
            <AudioReactiveBlob 
              audioSrc={selectedAudio}
              className="demo-blob"
            />
          ) : (
            <div className="no-audio-placeholder">
              <div className="placeholder-blob">
                <svg viewBox="0 0 200 100" width="200" height="100">
                  <path
                    d="M60,20 C80,10 120,10 140,20 C150,30 150,70 140,80 C120,90 80,90 60,80 C50,70 50,30 60,20 Z"
                    fill="#ddd"
                    opacity="0.5"
                  />
                </svg>
              </div>
              <p>Wählen Sie eine Audio-Datei aus, um die Animation zu starten</p>
            </div>
          )}
        </div>
      </div>

      <div className="demo-features">
        <h3>Features</h3>
        <div className="features-grid">
          <div className="feature">
            <h4>🎵 Sprachaktivität</h4>
            <p>Das Blob pulsiert und skaliert basierend auf der Audio-Amplitude</p>
          </div>
          <div className="feature">
            <h4>🎨 Tonhöhen-Reaktion</h4>
            <p>Form und Farbe ändern sich entsprechend der dominanten Frequenz</p>
          </div>
          <div className="feature">
            <h4>👂 "Listening"-Status</h4>
            <p>Spezielle Animation zeigt aktive Audio-Eingabe an</p>
          </div>
          <div className="feature">
            <h4>⚡ Echtzeit-Performance</h4>
            <p>Flüssige Animationen mit Web Audio API und Framer Motion</p>
          </div>
        </div>
      </div>

      <div className="demo-instructions">
        <h3>Verwendung</h3>
        <ol>
          <li>Laden Sie eine MP3-Datei hoch oder wählen Sie ein Beispiel</li>
          <li>Klicken Sie auf den Play-Button, um die Wiedergabe zu starten</li>
          <li>Beobachten Sie, wie das Blob auf verschiedene Audio-Signale reagiert</li>
          <li>Die Amplitude-Anzeige und der Status-Indikator geben zusätzliches Feedback</li>
        </ol>
      </div>
    </div>
  );
};

export default AudioBlobDemo;