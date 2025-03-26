import React, { useState, useEffect } from "react";
import FloatingInput from "../Forms/FloatingInput";
import { Icon } from "@iconify/react";
import Modal from "../popup/Modal";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

const StudentForm = ({ isOpen, onClose, onStudentAdd }) => {
	const [formData, setFormData] = useState({
		name: "",
		rollNo: "",
		email: "",
		password: "",
		gender: "",
		dob: "",
		contactNumber: "",
		departmentName: "",
		year: "",
		permanent_address: "",
		currentAddress: "",
		fatherName: "",
		motherName: "",
		fatherContactNumber: "",
		photo: "",
	});
	const [formErrors, setFormErrors] = useState({});
	const [photoLoading, setPhotoLoading] = useState(false);
	const [departments, setDepartments] = useState([]);
	const userData = JSON.parse(localStorage.getItem("userData"));
	const token = userData?.token;
  
	useEffect(() => {
		const fetchDepartments = async () => {
			try {
				const response = await axios.get(API_ENDPOINTS.GET_DEPARTMENTS(),
					{headers: { Authorization: `Bearer ${token}` }}
				);
				if (Array.isArray(response.data.data)) {
					setDepartments(response.data.data);
				} else {
					console.error("Unexpected response format", response.data);
					setDepartments([]);
				}
			} catch (error) {
				console.error("Error fetching departments:", error);
				setDepartments([]);
			}
		};

		fetchDepartments();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	

	const validateForm = () => {
		const errors = {};
		const requiredFields = [
			"name",
			"rollNo",
			"email",
			"password",
			"gender",
			"contactNumber",
			"dob",
			"permanent_address",
			"currentAddress",
			"fatherName",
			"fatherContactNumber",
			"year",
		];
		requiredFields.forEach((field) => {
			if (!formData[field]) {
				errors[field] = `${field.replace("_", " ")} is required`;
			}
		});
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	// const handleSubmit = async (e) => {
	// 	e.preventDefault();
	// 	if (!validateForm()) {
	// 		return;
	// 	}

	// 	const selectedDepartment = departments.find(
	// 		(dept) => dept.name === formData.departmentName
	// 	);

	// 	try {
	// 		const response = await fetch(API_ENDPOINTS.REGISTER_STUDENTS, {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify({
	// 				...formData,
	// 				rollNo: parseInt(formData.rollNo),
	// 				departmentId: selectedDepartment ? selectedDepartment.id : null,
	// 			}),
	// 		});
	// 		if (!response.ok) {
	// 			const errorData = await response.json();
	// 			console.error("Error response:", errorData);
	// 			throw new Error("Network response was not ok");
	// 		}
	// 		const data = await response.json();
	// 		onStudentAdd(data.data);
	// 		onClose();
	// 	} catch (error) {
	// 		console.error("Error:", error);
	// 	}
	// };

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) {
			return;
		}
	
		const selectedDepartment = departments.find(
			(dept) => dept.name === formData.departmentName
		);
	
		const payload = {
			students: [
				{
					name: formData.name,
					gender: formData.gender.toUpperCase(), // Convert to expected format
					email: formData.email,
					semesterId: "ad69c1ef-93bf-4631-9e02-1dd13c5896fd", // Replace with actual semesterId
					extraDetails: {
						rollNo: formData.rollNo,
						dob: formData.dob,
						contactNumber: formData.contactNumber,
						departmentId: selectedDepartment ? selectedDepartment.id : null,
						permanent_address: formData.permanent_address,
						currentAddress: formData.currentAddress,
						fatherName: formData.fatherName,
						motherName: formData.motherName,
						fatherContactNumber: formData.fatherContactNumber,
						photo: formData.photo,
					}
				}
			]
		};
	
		try {
			const response = await fetch(API_ENDPOINTS.REGISTER_STUDENTS(), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
	
			if (!response.ok) {
				const errorData = await response.json();
				console.error("Error response:", errorData);
				throw new Error("Network response was not ok");
			}
	
			const data = await response.json();
			onStudentAdd(data.data);
			onClose();
		} catch (error) {
			console.error("Error:", error);
		}
	};
	
	return (
		<Modal
			modalOpen={isOpen}
			setModalOpen={onClose}
			responsiveWidth={"md:w-fit"}
			className="overflow-hidden"
		>
			<form onSubmit={handleSubmit} className="w-96">
				<div className="flex gap-4 justify-between items-center">
					
					<div className="flex-1">
						<FloatingInput
							type="text"
							id="name"
							formTitle="Name"
							value={formData.name}
							handleChange={handleInputChange}
							formName="name"
							xtraClass={formErrors.name ? "border-red-500" : ""}
						/>
						{formErrors.name && (
							<p className="text-red-500">{formErrors.name}</p>
						)}

						<FloatingInput
							type="date"
							id="dob"
							formTitle="Date of Birth"
							value={formData.dob}
							handleChange={handleInputChange}
							formName="dob"
							xtraClass={formErrors.dob ? "border-red-500" : ""}
						/>
						{formErrors.dob && <p className="text-red-500">{formErrors.dob}</p>}
					</div>
				</div>
				<div className="flex gap-2">
					<div className="flex-1">
						<FloatingInput
							type="number"
							id="rollNo"
							formTitle="Roll No"
							value={formData.rollNo}
							handleChange={handleInputChange}
							formName="rollNo"
							xtraClass={formErrors.rollNo ? "border-red-500" : ""}
						/>
						{formErrors.rollNo && (
							<p className="text-red-500">{formErrors.rollNo}</p>
						)}
					</div>

					<div className="mt-2 w-auto flex-1">
						<select
							name="gender"
							id="gender"
							value={formData.gender}
							onChange={handleInputChange}
							className={`w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm border-1 peer block appearance-none border bg-transparent px-2.5 pb-2.5 pt-4 text-sm focus:border-blue-600 focus:outline-none focus:ring-0 ${
								formErrors.gender ? "border-red-500" : ""
							}`}
						>
							<option value="">Gender</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
							<option value="Other">Other</option>
						</select>
						{formErrors.gender && (
							<p className="text-red-500">{formErrors.gender}</p>
						)}
					</div>
				</div>

				<FloatingInput
					type="text"
					id="contactNumber"
					formTitle="Contact Number"
					value={formData.contactNumber}
					handleChange={handleInputChange}
					formName="contactNumber"
					xtraClass={formErrors.contactNumber ? "border-red-500" : ""}
				/>
				{formErrors.contactNumber && (
					<p className="text-red-500">{formErrors.contactNumber}</p>
				)}

				<FloatingInput
					type="email"
					id="email"
					formTitle="Email"
					value={formData.email}
					handleChange={handleInputChange}
					formName="email"
					xtraClass={formErrors.email ? "border-red-500" : ""}
				/>
				{formErrors.email && <p className="text-red-500">{formErrors.email}</p>}

				<FloatingInput
					type="password"
					id="password"
					formTitle="Password"
					value={formData.password}
					handleChange={handleInputChange}
					formName="password"
					xtraClass={formErrors.password ? "border-red-500" : ""}
				/>
				{formErrors.password && (
					<p className="text-red-500">{formErrors.password}</p>
				)}

				<FloatingInput
					type="text"
					id="year"
					formTitle="Year"
					value={formData.year}
					handleChange={handleInputChange}
					formName="year"
					xtraClass={formErrors.year ? "border-red-500" : ""}
				/>
				{formErrors.year && <p className="text-red-500">{formErrors.year}</p>}

				<div className="mt-1.5">
					<select
						name="departmentName"
						id="departmentName"
						value={formData.departmentName}
						onChange={handleInputChange}
						className={`w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm border-1 peer block appearance-none border bg-transparent px-2.5 pb-2.5 py-4 text-sm focus:border-blue-600 focus:outline-none focus:ring-0 ${
							formErrors.departmentName ? "border-red-500" : ""
						}`}
					>
						<option value="">Department</option>
						{departments.map((dept) => (
							<option key={dept.id} value={dept.name}>
								{dept.name}
							</option>
						))}
					</select>
					{formErrors.departmentName && (
						<p className="text-red-500">{formErrors.departmentName}</p>
					)}
				</div>
				

				<FloatingInput
					type="text"
					id="permanent_address"
					formTitle="Permanent Address"
					value={formData.permanent_address}
					handleChange={handleInputChange}
					formName="permanent_address"
					xtraClass={formErrors.permanent_address ? "border-red-500" : ""}
				/>
				{formErrors.permanent_address && (
					<p className="text-red-500">{formErrors.permanent_address}</p>
				)}

				<FloatingInput
					type="text"
					id="currentAddress"
					formTitle="Current Address"
					value={formData.currentAddress}
					handleChange={handleInputChange}
					formName="currentAddress"
					xtraClass={formErrors.currentAddress ? "border-red-500" : ""}
				/>
				{formErrors.currentAddress && (
					<p className="text-red-500">{formErrors.currentAddress}</p>
				)}

				<div className="flex justify-center items-center gap-2">
					<div className="flex-1">
						<FloatingInput
							type="text"
							id="fatherName"
							formTitle="Father's Name"
							value={formData.fatherName}
							handleChange={handleInputChange}
							formName="fatherName"
							xtraClass={formErrors.fatherName ? "border-red-500" : ""}
						/>
						{formErrors.fatherName && (
							<p className="text-red-500">{formErrors.fatherName}</p>
						)}
					</div>
					<div className="flex-1">
						<FloatingInput
							type="text"
							id="motherName"
							formTitle="Mother's Name"
							value={formData.motherName}
							handleChange={handleInputChange}
							formName="motherName"
						/>
					</div>
				</div>

				<FloatingInput
					type="text"
					id="fatherContactNumber"
					formTitle="Father's Contact Number"
					value={formData.fatherContactNumber}
					handleChange={handleInputChange}
					formName="fatherContactNumber"
					xtraClass={formErrors.fatherContactNumber ? "border-red-500" : ""}
				/>
				{formErrors.fatherContactNumber && (
					<p className="text-red-500">{formErrors.fatherContactNumber}</p>
				)}

				<button
					type="submit"
					className="px-4 py-4 text-sm font-medium text-white bg-linear-blue w-full my-4 rounded hover:bg-blue-700"
				>
					Add Student
				</button>
			</form>
		</Modal>
	);
};

export default StudentForm;
