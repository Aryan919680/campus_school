

import React, { useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../API/apiEndpoints";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const CreateRole = ({ onPrevious, onSubmit }) => {
	const navigate = useNavigate();
	const [roleData, setRoleData] = useState({
		name: localStorage.getItem("collegeAdminName") || "",
		email: localStorage.getItem("collegeAdminEmail") || "",
		branchId: Number(localStorage.getItem("collegeBranchId")) || "",
		role: "ADMIN", // Automatically set to "admin"
		photo: null,
	});
	const [isValid, setIsValid] = useState(false);
	const [password, setPassword] = useState(localStorage.getItem("collegeAdminPassword") || "");
	const [successMessage, setSuccessMessage] = useState(""); // Success message state
	const [showPassword, setShowPassword] = useState(false);
	const options = [
		{ value: "dean", label: "DEAN" },
		{ value: "hod", label: "HOD" },
	];

	const [selectedOption, setSelectedOption] = useState("");

	const handleSelect = (event) => {
		const value = event.target.value;
		setSelectedOption(value);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setRoleData((prevData) => ({ ...prevData, [name]: value }));
	};

	const validatePassword = (value) => {
		const conditions = {
			hasUpperCase: /[A-Z]/.test(value),
			hasLowerCase: /[a-z]/.test(value),
			hasNumber: /\d/.test(value),
			hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
			isLongEnough: value.length >= 8,
		};
		setIsValid(Object.values(conditions).every(Boolean));
		return conditions;
	};
	const handlePasswordChange = (e) => {
		const value = e.target.value;
		setPassword(value);
		validatePassword(value);
	};

	const handleSubmit = async (collegeData) => {
		try {
			const headers = {
				"Content-Type": "application/json",
				Accept: "application/json",
			};
			const schoolResponse = await axios.post(API_ENDPOINTS.CREATE_CAMPUS, collegeData, { headers });

			if (schoolResponse) {
				const schoolId = schoolResponse.data.data.id;
				localStorage.setItem("schoolId", schoolId);
				localStorage.setItem("otpVerified", "true");

				// Set success message and trigger redirect after a delay
				setSuccessMessage("Registration successful! Redirecting to login...");
				setTimeout(() => {
					localStorage.removeItem("onboardingStep");
					navigate('login');
				}, 3000);
			}
		} catch (error) {
			console.error("Error details:", error.response?.data || error.message);
			alert(`Submission failed: ${error.response?.data?.message || error.message}`);
		}
	};

	const handleNext = () => {
		localStorage.setItem("collegeAdminName", roleData.name);
		localStorage.setItem("collegeAdminEmail", roleData.email);
		localStorage.setItem("collegeAdminRole", roleData.role);
		localStorage.setItem("collegeAdminPassword", password);

		const collegeData = {
			name: localStorage.getItem("campusName") || "",
			type: "COLLEGE",
			location: localStorage.getItem("campusLocation") || "",
			campus_details: {
				college: {
					code: localStorage.getItem("collegeCode") || 0,
					address: "",
					director: localStorage.getItem("directorName") || "",
					year: Number(localStorage.getItem("campusFoundedYear")) || 0,
				},
			},
			admin: {
				role: "ADMIN",
				email: localStorage.getItem("collegeAdminEmail") || "",
				password: localStorage.getItem("collegeAdminPassword") || "",
				name: "",
			},
		};

		handleSubmit(collegeData);
	};

	return (
		<form>
			<h2 className="text-2xl font-semibold mb-6 text-center">Create Admin Account</h2>

			<div className="space-y-4">
				<div>
					<label htmlFor="role" className="block text-sm font-medium text-gray-700">
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
					<label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
					<label htmlFor="password" className="block text-sm font-medium text-gray-700">
						Password
					</label>
					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							id="password"
							name="password"
							value={password}
							onChange={handlePasswordChange}
							className="mt-1 block w-full border border-gray-300 rounded-md p-2"
							required
						/>
						<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
							{showPassword ? <FaEyeSlash /> : <FaEye />}
						</button>
					</div>
				</div>
			</div>
			<div className="text-sm text-gray-600 mt-2">
						<ul>
							<li className={password.length >= 8 ? "text-green-600" : "text-red-600"}>At least 8 characters</li>
							<li className={/[A-Z]/.test(password) ? "text-green-600" : "text-red-600"}>One uppercase letter</li>
							<li className={/[a-z]/.test(password) ? "text-green-600" : "text-red-600"}>One lowercase letter</li>
							<li className={/\d/.test(password) ? "text-green-600" : "text-red-600"}>One number</li>
							<li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-600" : "text-red-600"}>One special character</li>
						</ul>
					</div>
			{/* Success message */}
			{successMessage && (
				<div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
					{successMessage}
				</div>
			)}

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
