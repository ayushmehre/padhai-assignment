import React from "react";
import { Button } from "@/components/ui/button";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import useHighlighterControl from "@/hooks/useHighlighter";
import { useAudioPlayerControl } from "@/hooks/useAudioPlayer";
const InteractionToolbar = () => {
	const { isRecording, toggleRecording } = useVoiceRecorder();

	return (
		<div className="mt-4 self-center z-50 flex space-x-2">
			{/* <Button
				onClick={toggleRecording}
				variant={isRecording ? "destructive" : "default"}
			>
				{isRecording ? "Stop Recording" : "Record Answer"}
			</Button> */}
		</div>
	);
};

export default InteractionToolbar; 