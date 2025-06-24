import React, { useState, useRef, useEffect } from "react";
import "./SwipeContainer.css";
import ChatFlow from "./ChatFlow";
import ChatFlowEnhanced from "./ChatFlowEnhanced";
import ChatFlow07Enhanced from "./ChatFlow07Enhanced";
import WidgetsLeft from "./WidgetsLeft";
import { ChatFlow07 } from "./ChatFlow07";
import Screen2V4 from "./Screen2V4";
import BodySubpage from "./BodySubpage";
import MindSubpage from "./MindSubpage";
import ConnectionSubpage from "./ConnectionSubpage";
import chatService from "../services/chatService";

const SwipeContainer = ({ onDebugUpdate }) => {
	// Check for enhanced modes - TEXT ENHANCED NOW DEFAULT
	const urlParams = new URLSearchParams(window.location.search);
	const useEnhanced = urlParams.get("enhanced") === "true";
	// Text-Enhanced ist jetzt standardmäßig aktiv, außer explizit deaktiviert
	const useTextEnhanced = urlParams.get("text-enhanced") !== "false";

	const [currentScreen, setCurrentScreen] = useState("chat"); // 'widgets', 'chat', 'emotional-tasks', 'chatflow07', 'body', 'mind', or 'connection'
	const [aiResponse, setAiResponse] = useState("");

	// Debug data from child components - removed local state, using external handler
	// Debug callback function for child components
	const handleDebugUpdate = (componentName, data) => {
		if (onDebugUpdate) {
			onDebugUpdate(componentName, data);
		}
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
			y: e.targetTouches[0].clientY,
		});
	};

	const onTouchMove = (e) => {
		setTouchEnd({
			x: e.targetTouches[0].clientX,
			y: e.targetTouches[0].clientY,
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

		// DISABLED: No swipe navigation on body, mind, and connection pages (only Back-Button works)
		if (currentScreen === "body" || currentScreen === "mind" || currentScreen === "connection") {
			return;
		}

		// INSIGHTS PAGE: Only horizontal swipe back to main page
		if (currentScreen === "emotional-tasks") {
			if (Math.abs(distanceX) > Math.abs(distanceY) && isLeftSwipe) {
				setIsTransitioning(true);
				setTimeout(() => {
					setCurrentScreen("chat");
					setIsTransitioning(false);
				}, 100);
			}
			return;
		}

		// MAIN PAGES (chat/chatflow07): All swipe directions enabled
		if (currentScreen === "chat" || currentScreen === "chatflow07") {
			// Prioritize horizontal swipes over vertical ones
			if (Math.abs(distanceX) > Math.abs(distanceY)) {
				if (isLeftSwipe) {
					// Swipe left: go to widgets from main page
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentScreen("widgets");
						setIsTransitioning(false);
					}, 100);
				}

				if (isRightSwipe) {
					// Swipe right: go to emotional-tasks from main page
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentScreen("emotional-tasks");
						setIsTransitioning(false);
					}, 100);
				}
			} else {
				// Handle vertical swipes on main page
				if (isUpSwipe && currentScreen === "chat") {
					// Swipe up: go to chatflow07 from chat
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentScreen("chatflow07");
						setIsTransitioning(false);
					}, 100);
				}

				if (isDownSwipe && currentScreen === "chatflow07") {
					// Swipe down: go back to chat from chatflow07
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentScreen("chat");
						setIsTransitioning(false);
					}, 100);
				}
			}
			return;
		}

		// WIDGETS PAGE: Only horizontal swipe back to main page
		if (currentScreen === "widgets") {
			if (Math.abs(distanceX) > Math.abs(distanceY) && isRightSwipe) {
				setIsTransitioning(true);
				setTimeout(() => {
					setCurrentScreen("chat");
					setIsTransitioning(false);
				}, 100);
			}
			return;
		}
	};

	const showWidgets = () => setCurrentScreen("widgets");
	const showChat = () => setCurrentScreen("chat");
	const showBodySubpage = () => setCurrentScreen("body");
	const showMindSubpage = () => setCurrentScreen("mind");
	const showConnectionSubpage = () => setCurrentScreen("connection");
	const backToInsights = () => setCurrentScreen("emotional-tasks");

	// Mouse event handlers for desktop testing
	const [mouseStart, setMouseStart] = useState(null);
	const [mouseEnd, setMouseEnd] = useState(null);
	const [isDragging, setIsDragging] = useState(false);

	const onMouseDown = (e) => {
		setIsDragging(true);
		setMouseEnd(null);
		setMouseStart({
			x: e.clientX,
			y: e.clientY,
		});
	};

	const onMouseMove = (e) => {
		if (!isDragging) return;
		setMouseEnd({
			x: e.clientX,
			y: e.clientY,
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

		// DISABLED: No swipe navigation on body, mind, and connection pages (only Back-Button works)
		if (currentScreen === "body" || currentScreen === "mind" || currentScreen === "connection") {
			setIsDragging(false);
			return;
		}

		// INSIGHTS PAGE: Only horizontal swipe back to main page
		if (currentScreen === "emotional-tasks") {
			if (Math.abs(distanceX) > Math.abs(distanceY) && isLeftSwipe) {
				setIsTransitioning(true);
				setTimeout(() => {
					setCurrentScreen("chat");
					setIsTransitioning(false);
				}, 100);
			}
			setIsDragging(false);
			return;
		}

		// MAIN PAGES (chat/chatflow07): All swipe directions enabled
		if (currentScreen === "chat" || currentScreen === "chatflow07") {
			// Prioritize horizontal swipes over vertical ones
			if (Math.abs(distanceX) > Math.abs(distanceY)) {
				if (isLeftSwipe) {
					// Swipe left: go to widgets from main page
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentScreen("widgets");
						setIsTransitioning(false);
					}, 100);
				}

				if (isRightSwipe) {
					// Swipe right: go to emotional-tasks from main page
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentScreen("emotional-tasks");
						setIsTransitioning(false);
					}, 100);
				}
			} else {
				// Handle vertical swipes on main page
				if (isUpSwipe && currentScreen === "chat") {
					// Swipe up: go to chatflow07 from chat
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentScreen("chatflow07");
						setIsTransitioning(false);
					}, 100);
				}

				if (isDownSwipe && currentScreen === "chatflow07") {
					// Swipe down: go back to chat from chatflow07
					setIsTransitioning(true);
					setTimeout(() => {
						setCurrentScreen("chat");
						setIsTransitioning(false);
					}, 100);
				}
			}
			setIsDragging(false);
			return;
		}

		// WIDGETS PAGE: Only horizontal swipe back to main page
		if (currentScreen === "widgets") {
			if (Math.abs(distanceX) > Math.abs(distanceY) && isRightSwipe) {
				setIsTransitioning(true);
				setTimeout(() => {
					setCurrentScreen("chat");
					setIsTransitioning(false);
				}, 100);
			}
			setIsDragging(false);
			return;
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
			{/* Minimal Debug Chat Button - positioned to not interfere */}
			<button
				onClick={handleNavigateToChat}
				style={{
					position: "fixed",
					top: "10px",
					right: "20px",
					background: "rgba(0, 122, 255, 0.8)",
					color: "white",
					border: "none",
					borderRadius: "20px",
					padding: "6px 12px",
					fontSize: "12px",
					fontWeight: "500",
					cursor: "pointer",
					zIndex: 999,
					boxShadow: "0 2px 8px rgba(0, 122, 255, 0.2)",
					backdropFilter: "blur(10px)",
					opacity: 0.7,
					transition: "opacity 0.3s ease",
				}}
				onMouseEnter={(e) => (e.target.style.opacity = "1")}
				onMouseLeave={(e) => (e.target.style.opacity = "0.7")}
			>
				💬
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
					style={{
						opacity: currentScreen === "emotional-tasks" ? 1 : 0.5,
					}}
				>
					Emotional Tasks
				</span>
			</div>

			<div
				className="simple-container"
				ref={containerRef}
				onTouchStart={currentScreen === "body" || currentScreen === "mind" || currentScreen === "connection" ? undefined : onTouchStart}
				onTouchMove={currentScreen === "body" || currentScreen === "mind" || currentScreen === "connection" ? undefined : onTouchMove}
				onTouchEnd={currentScreen === "body" || currentScreen === "mind" || currentScreen === "connection" ? undefined : onTouchEnd}
				onMouseDown={currentScreen === "body" || currentScreen === "mind" || currentScreen === "connection" ? undefined : onMouseDown}
				onMouseMove={currentScreen === "body" || currentScreen === "mind" || currentScreen === "connection" ? undefined : onMouseMove}
				onMouseUp={currentScreen === "body" || currentScreen === "mind" || currentScreen === "connection" ? undefined : onMouseUp}
				onMouseLeave={currentScreen === "body" || currentScreen === "mind" || currentScreen === "connection" ? undefined : onMouseUp}
				style={{
					cursor: currentScreen === "body" || currentScreen === "mind" || currentScreen === "connection" ? "default" : (isDragging ? "grabbing" : "grab")
				}}
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
								onDebugUpdate={handleDebugUpdate}
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
						<Screen2V4
							onBodyPageClick={showBodySubpage}
							onMindPageClick={showMindSubpage}
							onConnectionPageClick={showConnectionSubpage}
						/>
					</div>
				)}

				{currentScreen === "body" && (
					<div className="screen active">
						<BodySubpage onBackClick={backToInsights} />
					</div>
				)}

				{currentScreen === "mind" && (
					<div className="screen active">
						<MindSubpage onBackClick={backToInsights} />
					</div>
				)}

				{currentScreen === "connection" && (
					<div className="screen active">
						<ConnectionSubpage onBackClick={backToInsights} />
					</div>
				)}

			</div>
		</div>
	);
};

// Global Debug Panel - Außerhalb des Swipe Containers
const SwipeContainerWithDebug = () => {
	const [debugData, setDebugData] = useState({});
	const [showDebugPanel, setShowDebugPanel] = useState(false);

	const handleDebugUpdate = (componentName, data) => {
		setDebugData((prev) => ({
			...prev,
			[componentName]: data,
		}));
	};

	return (
		<>
			{/* Debug Toggle Button */}
			{process.env.NODE_ENV === "development" && (
				<button
					onClick={() => setShowDebugPanel(!showDebugPanel)}
					style={{
						position: "fixed",
						left: "10px",
						top: "10px",
						width: "30px",
						height: "30px",
						background: showDebugPanel
							? "rgba(255, 0, 0, 0.8)"
							: "rgba(0, 255, 0, 0.5)",
						border: "1px solid rgba(255, 255, 255, 0.3)",
						borderRadius: "50%",
						zIndex: 10001,
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: "12px",
						color: "white",
						backdropFilter: "blur(5px)",
						transition: "all 0.3s ease",
					}}
					title={
						showDebugPanel
							? "Debug Panel ausblenden"
							: "Debug Panel anzeigen"
					}
				>
					🔍
				</button>
			)}

			{/* Externes Debug Panel */}
			{process.env.NODE_ENV === "development" && showDebugPanel && (
				<div
					style={{
						position: "fixed",
						left: "10px",
						top: "50px",
						width: "300px",
						maxHeight: "70vh",
						background: "rgba(0, 0, 0, 0.9)",
						color: "white",
						padding: "10px",
						borderRadius: "8px",
						fontSize: "10px",
						fontFamily: "monospace",
						overflowY: "auto",
						zIndex: 10000,
						border: "1px solid rgba(255, 255, 255, 0.3)",
						backdropFilter: "blur(10px)",
						boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
					}}
				>
					<div
						style={{
							fontSize: "12px",
							fontWeight: "bold",
							marginBottom: "10px",
							textAlign: "center",
						}}
					>
						🔬 Zentrale Debug-Konsole
					</div>

					{Object.keys(debugData).length === 0 ? (
						<div
							style={{
								color: "#666",
								textAlign: "center",
								padding: "20px",
							}}
						>
							Keine Debug-Daten verfügbar
						</div>
					) : (
						Object.entries(debugData).map(
							([componentName, data]) => (
								<div
									key={componentName}
									style={{
										marginBottom: "15px",
										borderBottom: "1px solid #333",
										paddingBottom: "10px",
									}}
								>
									<div
										style={{
											color: "#00FF88",
											fontWeight: "bold",
											marginBottom: "5px",
										}}
									>
										{componentName}
									</div>

									{data.performanceMetrics && (
										<div style={{ marginBottom: "8px" }}>
											<div
												style={{
													color: "#FFD700",
													fontSize: "9px",
												}}
											>
												📊 Performance
											</div>
											<div>
												FPS:{" "}
												{data.performanceMetrics.fps ||
													"N/A"}
											</div>
											<div>
												Frame:{" "}
												{data.performanceMetrics.averageFrameTime?.toFixed(
													1
												)}
												ms
											</div>
											<div>
												Memory:{" "}
												{data.performanceMetrics
													.memoryUsage?.used || "N/A"}
												MB
											</div>
										</div>
									)}

									{data.debugInfo && (
										<div style={{ marginBottom: "8px" }}>
											<div
												style={{
													color: "#FF6B35",
													fontSize: "9px",
												}}
											>
												🎭 Animation
											</div>
											<div>
												Modus:{" "}
												{
													data.debugInfo.currentState
														?.mode
												}
											</div>
											<div>
												Emotion:{" "}
												{
													data.debugInfo.currentState
														?.emotionalState
												}
											</div>
											<div>
												Intensität:{" "}
												{(
													data.debugInfo.currentState
														?.intensity * 100
												)?.toFixed(0)}
												%
											</div>
										</div>
									)}

									{data.currentColors && (
										<div style={{ marginBottom: "8px" }}>
											<div
												style={{
													color: "#00BFFF",
													fontSize: "9px",
												}}
											>
												🎨 Colors
											</div>
											<div>
												State:{" "}
												{data.currentColors.state}
											</div>
											<div>
												Therapy:{" "}
												{data.currentColors.therapeutic}
											</div>
											<div>
												Emotion:{" "}
												{data.currentColors.emotion}
											</div>
										</div>
									)}
								</div>
							)
						)
					)}
				</div>
			)}

			<SwipeContainer onDebugUpdate={handleDebugUpdate} />
		</>
	);
};

export default SwipeContainerWithDebug;
