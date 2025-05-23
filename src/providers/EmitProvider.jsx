import React, { createContext, useContext, useMemo, useEffect } from "react";
import mitt from "mitt";

const EmitContext = createContext();

export function EmitProvider({ children }) {
  const emitter = useMemo(() => mitt(), []);
  const value = useMemo(() => ({
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
  }), [emitter]);

  return (
    <EmitContext.Provider value={value}>
      {children}
    </EmitContext.Provider>
  );
}

export function useEmitCtx() {
  const ctx = useContext(EmitContext);
  if (!ctx) {
    throw new Error("useEmitCtx must be used within an EmitProvider");
  }
  return ctx;
}


export function useMittListener(eventName, handler) {
  const { on, off } = useEmitCtx();

  useEffect(() => {
    on(eventName, handler);
    return () => off(eventName, handler);
  }, [eventName, handler, on, off]);
}


