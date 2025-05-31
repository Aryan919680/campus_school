import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import moment from "moment";
import ListTable from "../List/ListTable";
import CommonTable from "../List/CommonTable";
const CollegeMarkedAttendance = () =>{
    const [departments, setDepartments] = useState([]);
          const [courses, setCourses] = useState([]);
          const [semesters, setSemesters] = useState([]);
          const [selectedDepartment, setSelectedDepartment] = useState("");
          const [selectedCourse, setSelectedCourse] = useState("");
          const [selectedSemester, setSelectedSemester] = useState("");
           const [students, setStudents] = useState([]);
        const [selectedDate, setSelectedDate] = useState(moment());
         const [attendanceRecords, setAttendanceRecords] = useState([]);
        const userData = JSON.parse(localStorage.getItem("userData"));
	const token = userData?.token;
      useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.GET_DEPARTMENTS(), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setDepartments(data.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!selectedDepartment) return;
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.GET_COURSES_OF_DEPARTMENT()}/${selectedDepartment}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        setCourses(data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [selectedDepartment]);

  useEffect(() => {
    if (!selectedSemester || !selectedCourse) return;
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.GET_STUDENTS_DATA()}?semesterId=${selectedSemester}&courseId=${selectedCourse}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        setStudents(data.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [selectedSemester, selectedCourse]);

   useEffect(() => {
        if (!selectedSemester || !selectedCourse) return;
          fetchAttendanceRecords();
      }, [selectedDate,selectedSemester]);
const fetchAttendanceRecords = async () => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.GET_COLLEGE_ATTENDANCE()}?date=${selectedDate.format("YYYY-MM-DD")}&semestedId=${selectedSemester}`,
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

    const updateAttendance = async (recordId, status) => {
      try {
          await axios.put(API_ENDPOINTS.MARK_COLLEGE_ATTENDANCE(), { 
              attendanceId: recordId,
              status 
          },
          {
              headers: {
                     
                  Authorization: `Bearer ${token}`,
                },
      }
      );
          setAttendanceRecords(prevRecords => prevRecords.map(record =>
              record.attendanceId === recordId ? { ...record, status } : record
          ));
          alert("Record Updated Successfully");
      } catch (error) {
          console.error("Error updating attendance record:", error);
      }
  };

  const handleDateChange = (date) => {
              setSelectedDate(moment(date));
          };

          const deleteAttendance = async (recordId) => {
            try {
                await axios.delete(API_ENDPOINTS.MARK_COLLEGE_ATTENDANCE(), {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { attendanceIds: [recordId] }
                });
             fetchAttendanceRecords();
            } catch (error) {
                console.error("Error deleting attendance record:", error);
            }
        };
    return(
<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Mark College Student Attendance</h1>
			
              <div className="flex gap-4 mt-4">
                <input
				type="date"
				value={selectedDate.format("YYYY-MM-DD")}
				onChange={(e) => handleDateChange(e.target.value)}
				className="border p-2 rounded"
			/>
              <select
                onChange={(e) => setSelectedDepartment(e.target.value)}
                value={selectedDepartment}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.name}
                  </option>
                ))}
              </select>

              <select
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  // Find the selected course and extract its semesters
                  const selected = courses.find(
                    (course) => course.courseId === e.target.value
                  );
                  setSemesters(selected ? selected.semester : []);
                }}
                value={selectedCourse}
                disabled={!selectedDepartment}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseName}
                  </option>
                ))}
              </select>

              <select
                onChange={(e) => setSelectedSemester(e.target.value)}
                value={selectedSemester}
                disabled={!selectedCourse}
              >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem.semesterId} value={sem.semesterId}>
                    {sem.semesterName}
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
            name={record.student.name ? record.student.name : ""}
            role={moment(record.created_at).format("YYYY-MM-DD")}
            id={
                <select
                    value={record.status}
                    onChange={(e) => updateAttendance(record.attendanceId, e.target.value)}
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
			

	
		</div>
    )
}

export default CollegeMarkedAttendance;