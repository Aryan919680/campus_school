import React, { useState } from "react";

const CustomRadio = () => {
	const [selectedOption, setSelectedOption] = useState("");

	const handleRadioChange = (value) => {
		setSelectedOption(value);
	};

	return (
		<div className="flex gap-2 justify-end">
			{/* Absent Radio Button */}
			<div className="flex items-center">
				<input
					id="absent-radio"
					type="radio"
					name="attendance"
					className="hidden"
					value="Absent"
					checked={selectedOption === "Absent"}
					onChange={() => handleRadioChange("Absent")}
				/>
				<label
					htmlFor="absent-radio"
					className={`flex items-center justify-center w-8 h-8 border-2 rounded-full text-red-500 font-bold cursor-pointer 
                                ${
																	selectedOption === "Absent"
																		? "bg-red-500 border-red-500 text-white"
																		: "bg-white border-gray-300 text-gray-800"
																}`}
				>
					A
				</label>
			</div>
			{/* Present Radio Button */}
			<div className="flex items-center">
				<input
					id="present-radio"
					type="radio"
					name="attendance"
					className="hidden"
					value="Present"
					checked={selectedOption === "Present"}
					onChange={() => handleRadioChange("Present")}
				/>
				<label
					htmlFor="present-radio"
					className={`flex items-center justify-center w-8 h-8 border-2 rounded-full text-green-500 font-bold cursor-pointer 
                                ${
																	selectedOption === "Present"
																		? "bg-green-500 border-green-500 text-white"
																		: "bg-white border-gray-300 text-gray-800"
																}`}
				>
					P
				</label>
			</div>
		</div>
	);
};

export default CustomRadio;
