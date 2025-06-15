/**
 * ChatFlow Enhanced - Mit UniversalOrbAnimation
 * Phase 2: Audio-reaktive Integration
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import UniversalOrbAnimation from "./UniversalOrbAnimation";
import conversationManager from "../services/conversationManager";
import "./ChatFlow.css";

const ChatFlowEnhanced = ({ onArrowClick }) => {
	const audioRef = useRef(null);
	const messagesEndRef = useRef(null);
	
	// Audio-Analyse State
	const [isPlaying, setIsPlaying] = useState(false);
	const audioContextRef = useRef(null);
	const analyserRef = useRef(null);
	const animationIdRef = useRef(null);
	const dataArrayRef = useRef(null);
	
	// Audio-Daten für UniversalOrbAnimation
	const [audioData, setAudioData] = useState({
		amplitude: 0,
		frequency: 0,
		rhythm: 0,
		spectrum: null
	});
	
	// Emotionaler Zustand basierend auf Audio-Analyse
	const [currentEmotionalState, setCurrentEmotionalState] = useState('neutral');
	const [audioIntensity, setAudioIntensity] = useState(1.0);
	
	// Chat State
	const [messages, setMessages] = useState([]);
	const [inputText, setInputText] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [currentThread, setCurrentThread] = useState(null);
	const [emotionalContext, setEmotionalContext] = useState({
		state: "calm",
		urgency: 0.2,
		sessionId: null,
	});

	// Basis-Größe für den Orb
	const baseSize = 347.04;

	useEffect(() => {
		initAudio();
		initializeConversation();

		return () => {
			cleanup();
		};
	}, []);

	/**
	 * Audio-System initialisieren
	 */
	const initAudio = async () => {
		try {
			// Audio Context erstellen
			audioContextRef.current = new (window.AudioContext ||
				window.webkitAudioContext)();

			// Analyser erstellen und konfigurieren
			analyserRef.current = audioContextRef.current.createAnalyser();
			analyserRef.current.fftSize = 512; // Erhöht für bessere Frequenz-Auflösung
			analyserRef.current.smoothingTimeConstant = 0.7; // Etwas reduziert für reaktivere Animation
			analyserRef.current.minDecibels = -90;
			analyserRef.current.maxDecibels = -10;

			// Data Arrays erstellen
			dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

			console.log("✅ Enhanced Audio context initialized:", {
				fftSize: analyserRef.current.fftSize,
				frequencyBinCount: analyserRef.current.frequencyBinCount,
				sampleRate: audioContextRef.current.sampleRate
			});
		} catch (error) {
			console.error("❌ Enhanced Audio initialization failed:", error);
		}
	};

	/**
	 * Conversation initialisieren
	 */
	const initializeConversation = async () => {
		try {
			const thread = await conversationManager.createThread();
			setCurrentThread(thread);

			const existingMessages = await conversationManager.getMessages(thread.id);
			setMessages(existingMessages);

			const context = await conversationManager.getEmotionalContext(thread.id);
			setEmotionalContext(context);
		} catch (error) {
			console.error("❌ Failed to initialize conversation:", error);
		}
	};

	/**
	 * Orb-Click Handler
	 */
	const handleOrbClick = useCallback(async () => {
		console.log("🎯 Enhanced Orb clicked! Current state:", isPlaying ? "playing" : "stopped");
		
		if (isPlaying) {
			await stopAudio();
		} else {
			await startAudio();
		}
	}, [isPlaying]);

	/**
	 * Audio starten mit erweiterter Analyse
	 */
	const startAudio = async () => {
		try {
			if (!audioContextRef.current || !analyserRef.current || !audioRef.current) {
				console.error("❌ Audio components not ready");
				return;
			}

			// Audio Context aktivieren
			if (audioContextRef.current.state === "suspended") {
				await audioContextRef.current.resume();
				console.log("🔄 Audio context resumed");
			}

			// Audio-Source mit Analyser verbinden (nur einmal)
			if (!audioRef.current.connectedToAnalyser) {
				const source = audioContextRef.current.createMediaElementSource(audioRef.current);
				source.connect(analyserRef.current);
				analyserRef.current.connect(audioContextRef.current.destination);
				audioRef.current.connectedToAnalyser = true;
				console.log("🔌 Enhanced audio source connected");
			}

			await audioRef.current.play();
			setIsPlaying(true);
			startEnhancedVisualization();
			console.log("🎵 Enhanced audio started");
		} catch (error) {
			console.error("❌ Failed to start enhanced audio:", error);
		}
	};

	/**
	 * Audio stoppen
	 */
	const stopAudio = async () => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}
		
		setIsPlaying(false);
		stopEnhancedVisualization();
		
		// Reset Audio-Daten
		setAudioData({
			amplitude: 0,
			frequency: 0,
			rhythm: 0,
			spectrum: null
		});
		setCurrentEmotionalState('neutral');
		setAudioIntensity(1.0);
		
		console.log("⏹️ Enhanced audio stopped and reset");
	};

	/**
	 * Erweiterte Audio-Visualisierung mit detaillierter Analyse
	 */
	const startEnhancedVisualization = () => {
		console.log("🎬 Starting enhanced visualization");
		
		let lastBeatTime = 0;
		let beatInterval = 0;
		const beatHistory = [];
		
		const animate = () => {
			if (!isPlaying || !analyserRef.current) return;

			// Frequenz-Daten abrufen
			analyserRef.current.getByteFrequencyData(dataArrayRef.current);
			
			const bufferLength = dataArrayRef.current.length;
			const sampleRate = audioContextRef.current.sampleRate;
			
			// 1. Amplitude-Analyse (Gesamtlautstärke)
			let sum = 0;
			for (let i = 0; i < bufferLength; i++) {
				sum += dataArrayRef.current[i];
			}
			const amplitude = sum / bufferLength / 255; // Normalisiert 0-1

			// 2. Frequenz-Analyse (Spektrale Eigenschaften)
			const lowFreqEnd = Math.floor(bufferLength * 0.1);
			const midFreqStart = lowFreqEnd;
			const midFreqEnd = Math.floor(bufferLength * 0.4);
			const highFreqStart = midFreqEnd;

			let lowSum = 0, midSum = 0, highSum = 0;
			
			for (let i = 0; i < lowFreqEnd; i++) {
				lowSum += dataArrayRef.current[i];
			}
			for (let i = midFreqStart; i < midFreqEnd; i++) {
				midSum += dataArrayRef.current[i];
			}
			for (let i = highFreqStart; i < bufferLength; i++) {
				highSum += dataArrayRef.current[i];
			}

			const lowFreq = lowSum / lowFreqEnd / 255;
			const midFreq = midSum / (midFreqEnd - midFreqStart) / 255;
			const highFreq = highSum / (bufferLength - highFreqStart) / 255;

			// 3. Dominante Frequenz ermitteln
			let maxIndex = 0;
			let maxValue = 0;
			for (let i = 0; i < bufferLength; i++) {
				if (dataArrayRef.current[i] > maxValue) {
					maxValue = dataArrayRef.current[i];
					maxIndex = i;
				}
			}
			const dominantFreq = (maxIndex * sampleRate) / (analyserRef.current.fftSize * 2);
			const normalizedFrequency = Math.min(dominantFreq / 2000, 1); // Normalisiert auf 0-2kHz

			// 4. Rhythmus/Beat-Erkennung (vereinfacht)
			const currentTime = Date.now();
			const beatThreshold = amplitude > 0.6; // Beat-Schwelle
			
			if (beatThreshold && currentTime - lastBeatTime > 200) { // Mindest-Intervall
				beatInterval = currentTime - lastBeatTime;
				lastBeatTime = currentTime;
				beatHistory.push(beatInterval);
				
				// History begrenzen
				if (beatHistory.length > 8) {
					beatHistory.shift();
				}
			}
			
			// Durchschnittliches Beat-Intervall
			const avgBeatInterval = beatHistory.length > 0 
				? beatHistory.reduce((a, b) => a + b, 0) / beatHistory.length 
				: 1000;
			
			const bpm = 60000 / avgBeatInterval;
			const rhythmIntensity = Math.min(bpm / 120, 1); // Normalisiert auf 120 BPM

			// 5. Emotionaler Zustand basierend auf Audio-Eigenschaften
			const newEmotionalState = determineEmotionalState(amplitude, lowFreq, midFreq, highFreq, rhythmIntensity);
			const newIntensity = calculateAudioIntensity(amplitude, rhythmIntensity);

			// 6. Audio-Daten aktualisieren
			setAudioData({
				amplitude,
				frequency: normalizedFrequency,
				rhythm: rhythmIntensity,
				spectrum: {
					low: lowFreq,
					mid: midFreq,
					high: highFreq,
					dominant: dominantFreq,
					bpm: Math.round(bpm)
				}
			});

			setCurrentEmotionalState(newEmotionalState);
			setAudioIntensity(newIntensity);

			// Debug-Ausgabe (gelegentlich)
			if (Math.random() < 0.01) {
				console.log("🎵 Enhanced Audio Analysis:", {
					amplitude: amplitude.toFixed(3),
					frequency: normalizedFrequency.toFixed(3),
					rhythm: rhythmIntensity.toFixed(3),
					emotionalState: newEmotionalState,
					intensity: newIntensity.toFixed(3),
					bpm: Math.round(bpm)
				});
			}

			animationIdRef.current = requestAnimationFrame(animate);
		};

		animate();
	};

	/**
	 * Visualization stoppen
	 */
	const stopEnhancedVisualization = () => {
		if (animationIdRef.current) {
			cancelAnimationFrame(animationIdRef.current);
			animationIdRef.current = null;
			console.log("⏸️ Enhanced visualization stopped");
		}
	};

	/**
	 * Emotionalen Zustand basierend auf Audio-Eigenschaften bestimmen
	 */
	const determineEmotionalState = (amplitude, lowFreq, midFreq, highFreq, rhythm) => {
		// Einfache Heuristik für emotionale Zustände
		if (amplitude > 0.8 && rhythm > 0.7) {
			return 'wut'; // Hohe Intensität + schneller Rhythmus
		}
		
		if (highFreq > 0.6 && midFreq > 0.5) {
			return 'freude'; // Hohe Frequenzen = lebhaft
		}
		
		if (amplitude < 0.3 && lowFreq > midFreq) {
			return 'trauer'; // Niedrige Amplitude + dominante Bässe
		}
		
		if (amplitude > 0.9 && lowFreq > 0.8) {
			return 'trauma'; // Sehr hohe Intensität + dominante Bässe
		}
		
		return 'neutral';
	};

	/**
	 * Audio-Intensität berechnen
	 */
	const calculateAudioIntensity = (amplitude, rhythm) => {
		// Basis-Intensität von Audio-Eigenschaften
		const baseIntensity = 0.8 + (amplitude * 0.8) + (rhythm * 0.4);
		return Math.min(2.5, Math.max(0.5, baseIntensity));
	};

	/**
	 * Cleanup-Funktion
	 */
	const cleanup = () => {
		stopEnhancedVisualization();
		
		if (audioContextRef.current && audioContextRef.current.state !== "closed") {
			audioContextRef.current.close();
		}
		
		console.log("🧹 ChatFlowEnhanced cleanup completed");
	};

	/**
	 * Auto-scroll für Nachrichten
	 */
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	/**
	 * Message Handling
	 */
	const handleSendMessage = async () => {
		if (!inputText.trim() || !currentThread) return;

		const userMessage = {
			id: Date.now(),
			content: inputText,
			sender: "user",
			timestamp: new Date(),
			threadId: currentThread.id,
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputText("");
		setIsTyping(true);

		try {
			await conversationManager.addMessage(userMessage);
			const aiResponse = await conversationManager.processMessage(userMessage);
			setMessages((prev) => [...prev, aiResponse]);

			const updatedContext = await conversationManager.updateEmotionalContext(
				currentThread.id,
				userMessage.content
			);
			setEmotionalContext(updatedContext);
		} catch (error) {
			console.error("❌ Failed to process message:", error);
		} finally {
			setIsTyping(false);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleArrowClick = () => {
		if (onArrowClick) {
			onArrowClick();
		}
	};

	const handleAudioEnded = () => {
		console.log("🔚 Enhanced audio ended");
		stopAudio();
	};

	return (
		<div className="chat-flow-01 enhanced">
			{/* Bestehende UI-Elemente */}
			<div className="rectangle-2"></div>
			<div className="rectangle-1"></div>
			<div className="rectangle-3"></div>
			<div className="check-in">Check In</div>

			<div className="home">
				<div className="ellipse-4"></div>
				<div className="ellipse-5"></div>
				<div className="ellipse-6"></div>
				<div className="ellipse-14"></div>
				<div className="ellipse-15"></div>
				<div className="ellipse-16"></div>
				<div className="ellipse-17"></div>
				<div className="ellipse-18"></div>
				<div className="ellipse-19"></div>
				<div className="ellipse-20"></div>
				<div className="ellipse-21"></div>
				<div className="ellipse-7"></div>
				<div className="ellipse-8"></div>
				<div className="ellipse-9"></div>
				<div className="ellipse-10"></div>
				<div className="ellipse-11"></div>
				<div className="ellipse-12"></div>
			</div>

			<div className="settings">
				<div className="ellipse-52"></div>
				<div className="ellipse-62"></div>
				<div className="ellipse-72"></div>
			</div>

			<img
				className="vector-1"
				src="/vector-10.svg"
				alt="bottom indicator"
				onClick={handleArrowClick}
				style={{ cursor: "pointer" }}
			/>

			{/* UniversalOrbAnimation anstelle des alten Orbs */}
			<div className="orbs-v-1">
				<UniversalOrbAnimation
					mode="audio"
					baseSize={baseSize}
					audioData={audioData}
					emotionalState={currentEmotionalState}
					intensity={audioIntensity}
					onClick={handleOrbClick}
					enableDebug={process.env.NODE_ENV === "development"}
					onStateChange={(newState, oldState) => {
						console.log("🎭 Orb state changed:", { newState, oldState });
					}}
					onPerformanceUpdate={(metrics) => {
						if (Math.random() < 0.1) { // Gelegentliche Performance-Logs
							console.log("📊 Orb performance:", metrics);
						}
					}}
					className="enhanced-audio-orb"
				/>
			</div>


			{/* Audio Element */}
			<audio
				ref={audioRef}
				onEnded={handleAudioEnded}
				preload="auto"
				style={{ display: "none" }}
			>
				<source
					src="/ElevenLabs_2025-06-11T12_10_17_Juniper_pvc_sp100_s50_sb75_v3.mp3"
					type="audio/mpeg"
				/>
			</audio>
		</div>
	);
};

export default ChatFlowEnhanced;