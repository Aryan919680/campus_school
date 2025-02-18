import React, { useState, useEffect, useCallback } from "react";
import DepartmentForm from "./DepartmentForm.jsx";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import CourseForm from "./CourseForm.jsx";
import ListTable from '../List/ListTable.jsx';
import DepartmentFees from './DepartmentFees.jsx';
const Departments = () => {
  const [openForm, setOpenForm] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", code: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [departments, setDepartments] = useState([]);
  const [showDepartment,setShowDepartment] = useState(true);
  const [showCourse, setShowCourse] = useState(false);
  const [showFeesPage, setShowFeesPage] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;

  const fetchDepartmentOptions = useCallback(async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_DEPARTMENTS, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments(response.data.data);
    } catch (error) {
      console.error("Error fetching department options:", error.response?.data || error.message);
      alert("Failed to fetch department data. Please try again.");
    }
  }, [token]);

  useEffect(() => {
    fetchDepartmentOptions();
  }, [fetchDepartmentOptions]);

  const onClose = useCallback(() => {
    setOpenForm(false);
    setErrorMessage("");
  }, []);

  const showCoursePage = useCallback(() => {
    setOpenForm(false);
    setShowCourse(true);
  }, []);

  const closeCoursePage = useCallback(() => {
    setOpenForm(true);
    setShowCourse(false);
  }, []);

  const handleForm = useCallback(() => {
    setOpenForm(true);
  }, []);

  const handleDelete = async (departmentId) => {
    try {
      await axios.delete(API_ENDPOINTS.DELETE_DEPARTMENT, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { departmentIds: [departmentId] },
      });
      alert("Department deleted successfully!");
      setDepartments(departments.filter((dept) => dept.departmentId !== departmentId));
    } catch (error) {
      console.error("Error deleting department:", error.response?.data || error.message);
      alert("Failed to delete department. Please try again.");
    }
  };


  const openFeesPage = ()=>{
    setShowFeesPage(true);
    setShowCourse(false);
    setOpenForm(false);
  }
  const closeFeesPage = () => {
    setShowCourse(true);
    setOpenForm(false);
    setShowFeesPage(false)
  }
  const closeAllPages = () =>{
    setShowCourse(false);
    setOpenForm(false);
    setShowCourse(true);
  }
  
  const showCourseData = async(departmentId)=>{
   setShowDepartment(false);
   try {
    const response = await axios.get(`${API_ENDPOINTS.GET_COURSES_OF_DEPARTMENT}/${departmentId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
   console.log(response.data.data)
   setSelectedCourses(response.data.data)
  } catch (error) {
    console.error("Error fetching department options:", error.response?.data || error.message);
    alert("Failed to fetch department data. Please try again.");
  }
  }
  return (
    <div className="bg-white p-8 rounded-md w-full">
      <div className="flex items-center justify-between pb-6 flex-wrap gap-2">
        <h2 className="text-gray-600 font-semibold text-2xl">Department Management</h2>
        <button onClick={handleForm} className="bg-linear-blue text-white font-bold py-2 px-4 rounded">
          Add New Department
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      {openForm && (
        <DepartmentForm
          formValues={formValues}
          onClose={onClose}
          errorMessage={errorMessage}
          refreshDepartments={fetchDepartmentOptions}
          showCoursePage={showCoursePage}
        />
      )}

      {showCourse && <CourseForm closeCoursePage={closeCoursePage} openFeesPage={openFeesPage}/>}
      {showFeesPage && <DepartmentFees closeFeesPage={closeFeesPage} closeAllPages={closeAllPages}/>}
{
  showDepartment ?
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
  {departments.map((department) => (
    <div key={department.departmentId} className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-800">{department.name}</h3>
      <p className="text-gray-600">Code: {department.code}</p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => handleDelete(department.departmentId)}
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Delete
        </button>
        <button
          onClick={() => showCourseData(department.departmentId)}
          className="bg-linear-blue text-white py-2 px-4 rounded"
        >
          Get Courses
        </button>
      </div>
    </div>
  ))}
</div>
: <div><ListTable
ListName="Course Name"
ListRole="Specialization"
ListDepartment ="Number of Semesters"
ListAction="Actions"

showDataList={selectedCourses.map((course) => (
  <tr key={course.courseId}>
    <td className="text-center">{course.courseName}</td>
    <td className="text-center">{course.specialization}</td>
    <td className="text-center">{course.numberOfSemesters}</td>
    <td className="text-center">
      <button>
        Edit
      </button>
      <button>
        Delete
      </button>
    </td>
  </tr>
))}
/>
<button  className="bg-linear-blue text-white py-2 px-4 rounded" onClick={()=>setShowDepartment(true)}>Show Departments</button>
</div>
}
    
    </div>
  );
};

export default Departments;
