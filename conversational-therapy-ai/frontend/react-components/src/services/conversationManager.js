/**
 * Enhanced Conversation Manager for Chat Perfect Integration
 * Manages message threading, conversation history, and emotional journey tracking
 */

class ConversationManager {
  constructor() {
    this.threads = new Map();
    this.currentThread = null;
    this.messageHistory = [];
    this.conversationSessions = [];
    this.currentSessionId = null;
    this.maxThreadLength = 20;
    this.maxHistoryLength = 100;
  }

  /**
   * Generates a unique thread ID
   */
  generateThreadId() {
    return `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generates a unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Starts a new conversation session
   */
  startNewSession() {
    const sessionId = this.generateSessionId();
    const session = {
      id: sessionId,
      startTime: Date.now(),
      threads: [],
      emotionalJourney: [],
      totalMessages: 0,
      isActive: true
    };

    this.conversationSessions.push(session);
    this.currentSessionId = sessionId;
    
    console.log(`🆕 New conversation session started: ${sessionId}`);
    return session;
  }

  /**
   * Creates a new message thread
   */
  createThread(initialMessage, context = {}) {
    const threadId = this.generateThreadId();
    
    console.log(`🔄 DEBUG: Creating thread ${threadId}, current threads: ${this.threads.size}`);
    
    // Ensure we have an active session
    if (!this.currentSessionId) {
      console.log(`🆕 DEBUG: No active session, creating new one`);
      this.startNewSession();
    }

    const thread = {
      id: threadId,
      sessionId: this.currentSessionId,
      messages: [],
      context: {
        topic: context.topic || 'general',
        emotionalTone: context.emotionalTone || 'neutral',
        urgencyLevel: context.urgencyLevel || 'none',
        ...context
      },
      emotionalJourney: [],
      createdAt: Date.now(),
      lastActivity: Date.now(),
      isActive: true,
      messageCount: 0
    };

    // CRITICAL: Store thread in Map BEFORE any operations
    this.threads.set(threadId, thread);
    this.currentThread = threadId;
    
    console.log(`✅ DEBUG: Thread ${threadId} stored in Map, Map size: ${this.threads.size}`);

    // Add initial message if provided (AFTER thread is in Map)
    if (initialMessage) {
      console.log(`📝 DEBUG: Adding initial message to thread ${threadId}`);
      this.addMessageToThread(threadId, initialMessage);
    }

    // Add thread to current session
    const currentSession = this.getCurrentSession();
    if (currentSession) {
      currentSession.threads.push(threadId);
      console.log(`🔗 DEBUG: Thread ${threadId} added to session ${this.currentSessionId}`);
    }

    console.log(`💬 New thread created: ${threadId}`);
    return thread;
  }

  /**
   * Adds a message to a specific thread
   */
  addMessageToThread(threadId, message, emotionalAnalysis = null) {
    console.log(`🔍 DEBUG: Looking for thread ${threadId}, Map has ${this.threads.size} threads`);
    console.log(`🗂️ DEBUG: Available thread IDs:`, Array.from(this.threads.keys()));
    
    const thread = this.threads.get(threadId);
    if (!thread) {
      console.error(`🚨 RACE CONDITION: Thread ${threadId} not found in Map!`);
      console.error(`🚨 Current threads:`, Array.from(this.threads.keys()));
      console.error(`🚨 Current thread:`, this.currentThread);
      console.error(`🚨 Map size:`, this.threads.size);
      return null;
    }
    
    console.log(`✅ DEBUG: Thread ${threadId} found successfully`);

    // Ensure message has required fields
    const enhancedMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: message.text || message,
      type: message.type || 'user',
      timestamp: message.timestamp || Date.now(),
      threadId: threadId,
      sessionId: thread.sessionId,
      threadPosition: thread.messages.length + 1,
      isFirstInThread: thread.messages.length === 0,
      emotionalState: message.emotionalState || null,
      facialExpression: message.facialExpression || null,
      isSegment: message.isSegment || false,
      segmentIndex: message.segmentIndex || 0,
      ...message
    };

    // Add to thread
    thread.messages.push(enhancedMessage);
    thread.messageCount++;
    thread.lastActivity = Date.now();

    // Add to global message history
    this.messageHistory.push(enhancedMessage);

    // Validate message persistence
    const isPersisted = this.messageHistory.includes(enhancedMessage);
    if (!isPersisted) {
      console.error(`🚨 Message persistence failed for thread ${threadId}`);
      return null;
    }

    // Add emotional analysis to journey if provided
    if (emotionalAnalysis) {
      thread.emotionalJourney.push({
        messageId: enhancedMessage.id,
        analysis: emotionalAnalysis,
        timestamp: Date.now()
      });

      // Update thread context based on emotional analysis
      this.updateThreadContext(thread, emotionalAnalysis);
    }

    // Update session stats
    const currentSession = this.getCurrentSession();
    if (currentSession) {
      currentSession.totalMessages++;
      currentSession.emotionalJourney.push({
        threadId: threadId,
        messageId: enhancedMessage.id,
        emotionalState: enhancedMessage.emotionalState,
        timestamp: Date.now()
      });
    }

    // Cleanup old data if needed
    this.performCleanup();

    console.log(`📝 Message added to thread ${threadId}: ${enhancedMessage.text.substring(0, 50)}...`);
    return enhancedMessage;
  }

  /**
   * Updates thread context based on emotional analysis
   */
  updateThreadContext(thread, emotionalAnalysis) {
    if (!emotionalAnalysis) return;

    // Update emotional tone based on latest analysis
    if (emotionalAnalysis.emotionType && emotionalAnalysis.emotionType !== 'neutral') {
      thread.context.emotionalTone = emotionalAnalysis.emotionType;
    }

    // Update urgency level
    if (emotionalAnalysis.urgencyLevel) {
      thread.context.urgencyLevel = emotionalAnalysis.urgencyLevel;
    }

    // Analyze patterns in emotional journey
    if (thread.emotionalJourney.length > 2) {
      const recentEmotions = thread.emotionalJourney.slice(-3);
      const isEscalating = this.detectEmotionalEscalation(recentEmotions);
      
      if (isEscalating) {
        thread.context.isEscalating = true;
        thread.context.escalationDetectedAt = Date.now();
      }
    }
  }

  /**
   * Detects emotional escalation in recent messages
   */
  detectEmotionalEscalation(emotionalJourney) {
    if (emotionalJourney.length < 2) return false;

    const urgencyLevels = ['none', 'low', 'medium', 'high', 'critical'];
    const recent = emotionalJourney.slice(-2);
    
    for (let i = 1; i < recent.length; i++) {
      const prevUrgency = urgencyLevels.indexOf(recent[i-1].analysis.urgencyLevel);
      const currentUrgency = urgencyLevels.indexOf(recent[i].analysis.urgencyLevel);
      
      if (currentUrgency > prevUrgency && currentUrgency >= 2) { // medium or higher
        return true;
      }
    }

    return false;
  }

  /**
   * Gets the current active thread
   */
  getCurrentThread() {
    return this.currentThread ? this.threads.get(this.currentThread) : null;
  }

  /**
   * Gets the current thread ID
   */
  getCurrentThreadId() {
    return this.currentThread;
  }

  /**
   * Gets the current active session
   */
  getCurrentSession() {
    return this.conversationSessions.find(session => session.id === this.currentSessionId);
  }

  /**
   * Gets all messages for a specific thread
   */
  getThreadMessages(threadId) {
    const thread = this.threads.get(threadId);
    return thread ? thread.messages : [];
  }

  /**
   * Gets recent messages across all threads
   */
  getRecentMessages(limit = 10) {
    return this.messageHistory
      .slice(-limit)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Switches to a different thread
   */
  switchToThread(threadId) {
    if (this.threads.has(threadId)) {
      this.currentThread = threadId;
      const thread = this.threads.get(threadId);
      thread.lastActivity = Date.now();
      console.log(`🔄 Switched to thread: ${threadId}`);
      return thread;
    }
    return null;
  }

  /**
   * Ends the current thread
   */
  endCurrentThread() {
    if (this.currentThread) {
      const thread = this.threads.get(this.currentThread);
      if (thread) {
        thread.isActive = false;
        thread.endedAt = Date.now();
        console.log(`🏁 Thread ended: ${this.currentThread}`);
      }
      this.currentThread = null;
    }
  }

  /**
   * Searches messages by text content
   */
  searchMessages(query, limit = 20) {
    const lowercaseQuery = query.toLowerCase();
    
    return this.messageHistory
      .filter(message => 
        message.text.toLowerCase().includes(lowercaseQuery)
      )
      .slice(-limit)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Gets conversation analytics
   */
  getAnalytics() {
    const currentSession = this.getCurrentSession();
    
    return {
      totalSessions: this.conversationSessions.length,
      totalThreads: this.threads.size,
      totalMessages: this.messageHistory.length,
      currentSession: currentSession ? {
        id: currentSession.id,
        duration: Date.now() - currentSession.startTime,
        threadCount: currentSession.threads.length,
        messageCount: currentSession.totalMessages,
        emotionalJourneyLength: currentSession.emotionalJourney.length
      } : null,
      averageThreadLength: this.calculateAverageThreadLength(),
      emotionalDistribution: this.getEmotionalDistribution()
    };
  }

  /**
   * Calculates average thread length
   */
  calculateAverageThreadLength() {
    if (this.threads.size === 0) return 0;
    
    const totalMessages = Array.from(this.threads.values())
      .reduce((sum, thread) => sum + thread.messages.length, 0);
    
    return totalMessages / this.threads.size;
  }

  /**
   * Gets emotional distribution across all messages
   */
  getEmotionalDistribution() {
    const distribution = {};
    
    this.messageHistory.forEach(message => {
      if (message.emotionalState && message.emotionalState !== 'neutral') {
        distribution[message.emotionalState] = (distribution[message.emotionalState] || 0) + 1;
      }
    });
    
    return distribution;
  }

  /**
   * EMERGENCY FIX: DISABLED CLEANUP - Prevents active message deletion
   */
  performCleanup() {
  	console.log("🔥 EMERGENCY: Cleanup DISABLED to prevent message loss");
  	
  	// CRITICAL: DISABLE ALL CLEANUP during message operations
  	// Only cleanup if we have NO active threads AND excessive history
  	if (this.threads.size === 0 && this.messageHistory.length > (this.maxHistoryLength * 3)) {
  		console.log("🧹 Emergency cleanup: Only cleaning with no active threads and excessive history");
  		const removed = this.messageHistory.splice(0, this.messageHistory.length - this.maxHistoryLength);
  		console.log(`🧹 Emergency cleaned up ${removed.length} old messages`);
  	} else {
  		console.log(`🔒 Cleanup BLOCKED: ${this.threads.size} active threads, ${this.messageHistory.length} messages`);
  	}
 
  	// CRITICAL: NEVER cleanup active threads
  	console.log("🔒 Thread cleanup DISABLED to prevent active thread deletion");
  }

  /**
   * Exports conversation data
   */
  exportData() {
    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      sessions: this.conversationSessions,
      threads: Object.fromEntries(this.threads),
      messageHistory: this.messageHistory.slice(-50), // Last 50 messages
      analytics: this.getAnalytics()
    };
  }

  /**
   * Imports conversation data
   */
  importData(data) {
    try {
      if (data.sessions) {
        this.conversationSessions = data.sessions;
      }
      if (data.threads) {
        this.threads = new Map(Object.entries(data.threads));
      }
      if (data.messageHistory) {
        this.messageHistory = data.messageHistory;
      }
      
      console.log('📥 Conversation data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to import conversation data:', error);
      return false;
    }
  }

  /**
   * Resets all conversation data
   */
  reset() {
    this.threads.clear();
    this.currentThread = null;
    this.messageHistory = [];
    this.conversationSessions = [];
    this.currentSessionId = null;
    
    console.log('🔄 Conversation manager reset');
  }
}

// Singleton instance
const conversationManager = new ConversationManager();

export default conversationManager;
export { ConversationManager };