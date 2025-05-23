import { useEffect, useRef } from "react";

const RECONNECT_DELAY_MS = 2_000;
const MAX_RETRIES = 10;

export default function useWebSocket(url) {
	const wsRef = useRef(null);
	const retryCount = useRef(0);
	const alive = useRef(true);

	useEffect(() => {
		const connect = () => {
			if (!alive.current) return;

			const ws = new WebSocket(url);
			wsRef.current = ws;

			ws.addEventListener("open", () => {
				console.info("WebSocket connected");
				retryCount.current = 0;
			});

			ws.addEventListener("close", () => {
				if (!alive.current) return;
				const delay = RECONNECT_DELAY_MS * ++retryCount.current;
				if (retryCount.current <= MAX_RETRIES) {
					console.warn(`WebSocket closed. Reconnecting in ${delay}ms…`);
					setTimeout(connect, delay);
				} else {
					console.error("Max reconnect attempts reached.");
				}
			});

			ws.addEventListener("error", (err) => {
				console.error("WebSocket error:", err);
				if (ws.readyState === WebSocket.OPEN) {
					ws.close();
				}
			});
		};

		connect();

		return () => {
			alive.current = false;
			if (wsRef.current?.readyState === WebSocket.OPEN) {
				wsRef.current.close();
			}
		};
	}, [url]);

	return wsRef;
}
