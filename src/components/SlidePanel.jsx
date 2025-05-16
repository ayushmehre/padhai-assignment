
import React, { useRef } from "react";
import InteractableSlide from "@/components/InteractableSlide";
import QuestionSlide from "@/slides/QuestionSlide";
import { useTutorEvents } from "@/hooks/useTutorEvents";
import { useTutorCtx } from "@/context/TutorContext";

export default function SlidePanel() {
  const slideRef = useRef(null);
  const { startSession } = useTutorCtx();
  useTutorEvents("geometry-001", async (msg) => {
    switch (msg.mode) {
      case "POINT":
        slideRef.current?.pointTo(msg.payload.elementId);
        break;
      case "HIGHLIGHT":
        slideRef.current?.highlight("angle");
        await new Promise(resolve => setTimeout(resolve, 1000));
        slideRef.current?.highlight("radius");
        break;
      case "AUDIO":
        slideRef.current?.playAudio(msg.payload.chunk);
        break;
    }
  });

  return (
    <div className="border rounded-lg bg-white dark:bg-gray-800 p-4 max-w-3xl mx-auto">
      <InteractableSlide ref={slideRef}>
        <QuestionSlide />
      </InteractableSlide>
    </div>
  );
} 