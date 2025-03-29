
import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import { use } from "react";

const AddRolePage = ({ setFormModalOpen, employeeId }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;

    const [employee, setEmployee] = useState({
        name: "",
        role: "",
        classId: "",
        subclassId: "",
        departmentId: "",
        courseId: "",
        semester: "",
    });

    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subclasses, setSubclasses] = useState([]);
    const [semesters, setSemesters] = useState([]);

    const campusType = userData.data.campusType.toLowerCase();
    const dropdownValue =
        campusType === "school"
            ? ["Teacher", "Class Teacher", "Incharge/Coordinator", "Vice Principal", "Principal", "Director", "Manager"]
            : ["Faculty", "HOD", "Dean", "Director", "Manager"];

    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch employee details

        // Fetch class and subclass for school
        const fetchSchoolData = async () => {
            try {
                const classRes = await axios.get(API_ENDPOINTS.GET_CLASSES(), {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setClasses(classRes.data.data);
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };

        // Fetch departments, courses, and semesters for college
        const fetchCollegeData = async () => {
            try {
                const deptRes = await axios.get(API_ENDPOINTS.GET_DEPARTMENTS(), {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDepartments(deptRes.data.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        // fetchEmployee();
        if (campusType === "school") fetchSchoolData();
        if (campusType === "college") fetchCollegeData();
    }, [employeeId, token, campusType]);

    // Fetch subclasses on class change for school
    const fetchSubclasses = async (classId) => {
        try {
            const subclassRes = await axios.get(API_ENDPOINTS.GET_SUBCLASSES(classId), {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSubclasses(subclassRes.data.data);
        } catch (error) {
            console.error("Error fetching subclasses:", error);
        }
    };

    // Fetch courses on department change for college
    const fetchCourses = async (departmentId) => {
        try {
            const courseRes = await axios.get(`${API_ENDPOINTS.GET_COURSES_OF_DEPARTMENT()}/${departmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCourses(courseRes.data.data);
           
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    useEffect(() => {
        if (employee.courseId && courses.length > 0) {
            console.log("here")
            const selectedCourseData = courses.find(
                (course) => course.courseId === employee.courseId
            );
            console.log(selectedCourseData)
            if (selectedCourseData) {
                console.log('@')
                setSemesters(selectedCourseData.semester || []);
            } else {
                setSemesters([]); 
            }
        }
        console.log(semesters)
    }, [employee.courseId, courses]);
    
    const handleChange = (name, value) => {
        setEmployee({ ...employee, [name]: value });

        // Dynamic fetching based on change
        if (name === "classId" && campusType === "school") {
            fetchSubclasses(value);
        }
        if (name === "departmentId" && campusType === "college") {
            fetchCourses(value);
        }
    };
    const handleSubmit = async () => {
        if (!employee.role) {
            setError("Please select a valid role.");
            return;
        }
    
        // Prepare base payload
        let payload = {
            employeeId: employeeId,
            role: employee.role.toUpperCase(),
            ...(campusType === "school" && {
                classId: employee.classId || null,
                subclassId: employee.subclassId || null,
            }),
            ...(campusType === "college" && {
                departmentId:
                    employee.role.toUpperCase() === "HOD"
                        ? employee.departmentId || null
                        : null,
                courseId: employee.courseId || null,
                semesters:
                    employee.semester && Array.isArray(employee.semester)
                        ? employee.semester
                        : employee.semester
                        ? [employee.semester]
                        : [],
            }),
        };
    
        // Remove departmentId if role is NOT HOD
        if (employee.role.toUpperCase() !== "HOD" && campusType === "college") {
            delete payload.departmentId;
        }
    
        try {
            await axios.post(API_ENDPOINTS.Register_Role(), payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            alert("Role assigned successfully!");
            setFormModalOpen(false);
        } catch (error) {
            console.error("Error assigning role:", error);
            alert("Failed to assign role.");
        }
    };
    

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-opacity-80">
            <div className="bg-gray-800 p-8 rounded-xl w-3/12 text-black">
                <h2 className="text-lg font-bold text-white mb-4">Assign Role and Details</h2>
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="mt-4 p-4 border border-gray-300 rounded-md">
                    <p className="text-white mb-2">Employee Name: {employee.name}</p>
                    <select
                        name="role"
                        value={employee.role}
                        onChange={(e) => handleChange("role", e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
                    >
                        <option value="">Select Role</option>
                        {dropdownValue.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>

                    {campusType === "school" && (
                        <>
                            <select
                                name="classId"
                                value={employee.classId}
                                onChange={(e) => handleChange("classId", e.target.value)}
                                className="mt-2 block w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
                            >
                                <option value="">Select Class</option>
                                {classes.map((cls) => (
                                    <option key={cls.classId} value={cls.classId}>
                                        {cls.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="subclassId"
                                value={employee.subclassId}
                                onChange={(e) => handleChange("subclassId", e.target.value)}
                                className="mt-2 block w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
                            >
                                <option value="">Select Subclass</option>
                                {subclasses.map((sub) => (
                                    <option key={sub.subclassId} value={sub.subclassId}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    {campusType === "college" && (
                        <>
                            <select
                                name="departmentId"
                                value={employee.departmentId}
                                onChange={(e) => handleChange("departmentId", e.target.value)}
                                className="mt-2 block w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.departmentId} value={dept.departmentId}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="courseId"
                                value={employee.courseId}
                                onChange={(e) => handleChange("courseId", e.target.value)}
                                className="mt-2 block w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
                            >
                                <option value="">Select Course</option>
                                {courses.map((course) => (
                                    <option key={course.courseId} value={course.courseId}>
                                        {course.courseName}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="semester"
                                value={employee.semester}
                                onChange={(e) => handleChange("semester", e.target.value)}
                                className="mt-2 block w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
                            >
                                <option value="">Select Semester</option>
                                {semesters.map((sem) => (
                                    <option key={sem.semesterId} value={sem.semesterId}>
                                         {sem.semesterName}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    className="mt-4 bg-green-600 px-4 py-2 rounded-md text-white"
                >
                    Assign Role
                </button>
                <button
                    onClick={() => setFormModalOpen(false)}
                    className="mt-2 bg-gray-600 px-4 py-2 rounded-md text-white ml-2"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddRolePage;
