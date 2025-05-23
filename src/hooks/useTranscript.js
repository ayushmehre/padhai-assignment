import { useState, useCallback } from "react";
import { useTutorEvents } from "@/hooks/useTutorEvents";
import { EVENT_TRANSCRIPT } from "@/events";

export default function useTranscript(slideId) {
	const [text, set] = useState("");
	const handleTranscriptEvent = useCallback(
		(m) => {
			if (m.mode === EVENT_TRANSCRIPT) set(m.payload.text);
		},
		[set]
	); // set is stable, but good practice to include

	useTutorEvents(slideId, handleTranscriptEvent);
	return text;
}
