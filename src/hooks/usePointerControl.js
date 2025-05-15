export function usePointerControl(cursorRef, containerRef) {
	return {
		pointTo: (targetId) => {
			const target = document.getElementById(targetId);
			if (!target || !cursorRef.current || !containerRef.current) return;

			const targetRect = target.getBoundingClientRect();
			const containerRect = containerRef.current.getBoundingClientRect();

			const offsetX = targetRect.left - containerRect.left;
			const offsetY = targetRect.top - containerRect.top;

			const centerX = offsetX + targetRect.width / 2;
			const centerY = offsetY + targetRect.height / 2;

			cursorRef.current.style.transform = `translate(${centerX - 8}px, ${
				centerY - 8
			}px)`;
			cursorRef.current.style.opacity = "1";
		},
	};
}
