import React from "react";
import "./ChatFlow07.css";
import { OrbsV3Property1Variant4 } from "./OrbsV3Property1Variant4";
import { KeyboardIPhoneTypeDefault } from "./KeyboardIPhoneTypeDefault";

export const ChatFlow07 = ({
className,
onArrowClick,
aiResponse,
onSendMessage,
...props
}) => {
const [inputText, setInputText] = React.useState("");
const [isLoading, setIsLoading] = React.useState(false);
const [messages, setMessages] = React.useState([
{ type: "ai", text: "Tell me, what's on your mind?" },
]);
const [typingMessage, setTypingMessage] = React.useState("");
const [isTypingAnimation, setIsTypingAnimation] = React.useState(false);
const [showKeyboard, setShowKeyboard] = React.useState(true);
const messagesEndRef = React.useRef(null);
const typingIntervalRef = React.useRef(null);

const scrollToBottom = () => {
messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

React.useEffect(() => {
scrollToBottom();
}, [messages, typingMessage]);

const typeMessage = (fullMessage) => {
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
// Auto-scroll during typing
setTimeout(() => {
scrollToBottom();
}, 10);
typingIntervalRef.current = setTimeout(typeChar, 30); // 30ms delay between characters
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

React.useEffect(() => {
return () => {
if (typingIntervalRef.current) {
clearTimeout(typingIntervalRef.current);
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
!isTypingAnimation
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

// Get AI response
try {
const response = await onSendMessage(userMessage);
setIsLoading(false);

// Start typing animation for AI response
await typeMessage(response);

// Add the completed message to the messages array
setMessages((prev) => [
...prev,
{ type: "ai", text: response },
]);
setTypingMessage("");
setShowKeyboard(true); // Show keyboard again when ready for user input
} catch (error) {
setIsLoading(false);
const errorMsg =
"I'm sorry, I'm having trouble connecting right now. Please try again.";
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
<div className="check-in">Check In </div>
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
<div className="chat-messages-container">
{messages.map((message, index) => (
<div
key={index}
className={`message ${message.type}-message`}
>
<div className="message-bubble">{message.text}</div>
</div>
))}
{isLoading && (
<div className="message ai-message">
<div className="message-bubble loading">
<div className="typing-indicator">
<div className="dot"></div>
<div className="dot"></div>
<div className="dot"></div>
</div>
</div>
</div>
)}
{isTypingAnimation && typingMessage && (
<div className="message ai-message">
<div className="message-bubble typing-animation">
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
placeholder="Type your message..."
value={inputText}
onChange={handleInputChange}
onKeyPress={handleKeyPress}
disabled={isLoading}
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
cursor: inputText.trim()
? "pointer"
: "default",
opacity: inputText.trim() ? 1 : 0.5,
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
