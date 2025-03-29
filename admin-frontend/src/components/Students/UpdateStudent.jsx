import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

export default function UpdateStudent({ setIsEditing, studentData }) {
    const [studentDetails, setStudentDetails] = useState({
        name: "",
        additional_details: {},
    });

    // Initialize form with studentData
    useEffect(() => {
        if (studentData) {
            setStudentDetails({
                name: studentData.name || "",
                additional_details: studentData.additional_details || {},
            });
        }
    }, [studentData]);

    // Handle change for name
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStudentDetails({ ...studentDetails, [name]: value });
    };

    // Handle change for additional details (dynamic object)
    const handleAdditionalDetailChange = (key, value) => {
        setStudentDetails({
            ...studentDetails,
            additional_details: {
                ...studentDetails.additional_details,
                [key]: value,
            },
        });
    };

    const handleUpdate = async () => {
        const payload = {
            studentId: studentData.studentId,
            name: studentDetails.name,
            additional_details: studentDetails.additional_details,
        };

        try {
            await axios.put(`${API_ENDPOINTS.Update_Student()}`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            alert("Student details updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating student details:", error.response?.data || error.message);
            alert("Failed to update student. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h3 className="text-lg font-bold mb-4">Update Student Details</h3>

                {/* Name Input */}
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={studentDetails.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                {/* Additional Details Input */}
                <div className="mb-4">
                    <label className="block text-gray-700">Additional Details</label>
                    {Object.entries(studentDetails.additional_details).map(([key, value], index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={key}
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
