import React, { useState, useEffect } from "react";
import Attendance from "./Attendance";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import moment from "moment";
import ListTable from "../List/ListTable";
import CommonTable from "../List/CommonTable";
import CollegeAttendance from "./CollegeAttendance";
import CollegeMarkedAttendance from "./CollegeMarkedAttendance";
import SchoolAttendance from "./SchoolAttendance";
import SchoolMarkedAttendance from "./SchoolMarkedAttendance";
const AttendancePage = () => {
    const [activeTab, setActiveTab] = useState("attendance");
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [teachers,setTeachers] = useState([]);

    const userData = JSON.parse(localStorage.getItem("userData"));
    const parsedData = userData;
    const token = parsedData.token;
    const campusType = parsedData.data.campusType;
    useEffect(() => {
        fetchAttendanceRecords();
    }, [selectedDate]);

    useEffect(() => {
        if (activeTab === "leave") {
            fetchTeachers();
        }
    }, [activeTab]);
    
    // Fetch leave requests only after teachers are updated
    useEffect(() => {
        if (activeTab === "leave" && teachers.length > 0) {
            fetchLeaveRequests();
        }
    }, [teachers, activeTab]);

		const fetchTeachers = async () => {
			try {			
				const response = await axios.get(`${API_ENDPOINTS.FETCH_ALL_TEACHERS()}`,{
                    headers: {
                       
                        Authorization: `Bearer ${token}`,
                      },
				});
				setTeachers(response.data.data);
			} catch (error) {
				console.log("Failed to fetch teachers. Please try again.");
			} 
		};


    const fetchAttendanceRecords = async () => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.GET_ATTENDANCE()}?date=${selectedDate.format("YYYY-MM-DD")}`,
        {
            headers: {
                       
                Authorization: `Bearer ${token}`,
              },
            
        });
            setAttendanceRecords(response.data.data);
        } catch (error) {
            console.error("Error fetching attendance records:", error);
        }
    };

    const updateAttendance = async (recordId, status) => {
        try {
            await axios.put(API_ENDPOINTS.MARK_ATTENDANCE(), { 
                attendanceId: recordId,
                status 
            },
            {
                headers: {
                       
                    Authorization: `Bearer ${token}`,
                  },
        }
        );
            setAttendanceRecords(prevRecords => prevRecords.map(record =>
                record.attendanceId === recordId ? { ...record, status } : record
            ));
            alert("Record Updated Succesfully");
        } catch (error) {
            console.error("Error updating attendance record:", error);
        }
    };
    const fetchLeaveRequests = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.GET_LEAVE_REQUESTS(),{
                headers: {
                       
                    Authorization: `Bearer ${token}`,
                  },
            });
            const leaveData = response.data.data;
    
            // Ensure teachers data is available
            console.log(teachers)
            if (teachers.length > 0) {
                const updatedLeaveRequests = leaveData.map(request => {
                    const matchingTeacher = teachers.find(teacher => teacher.employeeId === request.employeeId);
                    return {
                        ...request,
                        employeeName: matchingTeacher ? matchingTeacher.name : "Unknown",
                    };
                });
    
                setLeaveRequests(updatedLeaveRequests);
                console.log(updatedLeaveRequests)
            } else {
                setLeaveRequests(leaveData);
            }
        } catch (error) {
            console.error("Error fetching leave requests:", error);
        }
    };
    
    const handleLeaveAction = async (leaveId, status) => {
        try {
            await axios.put(API_ENDPOINTS.GET_LEAVE_REQUESTS(), { leaveId, status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            // Update the UI
            setLeaveRequests(prevRequests => prevRequests.map(request =>
                request.leaveId === leaveId ? { ...request, status } : request
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
                await axios.delete(API_ENDPOINTS.MARK_ATTENDANCE(), {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { attendanceIds: [recordId] }
                });
             fetchAttendanceRecords();
            } catch (error) {
                console.error("Error deleting attendance record:", error);
            }
        };
      const onClose = () =>{
        setActiveTab('attendance');
        fetchAttendanceRecords();
      }
        console.log(activeTab)
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Attendance Module</h1>
            
            <div className="flex gap-4 mb-4">
            <button
    onClick={() => setActiveTab("attendance")}
    className={`px-4 py-2 rounded ${activeTab === "attendance" ? "bg-linear-blue text-white" : "bg-gray-300"}`}
>
    Marked Employee   Attendance
</button> 
<button
    onClick={() => setActiveTab("mark attendance")}
    className={`px-4 py-2 rounded ${activeTab === "mark attendance" ? "bg-linear-blue text-white" : "bg-gray-300"}`}
>
    Mark Employee Attendance
</button>
{
     campusType.toLowerCase() === 'college' && 
     <>
       <button
    onClick={() => setActiveTab("college attendance")}
    className={`px-4 py-2 rounded ${activeTab === "college attendance" ? "bg-linear-blue text-white" : "bg-gray-300"}`}
>
    Marked College Student Attendance
</button> 
<button
    onClick={() => setActiveTab("mark college attendance")}
    className={`px-4 py-2 rounded ${activeTab === "mark college attendance" ? "bg-linear-blue text-white" : "bg-gray-300"}`}
>
    Mark College Student Attendance
</button>
</>
}
{
     campusType.toLowerCase() === 'school' && 
     <>
       <button
    onClick={() => setActiveTab("school attendance")}
    className={`px-4 py-2 rounded ${activeTab === "school attendance" ? "bg-linear-blue text-white" : "bg-gray-300"}`}
>
    Marked School Student Attendance
</button> 
<button
    onClick={() => setActiveTab("mark school attendance")}
    className={`px-4 py-2 rounded ${activeTab === "mark school attendance" ? "bg-linear-blue text-white" : "bg-gray-300"}`}
>
    Mark School Student Attendance
</button>
</>
}
<button
    onClick={() => setActiveTab("leave")}
    className={`px-4 py-2 rounded ${activeTab === "leave" ? "bg-linear-blue text-white" : "bg-gray-300"}`}
>
    Leave Request
</button>

            </div>
            {activeTab === "mark attendance" && <Attendance />}
             {activeTab === "mark college attendance" && <CollegeAttendance /> }
             {activeTab === "college attendance" && <CollegeMarkedAttendance />}
             {activeTab === "mark school attendance" && <SchoolAttendance /> }
             {activeTab === "school attendance" && <SchoolMarkedAttendance />}
            {activeTab === "attendance" &&(
                <div>
             
                    <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>
                    <input
				type="date"
				value={selectedDate.format("YYYY-MM-DD")}
				onChange={(e) => handleDateChange(e.target.value)}
				className="border p-2 rounded"
			/>
             

            
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
                    className="border rounded"
                >
                    <option value="ABSENT">ABSENT</option>
                    <option value="PRESENT">PRESENT</option>
                    <option value="LATE">LATE</option>
                </select>
            }
            actions={[
                {
                    type: "button",
                    label: "Delete",
                    onClick: () => deleteAttendance(record.attendanceId)
                }
            ]}
        />
    ))}
/>

                </div>
            ) }
            
            {activeTab === "leave" && (
    <div>
        <h2 className="text-xl font-semibold mb-4">Leave Requests</h2>
        <ListTable 
    ListName={"Employee Name"}
    ListRole={"Date Range"}
    ListDepartment={"Reason"}
    ListAction={"Actions"}
    showDataList={leaveRequests.map(request => (
        <CommonTable 
            key={request.leaveId}
            name={request.employeeName}
            role={`${moment(request.from).format("YYYY-MM-DD")} - ${moment(request.to).format("YYYY-MM-DD")}`}
            id={request.reason}
            actions={[
                {
                    type: "dropdown",
                    value: request.status,
                    onChange: (status) => handleLeaveAction(request.leaveId, status),
                    options: [
                        { value: "PENDING", label: "Pending" },
                        { value: "APPROVED", label: "Approve" },
                        { value: "REJECTED", label: "Deny" }
                    ]
                }
            ]}
        />
    ))}
/>

    </div>
)}

        </div>
    );
};

export default AttendancePage;
