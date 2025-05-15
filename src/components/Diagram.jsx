import React from "react";

export default function Diagram({ children }) {
	return (
		<div id="diagramCanvas" className="border rounded bg-white p-4">
			{children}
		</div>
	);
}
