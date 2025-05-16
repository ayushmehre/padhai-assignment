import { createContext, useContext } from "react";

export const TutorContext = createContext(null);

export function useTutorCtx() {
	const ctx = useContext(TutorContext);
	if (!ctx) throw new Error("⚠ useTutorCtx() outside <TutorProvider>");
	return ctx;
}
