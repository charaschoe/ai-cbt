import React from "react";
import "./ChatFlow07.css";
import { KeyboardIPhoneTypeDefault } from "./KeyboardIPhoneTypeDefault";
import { OrbsV3Property1Variant4 } from "./OrbsV3Property1Variant4";
import OrbContainer from "./OrbContainer";
import EmotionalUrgencyBlob from "./EmotionalUrgencyBlob";
import EnhancedMessageBubble from "./EnhancedMessageBubble";
import chatService from "../services/chatService";
import blobManager from "../services/blobManager";
import conversationManager from "../services/conversationManager";
import emotionStateManager from "../services/emotionStateManager";
import layoutCoordinator from "../services/LayoutCoordinator";

export const ChatFlow07 = ({
	className,
	onArrowClick,
	aiResponse,
	onSendMessage,
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
	// CRITICAL FIX: Message backup and recovery system
	const messageBackupRef = React.useRef([]);
	const lastKnownThreadIdRef = React.useRef(null);
	const [typingMessage, setTypingMessage] = React.useState("");
	const [isTypingAnimation, setIsTypingAnimation] = React.useState(false);
	const [showKeyboard, setShowKeyboard] = React.useState(true);
	// CRITICAL FIX: Enhanced keyboard transition state management
	const [keyboardTransition, setKeyboardTransition] = React.useState({
		isTransitioning: false,
		targetState: 'visible',
		transitionDuration: 300
	});
	const [isLayoutTransition, setIsLayoutTransition] = React.useState(false);
	const [messageVisibilityBackup, setMessageVisibilityBackup] = React.useState([]);
	const [currentResponseSegment, setCurrentResponseSegment] =
		React.useState(0);
	const [responseSegments, setResponseSegments] = React.useState([]);
	const [facialExpression, setFacialExpression] = React.useState("neutral");
	const [emotionalState, setEmotionalState] = React.useState("calm");
	const [showOldMessagesIndicator, setShowOldMessagesIndicator] =
		React.useState(false);
	// Blob management states
	const [activeBlobs, setActiveBlobs] = React.useState([]);
	const [blobAnalysis, setBlobAnalysis] = React.useState(null);
	const [hasEmotionalBlobs, setHasEmotionalBlobs] = React.useState(false);
	
	// CRITICAL FIX: Layout Coordinator Integration
	const coordinatorRef = React.useRef(null);

	// Default blob state (neutral state when no emotional blobs are active)
	const [defaultBlob] = React.useState({
		id: "default-neutral",
		type: "neutral",
		size: "medium",
		urgencyLevel: "none",
		isVisible: true,
		animationIntensity: 0.1,
		priority: 0,
		position: { x: 0, y: 0 }, // Will be positioned by OrbContainer
		activatedAt: Date.now(),
	});

	// Enhanced blob state that always includes at least the default blob
	const effectiveBlobs = React.useMemo(() => {
		const emotionalBlobs = activeBlobs.filter(
			(blob) => blob.type !== "neutral"
		);
		const hasEmotional = emotionalBlobs.length > 0;
		setHasEmotionalBlobs(hasEmotional);

		// Always return at least the default blob
		return hasEmotional ? emotionalBlobs : [defaultBlob];
	}, [activeBlobs, defaultBlob]);
	const messagesEndRef = React.useRef(null);
	const chatContainerRef = React.useRef(null);
	const typingIntervalRef = React.useRef(null);
	const thinkingTimeoutRef = React.useRef(null);

	// CRITICAL FIX: Enhanced Keyboard Hide with Layout Coordination
	const hideKeyboardSmooth = React.useCallback(async () => {
		// Request coordinated transition through layout coordinator
		const transitionAllowed = await coordinatorRef.current?.requestTransition({
			type: 'keyboard-hide',
			duration: 300,
			priority: 10,
			canInterrupt: false
		});

		if (!transitionAllowed) {
			console.warn('[ChatFlow07] Keyboard hide transition denied by coordinator');
			return;
		}

		setKeyboardTransition({
			isTransitioning: true,
			targetState: 'hidden',
			transitionDuration: 300
		});
		
		// Wait for CSS transition to complete
		setTimeout(() => {
			setShowKeyboard(false);
			setKeyboardTransition(prev => ({
				...prev,
				isTransitioning: false
			}));
			
			// Notify coordinator of completion
			coordinatorRef.current?.completeTransition();
		}, 300);
	}, []);

	// CRITICAL FIX: Enhanced Keyboard Show with Layout Coordination
	const showKeyboardSmooth = React.useCallback(async () => {
		// Request coordinated transition through layout coordinator
		const transitionAllowed = await coordinatorRef.current?.requestTransition({
			type: 'keyboard-show',
			duration: 300,
			priority: 10,
			canInterrupt: false
		});

		if (!transitionAllowed) {
			console.warn('[ChatFlow07] Keyboard show transition denied by coordinator');
			return;
		}

		setKeyboardTransition({
			isTransitioning: true,
			targetState: 'visible',
			transitionDuration: 300
		});
		
		setShowKeyboard(true);
		
		setTimeout(() => {
			setKeyboardTransition(prev => ({
				...prev,
				isTransitioning: false
			}));
			
			// Notify coordinator of completion
			coordinatorRef.current?.completeTransition();
		}, 300);
	}, []);

	// CRITICAL FIX: Protected scroll with transition awareness
	const protectedScrollIntoView = React.useCallback((element, options = {}) => {
		if (isLayoutTransition) {
			// Defer scroll until transition completes
			setTimeout(() => {
				element?.scrollIntoView({
					behavior: 'smooth',
					block: 'end',
					...options
				});
			}, keyboardTransition.transitionDuration + 100);
		} else {
			element?.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
				...options
			});
		}
	}, [isLayoutTransition, keyboardTransition.transitionDuration]);

	// Enhanced scroll function with better reliability
	const scrollToBottom = () => {
		if (messagesEndRef.current && chatContainerRef.current) {
			// Use both methods for better reliability
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
			protectedScrollIntoView(messagesEndRef.current, {
				behavior: "smooth",
				block: "end",
				inline: "nearest",
			});
		}
	};

	// CRITICAL FIX: EMERGENCY MESSAGE PROTECTION - Disable Layout Coordinator interference
	const updateMessagesWithBackup = React.useCallback(
		(threadId) => {
			console.log(`🔥 EMERGENCY UPDATE for thread ${threadId}`);
			
			try {
				const newMessages =
					conversationManager.getThreadMessages(threadId);

				// CRITICAL: Extra validation and protection
				if (!Array.isArray(newMessages)) {
					console.error("🚨 CRITICAL: Invalid messages received, using backup");
					if (messageBackupRef.current.length > 0) {
						console.log("🔄 EMERGENCY: Restoring from backup immediately");
						setMessages([...messageBackupRef.current]);
					}
					return;
				}

				// CRITICAL: Protect against thread mismatch
				if (threadId !== currentThreadId) {
					console.error(
						`🚨 CRITICAL: Thread ID mismatch: expected ${currentThreadId}, got ${threadId}`
					);
					return;
				}

				// CRITICAL: Validate message content exists
				if (newMessages.length === 0 && messages.length > 0) {
					console.error("🚨 CRITICAL: Messages disappeared! Preventing state loss");
					return; // Don't update to empty state if we had messages
				}

				// CRITICAL: Always backup before ANY update
				messageBackupRef.current = [...messages];
				lastKnownThreadIdRef.current = currentThreadId;

				// CRITICAL: Force immediate state update - bypass any coordinator interference
				console.log(`🔥 EMERGENCY UPDATE: ${messages.length} -> ${newMessages.length} messages`);
				setMessages([...newMessages]); // Force new array reference

				// CRITICAL: Immediate validation that update worked
				setTimeout(() => {
					const currentState = conversationManager.getThreadMessages(threadId);
					if (currentState.length !== newMessages.length) {
						console.error("🚨 CRITICAL: Message update verification failed!");
						console.log("🔄 EMERGENCY RECOVERY: Forcing state restoration");
						setMessages([...newMessages]); // Force again
					}
				}, 50);

			} catch (error) {
				console.error("🚨 CRITICAL ERROR in updateMessagesWithBackup:", error);
				// EMERGENCY RECOVERY: Restore from backup immediately
				if (messageBackupRef.current.length > 0) {
					console.log("🔄 EMERGENCY RECOVERY: Restoring from backup");
					setMessages([...messageBackupRef.current]);
				}
			}
		},
		[messages, currentThreadId]
	);

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

	// CRITICAL FIX: DISABLED Message Visibility Protection - PREVENTS MESSAGE LOSS
	React.useEffect(() => {
		// EMERGENCY DISABLE: This system was interfering with message persistence
		console.log("🔥 VISIBILITY PROTECTION DISABLED - Preventing message interference");
		
		// Keep transition state tracking but don't manipulate messages
		if (keyboardTransition.isTransitioning) {
			setIsLayoutTransition(true);
			
			const timer = setTimeout(() => {
				setIsLayoutTransition(false);
			}, keyboardTransition.transitionDuration + 50);
			
			return () => clearTimeout(timer);
		}
	}, [keyboardTransition.isTransitioning, keyboardTransition.transitionDuration]);

	// Enhanced auto-scroll with delay for better UX
	React.useEffect(() => {
		const scrollWithDelay = () => {
			setTimeout(() => {
				scrollToBottom();
			}, 50); // Small delay to ensure content is rendered
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
			// CRITICAL FIX: Register with Layout Coordinator
			coordinatorRef.current = layoutCoordinator.registerComponent(
				'chatflow07-keyboard',
				'keyboard',
				{
					priority: 10,
					canInterrupt: false,
					maxDuration: 300
				}
			);

			console.log('[ChatFlow07] Registered with Layout Coordinator');

			// Set language change callback
			chatService.setLanguageChangeCallback((language) => {
				setCurrentLanguage(language);
				console.log("🌍 Language changed to:", language);
			});

			// Start new conversation session
			conversationManager.startNewSession();

			// Set initial welcome message and create first thread
			const welcomeMessage = await chatService.startConversation();
			const initialMessage = {
				type: "ai",
				text: welcomeMessage,
				emotionalState: "supportive",
				facialExpression: "neutral",
				timestamp: Date.now(),
			};

			// Create initial thread with welcome message
			const thread = conversationManager.createThread(initialMessage, {
				topic: "welcome",
				emotionalTone: "supportive",
			});

			setCurrentThreadId(thread.id);
			updateMessagesWithBackup(thread.id);
		};

		initializeChat();

		// Cleanup: Unregister from Layout Coordinator
		return () => {
			if (coordinatorRef.current) {
				layoutCoordinator.unregisterComponent('chatflow07-keyboard');
				console.log('[ChatFlow07] Unregistered from Layout Coordinator');
			}
		};
	}, []);

	// Blob decay and update system
	React.useEffect(() => {
		const blobUpdateInterval = setInterval(() => {
			// Perform blob decay
			blobManager.performBlobDecay();

			// Update active blobs state
			const updatedBlobs = blobManager.getActiveBlobStates();
			setActiveBlobs(updatedBlobs);

			// Log occasional updates for debugging
			if (updatedBlobs.length > 0 && Math.random() < 0.1) {
				console.log(
					"🔄 Blob decay update:",
					updatedBlobs.length,
					"active blobs"
				);
			}
		}, 1000); // Update every second

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

			// Count questions in current sentence
			const isQuestion = sentence.includes("?");
			if (isQuestion) questionCount++;

			// If we already have 2 questions, start a new segment
			if (questionCount > 2 && currentSegment.length > 0) {
				segments.push(currentSegment.trim() + ".");
				currentSegment = sentence;
				questionCount = isQuestion ? 1 : 0;
			} else {
				if (currentSegment) currentSegment += ". ";
				currentSegment += sentence;
			}

			// Also split on very long segments (more than 150 characters)
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

			// Set facial expression based on user input and expected response
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

			// Vary thinking duration based on complexity and emotion
			let baseDuration = 1500;
			if (expression === "thoughtful") baseDuration = 2500; // Longer for thoughtful responses
			if (expression === "sad" || expression === "anxious")
				baseDuration = 2000; // Empathetic pause
			if (expression === "happy") baseDuration = 1000; // Quick positive response

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
					// Auto-scroll during typing with improved timing
					setTimeout(() => {
						scrollToBottom();
					}, 20);
					// Slower typing for more natural feel
					typingIntervalRef.current = setTimeout(
						typeChar,
						isSegment ? 40 : 35
					);
				} else {
					setIsTypingAnimation(false);
					// Final scroll to ensure visibility
					setTimeout(() => {
						scrollToBottom();
					}, 100);
					resolve();
				}
			};

			typeChar();
		});
	};

	// CRITICAL FIX: EMERGENCY Response Processing - BYPASS ALL COORDINATOR INTERFERENCE
	const processResponseWithPauses = async (
		fullResponse,
		userMessage = ""
	) => {
		console.log("🔥 EMERGENCY RESPONSE PROCESSING - NO COORDINATOR INTERFERENCE");
		
		// CRITICAL: Get current message state BEFORE processing
		const preResponseMessages = conversationManager.getThreadMessages(currentThreadId);
		console.log(`🔥 PRE-RESPONSE: ${preResponseMessages.length} messages in thread`);
		
		const segments = splitIntoSemanticSegments(fullResponse);
		setResponseSegments(segments);

		for (let i = 0; i < segments.length; i++) {
			setCurrentResponseSegment(i);

			// Enhanced thinking with facial expressions for each segment
			if (i > 0) {
				await simulateThinking(userMessage, segments[i]);
			}

			// Set expression for typing
			const segmentExpression = detectFacialExpression(
				segments[i],
				userMessage
			);
			setFacialExpression(segmentExpression);

			// Type the current segment with expression-based timing
			await typeMessage(segments[i], true);

			// CRITICAL: Add segment to conversation manager WITHOUT triggering updates yet
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

			console.log(`🔥 EMERGENCY: Adding AI segment ${i+1}/${segments.length}`);
			conversationManager.addMessageToThread(
				currentThreadId,
				segmentMessage
			);

			// CRITICAL: FORCE IMMEDIATE UPDATE WITHOUT BACKUP SYSTEM
			const currentMessages = conversationManager.getThreadMessages(currentThreadId);
			console.log(`🔥 EMERGENCY UPDATE: Segment ${i+1} - ${currentMessages.length} total messages`);
			setMessages([...currentMessages]); // Force immediate array update
			setTypingMessage("");

			// CRITICAL: Validate that messages weren't lost
			if (currentMessages.length < preResponseMessages.length) {
				console.error("🚨 CRITICAL: Messages lost during segment processing!");
				console.log("🔄 EMERGENCY RECOVERY: Rebuilding message state");
				
				// Emergency recovery - force rebuild
				const allMessages = conversationManager.getThreadMessages(currentThreadId);
				setMessages([...allMessages]);
			}

			// Dramatic pause between segments with varying duration
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

		// CRITICAL: Final validation and cleanup
		const finalMessages = conversationManager.getThreadMessages(currentThreadId);
		console.log(`🔥 FINAL VALIDATION: ${finalMessages.length} messages after processing`);
		
		if (finalMessages.length === 0) {
			console.error("🚨 CRITICAL: ALL MESSAGES LOST! Emergency recovery needed");
			// Try to recover from backup
			if (messageBackupRef.current.length > 0) {
				console.log("🔄 EMERGENCY: Attempting backup recovery");
				setMessages([...messageBackupRef.current]);
			}
		} else {
			// Force final update to ensure UI reflects all messages
			setMessages([...finalMessages]);
		}

		// Clear segments and reset to neutral expression
		setResponseSegments([]);
		setCurrentResponseSegment(0);
		setFacialExpression("neutral");
		setEmotionalState("supportive");
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
			console.log("🔥 EMERGENCY SEND - BYPASSING LAYOUT COORDINATOR");
			const userMessage = inputText.trim();

			// CRITICAL: Store message state BEFORE any async operations
			const preMessageState = [...messages];
			messageBackupRef.current = preMessageState;

			// Process message with blob manager and get emotional analysis
			const blobUpdate = blobManager.processChatInput(
				userMessage,
				"user"
			);
			setActiveBlobs(blobUpdate.activeBlobs);
			setBlobAnalysis(blobUpdate.analysis);

			// Add user message to conversation manager - IMMEDIATE, NO DELAYS
			const userMessageObj = {
				type: "user",
				text: userMessage,
				emotionalState: "neutral",
				facialExpression: "neutral",
				timestamp: Date.now(),
			};

			console.log("🔥 EMERGENCY: Adding user message to thread");
			const addedUserMessage = conversationManager.addMessageToThread(
				currentThreadId,
				userMessageObj,
				blobUpdate.analysis
			);

			// CRITICAL: Validate message was added
			if (!addedUserMessage) {
				console.error("🚨 CRITICAL: Failed to add user message to thread.");
				return;
			}

			console.log("📝 EMERGENCY: User message added:", addedUserMessage);

			// CRITICAL: FORCE IMMEDIATE UI UPDATE - NO COORDINATOR INTERFERENCE
			const newMessages = conversationManager.getThreadMessages(currentThreadId);
			console.log(`🔥 FORCE UPDATE: ${messages.length} -> ${newMessages.length} messages`);
			setMessages([...newMessages]); // Force immediate update

			// CRITICAL: Clear input IMMEDIATELY to show user interaction worked
			setInputText("");
			setIsLoading(true);

			// CRITICAL: SKIP KEYBOARD ANIMATION DURING MESSAGE SEND
			console.log("🔥 EMERGENCY: Skipping keyboard animation to prevent message loss");
			setShowKeyboard(false); // Immediate hide, no animation

			// Get AI response
			try {
				const responseData = await chatService.sendMessage(userMessage);
				setIsLoading(false);

				// Update mood and patterns if available
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

				// Process AI response with blob manager too
				const aiBlobUpdate = blobManager.processChatInput(
					response,
					"ai"
				);
				setActiveBlobs(aiBlobUpdate.activeBlobs);

				// Initial thinking time with expression analysis
				await simulateThinking(userMessage, response);

				// Process response with enhanced semantic pauses and facial expressions
				await processResponseWithPauses(response, userMessage);

				// CRITICAL: Show keyboard back immediately after response
				console.log("🔥 EMERGENCY: Showing keyboard immediately after response");
				setShowKeyboard(true); // Immediate show, no animation
			} catch (error) {
				setIsLoading(false);

				// Get multilingual error message
				const errorMessages = {
					de: "Es tut mir leid, ich habe gerade Verbindungsprobleme. Bitte versuche es erneut.",
					en: "I'm sorry, I'm having trouble connecting right now. Please try again.",
					fr: "Je suis désolé, j'ai des problèmes de connexion. Veuillez réessayer.",
					es: "Lo siento, tengo problemas de conexión ahora. Por favor, inténtalo de nuevo.",
					it: "Mi dispiace, ho problemi di connessione ora. Per favore riprova.",
				};

				const errorMsg =
					errorMessages[currentLanguage] || errorMessages.en;

				// Show thinking before error message too
				await simulateThinking();
				await typeMessage(errorMsg);

				// Add error message to conversation manager
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

				// CRITICAL: FORCE IMMEDIATE UPDATE
				const errorMessages_new = conversationManager.getThreadMessages(currentThreadId);
				setMessages([...errorMessages_new]);
				setTypingMessage("");
				
				// Show keyboard back
				setShowKeyboard(true);
			}
		}
	};

	const handleInputChange = (e) => {
		setInputText(e.target.value);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendClick();
		}
	};

	return (
		<div
			className={`chat-flow-07 ${
				!showKeyboard ? "keyboard-hidden" : ""
			} ${
				keyboardTransition.isTransitioning ? "keyboard-transitioning" : ""
			} ${
				keyboardTransition.targetState === 'hidden' && keyboardTransition.isTransitioning ? "keyboard-transitioning-out" : ""
			} ${
				keyboardTransition.targetState === 'visible' && keyboardTransition.isTransitioning ? "keyboard-transitioning-in" : ""
			} ${
				isLayoutTransition ? "layout-transition" : ""
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
			{/* Chat Messages Area with Enhanced Scroll and Old Messages Indicator */}
			<div className="chat-messages-container" ref={chatContainerRef}>
				{/* Old Messages Indicator at the top */}
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
			</div>{" "}
			<div className="frame-1">
				<div className="ellipse-52"></div>
				<div className="ellipse-62"></div>
				<div className="ellipse-72"></div>
			</div>
			{/* Orb Container - Seamlessly switches between standard orb and emotional blobs */}
			<OrbContainer
				activeBlobs={effectiveBlobs}
				property1="variant-4"
				className="orbs-v-3-instance"
			/>
			{/* Enhanced Debug Panel für Blob Status und Conversation Analytics */}
			{process.env.NODE_ENV === "development" && (
				<div
					style={{
						position: "fixed",
						top: "120px",
						right: "20px",
						background: "rgba(0, 0, 0, 0.9)",
						color: "white",
						padding: "12px",
						borderRadius: "8px",
						fontSize: "11px",
						maxWidth: "250px",
						maxHeight: "400px",
						overflowY: "auto",
						zIndex: 1000,
						fontFamily: "monospace",
						border: "1px solid rgba(255, 255, 255, 0.2)",
					}}
				>
					<div
						style={{
							borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
							paddingBottom: "8px",
							marginBottom: "8px",
						}}
					>
						<strong>💬 Conversation Analytics</strong>
					</div>

					<div style={{ marginBottom: "8px" }}>
						<div>
							Thread ID:{" "}
							{currentThreadId
								? currentThreadId.substr(-8)
								: "None"}
						</div>
						<div>Messages: {messages.length}</div>
						<div>
							Session:{" "}
							{conversationManager
								.getCurrentSession()
								?.id?.substr(-8) || "None"}
						</div>
					</div>

					{blobAnalysis && (
						<div
							style={{
								borderTop: "1px solid rgba(255, 255, 255, 0.2)",
								paddingTop: "8px",
							}}
						>
							<div>
								<strong>🎯 Emotional Analysis:</strong>
							</div>
							<div>Urgency: {blobAnalysis.urgencyLevel}</div>
							<div>Emotion: {blobAnalysis.emotionType}</div>
							<div>
								Confidence:{" "}
								{(blobAnalysis.confidence * 100).toFixed(1)}%
							</div>
							<div>Active Blobs: {effectiveBlobs.length}</div>
							<div>
								Has Emotional:{" "}
								{hasEmotionalBlobs ? "Yes" : "No"}
							</div>
							{blobAnalysis.detectedKeywords.length > 0 && (
								<div>
									Keywords:{" "}
									{blobAnalysis.detectedKeywords
										.slice(0, 3)
										.join(", ")}
								</div>
							)}
						</div>
					)}

					<div
						style={{
							borderTop: "1px solid rgba(255, 255, 255, 0.2)",
							paddingTop: "8px",
							marginTop: "8px",
						}}
					>
						<div>
							<strong>📊 System Status:</strong>
						</div>
						<div>Expression: {facialExpression}</div>
						<div>Emotional State: {emotionalState}</div>
						<div>Language: {currentLanguage}</div>
						<div>Thinking: {isThinking ? "Yes" : "No"}</div>
						<div>Typing: {isTypingAnimation ? "Yes" : "No"}</div>
					</div>
				</div>
			)}
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
