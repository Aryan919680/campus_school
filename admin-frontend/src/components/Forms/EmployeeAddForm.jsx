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

	useEffect(() => {
		document.documentElement.classList.add("no-scroll");
		document.body.classList.add("no-scroll");

		const fetchDepartments = async () => {
			try {
				const response = await axios.get(API_ENDPOINTS.FETCH_ALL_DEPARTMENTS);
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

	const handlePhotoUpload = async (e) => {
		setPhotoLoading(true);
		const file = e.target.files[0];
		const photoFormData = new FormData();
		photoFormData.append("file", file);
		photoFormData.append(
			"upload_preset",
			import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
		);

		try {
			const response = await axios.post(
				`https://api.cloudinary.com/v1_1/${
					import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
				}/image/upload`,
				photoFormData
			);
			setFormData((prevData) => ({
				...prevData,
				photo: response.data.secure_url,
			}));
		} catch (error) {
			console.error(
				"Error uploading photo:",
				error.response?.data || error.message
			);
		} finally {
			setPhotoLoading(false);
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
		if (!validateForm()) return;

		setLoading(true);
		setError(null);

		const selectedDepartment = departments.find(
			(dept) => dept.name === formData.departmentName
		);

		try {
			let response;
			if (formData.employeeType === "Faculty") {
				response = await axios.post(
					API_ENDPOINTS.REGISTER_TEACHER,
					{
						...formData,
						departmentId: selectedDepartment ? selectedDepartment.id : null,
					},
					{
						headers: {
							Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
						},
					}
				);
			} else {
				// TODO: Implement API endpoint for registering other employee types
				console.warn(
					"API for registering other employee types is not implemented yet"
				);
				// Placeholder for when the API is implemented:
				// response = await axios.post(API_ENDPOINTS.REGISTER_OTHER_EMPLOYEE, formData);
			}
			console.log("Response:", response?.data);
			onEmployeeAdded();
		} catch (error) {
			console.error(
				"Error:",
				error.response?.data?.message || "An error occurred"
			);
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
				{["Faculty", "Other"].map((type) => (
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
				<div>
					{formData.photo ? (
						<img
							src={formData.photo}
							alt="Employee Photo"
							className="w-24 h-24 rounded-full object-cover cursor-pointer"
							onClick={() => document.getElementById("photoUpload").click()}
						/>
					) : (
						<div
							className="w-24 h-24 rounded-full bg-[url('https://res.cloudinary.com/duyau9qkl/image/upload/v1717910208/images/w7y88n61dxedxzewwzpn.png')] bg-cover flex items-center justify-center cursor-pointer relative"
							onClick={() => document.getElementById("photoUpload").click()}
						>
							{photoLoading ? (
								<p>Uploading...</p>
							) : (
								<span className="text-xs p-1 rounded-full absolute right-0 bottom-0 bg-gray-200">
									<Icon
										icon="majesticons:camera"
										className="h-6 w-6 flex-shrink-0"
									/>
								</span>
							)}
						</div>
					)}
					<input
						type="file"
						id="photoUpload"
						className="hidden"
						onChange={handlePhotoUpload}
						accept="image/*"
						disabled={photoLoading}
					/>
				</div>
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

					<FloatingInput
						type="date"
						id="dob"
						formTitle="Date of Birth"
						value={formData.dob}
						handleChange={handleChange}
						formName="dob"
					/>
					{errors.dob && <p className="text-red-500 text-xs">{errors.dob}</p>}
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
