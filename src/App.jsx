import React, { useState } from "react";
import { TutorProvider } from "@/providers/TutorProvider";
import AppInner from "@/AppInner";

export default function App() {

  return (
    <TutorProvider>
      <AppInner />
    </TutorProvider>
  );
}
