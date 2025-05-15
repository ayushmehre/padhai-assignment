import React, { useState, useEffect, useRef } from "react";
import { useTutorCtx } from "@/providers/TutorProvider";
import useTranscript from "@/hooks/useTranscript";
import SlidePanel from "@/components/SlidePanel";
import SettingsPanel from "@/components/SettingsPanel";
import TranscriptBox from "@/components/TranscriptBox";
import { useTutorEvents } from "@/providers/TutorProvider";
const THEME_KEY = "vite-ui-theme";
const SLIDE_ID = "geometry-001";

export default function AppInner() {
  const { send } = useTutorCtx();
  const [latency, setLatency] = useState(0);
  const [dark, setDark] = useState(() => localStorage.getItem(THEME_KEY) === "dark");
  const audioCtx = useRef(null);
  const transcript = useTranscript(SLIDE_ID);
  

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    audioCtx.current = new AudioContext();
  }, []);

  

  const startSession = () => {
    if (audioCtx.current?.state === "suspended") audioCtx.current.resume();
    send({ mode: "START_SESSION", latencyMs: latency });
  };

  return (
    <div className="min-h-screen p-6 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
      <header className="flex justify-between items-center max-w-3xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">AI-Tutor Geometry Board</h1>
        <SettingsPanel dark={dark} setDark={setDark} latency={latency} setLatency={setLatency} />
      </header>

      <TranscriptBox transcript={transcript} />
      <SlidePanel slideId={SLIDE_ID} startSession={startSession} />
    </div>
  );
} 