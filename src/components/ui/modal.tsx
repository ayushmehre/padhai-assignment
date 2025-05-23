import * as React from "react";
import { createPortal } from "react-dom";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	className?: string;
}

export function Modal({ open, onClose, children, className }: ModalProps) {
	React.useEffect(() => {
		if (!open) return;
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, onClose]);

	if (!open) return null;

	return createPortal(
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
			onClick={onClose}
			aria-modal="true"
			role="dialog"
			tabIndex={-1}
		>
			<div
				className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 min-w-[320px] max-w-full relative ${
					className || ""
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<button
					className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:hover:text-white text-xl font-bold focus:outline-none"
					aria-label="Close settings"
					onClick={onClose}
				>
					×
				</button>
				{children}
			</div>
		</div>,
		document.body
	);
}
