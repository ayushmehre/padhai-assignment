import { useState } from "react";
import { useTutorEvents } from "@/providers/TutorProvider";

export default function useTranscript(slideId) {
	const [text, set] = useState("");
	useTutorEvents(slideId, (m) => {
		if (m.mode === "TRANSCRIPT") set(m.payload.text);
	});
	return text;
}
