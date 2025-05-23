import React from "react";
import { Button } from "@/components/ui/button";
import useHighlighterControl from "@/hooks/useHighlighter";
import { useAudioPlayerControl } from "@/hooks/useAudioPlayer";
const InteractionToolbar = () => {
	// useVoiceRecorder is not used
	return (
		<div className="mt-4 self-center z-50 flex space-x-2">
			{/* Voice recorder button was here, but is commented out */}
		</div>
	);
};

export default InteractionToolbar; 