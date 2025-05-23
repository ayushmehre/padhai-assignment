import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Diagram from "@/components/Diagram";
import GeometryArcDiagram from "@/components/diagrams/GeometryArcDiagram.jsx";

/**
 * Static markdown content for the question.
 * Interactable spans are parsed using rehype-raw for raw HTML support.
 */
const questionMarkdown = `
**Two radii OA and OB form a <span data-role="interactable" data-type="text" id="angle">60°</span> angle in a circle. The radius length is <span data-role="interactable" data-type="text" id="radius">5 cm</span>.**

a) Find the length of arc AB.  
b) What fraction of the circle's circumference does arc AB represent?
`;

export default function QuestionSlide({ markdown = questionMarkdown }) {
  return (
    <div className="space-y-6 flex flex-col items-center">
      {/* Problem Text */}
      <div id="problemText" className="p-4 border rounded w-full bg-white dark:bg-gray-900">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {markdown}
        </ReactMarkdown>
      </div>

      {/* Diagram Canvas */}
      <Diagram id="diagramCanvas">
        <GeometryArcDiagram />
        {/* Optionally switch with GeometryArcDiagramHTML if needed */}
      </Diagram>

      {/* Notes Area */}
      <textarea
        id="workspace"
        placeholder="Notes area (optional)"
        className="border p-2 rounded h-24 w-full bg-white dark:bg-gray-800"
      />
    </div>
  );
}
