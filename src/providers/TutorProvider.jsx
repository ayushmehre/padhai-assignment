import React, {
    useEffect,
    useMemo,
    useRef,
    useCallback,
    useState,
  } from "react";
  import { TutorContext } from "@/context/TutorContext";
  import { useWebSocket, useEmitter, useRingBuffer } from '@/hooks';
  import { SOCKET_URL, RING_BUFFER_SIZE } from "@/config/socket";
  
  export function TutorProvider({ children }) {
    const emitter = useEmitter();
    const buffer = useRingBuffer(RING_BUFFER_SIZE);
    const wsRef = useWebSocket(SOCKET_URL);
    const audioCtx = useRef(null);
    const [latency, setLatency] = useState(0);

    const startSession = useCallback(() => {
      if (!audioCtx.current || audioCtx.current.state === "closed") {
        audioCtx.current = new AudioContext();
      }
    
      if (audioCtx.current.state === "suspended") {
        audioCtx.current.resume();
      }
    
      wsRef.current?.send(JSON.stringify({ mode: "START_SESSION", latencyMs: latency }));
    }, [latency, wsRef]);
    
    useEffect(() => {
      const ws = wsRef.current;
      if (!ws) return;
  
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          buffer.push(msg);
          emitter.emit("tutor", msg);
          console.log("Received message:", msg);
        } catch (err) {
          console.error("bad tutor payload:", err);
        }
      };
      
      return () => {
        if (ws) {
          // ws.onmessage = null; // Clean up
        }
      };
    }, [wsRef, buffer, emitter]);
  
    const value = useMemo(
      () => ({
        on:  (fn) => emitter.on ("tutor", fn),
        off: (fn) => emitter.off("tutor", fn),
        replay: () => buffer.read(),
        send: (data) => wsRef.current?.readyState === 1 && wsRef.current.send(JSON.stringify(data)),
        socketRef: wsRef,
        startSession,
        latency,
        setLatency,
      }),
      [emitter, buffer, wsRef, startSession, latency, setLatency]
    );
  
    return (
          <TutorContext.Provider value={value}>
            {children}
          </TutorContext.Provider>
        );

  }
