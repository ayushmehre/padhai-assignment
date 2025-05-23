import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";

const AudioContextCtx = createContext(null);

export function AudioProvider({ children }) {
  const audioCtx = useRef(null);
  const [isUnlocked, setUnlocked] = useState(false);

  const initAudio = useCallback(() => {
    try {
      const AudioConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioConstructor) {
        console.warn("AudioContext is not supported in this browser.");
        return;
      }

      if (!audioCtx.current || audioCtx.current.state === "closed") {
        audioCtx.current = new AudioConstructor();
      }

      if (audioCtx.current.state === "suspended") {
        audioCtx.current.resume()
          .then(() => {
            console.info("AudioContext resumed");
            setUnlocked(true);
          })
          .catch((err) => {
            console.error("Failed to resume AudioContext:", err);
          });
      } else if (audioCtx.current.state === "running") {
        setUnlocked(true); // already unlocked
      }
    } catch (err) {
      console.error("Error initializing AudioContext:", err);
    }
  }, []);

  const value = useMemo(() => ({
    audioCtx,
    initAudio,
    isUnlocked,
  }), [initAudio, isUnlocked]);

  return (
    <AudioContextCtx.Provider value={value}>
      {children}
    </AudioContextCtx.Provider>
  );
}

export function useAudioCtx() {
  const ctx = useContext(AudioContextCtx);
  if (!ctx) {
    throw new Error("useAudioCtx must be used within an AudioProvider");
  }
  return ctx;
}
