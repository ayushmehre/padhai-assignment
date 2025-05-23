import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useAudioCtx } from "./AudioProvider";
import { useWebSocketCtx } from "./WebSocketProvider";
import { EVENT_START_SESSION } from "@/events";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const { initAudio } = useAudioCtx();
  const { wsRef } = useWebSocketCtx();
  const [latency, setLatency] = useState(0);

  const startSession = useCallback(() => {
    try {
      initAudio(); // Try to unlock audio context (must be triggered by user)
      const socket = wsRef?.current;

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({ mode: EVENT_START_SESSION, latencyMs: latency })
        );
      } else {
        console.warn("WebSocket not ready. Session not started.");
      }
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  }, [initAudio, wsRef, latency]);

  const value = useMemo(() => ({
    latency,
    setLatency,
    startSession,
  }), [latency, startSession]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionCtx() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSessionCtx must be used within a SessionProvider");
  }
  return ctx;
}
