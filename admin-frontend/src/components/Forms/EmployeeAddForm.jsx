import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import FloatingInput from "./FloatingInput";
import { Icon } from "@iconify/react";

const EmployeeAddForm = ({ onEmployeeAdded }) => {
	const [employeeType, setEmployeeType] = useState("Faculty");
	const [formData, setFormData] = useState({
		employeeType: "Faculty",
		otherType: "",
		name: "",
		email: "",
		password: "",
		role: "",
		gender: "",
		dob: "",
		departmentName: "",
		contactNumber: "",
		permanent_address: "",
		currentAddress: "",
		photo: "",
	});

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [photoLoading, setPhotoLoading] = useState(false);
	const [departments, setDepartments] = useState([]);
	const [isCurrentAddressSame, setIsCurrentAddressSame] = useState(false);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
	useEffect(() => {
		document.documentElement.classList.add("no-scroll");
		document.body.classList.add("no-scroll");

		const fetchDepartments = async () => {
			try {
				const response = await axios.get(API_ENDPOINTS.GET_DEPARTMENTS,
					{headers: { Authorization: `Bearer ${token}` }}
				);
				setDepartments(response.data.data);
			} catch (error) {
				console.error("Error fetching departments:", error);
			}
		};

		fetchDepartments();

		return () => {
			document.documentElement.classList.remove("no-scroll");
			document.body.classList.remove("no-scroll");
		};
	}, []);

	const validateForm = () => {
		const newErrors = {};
		const requiredFields = [
			"name",
			"email",
			"gender",
			"dob",
			"contactNumber",
			"permanent_address",
		];
		const emailRegex = /\S+@\S+\.\S+/;
		const phoneRegex = /^\d{10}$/;

		requiredFields.forEach((field) => {
			if (!formData[field].trim()) {
				newErrors[field] = `${
					field.replace("_", " ").charAt(0).toUpperCase() + field.slice(1)
				} is required`;
			}
		});

		if (formData.employeeType === "Other" && !formData.otherType.trim()) {
			newErrors.otherType = "Other type is required";
		}

		if (!emailRegex.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!phoneRegex.test(formData.contactNumber)) {
			newErrors.contactNumber = "Contact number must be 10 digits";
		}

		if (formData.employeeType === "Faculty") {
			if (!formData.password || formData.password.length < 8) {
				newErrors.password = "Password must be at least 8 characters";
			}
			if (!formData.role.trim()) newErrors.role = "Role is required";
			if (!formData.departmentName)
				newErrors.departmentName = "Department is required";
		}

		if (!isCurrentAddressSame && !formData.currentAddress.trim()) {
			newErrors.currentAddress = "Current Address is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleEmployeeTypeChange = (type) => {
		setEmployeeType(type);
		setFormData((prevData) => ({
			...prevData,
			employeeType: type,
			role: type === "Other" ? "" : prevData.role,
			departmentName: type === "Other" ? "" : prevData.departmentName,
			password: type === "Other" ? "" : prevData.password,
		}));
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
		if (errors[name]) {
			setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
		}
	};

	const handleCheckboxChange = () => {
		setIsCurrentAddressSame((prev) => !prev);
		setFormData((prevData) => ({
			...prevData,
			currentAddress: !isCurrentAddressSame ? prevData.permanent_address : "",
		}));
		if (errors.currentAddress) {
			setErrors((prevErrors) => ({ ...prevErrors, currentAddress: null }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
	//	if (!validateForm()) return;
	
		setLoading(true);
		setError(null);
	
		try {
			const payload = {
				employees: [
					{
						name: formData.name,
						email: formData.email,
						role: formData.role,
						extraDetails: {
							
							gender: formData.gender,
							dob: formData.dob,
							contactNumber: formData.contactNumber,
							permanent_address: formData.permanent_address,
							currentAddress: formData.currentAddress,
							departmentName: formData.departmentName,
						},
					},
				],
			};
	
			const response = await axios.post(
				API_ENDPOINTS.REGISTER_EMPLOYEES, // Ensure correct API endpoint
				payload,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
	
			console.log("Response:", response?.data);
			onEmployeeAdded();
		} catch (error) {
			console.error("Error:", error.response?.data?.message || "An error occurred");
			setError(error.response?.data?.message || "An error occurred");
		} finally {
			setLoading(false);
		}
	};
	

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-lg mx-auto p-4 bg-white rounded shadow"
		>
			<div className="flex justify-center mb-4">
				{["Faculty"].map((type) => (
					<button
						key={type}
						type="button"
						onClick={() => handleEmployeeTypeChange(type)}
						className={`px-4 py-2 rounded ${
							employeeType === type
								? "bg-emerald-500 text-white"
								: "bg-gray-200 text-gray-700"
						} ${type === "Faculty" ? "mr-2" : ""}`}
					>
						{type === "Faculty" ? "Register Faculty" : "Others"}
					</button>
				))}
			</div>
			{error && <div className="error-message text-red-500">{error}</div>}
			{employeeType === "Other" && (
				<FloatingInput
					type="text"
					id="otherType"
					formTitle="Other Type"
					value={formData.otherType}
					handleChange={handleChange}
					formName="otherType"
				/>
			)}
			{errors.otherType && (
				<p className="text-red-500 text-xs">{errors.otherType}</p>
			)}
			<div className="flex gap-4 justify-between items-center">
			
				<div className="flex-1">
					<FloatingInput
						type="text"
						id="name"
						formTitle="Name"
						value={formData.name}
						handleChange={handleChange}
						formName="name"
					/>
					{errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

				
				</div>
			</div>
			<div className="flex gap-2">
				<div className="mt-2 w-auto flex-1">
					<select
						name="gender"
						id="gender"
						value={formData.gender}
						onChange={handleChange}
						className="w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm border-1 peer block appearance-none border bg-transparent px-2.5 pb-2.5 pt-4 text-sm focus:border-emerald-600 focus:outline-none focus:ring-0"
					>
						<option value="">Gender</option>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
						<option value="Other">Other</option>
					</select>
					{errors.gender && (
						<p className="text-red-500 text-xs">{errors.gender}</p>
					)}
				</div>
				{employeeType === "Faculty" && (
					<div className="flex-1">
						<FloatingInput
							type="text"
							id="role"
							formTitle="Role"
							value={formData.role}
							handleChange={handleChange}
							formName="role"
						/>
						{errors.role && (
							<p className="text-red-500 text-xs">{errors.role}</p>
						)}
					</div>
				)}
			</div>
			{employeeType === "Faculty" && (
				<div className="mt-1.5">
					<select
						name="departmentName"
						id="departmentName"
						value={formData.departmentName}
						onChange={handleChange}
						className="w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm border-1 peer block appearance-none border bg-transparent px-2.5 pb-2.5 py-4 text-sm focus:border-emerald-600 focus:outline-none focus:ring-0"
					>
						<option value="">Department</option>
						{departments.map((dept) => (
							<option key={dept.id} value={dept.name}>
								{dept.name}
							</option>
						))}
					</select>
					{errors.departmentName && (
						<p className="text-red-500 text-xs">{errors.departmentName}</p>
					)}
				</div>
			)}
			<FloatingInput
				type="email"
				id="email"
				formTitle="Email"
				value={formData.email}
				handleChange={handleChange}
				formName="email"
				required
			/>
			{errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
			<FloatingInput
				type="tel"
				id="contactNumber"
				formTitle="Contact Number"
				value={formData.contactNumber}
				handleChange={handleChange}
				formName="contactNumber"
				required
			/>
			{errors.contactNumber && (
				<p className="text-red-500 text-xs">{errors.contactNumber}</p>
			)}
			{employeeType === "Faculty" && (
				<>
					<FloatingInput
						type="password"
						id="password"
						formTitle="Password"
						value={formData.password}
						handleChange={handleChange}
						formName="password"
						required
					/>
					{errors.password && (
						<p className="text-red-500 text-xs">{errors.password}</p>
					)}
				</>
			)}
			<FloatingInput
				type="text"
				id="permanent_address"
				formTitle="Permanent Address"
				value={formData.permanent_address}
				handleChange={handleChange}
				formName="permanent_address"
			/>
			{errors.permanent_address && (
				<p className="text-red-500 text-xs">{errors.permanent_address}</p>
			)}
			{!isCurrentAddressSame && (
				<>
					<FloatingInput
						type="text"
						id="currentAddress"
						formTitle="Current Address"
						value={formData.currentAddress}
						handleChange={handleChange}
						formName="currentAddress"
					/>
					{errors.currentAddress && (
						<p className="text-red-500 text-xs">{errors.currentAddress}</p>
					)}
				</>
			)}
			<label className="flex mt-2 cursor-pointer items-start gap-4">
				<div className="flex items-center">
					<input
						type="checkbox"
						className="size-4 rounded border-gray-300"
						checked={isCurrentAddressSame}
						onChange={handleCheckboxChange}
					/>
				</div>
				<div>
					<strong className="font-light text-xs text-gray-900">
						Current address same as permanent address
					</strong>
				</div>
			</label>

			<button
				type="submit"
				className="px-4 py-4 text-sm font-medium text-white bg-emerald-600 w-full my-4 rounded"
				disabled={loading}
			>
				{loading ? "Submitting..." : "Submit"}
			</button>
		</form>
	);
};

export default EmployeeAddForm;
