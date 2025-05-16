import { useTutorEvents } from "@/hooks/useTutorEvents";

export function useSlideInteraction(slideRef) {
	useTutorEvents("geometry-001", async (msg) => {
		const problemTextElement = document.getElementById("problemText");

		if (!slideRef.current) {
			console.warn("[useSlideInteraction] slideRef.current is not available.");
			return;
		}

		switch (msg.mode) {
			case "POINT":
				slideRef.current.pointTo(msg.payload.elementId);
				break;
			case "HIGHLIGHT":
				if (problemTextElement) {
					slideRef.current.clearRegexHighlights(problemTextElement);

					const idHighlightedElements =
						problemTextElement.querySelectorAll(".highlighted");
					idHighlightedElements.forEach((el) => {
						if (el.id && slideRef.current.clearById) {
							slideRef.current.clearById(el.id);
						} else {
							el.classList.remove("highlighted");
							el.classList.remove("regex-highlighted");
						}
					});
				} else {
					console.warn(
						"[useSlideInteraction] problemTextElement not found for HIGHLIGHT."
					);
				}

				if (problemTextElement && msg.payload.regex) {
					slideRef.current.highlightByRegex({
						containerElement: problemTextElement,
						regexString: msg.payload.regex,
						matchIndex:
							msg.payload.matchIndex === undefined ? 0 : msg.payload.matchIndex,
					});
				} else if (msg.payload.elementId) {
					slideRef.current.highlightById(msg.payload.elementId);
				} else {
					console.warn(
						"[useSlideInteraction] Invalid HIGHLIGHT payload:",
						msg.payload
					);
				}
				break;
			case "AUDIO":
				slideRef.current.playAudio(msg.payload.chunk);
				break;
			default:
				console.warn("[useSlideInteraction] Unknown message mode:", msg.mode);
				break;
		}
	});
}
