import { useState, useEffect } from "react";

export function useInteractables(containerRef, onInteractablesDetected) {
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
	}, [containerRef, onInteractablesDetected]);

	return interactables;
}
