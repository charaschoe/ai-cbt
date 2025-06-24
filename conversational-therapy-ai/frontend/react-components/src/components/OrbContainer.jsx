import React, { useState, useEffect, useRef } from "react";
import { OrbsV3Property1Variant4 } from "./OrbsV3Property1Variant4";
import EmotionalUrgencyBlob from "./EmotionalUrgencyBlob";
import layoutCoordinator from "../services/LayoutCoordinator";
import "./OrbContainer.css";

const OrbContainer = ({
	activeBlobs = [],
	className = "",
	property1 = "variant-4",
	visualState = "default", // calm, tuned-in, emotional, deeper-trauma
	size = "medium", // small, medium, large
	...props
}) => {
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [showEmotionalBlob, setShowEmotionalBlob] = useState(false);
	const [currentVisualState, setCurrentVisualState] = useState(visualState);
	const orbRef = useRef(null);

	// CRITICAL FIX: Enhanced Transition State Management
	const [orbTransition, setOrbTransition] = useState({
		isTransitioning: false,
		direction: null, // 'to-emotional' | 'to-standard'
		duration: 500
	});

	// CRITICAL FIX: Layout Coordinator Integration
	const coordinatorRef = useRef(null);

	// Bestimme den dominantesten Blob (höchste Priorität)
	const dominantBlob =
		activeBlobs.length > 0
			? activeBlobs.reduce((prev, current) =>
					prev.priority > current.priority ? prev : current
			  )
			: null;

	// Chat_perfect gradient states
	const gradientStates = {
		default:
			"radial-gradient(50% 50% at 50% 50%, rgba(0, 255, 161, 0.8) 0%, rgba(68, 140, 255, 0.6) 50%, rgba(255, 187, 148, 0.4) 100%)",
		calm: "radial-gradient(50% 50% at 50% 50%, rgba(0, 255, 161, 0.9) 0%, rgba(68, 140, 255, 0.7) 70%, rgba(255, 187, 148, 0.3) 100%)",
		"tuned-in":
			"radial-gradient(50% 50% at 50% 50%, rgba(68, 140, 255, 0.9) 0%, rgba(0, 255, 161, 0.7) 40%, rgba(255, 187, 148, 0.5) 100%)",
		emotional:
			"radial-gradient(50% 50% at 50% 50%, rgba(255, 187, 148, 0.9) 0%, rgba(68, 140, 255, 0.6) 60%, rgba(0, 255, 161, 0.4) 100%)",
		"deeper-trauma":
			"radial-gradient(50% 50% at 50% 50%, rgba(255, 187, 148, 1.0) 0%, rgba(255, 140, 140, 0.8) 50%, rgba(200, 100, 100, 0.6) 100%)",
	};

	// Size mappings following chat_perfect design
	const sizeMap = {
		small: "200px",
		medium: "277.96px", // chat_perfect standard
		large: "350px",
	};

	// CRITICAL FIX: Enhanced Coordinated Smooth Transitions
	useEffect(() => {
		const shouldShowEmotional = dominantBlob && dominantBlob.isVisible;

		if (shouldShowEmotional !== showEmotionalBlob) {
			handleCoordinatedTransition(shouldShowEmotional);
		}
	}, [dominantBlob, showEmotionalBlob]);

	// CRITICAL FIX: Layout Coordinator Registration
	useEffect(() => {
		// Register with Layout Coordinator
		const orbId = `orb-container-${Date.now()}`;
		coordinatorRef.current = layoutCoordinator.registerComponent(
			orbId,
			'orb',
			{
				priority: 3,
				canInterrupt: true,
				maxDuration: 500
			}
		);

		console.log(`[OrbContainer] Registered with Layout Coordinator: ${orbId}`);

		// Cleanup: Unregister from Layout Coordinator
		return () => {
			if (coordinatorRef.current) {
				layoutCoordinator.unregisterComponent(orbId);
				console.log(`[OrbContainer] Unregistered from Layout Coordinator: ${orbId}`);
			}
		};
	}, []);

	const handleCoordinatedTransition = async (shouldShowEmotional) => {
		// Request coordinated transition through layout coordinator
		const transitionAllowed = await coordinatorRef.current?.requestTransition({
			type: shouldShowEmotional ? 'orb-to-emotional' : 'orb-to-standard',
			duration: 500,
			priority: 3,
			canInterrupt: true
		});

		if (!transitionAllowed) {
			console.warn('[OrbContainer] Orb transition denied by coordinator');
			return;
		}

		// Set coordinated transition state
		setOrbTransition({
			isTransitioning: true,
			direction: shouldShowEmotional ? 'to-emotional' : 'to-standard',
			duration: 500
		});
		setIsTransitioning(true);

		// Phase 1: Fade out current orb (250ms)
		await new Promise(resolve => {
			requestAnimationFrame(() => {
				// Add fade-out class to trigger CSS transition
				if (orbRef.current) {
					orbRef.current.classList.add('orb-fade-out');
				}
				setTimeout(resolve, 250);
			});
		});

		// Phase 2: Switch orb content during opacity 0 state
		requestAnimationFrame(() => {
			setShowEmotionalBlob(shouldShowEmotional);
			
			// Remove fade-out and add fade-in
			if (orbRef.current) {
				orbRef.current.classList.remove('orb-fade-out');
				orbRef.current.classList.add('orb-fade-in');
			}
		});

		// Phase 3: Fade in new orb (250ms)
		await new Promise(resolve => {
			setTimeout(() => {
				if (orbRef.current) {
					orbRef.current.classList.remove('orb-fade-in');
				}
				setOrbTransition({
					isTransitioning: false,
					direction: null,
					duration: 500
				});
				setIsTransitioning(false);
				
				// Notify coordinator of completion
				coordinatorRef.current?.completeTransition();
				resolve();
			}, 250);
		});
	};

	// Update visual state based on emotional context
	useEffect(() => {
		if (dominantBlob) {
			const newState =
				dominantBlob.type === "trauma"
					? "deeper-trauma"
					: dominantBlob.urgencyLevel > 0.7
					? "emotional"
					: dominantBlob.urgencyLevel > 0.4
					? "tuned-in"
					: "calm";
			setCurrentVisualState(newState);
		} else {
			setCurrentVisualState(visualState);
		}
	}, [dominantBlob, visualState]);

	// Apply chat_perfect therapeutic gradients
	useEffect(() => {
		if (orbRef.current) {
			const gradient =
				gradientStates[currentVisualState] || gradientStates.default;
			const containerSize = sizeMap[size] || sizeMap.medium;

			orbRef.current.style.background = gradient;
			orbRef.current.style.width = containerSize;
			orbRef.current.style.height = containerSize;
			orbRef.current.style.transition =
				"all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"; // chat_perfect easing
		}
	}, [currentVisualState, size]);

	return (
		<div
			ref={orbRef}
			className={`orb-container enhanced-orb-container ${className} state-${currentVisualState} size-${size}`}
			{...props}
		>
			{/* Standard Orb mit chat_perfect Styling */}
			<div
				className={`standard-orb ${
					showEmotionalBlob ? "hidden" : "visible"
				} ${isTransitioning ? "transitioning" : ""}`}
			>
				<OrbsV3Property1Variant4
					property1={property1}
					className="orbs-v-3-instance enhanced-orb"
				/>
			</div>

			{/* Emotional Urgency Blob mit verbesserter Integration */}
			{dominantBlob && (
				<div
					className={`emotional-orb ${
						showEmotionalBlob ? "visible" : "hidden"
					} ${isTransitioning ? "transitioning" : ""}`}
				>
					<EmotionalUrgencyBlob
						size={dominantBlob.size}
						emotionType={dominantBlob.type}
						urgencyLevel={dominantBlob.urgencyLevel}
						isVisible={showEmotionalBlob}
						animationIntensity={dominantBlob.animationIntensity}
					/>
				</div>
			)}

			{/* Chat_perfect consistent container styling */}
			<div className="orb-therapeutic-glow" />

			{/* Enhanced Debug Info (nur im Development) */}
			{process.env.NODE_ENV === "development" && (
				<div className="orb-debug-info enhanced-debug">
					<div className="debug-text">
						State: {currentVisualState} | Size: {size}
					</div>
					{dominantBlob && (
						<>
							<div className="debug-text">
								{dominantBlob.type} (
								{dominantBlob.urgencyLevel?.toFixed(2)})
							</div>
							<div className="debug-text">
								Intensity:{" "}
								{dominantBlob.animationIntensity?.toFixed(2)}
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default OrbContainer;
