import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import CreateTimetable from "./CreateTimetable";
const AddSubjects = ({ setOpenForm,openForm }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [savedSubjects, setSavedSubjects] = useState([]);
    const [fetchedSubjects, setFetchedSubjects] = useState([]);

    const [subjectData, setSubjectData] = useState({
        departmentId: "",
        courseId: "",
        semesterId: "",
        subjectName: "",
        subjectCode: ""
    });
    const [isSemesterLocked, setIsSemesterLocked] = useState(false);
    const [showAssignSubjectPage, setShowAssignSubjectPage] = useState(false);
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.GET_DEPARTMENTS(), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDepartments(response.data.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };
        fetchDepartments();
    }, [token]);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        if (name === "courseId") {
            // Fetch existing subjects when semester is selected
            try {
                const response = await axios.get(`${API_ENDPOINTS.GET_SUBJECTS()}?courseId=${value}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFetchedSubjects(response.data.data)
            } catch (error) {
                console.error("Error fetching subjects of semester:", error);
           }  
        }
        setSubjectData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDepartmentChange = async (e) => {
        const departmentId = e.target.value;
        handleChange(e);

        if (!departmentId) return;

        try {
            const response = await axios.get(
                `${API_ENDPOINTS.GET_COURSES_OF_DEPARTMENT()}/${departmentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCourses(response.data.data);
            setSemesters([]);
            setSubjectData((prev) => ({
                ...prev,
                courseId: "",
                semesterId: ""
            }));
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        handleChange(e);

        const selectedCourse = courses.find(c => c.courseId === courseId);
        if (selectedCourse) {
            setSemesters(selectedCourse.semester);
            setSubjectData((prev) => ({
                ...prev,
                semesterId: ""
            }));
        }
    };

   
const handleSubmit = (e) => {
    e.preventDefault();
    const { departmentId, courseId, semesterId, subjectName, subjectCode } = subjectData;

    if (!departmentId || !courseId || !semesterId || !subjectName.trim() || !subjectCode.trim()) {
        alert("Please fill in all fields.");
        return;
    }

    // Check semester consistency
    if (savedSubjects.length > 0) {
        const currentSemId = savedSubjects[0].semesterId;
        if (semesterId !== currentSemId) {
            alert("All subjects must belong to the same semester.");
            return;
        }
    }

    const trimmedName = subjectName.trim().toLowerCase();
    const trimmedCode = subjectCode.trim().toLowerCase();

    // ✅ Check for duplicates in fetched subjects (from DB)
    const duplicateInFetched = fetchedSubjects.some(
        subj =>
            subj.subjectCode.toLowerCase() === trimmedCode &&
            subj.name.toLowerCase() === trimmedName
    );

    if (duplicateInFetched) {
        alert("Subject with this name or code already exists.");
        return;
    }

    // ✅ Check for duplicates in savedSubjects (already added in UI)
    const duplicateInSaved = savedSubjects.some(
        subj =>
            subj.subjectCode.toLowerCase() === trimmedCode &&
            subj.subjectName.toLowerCase() === trimmedName
    );

    if (duplicateInSaved) {
        alert("This subject is already added.");
        return;
    }

    const newSubject = {
        ...subjectData,
    };

    setSavedSubjects(prev => [...prev, newSubject]);
    setIsSemesterLocked(true);

    // Clear only subject name for convenience
    setSubjectData(prev => ({
        ...prev,
        subjectName: "",
        subjectCode: ""
    }));
};

   
    const handleClearSubjects = () => {
        setSavedSubjects([]);
        setIsSemesterLocked(false);
        setSubjectData({
            departmentId: "",
            courseId: "",
            semesterId: "",
            subjectName: "",
            subjectCode: ""
        });
        setCourses([]);
        setSemesters([]);
    };

    const handleNextPage = async () => {
        const formattedSubjects = savedSubjects.map(subj => ({
            name: subj.subjectName,
            code: subj.subjectCode,
            courseId: subj.courseId 
        }));
    
        try {
           const response =  await axios.post(API_ENDPOINTS.CREATE_SUBJECT(), { subjects: formattedSubjects }, {
                headers: { Authorization: `Bearer ${token}` }
            });
                setShowAssignSubjectPage(true);          
        } catch (error) {
            console.error("Error creating subjects:", error);
            alert("Failed to create subjects. Please try again.");
        }
    };
    
    

    return (
        <>
        {
            !showAssignSubjectPage &&
            <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black bg-opacity-80 backdrop-blur-sm">
            <div className="bg-gray-800 p-6 rounded-xl w-3/12 text-white space-y-4">
                <h2 className="text-xl font-semibold">Step 1: Add Subject</h2>

                <select
                    name="departmentId"
                    value={subjectData.departmentId}
                    onChange={handleDepartmentChange}
                    className="block w-full p-2 rounded-md text-black"
                    disabled={isSemesterLocked}
                >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                        <option key={dept.departmentId} value={dept.departmentId}>
                            {dept.name}
                        </option>
                    ))}
                </select>

                <select
                    name="courseId"
                    value={subjectData.courseId}
                    onChange={handleCourseChange}
                    className="block w-full p-2 rounded-md text-black"
                    disabled={isSemesterLocked}
                >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                        <option key={course.courseId} value={course.courseId}>
                            {course.courseName}
                        </option>
                    ))}
                </select>

                <select
                    name="semesterId"
                    value={subjectData.semesterId}
                    onChange={handleChange}
                    className="block w-full p-2 rounded-md text-black"
                    disabled={isSemesterLocked}
                >
                    <option value="">Select Semester</option>
                    {semesters.map(sem => (
                        <option key={sem.semesterId} value={sem.semesterId}>
                            {sem.semesterName}
                        </option>
                    ))}
                </select>
                <input
    type="text"
    name="subjectCode"
    value={subjectData.subjectCode}
    onChange={handleChange}
    placeholder="Enter Subject Code"
    className="block w-full p-2 rounded-md text-black"
/>

                <input
                    type="text"
                    name="subjectName"
                    value={subjectData.subjectName}
                    onChange={handleChange}
                    placeholder="Enter Subject Name"
                    className="block w-full p-2 rounded-md text-black"
                />

                <div className="flex space-x-2">
                    <button
                        onClick={handleSubmit}
                        className="bg-linear-blue hover:bg-blue-600 text-white w-full py-2 rounded-md"
                    >
                        Add Subject
                    </button>
                  
                    {savedSubjects.length > 0 && (
                        <button
                            onClick={handleClearSubjects}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-md"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <div className="flex space-x-2">
                <button
    onClick={handleNextPage}
    disabled={savedSubjects.length === 0 && fetchedSubjects.length === 0}
    className={`${
        savedSubjects.length === 0 && fetchedSubjects.length === 0 ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
    } text-white w-full py-2 rounded-md`}
>
    Next Page
</button>

                    {/* <button
                        onClick={onClose}
                        className="bg-red-500 hover:bg-blue-600 text-white w-full py-2 rounded-md"
                    >
                        Cancel
                    </button> */}
                </div>

<div className="mt-4">
    <h3 className="text-lg font-medium">Saved Subjects:</h3>
    {savedSubjects.length === 0 ? (
        <p className="text-sm text-gray-300">No subjects added yet.</p>
    ) : (
        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
            {savedSubjects.map((subj, index) => (
                <li key={`new-${index}`}>{subj.subjectCode}-{subj.subjectName || subj.name} <span className="text-xs text-yellow-300">(new)</span></li>
            ))}
        </ul>
    )}
</div>


            </div>
        </div>
        }

          {/* {
            showAssignSubjectPage ? <AssignTeacher subjectData={subjectData} setShowAssignSubjectPage={setShowAssignSubjectPage} setOpenForm={setOpenForm}/> : "hi"

          } */}


           {
            showAssignSubjectPage && 
            <CreateTimetable subjectData={subjectData} setShowAssignSubjectPage={setShowAssignSubjectPage} setOpenForm={setOpenForm} />
            
       
            
          }
      </>
    );
};

export default AddSubjects;
