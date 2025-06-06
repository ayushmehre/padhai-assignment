import { AUDIO_CLIP_BASE64 } from "../src/assets/audioBase64.js";
import {
	EVENT_START_SESSION,
	EVENT_POINT,
	EVENT_HIGHLIGHT,
	EVENT_AUDIO,
	EVENT_SPEECH,
	EVENT_TRANSCRIPT,
} from "../src/events.js";

async function startServer() {
	const { WebSocketServer } = await import("ws");

	const wss = new WebSocketServer({ port: 1234 });
	console.log("Mock AI Tutor WebSocket server running on ws://localhost:1234");

	wss.on("connection", (ws) => {
		console.log("Frontend connected");

		ws.on("message", (message) => {
			let data;
			try {
				data = JSON.parse(message);
			} catch (e) {
				console.warn("Invalid JSON received:", message);
				return;
			}

			console.log("Received:", data);

			switch (data.mode) {
				case EVENT_START_SESSION:
					handleStartSession(ws, data.latencyMs);
					break;
				case EVENT_SPEECH:
					handleSpeech(ws, data.payload);
					break;
				default:
					console.log("Unknown mode:", data.mode);
			}
		});
	});
}

// Helpers
function handleStartSession(ws, clientLatencyMs = 0) {
	sendDelayed(
		ws,
		1500 + clientLatencyMs,
		{
			mode: EVENT_POINT,
			slideId: "geometry-001",
			payload: { elementId: "arcAB" },
		},
		"Sent POINT to arcAB"
	);

	sendDelayed(
		ws,
		3000 + clientLatencyMs,
		{
			mode: EVENT_HIGHLIGHT,
			slideId: "geometry-001",
			payload: { regex: "60°", matchIndex: 0 },
		},
		"Sent HIGHLIGHT for '60°'"
	);

	sendDelayed(
		ws,
		4500 + clientLatencyMs,
		{
			mode: EVENT_AUDIO,
			slideId: "geometry-001",
			payload: {
				chunk: AUDIO_CLIP_BASE64,
				isLast: true,
			},
		},
		"Sent AUDIO clip"
	);
}

function handleSpeech(ws, payload) {
	console.log("Learner replied:", payload.text);

	// Optional: echo back transcript
	const transcriptMsg = {
		mode: EVENT_TRANSCRIPT,
		payload: {
			text: `Yes, that's correct. The learner said: "${payload.text}"`,
		},
	};

	sendDelayed(ws, 1000, transcriptMsg, "Sent TRANSCRIPT");
}

function sendDelayed(ws, delay, message, logText) {
	setTimeout(() => {
		ws.send(JSON.stringify(message));
		if (logText) console.log(logText);
	}, delay);
}

// Start the server
startServer().catch((err) => {
	console.error("Failed to start server:", err);
	process.exit(1);
});
