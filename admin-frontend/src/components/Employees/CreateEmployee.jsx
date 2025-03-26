import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

const CreateEmployee = ({ setFormModalOpen, onEmployeeAdded }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;

    const [employees, setEmployees] = useState([]);
    const [step, setStep] = useState(1);
    const [currentEmployee, setCurrentEmployee] = useState({ name: "", contactNumber: "", email: "", qualification: "", role: "", customRole: "", semesterId: "" });
    const [error, setError] = useState("");
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [classes, setClasses] = useState([]);

    const campusType = userData.data.campusType.toLowerCase();
    const dropdownValue = userData.data.campusType.toLowerCase() === 'school' ? ["Teacher", "Class Teacher", "Incharge/Coordinator", "Vice Principal", "Principal", "Director", "Manager"] :
        ["Faculty", "HOD", "Dean", "Director", "Manager"];
    const handleChange = (e) => {
        const { name, value } = e.target;

        setCurrentEmployee((prev) => ({ ...prev, [name]: value }));
 
    };
    useEffect(() => {
        if(campusType === "college"){
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.GET_DEPARTMENTS(), { headers: { Authorization: `Bearer ${token}` } });
                setDepartments(response.data.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

            fetchDepartments();
    
    }
     
    }, [token]);

    useEffect(() => {
        if (selectedDepartment) {
            const fetchCourses = async () => {
                try {
                    const response = await axios.get(`${API_ENDPOINTS.GET_COURSES_OF_DEPARTMENT()}/${selectedDepartment}`, { headers: { Authorization: `Bearer ${token}` } });
                    setCourses(response.data.data);
                } catch (error) {
                    console.error("Error fetching courses:", error);
                }
            };
            fetchCourses();
        }
    }, [selectedDepartment, token]);

    useEffect(() => {
        if (selectedCourse) {
            const selectedCourseData = courses.find(course => course.courseId === selectedCourse);
            setSemesters(selectedCourseData ? selectedCourseData.semester : []);
        }
    }, [selectedCourse, courses]);

    useEffect(() => {
        if (campusType === "school") {
            axios.get(`${API_ENDPOINTS.FETCH_CLASS()}`, { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    setClasses(response.data.data.class); 
                })
                .catch((error) => {
                    console.error("Error fetching classes:", error);
                });
        
        }
    }, [campusType]);

    const addEmployee = () => {
        const { name, contactNumber, email, qualification } = currentEmployee;

        if (!name.trim() || !contactNumber.trim() || !email.trim() || !qualification.trim()) {
            setError("All fields are required before adding an employee.");
            return;
        }

        setEmployees([...employees, currentEmployee]);
        setCurrentEmployee({ name: "", contactNumber: "", email: "", qualification: "", role: "", customRole: "", semesterId: "" });
        setError("");
    };

    const nextStep = () => {
        if (employees.length === 0) {
            setError("Please add at least one employee before proceeding.");
            return;
        }
        setStep((prev) => prev + 1);
        setError("");
    };
    const prevStep = () => setStep((prev) => prev - 1);

    const handleSubmit = async () => {

        const payload = {
            employees: employees.map(({ name, email, semesterId, role, contactNumber, qualification, departmentId,subClassId }) => ({
                name,
                email,
                
                role,
                ...(role === "HOD" ? { departmentId } : {}), // Include departmentId only if role is HOD
                ...(campusType === "school"
                    ? { 
                          subclassId: subClassId,
                      }
                    : {
                          semesterId: semesterId,
                      }),
                extraDetails: { contactNumber, qualification },
            })),
        };
        try {
            await axios.post(API_ENDPOINTS.REGISTER_EMPLOYEES(), payload, { headers: { Authorization: `Bearer ${token}` } });
            alert("Employees Registered Successfully");
            onEmployeeAdded();
            setFormModalOpen(false);
        } catch (error) {
            console.error("Error registering employees:", error);
            alert("Failed to register employees.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-opacity-80">
            <div className="bg-gray-800 p-8 rounded-xl w-3/12 text-black">
                {step === 1 && (
                    <>
                        <h2 className="text-lg font-bold text-white">Step 1: Register Employees</h2>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="mb-4 p-4 border border-gray-300 rounded-md">
                            <input type="text" name="name" value={currentEmployee.name} onChange={handleChange} placeholder="Full Name" className="block w-full p-2 border border-gray-300 rounded-md" />
                            <input type="text" name="contactNumber" value={currentEmployee.contactNumber} onChange={handleChange} placeholder="Contact Number" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                            <input type="email" name="email" value={currentEmployee.email} onChange={handleChange} placeholder="Email Address" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                            <input type="text" name="qualification" value={currentEmployee.qualification} onChange={handleChange} placeholder="Qualification" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <button onClick={addEmployee} className="mt-2 bg-blue-600 px-4 py-2 rounded-md text-white">+ Add Employee</button>
                        <button onClick={nextStep} className="mt-4 bg-green-600 px-4 py-2 rounded-md text-white">Next</button>
                    </>
                )}

      
  {step === 2 && (
                <>
                    <h2 className="text-lg font-bold text-white">
                        Step 2: {campusType === "school" ? "Select Class & Subclass" : "Select Department & Course"}
                    </h2>

                    {employees.map((emp, index) => (
                        <div key={index} className="mt-4 p-4 border border-gray-300 rounded-md">
                            <p className="font-semibold text-white">{emp.name}</p>

                            {campusType === "school" ? (
                                // 🔹 School Campus: Show Class & Subclass Dropdowns
                                <>
                                    {/* Class Dropdown */}
                                    <select
                                        onChange={(e) => {
                                            const classId = e.target.value;
                                            const selectedClass = classes.find((cls) => cls.classId === classId);
                                            setEmployees((prev) =>
                                                prev.map((employee, i) =>
                                                    i === index
                                                        ? {
                                                              ...employee,
                                                              classId,
                                                              subClassId: "",
                                                              subclasses: selectedClass ? selectedClass.subClass : [],
                                                          }
                                                        : employee
                                                )
                                            );
                                        }}
                                        value={emp.classId || ""}
                                        className="block w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map((cls) => (
                                            <option key={cls.classId} value={cls.classId}>
                                                {cls.className}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Subclass Dropdown */}
                                    <select
                                        onChange={(e) => {
                                            const subClassId = e.target.value;
                                            setEmployees((prev) =>
                                                prev.map((employee, i) => (i === index ? { ...employee, subClassId } : employee))
                                            );
                                        }}
                                        value={emp.subClassId || ""}
                                        disabled={!emp.classId}
                                        className="mt-2 block w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
                                    >
                                        <option value="">Select Subclass</option>
                                        {emp.subclasses?.map((sub) => (
                                            <option key={sub.subClassId} value={sub.subClassId}>
                                                {sub.subClassName}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            ) : (
                                <div key={index} className="mt-4 p-4 border border-gray-300 rounded-md">
                               
                             
                                <select
                                    onChange={(e) => {
                                        const departmentId = e.target.value;
                                        setEmployees((prev) =>
                                            prev.map((employee, i) =>
                                                i === index ? { ...employee, departmentId, courseId: "", semesterId: "" } : employee
                                            )
                                        );
                                        setSelectedDepartment(departmentId);
                                    }}
                                    value={emp.departmentId || ""}
                                    className="block w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
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
                                        const courseId = e.target.value;
                                        setEmployees((prev) =>
                                            prev.map((employee, i) =>
                                                i === index ? { ...employee, courseId, semesterId: "" } : employee
                                            )
                                        );
                                        setSelectedCourse(courseId)
                                    }}
                                   
                                    value={emp.courseId || ""}
                                    disabled={!emp.departmentId}
                                    className="mt-2 block w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
                                >
                                    <option value="">Select Course</option>
                                    {courses
                                        .filter((course) => course.departmentId === emp.departmentId) 
                                        .map((course) => (
                                            <option key={course.courseId} value={course.courseId}>
                                                {course.courseName}
                                            </option>
                                        ))}
                                </select>

  
                                <select
                                    onChange={(e) => {
                                        const semesterId = e.target.value;
                                        setEmployees((prev) =>
                                            prev.map((employee, i) => (i === index ? { ...employee, semesterId } : employee))
                                        );
                                    }}
                                    value={emp.semesterId || ""}
                                    disabled={!emp.courseId}
                                    className="mt-2 block w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
                                >
                                    <option value="">Select Semester</option>
                                    {semesters.map((sem) => (
                                        <option key={sem.semesterId} value={sem.semesterId}>
                                            {sem.semesterName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            )
                        }
</div>
                        ))}

<button onClick={prevStep} className="mt-4 bg-gray-600 px-4 py-2 rounded-md text-white mr-2">Back</button>
                    <button onClick={() => setStep(3)} className="mt-4 bg-green-600 px-4 py-2 rounded-md text-white">
                        Next
                    </button>
                </>
            )}


                {step === 3 && (
                    <>
                        <h2 className="text-lg font-bold text-white">Step 3: Assign Roles</h2>
                        {employees.map((emp, index) => (
                            emp.name && (
                                <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md">
                                    <p className="text-white">{emp.name}</p>
                                    <select
                                        name="role"
                                        value={emp.role}
                                        onChange={(e) => {
                                            const roleValue = e.target.value;
                                            setEmployees((prevEmployees) =>
                                                prevEmployees.map((employee, idx) =>
                                                    idx === index
                                                        ? {
                                                            ...employee,
                                                            role: roleValue,
                                                            departmentId: roleValue === "HOD" ? selectedDepartment : undefined, // Add departmentId only for HOD
                                                        }
                                                        : employee
                                                )
                                            );
                                        }}
                                        className="block w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Select Role</option>
                                        {dropdownValue.map((role) => (
                                            <option key={role} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>

                                    <input type="text" name="customRole" value={emp.customRole} onChange={(e) => {
                                        const updatedEmployees = [...employees];
                                        updatedEmployees[index].customRole = e.target.value;
                                        setEmployees(updatedEmployees);
                                    }} placeholder="Custom Role" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                            )
                        ))}
                        <button onClick={prevStep} className="mt-4 bg-gray-600 px-4 py-2 rounded-md text-white mr-2">Back</button>
                        <button onClick={nextStep} className="mt-4 bg-green-600 px-4 py-2 rounded-md text-white">Next</button>
                    </>
                )}
                {step === 4 && (
                    <>
                        <h2 className="text-lg font-bold text-white">Step 3: Review and Confirm</h2>
                        {employees.map((emp, index) => (
                            <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md text-white">
                                <p>Employee Name: {emp.name}</p>
                                <p>Role Assigned: {emp.role || emp.customRole}</p>
                                <p>Contact Number: {emp.contactNumber}</p>
                                <p>Email Address: {emp.email}</p>
                            </div>
                        ))}
                        <button onClick={handleSubmit} className="mt-4 bg-green-600 px-4 py-2 rounded-md text-white">Confirm & Save</button>
                        <button onClick={prevStep} className="mt-4 bg-gray-600 px-4 py-2 rounded-md text-white ml-2">Edit</button>
                        <button onClick={() => setFormModalOpen(false)} className="mt-4 bg-red-600 px-4 py-2 rounded-md text-white ml-2">Cancel</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateEmployee;
