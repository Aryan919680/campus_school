import React, { useState, useEffect } from "react";
import Attendance from "./Attendance";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import moment from "moment";
import ListTable from "../List/ListTable";
import CommonTable from "../List/CommonTable";
const AttendancePage = () => {
    const [activeTab, setActiveTab] = useState("attendance");
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment());

    const userData = JSON.parse(localStorage.getItem("userData"));
    const parsedData = userData;
    const token = parsedData.token;
    useEffect(() => {
        fetchAttendanceRecords();
    }, [selectedDate]);

    useEffect(() => {
        if (activeTab === "leave") {
            fetchLeaveRequests();
        }
    }, [activeTab]);

    const fetchAttendanceRecords = async () => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.GET_ATTENDANCE}?date=${selectedDate.format("YYYY-MM-DD")}`,
        {
            
                Authorization: `Bearer ${token}`,
            
        });
            setAttendanceRecords(response.data.data);
        } catch (error) {
            console.error("Error fetching attendance records:", error);
        }
    };

    const updateAttendance = async (recordId, status) => {
        try {
            await axios.put(API_ENDPOINTS.MARK_ATTENDANCE, { 
                attendanceId: recordId,
                status 
            },
            {
                Authorization: `Bearer ${token}`,
        }
        );
            setAttendanceRecords(prevRecords => prevRecords.map(record =>
                record.attendanceId === recordId ? { ...record, status } : record
            ));
        } catch (error) {
            console.error("Error updating attendance record:", error);
        }
    };
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

        const handleDateChange = (date) => {
            setSelectedDate(moment(date));
        };
        function extractDate(timestamp) {
            return timestamp.split("T")[0];
        }
        
        const deleteAttendance = async (recordId) => {
            try {
                await axios.delete(API_ENDPOINTS.DELETE_ATTENDANCE(recordId));
                setAttendanceRecords(prevRecords => prevRecords.filter(record => record.id !== recordId));
            } catch (error) {
                console.error("Error deleting attendance record:", error);
            }
        };
    
        
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Employee Portal</h1>
            
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setActiveTab("mark attendance")}
                    className={`px-4 py-2 rounded ${activeTab === "mark attendance" ? "bg-linear-blue text-white" : "bg-gray-300"}`}
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
            {activeTab === "mark attendance" && <Attendance onClose={() => setActiveTab('attendance')}/>}
            {activeTab === "attendance" &&(
                <div>
                    	<input
				type="date"
				value={selectedDate.format("YYYY-MM-DD")}
				onChange={(e) => handleDateChange(e.target.value)}
				className="border p-2 rounded"
			/>
                    <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>
                    {/* <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Employee Name</th>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceRecords.map(record => (
                                <tr key={record.attendanceId} className="border ">
                                    <td className="border p-2">{record.employee.name}</td>
                                    <td className="border p-2">{extractDate(record.created_at)}</td>
                                    <td className="border p-3">
                                        <select
                                            value={record.status}
                                            onChange={(e) => updateAttendance(record.attendanceId, e.target.value)}
                                            className="border rounded"
                                        >
                                            <option value="ABSENT">ABSENT</option>
                                            <option value="PRESENT">PRESENT</option>
                                            <option value="LATE">LATE</option>
                                        </select>
                                    </td>
                                    <td className="border p-2">
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                            onClick={() => deleteAttendance(record.attendanceId)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table> */}
                    <ListTable
                        ListName={"Employee Name"}
                        ListRole={"Date"}
                        ListDepartment={"Status"}
                        ListAction={"Actions"}
                        showDataList={attendanceRecords.map(record => (
                            <CommonTable
                                key={record.attendanceId}
                                name={record.employee.name}
                                role={moment(record.created_at).format("YYYY-MM-DD")}
                                id={
                                    <select
                                        value={record.status}
                                        onChange={(e) => updateAttendance(record.attendanceId, e.target.value)}
                                        className="border  rounded"
                                    >
                                        <option value="ABSENT">ABSENT</option>
                                        <option value="PRESENT">PRESENT</option>
                                        <option value="LATE">LATE</option>
                                    </select>
                                }
                                dangerAction={"Delete"}
                                onDelete={() => deleteAttendance(record.attendanceId)}
                            />
                        ))}
                        />
                </div>
            ) }
            
            {activeTab === "leave" && (
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
