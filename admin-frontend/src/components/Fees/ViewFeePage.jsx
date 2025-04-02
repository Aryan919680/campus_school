import { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

export default function FeeManagement() {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ paid: true, due: true, partial: true });
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;
  const campusType = userData.data.campusType;
  useEffect(() => {
    if(campusType === "COLLEGE"){
      fetchDepartments();
    }else{
      fetchClasses();
    }

  }, []);
  const fetchClasses = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.FETCH_CLASS(),{
        headers: { Authorization: `Bearer ${token}` },
    });
      setClasses(response.data.data.class || []);
    } catch (error) {
      console.error("Failed to fetch classes.", error);
    }
  };
  useEffect(() => {
    if (selectedDepartment) fetchCourses(selectedDepartment);
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedClass) fetchStudents(selectedClass);
  }, [selectedClass]);

  useEffect(() => {
    if (selectedCourse) fetchStudents(selectedCourse);
  }, [selectedCourse]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_DEPARTMENTS(),{
        headers: { Authorization: `Bearer ${token}` },
    });
      setDepartments(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch departments.", error);
    }
  };

  const fetchCourses = async (departmentId) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.GET_COURSES_OF_DEPARTMENT()}/${departmentId}`,{
        headers: { Authorization: `Bearer ${token}` },
    });
      setCourses(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch courses.", error);
    }
  };

  const fetchStudents = async (courseId) => {
    try {
      var response = '';
      if(campusType === "COLLEGE"){
        response = await axios.get(`${API_ENDPOINTS.PAYMENT_FEES()}?courseId=${courseId}&year=2025`,{
          headers: { Authorization: `Bearer ${token}` },
        });
      }else{
        response = await axios.get(`${API_ENDPOINTS.PAYMENT_FEES()}?year=2025&classId=${courseId}`,{
          headers: { Authorization: `Bearer ${token}` },
      }
    )
    }
      const data = response.data.data || [];
      const processedStudents = data.map((s) => ({
        name: s.name,
        classSem: campusType === "COLLEGE" ? s.semester : s.subclass,
        course :campusType === "COLLEGE" ? s.course : s.class,
        total: s.amount || 0,
        paid: s.amount || 0,
        status: s.status ,
      }));
      setStudents(processedStudents);
    } catch (error) {
      console.error("Failed to fetch students data.", error);
    }
  };

  const filteredStudents = students

  return (
    <div className="max-w-4xl mx-auto p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">View Fees Record</h2>

{
  campusType === "COLLEGE" && <div>  <select
  className="border rounded p-2 w-full mb-4"
  value={selectedDepartment}
  onChange={(e) => {
    setSelectedDepartment(e.target.value);
    setSelectedCourse(""); 
    setStudents([]); 
  }}
>
  <option value="">Select Department</option>
  {departments.map((dept) => (
    <option key={dept.departmentId} value={dept.departmentId}>
      {dept.name}
    </option>
  ))}
</select>
   <select
   className="border rounded p-2 w-full mb-4"
   value={selectedCourse}
   onChange={(e) => setSelectedCourse(e.target.value)}
   disabled={!selectedDepartment}
 >
   <option value="">Select Course</option>
   {courses.map((course) => (
     <option key={course.courseId} value={course.courseId}>
       {course.courseName}
     </option>
   ))}
 </select>
 </div>
}
   {
    campusType === "SCHOOL" && <div>
         <select
        className="border rounded p-2 w-full mb-4"
        value={selectedClass}
        onChange={(e) => {
          setSelectedClass(e.target.value);
          setSelectedCourse("");
          setStudents([]);
        }}
      >
        <option value="">Select Class</option>
        {classes.map((cls) => (
          <option key={cls.classId} value={cls.classId}>
            {cls.className}
          </option>
        ))}
      </select>
      </div>
   }

   
      {/* Course Selection */}
   

      {/* Search and Filters */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search Student"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button className="bg-blue-500 text-white px-4 py-2">🔍</button>
      </div>

      <div className="flex space-x-4 mb-4">
        {Object.entries(filters).map(([key, value]) => (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value}
              onChange={() => setFilters({ ...filters, [key]: !value })}
            />
            <span className="capitalize">{key.replace("partial", "Partially Paid")}</span>
          </label>
        ))}
      </div>

      {/* Student Fees Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Student Name</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Class/Sem</th>
            <th className="border p-2">Total Fee</th>
            <th className="border p-2">Paid</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student.name} className="text-center">
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.course}</td>
                <td className="border p-2">{student.classSem}</td>
                <td className="border p-2">₹{student.total.toLocaleString()}</td>
                <td className="border p-2">₹{student.paid.toLocaleString()}</td>
                <td className="border p-2">{student.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border p-2 text-center text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* <div className="flex justify-between mt-4">
        <button className="bg-red-500 text-white px-4 py-2">Send Due Fee Notification</button>
        <button className="bg-gray-500 text-white px-4 py-2">Next</button>
      </div> */}
    </div>
  );
}
