/**
 * Centralized Emotion State Manager
 * CRITICAL FIX: Prevents animation conflicts and ensures consistent emotion-to-color mapping
 */

class EmotionStateManager {
  constructor() {
    this.currentEmotion = 'neutral';
    this.intensity = 0.5;
    this.listeners = new Set();
    this.lastUpdate = Date.now();
    
    // CRITICAL FIX: Robust emotion-to-color mapping
    this.emotionColorMap = {
      'joy': { 
        primary: '#FFD700', 
        secondary: '#FFA500', 
        intensity: 0.8,
        animation: 'pulse'
      },
      'sadness': { 
        primary: '#4169E1', 
        secondary: '#1E90FF', 
        intensity: 0.6,
        animation: 'slow-wave'
      },
      'anger': { 
        primary: '#DC143C', 
        secondary: '#B22222', 
        intensity: 0.9,
        animation: 'aggressive-pulse'
      },
      'fear': { 
        primary: '#9370DB', 
        secondary: '#8A2BE2', 
        intensity: 0.7,
        animation: 'shiver'
      },
      'neutral': { 
        primary: '#87CEEB', 
        secondary: '#ADD8E6', 
        intensity: 0.4,
        animation: 'gentle-breath'
      },
      'surprise': {
        primary: '#FF6347',
        secondary: '#FF4500',
        intensity: 0.8,
        animation: 'burst'
      },
      'disgust': {
        primary: '#9ACD32',
        secondary: '#8FBC8F',
        intensity: 0.6,
        animation: 'recoil'
      }
    };
    
    console.log('🎭 EmotionStateManager initialized');
  }

  /**
   * CRITICAL FIX: Thread-safe emotion update with validation
   */
  updateEmotion(emotion, intensity = null, source = 'unknown') {
    try {
      // Validate emotion
      if (!this.emotionColorMap[emotion]) {
        console.warn(`🚨 Invalid emotion "${emotion}", defaulting to neutral`);
        emotion = 'neutral';
      }
      
      // Validate intensity
      if (intensity !== null) {
        intensity = Math.max(0, Math.min(1, intensity));
      } else {
        intensity = this.emotionColorMap[emotion].intensity;
      }
      
      // Prevent rapid updates (debounce)
      const now = Date.now();
      if (now - this.lastUpdate < 100 && this.currentEmotion === emotion) {
        return; // Skip update if too frequent
      }
      
      const previousEmotion = this.currentEmotion;
      this.currentEmotion = emotion;
      this.intensity = intensity;
      this.lastUpdate = now;
      
      console.log(`🎭 Emotion updated: ${previousEmotion} → ${emotion} (intensity: ${intensity.toFixed(2)}, source: ${source})`);
      
      // Notify all listeners
      this.notifyListeners();
      
    } catch (error) {
      console.error('🚨 Error updating emotion:', error);
      // Fallback to neutral
      this.currentEmotion = 'neutral';
      this.intensity = 0.4;
      this.notifyListeners();
    }
  }

  /**
   * Get current emotion state with colors and animation info
   */
  getCurrentState() {
    const emotionData = this.emotionColorMap[this.currentEmotion];
    return {
      emotion: this.currentEmotion,
      intensity: this.intensity,
      colors: {
        primary: emotionData.primary,
        secondary: emotionData.secondary
      },
      animation: emotionData.animation,
      timestamp: this.lastUpdate
    };
  }

  /**
   * CRITICAL FIX: Safe listener management
   */
  subscribe(callback, id = null) {
    if (typeof callback !== 'function') {
      console.error('🚨 EmotionStateManager: callback must be a function');
      return () => {};
    }
    
    const listener = { callback, id: id || Date.now() };
    this.listeners.add(listener);
    
    console.log(`🔗 Emotion listener subscribed (id: ${listener.id})`);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
      console.log(`🔌 Emotion listener unsubscribed (id: ${listener.id})`);
    };
  }

  /**
   * Notify all listeners with error handling
   */
  notifyListeners() {
    const currentState = this.getCurrentState();
    
    this.listeners.forEach(listener => {
      try {
        listener.callback(currentState);
      } catch (error) {
        console.error(`🚨 Error in emotion listener (id: ${listener.id}):`, error);
        // Remove broken listener
        this.listeners.delete(listener);
      }
    });
  }

  /**
   * Get emotion color by name
   */
  getEmotionColor(emotion) {
    const emotionData = this.emotionColorMap[emotion] || this.emotionColorMap['neutral'];
    return emotionData;
  }

  /**
   * Smooth transition to new emotion
   */
  transitionToEmotion(targetEmotion, duration = 1000, source = 'transition') {
    const startEmotion = this.currentEmotion;
    const startTime = Date.now();
    
    console.log(`🎭 Starting emotion transition: ${startEmotion} → ${targetEmotion} over ${duration}ms`);
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI);
      
      if (progress < 1) {
        // Continue transition
        requestAnimationFrame(animate);
      } else {
        // Transition complete
        this.updateEmotion(targetEmotion, null, source);
        console.log(`✅ Emotion transition completed: ${targetEmotion}`);
      }
    };
    
    animate();
  }

  /**
   * Reset to neutral emotion
   */
  reset() {
    console.log('🔄 Resetting emotion state to neutral');
    this.updateEmotion('neutral', 0.4, 'reset');
  }

  /**
   * Cleanup and dispose
   */
  dispose() {
    this.listeners.clear();
    console.log('🧹 EmotionStateManager disposed');
  }
}

// Singleton instance
const emotionStateManager = new EmotionStateManager();

export default emotionStateManager;
export { EmotionStateManager };