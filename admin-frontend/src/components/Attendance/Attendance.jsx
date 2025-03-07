import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import moment from "moment";
import EmployeeCard from "./EmployeeCard";

const Attendance = ({onClose}) => {
	const [teachers, setTeachers] = useState([]);
	const [selectedDate, setSelectedDate] = useState(moment());
	const [attendance, setAttendance] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showUpdateDialog, setShowUpdateDialog] = useState(false);
	const userData = JSON.parse(localStorage.getItem("userData"));
	const parsedData = userData;
	const token = parsedData.token;
	const getUserIdFromLocalStorage = () => {
		const userData = JSON.parse(localStorage.getItem("userData"));
		return userData && userData.id ? userData.id : null;
	};
	const userId = getUserIdFromLocalStorage();

	useEffect(() => {
		const fetchTeachers = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`${API_ENDPOINTS.FETCH_ALL_TEACHERS}`,{
					Authorization: `Bearer ${token}`,
				});
				setTeachers(response.data.data);
			} catch (error) {
				setError("Failed to fetch teachers. Please try again.");
			} finally {
				setIsLoading(false);
			}
		};
		fetchTeachers();
	}, []);

	const handleDateChange = (date) => {
		setSelectedDate(moment(date));
	};

	const handleAttendanceChange = (employeeId, status) => {
		if (!employeeId) {
			console.error("Error: teacherId is undefined");
			return;
		}
		
		setAttendance((prev) => ({
			...prev,
			[employeeId]: status,
		}));
	};

	const submitAttendance = async () => {
		const attendanceData = {
			attendance: Object.keys(attendance).map((employeeId) => ({
				id: employeeId,
				status: attendance[employeeId].toUpperCase(),
			})),
		};

		try {
			const apiUrl = API_ENDPOINTS.MARK_ATTENDANCE;
			await axios.post(apiUrl, attendanceData,{
				
					Authorization: `Bearer ${token}`,
				
			});
			alert("Attendance marked successfully!");
		} catch (error) {
			console.error("Error marking attendance:", error);
			alert("Error marking attendance. Please try again.");
		} finally {
			setShowUpdateDialog(false);
			onClose();
		}
	};

	const showDialog = () =>{
		onClose();
		setShowUpdateDialog(false)
}
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Mark Employee Attendance</h1>
			<input
				type="date"
				value={selectedDate.format("YYYY-MM-DD")}
				onChange={(e) => handleDateChange(e.target.value)}
				className="border p-2 rounded"
			/>
			{teachers.length === 0 ? (
				<p>No employees found for the selected date.</p>
			) : (
				<div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
						{teachers.map((teacher) => (
							<EmployeeCard
								key={teacher.employeeId}
								employee={teacher}
								attendance={attendance[teacher.employeeId]}
								onAttendanceChange={handleAttendanceChange}
								selectedDate={selectedDate}
							/>
						))}
					</div>
					<button
						onClick={() => setShowUpdateDialog(true)}
						className="mt-4 mb-16 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
					>
						Mark Attendance
					</button>
				</div>
			)}
			{showUpdateDialog && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
					<div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
						<h3 className="text-lg font-bold">Confirm Attendance</h3>
						<p className="mt-2">Are you sure you want to mark the attendance?</p>
						<div className="mt-3 flex justify-end space-x-2">
							<button
								onClick={showDialog}
								className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
							>
								Cancel
							</button>
							<button
								onClick={submitAttendance}
								className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Attendance;
