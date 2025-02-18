import React, { useEffect, useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

const DepartmentForm = ({ onClose, refreshDepartments,showCoursePage }) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        fetchDepartments();
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const [departments, setDepartments] = useState([]);
    const [departmentInput, setDepartmentInput] = useState("");
    const [codeInput, setCodeInput] = useState("");
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.GET_DEPARTMENTS, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDepartments(response.data.data);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const handleDepartmentChange = (event) => {
        setDepartmentInput(event.target.value);
    };

    const handleCodeChange = (event) => {
        setCodeInput(event.target.value);
    };

    const addDepartment = async () => {
        if (!departmentInput.trim() || !codeInput.trim()) return alert("Please enter both department name and code.");
        if (departments.some(dept => dept.name === departmentInput.trim())) return alert("Department already exists.");

        const newDepartment = { name: departmentInput.trim(), code: codeInput.trim() };

        try {
            await axios.post(API_ENDPOINTS.CREATE_DEPARTMENT, { departments: [newDepartment] }, {
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            alert("Department added successfully!");
            refreshDepartments();
            fetchDepartments();
            setDepartmentInput("");
            setCodeInput("");
        } catch (error) {
            console.error("Error adding department:", error);
            alert("Failed to add department. Please try again.");
        }
    };

    const deleteDepartment = async (departmentId) => {
        console.log(departmentId)
        try {
            await axios.delete(API_ENDPOINTS.DELETE_DEPARTMENT, {
                headers: { Authorization: `Bearer ${token}` },
                data: { departmentIds: [departmentId] }
            });
         //   alert("Department deleted successfully!");
            // refreshDepartments();
            // fetchDepartments();
        } catch (error) {
            console.error("Error deleting department:", error);
            alert("Failed to delete department. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 border border-gray-100">
            <div className="bg-gray-800 p-8 rounded-xl w-3/12">
                <form className="text-black">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Add Department Tag:</label>
                        <input
                            type="text"
                            value={departmentInput}
                            onChange={handleDepartmentChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                            placeholder="Enter department name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Department Code:</label>
                        <input
                            type="text"
                            value={codeInput}
                            onChange={handleCodeChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                            placeholder="Enter department code"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={addDepartment}
                        className="w-full px-4 py-2 mb-4 text-white bg-blue-600 rounded-lg hover:bg-blue-500"
                    >
                        Add Department
                    </button>
                    {departments.length > 0 && (
                        <div className="mb-4 p-3 bg-gray-700 rounded-md text-white">
                            <label className="block text-sm font-medium">Existing Departments:</label>
                            <div className="mt-2 space-y-2">
                                {departments.map(({ departmentId, name, code }) => (
                                    <div key={departmentId} className="p-2 bg-gray-600 rounded-md flex justify-between items-center">
                                        <span>{name} ({code})</span>
                                        <button
                                            className="px-2 py-1 text-white bg-red-500 rounded-md hover:bg-red-400"
                                            onClick={() => deleteDepartment(departmentId)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end items-center mt-4 gap-4">
                        <button
                            className="px-4 py-2 w-1/2 text-white bg-red-600 rounded-lg hover:bg-red-500"
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 w-1/2 text-white bg-green-600 rounded-lg"
                            type="button"
                            onClick={showCoursePage}
                        >
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default React.memo(DepartmentForm);
