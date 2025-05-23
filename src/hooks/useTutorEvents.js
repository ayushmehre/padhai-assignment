import { useEffect } from "react";
import { useMittListener } from "@/providers/EmitProvider";
import { useWebSocketCtx } from "@/providers/WebSocketProvider";

export function useTutorEvents(slideId, handler) {
	const { buffer } = useWebSocketCtx();

	const wrapped = (msg) => {
		if (!slideId || msg.slideId === slideId) {
			console.log("[useTutorEvents] Event received:", msg);
			handler(msg);
		}
	};

	useMittListener("tutor", wrapped);

	useEffect(() => {
		buffer.read().forEach((msg) => {
			console.log("[useTutorEvents] Replaying buffered event:", msg);
			wrapped(msg);
		});
	}, [slideId, handler, buffer]);
}
