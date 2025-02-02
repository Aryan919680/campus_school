import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../API/apiEndpoints";
const CreateRole = ({ onPrevious, onSubmit }) => {
	const [roleData, setRoleData] = useState({
		name: localStorage.getItem("collegeAdminName") || "",
		email: localStorage.getItem("collegeAdminEmail") || "",
		branchId: Number(localStorage.getItem("collegeBranchId")) || "",
		role: "admin", // Automatically set to "admin"
		photo: null,
	});
	const [isValid, setIsValid] = useState(false);
	const [password, setPassword] = useState(localStorage.getItem("collegeAdminPassword") || "");

	 const options = [
			{ value: "dean", label: "DEAN" },
			{ value: "hod", label: "HOD" },
		];
	
		const [selectedOption, setSelectedOption] = useState("");
	
		const handleSelect = (event) => {
			const value = event.target.value;
			setSelectedOption(value);
	
		};
	const [photoPreview, setPhotoPreview] = useState(
		localStorage.getItem("collegeAdminPhoto") || ""
	);

	const collegeData = {
		name: localStorage.getItem("campusName") || "",
		type: "COLLEGE",
		location: localStorage.getItem("campusLocation") || "",
		campus_details: {
			college: {
				code : localStorage.getItem("collegeCode") || 0,
				address: "",
				director: localStorage.getItem("directorName") || "",
				year: Number(localStorage.getItem("campusFoundedYear")) || 0,
			}
		},
		admin: {
			role: "admin",
			email: localStorage.getItem("collegeAdminEmail") || "",
			password: localStorage.getItem("collegeAdminPassword") || "",
			name:  "",
		}

	};


	const handleChange = (e) => {
		const { name, value } = e.target;
		setRoleData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		setRoleData((prevData) => ({ ...prevData, photo: file }));

		const reader = new FileReader();
		reader.onloadend = () => {
			setPhotoPreview(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const handleNext = async () => {
		try {
			let photoUrl = localStorage.getItem("collegeAdminPhoto");

			if (roleData.photo) {
				const formData = new FormData();
				formData.append("file", roleData.photo);
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

				photoUrl = uploadResponse.data.secure_url;
				localStorage.setItem("collegeAdminPhoto", photoUrl);
			}

			localStorage.setItem("collegeAdminName", roleData.name);
			localStorage.setItem("collegeAdminEmail", roleData.email);
			localStorage.setItem("collegeAdminRole", roleData.role); // Always "admin"
			localStorage.setItem("collegeAdminPassword", password);
			handleSubmit();
		} catch (error) {
			console.error("Error uploading photo:", error);
		}
	};

	const validatePassword = (value) => {
		const conditions = {
		  hasUpperCase: /[A-Z]/.test(value),
		  hasLowerCase: /[a-z]/.test(value),
		  hasNumber: /\d/.test(value),
		  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
		  isLongEnough: value.length > 8,
		};
	
		const allValid = Object.values(conditions).every((condition) => condition);
		setIsValid(allValid);
		return allValid;
	  };

	  	
	const handlePasswordChange = (e) => {
		const value = e.target.value;
		setPassword(value);
		validatePassword(value);
	  };

	  const handleSubmit = async () => {
		console.log(collegeData)
		try {
			const headers = {
				"Content-Type": "application/json",
				Accept: "application/json",
			};
				const schoolResponse = await axios.post(
					API_ENDPOINTS.CREATE_CAMPUS,


					collegeData
					,
					{ headers }
				);
				console.log(schoolResponse)
				if (schoolResponse) {
					const schoolId = schoolResponse.data.data.id;
					localStorage.setItem("schoolId", schoolId);
					localStorage.setItem("otpVerified", "true");
					onSubmit();
				}
		
			

		} catch (error) {
			console.error("Error details:", error.response?.data || error.message);
			alert(
				`Submission failed: ${error.response?.data?.message || error.message}`
			);
		}
	};
	return (
		<form>
			<h2 className="text-2xl font-semibold mb-6 text-center">
				Create Admin Account
			</h2>

			<div className="space-y-4">
				{/* <div>
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-700"
					>
						Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						value={roleData.name}
						onChange={handleChange}
						className="mt-1 block w-full border border-gray-300 rounded-md p-2"
						required
					/>
				</div> */}

				<div>
					<label
						htmlFor="role"
						className="block text-sm font-medium text-gray-700"
					>
						Role
					</label>
					<select
                            id="category"
                            value={selectedOption}
                            onChange={handleSelect}
                           className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="" disabled>
                                -- Select an option --
                            </option>
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
				</div>

				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						value={roleData.email}
						onChange={handleChange}
						className="mt-1 block w-full border border-gray-300 rounded-md p-2"
						required
					/>
				</div>

				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						value={password}
						onChange={handlePasswordChange}
						className={`mt-1 block w-full border rounded-md p-2 ${
							/[A-Z]/.test(password) ? "text-green-500 border-green-500" : "text-red-500 border-red-500"
						  }`}
						required
					/>
				</div>

				<div className="mt-8">
					<span className="block text-sm font-medium text-gray-900 mb-2">
						Upload your photo
					</span>
					<div className="flex justify-between items-center gap-2">
						{photoPreview && (
							<img
								src={photoPreview}
								alt="Photo Preview"
								className="w-24 h-24 object-cover rounded-full mt-4 mx-auto"
							/>
						)}
						<label
							htmlFor="file-input"
							className="flex flex-col items-center justify-center w-full h-24 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
						>
							<span className="flex items-center space-x-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-6 h-6 text-gray-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
									/>
								</svg>
								<span className="font-medium text-gray-600">
									Drop files to Attach, or
									<span className="text-sky-600 underline ml-1">browse</span>
								</span>
							</span>
							<input
								id="file-input"
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleFileChange}
							/>
						</label>
					</div>
				</div>
			</div>

			<div className="flex justify-between mt-8">
				<button
					type="button"
					onClick={onPrevious}
					className="py-2 px-4 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition duration-300"
				>
					Previous
				</button>
				<button
					type="button"
					onClick={handleNext}
					className="py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300"
				>
					Submit
				</button>
			</div>
		</form>
	);
};

export default CreateRole;
