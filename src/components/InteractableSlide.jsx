import React, {
	useRef,
	forwardRef,
	useState,
	useImperativeHandle,
} from "react";
import { Button } from "@/components/ui/button";
import "./../styles/cursor.css";
import { useInteractables } from "@/hooks/useInteractables";
import { usePointerControl } from "@/hooks/usePointerControl";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import useHighlighterControl from "@/hooks/useHighlighter";
import { useAudioPlayerControl } from "@/hooks/useAudioPlayer";

const InteractableSlide = forwardRef(
	({ children, onInteractablesDetected, socketRef, startSession }, ref) => {
		const containerRef = useRef(null);
		const cursorRef = useRef(null);

		useInteractables(containerRef, onInteractablesDetected);

		const pointer = usePointerControl(cursorRef, containerRef);
		const highlighter = useHighlighterControl();
		const audio = useAudioPlayerControl();

		useImperativeHandle(ref, () => ({
		...pointer,
		...highlighter,
		...audio,
		}));

		const { isRecording, toggleRecording } = useVoiceRecorder(socketRef);
  		const [sessionStarted, setStarted] = useState(false);
		

		return (
			<div ref={containerRef} className="relative flex flex-col">
				<div>{children}</div>
				<div
					ref={cursorRef}
					className="pointer-events-none absolute z-50 w-4 h-4 bg-red-500 rounded-full transition-transform duration-300 ease-out"
					style={{ opacity: 0 }}
				/>
				<div className="mt-4 self-center z-50 flex space-x-2">
					{startSession && (
						<Button id="btnStart" onClick={startSession} variant="default">
							Start Session
						</Button>
					)}
					<Button
						onClick={toggleRecording}
						variant={isRecording ? "destructive" : "default"}
					>
						{isRecording ? "🔴 Stop Recording" : "🎤 Record Answer"}
					</Button>
				</div>
			</div>
		);
	}
);

export default InteractableSlide;
