import React, { useEffect, useRef, useState } from "react";
import OrbContainer from "./OrbContainer";
import conversationManager from "../services/conversationManager";
import "./ChatFlow.css";

const ChatFlow = ({ onArrowClick }) => {
	const audioRef = useRef(null);
	const orbRef = useRef(null);
	const messagesEndRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const audioContextRef = useRef(null);
	const analyserRef = useRef(null);
	const animationIdRef = useRef(null);
	const dataArrayRef = useRef(null);
	const stateIntervalRef = useRef(null);
	const [currentStateIndex, setCurrentStateIndex] = useState(0);

	// Chat_perfect message threading states
	const [messages, setMessages] = useState([]);
	const [inputText, setInputText] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [currentThread, setCurrentThread] = useState(null);
	const [emotionalContext, setEmotionalContext] = useState({
		state: "calm",
		urgency: 0.2,
		sessionId: null,
	});

	// Use the singleton conversation manager instance
	// const conversationManager is already imported as a singleton

	// Base size for the orb (match the working HTML version exactly)
	const baseSize = 347.04;
	const minSize = baseSize * 0.85;
	const maxSize = baseSize * 1.25;

	// Organic animation state
	const [organicAnimation, setOrganicAnimation] = useState({
		breathing: 0,
		morphing: 0,
		colorPhase: 0,
		currentColor: { h: 160, s: 100, l: 50 }, // Starting green-blue
	});

	// Audio analysis state for pitch detection
	const [audioAnalysis, setAudioAnalysis] = useState({
		pitch: 0, // 0-1, higher values = higher pitch
		amplitude: 0, // 0-1, volume level
		clarity: 0, // 0-1, how clear the pitch is
	});

	// Organic shapes for morphing
	const organicShapes = [
		"50%", // Perfect circle
		"47% 53% 52% 48%",
		"52% 48% 47% 53%",
		"48% 52% 53% 47%",
		"51% 49% 48% 52%",
		"49% 51% 52% 48%",
	];

	// Color palettes for organic transitions
	const colorPalettes = [
		{ h: 160, s: 100, l: 50 }, // Green-blue (default)
		{ h: 200, s: 80, l: 60 }, // Light blue
		{ h: 180, s: 90, l: 45 }, // Teal
		{ h: 140, s: 95, l: 55 }, // Green
		{ h: 220, s: 75, l: 50 }, // Blue
		{ h: 170, s: 85, l: 48 }, // Blue-green
	];

	useEffect(() => {
		initAudio();
		bindEvents();
		initializeConversation();
		startContinuousOrganicAnimation();

		return () => {
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
			}
			if (stateIntervalRef.current) {
				clearInterval(stateIntervalRef.current);
			}
			if (
				audioContextRef.current &&
				audioContextRef.current.state !== "closed"
			) {
				audioContextRef.current.close();
			}
		};
	}, []);

	// Initialize conversation thread
	const initializeConversation = async () => {
		try {
			const thread = await conversationManager.createThread();
			setCurrentThread(thread);

			// Load existing messages if any
			const existingMessages = await conversationManager.getMessages(
				thread.id
			);
			setMessages(existingMessages);

			// Initialize emotional context
			const context = await conversationManager.getEmotionalContext(
				thread.id
			);
			setEmotionalContext(context);
		} catch (error) {
			console.error("❌ Failed to initialize conversation:", error);
		}
	};

	// Auto-scroll to latest message
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	// Handle message sending
	const handleSendMessage = async () => {
		if (!inputText.trim() || !currentThread) return;

		const userMessage = {
			id: Date.now(),
			content: inputText,
			sender: "user",
			timestamp: new Date(),
			threadId: currentThread.id,
		};

		// Add user message to UI immediately
		setMessages((prev) => [...prev, userMessage]);
		setInputText("");
		setIsTyping(true);

		try {
			// Send to conversation manager
			await conversationManager.addMessage(userMessage);

			// Get AI response
			const aiResponse = await conversationManager.processMessage(
				userMessage
			);

			// Add AI response to UI
			setMessages((prev) => [...prev, aiResponse]);

			// Update emotional context based on conversation
			const updatedContext =
				await conversationManager.updateEmotionalContext(
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

	// Handle input key press
	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const initAudio = async () => {
		try {
			// Create audio context
			audioContextRef.current = new (window.AudioContext ||
				window.webkitAudioContext)();

			// Create analyser for pitch detection
			analyserRef.current = audioContextRef.current.createAnalyser();
			analyserRef.current.fftSize = 2048; // Higher resolution for pitch detection
			analyserRef.current.smoothingTimeConstant = 0.6; // Less smoothing for responsiveness
			analyserRef.current.minDecibels = -90;
			analyserRef.current.maxDecibels = -10;

			// Create data arrays for frequency and time domain
			dataArrayRef.current = new Uint8Array(
				analyserRef.current.frequencyBinCount
			);

			console.log(
				"✅ Enhanced audio context initialized for pitch detection"
			);
		} catch (error) {
			console.error("❌ Audio initialization failed:", error);
		}
	};

	const bindEvents = () => {
		// Set initial visual state with organic animation
		if (orbRef.current) {
			orbRef.current.style.cursor = "pointer";
			// Initialize with organic styling
			updateOrganicOrb(0, 0, organicAnimation.currentColor, baseSize);
			console.log("✅ Orb events bound with organic animation:", baseSize);
		}
	};

	// Continuous organic animation that runs even without audio
	const startContinuousOrganicAnimation = () => {
		const startTime = Date.now();

		const organicLoop = () => {
			const elapsed = Date.now() - startTime;

			// Breathing cycle (4 seconds)
			const breathingPhase = (elapsed % 4000) / 4000;
			const breathing = Math.sin(breathingPhase * Math.PI * 2) * 0.02; // ±2% subtle breathing

			// Morphing cycle (8 seconds)
			const morphingPhase = (elapsed % 8000) / 8000;
			const morphingIndex = Math.floor(
				morphingPhase * organicShapes.length
			);

			// Color transition cycle (12 seconds)
			const colorPhase = (elapsed % 12000) / 12000;
			const colorIndex = Math.floor(colorPhase * colorPalettes.length);
			const nextColorIndex = (colorIndex + 1) % colorPalettes.length;
			const colorLerp = (colorPhase * colorPalettes.length) % 1;

			// Lerp between colors for smooth transitions
			const currentColor = lerpColor(
				colorPalettes[colorIndex],
				colorPalettes[nextColorIndex],
				colorLerp
			);

			setOrganicAnimation({
				breathing,
				morphing: morphingIndex,
				colorPhase: colorPhase,
				currentColor,
			});

			// Update orb if not playing audio (base organic animation)
			if (!isPlaying) {
				updateOrganicOrb(
					breathing,
					morphingIndex,
					currentColor,
					baseSize
				);
			}

			// Continue animation loop
			requestAnimationFrame(organicLoop);
		};

		organicLoop();
	};

	// Helper function to interpolate between colors
	const lerpColor = (color1, color2, t) => {
		return {
			h: color1.h + (color2.h - color1.h) * t,
			s: color1.s + (color2.s - color1.s) * t,
			l: color1.l + (color2.l - color1.l) * t,
		};
	};

	const handleOrbClick = async () => {
		console.log(
			"🎯 Orb clicked! Current state:",
			isPlaying ? "playing" : "stopped"
		);
		if (isPlaying) {
			stopAudio();
		} else {
			await startAudio();
		}
	};

	const startAudio = async () => {
		try {
			if (
				!audioContextRef.current ||
				!analyserRef.current ||
				!audioRef.current
			) {
				console.error("❌ Audio components not ready");
				return;
			}

			// Resume audio context if suspended
			if (audioContextRef.current.state === "suspended") {
				await audioContextRef.current.resume();
				console.log("🔄 Audio context resumed");
			}

			// Connect audio source to analyser (only once)
			if (!audioRef.current.connectedToAnalyser) {
				const source = audioContextRef.current.createMediaElementSource(
					audioRef.current
				);
				source.connect(analyserRef.current);
				analyserRef.current.connect(
					audioContextRef.current.destination
				);
				audioRef.current.connectedToAnalyser = true;
				console.log("🔌 Audio source connected to analyser");
			}

			await audioRef.current.play();
			setIsPlaying(true);
			startEnhancedAudioVisualization();
			console.log("🎵 Audio started with organic animation");
		} catch (error) {
			console.error("❌ Failed to start audio:", error);
		}
	};

	const stopAudio = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}
		setIsPlaying(false);
		stopVisualization();

		// Reset audio analysis
		setAudioAnalysis({ pitch: 0, amplitude: 0, clarity: 0 });
		
		console.log("⏹️ Audio stopped and orb reset to organic animation");
	};

	const startEnhancedAudioVisualization = () => {
		console.log("🎬 Starting enhanced organic audio visualization");

		const animate = () => {
			if (!isPlaying) return;

			// Get frequency data
			analyserRef.current.getByteFrequencyData(dataArrayRef.current);

			// Enhanced speech detection
			const speechData = detectPitch(dataArrayRef.current);
			const amplitude = calculateAmplitude(dataArrayRef.current);
			const speechClarity = calculateSpeechClarity(dataArrayRef.current);

			// Update audio analysis state
			setAudioAnalysis({
				pitch: speechData.pitch,
				amplitude,
				clarity: speechClarity,
				speechFrequency: speechData.frequency,
				speechIntensity: speechData.intensity
			});

			// Speech-reactive size calculation - more dramatic for speech
			const speechMultiplier = speechData.intensity > 0.3 ? 1.0 + (speechData.intensity * 0.8) : 0.9; // 90% to 180%
			const pitchMultiplier = 0.9 + (speechData.pitch * 0.3); // 90% to 120%
			const amplitudeBoost = amplitude > 0.4 ? 1.0 + (amplitude * 0.4) : 1.0; // Speech boost
			
			const finalSize = baseSize * speechMultiplier * pitchMultiplier * amplitudeBoost;

			// Get current organic animation state with speech enhancement
			const currentMorphingIndex = Math.floor(organicAnimation.morphing);
			
			// Speech-reactive color enhancement
			const speechBoost = speechData.intensity > 0.3 ? speechData.intensity : 0;
			const enhancedColor = {
				...organicAnimation.currentColor,
				s: Math.min(100, organicAnimation.currentColor.s + (speechBoost * 30)), // Higher saturation for speech
				l: Math.max(30, Math.min(70, organicAnimation.currentColor.l + (speechData.pitch * 15))) // More dramatic lightness
			};

			// Speech-reactive breathing with "pulse" effect
			const speechPulse = speechBoost > 0 ? Math.sin(Date.now() * 0.02) * speechBoost * 0.08 : 0; // Fast pulse during speech
			const enhancedBreathing = organicAnimation.breathing + (amplitude * 0.04) + speechPulse;

			// Update orb with speech-enhanced organic animation
			updateOrganicOrb(
				enhancedBreathing,
				currentMorphingIndex,
				enhancedColor,
				finalSize
			);

			// Debug output occasionally
			if (Math.random() < 0.01) {
				console.log(`🎵 Speech-Enhanced Audio: speech=${speechData.intensity.toFixed(2)}, freq=${speechData.frequency.toFixed(0)}Hz, amp=${amplitude.toFixed(2)}, size=${finalSize.toFixed(1)}px`);
			}

			animationIdRef.current = requestAnimationFrame(animate);
		};

		animate();
	};

	// Enhanced pitch detection focused on human speech (80Hz-1kHz)
	const detectPitch = (frequencyData) => {
		const sampleRate = audioContextRef.current.sampleRate;
		const binSize = sampleRate / analyserRef.current.fftSize;
		
		// Human speech range: 80Hz - 1kHz (fundamental frequencies)
		const speechStartBin = Math.floor(80 / binSize);
		const speechEndBin = Math.floor(1000 / binSize);
		
		let maxIndex = speechStartBin;
		let maxValue = 0;
		
		// Find dominant frequency in speech range
		for (let i = speechStartBin; i < speechEndBin && i < frequencyData.length; i++) {
			if (frequencyData[i] > maxValue) {
				maxValue = frequencyData[i];
				maxIndex = i;
			}
		}
		
		// Convert to frequency and normalize for speech
		const frequency = maxIndex * binSize;
		const normalizedPitch = Math.min((frequency - 80) / (1000 - 80), 1);
		
		return { pitch: normalizedPitch, intensity: maxValue / 255, frequency: frequency };
	};

	// Calculate average amplitude
	const calculateAmplitude = (frequencyData) => {
		let sum = 0;
		for (let i = 0; i < frequencyData.length; i++) {
			sum += frequencyData[i];
		}
		return Math.min(sum / (frequencyData.length * 255), 1);
	};

	// Calculate speech clarity (focused on speech frequencies)
	const calculateSpeechClarity = (frequencyData) => {
		const sampleRate = audioContextRef.current.sampleRate;
		const binSize = sampleRate / analyserRef.current.fftSize;
		
		// Speech formant ranges (vowel clarity indicators)
		const f1Range = [Math.floor(200 / binSize), Math.floor(800 / binSize)]; // First formant
		const f2Range = [Math.floor(800 / binSize), Math.floor(2500 / binSize)]; // Second formant
		
		let f1Energy = 0, f2Energy = 0, totalEnergy = 0;
		
		// Calculate energy in formant ranges
		for (let i = f1Range[0]; i < f1Range[1] && i < frequencyData.length; i++) {
			f1Energy += frequencyData[i];
		}
		for (let i = f2Range[0]; i < f2Range[1] && i < frequencyData.length; i++) {
			f2Energy += frequencyData[i];
		}
		for (let i = 0; i < frequencyData.length; i++) {
			totalEnergy += frequencyData[i];
		}
		
		// Speech clarity based on formant energy distribution
		const speechRatio = totalEnergy > 0 ? (f1Energy + f2Energy) / totalEnergy : 0;
		return Math.min(speechRatio * 2, 1); // Boost speech detection
	};

	// Update orb with organic animation
	const updateOrganicOrb = (breathing, morphingIndex, color, size) => {
		if (!orbRef.current) return;

		// Apply size with breathing effect
		const breathingSize = size * (1 + breathing);
		orbRef.current.style.width = `${breathingSize}px`;
		orbRef.current.style.height = `${breathingSize}px`;

		// Apply organic morphing
		const shape = organicShapes[morphingIndex % organicShapes.length];
		orbRef.current.style.borderRadius = shape;

		// Apply color with gradient
		const hslColor = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
		const lighterColor = `hsl(${color.h}, ${Math.max(0, color.s - 20)}%, ${Math.min(100, color.l + 15)}%)`;
		
		orbRef.current.style.background = `radial-gradient(50% 50% at 50% 50%, ${hslColor} 11%, ${lighterColor} 62%, rgba(${Math.round(color.h)}, ${Math.round(color.s)}, ${Math.round(color.l)}, 0.4) 100%)`;

		// Enhanced glow effect
		const glowIntensity = 15 + (breathing * 100) + 10;
		const glowOpacity = 0.4 + (breathing * 0.3);
		orbRef.current.style.filter = `drop-shadow(0 0 ${glowIntensity}px hsla(${color.h}, ${color.s}%, ${color.l}%, ${glowOpacity}))`;

		// Smooth transitions for CSS properties
		orbRef.current.style.transition = 'border-radius 0.3s ease, background 0.5s ease';
	};

	const stopVisualization = () => {
		if (animationIdRef.current) {
			cancelAnimationFrame(animationIdRef.current);
			animationIdRef.current = null;
			console.log("⏸️ Visualization stopped");
		}
	};

	// Removed old updateOrbSize - now using updateOrganicOrb for all updates

	const handleAudioEnded = () => {
		console.log("🔚 Audio ended");
		stopAudio();
	};

	const handleArrowClick = () => {
		if (onArrowClick) {
			onArrowClick();
		}
	};

	return (
		<div className="chat-flow-01">
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

			<div className="orbs-v-1">
				<div
					ref={orbRef}
					className="ellipse-1 audio-reactive"
					onClick={handleOrbClick}
					style={{
						cursor: "pointer",
						transition: "all 0.3s ease",
					}}
				/>
			</div>

			{/* Organic Audio Debug Info (Development only) */}
			{process.env.NODE_ENV === "development" && (
				<div
					style={{
						position: "fixed",
						top: "20px",
						left: "20px",
						background: "rgba(0, 0, 0, 0.9)",
						color: "white",
						padding: "12px",
						borderRadius: "8px",
						fontSize: "11px",
						fontFamily: "monospace",
						zIndex: 1000,
						maxWidth: "200px",
					}}
				>
					<div style={{ borderBottom: "1px solid #333", paddingBottom: "6px", marginBottom: "6px" }}>
						<strong>🎵 Organic Audio Orb</strong>
					</div>
					<div>Status: {isPlaying ? 'Playing' : 'Organic Only'}</div>
					<div>Mode: {isPlaying ? 'Audio-Reactive' : 'Base Organic'}</div>
					
					{isPlaying && (
						<>
							<div style={{ margin: "6px 0", borderTop: "1px solid #333", paddingTop: "6px" }}>
								<strong>Audio Analysis:</strong>
							</div>
							<div>Pitch: {(audioAnalysis.pitch * 100).toFixed(0)}%</div>
							<div>Amplitude: {(audioAnalysis.amplitude * 100).toFixed(0)}%</div>
							<div>Clarity: {(audioAnalysis.clarity * 100).toFixed(0)}%</div>
						</>
					)}
					
					<div style={{ margin: "6px 0", borderTop: "1px solid #333", paddingTop: "6px" }}>
						<strong>Organic Animation:</strong>
					</div>
					<div>Breathing: {(organicAnimation.breathing * 100).toFixed(1)}%</div>
					<div>Morphing: {organicAnimation.morphing}</div>
					<div>Color Phase: {(organicAnimation.colorPhase * 100).toFixed(0)}%</div>
					<div style={{ fontSize: "10px", color: "#aaa" }}>
						HSL: {Math.round(organicAnimation.currentColor.h)}, {Math.round(organicAnimation.currentColor.s)}%, {Math.round(organicAnimation.currentColor.l)}%
					</div>
				</div>
			)}

			{/* Hidden audio element */}
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

export default ChatFlow;
