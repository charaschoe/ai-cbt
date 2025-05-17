// script.js
// Frontend-Logik für Conversational Therapy AI

document.addEventListener("DOMContentLoaded", () => {
	const sendBtn = document.getElementById("sendBtn");
	const userInput = document.getElementById("userInput");
	const responseDiv = document.getElementById("response");

	sendBtn.addEventListener("click", async () => {
		const text = userInput.value;
		if (!text) return;
		responseDiv.textContent = "Wird gesendet...";
		try {
			const res = await fetch("http://localhost:8000/", {
				method: "GET",
			});
			const data = await res.json();
			responseDiv.textContent = data.message || JSON.stringify(data);
		} catch (e) {
			responseDiv.textContent = "Fehler: " + e;
		}
	});
});
