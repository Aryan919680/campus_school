import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Employee from "../main/dashboard/employeesDetails/Employee";
import CardSlider from "./CardSlider";
import API_ENDPOINTS from "../../API/apiEndpoints";

const Employees = () => {
	const navigate = useNavigate();
	const [leaves, setLeaves] = useState([]);
	const [teachers, setTeachers] = useState({});
	const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
	const defaultMalePhoto =
		"https://res.cloudinary.com/duyau9qkl/image/upload/v1717910208/images/w7y88n61dxedxzewwzpn.png";
	const defaultFemalePhoto =
		"https://res.cloudinary.com/duyau9qkl/image/upload/v1717910872/images/dxflhaspx3rm1kcak2is.png";

	useEffect(() => {
		// fetchLeaves();
		fetchTeachers();
	}, []);

	// const fetchLeaves = async () => {
	// 	try {
	// 		const response = await axios.get(API_ENDPOINTS.FETCH_ALL_PENDING_LEAVES);
	// 		if (Array.isArray(response.data.leaves)) {
	// 			const validLeaves = await fetchValidLeaves(response.data.leaves);
	// 			setLeaves(validLeaves);
	// 		} else {
	// 			console.error("Unexpected data format:", response.data);
	// 		}
	// 	} catch (error) {
	// 		console.error("Error fetching leaves:", error);
	// 	}
	// };

	// const fetchValidLeaves = async (leaves) => {
	// 	const validLeaves = [];
	// 	for (const leave of leaves) {
	// 		try {
	// 			const teacher = await fetchTeacherDetails(leave.teacherId);
	// 			if (teacher) {
	// 				validLeaves.push({ ...leave, teacherDetails: teacher });
	// 			}
	// 		} catch (error) {
	// 			console.error(
	// 				`Error fetching teacher details for teacherId ${leave.teacherId}:`,
	// 				error
	// 			);
	// 		}
	// 	}
	// 	return validLeaves;
	// };

	const fetchTeacherDetails = async (teacherId) => {
		try {
			const response = await axios.get(API_ENDPOINTS.FETCH_TEACHERS(teacherId));
			if (response.data.success && response.data.data) {
				setTeachers((prev) => ({ ...prev, [teacherId]: response.data.data }));
				return response.data.data;
			}
			return null;
		} catch (error) {
			if (error.response?.status !== 404) {
				throw error;
			}
			return null;
		}
	};

	// const updateLeaveStatus = async (teacherId, action) => {
	// 	try {
	// 		const response = await axios.put(
	// 			API_ENDPOINTS.UPDATE_LEAVES(teacherId, action),
	// 			{ status: action }
	// 		);
	// 		if (response.status === 200) {
	// 			fetchLeaves();
	// 		}
	// 	} catch (error) {
	// 		console.error("Error updating leave status:", error);
	// 	}
	// };

	// const handleApprove = (teacherId) => updateLeaveStatus(teacherId, "Accept");
	// const handleReject = (teacherId) => updateLeaveStatus(teacherId, "Reject");

	const fetchTeachers = async () => {
		try {
			const response = await axios.get(API_ENDPOINTS.FETCH_ALL_TEACHERS(),
					{headers: { Authorization: `Bearer ${token}` }}
			);
			const teachersData = response.data.data || [];
			const teachersObj = teachersData.reduce((acc, teacher) => {
				acc[teacher.id] = teacher;
				return acc;
			}, {});
			setTeachers(teachersObj);
		} catch (error) {
			console.error("Error fetching teachers:", error);
		}
	};

	const getDefaultPhoto = (gender) =>
		gender?.toLowerCase() === "female" ? defaultFemalePhoto : defaultMalePhoto;

	const cards = leaves.map((leave) => ({
		userDP:
			teachers[leave.teacherId]?.photo ||
			getDefaultPhoto(teachers[leave.teacherId]?.gender),
		userName: leave.name,
		userReq: leave.reason,
		onApprove: () => handleApprove(leave.teacherId),
		onReject: () => handleReject(leave.teacherId),
	}));

	return (
		<>
			{/* <div className="p-4 flex flex-wrap">
				<div className="w-full px-2">
					<h3 className="font-bold text-2xl mb-4">Requests.</h3>
					<CardSlider cards={cards} />
				</div>
			</div> */}
			<Employee />
		
		</>
	);
};

export default Employees;
