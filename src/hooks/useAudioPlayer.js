import playBase64Audio from "/src/lib/playBase64Audio.js";

export function useAudioPlayerControl() {
	return {
		playAudio: async (base64) => {
			try {
				await playBase64Audio(base64);
			} catch (err) {
				console.error("Failed to play audio:", err);
			}
		},
	};
}
