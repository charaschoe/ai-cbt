/**
 * ChatFlow07Enhanced - Phase 3: Text-reaktive Integration
 * Ersetzt das OrbContainer/Blob-System durch UniversalOrbAnimation
 */

import React from "react";
import "./ChatFlow07.css";
import { KeyboardIPhoneTypeDefault } from "./KeyboardIPhoneTypeDefault";
import UniversalOrbAnimation from "./UniversalOrbAnimation";
import EnhancedMessageBubble from "./EnhancedMessageBubble";
import chatService from "../services/chatService";
import blobManager from "../services/blobManager";
import conversationManager from "../services/conversationManager";

export const ChatFlow07Enhanced = ({
	className,
	onArrowClick,
	aiResponse,
	onSendMessage,
	onDebugUpdate, // Neue Prop für Debug-Daten
	...props
}) => {
	const [inputText, setInputText] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);
	const [isThinking, setIsThinking] = React.useState(false);
	const [currentLanguage, setCurrentLanguage] = React.useState("en");
	const [mood, setMood] = React.useState("neutral");
	const [patterns, setPatterns] = React.useState([]);
	const [messages, setMessages] = React.useState([]);
	const [currentThreadId, setCurrentThreadId] = React.useState(null);
	const [typingMessage, setTypingMessage] = React.useState("");
	const [isTypingAnimation, setIsTypingAnimation] = React.useState(false);
	const [showKeyboard, setShowKeyboard] = React.useState(true);
	const [currentResponseSegment, setCurrentResponseSegment] =
		React.useState(0);
	const [responseSegments, setResponseSegments] = React.useState([]);
	const [facialExpression, setFacialExpression] = React.useState("neutral");
	const [emotionalState, setEmotionalState] = React.useState("calm");
	const [showOldMessagesIndicator, setShowOldMessagesIndicator] =
		React.useState(false);

	// Enhanced: UniversalOrbAnimation State anstelle von Blob-System
	const [orbEmotionalState, setOrbEmotionalState] = React.useState("neutral");
	const [orbUrgencyLevel, setOrbUrgencyLevel] = React.useState(0.2);
	const [orbIntensity, setOrbIntensity] = React.useState(1.0);
	const [orbSentimentScore, setOrbSentimentScore] = React.useState(0);
	const [currentTextForAnalysis, setCurrentTextForAnalysis] =
		React.useState("");

	// Legacy: Blob-Analyse für Vergleich/Debug (Optional)
	const [activeBlobs, setActiveBlobs] = React.useState([]);
	const [blobAnalysis, setBlobAnalysis] = React.useState(null);

	// Basis-Größe für den Enhanced Orb (50% kleiner für bessere Chat-Integration)
	const baseSize = 139; // 50% von 277.96

	const messagesEndRef = React.useRef(null);
	const chatContainerRef = React.useRef(null);
	const typingIntervalRef = React.useRef(null);
	const thinkingTimeoutRef = React.useRef(null);

	/**
	 * Text-basierte emotionale Analyse für UniversalOrbAnimation
	 */
	const analyzeTextForOrb = React.useCallback(
		(text, isUserMessage = false) => {
			if (!text || text.trim().length === 0) return;

			// Erweiterte Sentiment-Analyse mit mehr Wörtern
			const positiveWords =
				/\b(happy|joy|excited|great|wonderful|amazing|love|fantastic|brilliant|thrilled|good|better|best|awesome|excellent|perfect|beautiful|incredible|outstanding|superb|magnificent|delighted|ecstatic|blissful|cheerful|optimistic|grateful|blessed)\b/gi;
			const negativeWords =
				/\b(sad|depressed|down|low|unhappy|miserable|terrible|awful|horrible|bad|worse|worst|hate|angry|frustrated|devastated|heartbroken|disappointed|discouraged|hopeless|despair|anguish|torment|agony|suffering|pain|hurt)\b/gi;
			const anxiousWords =
				/\b(anxious|worry|worried|stress|nervous|panic|fear|scared|overwhelmed|tension|afraid|terrified|frantic|restless|uneasy|troubled|disturbed|apprehensive|jittery|fidgety|stressed out|on edge)\b/gi;
			const traumaWords =
				/\b(trauma|abuse|violence|death|suicide|self-harm|ptsd|flashback|nightmare|assault|attack|victim|survivor|therapy|counseling|recovery|healing|trigger|episode)\b/gi;

			const positiveMatches = text.match(positiveWords) || [];
			const negativeMatches = text.match(negativeWords) || [];
			const anxiousMatches = text.match(anxiousWords) || [];
			const traumaMatches = text.match(traumaWords) || [];

			// Sentiment Score berechnen (-1 bis +1)
			const totalWords = text.split(/\s+/).length;
			const sentiment =
				(positiveMatches.length - negativeMatches.length) /
				Math.max(totalWords, 1);
			const normalizedSentiment = Math.max(
				-1,
				Math.min(1, sentiment * 3)
			); // Verstärkte Reaktion

			// Emotionaler Zustand bestimmen
			let newEmotionalState = "neutral";
			let newUrgencyLevel = 0.2;
			let newIntensity = 1.0;

			if (traumaMatches.length > 0) {
				newEmotionalState = "trauma";
				newUrgencyLevel = 0.95; // Sehr hoch
				newIntensity = 2.5; // Sehr intensiv
			} else if (anxiousMatches.length >= 2) {
				newEmotionalState = "wut"; // Angst als hohe Erregung
				newUrgencyLevel = 0.8; // Hoch
				newIntensity = 1.8;
			} else if (anxiousMatches.length >= 1) {
				newEmotionalState = "wut";
				newUrgencyLevel = 0.6;
				newIntensity = 1.4;
			} else if (negativeMatches.length > positiveMatches.length) {
				newEmotionalState = "trauer";
				newUrgencyLevel = 0.6; // Höher als vorher
				newIntensity = 1.3;
			} else if (positiveMatches.length > 0) {
				newEmotionalState = "freude";
				newUrgencyLevel = 0.4; // Höher für mehr Sichtbarkeit
				newIntensity = 1.6; // Verstärkt
			}

			// Dringlichkeit basierend auf Textlänge und Wiederholungen anpassen
			const hasExclamation = text.includes("!");
			const hasCaps = /[A-Z]{3,}/.test(text);
			const hasRepeatedPunctuation = /[!?]{2,}/.test(text);

			if (hasExclamation || hasCaps || hasRepeatedPunctuation) {
				newUrgencyLevel = Math.min(1.0, newUrgencyLevel + 0.2);
				newIntensity = Math.min(2.5, newIntensity + 0.3);
			}

			// States aktualisieren
			setOrbEmotionalState(newEmotionalState);
			setOrbUrgencyLevel(newUrgencyLevel);
			setOrbIntensity(newIntensity);
			setOrbSentimentScore(normalizedSentiment);
			setCurrentTextForAnalysis(text);

			console.log("🎭 Text Analysis for Orb:", {
				text: text.substring(0, 50) + "...",
				emotionalState: newEmotionalState,
				sentiment: normalizedSentiment,
				urgency: newUrgencyLevel,
				intensity: newIntensity,
				isUserMessage,
			});

			return {
				emotionalState: newEmotionalState,
				urgencyLevel: newUrgencyLevel,
				intensity: newIntensity,
				sentimentScore: normalizedSentiment,
			};
		},
		[]
	);

	// Enhanced scroll function with better reliability
	const scrollToBottom = () => {
		if (messagesEndRef.current && chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
			messagesEndRef.current.scrollIntoView({
				behavior: "smooth",
				block: "end",
				inline: "nearest",
			});
		}
	};

	// Enhanced scroll with old messages detection
	const handleScroll = () => {
		if (chatContainerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } =
				chatContainerRef.current;
			const isAtTop = scrollTop < 30;
			const hasOldMessages = messages.length > 3;
			setShowOldMessagesIndicator(isAtTop && hasOldMessages);
		}
	};

	// Enhanced auto-scroll with delay for better UX
	React.useEffect(() => {
		const scrollWithDelay = () => {
			setTimeout(() => {
				scrollToBottom();
			}, 50);
		};
		scrollWithDelay();
	}, [messages, typingMessage]);

	React.useEffect(() => {
		const container = chatContainerRef.current;
		if (container) {
			container.addEventListener("scroll", handleScroll, {
				passive: true,
			});
			return () => container.removeEventListener("scroll", handleScroll);
		}
	}, [messages]);

	// Initialize chat service and conversation management
	React.useEffect(() => {
		const initializeChat = async () => {
			chatService.setLanguageChangeCallback((language) => {
				setCurrentLanguage(language);
				console.log("🌍 Language changed to:", language);
			});

			conversationManager.startNewSession();

			const welcomeMessage = await chatService.startConversation();
			const initialMessage = {
				type: "ai",
				text: welcomeMessage,
				emotionalState: "supportive",
				facialExpression: "neutral",
				timestamp: Date.now(),
			};

			const thread = conversationManager.createThread(initialMessage, {
				topic: "welcome",
				emotionalTone: "supportive",
			});

			setCurrentThreadId(thread.id);
			setMessages(conversationManager.getThreadMessages(thread.id));

			// Analyse der Welcome-Message für Orb
			analyzeTextForOrb(welcomeMessage, false);
		};

		initializeChat();
	}, [analyzeTextForOrb]);

	// Legacy Blob system (für Vergleich/Debug)
	React.useEffect(() => {
		const blobUpdateInterval = setInterval(() => {
			blobManager.performBlobDecay();
			const updatedBlobs = blobManager.getActiveBlobStates();
			setActiveBlobs(updatedBlobs);

			if (updatedBlobs.length > 0 && Math.random() < 0.1) {
				console.log(
					"🔄 Legacy Blob update:",
					updatedBlobs.length,
					"active blobs"
				);
			}
		}, 1000);

		return () => clearInterval(blobUpdateInterval);
	}, []);

	// Helper function to split response into semantic segments
	const splitIntoSemanticSegments = (text) => {
		const sentences = text
			.split(/[.!?]+/)
			.filter((sentence) => sentence.trim().length > 0);
		const segments = [];
		let currentSegment = "";
		let questionCount = 0;

		for (let i = 0; i < sentences.length; i++) {
			const sentence = sentences[i].trim();
			if (!sentence) continue;

			const isQuestion = sentence.includes("?");
			if (isQuestion) questionCount++;

			if (questionCount > 2 && currentSegment.length > 0) {
				segments.push(currentSegment.trim() + ".");
				currentSegment = sentence;
				questionCount = isQuestion ? 1 : 0;
			} else {
				if (currentSegment) currentSegment += ". ";
				currentSegment += sentence;
			}

			if (currentSegment.length > 150 && i < sentences.length - 1) {
				segments.push(currentSegment.trim() + ".");
				currentSegment = "";
				questionCount = 0;
			}
		}

		if (currentSegment.trim()) {
			segments.push(currentSegment.trim() + ".");
		}

		return segments.length > 0 ? segments : [text];
	};

	// Enhanced facial expression detection and emotional state management
	const detectFacialExpression = (text, userMessage = "") => {
		const sadWords =
			/\b(sad|depressed|down|low|unhappy|miserable|grief|sorrow|despair|heartbreak|devastated)\b/i;
		const happyWords =
			/\b(happy|joy|excited|great|wonderful|amazing|fantastic|love|excellent|brilliant|thrilled)\b/i;
		const anxiousWords =
			/\b(anxious|worry|worried|stress|nervous|panic|fear|scared|overwhelmed|tension)\b/i;
		const angryWords =
			/\b(angry|mad|furious|annoyed|frustrated|irritated|rage|upset|pissed)\b/i;
		const surprisedWords =
			/\b(surprised|shocked|amazed|wow|incredible|unbelievable|astonishing)\b/i;
		const thoughtfulWords =
			/\b(think|consider|wonder|contemplate|reflect|ponder|question|curious)\b/i;

		if (sadWords.test(text) || sadWords.test(userMessage)) return "sad";
		if (happyWords.test(text) || happyWords.test(userMessage))
			return "happy";
		if (anxiousWords.test(text) || anxiousWords.test(userMessage))
			return "anxious";
		if (angryWords.test(text) || angryWords.test(userMessage))
			return "angry";
		if (surprisedWords.test(text) || surprisedWords.test(userMessage))
			return "surprised";
		if (thoughtfulWords.test(text) || thoughtfulWords.test(userMessage))
			return "thoughtful";

		return "neutral";
	};

	const detectEmotionalState = (text, expression) => {
		if (expression === "sad") return "empathetic";
		if (expression === "happy") return "celebratory";
		if (expression === "anxious") return "calming";
		if (expression === "angry") return "understanding";
		if (expression === "surprised") return "curious";
		if (expression === "thoughtful") return "contemplative";
		return "supportive";
	};

	// Enhanced thinking simulation with facial expressions
	const simulateThinking = (userMessage = "", expectedResponse = "") => {
		return new Promise((resolve) => {
			setIsThinking(true);

			const expression = detectFacialExpression(
				expectedResponse,
				userMessage
			);
			const emotional = detectEmotionalState(
				expectedResponse,
				expression
			);
			setFacialExpression(expression);
			setEmotionalState(emotional);

			let baseDuration = 1500;
			if (expression === "thoughtful") baseDuration = 2500;
			if (expression === "sad" || expression === "anxious")
				baseDuration = 2000;
			if (expression === "happy") baseDuration = 1000;

			const thinkingDuration = Math.random() * 1000 + baseDuration;
			thinkingTimeoutRef.current = setTimeout(() => {
				setIsThinking(false);
				resolve();
			}, thinkingDuration);
		});
	};

	const typeMessage = (fullMessage, isSegment = false) => {
		return new Promise((resolve) => {
			setIsTypingAnimation(true);
			setTypingMessage("");
			let currentIndex = 0;

			const typeChar = () => {
				if (currentIndex < fullMessage.length) {
					setTypingMessage(
						fullMessage.substring(0, currentIndex + 1)
					);
					currentIndex++;
					setTimeout(() => {
						scrollToBottom();
					}, 20);
					typingIntervalRef.current = setTimeout(
						typeChar,
						isSegment ? 40 : 35
					);
				} else {
					setIsTypingAnimation(false);
					setTimeout(() => {
						scrollToBottom();
					}, 100);
					resolve();
				}
			};

			typeChar();
		});
	};

	// Enhanced response processing with dramatic pauses and expressions
	const processResponseWithPauses = async (
		fullResponse,
		userMessage = ""
	) => {
		const segments = splitIntoSemanticSegments(fullResponse);
		setResponseSegments(segments);

		for (let i = 0; i < segments.length; i++) {
			setCurrentResponseSegment(i);

			if (i > 0) {
				await simulateThinking(userMessage, segments[i]);
			}

			const segmentExpression = detectFacialExpression(
				segments[i],
				userMessage
			);
			setFacialExpression(segmentExpression);

			// Analyse des aktuellen Segments für Orb-Animation
			analyzeTextForOrb(segments[i], false);

			await typeMessage(segments[i], true);

			const segmentMessage = {
				type: "ai",
				text: segments[i],
				isSegment: true,
				segmentIndex: i,
				facialExpression: segmentExpression,
				emotionalState: detectEmotionalState(
					segments[i],
					segmentExpression
				),
				timestamp: Date.now(),
			};

			conversationManager.addMessageToThread(
				currentThreadId,
				segmentMessage
			);
			setMessages(conversationManager.getThreadMessages(currentThreadId));
			setTypingMessage("");

			if (i < segments.length - 1) {
				let pauseDuration = 800;
				if (segmentExpression === "thoughtful") pauseDuration = 1200;
				if (segmentExpression === "sad") pauseDuration = 1000;
				if (segmentExpression === "surprised") pauseDuration = 600;
				await new Promise((resolve) =>
					setTimeout(resolve, pauseDuration)
				);
			}
		}

		setResponseSegments([]);
		setCurrentResponseSegment(0);
		setFacialExpression("neutral");
		setEmotionalState("supportive");

		// Nach vollständiger Antwort zu Neutral zurückkehren (mit Verzögerung)
		setTimeout(() => {
			setOrbEmotionalState("neutral");
			setOrbUrgencyLevel(0.2);
			setOrbIntensity(1.0);
		}, 3000);
	};

	React.useEffect(() => {
		return () => {
			if (typingIntervalRef.current) {
				clearTimeout(typingIntervalRef.current);
			}
			if (thinkingTimeoutRef.current) {
				clearTimeout(thinkingTimeoutRef.current);
			}
		};
	}, []);

	const handleArrowClick = () => {
		if (onArrowClick) {
			onArrowClick();
		}
	};

	const handleSendClick = async () => {
		if (
			inputText.trim() &&
			onSendMessage &&
			!isLoading &&
			!isTypingAnimation &&
			!isThinking
		) {
			const userMessage = inputText.trim();

			// Analyse der User-Message für Orb
			analyzeTextForOrb(userMessage, true);

			// Legacy Blob processing für Vergleich
			const blobUpdate = blobManager.processChatInput(
				userMessage,
				"user"
			);
			setActiveBlobs(blobUpdate.activeBlobs);
			setBlobAnalysis(blobUpdate.analysis);

			console.log("🧠 Legacy Emotional Analysis:", blobUpdate.analysis);
			console.log("🎯 Legacy Active Blobs:", blobUpdate.activeBlobs);

			const userMessageObj = {
				type: "user",
				text: userMessage,
				emotionalState: "neutral",
				facialExpression: "neutral",
				timestamp: Date.now(),
			};

			const addedUserMessage = conversationManager.addMessageToThread(
				currentThreadId,
				userMessageObj,
				blobUpdate.analysis
			);

			setMessages(conversationManager.getThreadMessages(currentThreadId));
			setInputText("");
			setIsLoading(true);
			setShowKeyboard(false);

			try {
				const responseData = await chatService.sendMessage(userMessage);
				setIsLoading(false);

				if (responseData.mood) {
					setMood(responseData.mood);
				}
				if (responseData.patterns) {
					setPatterns(responseData.patterns);
				}
				if (responseData.detectedLanguage) {
					setCurrentLanguage(responseData.detectedLanguage);
				}

				const response = responseData.response || responseData;

				// Process AI response with legacy blob manager
				const aiBlobUpdate = blobManager.processChatInput(
					response,
					"ai"
				);
				setActiveBlobs(aiBlobUpdate.activeBlobs);

				await simulateThinking(userMessage, response);
				await processResponseWithPauses(response, userMessage);

				setShowKeyboard(true);
			} catch (error) {
				setIsLoading(false);

				const errorMessages = {
					de: "Es tut mir leid, ich habe gerade Verbindungsprobleme. Bitte versuche es erneut.",
					en: "I'm sorry, I'm having trouble connecting right now. Please try again.",
					fr: "Je suis désolé, j'ai des problèmes de connexion. Veuillez réessayer.",
					es: "Lo siento, tengo problemas de conexión ahora. Por favor, inténtalo de nuevo.",
					it: "Mi dispiace, ho problemi di connessione ora. Per favore riprova.",
				};

				const errorMsg =
					errorMessages[currentLanguage] || errorMessages.en;

				await simulateThinking();
				await typeMessage(errorMsg);

				const errorMessage = {
					type: "ai",
					text: errorMsg,
					emotionalState: "supportive",
					facialExpression: "empathetic",
					timestamp: Date.now(),
				};

				conversationManager.addMessageToThread(
					currentThreadId,
					errorMessage
				);
				setMessages(
					conversationManager.getThreadMessages(currentThreadId)
				);
				setTypingMessage("");
				setShowKeyboard(true);
			}
		}
	};

	const handleInputChange = (e) => {
		const newValue = e.target.value;
		setInputText(newValue);

		// Live-Analyse während des Tippens für sofortige Orb-Reaktion
		if (newValue.trim().length > 3) {
			// Analyse erst ab 4 Zeichen
			analyzeTextForOrb(newValue.trim(), true);
		} else if (newValue.trim().length === 0) {
			// Reset zu neutral wenn Text gelöscht wird
			setOrbEmotionalState("neutral");
			setOrbUrgencyLevel(0.2);
			setOrbIntensity(1.0);
			setOrbSentimentScore(0);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendClick();
		}
	};

	// Orb Click Handler
	const handleOrbClick = React.useCallback(() => {
		console.log("🎯 Enhanced Orb clicked! Current state:", {
			emotionalState: orbEmotionalState,
			urgency: orbUrgencyLevel,
			intensity: orbIntensity,
		});
	}, [orbEmotionalState, orbUrgencyLevel, orbIntensity]);

	return (
		<div
			className={`chat-flow-07 enhanced ${
				!showKeyboard ? "keyboard-hidden" : ""
			} ${className || ""}`}
		>
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
			<img
				className="vector-1"
				src="vector-10.svg"
				onClick={handleArrowClick}
				style={{ cursor: "pointer" }}
			/>

			{/* Chat Messages Area */}
			<div className="chat-messages-container" ref={chatContainerRef}>
				{showOldMessagesIndicator && (
					<div className="old-messages-indicator">
						<div className="ellipsis-barrier">
							<div className="barrier-ellipse"></div>
							<div className="barrier-ellipse"></div>
							<div className="barrier-ellipse"></div>
						</div>
						<div className="old-messages-text">
							{currentLanguage === "de"
								? "Ältere Nachrichten"
								: currentLanguage === "fr"
								? "Messages précédents"
								: currentLanguage === "es"
								? "Mensajes anteriores"
								: currentLanguage === "it"
								? "Messaggi precedenti"
								: "Older messages"}
						</div>
					</div>
				)}

				{messages.map((message, index) => (
					<EnhancedMessageBubble
						key={message.id || index}
						message={message}
						type={message.type}
						emotionalState={message.emotionalState}
						facialExpression={message.facialExpression}
						threadInfo={{
							threadId: currentThreadId,
							threadPosition: message.threadPosition,
							isFirstInThread: message.isFirstInThread,
						}}
						showTimestamp={
							index === messages.length - 1 || index % 5 === 0
						}
					/>
				))}

				{(isLoading || isThinking) && (
					<div className="message ai-message">
						<div
							className={`message-bubble loading expression-${facialExpression} emotional-${emotionalState}`}
						>
							{isThinking ? (
								<div className="thinking-indicator">
									<div className="thinking-text">
										{facialExpression === "thoughtful" &&
											(currentLanguage === "de"
												? "Überlege sorgfältig..."
												: currentLanguage === "fr"
												? "Je réfléchis attentivement..."
												: currentLanguage === "es"
												? "Reflexionando cuidadosamente..."
												: currentLanguage === "it"
												? "Riflettendo attentamente..."
												: "Thinking carefully...")}
										{facialExpression === "empathetic" &&
											(currentLanguage === "de"
												? "Verstehe deine Gefühle..."
												: currentLanguage === "fr"
												? "Je comprends tes sentiments..."
												: currentLanguage === "es"
												? "Entiendo tus sentimientos..."
												: currentLanguage === "it"
												? "Capisco i tuoi sentimenti..."
												: "Understanding your feelings...")}
										{facialExpression === "neutral" &&
											(currentLanguage === "de"
												? "Denke nach..."
												: currentLanguage === "fr"
												? "Je réfléchis..."
												: currentLanguage === "es"
												? "Pensando..."
												: currentLanguage === "it"
												? "Sto pensando..."
												: "Thinking...")}
									</div>
									<div
										className={`thinking-dots expression-${facialExpression}`}
									>
										<div className="thought-dot"></div>
										<div className="thought-dot"></div>
										<div className="thought-dot"></div>
									</div>
								</div>
							) : (
								<div className="typing-indicator">
									<div className="dot"></div>
									<div className="dot"></div>
									<div className="dot"></div>
								</div>
							)}
						</div>
					</div>
				)}

				{isTypingAnimation && typingMessage && (
					<div className="message ai-message">
						<div
							className={`message-bubble typing-animation expression-${facialExpression} emotional-${emotionalState}`}
						>
							{typingMessage}
							<span className="cursor">|</span>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			<div className="frame-1">
				<div className="ellipse-52"></div>
				<div className="ellipse-62"></div>
				<div className="ellipse-72"></div>
			</div>

			{/* Enhanced: UniversalOrbAnimation anstelle von OrbContainer */}
			<div className="orbs-v-3-instance enhanced">
				<UniversalOrbAnimation
					mode="text"
					baseSize={baseSize}
					emotionalState={orbEmotionalState}
					urgencyLevel={orbUrgencyLevel}
					textInput={currentTextForAnalysis}
					sentimentScore={orbSentimentScore}
					intensity={orbIntensity}
					onClick={handleOrbClick}
					enableDebug={true} // Debug für externe Übertragung aktivieren
					onDebugUpdate={onDebugUpdate} // Debug-Daten weiterleiten
					onStateChange={(newState, oldState) => {
						console.log("🎭 Enhanced Orb state changed:", {
							newState,
							oldState,
						});
					}}
					onPerformanceUpdate={(metrics) => {
						if (Math.random() < 0.1) {
							console.log(
								"📊 Enhanced Orb performance:",
								metrics
							);
						}
					}}
					className="text-reactive-orb"
				/>
			</div>

			{/* Keyboard */}
			{showKeyboard && (
				<>
					<KeyboardIPhoneTypeDefault
						visibleComponent={false}
						visibleComponent2={false}
						visibleComponent3={false}
						className="keyboard-i-phone-instance"
					/>

					<div className="keyboard-text-inputs">
						<div className="frame-14">
							<div className="frame-12">
								<div className="iconset-full-screen">
									<img
										className="iconset-add"
										src="iconset-add0.svg"
									/>
								</div>
							</div>
							<div className="frame-10">
								<input
									type="text"
									className="div"
									placeholder={
										currentLanguage === "de"
											? "Gib deine Nachricht ein..."
											: currentLanguage === "fr"
											? "Tapez votre message..."
											: currentLanguage === "es"
											? "Escribe tu mensaje..."
											: currentLanguage === "it"
											? "Scrivi il tuo messaggio..."
											: "Type your message..."
									}
									value={inputText}
									onChange={handleInputChange}
									onKeyPress={handleKeyPress}
									disabled={isLoading || isThinking}
								/>
							</div>
							<div className="frame-142">
								<div className="iconset-full-screen2">
									<img
										className="voice-mail-mic-audio-mike-music-microphone"
										src="voice-mail-mic-audio-mike-music-microphone0.svg"
									/>
								</div>
								<img
									className="iconset-arrow-up"
									src="iconset-arrow-up0.svg"
									onClick={handleSendClick}
									style={{
										cursor:
											inputText.trim() &&
											!isLoading &&
											!isThinking
												? "pointer"
												: "default",
										opacity:
											inputText.trim() &&
											!isLoading &&
											!isThinking
												? 1
												: 0.5,
									}}
								/>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default ChatFlow07Enhanced;
