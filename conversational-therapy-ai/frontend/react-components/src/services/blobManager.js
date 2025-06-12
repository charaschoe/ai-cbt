/**
 * Blob Management System
 * Verwaltet alle Blob-Kategorien und deren dynamische Anpassung basierend auf Chat-Input
 */

import {
	categorizeEmotionalInput,
	analyzeEmotionalPatterns,
	BLOB_SIZES,
	BLOB_TYPES,
	EMOTIONAL_URGENCY_LEVELS,
} from "./emotionalCategorizer";

class BlobManager {
	constructor() {
		this.activeBlobs = new Map();
		this.conversationHistory = [];
		this.analysisHistory = [];
		this.blobConfigurations = new Map();
		this.lastUpdate = Date.now();

		// Initialisiere Standard-Blob-Konfigurationen
		this.initializeDefaultConfigurations();
	}

	/**
	 * Initialisiert Standard-Blob-Konfigurationen
	 */
	initializeDefaultConfigurations() {
		// Emotional Urgency Blob
		this.blobConfigurations.set("emotional_urgency", {
			type: BLOB_TYPES.EMOTIONAL_URGENCY,
			defaultSize: BLOB_SIZES.SMALL,
			position: { x: 710.33, y: 32 },
			isActive: false,
			lastTriggered: null,
			activationThreshold: 0.3,
			decayRate: 0.1, // Wie schnell der Blob kleiner wird
			maxLifetime: 30000, // 30 Sekunden maximale Lebensdauer
			priority: 10, // Höhere Zahl = höhere Priorität
		});

		// Anxiety Blob
		this.blobConfigurations.set("anxiety", {
			type: BLOB_TYPES.ANXIETY,
			defaultSize: BLOB_SIZES.SMALL,
			position: { x: 200, y: 100 },
			isActive: false,
			lastTriggered: null,
			activationThreshold: 0.4,
			decayRate: 0.08,
			maxLifetime: 25000,
			priority: 8,
		});

		// Joy Blob
		this.blobConfigurations.set("joy", {
			type: BLOB_TYPES.JOY,
			defaultSize: BLOB_SIZES.SMALL,
			position: { x: 100, y: 300 },
			isActive: false,
			lastTriggered: null,
			activationThreshold: 0.5,
			decayRate: 0.05,
			maxLifetime: 20000,
			priority: 5,
		});

		// Sadness Blob
		this.blobConfigurations.set("sadness", {
			type: BLOB_TYPES.SADNESS,
			defaultSize: BLOB_SIZES.SMALL,
			position: { x: 300, y: 200 },
			isActive: false,
			lastTriggered: null,
			activationThreshold: 0.4,
			decayRate: 0.12,
			maxLifetime: 35000,
			priority: 7,
		});

		// Anger Blob
		this.blobConfigurations.set("anger", {
			type: BLOB_TYPES.ANGER,
			defaultSize: BLOB_SIZES.SMALL,
			position: { x: 500, y: 150 },
			isActive: false,
			lastTriggered: null,
			activationThreshold: 0.3,
			decayRate: 0.15,
			maxLifetime: 20000,
			priority: 9,
		});

		// Fear Blob
		this.blobConfigurations.set("fear", {
			type: BLOB_TYPES.FEAR,
			defaultSize: BLOB_SIZES.SMALL,
			position: { x: 400, y: 400 },
			isActive: false,
			lastTriggered: null,
			activationThreshold: 0.35,
			decayRate: 0.18,
			maxLifetime: 25000,
			priority: 8,
		});
	}

	/**
	 * Verarbeitet neuen Chat-Input und aktualisiert Blobs
	 * @param {string} message - Neue Chat-Nachricht
	 * @param {string} sender - 'user' oder 'ai'
	 * @returns {Object} Aktualisierte Blob-Zustände
	 */
	processChatInput(message, sender = "user") {
		const timestamp = Date.now();

		// Füge zur Konversationshistorie hinzu
		this.conversationHistory.push({
			text: message,
			sender: sender,
			timestamp: timestamp,
		});

		// Analysiere emotionalen Input
		const analysis = categorizeEmotionalInput(message);
		this.analysisHistory.push(analysis);

		// Aktualisiere Blobs basierend auf Analyse
		this.updateBlobsFromAnalysis(analysis);

		// Führe Pattern-Analyse durch
		const patternAnalysis = analyzeEmotionalPatterns(
			this.conversationHistory
		);

		// Führe Blob-Decay durch (Blobs werden mit der Zeit kleiner)
		this.performBlobDecay();

		// Bereinige alte Einträge
		this.cleanup();

		this.lastUpdate = timestamp;

		return {
			analysis: analysis,
			patternAnalysis: patternAnalysis,
			activeBlobs: this.getActiveBlobStates(),
			blobConfigurations: Object.fromEntries(this.blobConfigurations),
			timestamp: timestamp,
		};
	}

	/**
	 * Aktualisiert Blobs basierend auf emotionaler Analyse
	 */
	updateBlobsFromAnalysis(analysis) {
		const { emotionType, urgencyLevel, confidence } = analysis;

		// Aktiviere primäre Emotion
		if (emotionType !== BLOB_TYPES.NEUTRAL && confidence > 0.2) {
			this.activateBlob(emotionType, urgencyLevel, confidence);
		}

		// Aktiviere emotional urgency blob wenn nötig
		if (urgencyLevel !== EMOTIONAL_URGENCY_LEVELS.NONE) {
			this.activateBlob("emotional_urgency", urgencyLevel, confidence);
		}

		// Spezielle Behandlung für kritische Situationen
		if (urgencyLevel === EMOTIONAL_URGENCY_LEVELS.CRITICAL) {
			this.handleCriticalUrgency(analysis);
		}
	}

	/**
	 * Aktiviert einen Blob mit bestimmten Parametern
	 */
	activateBlob(blobId, urgencyLevel, confidence) {
		const config = this.blobConfigurations.get(blobId);
		if (!config) return;

		const currentTime = Date.now();
		const intensity = this.calculateBlobIntensity(confidence, urgencyLevel);
		const size = this.calculateBlobSize(intensity, urgencyLevel);

		// Erstelle oder aktualisiere aktiven Blob
		this.activeBlobs.set(blobId, {
			id: blobId,
			type: config.type,
			size: size,
			urgencyLevel: urgencyLevel,
			intensity: intensity,
			confidence: confidence,
			position: config.position,
			activatedAt: currentTime,
			lastUpdated: currentTime,
			isVisible: true,
			animationIntensity: this.calculateAnimationIntensity(
				urgencyLevel,
				intensity
			),
			priority: config.priority,
		});

		// Aktualisiere Konfiguration
		config.isActive = true;
		config.lastTriggered = currentTime;
	}

	/**
	 * Berechnet Blob-Intensität basierend auf Confidence und Urgency
	 */
	calculateBlobIntensity(confidence, urgencyLevel) {
		const urgencyMultiplier = {
			[EMOTIONAL_URGENCY_LEVELS.NONE]: 0,
			[EMOTIONAL_URGENCY_LEVELS.LOW]: 1,
			[EMOTIONAL_URGENCY_LEVELS.MEDIUM]: 1.5,
			[EMOTIONAL_URGENCY_LEVELS.HIGH]: 2.5,
			[EMOTIONAL_URGENCY_LEVELS.CRITICAL]: 4,
		};

		return Math.min(confidence * (urgencyMultiplier[urgencyLevel] || 1), 1);
	}

	/**
	 * Berechnet Blob-Größe basierend auf Intensität und Urgency
	 */
	calculateBlobSize(intensity, urgencyLevel) {
		if (intensity < 0.2) return BLOB_SIZES.NONE;
		if (intensity < 0.4) return BLOB_SIZES.SMALL;
		if (intensity < 0.6) return BLOB_SIZES.MEDIUM;
		if (intensity < 0.8) return BLOB_SIZES.LARGE;
		return BLOB_SIZES.XLARGE;
	}

	/**
	 * Berechnet Animationsintensität
	 */
	calculateAnimationIntensity(urgencyLevel, intensity) {
		const baseIntensity = {
			[EMOTIONAL_URGENCY_LEVELS.NONE]: 0,
			[EMOTIONAL_URGENCY_LEVELS.LOW]: 1,
			[EMOTIONAL_URGENCY_LEVELS.MEDIUM]: 1.5,
			[EMOTIONAL_URGENCY_LEVELS.HIGH]: 2.5,
			[EMOTIONAL_URGENCY_LEVELS.CRITICAL]: 4,
		};

		return (baseIntensity[urgencyLevel] || 1) * intensity;
	}

	/**
	 * Behandelt kritische Dringlichkeit mit speziellen Aktionen
	 */
	handleCriticalUrgency(analysis) {
		// Aktiviere alle emotionsbezogenen Blobs mit erhöhter Intensität
		for (const [blobId, config] of this.blobConfigurations) {
			if (blobId !== "emotional_urgency") {
				this.activateBlob(blobId, EMOTIONAL_URGENCY_LEVELS.HIGH, 0.8);
			}
		}

		// Protokolliere kritische Situation
		console.warn("CRITICAL EMOTIONAL URGENCY DETECTED:", analysis);

		// Hier könnten weitere Aktionen eingefügt werden:
		// - Benachrichtigungen
		// - Automatische Hilfe-Ressourcen
		// - Notfall-Kontakte
	}

	/**
	 * Führt Blob-Decay durch (Blobs werden mit der Zeit schwächer)
	 */
	performBlobDecay() {
		const currentTime = Date.now();

		for (const [blobId, blob] of this.activeBlobs) {
			const config = this.blobConfigurations.get(blobId);
			if (!config) continue;

			const age = currentTime - blob.lastUpdated;
			const maxAge = config.maxLifetime;

			if (age > maxAge) {
				// Blob ist zu alt, entfernen
				this.activeBlobs.delete(blobId);
				config.isActive = false;
				continue;
			}

			// Reduziere Intensität über Zeit
			const decayFactor = 1 - config.decayRate * (age / 1000);
			blob.intensity *= Math.max(decayFactor, 0.1);

			// Aktualisiere Größe basierend auf neuer Intensität
			blob.size = this.calculateBlobSize(
				blob.intensity,
				blob.urgencyLevel
			);
			blob.animationIntensity = this.calculateAnimationIntensity(
				blob.urgencyLevel,
				blob.intensity
			);

			// Entferne Blob wenn Intensität zu niedrig
			if (blob.intensity < 0.1) {
				this.activeBlobs.delete(blobId);
				config.isActive = false;
			}
		}
	}

	/**
	 * Bereinigt alte Einträge
	 */
	cleanup() {
		const maxHistoryLength = 100;
		const maxAge = 300000; // 5 Minuten
		const currentTime = Date.now();

		// Bereinige Konversationshistorie
		if (this.conversationHistory.length > maxHistoryLength) {
			this.conversationHistory = this.conversationHistory.slice(
				-maxHistoryLength
			);
		}

		// Bereinige Analysehistorie
		this.analysisHistory = this.analysisHistory.filter(
			(analysis) =>
				currentTime - new Date(analysis.timestamp).getTime() < maxAge
		);
	}

	/**
	 * Gibt aktuelle Blob-Zustände zurück
	 */
	getActiveBlobStates() {
		return Array.from(this.activeBlobs.values()).sort(
			(a, b) => b.priority - a.priority
		);
	}

	/**
	 * Fügt eine neue Blob-Konfiguration hinzu
	 */
	addBlobConfiguration(id, config) {
		this.blobConfigurations.set(id, {
			type: config.type || BLOB_TYPES.NEUTRAL,
			defaultSize: config.defaultSize || BLOB_SIZES.SMALL,
			position: config.position || { x: 0, y: 0 },
			isActive: false,
			lastTriggered: null,
			activationThreshold: config.activationThreshold || 0.3,
			decayRate: config.decayRate || 0.1,
			maxLifetime: config.maxLifetime || 30000,
			priority: config.priority || 1,
			...config,
		});
	}

	/**
	 * Exportiert aktuelle Zustände für Debugging
	 */
	exportState() {
		return {
			activeBlobs: Object.fromEntries(this.activeBlobs),
			blobConfigurations: Object.fromEntries(this.blobConfigurations),
			conversationHistory: this.conversationHistory.slice(-10), // Letzte 10 Nachrichten
			analysisHistory: this.analysisHistory.slice(-10),
			lastUpdate: this.lastUpdate,
			timestamp: Date.now(),
		};
	}

	/**
	 * Lädt Zustand aus exportierten Daten
	 */
	importState(state) {
		if (state.activeBlobs) {
			this.activeBlobs = new Map(Object.entries(state.activeBlobs));
		}
		if (state.blobConfigurations) {
			this.blobConfigurations = new Map(
				Object.entries(state.blobConfigurations)
			);
		}
		if (state.conversationHistory) {
			this.conversationHistory = state.conversationHistory;
		}
		if (state.analysisHistory) {
			this.analysisHistory = state.analysisHistory;
		}
	}

	/**
	 * Setzt alle Blobs zurück
	 */
	reset() {
		this.activeBlobs.clear();
		this.conversationHistory = [];
		this.analysisHistory = [];

		// Setze alle Konfigurationen auf inaktiv
		for (const config of this.blobConfigurations.values()) {
			config.isActive = false;
			config.lastTriggered = null;
		}
	}
}

// Singleton-Instanz
const blobManager = new BlobManager();

export default blobManager;
export { BlobManager };
