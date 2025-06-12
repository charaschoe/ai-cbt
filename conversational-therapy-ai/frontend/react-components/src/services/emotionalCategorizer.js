/**
 * Emotional Categorizer Service
 * Analysiert Chat-Input und kategorisiert ihn nach emotionaler Wichtigkeit und anderen Parametern
 */

// Emotional Urgency Kategorien
export const EMOTIONAL_URGENCY_LEVELS = {
	NONE: "none",
	LOW: "low",
	MEDIUM: "medium",
	HIGH: "high",
	CRITICAL: "critical",
};

// Blob-Größen basierend auf emotionaler Wichtigkeit
export const BLOB_SIZES = {
	NONE: "none",
	SMALL: "small",
	MEDIUM: "medium",
	LARGE: "large",
	XLARGE: "xlarge",
};

// Blob-Typen
export const BLOB_TYPES = {
	EMOTIONAL_URGENCY: "emotional_urgency",
	SEEKING_INSIGHTS: "seeking_insights",
	ANXIETY: "anxiety",
	JOY: "joy",
	SADNESS: "sadness",
	ANGER: "anger",
	FEAR: "fear",
	NEUTRAL: "neutral",
};

// Keywords für emotionale Kategorisierung
const EMOTIONAL_KEYWORDS = {
	[EMOTIONAL_URGENCY_LEVELS.CRITICAL]: [
		"hilfe",
		"notfall",
		"krise",
		"suizid",
		"selbstmord",
		"verzweifelt",
		"hoffnungslos",
		"kann nicht mehr",
		"will sterben",
		"ende machen",
		"help",
		"emergency",
		"crisis",
		"suicide",
		"desperate",
		"hopeless",
	],
	[EMOTIONAL_URGENCY_LEVELS.HIGH]: [
		"panik",
		"angst",
		"depression",
		"traurig",
		"wut",
		"zorn",
		"verletzt",
		"allein",
		"einsam",
		"überwältigt",
		"stress",
		"burnout",
		"erschöpft",
		"panic",
		"anxiety",
		"depressed",
		"sad",
		"angry",
		"hurt",
		"lonely",
		"overwhelmed",
		"stressed",
		"exhausted",
	],
	[EMOTIONAL_URGENCY_LEVELS.MEDIUM]: [
		"sorge",
		"beunruhigt",
		"unsicher",
		"nervös",
		"müde",
		"frustriert",
		"enttäuscht",
		"verwirrt",
		"ratlos",
		"unglücklich",
		"bedrückt",
		"worried",
		"concerned",
		"uncertain",
		"nervous",
		"tired",
		"frustrated",
		"disappointed",
		"confused",
		"unhappy",
	],
	[EMOTIONAL_URGENCY_LEVELS.LOW]: [
		"okay",
		"gut",
		"normal",
		"entspannt",
		"ruhig",
		"gelassen",
		"zufrieden",
		"optimistisch",
		"hoffnungsvoll",
		"positiv",
		"motiviert",
		"fine",
		"good",
		"normal",
		"relaxed",
		"calm",
		"content",
		"optimistic",
		"hopeful",
		"positive",
		"motivated",
	],
};

// Emotionstyp Keywords
const EMOTION_TYPE_KEYWORDS = {
	[BLOB_TYPES.ANXIETY]: [
		"angst",
		"sorge",
		"panik",
		"nervös",
		"unruhig",
		"beunruhigt",
		"anxiety",
		"worry",
		"panic",
		"nervous",
		"restless",
		"concerned",
	],
	[BLOB_TYPES.JOY]: [
		"freude",
		"glücklich",
		"fröhlich",
		"begeistert",
		"euphorisch",
		"zufrieden",
		"joy",
		"happy",
		"cheerful",
		"excited",
		"euphoric",
		"content",
		"glad",
	],
	[BLOB_TYPES.SADNESS]: [
		"traurig",
		"niedergeschlagen",
		"bedrückt",
		"melancholisch",
		"weinen",
		"sad",
		"down",
		"depressed",
		"melancholic",
		"crying",
		"tearful",
	],
	[BLOB_TYPES.ANGER]: [
		"wut",
		"zorn",
		"ärger",
		"frustriert",
		"gereizt",
		"wütend",
		"sauer",
		"anger",
		"rage",
		"furious",
		"frustrated",
		"irritated",
		"mad",
		"annoyed",
	],
	[BLOB_TYPES.FEAR]: [
		"furcht",
		"ängstlich",
		"schrecken",
		"terror",
		"erschrocken",
		"verängstigt",
		"fear",
		"scared",
		"terrified",
		"frightened",
		"afraid",
		"fearful",
	],
};

/**
 * Kategorisiert einen Text nach emotionaler Wichtigkeit
 * @param {string} text - Der zu analysierende Text
 * @returns {Object} Kategorisierungsergebnis
 */
export function categorizeEmotionalInput(text) {
	if (!text || typeof text !== "string") {
		return {
			urgencyLevel: EMOTIONAL_URGENCY_LEVELS.NONE,
			blobSize: BLOB_SIZES.NONE,
			emotionType: BLOB_TYPES.NEUTRAL,
			confidence: 0,
			detectedKeywords: [],
			timestamp: new Date().toISOString(),
		};
	}

	const lowercaseText = text.toLowerCase();
	let highestUrgency = EMOTIONAL_URGENCY_LEVELS.NONE;
	let detectedKeywords = [];
	let emotionType = BLOB_TYPES.NEUTRAL;
	let emotionScores = {};

	// Analysiere emotionale Wichtigkeit
	for (const [urgencyLevel, keywords] of Object.entries(EMOTIONAL_KEYWORDS)) {
		const foundKeywords = keywords.filter((keyword) =>
			lowercaseText.includes(keyword.toLowerCase())
		);

		if (foundKeywords.length > 0) {
			detectedKeywords.push(...foundKeywords);

			// Bestimme höchste Dringlichkeitsstufe
			const urgencyOrder = [
				EMOTIONAL_URGENCY_LEVELS.NONE,
				EMOTIONAL_URGENCY_LEVELS.LOW,
				EMOTIONAL_URGENCY_LEVELS.MEDIUM,
				EMOTIONAL_URGENCY_LEVELS.HIGH,
				EMOTIONAL_URGENCY_LEVELS.CRITICAL,
			];

			const currentIndex = urgencyOrder.indexOf(urgencyLevel);
			const highestIndex = urgencyOrder.indexOf(highestUrgency);

			if (currentIndex > highestIndex) {
				highestUrgency = urgencyLevel;
			}
		}
	}

	// Analysiere Emotionstypen
	for (const [emotion, keywords] of Object.entries(EMOTION_TYPE_KEYWORDS)) {
		const foundKeywords = keywords.filter((keyword) =>
			lowercaseText.includes(keyword.toLowerCase())
		);

		if (foundKeywords.length > 0) {
			emotionScores[emotion] = foundKeywords.length;
		}
	}

	// Bestimme dominante Emotion
	if (Object.keys(emotionScores).length > 0) {
		emotionType = Object.keys(emotionScores).reduce((a, b) =>
			emotionScores[a] > emotionScores[b] ? a : b
		);
	}

	// Bestimme Blob-Größe basierend auf Dringlichkeit
	const blobSize = mapUrgencyToBlobSize(highestUrgency);

	// Berechne Confidence Score
	const confidence = calculateConfidence(detectedKeywords, text);

	return {
		urgencyLevel: highestUrgency,
		blobSize: blobSize,
		emotionType: emotionType,
		confidence: confidence,
		detectedKeywords: detectedKeywords,
		emotionScores: emotionScores,
		timestamp: new Date().toISOString(),
		originalText: text,
	};
}

/**
 * Mappt Dringlichkeitsstufe auf Blob-Größe
 */
function mapUrgencyToBlobSize(urgencyLevel) {
	const mapping = {
		[EMOTIONAL_URGENCY_LEVELS.NONE]: BLOB_SIZES.NONE,
		[EMOTIONAL_URGENCY_LEVELS.LOW]: BLOB_SIZES.SMALL,
		[EMOTIONAL_URGENCY_LEVELS.MEDIUM]: BLOB_SIZES.MEDIUM,
		[EMOTIONAL_URGENCY_LEVELS.HIGH]: BLOB_SIZES.LARGE,
		[EMOTIONAL_URGENCY_LEVELS.CRITICAL]: BLOB_SIZES.XLARGE,
	};

	return mapping[urgencyLevel] || BLOB_SIZES.NONE;
}

/**
 * Berechnet Confidence Score basierend auf gefundenen Keywords
 */
function calculateConfidence(detectedKeywords, text) {
	if (detectedKeywords.length === 0) return 0;

	const textLength = text.split(" ").length;
	const keywordDensity = detectedKeywords.length / textLength;

	// Normalisiere auf 0-1 Skala
	return Math.min(keywordDensity * 10, 1);
}

/**
 * Erweiterte Analyse für komplexere Patterns
 */
export function analyzeEmotionalPatterns(conversationHistory) {
	if (!Array.isArray(conversationHistory)) return null;

	const recentMessages = conversationHistory.slice(-5); // Letzte 5 Nachrichten
	const analyses = recentMessages.map((msg) =>
		categorizeEmotionalInput(msg.text || msg)
	);

	// Trend-Analyse
	const urgencyTrend = analyses.map((a) => {
		const urgencyOrder = [
			EMOTIONAL_URGENCY_LEVELS.NONE,
			EMOTIONAL_URGENCY_LEVELS.LOW,
			EMOTIONAL_URGENCY_LEVELS.MEDIUM,
			EMOTIONAL_URGENCY_LEVELS.HIGH,
			EMOTIONAL_URGENCY_LEVELS.CRITICAL,
		];
		return urgencyOrder.indexOf(a.urgencyLevel);
	});

	const isEscalating =
		urgencyTrend.length > 1 &&
		urgencyTrend[urgencyTrend.length - 1] > urgencyTrend[0];

	const averageUrgency =
		urgencyTrend.reduce((a, b) => a + b, 0) / urgencyTrend.length;

	// Emotionale Persistenz
	const dominantEmotion = analyses
		.map((a) => a.emotionType)
		.reduce((acc, emotion) => {
			acc[emotion] = (acc[emotion] || 0) + 1;
			return acc;
		}, {});

	const mostFrequentEmotion = Object.keys(dominantEmotion).reduce((a, b) =>
		dominantEmotion[a] > dominantEmotion[b] ? a : b
	);

	return {
		currentAnalysis: analyses[analyses.length - 1],
		isEscalating,
		averageUrgency,
		mostFrequentEmotion,
		trendData: urgencyTrend,
		conversationLength: conversationHistory.length,
		timestamp: new Date().toISOString(),
	};
}

/**
 * Export für Logging und Analytics
 */
export function exportAnalysisData(analyses) {
	return {
		version: "1.0.0",
		exportDate: new Date().toISOString(),
		totalAnalyses: analyses.length,
		data: analyses,
		summary: {
			urgencyDistribution: analyses.reduce((acc, analysis) => {
				acc[analysis.urgencyLevel] =
					(acc[analysis.urgencyLevel] || 0) + 1;
				return acc;
			}, {}),
			emotionDistribution: analyses.reduce((acc, analysis) => {
				acc[analysis.emotionType] =
					(acc[analysis.emotionType] || 0) + 1;
				return acc;
			}, {}),
			averageConfidence:
				analyses.reduce((sum, a) => sum + a.confidence, 0) /
				analyses.length,
		},
	};
}
