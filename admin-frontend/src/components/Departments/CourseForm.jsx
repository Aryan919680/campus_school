import React, { useEffect, useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

const CourseForm = ({ closeCoursePage, openFeesPage }) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        fetchDepartments();
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const [courses, setCourses] = useState([]);
    const [courseInput, setCourseInput] = useState("");
    const [courseCodeInput, setCourseCodeInput] = useState("");
    const [durationInput, setDurationInput] = useState("");
    const [semestersInput, setSemestersInput] = useState("");
    const [specializationInput, setSpecializationInput] = useState("");
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [courseAdded, setCourseAdded] = useState(false);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;

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

    const handleAddCourse = async () => {
        if (!courseInput.trim() || !courseCodeInput.trim() || !durationInput.trim() || !semestersInput.trim() || !selectedDepartment) {
            return alert("Please fill in all required fields.");
        }

        const newCourse = {
            name: courseInput.trim(),
            code: courseCodeInput.trim(),
            duration: parseInt(durationInput.trim()),
            numberOfSemesters: parseInt(semestersInput.trim()),
            specialization: specializationInput.trim() || null,
            departmentId: selectedDepartment,
            semesters: Array.from({ length: parseInt(semestersInput.trim()) }, (_, i) => ({ name: `Sem ${i + 1}` }))
        };
        try {
            const response = await axios.post(`${API_ENDPOINTS.SUBMIT_COURSES()}/${selectedDepartment}/register`, { courses: [...courses, newCourse] }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data.data);
            localStorage.setItem("courseId", response.data.data.courses[0].courseId);
            setCourses([...courses, newCourse]);
            setCourseInput("");
            setCourseCodeInput("");
            setDurationInput("");
            setSemestersInput("");
            setSpecializationInput("");
            setSelectedDepartment("");
            setCourseAdded(true);
        } catch (error) {
            console.error("Error adding course:", error);
        }
    };

    const handleSubmit = async () => {
        openFeesPage();
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 border border-gray-100">
            <div className="bg-gray-800 p-8 rounded-xl w-3/12">
                <form className="text-black">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Course Name:</label>
                        <input
                            type="text"
                            value={courseInput}
                            onChange={(e) => setCourseInput(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                            placeholder="Enter course name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Course Code:</label>
                        <input
                            type="text"
                            value={courseCodeInput}
                            onChange={(e) => setCourseCodeInput(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                            placeholder="Enter course code"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Duration (Years):</label>
                        <input
                            type="number"
                            value={durationInput}
                            onChange={(e) => setDurationInput(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                            placeholder="Enter duration"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Number of Semesters:</label>
                        <input
                            type="number"
                            value={semestersInput}
                            onChange={(e) => setSemestersInput(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                            placeholder="Enter number of semesters"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Specialization (Optional):</label>
                        <input
                            type="text"
                            value={specializationInput}
                            onChange={(e) => setSpecializationInput(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                            placeholder="Enter specialization"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Department:</label>
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept.departmentId} value={dept.departmentId}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {!courseAdded && (
                        <button
                            type="button"
                            onClick={handleAddCourse}
                            className="w-full px-4 py-2 mb-4 text-white bg-blue-600 rounded-lg bg-linear-blue"
                        >
                            Add Course
                        </button>
                    )}
                    <div className="mb-4 text-white">
                        {courses.map((course, index) => (
                            <div key={index} className="p-2 bg-gray-700 rounded-md mb-2">
                                {course.name} ({course.code})
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end items-center mt-4 gap-4">
                        <button className="px-4 py-2 w-1/2 text-white bg-red-600 rounded-lg hover:bg-red-500" type="button" onClick={closeCoursePage}>Previous</button>
                        <button className="px-4 py-2 w-1/2 text-white bg-green-600 rounded-lg" type="button" onClick={handleSubmit}>Next</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default React.memo(CourseForm);
