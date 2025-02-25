import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

const CreateEmployee = ({ setFormModalOpen }) => {
    const [step, setStep] = useState(1);
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    const [formData, setFormData] = useState({
        name: "",
        contactNumber: "",
        email: "",
        qualification: "",
        role: "",
        customRole: "",
        departmentId: "",
        courseId: "",
        semesterId: "",
        username: "",
        tempPassword: "********",
        credentialsSent: false,
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.GET_DEPARTMENTS,
                {headers: { Authorization: `Bearer ${token}` }}
            );
            setDepartments(response.data.data);
            console
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const fetchCourses = async (departmentId) => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.GET_COURSES_OF_DEPARTMENT}/${departmentId}`,
                {headers: { Authorization: `Bearer ${token}` }}
            );
            setCourses(response.data.data);
            setSemesters([]); 
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "departmentId") {
            fetchCourses(value);
            setFormData((prev) => ({ ...prev, departmentId: value, courseId: "", semesterId: "" }));
        }

        if (name === "courseId") {
            console.log(courses,value)
            const selectedCourse = courses.find((course) => course.courseId === value);
            console.log(selectedCourse)
            if (selectedCourse) {
                setSemesters(selectedCourse.semester || []);
            }
            setFormData((prev) => ({ ...prev, courseId: value, semesterId: "" }));
        }
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);
    const handleSubmit = async () => {
        const payload = {
            employees: [{
                name: formData.name,
               email: formData.email,
                semesterId: formData.semesterId, 
                role: formData.role,// Assuming this is required
                extraDetails: { contactNumber: formData.contactNumber, qualification: formData.qualification }
            }]
        };

        try {
            await axios.post(API_ENDPOINTS.REGISTER_EMPLOYEES, payload, {
              
                headers: { Authorization: `Bearer ${token}` }
            });
           
            onClose();
        } catch (error) {
            console.error("Error registering employee:", error);
            alert("Failed to register employee.");
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-opacity-80">
            <div className="bg-gray-800 p-8 rounded-xl w-3/12 text-black">

            {step === 1 && (
                    <>
                        <h2 className="text-lg font-bold text-white">Step 1: Register Employee</h2>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                        <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                        <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Qualification" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                        <button onClick={nextStep} className="mt-4 bg-green-600 px-4 py-2 rounded-md">Next</button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <h2 className="text-lg font-bold">Step 2: Assign Role</h2>

                        <select name="departmentId" value={formData.departmentId} onChange={handleChange} className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-black">
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.departmentId}>{dept.name}</option>
                            ))}
                        </select>

                        {courses.length > 0 && (
                            <select name="courseId" value={formData.courseId} onChange={handleChange} className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-black">
                                <option value="">Select Course</option>
                                {courses.map((course) => (
                                    <option key={course.courseId} value={course.courseId}>{course.courseName}</option>
                                ))}
                            </select>
                        )}

{semesters.length > 0 && (
                            <select name="semesterId" value={formData.semesterId} onChange={handleChange} className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-black">
                                <option value="">Select Semester</option>
                                {semesters.map((sem) => (
                                    <option key={sem.id} value={sem.semesterId}>{sem.semesterName}</option>
                                ))}
                            </select>
                        )}

<select name="role" value={formData.role} onChange={handleChange} className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-black">
    <option value="">Select Role</option>
    {["Teacher", "Class Teacher", "Incharge/Coordinator", "Vice Principal", "Principal", "Director", "Manager"].map((role) => (
        <option key={role} value={role}>{role}</option>
    ))}
</select>

                        <input type="text" name="customRole" value={formData.customRole} onChange={handleChange} placeholder="Custom Role" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                        
                        <button onClick={() => setStep(1)} className="mt-4 bg-gray-600 px-4 py-2 rounded-md mr-2">Back</button>
                        <button onClick={() => setStep(3)} className="mt-4 bg-green-600 px-4 py-2 rounded-md">Next</button>
                    </>
                )}
                {step === 3 && (
                    <>
                 <div
                 className="text-white">
                        <h2 className="text-lg font-bold">Step 4: Review and Confirm</h2>
                        <p>Employee Name: {formData.name}</p>
                        <p>Role Assigned: {formData.role || formData.customRole}</p>
                        <p>Contact Number: {formData.contactNumber}</p>
                        <p>Email Address: {formData.email}</p>
                      
                        <button onClick={handleSubmit} className="mt-4 bg-green-600 px-4 py-2 rounded-md">Confirm & Save</button>
                        <button onClick={prevStep} className="mt-4 bg-gray-600 px-4 py-2 rounded-md ml-2">Edit</button>
                        <button onClick={setFormModalOpen(false)} className="mt-4 bg-red-600 px-4 py-2 rounded-md ml-2">Cancel</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateEmployee;
