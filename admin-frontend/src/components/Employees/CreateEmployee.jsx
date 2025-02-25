import React, { useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

const CreateEmployee = ({ setFormModalOpen, onEmployeeAdded }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    
    const [employees, setEmployees] = useState([]);
    const [step, setStep] = useState(1);
    const [currentEmployee, setCurrentEmployee] = useState({ name: "", contactNumber: "", email: "", qualification: "", role: "", customRole: "", semesterId: "" });
    const [error, setError] = useState("");
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentEmployee((prev) => ({ ...prev, [name]: value }));
    };
    
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
        const payload = { employees: employees.map(({ name, email, semesterId, role, contactNumber, qualification }) => ({
            name,
            email,
            semesterId,
            role,
            extraDetails: { contactNumber, qualification }
        }))};

        try {
            await axios.post(API_ENDPOINTS.REGISTER_EMPLOYEES, payload, { headers: { Authorization: `Bearer ${token}` } });
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
                        <h2 className="text-lg font-bold text-white">Step 2: Assign Roles</h2>
                        {employees.map((emp, index) => (
                            emp.name && (
                                <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md">
                                    <p className="text-white">{emp.name}</p>
                                    <select name="role" value={emp.role} onChange={(e) => {
                                        const updatedEmployees = [...employees];
                                        updatedEmployees[index].role = e.target.value;
                                        setEmployees(updatedEmployees);
                                    }} className="block w-full p-2 border border-gray-300 rounded-md">
                                        <option value="">Select Role</option>
                                        {["Teacher", "Class Teacher", "Incharge/Coordinator", "Vice Principal", "Principal", "Director", "Manager"].map((role) => (
                                            <option key={role} value={role}>{role}</option>
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
                {step === 3 && (
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
