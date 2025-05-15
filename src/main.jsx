import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
  // If the root element is not found, throw an error to stop execution.
  // This is a critical failure for a React app as it cannot be mounted.
  throw new Error("Failed to find the root element with ID 'root'. Make sure your HTML file has an element with this ID.");
}

createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>
);
