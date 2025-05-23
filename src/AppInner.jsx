import React, { useState, useEffect } from "react";
import SlidePanel from "@/components/SlidePanel";
import SettingsPanel from "@/components/SettingsPanel";
import { FiSettings } from "react-icons/fi";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
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
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="ml-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none"
              aria-label="Open settings"
            >
              <FiSettings className="w-6 h-6" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Settings</DialogTitle>
            <SettingsPanel dark={dark} setDark={setDark} />
          </DialogContent>
        </Dialog>
      </header>
      <SlidePanel />
    </div>
  );
} 