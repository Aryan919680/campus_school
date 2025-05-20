import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import moment from "moment";
import ListTable from "../List/ListTable";
import CommonTable from "../List/CommonTable";
const SchoolAttendance = () => {
	 const [classes, setClasses] = useState([]);
      const [subClasses, setSubClasses] = useState([]);
      const [selectedClass, setSelectedClass] = useState("");
      const [selectedSubClass, setSelectedSubClass] = useState("");
       const [students, setStudents] = useState([]);
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
    const fetchClasses = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.FETCH_CLASS(), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setClasses(data.data.class);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  const handleClassChange = (e) => {
    const selectedClassId = e.target.value;
    setSelectedClass(selectedClassId);

    // Find and update the subclasses dropdown
    const selectedClassObj = classes.find((cls) => cls.classId === selectedClassId);
    setSubClasses(selectedClassObj ? selectedClassObj.subClass : []);
    setSelectedSubClass(""); // Reset subclass selection
  };

  useEffect(() => {
    if (!selectedClass || !selectedSubClass) return; // Ensure both are selected
  
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_ENDPOINTS.GET_STUDENTS_DATA()}?classId=${selectedClass}&subClassId=${selectedSubClass}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        setStudents(data.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchStudents();
  }, [selectedClass, selectedSubClass]);

	// Fetch Attendance for the Selected Date
	const fetchAttendance = async (date) => {
		try {
			const formattedDate = moment(date).format("YYYY-MM-DD");
			const response = await axios.get(`${API_ENDPOINTS.GET_COLLEGE_ATTENDANCE()}?date=${formattedDate}&subClass=${selectedSubClass}`,{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const attendanceData = response.data.data || [];
			const initialAttendanceData = {};
			attendanceData.forEach((item) => {
				initialAttendanceData[item.studentId] = item.status;
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
      if (!selectedClass || !selectedSubClass) return;
		fetchAttendance(selectedDate);
	}, [selectedDate,selectedSubClass]);

	const handleDateChange = (date) => {
		setSelectedDate(moment(date));
	};

	// const handleAttendanceChange = (employeeId, status) => {
	// 	if (!employeeId) {
	// 		console.error("Error: teacherId is undefined");
	// 		return;
	// 	}

	// 	setAttendance((prev) => ({
	// 		...prev,
	// 		[employeeId]: status,
	// 	}));
	// };

	// const submitAttendance = async () => {
	// 	// Filter only updated attendance
	// 	const updatedAttendance = Object.keys(attendance)
	// 		.filter((employeeId) => attendance[employeeId] !== initialAttendance[employeeId])
	// 		.map((employeeId) => ({
	// 			id: employeeId,
	// 			status: attendance[employeeId].toUpperCase(),
	// 		}));
	
	// 	if (updatedAttendance.length === 0) {
	// 		alert("No changes to update.");
	// 		setShowUpdateDialog(false);
	// 		return;
	// 	}
	
	// 	try {
	// 		const apiUrl = API_ENDPOINTS.MARK_ATTENDANCE();
	// 		await axios.post(
	// 			apiUrl,
	// 			{ attendance: updatedAttendance },
	// 			{
	// 				headers: {
	// 					Authorization: `Bearer ${token}`,
	// 				},
	// 			}
	// 		);
	// 		alert("Attendance marked successfully!");
	// 	} catch (error) {
	// 		console.error("Error marking attendance:", error);
	// 		alert("Error marking attendance. Please try again.");
	// 	} 
	// };
	
// 	 const deleteAttendance = async (recordId) => {
//             try {
//                 await axios.delete(API_ENDPOINTS.MARK_ATTENDANCE(), {
//                     headers: { Authorization: `Bearer ${token}` },
//                     data: { attendanceIds: [recordId] }
//                 });
//                 alert("Record Deleted Successfully");
//             } catch (error) {
//                 console.error("Error deleting attendance record:", error);
//             }
//         };

	const handleAttendanceChange = (studentId, status) => {
		if (!studentId) {
			console.error("Error: teacherId is undefined");
			return;
		}

		setAttendance((prev) => ({
			...prev,
			[studentId]: status,
		}));
	};


	const attendanceRecords = students.map((student) => ({
	attendanceId: student.studentId, // use employeeId as temporary id
	employee: {
		name: student.name,
	},
	status: attendance[student.studentId] || "ABSENT", // default if not marked
	created_at: selectedDate, // or actual date from backend if available
}));

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Mark School Student Attendance</h1>
			
              <div className="flex gap-4 mt-4">
                <input
				type="date"
				value={selectedDate.format("YYYY-MM-DD")}
				onChange={(e) => handleDateChange(e.target.value)}
				className="border p-2 rounded"
			/>
                <select onChange={handleClassChange} value={selectedClass}>
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className}
                </option>
              ))}
            </select>

            {/* SubClass Dropdown */}
            <select
              onChange={(e) => setSelectedSubClass(e.target.value)}
              value={selectedSubClass}
              disabled={!selectedClass}
            >
              <option value="">Select Subclass</option>
              {subClasses.map((subCls) => (
                <option key={subCls.subClassId} value={subCls.subClassId}>
                  {subCls.subClassName}
                </option>
              ))}
            </select>
            </div>
			{students.length === 0 ? (
				<p>No employees found for the selected date.</p>
			) : (
				 <ListTable 
    ListName={"Student Name"}
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
			{/* <button onClick={submitAttendance} className="bg-linear-blue hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
  Mark Attendance
</button> */}

	
		</div>
	);
};

export default SchoolAttendance;
