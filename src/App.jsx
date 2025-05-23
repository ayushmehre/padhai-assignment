import React from "react";
import { AppProviders } from "@/providers/AppProviders";
import AppInner from "@/AppInner";

export default function App() {
  return (
    <AppProviders>
      <AppInner />
    </AppProviders>
  );
}
