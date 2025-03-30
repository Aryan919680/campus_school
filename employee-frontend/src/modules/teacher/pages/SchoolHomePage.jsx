

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
import AttendanceComponentSchool from "../components/HomePage/AttendanceComponentSchool";
import LeaveRequestPage from "../components/LeavePage/LeaveRequestPage";

const SchoolHomePage = ({ handleShowAttendance }) => {
  const [showDefaultPage, setShowDefaultPage] = useState(true);
  const [showAttendancePage, setShowAttendancePage] = useState(false);
  const [showLeavePage, setShowLeavePage] = useState(false);
  const [date, setDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubSection, setSelectedSubSection] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [subSections, setSubSections] = useState([]);

  const teacherData = JSON.parse(localStorage.getItem("teacherData"));
  const campusId = teacherData?.campusId;
  const token = localStorage.getItem("token");

  // ✅ Fetch courses and semesters to populate class and subclass
  useEffect(() => {
    if (!campusId || !token) return;

    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/role/campus/${campusId}/employee`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const course = data?.data?.roles[0]?.subClass?.class || "";
        const semesterName = data?.data?.roles[0]?.subClass?.name || "";
        const subClassId = data?.data?.roles[0]?.subClass?.subClassId || "";

        setClasses([{ classId: course, className: course }]);
        setSubSections([{ subClassId: subClassId, subClassName: semesterName }]);
      })
      .catch((err) => console.error("Error fetching courses and semesters:", err));
  }, [campusId, token]);

  // ✅ Fetch attendance based on date and selected sub-section
  useEffect(() => {
    if (!date || !selectedSubSection || !campusId || !token) return;

    if (teacherData.campusType === "SCHOOL") {
      setLoading(true);
      setError(null);

      fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/attendance/campus/${campusId}/students?date=${date}&subSectionId=${selectedSubSection}`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [date, selectedSubSection, campusId, token]);

  // ✅ Handle Attendance Page
  const handleSchoolAttendance = () => {
    setShowLeavePage(false);
    setShowAttendancePage(true);
    setShowDefaultPage(false);
  };

  // ✅ Handle Leave Page
  const handleSchoolLeavePage = () => {
    setShowLeavePage(true);
    setShowAttendancePage(false);
    setShowDefaultPage(false);
  };

  // ✅ Close the modals
  const onClose = () => {
    setShowDefaultPage(true);
    setShowAttendancePage(false);
  };

  // ✅ Edit Attendance
  const handleEditAttendance = (attendanceId, newStatus) => {
    fetch(
      `${import.meta.env.VITE_BASE_URL}/api/v1/attendance/campus/${campusId}/students`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, attendanceId }),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update attendance");
        return res.json();
      })
      .then(() => {
        setAttendanceData((prevData) =>
          prevData.map((entry) =>
            entry.attendanceId === attendanceId
              ? { ...entry, status: newStatus }
              : entry
          )
        );
      })
      .catch((err) => console.error("Failed to update attendance:", err));
  };

  // ✅ Delete Attendance
  const handleDeleteAttendance = (attendanceId) => {
    fetch(
      `${import.meta.env.VITE_BASE_URL}/api/v1/attendance/campus/${campusId}/students`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          attendanceIds: [attendanceId],
        }),
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete attendance record");
        return response.json();
      })
      .then(() => {
        setAttendanceData((prevData) =>
          prevData.filter((entry) => entry.attendanceId !== attendanceId)
        );
      })
      .catch((err) => console.error("Error deleting attendance:", err));
  };

  return (
    <div className="w-full ml-6 rounded-xl p-4">
      {/* ✅ Top Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Button
          variant="outline"
          className={cn("w-[280px] text-left font-normal")}
          onClick={() => handleSchoolAttendance()}
        >
          Mark Student Attendance
        </Button>
        <Button
          variant="outline"
          className={cn("w-[280px] text-left font-normal")}
          onClick={() => handleSchoolLeavePage()}
        >
          Leave Requests
        </Button>
      </div>

      {/* ✅ Attendance & Leave Components */}
      {showAttendancePage && <AttendanceComponentSchool onClose={() => onClose()} />}
      {showLeavePage && <LeaveRequestPage />}

      {/* ✅ Default Page */}
      {showDefaultPage && (
        <div className="border p-4 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="font-medium">Select Date:</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          
          {
            classes.length > 0 && (
              <>
              <div className="mb-4">
              <label className="font-medium">Select Class:</label>
              <Select
                onValueChange={(value) => {
                  setSelectedClass(value);
                  setSelectedSubSection("");
                }}
                value={selectedClass || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.length > 0 ? (
                    classes.map((cls) => (
                      <SelectItem key={cls.classId} value={cls.classId}>
                        {cls.className}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No classes available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
  
         
            <div className="mb-4">
              <label className="font-medium">Select Sub-Section:</label>
              <Select
                onValueChange={setSelectedSubSection}
                value={selectedSubSection || ""}
                disabled={!selectedClass || subSections.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Sub-Section" />
                </SelectTrigger>
                <SelectContent>
                  {subSections.length > 0 ? (
                    subSections.map((subSec) => (
                      <SelectItem key={subSec.subClassId} value={subSec.subClassId}>
                        {subSec.subClassName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No sub-sections available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            </>
            )
          }
        
        </div> 
      )}

      {/* ✅ Attendance Table */}
      {showDefaultPage && (
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
      )}
    </div>
  );
};

export default SchoolHomePage;
