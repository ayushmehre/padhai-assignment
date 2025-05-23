import React, { createContext, useContext, useRef, useEffect, useMemo, useCallback, useState } from "react";
import useWebSocket from "@/hooks/useWebSocket";
import { useEmitCtx } from "./EmitProvider";
import createRingBuffer from "@/lib/createRingBuffer";
import { STATUS } from "./websocketStatus";

const SOCKET_URL = "ws://localhost:1234";
const RING_BUFFER_SIZE = 50;

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
  const wsRef = useWebSocket(SOCKET_URL);
  const buffer = useRef(createRingBuffer(RING_BUFFER_SIZE)).current;
  const [status, setStatus] = useState(STATUS.DISCONNECTED);
  const { emit } = useEmitCtx();

  useEffect(() => {
    const ws = wsRef.current;
    if (!ws) return;
    setStatus(STATUS.CONNECTED);

    const handleOpen = () => {
      setStatus(STATUS.CONNECTED);
    };
    const handleClose = () => {
      setStatus(STATUS.DISCONNECTED);
    };
    const handleError = () => {
      setStatus(STATUS.ERROR);
    };
    const handleMessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        buffer.push(msg);
        emit("tutor", msg);
      } catch (err) {
        console.error("bad WebSocket payload:", err);
      }
    };

    ws.addEventListener("open", handleOpen);
    ws.addEventListener("close", handleClose);
    ws.addEventListener("error", handleError);
    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("close", handleClose);
      ws.removeEventListener("error", handleError);
      ws.removeEventListener("message", handleMessage);
    };
  }, [wsRef, buffer, emit]);

  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, [wsRef]);

  const value = useMemo(() => ({ wsRef, buffer, send, status }), [wsRef, buffer, send, status]);

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketCtx() {
  return useContext(WebSocketContext);
} 