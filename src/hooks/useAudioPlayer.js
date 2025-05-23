import playBase64Audio from "@/lib/playBase64Audio";
import { useAudioCtx } from "@/providers/AudioProvider";
import { useRef } from "react";

export function useAudioPlayerControl() {
	const { isUnlocked } = useAudioCtx();
	const audioRef = useRef(null);
	return {
		playAudio: async (base64) => {
			if (!isUnlocked) {
				console.warn("AudioContext is not unlocked. Cannot play audio.");
				return;
			}
			try {
				// Stop any currently playing audio
				if (audioRef.current) {
					audioRef.current.pause();
					audioRef.current.currentTime = 0;
				}
				const src = base64.startsWith("data:")
					? base64
					: `data:audio/mp3;base64,${base64}`;
				const audio = new Audio(src);
				audioRef.current = audio;
				audio.volume = 1.0;
				audio.play().catch((err) => {
					console.error("Audio.play() error:", err);
				});
				audio.addEventListener("ended", () => {
					audioRef.current = null;
				});
				audio.addEventListener("error", () => {
					audioRef.current = null;
				});
			} catch (err) {
				console.error("Failed to play audio:", err);
			}
		},
		stop: () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
				audioRef.current = null;
			}
		},
	};
}
