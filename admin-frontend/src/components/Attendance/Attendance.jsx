import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import moment from "moment";
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
	 const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
	  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPageNumber(1); // reset to first page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);
	// Fetch All Teachers
  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.FETCH_ALL_TEACHERS(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: debouncedSearch,
          pageNumber,
          pageSize,
        },
      });

      if (Array.isArray(response.data.data)) {
        setTeachers(response.data.data);
        setTotalPages(response.data.totalPages || 1); // optional
      } else {
        console.error("Unexpected data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  }, [token, debouncedSearch, pageNumber, pageSize]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);


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
				alert(error.response.data.message);
		} finally {
			setShowUpdateDialog(false);
			onClose();
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
			<h1 className=" font-bold mb-4">Mark Employee Attendance</h1>
			<div className="flex gap-4">

			<input
				type="date"
				value={selectedDate.format("YYYY-MM-DD")}
				onChange={(e) => handleDateChange(e.target.value)}
				className="border p-2 rounded"
			/>
			   <div className="mb-4 w-full sm:w-1/2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">
                🔍
              </span>
            </div>
               </div>
			   
			</div>
			{teachers.length === 0 ? (
				<p>No employees found for the selected date.</p>
			) : (
				 <ListTable 
    ListName={"Employee Name"}
    ListRole={"Date"}
    ListDepartment={"Status"}
    // ListAction={"Actions"}
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
        />
    ))}
/>
			)}
			 <div className="flex justify-between mt-3 mb-3">
    <button
      onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
      disabled={pageNumber === 1}
      className="bg-gray-200 px-4 py-2 rounded"
    >
      Prev
    </button>
    <span>Page {pageNumber}</span>
    <button
      onClick={() => setPageNumber((prev) => prev + 1)}
      className="bg-gray-200 px-4 py-2 rounded"
    >
      Next
    </button>
  </div>
			<button onClick={submitAttendance} className="bg-linear-blue hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
  Mark Attendance
</button>

	
		</div>
	);
};

export default Attendance;
