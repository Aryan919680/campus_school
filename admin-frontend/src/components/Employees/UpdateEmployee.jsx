import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

export default function UpdateEmployee({ setIsEditing, editData,onEmployeeAdded }) {
    const [employeeData, setEmployeeData] = useState({
        name: "",
        additional_details: {},
    });

    // Initialize form with editData
    useEffect(() => {
        if (editData) {
            setEmployeeData({
                name: editData.name || "",
                additional_details: editData.additional_details || {},
            });
        }
    }, [editData]);

    // Handle change for name
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData({ ...employeeData, [name]: value });
    };

    // Handle change for additional details (dynamic object)
    const handleAdditionalDetailChange = (key, value) => {
        setEmployeeData({
            ...employeeData,
            additional_details: {
                ...employeeData.additional_details,
                [key]: value,
            },
        });
    };

    const handleUpdate = async () => {
        const payload = {
            employeeId: editData.employeeId,
            name: employeeData.name,
            additional_details: employeeData.additional_details,
        };

        try {
            await axios.put(`${API_ENDPOINTS.DELETE_EMPLOYEE()}`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            alert("Employee details updated successfully!");
            setIsEditing(false);
            onEmployeeAdded();
        } catch (error) {
            console.error("Error updating employee details:", error.response?.data || error.message);
            alert("Failed to update employee. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h3 className="text-lg font-bold mb-4">Update Employee Details</h3>

                {/* Name Input */}
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={employeeData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                {/* Additional Details Input */}
                <div className="mb-4">
                    <label className="block text-gray-700">Additional Details</label>
                    {Object.entries(employeeData.additional_details).map(([key, value], index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={key.toUpperCase()}
                                disabled
                                className="w-1/3 p-2 border border-gray-300 rounded bg-gray-100"
                            />
                            <input
                                type="text"
                                value={value}
                                onChange={(e) =>
                                    handleAdditionalDetailChange(key, e.target.value)
                                }
                                className="w-2/3 p-2 border border-gray-300 rounded"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-500 text-white py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        className="bg-gray-600 text-white py-2 px-4 rounded"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
