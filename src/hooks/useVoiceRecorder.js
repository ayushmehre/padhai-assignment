import { useState, useRef, useEffect } from "react";
import { useTutorCtx } from "@/context/TutorContext";

export function useVoiceRecorder() {
	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const { socketRef } = useTutorCtx();

	const toggleRecording = async () => {
		if (isRecording) {
			if (
				mediaRecorderRef.current &&
				mediaRecorderRef.current.state === "recording"
			) {
				mediaRecorderRef.current.stop();
			}
			setIsRecording(false);
		} else {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				mediaRecorderRef.current = new MediaRecorder(stream);
				audioChunksRef.current = [];

				mediaRecorderRef.current.ondataavailable = (event) => {
					audioChunksRef.current.push(event.data);
				};

				mediaRecorderRef.current.onstop = () => {
					const fakeTranscript = "The angle is 60 degrees.";
					if (
						socketRef &&
						socketRef.current &&
						socketRef.current.readyState === WebSocket.OPEN
					) {
						socketRef.current.send(
							JSON.stringify({
								mode: "SPEECH",
								payload: {
									text: fakeTranscript,
								},
							})
						);
						console.log("🎤 Sent SPEECH with fake transcript:", fakeTranscript);
					} else {
						console.warn("🎤 WebSocket not open. Cannot send SPEECH message.");
					}
					stream.getTracks().forEach((track) => track.stop());
				};

				mediaRecorderRef.current.start();
				setIsRecording(true);
			} catch (err) {
				console.error("🎤 Error accessing microphone:", err);
			}
		}
	};

	useEffect(() => {
		return () => {
			if (
				mediaRecorderRef.current &&
				mediaRecorderRef.current.state === "recording"
			) {
				mediaRecorderRef.current.stop();
			}
			if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
				mediaRecorderRef.current.stream
					.getTracks()
					.forEach((track) => track.stop());
			}
		};
	}, []);

	return { isRecording, toggleRecording };
}
