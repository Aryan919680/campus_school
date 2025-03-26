import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Card from "./Card";
import API_ENDPOINTS from "../../../API/apiEndpoints";

const CardContainer = ({ onDueFeesClick, onPendingRequestClick }) => {
	const [employeeCount, setEmployeeCount] = useState(0);
	const [studentCount, setStudentCount] = useState(0);
	const [leavesCount, setLeavesCount] = useState(0);

	const fetchData = async (endpoint, setState, processData) => {
		try {
			const response = await axios.get(endpoint);
			if (processData) {
				processData(response.data, setState);
			} else if (Array.isArray(response.data.data)) {
				setState(response.data.data.length);
			} else {
				console.error("Unexpected data format:", response.data);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const fetchValidEmployees = async () => {
		try {
			const response = await axios.get(API_ENDPOINTS.FETCH_ALL_TEACHERS());
			const validEmployees = response.data.data.filter(
				(employee) => employee.status !== "deleted"
			);
			setEmployeeCount(validEmployees.length);
		} catch (error) {
			console.error("Error fetching valid employees:", error);
			setEmployeeCount(0); // Set count to 0 in case of error
		}
	};

	const fetchValidLeaves = async () => {
		try {
			const response = await axios.get(API_ENDPOINTS.FETCH_ALL_PENDING_LEAVES);
			const leaves = response.data.leaves || []; // Use an empty array if leaves is undefined
			const validLeaves = await Promise.all(
				leaves.map(async (leave) => {
					const teacher = await fetchTeacherDetails(leave.teacherId);
					return teacher ? leave : null;
				})
			);
			setLeavesCount(validLeaves.filter(Boolean).length);
		} catch (error) {
			console.error("Error fetching valid leaves:", error);
			setLeavesCount(0); // Set count to 0 in case of error
		}
	};

	const fetchTeacherDetails = async (teacherId) => {
		try {
			const response = await axios.get(API_ENDPOINTS.FETCH_TEACHERS(teacherId));
			if (response.data.success && response.data.data) {
				return response.data.data;
			} else {
				console.error("Unexpected data format:", response.data);
				return null;
			}
		} catch (error) {
			if (error.response && error.response.status === 404) {
				console.warn(`Teacher with ID ${teacherId} not found.`);
				return null;
			} else {
				console.error(
					`Error fetching teacher details for teacherId ${teacherId}:`,
					error
				);
				throw error; // Re-throw the error if it's not a 404
			}
		}
	};

	useEffect(() => {
		fetchValidEmployees();
		fetchData(API_ENDPOINTS.FETCH_ALL_STUDENTS, setStudentCount);
		fetchValidLeaves();
	}, []);

	return (
		<div className="flex flex-wrap justify-center items-center">
			<Link to="../../Employees">
				<Card
					icon={"clarity:employee-group-solid"}
					title={"Total Employees"}
					number={employeeCount}
					iconClass={"salary-icon"}
					iconColor={"bg-linear-blue"}
				/>
			</Link>
			<button onClick={onDueFeesClick}>
				<Card
					icon={"ri:money-rupee-circle-line"}
					title={"Due Fees"}
					number={"₹25k"}
					iconClass={"salary-icon"}
					iconColor={"bg-linear-red"}
				/>
			</button>
			<button onClick={onPendingRequestClick}>
				<Card
					icon={"lets-icons:chat"}
					title={"Pending Request"}
					number={leavesCount}
					iconClass={"salary-icon"}
					iconColor={"bg-linear-red"}
				/>
			</button>
			<Link to="../../Students">
				<Card
					icon={"solar:square-academic-cap-bold"}
					title={"Total Students"}
					number={studentCount}
					iconClass={"salary-icon"}
					iconColor={"bg-linear-green"}
				/>
			</Link>
		</div>
	);
};

export default CardContainer;
