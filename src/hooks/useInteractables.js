import { useState, useEffect } from "react";

export function useInteractables(
	containerRef,
	onInteractablesDetected,
	emitter = null
) {
	const [interactables, setInteractables] = useState([]);

	useEffect(() => {
		if (!containerRef.current) return;

		const foundElements = Array.from(
			containerRef.current.querySelectorAll('[data-role="interactable"]')
		).map((el) => {
			const htmlEl = el;
			const rect = htmlEl.getBoundingClientRect();
			return {
				id: htmlEl.id || null,
				type: htmlEl.dataset.type || htmlEl.tagName.toLowerCase(),
				boundingBox: {
					x: rect.x,
					y: rect.y,
					width: rect.width,
					height: rect.height,
				},
				tagName: htmlEl.tagName,
			};
		});

		setInteractables(foundElements);

		if (onInteractablesDetected) {
			onInteractablesDetected(foundElements);
		}

		if (emitter?.emit) {
			emitter.emit("interactables-detected", foundElements);
		}

		window.postMessage(
			{
				type: "INTERACTABLES_DETECTED",
				payload: foundElements,
			},
			"*"
		);

		console.log("interactables", foundElements);
	}, [containerRef, onInteractablesDetected, emitter]);

	return interactables;
}
