export default function playBase64Audio(
	base64,
	{ mimeType = "audio/mp3", volume = 1.0 } = {}
) {
	return new Promise((resolve, reject) => {
		try {
			const src = base64.startsWith("data:")
				? base64
				: `data:${mimeType};base64,${base64}`;

			const audio = new Audio(src);
			audio.volume = volume;

			// Success & error listeners
			audio.addEventListener("ended", resolve);
			audio.addEventListener("error", (e) =>
				reject(new Error("Audio playback failed"))
			);

			const playResult = audio.play();

			// Handle promise-based play errors (autoplay blocked, etc.)
			if (playResult instanceof Promise) {
				playResult.catch((err) => {
					console.error("Audio.play() error:", err);
					reject(err);
				});
			}
		} catch (err) {
			console.error("Base64 audio failed:", err);
			reject(err);
		}
	});
}
