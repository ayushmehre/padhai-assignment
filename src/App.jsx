import React from "react";
import { TutorProvider } from "@/providers/TutorProvider";
import AppInner from "@/AppInner";

const SOCKET = "ws://localhost:1234";

export default function App() {
  
  return (
    <TutorProvider socketUrl={SOCKET}>
      <AppInner />
    </TutorProvider>
  );
}
