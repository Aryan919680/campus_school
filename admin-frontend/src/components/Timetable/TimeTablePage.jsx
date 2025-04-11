import { useState,useCallback,useEffect } from "react";
import API_ENDPOINTS from "../../API/apiEndpoints";
import AddSubjects from "./AddSubjects";
import axios from "axios";
import ListTable from "../List/ListTable";
const TimeTablePage = () => {
  const [departments, setDepartments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
  const [timeTable, setTimeTable] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const parsedData = userData;
  const token = parsedData.token;
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
    if (!selectedSemester || !selectedCourse || !selectedDay) return;
    const fetchTimetable = async () => {
      try {
        const dayIndex = days.indexOf(selectedDay) + 1; // Convert to 1-based index
        const response = await fetch(
          `${API_ENDPOINTS.GET_TIMETABLE()}?semesterId=${selectedSemester}&day=${dayIndex}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        setTimeTable(data.data);
      } catch (error) {
        console.error("Error fetching timetable:", error);
      }
    };
    fetchTimetable();
  }, [selectedSemester, selectedCourse, selectedDay]);


   const handleForm = useCallback(() => {
      setOpenForm(true);
    }, []);

    
  return (
    <div className="bg-white p-8 rounded-md w-full">
      <div className="flex items-center justify-between pb-6 flex-wrap gap-2">
        <h2 className="text-gray-600 font-semibold text-2xl">
         Timetable
        </h2>
        <div className="flex gap-4 mt-4">
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
              <select
            onChange={(e) => setSelectedDay(e.target.value)}
            value={selectedDay}
            disabled={!selectedSemester}
          >
            <option value="">Select Day</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
            </div>
        <div className="flex justify-center items-center">
          <button
            onClick={handleForm}
            className="bg-linear-blue text-white font-bold py-2 px-4 rounded w-full md:w-fit"
          >
            Create Timetable
          </button>
        </div>
      </div>

      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

       {openForm && <AddSubjects setOpenForm={setOpenForm} openForm={openForm}/>

       }
{timeTable.length > 0 && (
  <div className="mt-8">
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border-b">Subject Name</th>
          <th className="py-2 px-4 border-b">Day</th>
          <th className="py-2 px-4 border-b">From</th>
          <th className="py-2 px-4 border-b">To</th>
          <th className="py-2 px-4 border-b">Period Name</th>
        </tr>
      </thead>
      <tbody>
        {timeTable.map((item) => (
          <tr key={item.timtableId} className="text-center">
            <td className="py-2 px-4 border-b">{item.subjectName}</td>
            <td className="py-2 px-4 border-b">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][item.dayNumber - 1]}
            </td>
            <td className="py-2 px-4 border-b">{item.from}</td>
            <td className="py-2 px-4 border-b">{item.to}</td>
            <td className="py-2 px-4 border-b">{item.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
};

export default TimeTablePage;
