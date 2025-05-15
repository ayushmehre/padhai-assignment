// GeometryArcDiagram.tsx
export default function GeometryArcDiagram() {
	return (
		<svg width="200" height="200" viewBox="0 0 200 200">
			<circle
				cx="100"
				cy="100"
				r="80"
				stroke="black"
				strokeWidth="2"
				fill="none"
			/>
			<line x1="100" y1="100" x2="180" y2="100" stroke="black" />
			<line x1="100" y1="100" x2="140" y2="30" stroke="black" />
			<path
				id="arcAB"
				data-role="interactable"
				data-type="shape"
				d="M 180 100 A 80 80 0 0 0 140 30"
				stroke="red"
				strokeWidth="3"
				fill="none"
			/>
			<text x="160" y="80" fontSize="12">
				Arc AB
			</text>
		</svg>
	);
}
