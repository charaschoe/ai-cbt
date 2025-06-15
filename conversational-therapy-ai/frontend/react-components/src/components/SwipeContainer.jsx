import React, { useState, useRef, useEffect } from "react";
import "./SwipeContainer.css";
import ChatFlow from "./ChatFlow";
import ChatFlowEnhanced from "./ChatFlowEnhanced";
import ChatFlow07Enhanced from "./ChatFlow07Enhanced";
import WidgetsLeft from "./WidgetsLeft";
import { ChatFlow07 } from "./ChatFlow07";
import Screen2V4 from "./Screen2V4";
import chatService from "../services/chatService";

const SwipeContainer = () => {
	// Check for enhanced modes
	const urlParams = new URLSearchParams(window.location.search);
	const useEnhanced = urlParams.get('enhanced') === 'true';
	const useTextEnhanced = urlParams.get('text-enhanced') === 'true';
	
	const [currentScreen, setCurrentScreen] = useState("chat"); // 'widgets', 'chat', 'emotional-tasks', or 'chatflow07'
	const [aiResponse, setAiResponse] = useState("");
	
	// Debug data from child components
	const [debugData, setDebugData] = useState({});
	
	// Debug callback function for child components
	const handleDebugUpdate = (componentName, data) => {
		setDebugData(prev => ({
			...prev,
			[componentName]: data
		}));
	};

	// Swipe detection state
	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const containerRef = useRef(null);

	// Minimum distance required to trigger a swipe
	const minSwipeDistance = 50;

	// Touch event handlers for swipe detection
	const onTouchStart = (e) => {
		setTouchEnd(null); // Otherwise the swipe is fired even with usual touch events
		setTouchStart({
			x: e.targetTouches[0].clientX,
			y: e.targetTouches[0].clientY
		});
	};

	const onTouchMove = (e) => {
		setTouchEnd({
			x: e.targetTouches[0].clientX,
			y: e.targetTouches[0].clientY
		});
	};

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;

		const distanceX = touchStart.x - touchEnd.x;
		const distanceY = touchStart.y - touchEnd.y;
		
		const isLeftSwipe = distanceX > minSwipeDistance;
		const isRightSwipe = distanceX < -minSwipeDistance;
		const isUpSwipe = distanceY > minSwipeDistance;
		const isDownSwipe = distanceY < -minSwipeDistance;

		// Prioritize horizontal swipes over vertical ones
		if (Math.abs(distanceX) > Math.abs(distanceY)) {
			if (isLeftSwipe) {
				// Swipe left: go to widgets from chat
				if (
					currentScreen === "chat" ||
					currentScreen === "chatflow07"
				) {
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentScreen("widgets");
						setIsTransitioning(false);
					}, 100);
				}
			}

			if (isRightSwipe) {
				// Swipe right: go to emotional-tasks from chat
				if (
					currentScreen === "chat" ||
					currentScreen === "chatflow07"
				) {
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentScreen("emotional-tasks");
						setIsTransitioning(false);
					}, 100);
				}
			}
		} else {
			// Handle vertical swipes
			if (isUpSwipe) {
				// Swipe up: go to chatflow07 from any screen
				if (currentScreen !== "chatflow07") {
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentScreen("chatflow07");
						setIsTransitioning(false);
					}, 100);
				}
			}
		}
	};

	const showWidgets = () => setCurrentScreen("widgets");
	const showChat = () => setCurrentScreen("chat");

	// Mouse event handlers for desktop testing
	const [mouseStart, setMouseStart] = useState(null);
	const [mouseEnd, setMouseEnd] = useState(null);
	const [isDragging, setIsDragging] = useState(false);

	const onMouseDown = (e) => {
		setIsDragging(true);
		setMouseEnd(null);
		setMouseStart({
			x: e.clientX,
			y: e.clientY
		});
	};

	const onMouseMove = (e) => {
		if (!isDragging) return;
		setMouseEnd({
			x: e.clientX,
			y: e.clientY
		});
	};

	const onMouseUp = () => {
		if (!isDragging || !mouseStart || !mouseEnd) {
			setIsDragging(false);
			return;
		}

		const distanceX = mouseStart.x - mouseEnd.x;
		const distanceY = mouseStart.y - mouseEnd.y;
		
		const isLeftSwipe = distanceX > minSwipeDistance;
		const isRightSwipe = distanceX < -minSwipeDistance;
		const isUpSwipe = distanceY > minSwipeDistance;
		const isDownSwipe = distanceY < -minSwipeDistance;

		// Prioritize horizontal swipes over vertical ones
		if (Math.abs(distanceX) > Math.abs(distanceY)) {
			if (isLeftSwipe) {
				// Swipe left: go to widgets from chat
				if (
					currentScreen === "chat" ||
					currentScreen === "chatflow07"
				) {
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentScreen("widgets");
						setIsTransitioning(false);
					}, 100);
				}
				// Swipe left: go to chat from emotional-tasks
				if (currentScreen === "emotional-tasks") {
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentScreen("chat");
						setIsTransitioning(false);
					}, 100);
				}
			}

			if (isRightSwipe) {
				// Swipe right: go to emotional-tasks from chat
				if (
					currentScreen === "chat" ||
					currentScreen === "chatflow07"
				) {
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentScreen("emotional-tasks");
						setIsTransitioning(false);
					}, 100);
				}
				// Swipe right: go to chat from widgets
				if (currentScreen === "widgets") {
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentScreen("chat");
						setIsTransitioning(false);
					}, 100);
				}
			}
		} else {
			// Handle vertical swipes
			if (isUpSwipe) {
				// Swipe up: go to chatflow07 from any screen
				if (currentScreen !== "chatflow07") {
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentScreen("chatflow07");
						setIsTransitioning(false);
					}, 100);
				}
			}
		}

		setIsDragging(false);
	};

	const toggleChatFlow = () => {
		if (currentScreen === "chatflow07") {
			setCurrentScreen("chat");
		} else {
			setCurrentScreen("chatflow07");
		}
	};

	// Get AI response when navigating to ChatFlow07
	const handleNavigateToChat = async () => {
		setCurrentScreen("chatflow07");
		try {
			const response = await chatService.startConversation();
			setAiResponse(response);
		} catch (error) {
			console.error("Error getting AI response:", error);
			setAiResponse(
				"Hi Anna, I'm here to help you. What's on your mind today?"
			);
		}
	};

	// Handle sending a message in chat mode
	const handleSendMessage = async (message) => {
		try {
			const responseData = await chatService.sendMessage(message);
			// Return just the response text for the chat interface
			return responseData.response || responseData;
		} catch (error) {
			console.error("Error sending message:", error);
			return "I'm sorry, I'm having trouble connecting right now. Please try again.";
		}
	};

	return (
		<div className="swipe-container-wrapper">
			{/* Global Debug Panel - außerhalb aller Container */}
			{process.env.NODE_ENV === "development" && (
				<div
					style={{
						position: "fixed",
						top: "80px",
						right: "20px",
						background: "rgba(0, 0, 0, 0.95)",
						color: "white",
						padding: "12px",
						borderRadius: "8px",
						fontSize: "11px",
						maxWidth: "300px",
						maxHeight: "600px",
						overflowY: "auto",
						zIndex: 9999, // Höchste Z-Index Priorität
						fontFamily: "monospace",
						border: "1px solid rgba(255, 255, 255, 0.3)",
						backdropFilter: "blur(10px)",
					}}
				>
					<div
						style={{
							borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
							paddingBottom: "8px",
							marginBottom: "8px",
							textAlign: "center"
						}}
					>
						<strong>🔍 Global Debug Panel</strong>
					</div>

					{/* Current Screen Info */}
					<div style={{ marginBottom: "8px" }}>
						<div><strong>📱 Current Screen:</strong></div>
						<div>Active: {currentScreen}</div>
						<div>Enhanced Audio: {useEnhanced ? "Yes" : "No"}</div>
						<div>Enhanced Text: {useTextEnhanced ? "Yes" : "No"}</div>
						<div>Transitioning: {isTransitioning ? "Yes" : "No"}</div>
					</div>

					{/* Enhanced Mode Specific Debug */}
					{useTextEnhanced && currentScreen === "chatflow07" && (
						<div style={{
							borderTop: "1px solid rgba(255, 255, 255, 0.2)",
							paddingTop: "8px",
							marginBottom: "8px"
						}}>
							<div><strong>💬 Text Enhanced Mode:</strong></div>
							<div>Component: ChatFlow07Enhanced</div>
							<div>Text Analysis: Active</div>
							<div>UniversalOrbAnimation: text mode</div>
							{debugData.textEnhanced && (
								<>
									<div style={{ fontSize: "10px", color: "#888", marginTop: "4px" }}>
										Orb State: {debugData.textEnhanced.emotionalState}
									</div>
									<div style={{ fontSize: "10px", color: "#888" }}>
										Urgency: {(debugData.textEnhanced.urgencyLevel * 100).toFixed(0)}%
									</div>
									<div style={{ fontSize: "10px", color: "#888" }}>
										Sentiment: {(debugData.textEnhanced.sentimentScore * 100).toFixed(0)}%
									</div>
								</>
							)}
						</div>
					)}

					{useEnhanced && currentScreen === "chat" && (
						<div style={{
							borderTop: "1px solid rgba(255, 255, 255, 0.2)",
							paddingTop: "8px",
							marginBottom: "8px"
						}}>
							<div><strong>🎵 Audio Enhanced Mode:</strong></div>
							<div>Component: ChatFlowEnhanced</div>
							<div>Audio Analysis: Active</div>
							<div>UniversalOrbAnimation: audio mode</div>
							{debugData.audioEnhanced && (
								<>
									<div style={{ fontSize: "10px", color: "#888", marginTop: "4px" }}>
										Playing: {debugData.audioEnhanced.isPlaying ? "Yes" : "No"}
									</div>
									<div style={{ fontSize: "10px", color: "#888" }}>
										Emotional State: {debugData.audioEnhanced.emotionalState}
									</div>
									<div style={{ fontSize: "10px", color: "#888" }}>
										Intensity: {(debugData.audioEnhanced.intensity * 100).toFixed(0)}%
									</div>
								</>
							)}
						</div>
					)}

					{/* Navigation Info */}
					<div style={{
						borderTop: "1px solid rgba(255, 255, 255, 0.2)",
						paddingTop: "8px",
						marginBottom: "8px"
					}}>
						<div><strong>🧭 Navigation:</strong></div>
						<div>Touch: {touchStart ? "Active" : "Idle"}</div>
						<div>Mouse: {isDragging ? "Dragging" : "Idle"}</div>
						<div style={{ fontSize: "10px", color: "#888" }}>
							Swipe: Left=Widgets, Right=Emotional, Up=ChatFlow07
						</div>
					</div>

					{/* System Info */}
					<div style={{
						borderTop: "1px solid rgba(255, 255, 255, 0.2)",
						paddingTop: "8px"
					}}>
						<div><strong>⚙️ System:</strong></div>
						<div>Viewport: {window.innerWidth}x{window.innerHeight}</div>
						<div>User Agent: {navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}</div>
						<div style={{ fontSize: "10px", color: "#666" }}>
							Phase 3: Text Integration Complete
						</div>
					</div>
				</div>
			)}
			{/* Desktop help text */}
			<div
				style={{
					position: "fixed",
					top: "20px",
					left: "20px",
					background: "rgba(0, 0, 0, 0.7)",
					color: "white",
					padding: "8px 12px",
					borderRadius: "12px",
					fontSize: "12px",
					zIndex: 1000,
					display: window.innerWidth > 768 ? "block" : "none",
				}}
			>
				💡 Left: Widgets ← Chat → Emotional Tasks (Right) | Swipe up for ChatFlow
			</div>

			{/* Debug Chat Button */}
			<button
				onClick={handleNavigateToChat}
				style={{
					position: "fixed",
					top: "20px",
					right: "20px",
					background: "#007AFF",
					color: "white",
					border: "none",
					borderRadius: "8px",
					padding: "10px 16px",
					fontSize: "14px",
					fontWeight: "600",
					cursor: "pointer",
					zIndex: 1000,
					boxShadow: "0 4px 12px rgba(0, 122, 255, 0.3)",
				}}
			>
				💬 Start Chat
			</button>

			{/* Swipe indicator */}
			<div
				style={{
					position: "fixed",
					bottom: "20px",
					left: "50%",
					transform: "translateX(-50%)",
					background: "rgba(0, 0, 0, 0.7)",
					color: "white",
					padding: "8px 16px",
					borderRadius: "20px",
					fontSize: "12px",
					zIndex: 1000,
					display: "flex",
					alignItems: "center",
					gap: "8px",
					transition: "all 0.3s ease",
					opacity: isTransitioning ? 1 : 0.6,
				}}
			>
				<span
					style={{ opacity: currentScreen === "widgets" ? 1 : 0.5 }}
				>
					Widgets
				</span>
				<div
					style={{
						width: "8px",
						height: "8px",
						borderRadius: "50%",
						background:
							currentScreen === "widgets"
								? "#00FF88"
								: currentScreen === "chat" ||
								  currentScreen === "chatflow07"
								? "#007AFF"
								: currentScreen === "emotional-tasks"
								? "#FF6B35"
								: "#666",
						transition: "background 0.3s ease",
					}}
				></div>
				<span
					style={{
						opacity:
							currentScreen === "chat" ||
							currentScreen === "chatflow07"
								? 1
								: 0.5,
					}}
				>
					Chat
				</span>
				<div
					style={{
						width: "8px",
						height: "8px",
						borderRadius: "50%",
						background:
							currentScreen === "emotional-tasks"
								? "#FF6B35"
								: "#666",
						transition: "background 0.3s ease",
					}}
				></div>
				<span
					style={{ opacity: currentScreen === "emotional-tasks" ? 1 : 0.5 }}
				>
					Emotional Tasks
				</span>
			</div>

			<div
				className="simple-container"
				ref={containerRef}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove}
				onMouseUp={onMouseUp}
				onMouseLeave={onMouseUp}
				style={{ cursor: isDragging ? "grabbing" : "grab" }}
			>
				{currentScreen === "widgets" && (
					<div className="screen active">
						<WidgetsLeft />
					</div>
				)}

				{currentScreen === "chat" && (
					<div className="screen active">
						{useEnhanced ? (
							<ChatFlowEnhanced onArrowClick={toggleChatFlow} />
						) : (
							<ChatFlow onArrowClick={toggleChatFlow} />
						)}
					</div>
				)}


				{currentScreen === "chatflow07" && (
					<div className="screen active">
						{useTextEnhanced ? (
							<ChatFlow07Enhanced
								onArrowClick={toggleChatFlow}
								aiResponse={aiResponse}
								onSendMessage={handleSendMessage}
							/>
						) : (
							<ChatFlow07
								onArrowClick={toggleChatFlow}
								aiResponse={aiResponse}
								onSendMessage={handleSendMessage}
							/>
						)}
					</div>
				)}

				{currentScreen === "emotional-tasks" && (
					<div className="screen active">
						<Screen2V4 />
					</div>
				)}
			</div>
		</div>
	);
};

export default SwipeContainer;
