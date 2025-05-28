# Integration Roadmap 🚀

## Aktueller Status ✅

-   **ChatFlow Screen 1** ist als React-Komponente fertig
-   Development Server läuft auf http://localhost:3000/
-   Basis-Architektur für weitere Screens ist etabliert

## Phase 1: Weitere Figma Screens hinzufügen

### Für jeden neuen Screen:

1. **Figma-Export** in separaten Ordner (z.B. `screen-2-settings`, `screen-3-conversation`)
2. **React-Komponente erstellen** in `src/components/`
3. **CSS portieren** (ähnlich wie ChatFlow.css)
4. **Assets kopieren** (SVGs, Bilder)

### Beispiel-Struktur nach mehreren Screens:

```
src/components/
├── ChatFlow.jsx          (Screen 1 - bubble)
├── ChatFlow.css
├── SettingsScreen.jsx    (Screen 2)
├── SettingsScreen.css
├── ConversationScreen.jsx (Screen 3)
├── ConversationScreen.css
├── ProfileScreen.jsx     (Screen 4)
└── ProfileScreen.css
```

## Phase 2: Routing & Navigation

### React Router Setup:

```bash
npm install react-router-dom
```

### Navigation zwischen Screens:

```jsx
// App.js wird erweitert mit:
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<ChatFlow />} />
				<Route path="/settings" element={<SettingsScreen />} />
				<Route path="/conversation" element={<ConversationScreen />} />
				<Route path="/profile" element={<ProfileScreen />} />
			</Routes>
		</BrowserRouter>
	);
}
```

## Phase 3: Integration mit bestehendem Chat Assistant

### Backend Integration:

1. **API-Calls** zu deinem bestehenden Backend (`/backend/server.py`)
2. **WebSocket-Verbindung** für Real-time Chat
3. **State Management** (Redux oder Context API)

### Beispiel Integration:

```jsx
// ChatService.js
const API_BASE = "http://localhost:5000"; // Dein Backend

export const sendMessage = async (message) => {
	const response = await fetch(`${API_BASE}/chat`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message }),
	});
	return response.json();
};

export const startVoiceRecording = async () => {
	// Integration mit speech_to_text.py
};

export const playTextToSpeech = async (text) => {
	// Integration mit text_to_speech.py
};
```

## Phase 4: State Management & Data Flow

### Context API für globalen State:

```jsx
// ChatContext.js
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
	const [currentScreen, setCurrentScreen] = useState("chat");
	const [messages, setMessages] = useState([]);
	const [userProfile, setUserProfile] = useState({});

	return (
		<ChatContext.Provider
			value={{
				currentScreen,
				setCurrentScreen,
				messages,
				setMessages,
				userProfile,
				setUserProfile,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};
```

## Phase 5: Progressive Web App (PWA)

### Mobile-optimierte Erfahrung:

-   Service Worker für Offline-Funktionalität
-   App-Icon und Manifest
-   Touch-Gesten und mobile Navigation

## Nächste konkrete Schritte:

### 1. Weitere Screens hinzufügen

-   Exportiere deine nächsten Figma-Screens
-   Erstelle React-Komponenten (folge ChatFlow-Pattern)

### 2. Navigation implementieren

-   React Router installieren
-   Verbindungen zwischen Screens erstellen

### 3. Backend-Integration planen

-   API-Endpunkte definieren
-   WebSocket-Kommunikation einrichten

### 4. Testing & Deployment

-   Jest für Unit Tests
-   Cypress für E2E Tests
-   Build & Deploy Pipeline

## Vorteile dieser Architektur:

✅ **Skalierbar** - Einfach weitere Screens hinzufügen
✅ **Modulär** - Jeder Screen ist eigenständige Komponente
✅ **Integriert** - Nahtlose Verbindung mit bestehendem Backend
✅ **Modern** - React, Webpack, Hot Reload
✅ **Mobile-ready** - Responsive Design von Anfang an

## Fragen für nächste Phase:

1. **Welcher Screen kommt als nächstes?**
2. **Welche Navigation zwischen Screens ist geplant?**
3. **Welche Backend-Funktionen sollen zuerst integriert werden?**
4. **Soll es eine mobile App werden (PWA) oder Web-App?**
