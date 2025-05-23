import React, {
	useRef,
	forwardRef,
	useEffect,
	useState,
	useImperativeHandle,
} from "react";
import { Button } from "@/components/ui/button";
import "./../styles/cursor.css";
import { useInteractables } from "@/hooks/useInteractables";
import { usePointerControl } from "@/hooks/usePointerControl";
import InteractionToolbar from "./InteractionToolbar";
import useHighlighterControl from "@/hooks/useHighlighter";
import { useAudioPlayerControl } from "@/hooks/useAudioPlayer";
import { useSessionCtx } from "@/providers/SessionProvider";
import { useAudioCtx } from "@/providers/AudioProvider";
import { useWebSocketCtx } from "@/providers/WebSocketProvider";
const InteractableSlide = forwardRef(
	({ children }, ref) => {
		const containerRef = useRef(null);
		const cursorRef = useRef(null);
		const { startSession } = useSessionCtx();
		const { isUnlocked } = useAudioCtx();
		const { status } = useWebSocketCtx();
		useInteractables(containerRef);

		const pointer = usePointerControl(cursorRef, containerRef);
		const highlighter = useHighlighterControl();
        const audio = useAudioPlayerControl();

		const [hasStarted, setHasStarted] = useState(false);
		const [isBtnDisabled, setIsBtnDisabled] = useState(false);
		const slideApiRef = useRef({});

		useImperativeHandle(ref, () => ({
			...pointer,
			...highlighter,
			...audio,
		}));

		// Store API for local use
		useEffect(() => {
			slideApiRef.current = {
				...pointer,
				...highlighter,
				...audio,
			};
		}, [pointer, highlighter, audio]);

		const handleStartOrRestart = () => {
			if (isBtnDisabled) return; // Guard: ignore if disabled
			setIsBtnDisabled(true);
			// Reset pointer, highlights, audio
			slideApiRef.current.reset && slideApiRef.current.reset();
			slideApiRef.current.clearAll && slideApiRef.current.clearAll();
			slideApiRef.current.stop && slideApiRef.current.stop();
			startSession();
			setHasStarted(true);
			setTimeout(() => setIsBtnDisabled(false), 1500); // Re-enable after 1.5s
		};

		return (
			<div ref={containerRef} className="relative flex flex-col">
				<div>{children}</div>
				<div
					ref={cursorRef}
					className="pointer-events-none absolute z-50 w-4 h-4 bg-red-500 rounded-full transition-transform duration-300 ease-out"
					style={{ opacity: 0 }}
				/>
				<div className="mt-4 self-center z-50 flex flex-col items-center space-y-2">
					{(!isUnlocked || status !== "connected") && (
						<div className="text-sm text-yellow-600 mb-2">
							{!isUnlocked && "Audio is not unlocked. Click 'Start Session' or interact with the page to enable audio."}
							{status !== "connected" && "WebSocket is not connected. Please wait..."}
						</div>
					)}
					<div className="flex space-x-2">
						{startSession && (
							<Button id="btnStart" onClick={handleStartOrRestart} variant="default" disabled={isBtnDisabled}>
								{hasStarted ? "Restart Session" : "Start Session"}
							</Button>
						)}
						<InteractionToolbar/>
					</div>
				</div>
			</div>
		);
	}
);

export default InteractableSlide;
