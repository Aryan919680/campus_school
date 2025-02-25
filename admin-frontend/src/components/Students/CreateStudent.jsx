import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import * as XLSX from "xlsx";

const CreateStudent = ({ onClose, onStudentAdded }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    
    const [students, setStudents] = useState([]);
    const [step, setStep] = useState(1);
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [bulkUpload, setBulkUpload] = useState(false);
    const [file, setFile] = useState(null);
    const [currentStudent, setCurrentStudent] = useState({
        fullName: "", dob: "", aadhaarId: "", contactNumber: "", email: "",
        parentName: "", parentContact: "", address: "", departmentId: "",
        courseId: "", semesterId: "", admissionNumber: "", rollNumber: ""
    });
        const [error, setError] = useState("");
    const [payloadData,setPayloadData] = useState([]);
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.GET_DEPARTMENTS, { headers: { Authorization: `Bearer ${token}` } });
                setDepartments(response.data.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };
        fetchDepartments();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentStudent(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        if (file) {
            handleFileUpload();
        }
    }, [file]);
    const handleFileUpload = async () => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);
            
            if (departments.length === 0) {
                console.warn("Departments not loaded yet.");
                return;
            }

            const payload = await changePayload(data);
            setPayloadData(payload.students);
        };
        reader.readAsBinaryString(file);
    };

    async function changePayload(studentData) {
        try {
            const updatedStudents = await Promise.all(
                studentData.map(async (student) => {
                    const department = departments.find(dept => dept.name.toLowerCase() === student.Department.toLowerCase());
                    if (!department) {
                        console.warn(`Department ${student.Department} not found for ${student["Full Name"]}`);
                        return null;
                    }

                    const coursesResponse = await axios.get(
                        `${API_ENDPOINTS.GET_COURSES_OF_DEPARTMENT}/${department.departmentId}`, 
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const coursesData = coursesResponse.data.data;

                    const course = coursesData.find(c => c.courseName.toLowerCase() === student.Course.toLowerCase());
                    if (!course) {
                        console.warn(`Course ${student.Course} not found for ${student["Full Name"]}`);
                        return null;
                    }

                    const semesterMap = course.semester.reduce((acc, sem) => {
                        const semNumber = parseInt(sem.semesterName.replace(/\D/g, ""), 10);
                        acc[semNumber] = sem.semesterId;
                        return acc;
                    }, {});

                    const semesterId = semesterMap[student.Sem];
                    if (!semesterId) {
                        console.warn(`Semester ${student.Sem} not found for ${student["Full Name"]}`);
                        return null;
                    }

                    return {
                        name: student["Full Name"],
                        gender: student.Gender || "UNKNOWN",
                        email: student["Email Address"],
                        semesterId: semesterId,
                        extraDetails: {
                            contactNumber: student["Contact Number"],
                            parentName: student["Parent/Guardian Name"],
                            parentContact: student["Parent Contact"],
                            address: student.Address,
                            admissionNumber: student["Admission Number"],
                            rollNumber: student["Roll Number"]
                        }
                    };
                })
            );

            return { students: updatedStudents.filter(student => student !== null) };
        } catch (error) {
            console.error("Error enriching student data:", error);
            return { students: [] };
        }
    }

    const handleBulkUpload = async () => {
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }

        if (payloadData.length === 0) {
            alert("No valid student data found in the file.");
            return;
        }

        try {
            await axios.post(API_ENDPOINTS.REGISTER_STUDENTS, { students: payloadData }, { headers: { Authorization: `Bearer ${token}` } });
            alert("File uploaded successfully!");
            onClose();
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file.");
        }
    };
    const handleDepartmentChange = async (e) => {
        const departmentId = e.target.value;
        setCurrentStudent(prev => ({ ...prev, departmentId, courseId: "", semesterId: "" }));

        if (!departmentId) return;

        try {
            const response = await axios.get(`${API_ENDPOINTS.GET_COURSES_OF_DEPARTMENT}/${departmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCourses(response.data.data);
            setSemesters([]); // Reset semesters when department changes
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    // Fetch Semesters when Course is Selected
    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setCurrentStudent(prev => ({ ...prev, courseId, semesterId: "" }));

        if (!courseId) return;

        const selectedCourse = courses.find(c => c.courseId === courseId);
        if (selectedCourse) {
            setSemesters(selectedCourse.semester);
        }
    };

    const handleAddStudent = () => {
        if (!currentStudent.fullName || !currentStudent.courseId || !currentStudent.semesterId) {
            alert("Please fill all required fields.");
            return;
        }
        setStudents(prev => [...prev, { ...currentStudent }]);
        setCurrentStudent({
            fullName: "", dob: "", aadhaarId: "", contactNumber: "", email: "",
            parentName: "", parentContact: "", address: "", departmentId: "",
            courseId: "", semesterId: "", admissionNumber: "", rollNumber: ""
        });
        setStep(3);
    };

    const handleEditStudent = (index) => {
        setCurrentStudent(students[index]);
        setStudents(students.filter((_, i) => i !== index));
        setStep(1);
    };

    const handleRemoveStudent = (index) => {
        setStudents(students.filter((_, i) => i !== index));
    };

    const handleConfirm = async () => {
        if (students.length === 0) {
            alert("No students to save.");
            return;
        }
    
        const formattedStudents = students.map(student => ({
            name: student.fullName,
            gender: student.gender || "UNKNOWN",
            email: student.email,
            semesterId: student.semesterId,
            extraDetails: {
                contactNumber: student.contactNumber,
                parentName: student.parentName,
                parentContact: student.parentContact,
                address: student.address,
                admissionNumber: student.admissionNumber,
                rollNumber: student.rollNumber
            }
        }));
    
        try {
            await axios.post(API_ENDPOINTS.REGISTER_STUDENTS, { students: formattedStudents }, { headers: { Authorization: `Bearer ${token}` } });
           // alert("File uploaded successfully!");
            onClose();// Close the modal on success
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file.");
        }
    };
    
    
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 border border-gray-100">
                        <div className="bg-gray-800 p-8 rounded-xl w-3/12 text-black">
                {step === 1 && (
                    <>
                        <h2 className="text-lg font-bold text-white">Step 1: Register Student</h2>
                        <div className="mb-4">
                            <label className="text-white mr-2">Single Entry</label>
                            <input type="checkbox" checked={!bulkUpload} onChange={() => setBulkUpload(false)} className="mr-4" />
                            <label className="text-white mr-2">Bulk Upload</label>
                            <input type="checkbox" checked={bulkUpload} onChange={() => setBulkUpload(true)} />
                        </div>
                        {bulkUpload ? (
                            <>
                                <input type="file" onChange={handleFileChange} className="block w-full p-2 border border-gray-300 rounded-md text-white" />
                                <button onClick={handleBulkUpload} className="mt-2 bg-blue-600 px-4 py-2 rounded-md text-white">Upload & Validate</button>
                            </>
                        ) : (
                            <>
                                <input type="text" name="fullName" value={currentStudent.fullName} onChange={handleChange} placeholder="Full Name" className="block w-full p-2 border border-gray-300 rounded-md" />
                                <input type="date" name="dob" value={currentStudent.dob} onChange={handleChange} className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                                <input type="text" name="aadhaarId" value={currentStudent.aadhaarId} onChange={handleChange} placeholder="Aadhaar ID" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                                <input type="text" name="contactNumber" value={currentStudent.contactNumber} onChange={handleChange} placeholder="Contact Number" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                                <input type="text" name="parentName" value={currentStudent.parentName} onChange={handleChange} placeholder="Parent/Guardian Name" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                                <input type="text" name="parentContact" value={currentStudent.parentContact} onChange={handleChange} placeholder="Parent Contact" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                                <input type="email" name="email" value={currentStudent.email} onChange={handleChange} placeholder="Email Address" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                                <input type="text" name="address" value={currentStudent.address} onChange={handleChange} placeholder="Address" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                                <div className="flex justify-between mt-4">
                                <button onClick={()=>onClose()} className="mt-4 bg-green-600 px-4 py-2 rounded-md text-white">Close</button>
                                <button onClick={() => setStep(2)} className="mt-4 bg-green-600 px-4 py-2 rounded-md text-white">Next</button>
                                </div>
                            </>
                        )}
                    </>
                )}
                   {step === 2 && (
                    <>
                        <h2 className="text-lg font-bold text-white">Step 2: Assign Department, Course, and Semester</h2>
                        <select name="departmentId" value={currentStudent.departmentId} onChange={handleDepartmentChange} className="block w-full p-2 border border-gray-300 rounded-md">
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept.departmentId} value={dept.departmentId}>{dept.name}</option>
                            ))}
                        </select>

                        <select name="courseId" value={currentStudent.courseId} onChange={handleCourseChange} className="mt-2 block w-full p-2 border border-gray-300 rounded-md">
                            <option value="">Select Course</option>
                            {courses.map(course => (
                                <option key={course.courseId} value={course.courseId}>{course.courseName}</option>
                            ))}
                        </select>

                        <select name="semesterId" value={currentStudent.semesterId} onChange={handleChange} className="mt-2 block w-full p-2 border border-gray-300 rounded-md">
                            <option value="">Select Semester</option>
                            {semesters.map(sem => (
                                <option key={sem.semesterId} value={sem.semesterId}>{sem.semesterName}</option>
                            ))}
                        </select>

                        <input type="text" name="admissionNumber" value={currentStudent.admissionNumber} onChange={handleChange} placeholder="Admission Number" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                        <input type="text" name="rollNumber" value={currentStudent.rollNumber} onChange={handleChange} placeholder="Roll Number" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                        
                        <div className="flex justify-between mt-4">
                            <button onClick={() => setStep(1)} className="bg-gray-600 px-4 py-2 rounded-md text-white">Prev</button>
                            <button onClick={() => handleAddStudent()} className="bg-green-600 px-4 py-2 rounded-md text-white">Next</button>
                        </div>
                    </>
                )}
             {step === 3 && (
                    <>
                        <h2 className="text-lg font-bold text-white">Step 3: Review and Confirm</h2>
                        {students.map((student, index) => {
                            const course = courses.find(c => c.courseId === student.courseId);
                            const courseName = course ? course.courseName : "Unknown Course";
                            const semester = semesters.find(s => s.semesterId === student.semesterId);
            const semesterName = semester ? semester.semesterName : "Unknown Semester";
                            return (
                                <div key={index} className="flex justify-between bg-gray-700 p-2 rounded-md mt-2 text-white">
                                    <span>{student.fullName} - {courseName} - {semesterName}</span>
                                    <div>
                                        <button onClick={() => handleEditStudent(index)} className="text-blue-400 mr-2">[Edit]</button>
                                        <button onClick={() => handleRemoveStudent(index)} className="text-red-400">[❌]</button>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="flex justify-between mt-4">
                            <button onClick={() => setStep(2)} className="bg-gray-600 px-4 py-2 rounded-md text-white">Edit</button>
                            <button onClick={handleConfirm} className="bg-green-600 px-4 py-2 rounded-md text-white">Confirm & Save</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateStudent;
