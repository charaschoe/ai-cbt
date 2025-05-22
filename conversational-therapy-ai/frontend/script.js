// script.js
// Frontend-Logik für Conversational Therapy AI

document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM fully loaded and parsed.");
	const mainScreen = document.getElementById("main-screen");
	const chatScreen = document.getElementById("chat-screen");
	const dashboardScreen = document.getElementById("dashboard-screen");
	const copingTool = document.getElementById("coping-tool");
	const settingsScreen = document.getElementById("settings-screen");
	const insightScreen = document.getElementById("insight-screen");

	const voiceBtn = document.getElementById("voiceBtn");
	const textBtn = document.getElementById("textBtn");
	const dashboardBtn = document.getElementById("dashboardBtn");
	const sendBtn = document.getElementById("sendBtn");
	const backBtn = document.getElementById("backBtn");
	const closeDashboardBtn = document.getElementById("closeDashboardBtn");
	const closeCopingBtn = document.getElementById("closeCopingBtn");
	const closeSettingsBtn = document.getElementById("closeSettingsBtn");
	const closeInsightBtn = document.getElementById("closeInsightBtn");
	const arrowBtn = document.getElementById("arrowBtn");
	const settingsBtn = document.getElementById("settingsBtn");

	const inputArea = document.getElementById("input-area");
	const responseDiv = document.getElementById("response");
	const feedbackBlob = document.getElementById("feedback-blob");
	const moodPattern = document.getElementById("mood-pattern");
	const blobsDiv = document.getElementById("blobs");
	const timelineDiv = document.getElementById("timeline");
	const copingContent = document.getElementById("coping-content");
	const biometricsWidget = document.getElementById("biometrics-widget");
	const hrValue = document.getElementById("hr-value");
	const hrAlert = document.getElementById("hr-alert");
	const insightBlobs = document.getElementById("insight-blobs");
	const captionArea = document.getElementById("caption-area");

	let currentMode = null;

	function showScreen(screen) {
		console.log("Switching to screen:", screen.id);
		mainScreen.classList.add("hidden");
		chatScreen.classList.add("hidden");
		dashboardScreen.classList.add("hidden");
		copingTool.classList.add("hidden");
		settingsScreen.classList.add("hidden");
		insightScreen.classList.add("hidden");
		screen.classList.remove("hidden");
	}

	// Nachrichten-Container referenz
	const messagesContainer = document.getElementById("messages-container");

	// Funktion zum Hinzufügen einer Chat-Nachricht
	function addMessage(text, isUser = false) {
		const message = document.createElement("div");
		message.className = isUser
			? "message user-message"
			: "message bot-message";
		message.textContent = text;
		messagesContainer.appendChild(message);
		// Automatisch zum Ende scrollen
		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	}

	// Willkommensnachricht hinzufügen
	function addWelcomeMessage() {
		messagesContainer.innerHTML = ""; // Löscht vorherige Nachrichten
		addMessage(
			"Hallo! Ich bin dein CBT-Therapeut. Wie geht es dir heute?",
			false
		);
	}

	// Voice Chat: Aufnahme und Transkription (Platzhalter mit Whisper-Integration)
	voiceBtn.onclick = async () => {
		currentMode = "voice";
		inputArea.innerHTML =
			'<div class="mic-placeholder">🎤<br><small>Sprich jetzt und klicke auf Senden</small></div>';
		moodPattern.textContent = "";
		feedbackBlob.classList.add("hidden");
		showScreen(chatScreen);
		addWelcomeMessage();
		// Optional: Automatisch Aufnahme starten (Web Audio API)
	};

	// Text Chat: Textfeld anzeigen
	textBtn.onclick = () => {
		currentMode = "text";
		inputArea.innerHTML =
			'<input type="text" id="userInput" placeholder="Deine Nachricht...">';
		moodPattern.textContent = "";
		feedbackBlob.classList.add("hidden");
		showScreen(chatScreen);
		addWelcomeMessage();

		// Focus auf das Eingabefeld setzen
		setTimeout(() => {
			const userInput = document.getElementById("userInput");
			if (userInput) userInput.focus();
		}, 100);
	};

	// Senden-Button: Text oder Audio an Backend schicken
	sendBtn.onclick = async () => {
		feedbackBlob.classList.remove("hidden");
		feedbackBlob.textContent = "⏳";
		let text = "";
		if (currentMode === "text") {
			const userInput = document.getElementById("userInput");
			if (!userInput) {
				responseDiv.textContent = "Fehler: Eingabefeld nicht gefunden";
				feedbackBlob.textContent = "❌";
				feedbackBlob.style.background = "#f88";
				return;
			}
			text = userInput.value.trim();
		} else if (currentMode === "voice") {
			// Simuliert: In echt hier Audio aufnehmen und an /transcribe schicken
			// Hier: Prompt für Datei-Upload (Platzhalter)
			const fileInput = document.createElement("input");
			fileInput.type = "file";
			fileInput.accept = "audio/*";
			fileInput.onchange = async (e) => {
				const file = e.target.files[0];
				if (!file) return;
				const formData = new FormData();
				formData.append("file", file);
				try {
					const res = await fetch(
						"http://localhost:8080/transcribe",
						{
							method: "POST",
							body: formData,
						}
					);
					const data = await res.json();
					text = data.transcript;
					// Automatisch an Chat schicken
					await sendToChat(text);
				} catch (e) {
					addMessage("Fehler bei Transkription: " + e, false);
					feedbackBlob.textContent = "❌";
					feedbackBlob.style.background = "#ef4444"; // red-500
				}
			};
			fileInput.click();
			return;
		}
		await sendToChat(text);
	};

	async function sendToChat(text) {
		console.log("Sending text to chat:", text);

		if (!text || text.trim() === "") {
			addMessage("Bitte gib eine Nachricht ein.", false);
			feedbackBlob.textContent = "❌";
			feedbackBlob.style.background = "#f88";
			return;
		}

		// Benutzer-Nachricht zum Chat hinzufügen
		addMessage(text, true);

		// Feedback-Blob zeigt Ladezustand
		feedbackBlob.classList.remove("hidden");
		feedbackBlob.textContent = "";
		feedbackBlob.style.background = "#fbbf24"; // Amber loading color

		try {
			const res = await fetch("http://localhost:8080/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: text.trim() }),
			});

			console.log("Response status:", res.status);

			if (!res.ok) {
				throw new Error(`HTTP Error: ${res.status}`);
			}

			const data = await res.json();
			console.log("Response data:", data);

			// Bot-Antwort zum Chat hinzufügen
			addMessage(data.response, false);

			// Stimmungsanzeige aktualisieren
			const patterns = Array.isArray(data.patterns)
				? data.patterns.join(", ")
				: "keine";
			moodPattern.textContent = `Stimmung: ${data.mood} | Muster: ${patterns}`;
			feedbackBlob.textContent = "";

			// Erweiterte Stimmungsfarben
			let backgroundColor = "#a3a3a3"; // default neutral (gray-400)
			if (data.mood === "positiv")
				backgroundColor = "#22c55e"; // green-500
			else if (data.mood === "negativ")
				backgroundColor = "#ef4444"; // red-500
			else if (data.mood === "krise")
				backgroundColor = "#b91c1c"; // red-700
			else if (data.mood === "gemischt") backgroundColor = "#f97316"; // orange-500

			feedbackBlob.style.background = backgroundColor;

			// Eingabefeld leeren nach erfolgreichem Senden
			if (currentMode === "text") {
				const userInput = document.getElementById("userInput");
				if (userInput) {
					userInput.value = "";
					userInput.focus();
				}
			}
		} catch (e) {
			console.error("Chat error:", e);
			addMessage(
				"Verbindungsfehler. Bitte versuche es erneut. Details: " +
					e.message,
				false
			);
			feedbackBlob.textContent = "❌";
			feedbackBlob.style.background = "#ef4444"; // red-500
		}
	}

	backBtn.onclick = () => showScreen(mainScreen);
	closeDashboardBtn.onclick = () => showScreen(mainScreen);
	closeCopingBtn.onclick = () => showScreen(mainScreen);
	closeSettingsBtn.onclick = () => showScreen(mainScreen);
	closeInsightBtn.onclick = () => showScreen(mainScreen);

	dashboardBtn.onclick = async () => {
		try {
			const res = await fetch("http://localhost:8080/blobs");
			if (!res.ok) {
				throw new Error(`HTTP Error: ${res.status}`);
			}
			const blobData = await res.json();
			console.log("Fetched blob data:", blobData); // Debugging
			blobsDiv.innerHTML = ""; // Clear previous blobs

			if (Object.keys(blobData).length === 0) {
				blobsDiv.innerHTML =
					'<div class="empty-state"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg><p>Noch keine Emotionen zum Anzeigen vorhanden.<br/>Beginne ein Gespräch!</p></div>';
			} else {
				// Sortiere Themen nach Größe (und damit Häufigkeit)
				const sortedThemes = Object.keys(blobData).sort(
					(a, b) => blobData[b].size - blobData[a].size
				);

				sortedThemes.forEach((theme) => {
					const data = blobData[theme];
					const blob = document.createElement("div");
					blob.className = "emotion-blob";

					// Innere Struktur für besseres Styling
					const innerContent = document.createElement("span");
					innerContent.className = "blob-text";
					innerContent.textContent = theme;
					blob.appendChild(innerContent);

					// Größe basierend auf 'size'
					const size = Math.max(60, Math.min(data.size * 20, 180)); // Skalierung und Min/Max-Größe
					blob.style.width = `${size}px`;
					blob.style.height = `${size}px`;

					// Transparenz basierend auf 'transparency'
					blob.style.opacity = Math.max(0.6, data.transparency); // Mindestopazität für Lesbarkeit

					// Modernes Farbschema mit Gradient erstellen
					if (data.color) {
						const colorBase = data.color;
						// Hellere Variante des Farbtons für den Gradienten berechnen
						const lighterColor =
							colorBase
								.replace(/^#/, "")
								.match(/.{2}/g)
								?.map((c) => {
									const num = parseInt(c, 16);
									const lighter = Math.min(255, num + 40)
										.toString(16)
										.padStart(2, "0");
									return lighter;
								})
								.join("") || "ffffff";

						blob.style.background = `linear-gradient(135deg, ${data.color}, #${lighterColor})`;
						blob.style.boxShadow = `0 8px 16px ${data.color}33`; // Leichter Schatten mit 20% Opazität
					}

					// Modernes Animation beim Hovern
					blob.style.transition = "all 0.3s ease-in-out";

					// Tooltip für Details
					blob.title = `Thema: ${theme}\nHäufigkeit: ${
						data.frequency
					}\nIntensität: ${data.intensity.toFixed(2)}`;

					// Optional: Klick-Event für Details
					blob.onclick = () => {
						// Pulsieren-Animation beim Klick
						blob.style.transform = "scale(1.05)";
						setTimeout(() => {
							blob.style.transform = "scale(1)";
						}, 300);

						// Hier könnte in Zukunft eine detailliertere Ansicht angezeigt werden
						alert(
							`Thema: ${theme}\nHäufigkeit: ${
								data.frequency
							}\nIntensität: ${data.intensity.toFixed(2)}`
						);
					};

					blobsDiv.appendChild(blob);
				});
			}
		} catch (e) {
			console.error("Error loading blobs:", e);
			blobsDiv.innerHTML = `<p>Fehler beim Laden der Emotions-Bubbles: ${e.message}</p>`;
		}
		// timelineDiv.classList.add("hidden"); // Timeline vorerst nicht anzeigen
		showScreen(dashboardScreen);
	};

	function showTimeline(emotion) {
		timelineDiv.innerHTML = `<h3>${emotion} Timeline</h3>`;
		entries
			.filter((e) => e.emotion === emotion)
			.forEach((e) => {
				const item = document.createElement("div");
				item.className = "timeline-item";
				item.textContent = `${e.date}: ${e.text}`;
				timelineDiv.appendChild(item);
			});
		timelineDiv.classList.remove("hidden");
	}

	// Settings
	settingsBtn.onclick = () => showScreen(settingsScreen);

	document.getElementById("cameraBtn").onclick = async () => {
		// Zuerst explizit nach Kamera-Berechtigung fragen, bevor wir die UI erstellen
		try {
			console.log("Requesting camera permission...");

			// Wichtig: Navigator-Berechtigung explizit abfragen
			// Wir fragen zuerst, ob wir die Kamera verwenden dürfen, bevor wir sie öffnen
			const permissionResult = await navigator.permissions.query({
				name: "camera",
			});

			if (permissionResult.state === "denied") {
				alert(
					"Kamerazugriff wurde verweigert. Bitte erlauben Sie den Zugriff in Ihren Browsereinstellungen."
				);
				return;
			}

			// Wenn wir hier ankommen, ist die Berechtigung "granted" oder "prompt"
			// Bei "prompt" wird der Browser die Berechtigungsfrage zeigen
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 400 },
					height: { ideal: 300 },
				},
				audio: false,
			});

			console.log("Camera permission granted, creating UI...");

			// Erstelle erst jetzt die Kamera-UI
			createCameraUI(stream);
		} catch (error) {
			console.error("Fehler beim Zugriff auf die Kamera:", error);
			alert("Kamerazugriff nicht möglich: " + error.message);
		}
	};

	// Hilfsfunktion zum Erstellen der Kamera-UI
	function createCameraUI(stream) {
		// Erstelle HTML-Elemente für den Kamera-Bereich
		const cameraContainer = document.createElement("div");
		cameraContainer.className = "camera-container";

		// Kamera-Elemente
		cameraContainer.innerHTML = `
			<div class="camera-header">
				<h3>Emotionserkennung</h3>
				<button id="closeCamera" class="icon-btn close-btn">×</button>
			</div>
			<div class="camera-content">
				<video id="camera-video" width="400" height="300" autoplay playsinline></video>
				<canvas id="camera-canvas" width="400" height="300" style="display: none;"></canvas>
				<div class="camera-controls">
					<button id="takePicture" class="small-btn">Foto aufnehmen</button>
					<div id="emotion-result" class="emotion-result"></div>
				</div>
			</div>
		`;

		// Füge die Kamera-Container zum Body hinzu
		document.body.appendChild(cameraContainer);

		// Kamera-Stream starten
		const video = document.getElementById("camera-video");
		const canvas = document.getElementById("camera-canvas");
		const emotionResult = document.getElementById("emotion-result");

		// Setze den Stream
		video.srcObject = stream;

		// Event-Handler für die Buttons
		document.getElementById("closeCamera").onclick = () => {
			// Stream beenden
			if (stream) {
				const tracks = stream.getTracks();
				tracks.forEach((track) => track.stop());
			}
			// Container entfernen
			document.body.removeChild(cameraContainer);
		};

		document.getElementById("takePicture").onclick = async () => {
			// Foto aufnehmen
			const context = canvas.getContext("2d");
			context.drawImage(video, 0, 0, canvas.width, canvas.height);

			// Bild als base64 holen
			const imageDataUrl = canvas.toDataURL("image/jpeg");

			// Lade-Anzeige
			emotionResult.textContent = "Analysiere...";
			emotionResult.className = "emotion-result loading";

			try {
				// Sende Bild an den Server
				const formData = new FormData();
				// Konvertiere base64 zu Blob
				const blob = await (await fetch(imageDataUrl)).blob();
				formData.append("image", blob, "face.jpg");

				const response = await fetch(
					"http://localhost:8080/analyze-face",
					{
						method: "POST",
						body: formData,
					}
				);

				if (!response.ok) {
					throw new Error(`Server antwortete mit ${response.status}`);
				}

				const result = await response.json();

				// Zeige das Ergebnis an
				emotionResult.textContent = `Erkannte Emotion: ${result.emotion}`;
				emotionResult.className = "emotion-result";

				// Optional: Füge als Nachricht zum Chat hinzu
				if (messagesContainer) {
					addMessage(
						`Erkannte Emotion durch Gesichtsanalyse: ${result.emotion}`,
						false
					);
					moodPattern.textContent = `Stimmung: ${result.emotion}`;
				}

				// Aktualisiere Feedback-Blob, falls im Chat-Modus
				if (feedbackBlob) {
					feedbackBlob.classList.remove("hidden");

					// Farbe basierend auf der Emotion
					let backgroundColor = "#a3a3a3"; // default
					if (
						result.emotion === "happy" ||
						result.emotion === "freudig"
					)
						backgroundColor = "#22c55e";
					else if (
						result.emotion === "sad" ||
						result.emotion === "traurig"
					)
						backgroundColor = "#ef4444";
					else if (
						result.emotion === "angry" ||
						result.emotion === "wütend"
					)
						backgroundColor = "#b91c1c";
					else if (result.emotion === "neutral")
						backgroundColor = "#6366f1";
					else if (
						result.emotion === "surprise" ||
						result.emotion === "überrascht"
					)
						backgroundColor = "#f97316";

					feedbackBlob.style.background = backgroundColor;
				}
			} catch (error) {
				console.error("Fehler bei der Emotionsanalyse:", error);
				emotionResult.textContent = "Fehler: " + error.message;
				emotionResult.className = "emotion-result error";
			}
		};
	}

	document.getElementById("insurance-link").onclick = (e) => {
		e.preventDefault();
		alert("Krankenkasse-Link (Platzhalter)");
	};
	document.getElementById("biometrics-link").onclick = (e) => {
		e.preventDefault();
		alert("Biometrie-Link (Platzhalter)");
	};
	document.getElementById("devices-link").onclick = (e) => {
		e.preventDefault();
		alert("Geräteübersicht/NFC (Platzhalter)");
	};

	// Arrow to Chat
	arrowBtn.onclick = () => {
		textBtn.onclick();
	};

	// Simulierte dynamische Caption (z.B. Umgebungsgeräusch)
	let audioContext;
	let analyser;
	let dataArray;

	async function startNoiseDetection() {
		try {
			if (
				confirm(
					"This application uses your microphone to detect ambient noise levels and recommend the best interaction mode (text or voice). Do you want to allow microphone access?"
				)
			) {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				audioContext = new (window.AudioContext ||
					window.webkitAudioContext)();
				const source = audioContext.createMediaStreamSource(stream);
				analyser = audioContext.createAnalyser();
				analyser.fftSize = 256;
				const bufferLength = analyser.frequencyBinCount;
				dataArray = new Uint8Array(bufferLength);
				source.connect(analyser);

				setInterval(() => {
					analyser.getByteFrequencyData(dataArray);
					const avgVolume =
						dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

					if (avgVolume > 60) {
						captionArea.textContent =
							"Environment: loud – Text mode recommended.";
					} else {
						captionArea.textContent =
							"Environment: quiet – How are you feeling today?";
					}
				}, 2000);
			} else {
				captionArea.textContent =
					"Microphone access denied. Defaulting to text mode.";
				return;
			}
		} catch (err) {
			console.error("Error accessing microphone:", err);
			captionArea.textContent =
				"Microphone access denied. Defaulting to text mode.";
		}
	}

	startNoiseDetection();

	// Swipe-Events für Insights und Biometrics
	let touchStartX = null;
	document.body.addEventListener("touchstart", (e) => {
		touchStartX = e.changedTouches[0].screenX;
	});
	document.body.addEventListener("touchend", (e) => {
		if (touchStartX === null) return;
		const dx = e.changedTouches[0].screenX - touchStartX;
		if (dx > 80) {
			// Swipe rechts: Biometrics
			showBiometrics();
		} else if (dx < -80) {
			// Swipe links: Insights
			showInsights();
		}
		touchStartX = null;
	});

	function showBiometrics() {
		biometricsWidget.classList.remove("hidden");
		hrValue.textContent = Math.floor(60 + Math.random() * 60);
		if (parseInt(hrValue.textContent) > 110) {
			hrAlert.textContent = "⚠️ Hoch! Alles okay?";
			biometricsWidget.style.background = "#ffe0e0";
		} else {
			hrAlert.textContent = "";
			biometricsWidget.style.background = "";
		}
		setTimeout(() => biometricsWidget.classList.add("hidden"), 4000);
	}

	function showInsights() {
		insightBlobs.innerHTML = "";
		["Stress", "Selbstwert", "Schlaf", "Soziale Kontakte"].forEach(
			(topic, i) => {
				const blob = document.createElement("div");
				blob.className = "emotion-blob";
				blob.textContent = topic;
				blob.style.width = 70 + i * 10 + "px";
				blob.style.height = 70 + i * 10 + "px";
				blob.style.background = ["#f88", "#8f8", "#ff8", "#8ef"][i % 4];
				blob.onclick = () => {
					alert("Übung für " + topic + " (Platzhalter)");
				};
				insightBlobs.appendChild(blob);
			}
		);
		showScreen(insightScreen);
	}
});
