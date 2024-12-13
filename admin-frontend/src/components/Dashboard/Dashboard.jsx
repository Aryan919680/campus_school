import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import CardContainer from "../main/dashboard/CardContainer";
import DailyAttendancePercentage from "../Attendance/DailyAttendancePercentage";
import Employee from "../main/dashboard/employeesDetails/Employee";
import Modal from "../popup/Modal";
import { AuthContext } from "../../context/AuthContext";
import FeesListTable from "../Fees/StudentsWithPaymentStatus";

const Dashboard = () => {
	const { token, isLoggedIn } = useContext(AuthContext);
	const [dueFeesModalOpen, setDueFeesModalOpen] = useState(false);
	const [reqModalOpen, setReqModalOpen] = useState(false);
	const [students, setStudents] = useState([]);
	const [leaves, setLeaves] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [teacherPhotos, setTeacherPhotos] = useState({});

	const navigate = useNavigate();
	const currentDate = new Date();

	// Simplified fetch functions that won't block UI
	const fetchStudents = async () => {
		try {
			const response = await axios.get(API_ENDPOINTS.FETCH_ALL_STUDENTS, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (Array.isArray(response?.data?.data)) {
				setStudents(response.data.data);
			}
		} catch (error) {
			console.log("Students API not ready:", error);
		}
	};

	const fetchLeaves = async () => {
		try {
			const response = await axios.get(API_ENDPOINTS.FETCH_ALL_PENDING_LEAVES, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (Array.isArray(response?.data?.leaves)) {
				const validLeaves = await fetchValidLeaves(response.data.leaves);
				setLeaves(validLeaves);
			}
		} catch (error) {
			console.log("Leaves API not ready:", error);
		}
	};

	const fetchValidLeaves = async (leaves) => {
		const validLeaves = [];
		const teacherPhotosMap = {};

		for (const leave of leaves) {
			try {
				const photo = await fetchTeacherPhoto(leave.teacherId);
				if (photo !== null) {
					validLeaves.push(leave);
					teacherPhotosMap[leave.teacherId] = photo;
				}
			} catch (error) {
				console.log("Teacher photo fetch failed:", error);
			}
		}

		setTeacherPhotos(teacherPhotosMap);
		return validLeaves;
	};

	const fetchTeacherPhoto = async (teacherId) => {
		try {
			const response = await axios.get(API_ENDPOINTS.FETCH_TEACHERS(teacherId));
			return response.data.data.photo;
		} catch (error) {
			return null;
		}
	};

	const updateLeaveStatus = async (teacherId, action) => {
		try {
			const response = await axios.put(
				API_ENDPOINTS.UPDATE_LEAVES(teacherId, action),
				{ status: action },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (response.status === 200) {
				fetchLeaves();
			}
		} catch (error) {
			console.log("Leave status update failed:", error);
		}
	};

	// Event Handlers
	const handleDueFees = () => setDueFeesModalOpen(true);
	const handlePendingRequest = () => {
		setReqModalOpen(true);
		fetchLeaves();
	};
	const handleApprove = (teacherId) => updateLeaveStatus(teacherId, "Accept");
	const handleReject = (teacherId) => updateLeaveStatus(teacherId, "Reject");
	const handleDailyAttendanceClick = () => navigate("/attendance");

	useEffect(() => {
		if (token && isLoggedIn) {
			fetchStudents();
		}
	}, [token, isLoggedIn]);

	return (
		<>
			<CardContainer
				onDueFeesClick={handleDueFees}
				onPendingRequestClick={handlePendingRequest}
			/>

			{/* Pending Requests Modal */}
			<Modal
				modalOpen={reqModalOpen}
				setModalOpen={setReqModalOpen}
				responsiveWidth={"md:w-[60%]"}
			>
				<div className="bg-white p-8 rounded-md w-fit sm:w/full max-h-[80vh] overflow-y-auto">
					<h2 className="text-gray-600 font-semibold">
						Pending Request Details
					</h2>
					{leaves.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
								<thead>
									<tr>
										<th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
											Name
										</th>
										<th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
											Reason
										</th>
										<th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
											From
										</th>
										<th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
											To
										</th>
										<th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
											Status
										</th>
										<th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
											Number of Days
										</th>
										<th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{leaves.map((leave, index) => (
										<tr key={index}>
											<td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
												{leave.name}
											</td>
											<td className="whitespace-nowrap px-4 py-2 text-gray-700">
												{leave.reason}
											</td>
											<td className="whitespace-nowrap px-4 py-2 text-gray-700">
												{new Date(leave.dateFrom).toLocaleDateString()}
											</td>
											<td className="whitespace-nowrap px-4 py-2 text-gray-700">
												{new Date(leave.dateTo).toLocaleDateString()}
											</td>
											<td className="whitespace-nowrap px-4 py-2 text-gray-700">
												{leave.status}
											</td>
											<td className="whitespace-nowrap px-4 py-2 text-gray-700">
												{leave.noOfDays}
											</td>
											<td className="whitespace-nowrap px-4 py-2">
												<button
													className="inline-block rounded bg-green-500 px-4 py-2 text-xs font-medium text-white hover:bg-green-700"
													onClick={() => handleApprove(leave.teacherId)}
												>
													Approve
												</button>
												<button
													className="inline-block rounded bg-red-500 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 ml-2"
													onClick={() => handleReject(leave.teacherId)}
												>
													Reject
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<p>No Pending Requests</p>
					)}
				</div>
			</Modal>

			{/* Due Fees Modal */}
			<Modal
				modalOpen={dueFeesModalOpen}
				setModalOpen={setDueFeesModalOpen}
				responsiveWidth={"md:w/[60%]"}
			>
				<div className="bg-white p-8 rounded-md">
					{isLoading ? <p>Loading...</p> : <FeesListTable />}
				</div>
			</Modal>

			{/* Daily Attendance Section */}
			<DailyAttendancePercentage
				selectedDate={currentDate}
				onClick={handleDailyAttendanceClick}
			/>

			{/* Employee Section */}
			<Employee />
		</>
	);
};

export default Dashboard;
