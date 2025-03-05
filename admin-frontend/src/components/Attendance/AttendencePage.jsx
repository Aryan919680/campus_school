import React, { useState, useEffect } from "react";
import Attendance from "./Attendance";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

const AttendancePage = () => {
    const [activeTab, setActiveTab] = useState("attendance");
    const [leaveRequests, setLeaveRequests] = useState([]);

    useEffect(() => {
        if (activeTab === "leave") {
            fetchLeaveRequests();
        }
    }, [activeTab]);

    const fetchLeaveRequests = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.GET_LEAVE_REQUESTS);
            setLeaveRequests(response.data.data);
        } catch (error) {
            console.error("Error fetching leave requests:", error);
        }
    };

    const handleLeaveAction = async (requestId, status) => {
        try {
            await axios.put(API_ENDPOINTS.UPDATE_LEAVE_REQUEST(requestId), { status });
            setLeaveRequests(prevRequests => prevRequests.map(request =>
                request.id === requestId ? { ...request, status } : request
            ));
        } catch (error) {
            console.error("Error updating leave request:", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Employee Portal</h1>
            
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setActiveTab("attendance")}
                    className={`px-4 py-2 rounded ${activeTab === "attendance" ? "bg-linear-blue text-white" : "bg-gray-300"}`}
                >
                    Mark Attendance
                </button>
                <button
                    onClick={() => setActiveTab("leave")}
                    className={`px-4 py-2 rounded ${activeTab === "leave" ? "bg-linear-blue text-white" : "bg-gray-300"}`}
                >
                    Leave Request
                </button>
            </div>
            
            {activeTab === "attendance" ? (
                <Attendance />
            ) : (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Leave Requests</h2>
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Employee Name</th>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Reason</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaveRequests.map(request => (
                                <tr key={request.id} className="border">
                                    <td className="border p-2">{request.employeeName}</td>
                                    <td className="border p-2">{request.date}</td>
                                    <td className="border p-2">{request.reason}</td>
                                    <td className="border p-2">{request.status}</td>
                                    <td className="border p-2">
                                        <button
                                            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                                            onClick={() => handleLeaveAction(request.id, "Approved")}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                            onClick={() => handleLeaveAction(request.id, "Denied")}
                                        >
                                            Deny
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AttendancePage;