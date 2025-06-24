/**
 * CRITICAL FIX: Layout Coordinator Service
 * 
 * Centralized layout state management system to prevent conflicts between:
 * - Keyboard transitions in ChatFlow07
 * - Blob color morphing in EmotionalUrgencyBlob
 * - Orb transitions in OrbContainer
 * 
 * Provides transaction-based coordination and conflict detection
 */

class LayoutCoordinator {
	constructor() {
		// Active transition tracking
		this.activeTransitions = new Map();
		this.transitionQueue = [];
		this.globalTransitionState = {
			isTransitioning: false,
			activeComponents: [],
			conflictDetected: false
		};

		// Component registration system
		this.registeredComponents = new Map();
		this.componentStates = new Map();

		// Event system for coordination
		this.eventListeners = new Map();
		
		// Performance monitoring
		this.performanceMetrics = {
			transitionCount: 0,
			conflictsDetected: 0,
			averageTransitionTime: 0,
			lastFrameTime: 0
		};

		// Bind methods for proper context
		this.registerComponent = this.registerComponent.bind(this);
		this.unregisterComponent = this.unregisterComponent.bind(this);
		this.requestTransition = this.requestTransition.bind(this);
		this.completeTransition = this.completeTransition.bind(this);
		this.detectConflicts = this.detectConflicts.bind(this);
	}

	/**
	 * Register a component for coordination
	 * @param {string} componentId - Unique identifier for the component
	 * @param {string} componentType - Type: 'keyboard', 'blob', 'orb'
	 * @param {object} config - Configuration options
	 */
	registerComponent(componentId, componentType, config = {}) {
		console.log(`[LayoutCoordinator] Registering ${componentType} component: ${componentId}`);
		
		this.registeredComponents.set(componentId, {
			type: componentType,
			priority: config.priority || this.getDefaultPriority(componentType),
			canInterrupt: config.canInterrupt || false,
			maxDuration: config.maxDuration || 1000,
			registeredAt: Date.now()
		});

		this.componentStates.set(componentId, {
			isTransitioning: false,
			lastTransition: null,
			transitionCount: 0
		});

		this.eventListeners.set(componentId, new Set());
		
		return {
			requestTransition: (options) => this.requestTransition(componentId, options),
			completeTransition: () => this.completeTransition(componentId),
			addEventListener: (event, callback) => this.addEventListener(componentId, event, callback),
			removeEventListener: (event, callback) => this.removeEventListener(componentId, event, callback)
		};
	}

	/**
	 * Unregister a component
	 * @param {string} componentId - Component to unregister
	 */
	unregisterComponent(componentId) {
		console.log(`[LayoutCoordinator] Unregistering component: ${componentId}`);
		
		// Complete any active transitions for this component
		if (this.activeTransitions.has(componentId)) {
			this.completeTransition(componentId);
		}

		this.registeredComponents.delete(componentId);
		this.componentStates.delete(componentId);
		this.eventListeners.delete(componentId);
	}

	/**
	 * Request a transition with conflict detection
	 * @param {string} componentId - Component requesting transition
	 * @param {object} options - Transition options
	 */
	async requestTransition(componentId, options = {}) {
		const startTime = performance.now();
		
		const transitionRequest = {
			componentId,
			type: options.type || 'generic',
			duration: options.duration || 500,
			priority: options.priority || this.registeredComponents.get(componentId)?.priority || 1,
			canInterrupt: options.canInterrupt || false,
			requestedAt: Date.now(),
			startTime
		};

		console.log(`[LayoutCoordinator] Transition requested by ${componentId}:`, transitionRequest);

		// Detect conflicts with active transitions
		const conflicts = this.detectConflicts(transitionRequest);
		
		if (conflicts.length > 0) {
			console.warn(`[LayoutCoordinator] Conflicts detected for ${componentId}:`, conflicts);
			this.performanceMetrics.conflictsDetected++;
			
			const resolution = await this.resolveConflicts(transitionRequest, conflicts);
			if (!resolution.allowed) {
				console.log(`[LayoutCoordinator] Transition denied for ${componentId}:`, resolution.reason);
				return false;
			}
		}

		// Add to transition queue or execute immediately
		if (this.shouldQueue(transitionRequest)) {
			this.transitionQueue.push(transitionRequest);
			console.log(`[LayoutCoordinator] Transition queued for ${componentId}. Queue length: ${this.transitionQueue.length}`);
			return this.processQueue();
		} else {
			return this.executeTransition(transitionRequest);
		}
	}

	/**
	 * Complete a transition and update state
	 * @param {string} componentId - Component completing transition
	 */
	completeTransition(componentId) {
		const endTime = performance.now();
		const transition = this.activeTransitions.get(componentId);
		
		if (transition) {
			const duration = endTime - transition.startTime;
			console.log(`[LayoutCoordinator] Transition completed by ${componentId} in ${duration.toFixed(2)}ms`);
			
			// Update performance metrics
			this.performanceMetrics.transitionCount++;
			this.performanceMetrics.averageTransitionTime = 
				(this.performanceMetrics.averageTransitionTime * (this.performanceMetrics.transitionCount - 1) + duration) / 
				this.performanceMetrics.transitionCount;
			
			// Update component state
			const componentState = this.componentStates.get(componentId);
			if (componentState) {
				componentState.isTransitioning = false;
				componentState.lastTransition = transition;
				componentState.transitionCount++;
			}

			// Remove from active transitions
			this.activeTransitions.delete(componentId);
			
			// Update global state
			this.updateGlobalState();
			
			// Emit completion event
			this.emitEvent(componentId, 'transitionComplete', { 
				componentId, 
				duration,
				transition 
			});
			
			// Process next item in queue
			this.processQueue();
		}
	}

	/**
	 * Detect conflicts between transitions
	 * @param {object} newTransition - New transition request
	 * @returns {array} Array of conflicting transitions
	 */
	detectConflicts(newTransition) {
		const conflicts = [];
		const componentType = this.registeredComponents.get(newTransition.componentId)?.type;
		
		for (const [activeId, activeTransition] of this.activeTransitions) {
			const activeType = this.registeredComponents.get(activeId)?.type;
			
			// Define conflict rules based on component types
			const isConflicting = this.checkConflictRules(
				{ type: componentType, transition: newTransition },
				{ type: activeType, transition: activeTransition }
			);
			
			if (isConflicting) {
				conflicts.push({
					activeComponentId: activeId,
					activeType,
					conflictType: this.getConflictType(componentType, activeType),
					severity: this.getConflictSeverity(componentType, activeType)
				});
			}
		}
		
		return conflicts;
	}

	/**
	 * Check conflict rules between component types
	 * @param {object} newComponent - New component info
	 * @param {object} activeComponent - Active component info
	 * @returns {boolean} Whether components conflict
	 */
	checkConflictRules(newComponent, activeComponent) {
		const { type: newType } = newComponent;
		const { type: activeType } = activeComponent;
		
		// High-conflict combinations
		const highConflictPairs = [
			['keyboard', 'orb'],    // Keyboard transitions + orb changes
			['keyboard', 'blob'],   // Keyboard transitions + blob morphing
			['orb', 'blob']         // Orb transitions + blob morphing
		];
		
		return highConflictPairs.some(([type1, type2]) => 
			(newType === type1 && activeType === type2) ||
			(newType === type2 && activeType === type1)
		);
	}

	/**
	 * Resolve conflicts between transitions
	 * @param {object} newTransition - New transition request
	 * @param {array} conflicts - Array of conflicts
	 * @returns {object} Resolution decision
	 */
	async resolveConflicts(newTransition, conflicts) {
		const newPriority = newTransition.priority;
		const canInterrupt = newTransition.canInterrupt;
		
		// Sort conflicts by severity
		conflicts.sort((a, b) => b.severity - a.severity);
		
		for (const conflict of conflicts) {
			const activeTransition = this.activeTransitions.get(conflict.activeComponentId);
			const activePriority = activeTransition?.priority || 1;
			
			// Priority-based resolution
			if (newPriority > activePriority && canInterrupt) {
				console.log(`[LayoutCoordinator] Interrupting lower priority transition: ${conflict.activeComponentId}`);
				await this.interruptTransition(conflict.activeComponentId);
				continue;
			}
			
			// High severity conflicts - deny new transition
			if (conflict.severity >= 8) {
				return {
					allowed: false,
					reason: `High severity conflict with ${conflict.activeComponentId}`,
					conflictType: conflict.conflictType
				};
			}
			
			// Medium severity - coordinate timing
			if (conflict.severity >= 5) {
				const delay = this.calculateCoordinationDelay(newTransition, activeTransition);
				if (delay > 0) {
					console.log(`[LayoutCoordinator] Coordinating transition timing. Delay: ${delay}ms`);
					await new Promise(resolve => setTimeout(resolve, delay));
				}
			}
		}
		
		return { allowed: true, reason: 'Conflicts resolved' };
	}

	/**
	 * Execute a transition immediately
	 * @param {object} transitionRequest - Transition to execute
	 * @returns {boolean} Success status
	 */
	async executeTransition(transitionRequest) {
		const { componentId } = transitionRequest;
		
		// Add to active transitions
		this.activeTransitions.set(componentId, transitionRequest);
		
		// Update component state
		const componentState = this.componentStates.get(componentId);
		if (componentState) {
			componentState.isTransitioning = true;
		}
		
		// Update global state
		this.updateGlobalState();
		
		// Emit start event
		this.emitEvent(componentId, 'transitionStart', { 
			componentId, 
			transition: transitionRequest 
		});
		
		console.log(`[LayoutCoordinator] Transition executing for ${componentId}`);
		return true;
	}

	/**
	 * Process the transition queue
	 */
	async processQueue() {
		if (this.transitionQueue.length === 0) {
			return;
		}
		
		// Get next transition that can execute
		const nextIndex = this.transitionQueue.findIndex(transition => {
			const conflicts = this.detectConflicts(transition);
			return conflicts.length === 0 || conflicts.every(c => c.severity < 5);
		});
		
		if (nextIndex !== -1) {
			const nextTransition = this.transitionQueue.splice(nextIndex, 1)[0];
			await this.executeTransition(nextTransition);
		}
	}

	/**
	 * Get default priority for component type
	 * @param {string} componentType - Component type
	 * @returns {number} Default priority
	 */
	getDefaultPriority(componentType) {
		const priorities = {
			keyboard: 10,  // Highest priority - affects user interaction
			blob: 5,       // Medium priority - visual feedback
			orb: 3         // Lower priority - ambient effects
		};
		return priorities[componentType] || 1;
	}

	/**
	 * Get conflict type between component types
	 * @param {string} type1 - First component type
	 * @param {string} type2 - Second component type
	 * @returns {string} Conflict type
	 */
	getConflictType(type1, type2) {
		const pair = [type1, type2].sort().join('-');
		const conflictTypes = {
			'blob-keyboard': 'layout-visual',
			'keyboard-orb': 'layout-ambient',
			'blob-orb': 'visual-ambient'
		};
		return conflictTypes[pair] || 'generic';
	}

	/**
	 * Get conflict severity (1-10 scale)
	 * @param {string} type1 - First component type
	 * @param {string} type2 - Second component type
	 * @returns {number} Severity level
	 */
	getConflictSeverity(type1, type2) {
		const severities = {
			'keyboard-blob': 8,   // High - layout conflicts with visual feedback
			'keyboard-orb': 6,    // Medium - layout conflicts with ambient
			'blob-orb': 4         // Low - visual conflicts manageable
		};
		const pair = [type1, type2].sort().join('-');
		return severities[pair] || 2;
	}

	/**
	 * Calculate coordination delay between transitions
	 * @param {object} newTransition - New transition
	 * @param {object} activeTransition - Active transition
	 * @returns {number} Delay in milliseconds
	 */
	calculateCoordinationDelay(newTransition, activeTransition) {
		const activeRemaining = Math.max(0, 
			activeTransition.duration - (Date.now() - activeTransition.requestedAt)
		);
		return Math.min(activeRemaining, 200); // Max 200ms delay
	}

	/**
	 * Interrupt an active transition
	 * @param {string} componentId - Component to interrupt
	 */
	async interruptTransition(componentId) {
		const transition = this.activeTransitions.get(componentId);
		if (transition) {
			console.log(`[LayoutCoordinator] Interrupting transition for ${componentId}`);
			
			// Emit interruption event
			this.emitEvent(componentId, 'transitionInterrupted', { 
				componentId, 
				transition 
			});
			
			// Force completion
			this.completeTransition(componentId);
		}
	}

	/**
	 * Determine if transition should be queued
	 * @param {object} transitionRequest - Transition to check
	 * @returns {boolean} Whether to queue
	 */
	shouldQueue(transitionRequest) {
		const conflicts = this.detectConflicts(transitionRequest);
		const highSeverityConflicts = conflicts.filter(c => c.severity >= 8);
		return highSeverityConflicts.length > 0;
	}

	/**
	 * Update global transition state
	 */
	updateGlobalState() {
		this.globalTransitionState = {
			isTransitioning: this.activeTransitions.size > 0,
			activeComponents: Array.from(this.activeTransitions.keys()),
			conflictDetected: this.activeTransitions.size > 1
		};
	}

	/**
	 * Event system methods
	 */
	addEventListener(componentId, event, callback) {
		const listeners = this.eventListeners.get(componentId);
		if (listeners) {
			listeners.add({ event, callback });
		}
	}

	removeEventListener(componentId, event, callback) {
		const listeners = this.eventListeners.get(componentId);
		if (listeners) {
			listeners.delete({ event, callback });
		}
	}

	emitEvent(componentId, event, data) {
		const listeners = this.eventListeners.get(componentId);
		if (listeners) {
			listeners.forEach(listener => {
				if (listener.event === event) {
					try {
						listener.callback(data);
					} catch (error) {
						console.error(`[LayoutCoordinator] Event callback error:`, error);
					}
				}
			});
		}
	}

	/**
	 * Get current state for debugging
	 * @returns {object} Current coordinator state
	 */
	getState() {
		return {
			activeTransitions: Object.fromEntries(this.activeTransitions),
			queueLength: this.transitionQueue.length,
			globalState: this.globalTransitionState,
			performanceMetrics: { ...this.performanceMetrics },
			registeredComponents: Object.fromEntries(this.registeredComponents)
		};
	}

	/**
	 * Reset coordinator state (for testing)
	 */
	reset() {
		this.activeTransitions.clear();
		this.transitionQueue = [];
		this.globalTransitionState = {
			isTransitioning: false,
			activeComponents: [],
			conflictDetected: false
		};
		this.performanceMetrics = {
			transitionCount: 0,
			conflictsDetected: 0,
			averageTransitionTime: 0,
			lastFrameTime: 0
		};
	}
}

// Create singleton instance
const layoutCoordinator = new LayoutCoordinator();

// Global debugging access
if (typeof window !== 'undefined') {
	window.layoutCoordinator = layoutCoordinator;
}

export default layoutCoordinator;