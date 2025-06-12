import React, { useState, useEffect } from "react";
import "./EmotionalUrgencyBlob.css";
import {
	BLOB_SIZES,
	BLOB_TYPES,
	EMOTIONAL_URGENCY_LEVELS,
} from "../services/emotionalCategorizer";

const EmotionalUrgencyBlob = ({
	size = BLOB_SIZES.SMALL,
	emotionType = BLOB_TYPES.EMOTIONAL_URGENCY,
	urgencyLevel = EMOTIONAL_URGENCY_LEVELS.LOW,
	isVisible = true,
	animationIntensity = 1,
}) => {
	const [animationPhase, setAnimationPhase] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setAnimationPhase((prev) => (prev + 1) % 360);
		}, 50 + 100 / animationIntensity); // Schnellere Animation bei höherer Intensität

		return () => clearInterval(interval);
	}, [animationIntensity]);

	// Bestimme Blob-Eigenschaften basierend auf Größe und Emotion
	const getBlobProperties = () => {
		const baseProperties = {
			[BLOB_SIZES.SMALL]: { width: 346, height: 346, containerSize: 500 },
			[BLOB_SIZES.MEDIUM]: {
				width: 458,
				height: 458,
				containerSize: 500,
			},
			[BLOB_SIZES.LARGE]: { width: 580, height: 580, containerSize: 650 },
			[BLOB_SIZES.XLARGE]: {
				width: 720,
				height: 720,
				containerSize: 800,
			},
			[BLOB_SIZES.NONE]: { width: 0, height: 0, containerSize: 0 },
		};

		return baseProperties[size] || baseProperties[BLOB_SIZES.SMALL];
	};

	// Bestimme Farben basierend auf Emotionstyp und Dringlichkeit
	const getBlobColors = () => {
		const colorSchemes = {
			// Neutral state - mimics the original orb appearance
			neutral: {
				[EMOTIONAL_URGENCY_LEVELS.NONE]: {
					primary: "radial-gradient(100% 100% at 50% 0%, #FFF89D 0%, rgba(150, 208, 255, 0.5) 36.5%, rgba(219, 233, 255, 0.5) 69.5%, rgba(255, 220, 181, 0.5) 85.5%, rgba(255, 187, 148, 0) 100%)",
					secondary: "rgba(150, 208, 255, 0.3)",
					tertiary: "rgba(219, 233, 255, 0.2)",
				},
			},
			[BLOB_TYPES.EMOTIONAL_URGENCY]: {
				[EMOTIONAL_URGENCY_LEVELS.LOW]: {
					primary: "#FF8800",
					secondary: "rgba(255, 68, 152, 0.5)",
					tertiary: "rgba(255, 127, 185, 0)",
				},
				[EMOTIONAL_URGENCY_LEVELS.MEDIUM]: {
					primary: "#FF6600",
					secondary: "rgba(255, 68, 152, 0.7)",
					tertiary: "rgba(255, 127, 185, 0)",
				},
				[EMOTIONAL_URGENCY_LEVELS.HIGH]: {
					primary: "#FF4400",
					secondary: "rgba(255, 30, 120, 0.8)",
					tertiary: "rgba(255, 60, 160, 0)",
				},
				[EMOTIONAL_URGENCY_LEVELS.CRITICAL]: {
					primary: "#FF0000",
					secondary: "rgba(255, 0, 60, 0.9)",
					tertiary: "rgba(255, 20, 100, 0)",
				},
			},
			[BLOB_TYPES.SEEKING_INSIGHTS]: {
				[EMOTIONAL_URGENCY_LEVELS.LOW]: {
					primary: "#FFF89D",
					secondary: "rgba(150, 208, 255, 0.5)",
					tertiary: "rgba(219, 233, 255, 0.5)",
					quaternary: "rgba(255, 220, 181, 0.5)",
					quinary: "rgba(255, 187, 148, 0)",
				},
				[EMOTIONAL_URGENCY_LEVELS.MEDIUM]: {
					primary: "#FFF89D",
					secondary: "rgba(150, 208, 255, 0.6)",
					tertiary: "rgba(219, 233, 255, 0.6)",
					quaternary: "rgba(255, 220, 181, 0.6)",
					quinary: "rgba(255, 187, 148, 0)",
				},
				[EMOTIONAL_URGENCY_LEVELS.HIGH]: {
					primary: "#FFF89D",
					secondary: "rgba(150, 208, 255, 0.7)",
					tertiary: "rgba(219, 233, 255, 0.7)",
					quaternary: "rgba(255, 220, 181, 0.7)",
					quinary: "rgba(255, 187, 148, 0.1)",
				},
				[EMOTIONAL_URGENCY_LEVELS.CRITICAL]: {
					primary: "#FFF89D",
					secondary: "rgba(150, 208, 255, 0.8)",
					tertiary: "rgba(219, 233, 255, 0.8)",
					quaternary: "rgba(255, 220, 181, 0.8)",
					quinary: "rgba(255, 187, 148, 0.2)",
				},
			},
			[BLOB_TYPES.ANXIETY]: {
				[EMOTIONAL_URGENCY_LEVELS.LOW]: {
					primary: "#4A90E2",
					secondary: "rgba(74, 144, 226, 0.5)",
					tertiary: "rgba(74, 144, 226, 0)",
				},
				[EMOTIONAL_URGENCY_LEVELS.MEDIUM]: {
					primary: "#2E5BBA",
					secondary: "rgba(46, 91, 186, 0.7)",
					tertiary: "rgba(46, 91, 186, 0)",
				},
				[EMOTIONAL_URGENCY_LEVELS.HIGH]: {
					primary: "#1A365D",
					secondary: "rgba(26, 54, 93, 0.8)",
					tertiary: "rgba(26, 54, 93, 0)",
				},
			},
			[BLOB_TYPES.JOY]: {
				[EMOTIONAL_URGENCY_LEVELS.LOW]: {
					primary: "#FFD700",
					secondary: "rgba(255, 215, 0, 0.5)",
					tertiary: "rgba(255, 215, 0, 0)",
				},
				[EMOTIONAL_URGENCY_LEVELS.MEDIUM]: {
					primary: "#FFA500",
					secondary: "rgba(255, 165, 0, 0.7)",
					tertiary: "rgba(255, 165, 0, 0)",
				},
			},
			[BLOB_TYPES.SADNESS]: {
				[EMOTIONAL_URGENCY_LEVELS.LOW]: {
					primary: "#6495ED",
					secondary: "rgba(100, 149, 237, 0.5)",
					tertiary: "rgba(100, 149, 237, 0)",
				},
				[EMOTIONAL_URGENCY_LEVELS.MEDIUM]: {
					primary: "#4169E1",
					secondary: "rgba(65, 105, 225, 0.7)",
					tertiary: "rgba(65, 105, 225, 0)",
				},
			},
		};

		const scheme =
			colorSchemes[emotionType]?.[urgencyLevel] ||
			colorSchemes['neutral']?.[EMOTIONAL_URGENCY_LEVELS.NONE] ||
			colorSchemes[BLOB_TYPES.EMOTIONAL_URGENCY][
				EMOTIONAL_URGENCY_LEVELS.LOW
			];

		return scheme;
	};

	const properties = getBlobProperties();
	const colors = getBlobColors();

	if (size === BLOB_SIZES.NONE || !isVisible) {
		return null;
	}

	// Animationsintensität basierend auf Dringlichkeit
	const getAnimationIntensity = () => {
		// Neutral state has very low animation intensity
		if (emotionType === 'neutral') {
			return 0.2;
		}
		
		const intensityMap = {
			[EMOTIONAL_URGENCY_LEVELS.NONE]: 0.2,
			[EMOTIONAL_URGENCY_LEVELS.LOW]: 1,
			[EMOTIONAL_URGENCY_LEVELS.MEDIUM]: 1.5,
			[EMOTIONAL_URGENCY_LEVELS.HIGH]: 2.5,
			[EMOTIONAL_URGENCY_LEVELS.CRITICAL]: 4,
		};
		return intensityMap[urgencyLevel] || 1;
	};

	const currentIntensity = getAnimationIntensity();

	// Dynamische Animation basierend auf Phase und Intensität
	const pulseFactor =
		1 + Math.sin((animationPhase * Math.PI) / 180) * 0.1 * currentIntensity;
	const offsetX =
		Math.sin((animationPhase * Math.PI) / 90) * 5 * currentIntensity;
	const offsetY =
		Math.cos((animationPhase * Math.PI) / 120) * 3 * currentIntensity;

	// Spezielle Gradient-Behandlung für seeking insights (Rudolf Steiner Farbtheorie)
	const getGradientBackground = () => {
		// Neutral state uses the original orb gradient
		if (emotionType === 'neutral') {
			return colors.primary; // This already contains the radial-gradient
		} else if (emotionType === BLOB_TYPES.SEEKING_INSIGHTS) {
			return `radial-gradient(50% 50% at 50% 50%, ${colors.primary} 17.31%, ${colors.secondary} 53.85%, ${colors.tertiary} 64.91%, ${colors.quaternary} 71.16%, ${colors.quinary} 100%)`;
		} else {
			return `radial-gradient(50% 50% at 50% 50%, ${colors.primary} 11.06%, ${colors.secondary} 61.54%, ${colors.tertiary} 100%)`;
		}
	};

	return (
		<div
			className={`emotional-urgency-blob-container ${emotionType} ${urgencyLevel}`}
			style={{
				position: "absolute",
				width: `${properties.containerSize}px`,
				height: `${properties.containerSize}px`,
				transform: `translate(${offsetX}px, ${offsetY}px)`,
				transition: "all 0.1s ease-out",
			}}
		>
			<div
				className="emotional-urgency-blob"
				style={{
					position: "absolute",
					width: `${properties.width * pulseFactor}px`,
					height: `${properties.height * pulseFactor}px`,
					left: `calc(50% - ${
						(properties.width * pulseFactor) / 2
					}px)`,
					top: `calc(50% - ${
						(properties.height * pulseFactor) / 2
					}px)`,
					background: getGradientBackground(),
					borderRadius: "50%",
					transition: "all 0.1s ease-out",
					opacity: 0.8 + 0.2 * currentIntensity,
					filter: `blur(${Math.max(0, 2 - currentIntensity)}px)`,
				}}
			/>

			{/* Zusätzliche Glow-Effekte für höhere Dringlichkeit */}
			{currentIntensity > 2 && (
				<div
					className="emotional-urgency-glow"
					style={{
						position: "absolute",
						width: `${properties.width * pulseFactor * 1.2}px`,
						height: `${properties.height * pulseFactor * 1.2}px`,
						left: `calc(50% - ${
							(properties.width * pulseFactor * 1.2) / 2
						}px)`,
						top: `calc(50% - ${
							(properties.height * pulseFactor * 1.2) / 2
						}px)`,
						background: `radial-gradient(50% 50% at 50% 50%, transparent 0%, ${colors.primary}40 30%, transparent 70%)`,
						borderRadius: "50%",
						opacity: 0.3,
						animation: `urgency-pulse ${
							2 / currentIntensity
						}s ease-in-out infinite alternate`,
					}}
				/>
			)}

			{/* Kritische Dringlichkeit: Zusätzliche Warnsignale */}
			{urgencyLevel === EMOTIONAL_URGENCY_LEVELS.CRITICAL && (
				<>
					<div
						className="critical-ring"
						style={{
							position: "absolute",
							width: `${properties.width * pulseFactor * 1.5}px`,
							height: `${
								properties.height * pulseFactor * 1.5
							}px`,
							left: `calc(50% - ${
								(properties.width * pulseFactor * 1.5) / 2
							}px)`,
							top: `calc(50% - ${
								(properties.height * pulseFactor * 1.5) / 2
							}px)`,
							border: `3px solid ${colors.primary}`,
							borderRadius: "50%",
							opacity: 0.6,
							animation:
								"critical-warning 0.5s ease-in-out infinite alternate",
						}}
					/>
					<div
						className="critical-inner-ring"
						style={{
							position: "absolute",
							width: `${properties.width * pulseFactor * 0.7}px`,
							height: `${
								properties.height * pulseFactor * 0.7
							}px`,
							left: `calc(50% - ${
								(properties.width * pulseFactor * 0.7) / 2
							}px)`,
							top: `calc(50% - ${
								(properties.height * pulseFactor * 0.7) / 2
							}px)`,
							border: `2px solid ${colors.primary}`,
							borderRadius: "50%",
							opacity: 0.4,
							animation:
								"critical-warning 0.3s ease-in-out infinite alternate reverse",
						}}
					/>
				</>
			)}
		</div>
	);
};

export default EmotionalUrgencyBlob;
