


import { useEffect, useState } from "react";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import AttendanceComponent from "../components/HomePage/AttendanceComponent";
import LeaveRequestPage from "../components/LeavePage/LeaveRequestPage";
import SchoolHomePage from "./SchoolHomePage";
const HomePage = () => {
  const [date, setDate] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDefaultPage, setShowDefaultPage] = useState(true);
  const [showAttendancePage, setShowAttendancePage] = useState(false);
  const [showLeavePage,setShowLeavePage] = useState(false);
  const teacherData = JSON.parse(localStorage.getItem("teacherData"));

  const campusId = teacherData?.campusId;
  const token = localStorage.getItem("token");

  // Fetch courses and semesters from API
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/role/campus/${campusId}/employee`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const course = data?.data?.roles[0]?.semster?.course || "";
        const semesterName = data?.data?.roles[0]?.semster?.name || "";
        const semesterId =  data?.data?.roles[0]?.semster?.semesterId || "";
        setCourses([{ courseId: course, courseName: course }]);
        setSemesters([{ semesterId: semesterId, semesterName }]);
        console.log(courses,semesters)
      })
      .catch((err) => console.error("Error fetching courses and semesters:", err));
  }, [campusId, token]);

  // Fetch attendance based on selected date and semester
  useEffect(() => {
    if (!date || !selectedSemester) return;
    if (teacherData.campusType === "COLLEGE") {
      setLoading(true);
      setError(null);

      fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/attendance/campus/${campusId}/students?date=${date}&semesterId=${selectedSemester}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch attendance data");
          return response.json();
        })
        .then((data) => {
          setAttendanceData(data.data || []);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [date, selectedSemester, campusId, token]);

    const handleShowAttendance = () => {
    setShowAttendancePage(true);
    setShowDefaultPage(false);
    setShowLeavePage(false);
  };

    const handleShowLeavePage = () =>{
     setShowLeavePage(true);
     setShowAttendancePage(false);
     setShowDefaultPage(false);
  }

    const onClose = () => {
    setShowAttendancePage(false);
    setShowDefaultPage(true);
  };

  // Function to handle semester change
const handleSemesterChange = (semesterId) => {
  console.log("Selected Semester ID:", semesterId);
  setSelectedSemester(semesterId);
};

  const handleEditAttendance = (attendanceId, newStatus) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/attendance/campus/${campusId}/students`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus, attendanceId: attendanceId }),
    })
      .then((res) => res.json())
      .then((updatedAttendance) => {
        setAttendanceData((prevData) =>
          prevData.map((entry) =>
            entry.attendanceId === attendanceId ? { ...entry, status: newStatus } : entry
          )
        );
      })
      .catch((err) => console.error("Failed to update attendance:", err));
  };

  const handleDeleteAttendance = (attendanceId) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/attendance/campus/${campusId}/students`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        attendanceIds: [attendanceId], // Send as an array
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete attendance record");
        return response.json();
      })
      .then(() => {
        // Remove deleted entry from UI
        setAttendanceData((prevData) =>
          prevData.filter((entry) => entry.attendanceId !== attendanceId)
        );
      })
      .catch((err) => console.error("Error deleting attendance:", err));
  };
  return (
    <div className="w-full ml-6 rounded-xl p-4">
      <h1 className="text-3xl font-bold pt-6 mb-6">Attendance Management</h1>
      {
      teacherData.campusType === "COLLEGE" &&  <div className="flex gap-4 mb-6">
        <Button variant="outline" className={cn("w-[280px] text-left font-normal")} onClick={handleShowAttendance}>
          Mark Student Attendance
        </Button>
        <Button variant="outline" className={cn("w-[280px] text-left font-normal")} onClick={handleShowLeavePage}>Leave Requests</Button>
      </div>
    }

      {showAttendancePage && <AttendanceComponent onClose={onClose} />}
       {showLeavePage && <LeaveRequestPage />}

       
    {showDefaultPage && (
      <div>
      <div className="border p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Filter Attendance</h2>
         {
             teacherData.campusType === "COLLEGE" && <div> 
      
        <div className="mb-4">
          <label className="font-medium">Select Date:</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

   
        <div className="mb-4">
          <label className="font-medium">Select Course:</label>
          <Select onValueChange={setSelectedCourse} value={selectedCourse || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              {courses.length > 0 && courses.map((course) => (
                <SelectItem key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <label className="font-medium">Select Semester:</label>
          <Select value={selectedSemester} onValueChange={(value) => handleSemesterChange(value)} disabled={!selectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.length > 0 && semesters.map((sem) => (
                <SelectItem key={sem.semesterId} value={sem.semesterId}>
                  {sem.semesterName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        </div>
         }
         {
              teacherData.campusType === "SCHOOL" && <SchoolHomePage handleShowAttendance={handleShowAttendance}/>
            }
        </div>
         

         {
        showDefaultPage && teacherData.campusType == "COLLEGE" && 
        <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Student Attendance</h2>
        {loading ? (
          <p>Loading attendance...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="border p-4 rounded-lg shadow">
         <table className="w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Student Name</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            { attendanceData.length > 0 ? (
              attendanceData.map((entry) => (
                <tr key={entry.attendanceId} className="border border-gray-300">
                  <td className="border border-gray-300 p-2">{entry.student?.name || "N/A"}</td>
                  <td className="border border-gray-300 p-2">
                    <Select onValueChange={(newStatus) => handleEditAttendance(entry.attendanceId, newStatus)}>
                      <SelectTrigger>
                        <SelectValue placeholder={entry.status} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRESENT">PRESENT</SelectItem>
                        <SelectItem value="ABSENT">ABSENT</SelectItem>
                        <SelectItem value="LATE">LATE</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteAttendance(entry.attendanceId)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-2">No attendance records found.</td>
              </tr>
            )}
          </tbody>
        </table>
          </div>
        )}
      </div>
      }
     </div>

 ) }  
 </div>
  );
  
};

export default HomePage;
