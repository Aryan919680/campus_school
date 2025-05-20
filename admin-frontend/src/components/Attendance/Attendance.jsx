import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import moment from "moment";
import EmployeeCard from "./EmployeeCard";
import ListTable from "../List/ListTable";
import CommonTable from "../List/CommonTable";
const Attendance = ({ onClose }) => {
	const [teachers, setTeachers] = useState([]);
	const [selectedDate, setSelectedDate] = useState(moment());
	const [attendance, setAttendance] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showUpdateDialog, setShowUpdateDialog] = useState(false);
	const userData = JSON.parse(localStorage.getItem("userData"));
	const token = userData?.token;
	const [initialAttendance, setInitialAttendance] = useState({});

	const getUserIdFromLocalStorage = () => {
		const userData = JSON.parse(localStorage.getItem("userData"));
		return userData && userData.id ? userData.id : null;
	};
	const userId = getUserIdFromLocalStorage();

	// Fetch All Teachers
	useEffect(() => {
		const fetchTeachers = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(`${API_ENDPOINTS.FETCH_ALL_TEACHERS()}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
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

	// Fetch Attendance for the Selected Date
	const fetchAttendance = async (date) => {
		try {
			const formattedDate = moment(date).format("YYYY-MM-DD");
			const response = await axios.get(`${API_ENDPOINTS.GET_ATTENDANCE()}?date=${formattedDate}`,{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const attendanceData = response.data.data || [];
			const initialAttendanceData = {};
			attendanceData.forEach((item) => {
				initialAttendanceData[item.employeeId] = item.status;
			});
			setAttendance(initialAttendanceData);
			setInitialAttendance(initialAttendanceData); // Store initial state for comparison
		} catch (error) {
			console.error("Error fetching attendance:", error);
			setAttendance({});
		}
	};

	// Fetch attendance when selectedDate changes
	useEffect(() => {
		fetchAttendance(selectedDate);
	}, [selectedDate]);

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
		// Filter only updated attendance
		const updatedAttendance = Object.keys(attendance)
			.filter((employeeId) => attendance[employeeId] !== initialAttendance[employeeId])
			.map((employeeId) => ({
				id: employeeId,
				status: attendance[employeeId].toUpperCase(),
			}));
	
		if (updatedAttendance.length === 0) {
			alert("No changes to update.");
			setShowUpdateDialog(false);
			return;
		}
	
		try {
			const apiUrl = API_ENDPOINTS.MARK_ATTENDANCE();
			await axios.post(
				apiUrl,
				{ attendance: updatedAttendance },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			alert("Attendance marked successfully!");
		} catch (error) {
			console.error("Error marking attendance:", error);
			alert("Error marking attendance. Please try again.");
		} finally {
			setShowUpdateDialog(false);
			onClose();
		}
	};
	
	 const deleteAttendance = async (recordId) => {
            try {
                await axios.delete(API_ENDPOINTS.MARK_ATTENDANCE(), {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { attendanceIds: [recordId] }
                });
                alert("Record Deleted Successfully");
            } catch (error) {
                console.error("Error deleting attendance record:", error);
            }
        };


	const attendanceRecords = teachers.map((teacher) => ({
	attendanceId: teacher.employeeId, // use employeeId as temporary id
	employee: {
		name: teacher.name,
	},
	status: attendance[teacher.employeeId] || "ABSENT", // default if not marked
	created_at: selectedDate, // or actual date from backend if available
}));

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
				 <ListTable 
    ListName={"Employee Name"}
    ListRole={"Date"}
    ListDepartment={"Status"}
    ListAction={"Actions"}
    showDataList={attendanceRecords.map(record => (
        <CommonTable 
            key={record.attendanceId}
            name={record.employee.name}
            role={moment(record.created_at).format("YYYY-MM-DD")}
            id={
                <select
                    value={record.status}
                    onChange={(e) => handleAttendanceChange(record.attendanceId, e.target.value)}
                    className="border rounded"
                >
                    <option value="ABSENT">ABSENT</option>
                    <option value="PRESENT">PRESENT</option>
                    <option value="LATE">LATE</option>
                </select>
            }
            actions={[
                {
                    type: "button",
                    label: "Delete",
                    onClick: () => deleteAttendance(record.attendanceId)
                }
            ]}
        />
    ))}
/>

			)}
			<button onClick={submitAttendance} className="bg-linear-blue hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
  Mark Attendance
</button>

	
		</div>
	);
};

export default Attendance;
