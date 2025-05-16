import { useEffect, useRef } from "react";

const RECONNECT_DELAY_MS = 2_000;

export default function useWebSocket(url) {
	const wsRef = useRef(null);

	useEffect(() => {
		let alive = true;
		let retry = 0;
		const connect = () => {
			if (!alive) return;
			const ws = new WebSocket(url);
			wsRef.current = ws;
			ws.onopen = () => {
				console.info("🟢 Tutor WS connected");
				retry = 0;
			};
			ws.onclose = () => {
				console.warn("🔌 Tutor WS closed, retrying…");
				setTimeout(connect, RECONNECT_DELAY_MS * ++retry);
			};
			ws.onerror = (err) => {
				console.error("❌ Tutor WS error:", err);
				ws.close();
			};
		};
		connect();
		return () => {
			alive = false;
			wsRef.current?.close();
		};
	}, [url]);

	return wsRef;
}
