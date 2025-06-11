import React, { useEffect, useRef, useState } from "react";
import "./AudioReactiveOrb.css";

const AudioReactiveOrb = ({ className }) => {
	const audioRef = useRef(null);
	const orbRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [audioContext, setAudioContext] = useState(null);
	const [analyser, setAnalyser] = useState(null);
	const animationIdRef = useRef(null);

	// Base size for the orb
	const baseSize = 347.04;
	const minSize = baseSize * 0.8;
	const maxSize = baseSize * 1.4;

	useEffect(() => {
		initAudio();
		return () => {
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
			}
			if (audioContext) {
				audioContext.close();
			}
		};
	}, []);

	const initAudio = async () => {
		try {
			// Create audio context
			const ctx = new (window.AudioContext ||
				window.webkitAudioContext)();

			// Create analyser
			const analyserNode = ctx.createAnalyser();
			analyserNode.fftSize = 256;
			analyserNode.smoothingTimeConstant = 0.8;

			setAudioContext(ctx);
			setAnalyser(analyserNode);
		} catch (error) {
			console.error("Audio initialization failed:", error);
		}
	};

	const handleOrbClick = async () => {
		if (isPlaying) {
			stopAudio();
		} else {
			await startAudio();
		}
	};

	const startAudio = async () => {
		try {
			if (!audioContext || !analyser || !audioRef.current) return;

			// Resume audio context if suspended
			if (audioContext.state === "suspended") {
				await audioContext.resume();
			}

			// Connect audio source to analyser
			if (!audioRef.current.audioSource) {
				const source = audioContext.createMediaElementSource(
					audioRef.current
				);
				source.connect(analyser);
				analyser.connect(audioContext.destination);
				audioRef.current.audioSource = source;
			}

			await audioRef.current.play();
			setIsPlaying(true);
			startVisualization();
		} catch (error) {
			console.error("Failed to start audio:", error);
		}
	};

	const stopAudio = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}
		setIsPlaying(false);
		stopVisualization();

		// Reset to base size
		updateOrbSize(baseSize);
	};

	const startVisualization = () => {
		if (!analyser) return;

		const dataArray = new Uint8Array(analyser.frequencyBinCount);

		const animate = () => {
			if (!isPlaying) return;

			// Get frequency data
			analyser.getByteFrequencyData(dataArray);

			// Calculate average volume
			let sum = 0;
			for (let i = 0; i < dataArray.length; i++) {
				sum += dataArray[i];
			}
			const average = sum / dataArray.length;

			// Map volume to size (0-255 -> minSize-maxSize)
			const normalizedVolume = average / 255;
			const targetSize = minSize + normalizedVolume * (maxSize - minSize);

			// Apply smoothing and update orb
			updateOrbSize(targetSize);

			animationIdRef.current = requestAnimationFrame(animate);
		};

		animate();
	};

	const stopVisualization = () => {
		if (animationIdRef.current) {
			cancelAnimationFrame(animationIdRef.current);
			animationIdRef.current = null;
		}
	};

	const updateOrbSize = (size) => {
		if (!orbRef.current) return;

		const roundedSize = Math.round(size * 100) / 100;

		// Apply size and glow effect
		const glowIntensity = (size - minSize) / (maxSize - minSize);
		const glowSize = 15 + glowIntensity * 20;
		const glowOpacity = 0.3 + glowIntensity * 0.5;

		orbRef.current.style.width = `${roundedSize}px`;
		orbRef.current.style.height = `${roundedSize}px`;
		orbRef.current.style.filter = `drop-shadow(0 0 ${glowSize}px rgba(0, 255, 161, ${glowOpacity}))`;
	};

	const handleAudioEnded = () => {
		stopAudio();
	};

	return (
		<div className={`orbs-v-1 ${className || ""}`}>
			<div
				ref={orbRef}
				className="ellipse-1 audio-reactive"
				onClick={handleOrbClick}
				style={{
					cursor: "pointer",
					transition: "all 0.1s ease-out",
				}}
			/>
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

export default AudioReactiveOrb;
