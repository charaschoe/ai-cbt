import React, { useEffect, useRef, useState } from "react";
import OrbContainer from "./OrbContainer";
import ConversationManager from "../services/conversationManager";
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

	// Initialize conversation manager instance
	const conversationManager = new ConversationManager();

	// Base size for the orb (match the working HTML version exactly)
	const baseSize = 347.04;
	const minSize = baseSize * 0.8;
	const maxSize = baseSize * 1.4;

	// Available states based on provided CSS rules
	const availableStates = [
		{
			name: "default",
			className: "", // No additional class - original design
			sizeMultiplier: 1.0,
		},
		{
			name: "deeper-trauma-small",
			className: "small deeper-trauma",
			sizeMultiplier: 0.8, // Smaller for trauma state
		},
		{
			name: "deeper-trauma-medium",
			className: "medium deeper-trauma",
			sizeMultiplier: 1.2, // Medium for trauma state
		},
	];

	useEffect(() => {
		initAudio();
		bindEvents();
		initializeConversation();

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

			// Create analyser
			analyserRef.current = audioContextRef.current.createAnalyser();
			analyserRef.current.fftSize = 256;
			analyserRef.current.smoothingTimeConstant = 0.8;

			// Create data array
			dataArrayRef.current = new Uint8Array(
				analyserRef.current.frequencyBinCount
			);

			console.log("✅ Audio context initialized successfully");
		} catch (error) {
			console.error("❌ Audio initialization failed:", error);
		}
	};

	const bindEvents = () => {
		// Set initial visual state - original design
		if (orbRef.current) {
			orbRef.current.style.cursor = "pointer";
			orbRef.current.style.transition = "none"; // Remove transitions for real-time updates
			updateOrbSize(baseSize);
			console.log("✅ Orb events bound and initial size set:", baseSize);
		}
	};

	const startEmotionalStateCycling = () => {
		if (stateIntervalRef.current) {
			clearInterval(stateIntervalRef.current);
		}

		stateIntervalRef.current = setInterval(() => {
			setCurrentStateIndex((prevState) => {
				const nextState = (prevState + 1) % availableStates.length;
				console.log(
					`🎭 Transitioning to state: ${availableStates[nextState].name}`
				);
				return nextState;
			});
		}, 6000); // Change state every 6 seconds
	};

	const stopEmotionalStateCycling = () => {
		if (stateIntervalRef.current) {
			clearInterval(stateIntervalRef.current);
			stateIntervalRef.current = null;
			console.log("🎭 Emotional state cycling stopped");
		}
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
			startVisualization();
			startEmotionalStateCycling();
			console.log("🎵 Audio started successfully");
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
		stopEmotionalStateCycling();

		// Reset to base size and default state
		setCurrentStateIndex(0);
		if (orbRef.current) {
			orbRef.current.className = "ellipse-1 audio-reactive";
		}
		updateOrbSize(baseSize);
		console.log("⏹️ Audio stopped and orb reset");
	};

	const startVisualization = () => {
		console.log(
			"🎬 Starting visualization with",
			analyserRef.current.frequencyBinCount,
			"frequency bins"
		);

		const animate = () => {
			if (!isPlaying) return;

			// Get frequency data
			analyserRef.current.getByteFrequencyData(dataArrayRef.current);

			// Calculate average volume
			let sum = 0;
			for (let i = 0; i < dataArrayRef.current.length; i++) {
				sum += dataArrayRef.current[i];
			}
			const average = sum / dataArrayRef.current.length;

			// Get current state
			const currentState = availableStates[currentStateIndex];

			// Map volume to size with state multiplier
			const normalizedVolume = average / 255;
			const baseTargetSize =
				minSize + normalizedVolume * (maxSize - minSize);
			const finalTargetSize =
				baseTargetSize * currentState.sizeMultiplier;

			// Debug output occasionally
			if (Math.random() < 0.005) {
				console.log(
					`📊 Audio: avg=${average.toFixed(1)}, state=${
						currentState.name
					}, size=${finalTargetSize.toFixed(1)}px`
				);
			}

			// Update orb size and apply CSS class for current state
			updateOrbSize(finalTargetSize);

			// Update CSS class if needed
			if (orbRef.current) {
				const newClassName =
					`ellipse-1 audio-reactive ${currentState.className}`.trim();
				if (orbRef.current.className !== newClassName) {
					orbRef.current.className = newClassName;
				}
			}

			animationIdRef.current = requestAnimationFrame(animate);
		};

		animate();
	};

	const stopVisualization = () => {
		if (animationIdRef.current) {
			cancelAnimationFrame(animationIdRef.current);
			animationIdRef.current = null;
			console.log("⏸️ Visualization stopped");
		}
	};

	const updateOrbSize = (size) => {
		if (!orbRef.current) return;

		const roundedSize = Math.round(size * 100) / 100;

		// Apply size changes directly to DOM
		orbRef.current.style.width = `${roundedSize}px`;
		orbRef.current.style.height = `${roundedSize}px`;

		// Add glow effect based on size (original behavior)
		const glowIntensity = (size - minSize) / (maxSize - minSize);
		const glowSize = 15 + glowIntensity * 20;
		const glowOpacity = 0.3 + glowIntensity * 0.5;

		orbRef.current.style.filter = `drop-shadow(0 0 ${glowSize}px rgba(0, 255, 161, ${glowOpacity}))`;

		// Very occasional debug output
		if (Math.random() < 0.001) {
			console.log(
				`🔄 Orb updated: ${roundedSize}px (glow: ${glowSize.toFixed(
					1
				)}px)`
			);
		}
	};

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

			{/* State Debug Info (Development only) */}
			{process.env.NODE_ENV === "development" && isPlaying && (
				<div
					style={{
						position: "fixed",
						top: "20px",
						left: "20px",
						background: "rgba(0, 0, 0, 0.8)",
						color: "white",
						padding: "10px",
						borderRadius: "8px",
						fontSize: "12px",
						fontFamily: "monospace",
						zIndex: 1000,
					}}
				>
					<div>
						🎭 Current State:{" "}
						{availableStates[currentStateIndex].name}
					</div>
					<div>
						🎨 CSS Class:{" "}
						{availableStates[currentStateIndex].className ||
							"default"}
					</div>
					<div>
						📏 Size Multiplier:{" "}
						{availableStates[currentStateIndex].sizeMultiplier}x
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
