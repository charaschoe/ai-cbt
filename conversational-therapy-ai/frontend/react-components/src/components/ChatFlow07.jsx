import React from "react";
import "./ChatFlow07.css";
import { OrbsV3Property1Variant4 } from "./OrbsV3Property1Variant4";
import { KeyboardIPhoneTypeDefault } from "./KeyboardIPhoneTypeDefault";
import chatService from "../services/chatService";

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
const [messages, setMessages] = React.useState([
{ type: "ai", text: "Tell me, what's on your mind?" },
]);
const [typingMessage, setTypingMessage] = React.useState("");
const [isTypingAnimation, setIsTypingAnimation] = React.useState(false);
const [showKeyboard, setShowKeyboard] = React.useState(true);
const [currentResponseSegment, setCurrentResponseSegment] = React.useState(0);
const [responseSegments, setResponseSegments] = React.useState([]);
const [facialExpression, setFacialExpression] = React.useState("neutral");
const [emotionalState, setEmotionalState] = React.useState("calm");
const [showOldMessagesIndicator, setShowOldMessagesIndicator] = React.useState(false);
const messagesEndRef = React.useRef(null);
const chatContainerRef = React.useRef(null);
const typingIntervalRef = React.useRef(null);
const thinkingTimeoutRef = React.useRef(null);

// Enhanced scroll function with better reliability
const scrollToBottom = () => {
if (messagesEndRef.current && chatContainerRef.current) {
  // Use both methods for better reliability
  chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  messagesEndRef.current.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest"
  });
}
};

// Enhanced scroll with old messages detection
const handleScroll = () => {
if (chatContainerRef.current) {
  const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
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
  }, 50); // Small delay to ensure content is rendered
};
scrollWithDelay();
}, [messages, typingMessage]);

React.useEffect(() => {
const container = chatContainerRef.current;
if (container) {
  container.addEventListener('scroll', handleScroll, { passive: true });
  return () => container.removeEventListener('scroll', handleScroll);
}
}, [messages]);

// Initialize chat service language callback
React.useEffect(() => {
const initializeChat = async () => {
  // Set language change callback
  chatService.setLanguageChangeCallback((language) => {
    setCurrentLanguage(language);
    console.log('🌍 Language changed to:', language);
  });
  
  // Set initial welcome message based on current language
  const welcomeMessage = await chatService.startConversation();
  setMessages([{ type: "ai", text: welcomeMessage }]);
};

initializeChat();
}, []);

// Helper function to split response into semantic segments
const splitIntoSemanticSegments = (text) => {
const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
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
const sadWords = /\b(sad|depressed|down|low|unhappy|miserable|grief|sorrow|despair|heartbreak|devastated)\b/i;
const happyWords = /\b(happy|joy|excited|great|wonderful|amazing|fantastic|love|excellent|brilliant|thrilled)\b/i;
const anxiousWords = /\b(anxious|worry|worried|stress|nervous|panic|fear|scared|overwhelmed|tension)\b/i;
const angryWords = /\b(angry|mad|furious|annoyed|frustrated|irritated|rage|upset|pissed)\b/i;
const surprisedWords = /\b(surprised|shocked|amazed|wow|incredible|unbelievable|astonishing)\b/i;
const thoughtfulWords = /\b(think|consider|wonder|contemplate|reflect|ponder|question|curious)\b/i;

if (sadWords.test(text) || sadWords.test(userMessage)) return "sad";
if (happyWords.test(text) || happyWords.test(userMessage)) return "happy";
if (anxiousWords.test(text) || anxiousWords.test(userMessage)) return "anxious";
if (angryWords.test(text) || angryWords.test(userMessage)) return "angry";
if (surprisedWords.test(text) || surprisedWords.test(userMessage)) return "surprised";
if (thoughtfulWords.test(text) || thoughtfulWords.test(userMessage)) return "thoughtful";

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
const expression = detectFacialExpression(expectedResponse, userMessage);
const emotional = detectEmotionalState(expectedResponse, expression);
setFacialExpression(expression);
setEmotionalState(emotional);

// Vary thinking duration based on complexity and emotion
let baseDuration = 1500;
if (expression === "thoughtful") baseDuration = 2500; // Longer for thoughtful responses
if (expression === "sad" || expression === "anxious") baseDuration = 2000; // Empathetic pause
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
typingIntervalRef.current = setTimeout(typeChar, isSegment ? 40 : 35);
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

// Enhanced response processing with dramatic pauses and expressions
const processResponseWithPauses = async (fullResponse, userMessage = "") => {
const segments = splitIntoSemanticSegments(fullResponse);
setResponseSegments(segments);

for (let i = 0; i < segments.length; i++) {
setCurrentResponseSegment(i);

// Enhanced thinking with facial expressions for each segment
if (i > 0) {
await simulateThinking(userMessage, segments[i]);
}

// Set expression for typing
const segmentExpression = detectFacialExpression(segments[i], userMessage);
setFacialExpression(segmentExpression);

// Type the current segment with expression-based timing
await typeMessage(segments[i], true);

// Add the completed segment to messages with expression metadata
setMessages((prev) => [
...prev,
{
type: "ai",
text: segments[i],
isSegment: true,
segmentIndex: i,
expression: segmentExpression,
emotionalState: detectEmotionalState(segments[i], segmentExpression)
},
]);
setTypingMessage("");

// Dramatic pause between segments with varying duration
if (i < segments.length - 1) {
let pauseDuration = 800;
if (segmentExpression === "thoughtful") pauseDuration = 1200;
if (segmentExpression === "sad") pauseDuration = 1000;
if (segmentExpression === "surprised") pauseDuration = 600;
await new Promise(resolve => setTimeout(resolve, pauseDuration));
}
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
const userMessage = inputText.trim();

// Add user message to chat
setMessages((prev) => [
...prev,
{ type: "user", text: userMessage },
]);
setInputText("");
setIsLoading(true);
setShowKeyboard(false); // Hide keyboard when waiting for AI response

// Get AI response first to analyze for facial expressions
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
  
  // Initial thinking time with expression analysis
  await simulateThinking(userMessage, response);
  
  // Process response with enhanced semantic pauses and facial expressions
  await processResponseWithPauses(response, userMessage);
  
  setShowKeyboard(true); // Show keyboard again when ready for user input
} catch (error) {
  setIsLoading(false);
  
  // Get multilingual error message
  const errorMessages = {
    de: "Es tut mir leid, ich habe gerade Verbindungsprobleme. Bitte versuche es erneut.",
    en: "I'm sorry, I'm having trouble connecting right now. Please try again.",
    fr: "Je suis désolé, j'ai des problèmes de connexion. Veuillez réessayer.",
    es: "Lo siento, tengo problemas de conexión ahora. Por favor, inténtalo de nuevo.",
    it: "Mi dispiace, ho problemi di connessione ora. Per favore riprova."
  };
  
  const errorMsg = errorMessages[currentLanguage] || errorMessages.en;
  
  // Show thinking before error message too
  await simulateThinking();
  await typeMessage(errorMsg);
  setMessages((prev) => [
    ...prev,
    { type: "ai", text: errorMsg },
  ]);
  setTypingMessage("");
  setShowKeyboard(true); // Show keyboard again when ready for user input
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
<div className={`chat-flow-07 ${!showKeyboard ? 'keyboard-hidden' : ''} ${className || ""}`}>
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
{currentLanguage === 'de' ? 'Ältere Nachrichten' :
currentLanguage === 'fr' ? 'Messages précédents' :
currentLanguage === 'es' ? 'Mensajes anteriores' :
currentLanguage === 'it' ? 'Messaggi precedenti' :
'Older messages'}
</div>
</div>
)}

{messages.map((message, index) => (
<div
key={index}
className={`message ${message.type}-message ${message.expression ? `expression-${message.expression}` : ''}`}
>
<div className={`message-bubble ${message.emotionalState ? `emotional-${message.emotionalState}` : ''}`}>
{message.text}
</div>
</div>
))}

{(isLoading || isThinking) && (
<div className="message ai-message">
<div className={`message-bubble loading expression-${facialExpression} emotional-${emotionalState}`}>
{isThinking ? (
<div className="thinking-indicator">
<div className="thinking-text">
{facialExpression === 'thoughtful' && (
currentLanguage === 'de' ? 'Überlege sorgfältig...' :
currentLanguage === 'fr' ? 'Je réfléchis attentivement...' :
currentLanguage === 'es' ? 'Reflexionando cuidadosamente...' :
currentLanguage === 'it' ? 'Riflettendo attentamente...' :
'Thinking carefully...'
)}
{facialExpression === 'empathetic' && (
currentLanguage === 'de' ? 'Verstehe deine Gefühle...' :
currentLanguage === 'fr' ? 'Je comprends tes sentiments...' :
currentLanguage === 'es' ? 'Entiendo tus sentimientos...' :
currentLanguage === 'it' ? 'Capisco i tuoi sentimenti...' :
'Understanding your feelings...'
)}
{facialExpression === 'neutral' && (
currentLanguage === 'de' ? 'Denke nach...' :
currentLanguage === 'fr' ? 'Je réfléchis...' :
currentLanguage === 'es' ? 'Pensando...' :
currentLanguage === 'it' ? 'Sto pensando...' :
'Thinking...'
)}
</div>
<div className={`thinking-dots expression-${facialExpression}`}>
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
<div className={`message-bubble typing-animation expression-${facialExpression} emotional-${emotionalState}`}>
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

<OrbsV3Property1Variant4
property1="variant-4"
className="orbs-v-3-instance"
/>

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
    currentLanguage === 'de' ? "Gib deine Nachricht ein..." :
    currentLanguage === 'fr' ? "Tapez votre message..." :
    currentLanguage === 'es' ? "Escribe tu mensaje..." :
    currentLanguage === 'it' ? "Scrivi il tuo messaggio..." :
    "Type your message..."
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
cursor: inputText.trim() && !isLoading && !isThinking
? "pointer"
: "default",
opacity: inputText.trim() && !isLoading && !isThinking ? 1 : 0.5,
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
