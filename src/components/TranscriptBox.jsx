import React from "react";

const TranscriptBox = ({ transcript }) => {
	if (!transcript) {
		return null; // Don't render if there's no transcript
	}

	return (
		<div className="p-4 mt-4 bg-blue-50 border border-blue-200 rounded-lg shadow">
			<p className="text-sm text-blue-700">
				<span className="font-semibold">Tutor:</span> {transcript}
			</p>
		</div>
	);
};

export default TranscriptBox; 