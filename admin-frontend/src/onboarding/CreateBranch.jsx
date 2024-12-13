import React, { useState, useEffect } from "react";

const CreateBranch = ({ onNext, onPrevious }) => {
	const [branchData, setBranchData] = useState({
		branchName: localStorage.getItem("branchName") || "",
		location: localStorage.getItem("branchLocation") || "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setBranchData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleNext = () => {
		localStorage.setItem("branchName", branchData.branchName);
		localStorage.setItem("branchLocation", branchData.location);

		onNext(); // Move to the next step
	};

	return (
		<form>
			<h2 className="text-2xl font-semibold mb-4">Create Branch</h2>

			<div className="mb-4">
				<label
					htmlFor="branchName"
					className="block text-sm font-medium text-gray-700"
				>
					Branch Name
				</label>
				<input
					id="branchName"
					name="branchName"
					type="text"
					value={branchData.branchName}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
					required
				/>
			</div>

			<div className="mb-4">
				<label
					htmlFor="location"
					className="block text-sm font-medium text-gray-700"
				>
					Location
				</label>
				<input
					id="location"
					name="location"
					type="text"
					value={branchData.location}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
					required
				/>
			</div>

			<div className="flex justify-between gap-2">
				<button
					type="button"
					onClick={onPrevious}
					className="py-2 px-4 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700"
				>
					Previous
				</button>
				<button
					type="button"
					onClick={handleNext}
					className="py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 w-full"
				>
					Next
				</button>
			</div>
		</form>
	);
};

export default CreateBranch;
