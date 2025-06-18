/**
 * ChatFlow07Enhanced - Phase 3: Text-reaktive Integration
 * Ersetzt das OrbContainer/Blob-System durch UniversalOrbAnimation
 */

import React from "react";
import "./ChatFlow07.css";
import { KeyboardIPhoneTypeDefault } from "./KeyboardIPhoneTypeDefault";
import UniversalOrbAnimation from "./UniversalOrbAnimation";
import SimpleMessageBubble from "./SimpleMessageBubble";
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
	
	// Neue States für intelligentere Emotionserkennung
	const [persistentEmotionalState, setPersistentEmotionalState] = React.useState("neutral");
	const [emotionalHistory, setEmotionalHistory] = React.useState([]);
	const [isTransitioning, setIsTransitioning] = React.useState(false);
	const [lastEmotionChange, setLastEmotionChange] = React.useState(Date.now());

	// Legacy: Blob-Analyse für Vergleich/Debug (Optional)
	const [activeBlobs, setActiveBlobs] = React.useState([]);
	const [blobAnalysis, setBlobAnalysis] = React.useState(null);

	// Basis-Größe für den Enhanced Orb (noch kleiner für bessere Integration ohne Überlappung)
	const baseSize = 100; // Reduziert von 139px auf 100px für weniger Überlappung

	const messagesEndRef = React.useRef(null);
	const chatContainerRef = React.useRef(null);
	const typingIntervalRef = React.useRef(null);
	const thinkingTimeoutRef = React.useRef(null);

	/**
	 * Intelligente Kontext-basierte emotionale Analyse für UniversalOrbAnimation
	 */
	const analyzeTextForOrb = React.useCallback(
		(text, isUserMessage = false) => {
			if (!text || text.trim().length === 0) return;

			// Normalisierung für bessere Analyse
			const normalizedText = text.toLowerCase().trim();

			// DIREKTE EMOTIONSERKENNUNG (Priorität für häufige Ausdrücke)
			const directEmotionTests = {
				sadness: /\b(i'?m sad|i feel sad|feeling sad|so sad|very sad|im sad)\b/gi,
				happiness: /\b(i'?m happy|i feel happy|feeling happy|so happy|very happy|im happy)\b/gi,
				anger: /\b(i'?m angry|i feel angry|feeling angry|so angry|very angry|im angry)\b/gi,
				anxiety: /\b(i'?m anxious|i feel anxious|feeling anxious|so anxious|very anxious|im anxious)\b/gi
			};

			// Test für direkte Emotionserkennung
			if (directEmotionTests.sadness.test(normalizedText)) {
				console.log("🎯 DIREKTE ERKENNUNG: Traurigkeit erkannt für:", text);
				console.log("🔄 Setze Orb-Zustand auf 'trauer' mit blauen Farben");
				
				// Sofort den Orb-Zustand aktualisieren
				setOrbEmotionalState("trauer");
				setPersistentEmotionalState("trauer");
				setOrbUrgencyLevel(0.8);
				setOrbIntensity(1.5);
				setOrbSentimentScore(-0.8);
				setCurrentTextForAnalysis(text);
				
				// Zusätzlich die sanfte Transition
				smoothTransitionToState("trauer", 0.8, 1.5, -0.8);
				
				return {
					emotionalState: "trauer",
					urgencyLevel: 0.8,
					intensity: 1.5,
					sentimentScore: -0.8,
				};
			}

			if (directEmotionTests.happiness.test(normalizedText)) {
				console.log("🎯 DIREKTE ERKENNUNG: Freude erkannt für:", text);
				console.log("🔄 Setze Orb-Zustand auf 'freude' mit gelben/grünen Farben");
				
				setOrbEmotionalState("freude");
				setPersistentEmotionalState("freude");
				setOrbUrgencyLevel(0.5);
				setOrbIntensity(1.5);
				setOrbSentimentScore(0.8);
				setCurrentTextForAnalysis(text);
				
				smoothTransitionToState("freude", 0.5, 1.5, 0.8);
				return {
					emotionalState: "freude",
					urgencyLevel: 0.5,
					intensity: 1.5,
					sentimentScore: 0.8,
				};
			}

			if (directEmotionTests.anger.test(normalizedText)) {
				console.log("🎯 DIREKTE ERKENNUNG: Wut/Ärger erkannt für:", text);
				console.log("🔄 Setze Orb-Zustand auf 'wut' mit roten Farben");
				
				setOrbEmotionalState("wut");
				setPersistentEmotionalState("wut");
				setOrbUrgencyLevel(0.9);
				setOrbIntensity(1.6);
				setOrbSentimentScore(-0.7);
				setCurrentTextForAnalysis(text);
				
				smoothTransitionToState("wut", 0.9, 1.6, -0.7);
				return {
					emotionalState: "wut",
					urgencyLevel: 0.9,
					intensity: 1.6,
					sentimentScore: -0.7,
				};
			}

			if (directEmotionTests.anxiety.test(normalizedText)) {
				console.log("🎯 DIREKTE ERKENNUNG: Angst erkannt für:", text);
				console.log("🔄 Setze Orb-Zustand auf 'neutral' (Angst nicht im Farbsystem)");
				
				// Angst wird als neutral dargestellt, da es nicht im Steiner Farbsystem ist
				setOrbEmotionalState("neutral");
				setPersistentEmotionalState("neutral");
				setOrbUrgencyLevel(0.7);
				setOrbIntensity(1.4);
				setOrbSentimentScore(-0.6);
				setCurrentTextForAnalysis(text);
				
				smoothTransitionToState("neutral", 0.7, 1.4, -0.6);
				return {
					emotionalState: "neutral",
					urgencyLevel: 0.7,
					intensity: 1.4,
					sentimentScore: -0.6,
				};
			}

			// Negations-Muster für Kontext-Erkennung (mehrsprachig)
			const negationPatterns = new RegExp([
				// Deutsch
				'\\b(nicht|kein|keine|keiner|niemals|nie|ohne|wenig)\\s+',
				// Englisch
				'\\b(not|no|never|without|barely|hardly)\\s+',
				// Französisch
				'\\b(ne|pas|non|jamais|sans|peu)\\s+',
				// Spanisch
				'\\b(no|nunca|sin|poco|nada)\\s+',
				// Italienisch
				'\\b(non|no|mai|senza|poco)\\s+'
			].join('|'), 'gi');

			// Mehrsprachige Sentiment-Analyse mit Kontext
			const positiveWords = new RegExp([
				// Englisch
				'\\b(happy|joy|excited|great|wonderful|amazing|love|fantastic|brilliant|thrilled|good|better|best|awesome|excellent|perfect|beautiful|incredible|outstanding|superb|magnificent|delighted|ecstatic|blissful|cheerful|optimistic|grateful|blessed)\\b',
				// Deutsch
				'\\b(glücklich|freude|freudig|aufgeregt|großartig|wunderbar|erstaunlich|liebe|fantastisch|brillant|begeistert|gut|besser|beste|toll|exzellent|perfekt|schön|herrlich|optimistisch|dankbar|gesegnet)\\b',
				// Französisch
				'\\b(heureux|joie|joyeux|excité|formidable|merveilleux|incroyable|amour|fantastique|brillant|ravi|bon|meilleur|meilleure|génial|excellent|parfait|beau|magnifique|optimiste|reconnaissant|béni)\\b',
				// Spanisch
				'\\b(feliz|alegría|alegre|emocionado|genial|maravilloso|increíble|amor|fantástico|brillante|encantado|bueno|mejor|excelente|perfecto|hermoso|magnífico|optimista|agradecido|bendecido)\\b',
				// Italienisch
				'\\b(felice|gioia|gioioso|emozionato|fantastico|meraviglioso|incredibile|amore|brillante|entusiasta|buono|migliore|eccellente|perfetto|bello|magnifico|ottimista|grato|benedetto)\\b'
			].join('|'), 'gi');

			const negativeWords = new RegExp([
				// Englisch
				'\\b(sad|depressed|down|low|unhappy|miserable|terrible|awful|horrible|bad|worse|worst|hate|angry|frustrated|devastated|heartbroken|disappointed|discouraged|hopeless|despair|anguish|torment|agony|suffering|pain|hurt)\\b',
				// Deutsch
				'\\b(traurig|deprimiert|niedergeschlagen|niedrig|unglücklich|elend|schrecklich|furchtbar|schlecht|schlechter|schlechteste|hass|wütend|frustriert|zerstört|gebrochenes herz|enttäuscht|entmutigt|hoffnungslos|verzweiflung|qual|pein|agonie|leiden|schmerz|verletzt)\\b',
				// Französisch
				'\\b(triste|déprimé|abattu|bas|malheureux|misérable|terrible|affreux|horrible|mauvais|pire|haine|en colère|frustré|dévasté|cœur brisé|déçu|découragé|désespéré|désespoir|angoisse|tourment|agonie|souffrance|douleur|blessé)\\b',
				// Spanisch
				'\\b(triste|deprimido|decaído|bajo|infeliz|miserable|terrible|horrible|malo|peor|odio|enojado|frustrado|devastado|corazón roto|decepcionado|desanimado|desesperanzado|desesperación|angustia|tormento|agonía|sufrimiento|dolor|herido)\\b',
				// Italienisch
				'\\b(triste|depresso|giù|basso|infelice|miserabile|terribile|orribile|cattivo|peggio|peggiore|odio|arrabbiato|frustrato|devastato|cuore spezzato|deluso|scoraggiato|senza speranza|disperazione|angoscia|tormento|agonia|sofferenza|dolore|ferito)\\b'
			].join('|'), 'gi');

			// Kontext-bewusste Analyse mit Sicherheitsüberprüfungen
			let positiveMatches = [];
			let negativeMatches = [];
			
			try {
				positiveMatches = normalizedText.match(positiveWords) || [];
				negativeMatches = normalizedText.match(negativeWords) || [];
			} catch (error) {
				console.warn("🚨 Error in emotion analysis:", error);
				return; // Sichere Rückkehr bei Fehlern
			}

			// Negations-Erkennung: Umkehr der Polarität
			const negatedSegments = normalizedText.split(negationPatterns);
			for (let i = 1; i < negatedSegments.length; i += 2) {
				const negatedSegment = negatedSegments[i];
				if (!negatedSegment) continue; // Sicherheitscheck
				
				const posInNegated = negatedSegment.match(positiveWords) || [];
				const negInNegated = negatedSegment.match(negativeWords) || [];
				
				// Polarität umkehren - nur wenn Matches gefunden wurden
				if (posInNegated.length > 0) {
					positiveMatches = positiveMatches.filter(match => !posInNegated.includes(match));
					negativeMatches = negativeMatches.concat(posInNegated);
				}
				if (negInNegated.length > 0) {
					negativeMatches = negativeMatches.filter(match => !negInNegated.includes(match));
					positiveMatches = positiveMatches.concat(negInNegated);
				}
			}

			// Kontext-Phrasen für bessere Erkennung
			const contextualAnalysis = analyzeContextualPhrases(normalizedText);
			
			// Sentiment Score mit Kontext berechnen
			const totalWords = normalizedText.split(/\s+/).length;
			const contextWeight = contextualAnalysis.confidence;
			const rawSentiment = (positiveMatches.length - negativeMatches.length) / Math.max(totalWords, 1);
			const contextualSentiment = contextualAnalysis.sentiment;
			
			const finalSentiment = (rawSentiment * (1 - contextWeight)) + (contextualSentiment * contextWeight);
			const normalizedSentiment = Math.max(-1, Math.min(1, finalSentiment * 2));

			// Emotionaler Zustand bestimmen
			let newEmotionalState = persistentEmotionalState; // Erhalte vorherigen Zustand
			let newUrgencyLevel = orbUrgencyLevel * 0.8; // Sanfte Reduzierung
			let newIntensity = orbIntensity * 0.9; // Sanfte Reduzierung

			// Nur bei starken emotionalen Signalen Zustand ändern
			if (Math.abs(normalizedSentiment) > 0.3) {
				if (normalizedSentiment < -0.6) {
					newEmotionalState = "trauer";
					newUrgencyLevel = 0.7;
					newIntensity = 1.4;
				} else if (normalizedSentiment < -0.3) {
					newEmotionalState = "wut";
					newUrgencyLevel = 0.6;
					newIntensity = 1.3;
				} else if (normalizedSentiment > 0.6) {
					newEmotionalState = "freude";
					newUrgencyLevel = 0.5;
					newIntensity = 1.5;
				} else if (normalizedSentiment > 0.3) {
					newEmotionalState = "freude";
					newUrgencyLevel = 0.4;
					newIntensity = 1.3;
				}
			}

			// Sanfte Transition implementieren
			smoothTransitionToState(newEmotionalState, newUrgencyLevel, newIntensity, normalizedSentiment);

			// Emotionale Historie aktualisieren
			setEmotionalHistory(prev => [...prev.slice(-4), {
				text: text.substring(0, 30),
				emotion: newEmotionalState,
				sentiment: normalizedSentiment,
				timestamp: Date.now()
			}]);

			console.log("🧠 Intelligente Emotion Analysis:", {
				text: text.substring(0, 50) + "...",
				contextualAnalysis,
				rawSentiment,
				finalSentiment: normalizedSentiment,
				emotionalState: newEmotionalState,
				isUserMessage,
			});

			return {
				emotionalState: newEmotionalState,
				urgencyLevel: newUrgencyLevel,
				intensity: newIntensity,
				sentimentScore: normalizedSentiment,
			};
		},
		[persistentEmotionalState, orbUrgencyLevel, orbIntensity]
	);

	/**
	 * Analysiert kontextuelle Phrasen für bessere Emotionserkennung
	 */
	const analyzeContextualPhrases = (text) => {
		const contextPhrases = {
			negative: {
				de: /\b(mir geht es nicht|fühle mich nicht|bin nicht|es läuft nicht|nichts ist|kein guter|keine gute)\b/gi,
				en: /\b(i don't feel|i'm not|it's not going|nothing is|not good|not well)\b/gi,
				fr: /\b(je ne me sens pas|je ne suis pas|ça ne va pas|rien n'est|pas bon|pas bien)\b/gi,
				es: /\b(no me siento|no estoy|no va|nada es|no bueno|no bien)\b/gi,
				it: /\b(non mi sento|non sto|non va|niente è|non buono|non bene)\b/gi
			},
			positive: {
				de: /\b(mir geht es|fühle mich|bin sehr|es läuft|alles ist|sehr gut|sehr schön)\b/gi,
				en: /\b(i feel|i'm really|it's going|everything is|very good|very well)\b/gi,
				fr: /\b(je me sens|je suis|ça va|tout est|très bon|très bien)\b/gi,
				es: /\b(me siento|estoy|va|todo es|muy bueno|muy bien)\b/gi,
				it: /\b(mi sento|sto|va|tutto è|molto buono|molto bene)\b/gi
			}
		};

		let negativeContextCount = 0;
		let positiveContextCount = 0;

		Object.values(contextPhrases.negative).forEach(pattern => {
			negativeContextCount += (text.match(pattern) || []).length;
		});

		Object.values(contextPhrases.positive).forEach(pattern => {
			positiveContextCount += (text.match(pattern) || []).length;
		});

		const totalContext = negativeContextCount + positiveContextCount;
		const confidence = Math.min(totalContext * 0.3, 0.8);
		const sentiment = totalContext > 0 ?
			(positiveContextCount - negativeContextCount) / totalContext : 0;

		return { sentiment, confidence };
	};

	/**
	 * Sanfte Transition zwischen emotionalen Zuständen mit Persistenz-Check
	 */
	const smoothTransitionToState = React.useCallback((targetState, targetUrgency, targetIntensity, targetSentiment) => {
		if (isTransitioning) return;

		const now = Date.now();
		const timeSinceLastChange = now - lastEmotionChange;
		const EMOTION_MIN_DURATION = 5000; // 5 Sekunden Mindestdauer
		
		// Verhindere zu schnelle Zustandswechsel, außer bei starken Emotionen
		if (timeSinceLastChange < EMOTION_MIN_DURATION &&
			targetState !== 'neutral' &&
			persistentEmotionalState !== 'neutral' &&
			Math.abs(targetSentiment) < 0.7) {
			console.log("🚫 Emotionswechsel zu schnell, wird übersprungen:", targetState);
			return;
		}

		console.log("🎭 Emotionsübergang:", {
			from: persistentEmotionalState,
			to: targetState,
			timeSinceLastChange,
			targetSentiment
		});

		setLastEmotionChange(now);
		setIsTransitioning(true);
		
		// Längere Animation für emotionale Übergänge (3 Sekunden für bessere Sichtbarkeit)
		const transitionDuration = 3000;
		const steps = 30;
		const stepDuration = transitionDuration / steps;
		
		const startUrgency = orbUrgencyLevel;
		const startIntensity = orbIntensity;
		const startSentiment = orbSentimentScore;
		
		let currentStep = 0;
		
		const transitionInterval = setInterval(() => {
			currentStep++;
			const progress = currentStep / steps;
			const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
			
			const newUrgency = startUrgency + (targetUrgency - startUrgency) * easeProgress;
			const newIntensity = startIntensity + (targetIntensity - startIntensity) * easeProgress;
			const newSentiment = startSentiment + (targetSentiment - startSentiment) * easeProgress;
			
			setOrbUrgencyLevel(newUrgency);
			setOrbIntensity(newIntensity);
			setOrbSentimentScore(newSentiment);
			
			if (currentStep >= steps) {
				clearInterval(transitionInterval);
				setOrbEmotionalState(targetState);
				setPersistentEmotionalState(targetState);
				setCurrentTextForAnalysis("");
				setIsTransitioning(false);
				
				console.log("✅ Emotionsübergang abgeschlossen:", {
					state: targetState,
					urgency: newUrgency,
					intensity: newIntensity,
					sentiment: newSentiment
				});
			}
		}, stepDuration);
	}, [isTransitioning, orbUrgencyLevel, orbIntensity, orbSentimentScore, lastEmotionChange, persistentEmotionalState]);

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

	// Enhanced facial expression detection and emotional state management with multilingual support
	const detectFacialExpression = (text, userMessage = "") => {
		const sadWords = new RegExp([
			// Englisch
			'\\b(sad|depressed|down|low|unhappy|miserable|grief|sorrow|despair|heartbreak|devastated)\\b',
			// Deutsch
			'\\b(traurig|deprimiert|niedergeschlagen|unglücklich|elend|kummer|sorge|verzweiflung|herzschmerz|zerstört)\\b',
			// Französisch
			'\\b(triste|déprimé|abattu|malheureux|misérable|chagrin|tristesse|désespoir|cœur brisé|dévasté)\\b',
			// Spanisch
			'\\b(triste|deprimido|decaído|infeliz|miserable|pena|tristeza|desesperación|corazón roto|devastado)\\b',
			// Italienisch
			'\\b(triste|depresso|giù|infelice|miserabile|dolore|tristezza|disperazione|cuore spezzato|devastato)\\b'
		].join('|'), 'i');

		const happyWords = new RegExp([
			// Englisch
			'\\b(happy|joy|excited|great|wonderful|amazing|fantastic|love|excellent|brilliant|thrilled)\\b',
			// Deutsch
			'\\b(glücklich|freude|aufgeregt|großartig|wunderbar|erstaunlich|fantastisch|liebe|exzellent|brillant|begeistert)\\b',
			// Französisch
			'\\b(heureux|joie|excité|formidable|merveilleux|incroyable|fantastique|amour|excellent|brillant|ravi)\\b',
			// Spanisch
			'\\b(feliz|alegría|emocionado|genial|maravilloso|increíble|fantástico|amor|excelente|brillante|encantado)\\b',
			// Italienisch
			'\\b(felice|gioia|emozionato|fantastico|meraviglioso|incredibile|fantastico|amore|eccellente|brillante|entusiasta)\\b'
		].join('|'), 'i');

		const anxiousWords = new RegExp([
			// Englisch
			'\\b(anxious|worry|worried|stress|nervous|panic|fear|scared|overwhelmed|tension)\\b',
			// Deutsch
			'\\b(ängstlich|sorge|besorgt|stress|nervös|panik|furcht|verängstigt|überwältigt|spannung)\\b',
			// Französisch
			'\\b(anxieux|inquiétude|inquiet|stress|nerveux|panique|peur|effrayé|submergé|tension)\\b',
			// Spanisch
			'\\b(ansioso|preocupación|preocupado|estrés|nervioso|pánico|miedo|asustado|abrumado|tensión)\\b',
			// Italienisch
			'\\b(ansioso|preoccupazione|preoccupato|stress|nervoso|panico|paura|spaventato|sopraffatto|tensione)\\b'
		].join('|'), 'i');

		const angryWords = new RegExp([
			// Englisch
			'\\b(angry|mad|furious|annoyed|frustrated|irritated|rage|upset|pissed)\\b',
			// Deutsch
			'\\b(wütend|verrückt|wütend|genervt|frustriert|gereizt|wut|aufgebracht|sauer)\\b',
			// Französisch
			'\\b(en colère|fou|furieux|agacé|frustré|irrité|rage|contrarié|énervé)\\b',
			// Spanisch
			'\\b(enojado|loco|furioso|molesto|frustrado|irritado|rabia|disgustado|cabreado)\\b',
			// Italienisch
			'\\b(arrabbiato|pazzo|furioso|infastidito|frustrato|irritato|rabbia|sconvolto|incazzato)\\b'
		].join('|'), 'i');

		const surprisedWords = new RegExp([
			// Englisch
			'\\b(surprised|shocked|amazed|wow|incredible|unbelievable|astonishing)\\b',
			// Deutsch
			'\\b(überrascht|schockiert|erstaunt|wow|unglaublich|unglaublich|erstaunlich)\\b',
			// Französisch
			'\\b(surpris|choqué|étonné|wow|incroyable|incroyable|étonnant)\\b',
			// Spanisch
			'\\b(sorprendido|conmocionado|asombrado|wow|increíble|increíble|asombroso)\\b',
			// Italienisch
			'\\b(sorpreso|scioccato|stupito|wow|incredibile|incredibile|sorprendente)\\b'
		].join('|'), 'i');

		const thoughtfulWords = new RegExp([
			// Englisch
			'\\b(think|consider|wonder|contemplate|reflect|ponder|question|curious)\\b',
			// Deutsch
			'\\b(denken|überlegen|fragen|nachdenken|reflektieren|grübeln|frage|neugierig)\\b',
			// Französisch
			'\\b(penser|considérer|se demander|contempler|réfléchir|méditer|question|curieux)\\b',
			// Spanisch
			'\\b(pensar|considerar|preguntarse|contemplar|reflexionar|meditar|pregunta|curioso)\\b',
			// Italienisch
			'\\b(pensare|considerare|chiedersi|contemplare|riflettere|meditare|domanda|curioso)\\b'
		].join('|'), 'i');

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

		// Orb-Zustand bleibt persistent - kein automatischer Reset mehr
		// Die emotionalen Farben bleiben erhalten bis eine neue starke Emotion erkannt wird
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
		if (newValue.trim().length > 2) {
			// Analyse ab 3 Zeichen für frühere Erkennung von "I'm sad"
			const result = analyzeTextForOrb(newValue.trim(), true);
			if (result) {
				console.log("🎯 Live-Analyse Ergebnis:", result);
			}
		}
		// Emotionaler Zustand bleibt persistent - kein automatischer Reset
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
					<SimpleMessageBubble
						key={message.id || index}
						message={message}
						type={message.type}
						showTimestamp={
							index === messages.length - 1 || index % 5 === 0
						}
					/>
				))}

				{(isLoading || isThinking) && (
					<div className="simple-message-container ai-message">
						<div className="simple-message-bubble">
							{isThinking ? (
								<div className="thinking-indicator">
									<div className="thinking-text">
										{currentLanguage === "de"
											? "Denke nach..."
											: currentLanguage === "fr"
											? "Je réfléchis..."
											: currentLanguage === "es"
											? "Pensando..."
											: currentLanguage === "it"
											? "Sto pensando..."
											: "Thinking..."}
									</div>
									<div className="thinking-dots">
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
					<div className="simple-message-container ai-message">
						<div className="simple-message-bubble">
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
