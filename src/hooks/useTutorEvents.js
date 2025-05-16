import { useContext, useEffect } from "react";
import { TutorContext } from "@/context/TutorContext";

export function useTutorEvents(slideId, handler) {
	const ctx = useContext(TutorContext);
	if (!ctx)
		throw new Error("useTutorEvents must be used inside <TutorProvider>");

	const { on, off, replay } = ctx;

	useEffect(() => {
		if (!handler) return;

		const wrapped = (msg) => {
			if (!slideId || msg.slideId === slideId) {
				handler(msg);
			}
		};

		on(wrapped);
		replay().forEach(wrapped);
		return () => off(wrapped);
	}, [slideId, handler, on, off, replay]);
}
