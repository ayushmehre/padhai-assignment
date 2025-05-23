export function usePointerControl(cursorRef, containerRef) {
	return {
		pointTo: (targetId) => {
			const target = document.getElementById(targetId);
			if (!target || !cursorRef.current || !containerRef.current) return;

			const targetRect = target.getBoundingClientRect();
			const containerRect = containerRef.current.getBoundingClientRect();

			const offsetX =
				targetRect.left - containerRef.current.getBoundingClientRect().left;
			const offsetY =
				targetRect.top - containerRef.current.getBoundingClientRect().top;

			const centerX = offsetX + targetRect.width / 2;
			const centerY = offsetY + targetRect.height / 2;

			cursorRef.current.style.transform = `translate(${centerX - 8}px, ${
				centerY - 8
			}px)`;
			cursorRef.current.style.opacity = "1";
		},
		reset: () => {
			if (cursorRef.current) {
				cursorRef.current.style.opacity = "0";
				cursorRef.current.style.transform = "translate(-9999px, -9999px)";
			}
		},
	};
}
