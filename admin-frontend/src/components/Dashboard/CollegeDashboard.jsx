import React, { useState, useEffect } from "react";
import axios from "axios";
import { useApiEndpoints } from "../../API/apiEndpoints";

const CollegeDashboard = ({ userData, logout }) => {
	const endpoints = useApiEndpoints();
	const [departments, setDepartments] = useState([]);
	const [newDepartment, setNewDepartment] = useState({
		name: "",
		courseName: "",
		fee: "",
		duration: "",
		code: "",
	});

	useEffect(() => {
		fetchDepartments();
	}, []);

	const fetchDepartments = async () => {
		try {
			const response = await axios.get(endpoints.FETCH_ALL_DEPARTMENTS, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			setDepartments(response.data.data || []);
		} catch (error) {
			console.error("Error fetching departments:", error);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewDepartment((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post(endpoints.CREATE_DEPARTMENTS, newDepartment, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			fetchDepartments();
			setNewDepartment({
				name: "",
				courseName: "",
				fee: "",
				duration: "",
				code: "",
			});
		} catch (error) {
			console.error("Error creating department:", error);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<header className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">
					Welcome, {userData?.name || "User"}
				</h1>
				<button
					onClick={logout}
					className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
				>
					Logout
				</button>
			</header>

			<div className="mb-8">
				<h2 className="text-xl font-semibold mb-4">Add New Department</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						name="name"
						value={newDepartment.name}
						onChange={handleInputChange}
						placeholder="Department Name"
						className="w-full p-2 border rounded"
						required
					/>
					<input
						type="text"
						name="courseName"
						value={newDepartment.courseName}
						onChange={handleInputChange}
						placeholder="Course Name"
						className="w-full p-2 border rounded"
						required
					/>
					<input
						type="number"
						name="fee"
						value={newDepartment.fee}
						onChange={handleInputChange}
						placeholder="Fee"
						className="w-full p-2 border rounded"
						required
					/>
					<input
						type="text"
						name="duration"
						value={newDepartment.duration}
						onChange={handleInputChange}
						placeholder="Duration (e.g., 4 years)"
						className="w-full p-2 border rounded"
						required
					/>
					<input
						type="text"
						name="code"
						value={newDepartment.code}
						onChange={handleInputChange}
						placeholder="Department Code"
						className="w-full p-2 border rounded"
						required
					/>
					<button
						type="submit"
						className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
					>
						Add Department
					</button>
				</form>
			</div>

			<div>
				<h2 className="text-xl font-semibold mb-4">Departments</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{departments.map((dept) => (
						<div key={dept.id} className="border p-4 rounded shadow">
							<h3 className="font-bold">{dept.name}</h3>
							<p>Course: {dept.courseName}</p>
							<p>Fee: ${dept.fee}</p>
							<p>Duration: {dept.duration}</p>
							<p>Code: {dept.code}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CollegeDashboard;
