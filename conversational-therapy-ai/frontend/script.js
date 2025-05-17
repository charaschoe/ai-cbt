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
	let entries = [
		{
			emotion: "Grief",
			text: "Vermisse meine Mutter.",
			mood: "negativ",
			date: "2025-05-16",
		},
		{
			emotion: "Joy",
			text: "Schöner Spaziergang.",
			mood: "positiv",
			date: "2025-05-15",
		},
		{
			emotion: "Anxiety",
			text: "Zu viele Mails.",
			mood: "negativ",
			date: "2025-05-14",
		},
	];

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

	// Voice Chat: Aufnahme und Transkription (Platzhalter mit Whisper-Integration)
	voiceBtn.onclick = async () => {
		currentMode = "voice";
		inputArea.innerHTML =
			'<div class="mic-placeholder">🎤<br><small>Sprich jetzt und klicke auf Senden</small></div>';
		responseDiv.textContent = "";
		moodPattern.textContent = "";
		feedbackBlob.classList.add("hidden");
		showScreen(chatScreen);
		// Optional: Automatisch Aufnahme starten (Web Audio API)
	};

	// Text Chat: Textfeld anzeigen
	textBtn.onclick = () => {
		currentMode = "text";
		inputArea.innerHTML =
			'<input type="text" id="userInput" placeholder="Deine Nachricht...">';
		responseDiv.textContent = "";
		moodPattern.textContent = "";
		feedbackBlob.classList.add("hidden");
		showScreen(chatScreen);
	};

	// Senden-Button: Text oder Audio an Backend schicken
	sendBtn.onclick = async () => {
		feedbackBlob.classList.remove("hidden");
		feedbackBlob.textContent = "⏳";
		let text = "";
		if (currentMode === "text") {
			const userInput = document.getElementById("userInput").value;
text = DOMPurify.sanitize(userInput);
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
						"http://localhost:8000/transcribe",
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
					responseDiv.textContent = "Fehler bei Transkription: " + e;
					feedbackBlob.textContent = "❌";
					feedbackBlob.style.background = "#f88";
				}
			};
			fileInput.click();
			return;
		}
		await sendToChat(text);
	};

	async function sendToChat(text) {
		try {
			const res = await fetch("http://localhost:8000/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text }),
			});
			const data = await res.json();
			responseDiv.textContent = data.response;
			moodPattern.textContent = `Stimmung: ${
				data.mood
			} | Muster: ${data.patterns.join(", ")}`;
			feedbackBlob.textContent = "✅";
			feedbackBlob.style.background =
				data.mood === "positiv"
					? "#8f8"
					: data.mood === "negativ"
					? "#f88"
					: "#ff8";
			// Nach kurzer Zeit Coping-Tool vorschlagen
			setTimeout(() => {
copingContent.innerHTML =
"<b>Atemübung:</b> 5 tiefe Atemzüge.<br><button id='startBreathingBtn'>Starten</button>";

document.getElementById("startBreathingBtn").onclick = () => {
  let breathCount = 5;
  copingContent.innerHTML = "<b>Einatmen...</b>";
  const interval = setInterval(() => {
    if (breathCount === 0) {
      clearInterval(interval);
      copingContent.innerHTML = "<b>Übung abgeschlossen! Gut gemacht!</b>";
    } else {
      copingContent.innerHTML = breathCount % 2 === 0 ? "<b>Einatmen...</b>" : "<b>Ausatmen...</b>";
      breathCount--;
    }
  }, 3000); // 3 seconds for each breath phase
};
				showScreen(copingTool);
			}, 1200);
		} catch (e) {
			responseDiv.textContent = "Fehler: " + e;
			feedbackBlob.textContent = "❌";
			feedbackBlob.style.background = "#f88";
		}
	}

	backBtn.onclick = () => showScreen(mainScreen);
	closeDashboardBtn.onclick = () => showScreen(mainScreen);
	closeCopingBtn.onclick = () => showScreen(mainScreen);
	closeSettingsBtn.onclick = () => showScreen(mainScreen);
	closeInsightBtn.onclick = () => showScreen(mainScreen);

	dashboardBtn.onclick = async () => {
  try {
    const res = await fetch("http://localhost:8000/blobs");
    const blobData = await res.json();
    blobsDiv.innerHTML = "";
    Object.keys(blobData).forEach((emotion) => {
      const blob = document.createElement("div");
      blob.className = "emotion-blob";
      blob.textContent = emotion;
      blob.style.width = `${blobData[emotion].size * 2}px`;
      blob.style.height = `${blobData[emotion].size * 2}px`;
      blob.style.opacity = blobData[emotion].transparency;
      blob.style.background = emotion === "Joy"
        ? "linear-gradient(135deg, #a8ff78, #78ffd6)"
        : "linear-gradient(135deg, #ff9a9e, #fad0c4)";
      blob.onclick = () => showTimeline(emotion);
      blobsDiv.appendChild(blob);
    });
  } catch (e) {
    blobsDiv.innerHTML = "<p>Error loading blobs.</p>";
  }
		blobsDiv.innerHTML = "";
		const emotions = {};
		entries.forEach((e) => {
			if (!emotions[e.emotion])
				emotions[e.emotion] = { count: 0, mood: e.mood };
			emotions[e.emotion].count++;
		});
		Object.keys(emotions).forEach((em) => {
			const blob = document.createElement("div");
			blob.className = "emotion-blob";
			blob.textContent = em;
			blob.style.width = 60 + emotions[em].count * 20 + "px";
			blob.style.height = 60 + emotions[em].count * 20 + "px";
			blob.style.background =
				emotions[em].mood === "positiv"
					? "#8f8"
					: emotions[em].mood === "negativ"
					? "#f88"
					: "#ff8";
			blob.onclick = () => showTimeline(em);
			blobsDiv.appendChild(blob);
		});
		timelineDiv.classList.add("hidden");
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

	document.getElementById("cameraBtn").onclick = () => {
		alert("Kamera/Emotionserkennung (Platzhalter)");
	};

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
    if (confirm("This application uses your microphone to detect ambient noise levels and recommend the best interaction mode (text or voice). Do you want to allow microphone access?")) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    source.connect(analyser);

    setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      const avgVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      if (avgVolume > 60) {
        captionArea.textContent = "Environment: loud – Text mode recommended.";
      } else {
        captionArea.textContent = "Environment: quiet – How are you feeling today?";
      }
    }, 2000);
    } else {
        captionArea.textContent = "Microphone access denied. Defaulting to text mode.";
        return;
    }
} catch (err) {
    console.error("Error accessing microphone:", err);
    captionArea.textContent = "Microphone access denied. Defaulting to text mode.";
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
