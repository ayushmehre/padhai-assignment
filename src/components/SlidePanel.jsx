import React, { useRef } from "react";
import InteractableSlide from "@/components/InteractableSlide";
import QuestionSlide from "@/slides/QuestionSlide";
import { useSlideInteraction } from "@/hooks/useSlideInteraction";

export default function SlidePanel() {
  const slideRef = useRef(null);
  
  useSlideInteraction(slideRef);

  const onInteractablesDetected = React.useCallback((interactables) => {
    console.log("interactables", interactables);
  }, []);

  return (
    <div className="border rounded-lg bg-white dark:bg-gray-800 p-4 max-w-3xl mx-auto">
      <InteractableSlide ref={slideRef}>
        <QuestionSlide /> {/* Easily Swappable */}
      </InteractableSlide >
    </div>
  );
} 