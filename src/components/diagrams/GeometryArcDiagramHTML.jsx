export default function GeometryArcDiagramHtml() {
	return (
		<div
			id="diagramCanvas"
			className="relative w-[200px] h-[200px] border rounded bg-white"
		>
			{/* Full circle (background) */}
			<div
				className="absolute top-0 left-0 w-full h-full rounded-full bg-blue-100 border-2 border-black"
				style={{ boxSizing: "border-box" }}
			/>

			{/* Line OA (horizontal) */}
			<div
				className="absolute left-[100px] top-[100px] w-[80px] h-[2px] bg-black origin-left"
			/>

			{/* Line OB (angled 60°) */}
			<div
				className="absolute left-[100px] top-[100px] w-[80px] h-[2px] bg-black origin-left"
				style={{ transform: "rotate(-60deg)" }}
			/>

			{/* Pie Slice — 60° sector */}
			<div
				id="arcAB"
				data-role="interactable"
				data-type="shape"
				className="absolute left-0 top-0 w-[200px] h-[200px] rounded-full bg-red-500 opacity-60"
				style={{
					clipPath: "polygon(100px 100px, 180px 100px, 140px 30px)", // Triangle slice shape
				}}
			/>

			{/* Label for Arc AB */}
			<span className="absolute left-[150px] top-[80px] text-xs font-medium">
				Arc AB
			</span>
		</div>
	);
}
