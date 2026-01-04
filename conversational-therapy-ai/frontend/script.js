// CBT AI Technical Interface - Main JavaScript
console.log("🧠 CBT AI Technical Interface - Loading...");

// Global state management
const AppState = {
	serverUrl: "http://localhost:8000",
	currentTab: "chat",
	isConnected: false,
	requestCount: 0,
	sessionStart: Date.now(),
	messageCount: 0,
	currentMood: "neutral",
	currentPatterns: [],
	detectedLanguage: "de",
	cameraStream: null,
	mediaRecorder: null,
	isRecording: false,
	logs: [],
	emotionHistory: [],
};

// Utility functions
const Utils = {
	formatTime: (timestamp) => {
		return new Date(timestamp).toLocaleTimeString();
	},

	formatDuration: (ms) => {
		const minutes = Math.floor(ms / 60000);
		return `${minutes}m`;
	},

	generateId: () => {
		return Math.random().toString(36).substr(2, 9);
	},

	debounce: (func, wait) => {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	},
};

// Notification system
const NotificationSystem = {
	show: (message, type = "info", duration = 3000) => {
		const container = document.getElementById("notification-container");
		const notification = document.createElement("div");
		notification.className = `notification ${type}`;
		notification.textContent = message;

		container.appendChild(notification);

		setTimeout(() => {
			if (notification.parentNode) {
				notification.parentNode.removeChild(notification);
			}
		}, duration);
	},

	success: (message) => NotificationSystem.show(message, "success"),
	warning: (message) => NotificationSystem.show(message, "warning"),
	error: (message) => NotificationSystem.show(message, "error"),
};

// Logger system
const Logger = {
	log: (level, message) => {
		const timestamp = new Date().toISOString();
		const logEntry = { timestamp, level, message };
		AppState.logs.push(logEntry);

		// Update logs display if logs tab is active
		if (AppState.currentTab === "logs") {
			LogsManager.updateDisplay();
		}

		console.log(`[${level.toUpperCase()}] ${message}`);
	},

	info: (message) => Logger.log("info", message),
	warning: (message) => Logger.log("warning", message),
	error: (message) => Logger.log("error", message),
};

// API Manager
const APIManager = {
	async request(endpoint, options = {}) {
		try {
			AppState.requestCount++;
			Logger.info(`API Request: ${endpoint}`);

			const response = await fetch(`${AppState.serverUrl}${endpoint}`, {
				headers: {
					"Content-Type": "application/json",
					...options.headers,
				},
				...options,
			});

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`
				);
			}

			const data = await response.json();
			Logger.info(`API Response: ${endpoint} - Success`);
			return data;
		} catch (error) {
			Logger.error(`API Error: ${endpoint} - ${error.message}`);
			throw error;
		}
	},

	async sendMessage(text) {
		return this.request("/chat", {
			method: "POST",
			body: JSON.stringify({ text }),
		});
	},

	async getBlobs() {
		return this.request("/blobs");
	},

	async transcribeAudio(file) {
		const formData = new FormData();
		formData.append("file", file);

		const response = await fetch(`${AppState.serverUrl}/transcribe`, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		return response.json();
	},

	async synthesizeSpeech(text) {
		const formData = new FormData();
		formData.append("text", text);

		const response = await fetch(`${AppState.serverUrl}/speak`, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		return response.json();
	},

	async analyzeFace(imageBlob) {
		const formData = new FormData();
		formData.append("image", imageBlob, "face.jpg");

		const response = await fetch(`${AppState.serverUrl}/analyze-face`, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		return response.json();
	},
};

// Chat Manager
const ChatManager = {
	addMessage: (content, isUser = false, timestamp = Date.now()) => {
		const messagesContainer = document.getElementById("chat-messages");
		const message = document.createElement("div");
		message.className = `message ${
			isUser ? "user-message" : "bot-message"
		}`;

        // Create message structure safely
		        const headerDiv = document.createElement("div");
        headerDiv.className = "message-header";
        
        const senderSpan = document.createElement("span");
        senderSpan.className = "sender";
        senderSpan.textContent = isUser ? "You" : "CBT Therapist";
        headerDiv.appendChild(senderSpan);
        
        const timestampSpan = document.createElement("span");
        timestampSpan.className = "timestamp";
        timestampSpan.textContent = Utils.formatTime(timestamp);
        headerDiv.appendChild(timestampSpan);
        
        message.appendChild(headerDiv);
        
        const contentDiv = document.createElement("div");
        contentDiv.className = "message-content";
        contentDiv.textContent = content;  // Use textContent instead of innerHTML
        message.appendChild(contentDiv);
