import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Diagram from "@/components/Diagram";
import GeometryArcDiagram from "@/components/diagrams/GeometryArcDiagram.jsx";
import GeometryArcDiagramHTML from "@/components/diagrams/GeometryArcDiagramHTML.jsx";
const questionMarkdown = `
**Two radii OA and OB form a <span data-role="interactable" data-type="text" id="angle">60°</span> angle in a circle. The radius length is <span data-role="interactable" data-type="text" id="radius">5 cm</span>.**

a) Find the length of arc AB.  
b) What fraction of the circle's circumference does arc AB represent?
`;

export default function QuestionSlide() {
	return (
		<div className="space-y-6 flex flex-col items-center">
			<div id="problemText" className="p-4 border rounded w-full">
				<ReactMarkdown rehypePlugins={[rehypeRaw]}>{
					questionMarkdown
					}</ReactMarkdown>
			</div>

			<Diagram id="diagramCanvas">
				<GeometryArcDiagram/>
				{/* <GeometryArcDiagramHTML/> */}
			</Diagram>

			<textarea
				id="workspace"
				placeholder="Notes area (optional)"
				className="border p-2 rounded h-24 w-full"
			/>
		</div>
	);
} 