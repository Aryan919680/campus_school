import React, { useState, useEffect } from "react";
import API_ENDPOINTS from "../../API/apiEndpoints";
import StudentTable from "./StudentTable";
import ListTableBtn from "../List/ListTableBtn";
import CollegeStudentForm from "./CollegeStudentForm";

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
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, [selectedSemester, selectedCourse]);


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

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white p-8 rounded-md w-fit sm:w-full">
          <div className="flex items-center justify-between pb-6">
            <div>
              <h2 className="text-gray-600 font-semibold">Student Details</h2>
            </div>
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
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <ListTableBtn
                  onClick={handleFormModal}
                  text={"Add Student"}
                  buttonColor={"bg-linear-green"}
                  borderRadius={"rounded"}
                />
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
          />
       
        </div>
      )}
    </>
  );
};

export default CollegeStudentList;
