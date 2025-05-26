// CBT AI Technical Interface - Main JavaScript
console.log('🧠 CBT AI Technical Interface - Loading...');

// Global state management
const AppState = {
    serverUrl: 'http://localhost:8000',
    currentTab: 'chat',
    isConnected: false,
    requestCount: 0,
    sessionStart: Date.now(),
    messageCount: 0,
    currentMood: 'neutral',
    currentPatterns: [],
    cameraStream: null,
    mediaRecorder: null,
    isRecording: false,
    logs: [],
    emotionHistory: []
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
    }
};

// Notification system
const NotificationSystem = {
    show: (message, type = 'info', duration = 3000) => {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    },
    
    success: (message) => NotificationSystem.show(message, 'success'),
    warning: (message) => NotificationSystem.show(message, 'warning'),
    error: (message) => NotificationSystem.show(message, 'error')
};

// Logger system
const Logger = {
    log: (level, message) => {
        const timestamp = new Date().toISOString();
        const logEntry = { timestamp, level, message };
        AppState.logs.push(logEntry);
        
        // Update logs display if logs tab is active
        if (AppState.currentTab === 'logs') {
            LogsManager.updateDisplay();
        }
        
        console.log(`[${level.toUpperCase()}] ${message}`);
    },
    
    info: (message) => Logger.log('info', message),
    warning: (message) => Logger.log('warning', message),
    error: (message) => Logger.log('error', message)
};

// API Manager
const APIManager = {
    async request(endpoint, options = {}) {
        try {
            AppState.requestCount++;
            Logger.info(`API Request: ${endpoint}`);
            
            const response = await fetch(`${AppState.serverUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
        return this.request('/chat', {
            method: 'POST',
            body: JSON.stringify({ text })
        });
    },
    
    async getBlobs() {
        return this.request('/blobs');
    },
    
    async transcribeAudio(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${AppState.serverUrl}/transcribe`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return response.json();
    },
    
    async synthesizeSpeech(text) {
        const formData = new FormData();
        formData.append('text', text);
        
        const response = await fetch(`${AppState.serverUrl}/speak`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return response.json();
    },
    
    async analyzeFace(imageBlob) {
        const formData = new FormData();
        formData.append('image', imageBlob, 'face.jpg');
        
        const response = await fetch(`${AppState.serverUrl}/analyze-face`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return response.json();
    }
};

// Chat Manager
const ChatManager = {
    addMessage: (content, isUser = false, timestamp = Date.now()) => {
        const messagesContainer = document.getElementById('chat-messages');
        const message = document.createElement('div');
        message.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        message.innerHTML = `
            <div class="message-header">
                <span class="sender">${isUser ? 'You' : 'CBT Therapist'}</span>
                <span class="timestamp">${Utils.formatTime(timestamp)}</span>
            </div>
            <div class="message-content">${content}</div>
        `;
        
        messagesContainer.appendChild(message);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        if (isUser) {
            AppState.messageCount++;
            StatusManager.updateStats();
        }
    },
    
    sendMessage: async (text) => {
        if (!text.trim()) return;
        
        // Add user message
        ChatManager.addMessage(text, true);
        
        // Clear input
        const input = document.getElementById('chat-input');
        input.value = '';
        
        try {
            // Send to API
            const response = await APIManager.sendMessage(text);
            
            // Add bot response
            ChatManager.addMessage(response.response, false);
            
            // Update mood and patterns
            AppState.currentMood = response.mood;
            AppState.currentPatterns = response.patterns || [];
            
            // Update mood display
            document.getElementById('current-mood').textContent = AppState.currentMood;
            document.getElementById('current-patterns').textContent = 
                AppState.currentPatterns.length > 0 ? AppState.currentPatterns.join(', ') : 'none detected';
            
            Logger.info(`Chat: Mood detected as ${response.mood}`);
            
        } catch (error) {
            Logger.error(`Chat error: ${error.message}`);
            NotificationSystem.error('Failed to send message. Please try again.');
            ChatManager.addMessage('Sorry, I had trouble processing your message. Please try again.', false);
        }
    },
    
    clear: () => {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.innerHTML = `
            <div class="message bot-message">
                <div class="message-header">
                    <span class="sender">CBT Therapist</span>
                    <span class="timestamp">${Utils.formatTime(Date.now())}</span>
                </div>
                <div class="message-content">
                    Hello! I'm your CBT therapist. How are you feeling today? What would you like to explore in our session?
                </div>
            </div>
        `;
        AppState.messageCount = 0;
        StatusManager.updateStats();
        Logger.info('Chat cleared');
    },
    
    export: () => {
        const messages = Array.from(document.querySelectorAll('.message')).map(msg => {
            const sender = msg.querySelector('.sender').textContent;
            const timestamp = msg.querySelector('.timestamp').textContent;
            const content = msg.querySelector('.message-content').textContent;
            return { sender, timestamp, content };
        });
        
        const dataStr = JSON.stringify(messages, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `cbt-chat-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        Logger.info('Chat exported');
        NotificationSystem.success('Chat exported successfully');
    }
};

// Analysis Manager
const AnalysisManager = {
    refresh: async () => {
        try {
            Logger.info('Refreshing analysis data');
            const blobData = await APIManager.getBlobs();
            AnalysisManager.updateBubbles(blobData);
            AnalysisManager.updatePatterns();
            StatusManager.updateStats();
        } catch (error) {
            Logger.error(`Analysis refresh error: ${error.message}`);
            NotificationSystem.error('Failed to refresh analysis data');
        }
    },
    
    updateBubbles: (blobData) => {
        const container = document.getElementById('emotion-bubbles');
        
        if (!blobData || Object.keys(blobData).length === 0) {
            container.innerHTML = '<div class="empty-state">No emotion data available yet. Start a conversation to see analysis.</div>';
            return;
        }
        
        container.innerHTML = '';
        
        // Sort themes by size (frequency)
        const sortedThemes = Object.keys(blobData).sort((a, b) => blobData[b].size - blobData[a].size);
        
        sortedThemes.forEach(theme => {
            const data = blobData[theme];
            const blob = document.createElement('div');
            blob.className = 'emotion-blob';
            blob.textContent = theme;
            
            // Size based on frequency
            const size = Math.max(60, Math.min(data.size * 20, 180));
            blob.style.width = `${size}px`;
            blob.style.height = `${size}px`;
            
            // Color and opacity
            blob.style.background = data.color || '#64748b';
            blob.style.opacity = Math.max(0.6, data.transparency || 0.8);
            
            // Tooltip
            blob.title = `Theme: ${theme}\nFrequency: ${data.frequency}\nIntensity: ${data.intensity?.toFixed(2) || 'N/A'}`;
            
            // Click handler
            blob.addEventListener('click', () => {
                Logger.info(`Emotion blob clicked: ${theme}`);
                NotificationSystem.info(`${theme}: Frequency ${data.frequency}, Intensity ${data.intensity?.toFixed(2) || 'N/A'}`);
            });
            
            container.appendChild(blob);
        });
    },
    
    updatePatterns: () => {
        const container = document.getElementById('pattern-list');
        
        if (AppState.currentPatterns.length === 0) {
            container.innerHTML = '<div class="empty-state">No patterns identified yet</div>';
            return;
        }
        
        container.innerHTML = '';
        AppState.currentPatterns.forEach(pattern => {
            const item = document.createElement('div');
            item.className = 'pattern-item';
            item.textContent = pattern;
            item.style.padding = '0.75rem';
            item.style.background = 'var(--code-bg)';
            item.style.borderRadius = '0.5rem';
            item.style.margin = '0.5rem 0';
            item.style.fontFamily = 'var(--font-mono)';
            item.style.fontSize = '0.875rem';
            container.appendChild(item);
        });
    }
};

// Facial Analysis Manager
const FaceManager = {
    startCamera: async () => {
        try {
            Logger.info('Starting camera for facial analysis');
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 } 
            });
            
            AppState.cameraStream = stream;
            const video = document.getElementById('camera-video');
            video.srcObject = stream;
            
            // Hide placeholder, show video
            document.getElementById('camera-placeholder').style.display = 'none';
            video.style.display = 'block';
            
            // Update button states
            document.getElementById('start-camera').disabled = true;
            document.getElementById('stop-camera').disabled = false;
            document.getElementById('take-snapshot').disabled = false;
            
            Logger.info('Camera started successfully');
            NotificationSystem.success('Camera started');
            
        } catch (error) {
            Logger.error(`Camera start error: ${error.message}`);
            NotificationSystem.error('Failed to access camera. Please check permissions.');
        }
    },
    
    stopCamera: () => {
        if (AppState.cameraStream) {
            AppState.cameraStream.getTracks().forEach(track => track.stop());
            AppState.cameraStream = null;
        }
        
        // Hide video, show placeholder
        const video = document.getElementById('camera-video');
        video.style.display = 'none';
        document.getElementById('camera-placeholder').style.display = 'flex';
        
        // Update button states
        document.getElementById('start-camera').disabled = false;
        document.getElementById('stop-camera').disabled = true;
        document.getElementById('take-snapshot').disabled = true;
        
        Logger.info('Camera stopped');
        NotificationSystem.info('Camera stopped');
    },
    
    takeSnapshot: async () => {
        if (!AppState.cameraStream) return;
        
        try {
            Logger.info('Taking facial analysis snapshot');
            const video = document.getElementById('camera-video');
            const canvas = document.getElementById('camera-canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            
            // Convert to blob
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
            
            // Analyze face
            document.getElementById('emotion-data').innerHTML = '<div class="no-data">Analyzing...</div>';
            
            const result = await APIManager.analyzeFace(blob);
            
            // Display results
            const resultHtml = `
                <div style="color: var(--text-primary); margin-bottom: 1rem;">
                    <strong>Detected Emotion:</strong> ${result.emotion}<br>
                    <strong>Confidence:</strong> ${(result.confidence * 100).toFixed(1)}%
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.875rem;">
                    ${Object.entries(result.emotions || {}).map(([emotion, confidence]) => 
                        `${emotion}: ${(confidence * 100).toFixed(1)}%`
                    ).join('<br>')}
                </div>
            `;
            
            document.getElementById('emotion-data').innerHTML = resultHtml;
            
            // Add to history
            const historyEntry = {
                timestamp: Date.now(),
                emotion: result.emotion,
                confidence: result.confidence
            };
            
            AppState.emotionHistory.push(historyEntry);
            FaceManager.updateHistory();
            
            Logger.info(`Facial analysis: ${result.emotion} (${(result.confidence * 100).toFixed(1)}%)`);
            NotificationSystem.success(`Emotion detected: ${result.emotion}`);
            
        } catch (error) {
            Logger.error(`Facial analysis error: ${error.message}`);
            NotificationSystem.error('Failed to analyze facial emotion');
            document.getElementById('emotion-data').innerHTML = '<div class="no-data">Analysis failed</div>';
        }
    },
    
    updateHistory: () => {
        const container = document.getElementById('emotion-history-list');
        
        if (AppState.emotionHistory.length === 0) {
            container.innerHTML = '<div class="empty-state">No detections recorded</div>';
            return;
        }
        
        container.innerHTML = '';
        AppState.emotionHistory.slice(-5).reverse().forEach(entry => {
            const item = document.createElement('div');
            item.style.padding = '0.5rem';
            item.style.borderBottom = '1px solid var(--border-color)';
            item.style.fontSize = '0.875rem';
            item.innerHTML = `
                <div style="color: var(--text-primary); font-weight: 600;">${entry.emotion}</div>
                <div style="color: var(--text-muted); font-size: 0.75rem;">
                    ${Utils.formatTime(entry.timestamp)} - ${(entry.confidence * 100).toFixed(1)}% confidence
                </div>
            `;
            container.appendChild(item);
        });
    }
};

// Audio Manager
const AudioManager = {
    startRecording: async () => {
        try {
            Logger.info('Starting audio recording');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            AppState.mediaRecorder = new MediaRecorder(stream);
            const chunks = [];
            
            AppState.mediaRecorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };
            
            AppState.mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                await AudioManager.transcribeAudio(blob);
                stream.getTracks().forEach(track => track.stop());
            };
            
            AppState.mediaRecorder.start();
            AppState.isRecording = true;
            
            // Update UI
            document.getElementById('start-recording').disabled = true;
            document.getElementById('stop-recording').disabled = false;
            document.getElementById('recording-status').textContent = 'Recording... Click stop when finished';
            
            Logger.info('Recording started');
            NotificationSystem.success('Recording started');
            
        } catch (error) {
            Logger.error(`Recording start error: ${error.message}`);
            NotificationSystem.error('Failed to start recording');
        }
    },
    
    stopRecording: () => {
        if (AppState.mediaRecorder && AppState.isRecording) {
            AppState.mediaRecorder.stop();
            AppState.isRecording = false;
            
            // Update UI
            document.getElementById('start-recording').disabled = false;
            document.getElementById('stop-recording').disabled = true;
            document.getElementById('recording-status').textContent = 'Processing...';
            
            Logger.info('Recording stopped');
        }
    },
    
    transcribeAudio: async (audioBlob) => {
        try {
            Logger.info('Transcribing audio');
            const result = await APIManager.transcribeAudio(audioBlob);
            
            document.getElementById('transcription-result').innerHTML = `
                <div style="color: var(--text-primary); padding: 1rem; background: var(--bg-secondary); border-radius: 0.5rem;">
                    ${result.transcript}
                </div>
            `;
            
            document.getElementById('recording-status').textContent = 'Transcription complete';
            
            Logger.info('Audio transcribed successfully');
            NotificationSystem.success('Audio transcribed');
            
        } catch (error) {
            Logger.error(`Transcription error: ${error.message}`);
            NotificationSystem.error('Failed to transcribe audio');
            document.getElementById('recording-status').textContent = 'Transcription failed';
        }
    },
    
    synthesizeSpeech: async () => {
        const text = document.getElementById('tts-text').value.trim();
        if (!text) return;
        
        try {
            Logger.info('Synthesizing speech');
            document.getElementById('audio-player').innerHTML = '<div class="no-data">Generating audio...</div>';
            
            const result = await APIManager.synthesizeSpeech(text);
            
            if (result.audio_url) {
                document.getElementById('audio-player').innerHTML = `
                    <audio controls style="width: 100%;">
                        <source src="${result.audio_url}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                `;
            } else {
                throw new Error('No audio URL returned');
            }
            
            Logger.info('Speech synthesized successfully');
            NotificationSystem.success('Speech generated');
            
        } catch (error) {
            Logger.error(`Speech synthesis error: ${error.message}`);
            NotificationSystem.error('Failed to generate speech');
            document.getElementById('audio-player').innerHTML = '<div class="no-data">Speech generation failed</div>';
        }
    },
    
    uploadAudio: () => {
        document.getElementById('audio-file-input').click();
    }
};

// Logs Manager
const LogsManager = {
    updateDisplay: () => {
        const container = document.getElementById('logs-content');
        const levelFilter = document.getElementById('log-level').value;
        
        const filteredLogs = AppState.logs.filter(log => 
            levelFilter === 'all' || log.level === levelFilter
        );
        
        container.innerHTML = filteredLogs.map(log => `
            <div class="log-entry">
                <span class="log-timestamp">[${log.timestamp}]</span>
                <span class="log-level ${log.level}">${log.level.toUpperCase()}</span>
                <span class="log-message">${log.message}</span>
            </div>
        `).join('');
        
        container.scrollTop = container.scrollHeight;
    },
    
    clear: () => {
        AppState.logs = [];
        LogsManager.updateDisplay();
        Logger.info('Logs cleared');
    },
    
    export: () => {
        const dataStr = JSON.stringify(AppState.logs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `cbt-ai-logs-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        Logger.info('Logs exported');
        NotificationSystem.success('Logs exported successfully');
    }
};

// Status Manager
const StatusManager = {
    checkConnection: async () => {
        try {
            const response = await fetch(`${AppState.serverUrl}/blobs`, { method: 'HEAD' });
            AppState.isConnected = response.ok;
        } catch {
            AppState.isConnected = false;
        }
        
        const statusDot = document.getElementById('server-status');
        const statusText = document.getElementById('connection-status');
        
        if (AppState.isConnected) {
            statusDot.style.background = 'var(--success-color)';
            statusText.textContent = 'Connected';
        } else {
            statusDot.style.background = 'var(--error-color)';
            statusText.textContent = 'Disconnected';
        }
    },
    
    updateStats: () => {
        const uptime = Date.now() - AppState.sessionStart;
        document.getElementById('uptime').textContent = Utils.formatDuration(uptime);
        document.getElementById('request-count').textContent = AppState.requestCount;
        document.getElementById('memory-usage').textContent = `${Math.round(performance.memory?.usedJSHeapSize / 1024 / 1024 || 0)}MB`;
        
        // Session stats
        document.getElementById('messages-count').textContent = AppState.messageCount;
        document.getElementById('session-duration').textContent = Utils.formatDuration(uptime);
        document.getElementById('dominant-mood').textContent = AppState.currentMood;
    }
};

// Tab Manager
const TabManager = {
    switchTo: (tabName) => {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab content
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Add active class to selected tab button
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        AppState.currentTab = tabName;
        Logger.info(`Switched to ${tabName} tab`);
        
        // Tab-specific initialization
        if (tabName === 'analysis') {
            AnalysisManager.refresh();
        } else if (tabName === 'logs') {
            LogsManager.updateDisplay();
        }
    }
};

// Initialize the application
function initializeApp() {
    Logger.info('Initializing CBT AI Technical Interface');
    
    // Set initial timestamps
    const now = new Date();
    document.getElementById('init-timestamp').textContent = Utils.formatTime(now);
    document.getElementById('log-init-time').textContent = now.toISOString();
    
    // Setup event listeners
    setupEventListeners();
    
    // Start status monitoring
    StatusManager.checkConnection();
    setInterval(StatusManager.checkConnection, 5000);
    setInterval(StatusManager.updateStats, 1000);
    
    // Setup function status indicators
    setupFunctionStatusMonitoring();
    
    Logger.info('Application initialized successfully');
    NotificationSystem.success('CBT AI Technical Interface ready');
}

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            TabManager.switchTo(btn.dataset.tab);
        });
    });
    
    // Chat functionality
    document.getElementById('send-message-btn').addEventListener('click', () => {
        const input = document.getElementById('chat-input');
        ChatManager.sendMessage(input.value);
    });
    
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const input = document.getElementById('chat-input');
            ChatManager.sendMessage(input.value);
        }
    });
    
    document.getElementById('voice-input-btn').addEventListener('click', () => {
        // Switch to audio tab and start recording
        TabManager.switchTo('audio');
        AudioManager.startRecording();
    });
    
    document.getElementById('clear-chat').addEventListener('click', ChatManager.clear);
    document.getElementById('export-chat').addEventListener('click', ChatManager.export);
    
    // Analysis functionality
    document.getElementById('refresh-analysis').addEventListener('click', AnalysisManager.refresh);
    
    // Facial analysis functionality
    document.getElementById('start-camera').addEventListener('click', FaceManager.startCamera);
    document.getElementById('stop-camera').addEventListener('click', FaceManager.stopCamera);
    document.getElementById('take-snapshot').addEventListener('click', FaceManager.takeSnapshot);
    
    // Audio functionality
    document.getElementById('start-recording').addEventListener('click', AudioManager.startRecording);
    document.getElementById('stop-recording').addEventListener('click', AudioManager.stopRecording);
    document.getElementById('upload-audio').addEventListener('click', AudioManager.uploadAudio);
    document.getElementById('synthesize-speech').addEventListener('click', AudioManager.synthesizeSpeech);
    
    document.getElementById('audio-file-input').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            await AudioManager.transcribeAudio(file);
        }
    });
    
    // Logs functionality
    document.getElementById('clear-logs').addEventListener('click', LogsManager.clear);
    document.getElementById('export-logs').addEventListener('click', LogsManager.export);
    document.getElementById('log-level').addEventListener('change', LogsManager.updateDisplay);
    
    // Function item click handlers
    document.querySelectorAll('.function-item').forEach(item => {
        item.addEventListener('click', () => {
            const endpoint = item.dataset.endpoint;
            if (endpoint) {
                Logger.info(`Function clicked: ${item.querySelector('.function-name').textContent}`);
                NotificationSystem.info(`Function: ${item.querySelector('.function-name').textContent}`);
            }
        });
    });
}

function setupFunctionStatusMonitoring() {
    // Monitor function availability
    const checkFunctionStatus = Utils.debounce(async () => {
        const functions = [
            { name: 'chat_with_llm', endpoint: '/chat' },
            { name: 'get_blobs_data', endpoint: '/blobs' },
            { name: 'transcribe_audio', endpoint: '/transcribe' },
            { name: 'synthesize_speech', endpoint: '/speak' },
            { name: 'analyze_face', endpoint: '/analyze-face' }
        ];
        
        for (const func of functions) {
            try {
                const response = await fetch(`${AppState.serverUrl}${func.endpoint}`, { method: 'HEAD' });
                const item = document.querySelector(`.function-item[data-endpoint="${func.endpoint}"]`);
                if (item) {
                    const status = item.querySelector('.function-status');
                    if (response.ok) {
                        status.className = 'function-status active';
                        status.textContent = '✓';
                    } else {
                        status.className = 'function-status inactive';
                        status.textContent = '✗';
                    }
                }
            } catch {
                const item = document.querySelector(`.function-item[data-endpoint="${func.endpoint}"]`);
                if (item) {
                    const status = item.querySelector('.function-status');
                    status.className = 'function-status inactive';
                    status.textContent = '✗';
                }
            }
        }
    }, 2000);
    
    // Check initially and then periodically
    checkFunctionStatus();
    setInterval(checkFunctionStatus, 10000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export for debugging
window.CBTApp = {
    AppState,
    ChatManager,
    AnalysisManager,
    FaceManager,
    AudioManager,
    Logger,
    NotificationSystem
};
