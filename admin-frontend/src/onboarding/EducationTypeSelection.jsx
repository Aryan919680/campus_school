import React, { useState } from "react";

const EducationTypeSelection = ({ onNext }) => {
	const [educationType, setEducationType] = useState("");
	const [boardType, setBoardType] = useState("");

	const handleNext = () => {
		if (educationType === "school" && !boardType) {
			alert("Please select a board type for school.");
			return;
		}
		onNext({ educationType, boardType });
	};

	return (
		<div className="p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-semibold mb-6 text-center">
				Education Type
			</h2>

			<div className="mb-6">
				<p className="mb-2 font-medium">Select your institution type:</p>
				<div className="flex space-x-4">
					<label className="flex items-center">
						<input
							type="radio"
							value="school"
							checked={educationType === "school"}
							onChange={(e) => setEducationType(e.target.value)}
							className="mr-2"
						/>
						School
					</label>
					<label className="flex items-center">
						<input
							type="radio"
							value="college"
							checked={educationType === "college"}
							onChange={(e) => setEducationType(e.target.value)}
							className="mr-2"
						/>
						College
					</label>
				</div>
			</div>

			{educationType === "school" && (
				<div className="mb-6">
					<p className="mb-2 font-medium">Select board type:</p>
					<div className="flex space-x-4">
						{["CBSE", "State Board", "ICSE"].map((board) => (
							<label key={board} className="flex items-center">
								<input
									type="radio"
									value={board}
									checked={boardType === board}
									onChange={(e) => setBoardType(e.target.value)}
									className="mr-2"
								/>
								{board}
							</label>
						))}
					</div>
				</div>
			)}

			<button
				onClick={handleNext}
				disabled={!educationType}
				className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
					educationType
						? "bg-green-600 hover:bg-green-700"
						: "bg-gray-400 cursor-not-allowed"
				}`}
			>
				Next
			</button>
		</div>
	);
};

export default EducationTypeSelection;
