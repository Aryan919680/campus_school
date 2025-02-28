import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import AttendanceComponent from "../components/HomePage/AttendanceComponent";

const departments = [
  { id: "dept1", name: "Computer Science" },
  { id: "dept2", name: "Mechanical Engineering" },
];

const courses = [
  { id: "course1", name: "Data Structures", departmentId: "dept1", semesterId: "sem1" },
  { id: "course2", name: "Thermodynamics", departmentId: "dept2", semesterId: "sem2" },
];

const semesters = [
  { id: "sem1", name: "Semester 1", courseId: "course1" },
  { id: "sem2", name: "Semester 2", courseId: "course2" },
];

const HomePage = () => {
  const [showDefaultPage, setShowDefaultPage] = useState(true);
  const [showAttendancePage, setShowAttendancePage] = useState(false);
  const [date, setDate] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const teacherData = JSON.parse(localStorage.getItem("teacherData"));
  const campusId = teacherData?.campusId;
  const token = localStorage.getItem("token");

  // Fetch attendance data when filters change
  useEffect(() => {
    if (!date || !selectedSemester) return;

    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/attendance/campus/${campusId}/students?date=${date}&semesterId=8690f9f1-bdd4-45b9-ab77-705746a193f9`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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
  }, [date, selectedSemester, campusId, token]);

  const handleShowAttendance = () => {
    setShowAttendancePage(true);
    setShowDefaultPage(false);
  };

  const onClose = () => {
    setShowAttendancePage(false);
    setShowDefaultPage(true);
  };

 
  // Handle Edit Attendance
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
  
  // Filter courses based on the selected department
  const filteredCourses = courses.filter((course) => course.departmentId === selectedDepartment);

  // Filter semesters based on the selected course
  const filteredSemesters = semesters.filter((sem) => sem.courseId === selectedCourse);

  return (
    <div className="w-full ml-6 rounded-xl p-4">
      <h1 className="text-3xl font-bold pt-6 mb-6">Attendance Management</h1>

      <div className="flex gap-4 mb-6">
        <Button variant="outline" className={cn("w-[280px] text-left font-normal")} onClick={handleShowAttendance}>
          Mark Student Attendance
        </Button>
        <Button variant="outline" className={cn("w-[280px] text-left font-normal")}>Leave Requests</Button>
      </div>

      {showAttendancePage && <AttendanceComponent onClose={onClose} />}

      {showDefaultPage && (
        <div>
          <div className="border p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Filter Attendance</h2>

            <div className="mb-4">
              <label className="font-medium">Select Date:</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="mb-4">
              <label className="font-medium">Select Department:</label>
              <Select onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <label className="font-medium">Select Course:</label>
              <Select onValueChange={setSelectedCourse} disabled={!selectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <label className="font-medium">Select Semester:</label>
              <Select onValueChange={setSelectedSemester} disabled={!selectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSemesters.map((sem) => (
                    <SelectItem key={sem.id} value={sem.id}>
                      {sem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Attendance Table */}
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
                {attendanceData.length > 0 ? (
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
        </div>
      )}
    </div>
  );
};

export default HomePage;
