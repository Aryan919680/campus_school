import React, { useState, useEffect, useCallback } from "react";
import DepartmentForm from "./DepartmentForm.jsx";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import CourseForm from "./CourseForm.jsx";
import ListTable from '../List/ListTable.jsx';
import DepartmentFees from './DepartmentFees.jsx';
import CommonTable from "../List/CommonTable.jsx";
import UpdateCoursePage from "./UpdateCoursePage.jsx";
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
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateFormValues, setUpdateFormValues] = useState({ name: "", code: "" });
  const [updateCourse,setUpdateCourse] = useState(false);
  const [updateCourseValue,setUpdateCourseValue] = useState([]);

  const fetchDepartmentOptions = useCallback(async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_DEPARTMENTS(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments(response.data.data);
    } catch (error) {
      console.error("Error fetching department options:", error.response?.data || error.message);
      alert("Session expired. Please log in again.");
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
      await axios.delete(API_ENDPOINTS.DELETE_DEPARTMENT(), {
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
    setShowFeesPage(false)
  }
  
  const showCourseData = async(departmentId)=>{
   setShowDepartment(false);
   try {
    const response = await axios.get(`${API_ENDPOINTS.GET_COURSES_OF_DEPARTMENT()}/${departmentId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
   setSelectedCourses(response.data.data)
  } catch (error) {
    console.error("Error fetching department options:", error.response?.data || error.message);
    alert("Failed to fetch department data. Please try again.");
  }
  }
  const handleUpdate = (department) => {
    setUpdateFormValues({
      departmentId: department.departmentId,
      name: department.name,
      code: department.code,
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    console.log(updateFormValues)
    try {
      await axios.put(`${API_ENDPOINTS.SUBMIT_COURSES()}/${updateFormValues.departmentId}`, updateFormValues, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Department updated successfully!");
      setShowUpdateModal(false);
      fetchDepartmentOptions();
    } catch (error) {
      console.error("Error updating department:", error.response?.data || error.message);
      alert("Failed to update department. Please try again.");
    }
  };

  const handleDeleteCourse = async (courseId,departmentId) =>{
     console.log(courseId,departmentId)
     try {
      await axios.delete(`${API_ENDPOINTS.SUBMIT_COURSES()}/${departmentId}/course`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { courseIds: [courseId] },
      });
      alert("Course deleted successfully!");
      setShowDepartment(true);
    } catch (error) {
      console.error("Error deleting department:", error.response?.data || error.message);
      alert("Failed to delete department. Please try again.");
    }
  }
  const handleUpdateCourseModal = (course) =>{
      setUpdateCourse(true);
      setUpdateCourseValue(course);
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
        <button
                  onClick={() => handleUpdate(department)}
                  className="bg-yellow-500 text-white py-2 px-4 rounded"
                >
                  Update
                </button>
      </div>
    </div>
  ))}
</div>
: <div>
  <ListTable
ListName="Course Name"
ListRole="Specialization"
ListDepartment ="Number of Semesters"
ListAction="Actions"

showDataList={selectedCourses.map((course) => (

  <CommonTable
								key={course.courseId}
								name={course.courseName}
								role={course.specialization}
								id={course.numberOfSemesters}
								actions={[
									{
										type: "button",
										label: "Remove",
										 onClick: () => handleDeleteCourse(course.courseId,course.departmentId),
									},
                  {
                    type: "button",
										label: "Update",
									 onClick: () => handleUpdateCourseModal(course),
                  }
								]}
							/>
))}
/>
<button  className="bg-linear-blue text-white py-2 px-4 rounded" onClick={()=>setShowDepartment(true)}>Show Departments</button>


</div>
}
{showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Update Department</h3>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Department Name</label>
                <input
                  type="text"
                  value={updateFormValues.name}
                  onChange={(e) => setUpdateFormValues({ ...updateFormValues, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowUpdateModal(false)} className="bg-gray-500 text-white py-2 px-4 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-linear-blue text-white py-2 px-4 rounded">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
{
  updateCourse && <UpdateCoursePage setUpdateCourse={setUpdateCourse} updateCourseValue= {updateCourseValue}/>
}

    </div>
  );
};

export default Departments;
