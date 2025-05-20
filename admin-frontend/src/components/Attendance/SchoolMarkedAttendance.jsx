import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import moment from "moment";
import ListTable from "../List/ListTable";
import CommonTable from "../List/CommonTable";
const SchoolMarkedAttendance = () =>{
      const [classes, setClasses] = useState([]);
      const [subClasses, setSubClasses] = useState([]);
      const [selectedClass, setSelectedClass] = useState("");
      const [selectedSubClass, setSelectedSubClass] = useState("");
           const [students, setStudents] = useState([]);
        const [selectedDate, setSelectedDate] = useState(moment());
         const [attendanceRecords, setAttendanceRecords] = useState([]);
        const userData = JSON.parse(localStorage.getItem("userData"));
	const token = userData?.token;

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
        if (!selectedClass || !selectedSubClass) return;
          fetchAttendanceRecords();
      }, [selectedDate,selectedSubClass]);
const fetchAttendanceRecords = async () => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.GET_COLLEGE_ATTENDANCE()}?date=${selectedDate.format("YYYY-MM-DD")}&subClassId=${selectedSubClass}`,
        {
            headers: {
                       
                Authorization: `Bearer ${token}`,
              },
            
        });
            setAttendanceRecords(response.data.data);
        } catch (error) {
            console.error("Error fetching attendance records:", error);
        }
    };

    return(
<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Marked School Student Attendance</h1>
			
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
    )
}

export default SchoolMarkedAttendance;