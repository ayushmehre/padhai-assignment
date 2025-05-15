export default function playBase64Audio(base64) {
	return new Promise((resolve, reject) => {
		try {
			const src = base64.startsWith("data:")
				? base64
				: `data:audio/mp3;base64,${base64}`;
			const audio = new Audio(src);
			audio.addEventListener("ended", resolve);
			audio.addEventListener("error", (e) => reject(e));
			audio.play().catch(reject);
		} catch (err) {
			reject(err);
		}
	});
}
