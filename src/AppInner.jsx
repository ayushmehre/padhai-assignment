import React, { useState, useEffect, useRef } from "react";
import SlidePanel from "@/components/SlidePanel";
import SettingsPanel from "@/components/SettingsPanel";
const THEME_KEY = "vite-ui-theme";
export default function AppInner() {
  const [dark, setDark] = useState(() => localStorage.getItem(THEME_KEY) === "dark");
 
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen p-6 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
      <header className="flex justify-between items-center max-w-3xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">AI-Tutor Geometry Board</h1>
        <SettingsPanel dark={dark} setDark={setDark} />
      </header>
      <SlidePanel />
    </div>
  );
} 