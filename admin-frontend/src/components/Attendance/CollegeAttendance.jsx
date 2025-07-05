import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import moment from "moment";
import ListTable from "../List/ListTable";
import CommonTable from "../List/CommonTable";
const CollegeAttendance = () => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [attendance, setAttendance] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;
  const [initialAttendance, setInitialAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const getUserIdFromLocalStorage = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData && userData.id ? userData.id : null;
  };
  const userId = getUserIdFromLocalStorage();
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // ✅ debounce input by 500ms
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);
  // Fetch All Teachers
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
      setIsLoading(true);
      try {
        const url = new URL(API_ENDPOINTS.GET_STUDENTS_DATA());
        url.searchParams.append("semesterId", selectedSemester);
        url.searchParams.append("courseId", selectedCourse);
        url.searchParams.append("pageNumber", pageNumber);
        url.searchParams.append("pageSize", pageSize);
        if (debouncedSearchTerm) {
          url.searchParams.append("search", debouncedSearchTerm); // ✅ pass search param
        }

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        setStudents(data.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, [selectedSemester, selectedCourse, debouncedSearchTerm, pageNumber, pageSize]);

  // Fetch Attendance for the Selected Date
  const fetchAttendance = async (date) => {
    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const response = await axios.get(`${API_ENDPOINTS.GET_COLLEGE_ATTENDANCE()}?date=${formattedDate}&semesterId=${selectedSemester}`, {
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
    if (!selectedSemester || !selectedCourse) return;
    fetchAttendance(selectedDate);
  }, [selectedDate, selectedSemester]);

  const handleDateChange = (date) => {
    setSelectedDate(moment(date));
  };

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

  const submitAttendance = async () => {
    // Filter only updated attendance
    const updatedAttendance = Object.keys(attendance)
      .filter((studentId) => attendance[studentId] !== initialAttendance[studentId])
      .map((studentId) => ({
        id: studentId,
        status: attendance[studentId].toUpperCase(),
      }));

    if (updatedAttendance.length === 0) {
      alert("No changes to update.");
      setShowUpdateDialog(false);
      return;
    }

    try {
      const apiUrl = API_ENDPOINTS.MARK_COLLEGE_ATTENDANCE();
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
      console.error("Error marking attendance:", error.response.data.message);
      alert(error.response.data.message);
    }
  };


  const attendanceRecords = students.map((student) => ({
    attendanceId: student.studentId, // use employeeId as temporary id
    employee: {
      name: student.name ? student.name : "",
    },
    status: attendance[student.studentId] || "ABSENT", // default if not marked
    created_at: selectedDate, // or actual date from backend if available
  }));

  return (
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
        <div className="mt-4 w-[250px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Student..."
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
      {students.length === 0 ? (
        <p>No students found for the selected date.</p>
      ) : (
        <ListTable
          ListName={"Student Name"}
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

export default CollegeAttendance;
