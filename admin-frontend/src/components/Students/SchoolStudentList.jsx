
import React, { useState, useEffect } from "react";
import API_ENDPOINTS from "../../API/apiEndpoints";
import StudentTable from "./StudentTable";
import ListTableBtn from "../List/ListTableBtn";
import SchoolStudentForm from "./SchoolStudentForm";

const SchoolStudentList = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [subClasses, setSubClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubClass, setSelectedSubClass] = useState("");

  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.FETCH_CLASS, {
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
          `${API_ENDPOINTS.GET_STUDENTS_DATA}?classId=${selectedClass}&subClassId=${selectedSubClass}`,
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
            <h2 className="text-gray-600 font-semibold">Student Details</h2>
            <div className="flex gap-4 mt-4">
            {/* Class Dropdown */}
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
        

         

          <div className="flex items-center justify-between mt-4">
            <ListTableBtn
              onClick={handleFormModal}
              text={"Add Student"}
              buttonColor={"bg-linear-green"}
              borderRadius={"rounded"}
            />
          </div>

          {formModalOpen && (
            <SchoolStudentForm
              isOpen={formModalOpen}
              onClose={() => setFormModalOpen(false)}
              onStudentAdd={handleStudentAdd}
            />
          )}
  </div>
          <StudentTable students={students} onDeleteProfile={handleDeleteProfile} />
        </div>
        
      )}
    </>
  );
};

export default SchoolStudentList;
