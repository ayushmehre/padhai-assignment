import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useMemo,
  } from "react";
  import mitt from "mitt";
  import createRingBuffer from "@/lib/createRingBuffer";
  
  const TutorContext = createContext(null);
  const RECONNECT_DELAY_MS = 2_000;
  const RING_BUFFER_SIZE  = 50;
  
  export function TutorProvider({ socketUrl, children }) {
    const emitter  = useRef(mitt()).current;
    const buffer   = useRef(createRingBuffer(RING_BUFFER_SIZE)).current;
    const wsRef    = useRef(null);
  
    useEffect(() => {
      let retry = 0;
      let alive = true;
  
      function connect() {
        if (!alive) return;
        const ws = new WebSocket(socketUrl);
        wsRef.current = ws;
  
        ws.onopen = () => {
          console.info("🟢 Tutor WS connected");
          retry = 0;
        };
  
        ws.onmessage = (e) => {
          try {
            const msg = JSON.parse(e.data);
            buffer.push(msg);
            emitter.emit("tutor", msg);
            console.log("Received message:", msg);
          } catch (err) {
            console.error("❌ bad tutor payload:", err);
          }
        };
  
        ws.onclose = () => {
          console.warn("🔌 Tutor WS closed, retrying…");
          retry += 1;
          setTimeout(connect, RECONNECT_DELAY_MS * retry);
        };
  
        ws.onerror = (err) => {
          console.error("❌ Tutor WS error:", err);
          ws.close();
        };
      }
  
      connect();
      return () => {
        alive = false;
        wsRef.current?.close();
      };
    }, [socketUrl, emitter, buffer]);
  
    const value = useMemo(
      () => ({
        on:  (fn) => emitter.on ("tutor", fn),
        off: (fn) => emitter.off("tutor", fn),
        replay: () => buffer.read(),
        send: (data) => wsRef.current?.readyState === 1 && wsRef.current.send(JSON.stringify(data)),
      }),
      [emitter, buffer]
    );
  
    return (
          <TutorContext.Provider value={value}>
            {children}
          </TutorContext.Provider>
        );

  }
  
  export function useTutorEvents(slideId, handler) {
    const ctx = useContext(TutorContext);
    if (!ctx) throw new Error("useTutorEvents must be used inside <TutorProvider>");
  
    const { on, off, replay } = ctx;
  
    useEffect(() => {
      if (!handler) return;
  
      const wrapped = (msg) => {
        if (!slideId || msg.slideId === slideId) {
          handler(msg);
        }
      };
  
      on(wrapped);
      replay().forEach(wrapped);
      return () => off(wrapped);
    }, [slideId, handler, on, off, replay]);
  }

 export function useTutorCtx() {
  const ctx = useContext(TutorContext);
  if (!ctx) throw new Error("⚠ useTutorCtx() outside <TutorProvider>");
  return ctx;
}
