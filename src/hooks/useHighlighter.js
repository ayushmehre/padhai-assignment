export default function useHighlighterControl() {
	return {
		highlight: (targetId) => {
			const target = document.getElementById(targetId);
			if (!target) {
				console.warn(`[Highlighter] No element found with id '${targetId}'`);
				return;
			}
			target.classList.add("highlighted");
		},
		clear: (targetId) => {
			const target = document.getElementById(targetId);
			if (!target) return;
			target.classList.remove("highlighted");
		},
	};
}
