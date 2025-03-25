
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_ENDPOINTS from "../API/apiEndpoints";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const CreateRole = ({ onPrevious, onSubmit }) => {
	const navigate = useNavigate();
	const [roleData, setRoleData] = useState({
		email: localStorage.getItem("adminEmail") || "",
		branchId: Number(localStorage.getItem("branchId")) || "",
		role: "ADMIN",
	});
	const [password, setPassword] = useState(localStorage.getItem("adminPassword") || "");
	const [selectedOption, setSelectedOption] = useState(localStorage.getItem("selectedOption") || "");
	const [isValid, setIsValid] = useState(false);
	const [successMessage, setSuccessMessage] = useState(""); // Success message state
	const [isValidEmail, setIsValidEmail] = useState(false);
const [showPassword, setShowPassword] = useState(false);
	const options = [
		{ value: "director", label: "Director" },
		{ value: "manager", label: "Manager" },
		{ value: "principal", label: "Principal" },
	];

	const handleSelect = (event) => {
		setSelectedOption(event.target.value);
	};

	const handleChange = (e) => {
        const { name, value } = e.target;
        setRoleData((prevData) => ({ ...prevData, [name]: value }));
        if (name === "email") {
            validateEmail(value);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValidEmail(emailRegex.test(email));
    };

	const validatePassword = (value) => {
		const conditions = {
			hasUpperCase: /[A-Z]/.test(value),
			hasLowerCase: /[a-z]/.test(value),
			hasNumber: /\d/.test(value),
			hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
			isLongEnough: value.length > 8,
		};

		const allValid = Object.values(conditions).every(Boolean);
		setIsValid(allValid);
		return allValid;
	};

	const handlePasswordChange = (e) => {
		const value = e.target.value;
		setPassword(value);
		validatePassword(value);
	};

	const handleNext = () => {
		console.log("here")
		//if (!isValidEmail || !isValid) return;
		localStorage.setItem("adminEmail", roleData.email);
		localStorage.setItem("adminRole", roleData.role);
		localStorage.setItem("adminPassword", password);

		const schoolData = {
			name: localStorage.getItem("schoolName") || "",
			type: "SCHOOL",
			location: localStorage.getItem("schoolLocation") || "",
			campus_details: {
				school: {
					board: localStorage.getItem("selectedOptionBoard") || "",
					code: localStorage.getItem("schoolCode") || "",
					address: localStorage.getItem("schoolLocation") || "",
					branch_name: localStorage.getItem("schoolBranchName") || "",
					director: localStorage.getItem("schoolDirectorName") || "",
					year: Number(localStorage.getItem("schoolFoundedYear")) || 0,
				},
			},
			admin: {
				role: "ADMIN",
				email: localStorage.getItem("adminEmail"),
				password: password,
				name: "",
			},
		};
		console.log("test")
		handleSubmit(schoolData);
	};

	const handleSubmit = async (schoolData) => {
		console.log("here")
		try {
			const headers = {
				"Content-Type": "application/json",
				Accept: "application/json",
			};

			const schoolResponse = await axios.post(API_ENDPOINTS.CREATE_CAMPUS, schoolData, { headers });

			if (schoolResponse) {
				localStorage.clear()
				localStorage.setItem("schoolId", schoolResponse.data.data.id);
				localStorage.setItem("otpVerified", "true");

				setSuccessMessage("Registration successful! Redirecting to login...");

				// Redirect to login page after 3 seconds
				setTimeout(() => {
                    localStorage.removeItem("onboardingStep");
					navigate("/login");
				}, 3000);
			}
		} catch (error) {
			console.error("Error details:", error.response?.data || error.message);
			alert(`Submission failed: ${error.response?.data?.message || error.message}`);
		}
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
					 {!isValidEmail && <p className="text-red-600 text-sm">Invalid email format</p>}
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
            {successMessage && (
				<div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
					{successMessage}
				</div>
			)}

			<div className="flex justify-between mt-8">
				<button
					type="button"
					onClick={onPrevious}
					className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300"
				>
					Previous
				</button>
				<button
					type="button"
					onClick={handleNext}
					className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
				>
					Submit
				</button>
			</div>
		</form>
	);
};

export default CreateRole;
