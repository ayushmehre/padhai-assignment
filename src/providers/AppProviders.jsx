import { WebSocketProvider } from "./WebSocketProvider";
import { EmitProvider } from "./EmitProvider";
import { AudioProvider } from "./AudioProvider";
import { SessionProvider } from "./SessionProvider";

export function AppProviders({ children }) {
  return (
    <EmitProvider>
      <WebSocketProvider>
        <AudioProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </AudioProvider>
      </WebSocketProvider>
    </EmitProvider>
  );
}