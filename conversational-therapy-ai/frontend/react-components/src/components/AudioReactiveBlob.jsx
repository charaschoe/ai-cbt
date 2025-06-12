import React, { useState, useRef, useEffect, useCallback } from 'react';
import BlobShape from './BlobShape';
import './AudioReactiveBlob.css';

const AudioReactiveBlob = ({ audioSrc, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFeatures, setAudioFeatures] = useState({
    amplitude: 0,
    pitch: 0,
    isListening: false
  });

  // Refs für Web Audio API
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationIdRef = useRef(null);
  const timeDomainDataRef = useRef(null);
  const frequencyDataRef = useRef(null);

  // Audio-Analyse-Loop mit Memory-optimierter Implementierung
  const runAnalysis = useCallback(() => {
    if (!analyserRef.current || !audioRef.current || audioRef.current.paused) {
      // MEMORY FIX: Stoppe Animation wenn Audio pausiert
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      return;
    }

    const analyser = analyserRef.current;
    const timeDomainData = timeDomainDataRef.current;
    const frequencyData = frequencyDataRef.current;

    // Time-Domain-Daten für Amplitude/Spracherkennung
    analyser.getByteTimeDomainData(timeDomainData);
    
    // Frequency-Domain-Daten für Tonhöhenerkennung
    analyser.getByteFrequencyData(frequencyData);

    // Amplitude berechnen (RMS) - Optimiert
    let sum = 0;
    const sampleSize = Math.min(timeDomainData.length, 512); // MEMORY FIX: Limitiere Sample-Größe
    for (let i = 0; i < sampleSize; i++) {
      const sample = (timeDomainData[i] - 128) / 128;
      sum += sample * sample;
    }
    const amplitude = Math.sqrt(sum / sampleSize);

    // Dominante Frequenz/Tonhöhe finden - Optimiert
    let maxIndex = 0;
    let maxValue = 0;
    const freqSampleSize = Math.min(frequencyData.length, 256); // MEMORY FIX: Limitiere Frequenz-Analyse
    for (let i = 0; i < freqSampleSize; i++) {
      if (frequencyData[i] > maxValue) {
        maxValue = frequencyData[i];
        maxIndex = i;
      }
    }
    
    // Konvertiere Index zu Frequenz (basierend auf Sample-Rate und FFT-Größe)
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const pitch = (maxIndex * sampleRate) / (analyser.fftSize * 2);

    // Schwellenwert für "Listening"-Status
    const amplitudeThreshold = 0.01;
    const isListening = amplitude > amplitudeThreshold;

    setAudioFeatures({
      amplitude: Math.min(amplitude * 10, 1), // Normalisiert auf 0-1
      pitch: Math.min(pitch / 1000, 1), // Normalisiert auf 0-1 (0-1kHz Bereich)
      isListening
    });

    // MEMORY FIX: Verwende throttled animation frames (30 FPS statt 60 FPS)
    animationIdRef.current = requestAnimationFrame(() => {
      setTimeout(() => runAnalysis(), 33); // ~30 FPS
    });
  }, []);

  // Web Audio API Setup
  const setupAudio = useCallback(async () => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      // AudioContext erstellen
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // AnalyserNode erstellen
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Audio-Source erstellen
      const source = audioContext.createMediaElementSource(audioRef.current);
      sourceRef.current = source;

      // Audio-Graph verbinden
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      // Data-Arrays initialisieren
      timeDomainDataRef.current = new Uint8Array(analyser.frequencyBinCount);
      frequencyDataRef.current = new Uint8Array(analyser.frequencyBinCount);

    } catch (error) {
      console.error('Fehler beim Setup der Web Audio API:', error);
    }
  }, []);

  // Play/Pause Handler
  const handlePlayPause = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
      } else {
        // AudioContext resume falls suspended
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
        runAnalysis();
      }
    } catch (error) {
      console.error('Fehler beim Abspielen:', error);
    }
  }, [isPlaying, runAnalysis]);

  // Audio-Events
  const handleAudioPlay = useCallback(() => {
    setIsPlaying(true);
    runAnalysis();
  }, [runAnalysis]);

  const handleAudioPause = useCallback(() => {
    setIsPlaying(false);
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
  }, []);

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    setAudioFeatures({ amplitude: 0, pitch: 0, isListening: false });
  }, []);

  // Setup Effect
  useEffect(() => {
    setupAudio();
    
    return () => {
      // Cleanup
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [setupAudio]);

  return (
    <div className={`audio-reactive-blob ${className}`}>
      <div className="blob-container">
        <BlobShape 
          amplitude={audioFeatures.amplitude}
          pitch={audioFeatures.pitch}
          isListening={audioFeatures.isListening}
        />
      </div>
      
      <div className="audio-controls">
        <audio
          ref={audioRef}
          src={audioSrc}
          onPlay={handleAudioPlay}
          onPause={handleAudioPause}
          onEnded={handleAudioEnded}
          onLoadedData={setupAudio}
        />
        
        <button 
          className={`play-pause-btn ${isPlaying ? 'playing' : 'paused'}`}
          onClick={handlePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div className="audio-info">
          <div className="amplitude-indicator">
            <div 
              className="amplitude-bar"
              style={{ width: `${audioFeatures.amplitude * 100}%` }}
            />
          </div>
          <span className={`listening-status ${audioFeatures.isListening ? 'active' : ''}`}>
            {audioFeatures.isListening ? '🎤 Zuhören' : '🔇 Ruhe'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AudioReactiveBlob;