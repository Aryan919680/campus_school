import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateSchool = ({ onNext }) => {
	const [schoolData, setSchoolData] = useState({
		schoolName: localStorage.getItem("schoolName") || "",
		location: localStorage.getItem("schoolLocation") || "",
		directorName : localStorage.getItem("schoolDirectorName") || "",
		foundedYear: localStorage.getItem("schoolFoundedYear") || "",
		logo: localStorage.getItem("schoolLogo") || "",
		schoolCode : localStorage.getItem("schoolCode")|| "",
		branchName: localStorage.getItem("schoolBranchName") || "",
	});
	const [logoPreview, setLogoPreview] = useState(
		localStorage.getItem("schoolLogo") || null
	);
	const [uploading, setUploading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(localStorage.getItem("selectedOptionBoard") || "");
    const [otherInput, setOtherInput] = useState("");
	const handleChange = (e) => {
		console.log(e)
		const { name, value } = e.target;
		setSchoolData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			setUploading(true);
			const reader = new FileReader();
			reader.onloadend = () => {
				setLogoPreview(reader.result);
			};
			reader.readAsDataURL(file);

			try {
				const formData = new FormData();
				formData.append("file", file);
				formData.append(
					"upload_preset",
					import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
				);

				const uploadResponse = await axios.post(
					`https://api.cloudinary.com/v1_1/${
						import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
					}/image/upload`,
					formData
				);

				const logoUrl = uploadResponse.data.secure_url;
				setSchoolData((prevData) => ({ ...prevData, logo: logoUrl }));
				localStorage.setItem("schoolLogo", logoUrl);
			} catch (error) {
				console.error("Error uploading logo:", error);
			} finally {
				setUploading(false);
			}
		}
	};

	const handleNext = () => {
		localStorage.setItem("schoolName", schoolData.schoolName);
		localStorage.setItem("schoolLocation", schoolData.location);
		localStorage.setItem("schoolFoundedYear", parseInt(schoolData.foundedYear));
        localStorage.setItem("schoolDirectorName", schoolData.directorName);
        localStorage.setItem("selectedOptionBoard", selectedOption);
		localStorage.setItem("schoolCode", schoolData.schoolCode);
		localStorage.setItem("schoolBranchName", schoolData.schoolBranchName);
		onNext();
	};

    const options = [
            { value: "CBSE", label: "C.B.S.E" },
            { value: "ICSE", label: "I.C.S.E" },
        ];
    
     
    
        const handleSelect = (event) => {
            const value = event.target.value;
            setSelectedOption(value);
            if (e.target.value !== "other") {
                setOtherInput(""); 
            }
        };

	return (
		<form>
			<h2 className="text-2xl font-semibold mb-4">Create School</h2>

			<div>
				<label
					htmlFor="schoolName"
					className="block text-sm font-medium text-gray-700"
				>
					School Name
				</label>
				<input
					id="schoolName"
					name="schoolName"
					type="text"
					value={schoolData.schoolName}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
				/>
			</div>

            <div className="mb-4">
    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
        Select School Board
    </label>
    <select
        id="category"
        value={selectedOption}
        onChange={handleSelect}
       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    >
        <option value="" disabled>
            -- Select an option --
        </option>
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
        <option value="other">Other</option>
    </select>

    {selectedOption === "other" && (
        <div className="mt-2">
            <label htmlFor="otherInput" className="block text-gray-700 font-semibold mb-2">
                Specify Other:
            </label>
            <input
                type="text"
                id="otherInput"
                value={otherInput}
                onChange={(e) => setOtherInput(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your option"
            />
        </div>
    )}
</div>


<div>
				<label
					htmlFor="schoolCode"
					className="block text-sm font-medium text-gray-700"
				>
					UDISE Code
				</label>
				<input
					id="schoolCode"
					name="schoolCode"
					type="number"
					value={schoolData.schoolCode}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
				/>
			</div>

			<div>
				<label
					htmlFor="location"
					className="block text-sm font-medium text-gray-700"
				>
					Address
				</label>
				<input
					id="location"
					name="location"
					type="text"
					value={schoolData.location}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
				/>
			</div>
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
                    value={schoolData.branchName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                />
            </div>
			<div>
				<label
					htmlFor="foundedYear"
					className="block text-sm font-medium text-gray-700"
				>
					Founded Year
				</label>
				<input
					id="foundedYear"
					name="foundedYear"
					type="number"
					value={schoolData.foundedYear}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
				/>
			</div>

			<div>
				<label
					htmlFor="foundedYear"
					className="block text-sm font-medium text-gray-700"
				>
					Director Name
				</label>
				<input
					id="directorName"
					name="directorName"
					type="name"
					value={schoolData.directorName}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
				/>
			</div>

			<div className="mt-4">
				<label className="block text-sm font-medium text-gray-700">
					School Logo
				</label>
				<input
					type="file"
					onChange={handleFileChange}
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
				/>
				{logoPreview && (
					<img
						src={logoPreview}
						alt="Logo Preview"
						className="mt-4 w-24 h-24"
					/>
				)}
			</div>

			<button
				type="button"
				onClick={handleNext}
				disabled={uploading}
				className="mt-4 w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
			>
				Next
			</button>
		</form>
	);
};

export default CreateSchool;
