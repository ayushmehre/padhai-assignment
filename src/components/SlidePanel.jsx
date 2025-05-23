import React, { useRef, useCallback } from "react";
import InteractableSlide from "@/components/InteractableSlide";
import QuestionSlide from "@/slides/QuestionSlide";
import { useSlideInteraction } from "@/hooks/useSlideInteraction";

export default function SlidePanel() {
  const slideRef = useRef(null);

  const onInteractablesDetected = useCallback((interactables) => {
    console.log("Interactables found:", interactables);
  }, []);

  useSlideInteraction(slideRef, { onDetect: onInteractablesDetected });

  return (
    <div className="border rounded-lg bg-white dark:bg-gray-800 p-4 max-w-3xl mx-auto shadow-sm">
      <InteractableSlide ref={slideRef}>
        <QuestionSlide />
      </InteractableSlide>
    </div>
  );
}
