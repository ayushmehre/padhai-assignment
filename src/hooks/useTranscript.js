import { useState } from "react";
import { useTutorEvents } from "@/hooks/useTutorEvents";

export default function useTranscript(slideId) {
	const [text, set] = useState("");
	useTutorEvents(slideId, (m) => {
		if (m.mode === "TRANSCRIPT") set(m.payload.text);
	});
	return text;
}
