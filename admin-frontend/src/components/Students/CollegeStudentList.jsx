import React, { useState, useEffect } from "react";
import API_ENDPOINTS from "../../API/apiEndpoints";
import StudentTable from "./StudentTable";
import ListTableBtn from "../List/ListTableBtn";
import CollegeStudentForm from "./CollegeStudentForm";
import UpdateStudent from "./UpdateStudent";
const CollegeStudentList = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // ✅
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // ✅ debounce input by 500ms
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

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


  const handleFormModal = () => {
    setFormModalOpen(true);
  };

  const handleDeleteProfile = async (id) => {
    try {
      const response = await fetch(API_ENDPOINTS.DELETE_STUDENTS(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      setStudents(students.filter((student) => student.studentId !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleStudentAdd = (newStudent) => {
    setStudents((prevState) => [...prevState, newStudent]);
  };

  const onUpdateProfile = (student) => {
    setEditData(student);
    setIsEdit(true);
  }

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white p-8 rounded-md w-fit sm:w-full">
          <div className="flex items-center justify-between pb-6">
            <div>
              <h2 className="text-gray-600 font-semibold text-2xl mt-4">Student Details</h2>
            </div>
            <div className="flex gap-2 mt-4">
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
            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleFormModal}
                  className="bg-linear-blue text-white font-bold py-2 px-4 rounded"
                >
                  Add Students
                </button>
              </div>
            </div>

            {formModalOpen && (
              <CollegeStudentForm
                isOpen={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                onStudentAdd={handleStudentAdd}
              />
            )}
          </div>
          <StudentTable
            students={students}
            onDeleteProfile={handleDeleteProfile}
            onUpdateProfile={onUpdateProfile}
          />
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
        </div>
      )}
      {
        isEdit && <UpdateStudent studentData={editData} setIsEditing={setIsEdit} />
      }

    </>
  );
};

export default CollegeStudentList;
