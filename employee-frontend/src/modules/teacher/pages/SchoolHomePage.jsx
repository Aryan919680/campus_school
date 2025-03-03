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
import LeaveRequestPage from "../components/LeavePage/LeaveRequestPage";

const SchoolHomePage = () => {
  const [showDefaultPage, setShowDefaultPage] = useState(true);
  const [showAttendancePage, setShowAttendancePage] = useState(false);
  const [date, setDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubSection, setSelectedSubSection] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLeavePage, setShowLeavePage] = useState(false);
  const [classes, setClasses] = useState([]);
  const [subSections, setSubSections] = useState([]);
  const teacherData = JSON.parse(localStorage.getItem("teacherData"));
  const campusId = teacherData?.campusId;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!date || !selectedSubSection) return;
    if (teacherData.campusType === "SCHOOL") {
      setLoading(true);
      setError(null);
      fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/attendance/campus/${campusId}/students?date=${date}&subSectionId=${selectedSubSection}`, {
        headers: { Authorization: `Bearer ${token}` },
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
    }
  }, [date, selectedSubSection, campusId, token]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/class/campus/${campusId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setClasses(data.data.class || []))
      .catch((err) => console.error("Error fetching classes:", err));
  }, [campusId, token]);

  useEffect(() => {
    if (!selectedClass) return;
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/class/campus/${campusId}/class/${selectedClass}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setClasses(data.data.class || []);
        setSubSections(data.data.class.subClass || []); // Getting sub-sections from the default API
      })
      .catch((err) => console.error("Error fetching sub-sections:", err));
  }, [selectedClass, campusId, token]);

  return (
    <div className="w-full ml-6 rounded-xl p-4">
      <h1 className="text-3xl font-bold pt-6 mb-6">School Attendance Management</h1>
      <div className="flex gap-4 mb-6">
        <Button variant="outline" className={cn("w-[280px] text-left font-normal")} onClick={() => setShowAttendancePage(true)}>Mark Student Attendance</Button>
        <Button variant="outline" className={cn("w-[280px] text-left font-normal")} onClick={() => setShowLeavePage(true)}>Leave Requests</Button>
      </div>
      {showAttendancePage && <AttendanceComponent onClose={() => setShowAttendancePage(false)} />}
      {showLeavePage && <LeaveRequestPage />}
      {showDefaultPage && (
        <div className="border p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Filter Attendance</h2>
          <div className="mb-4">
            <label className="font-medium">Select Date:</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="font-medium">Select Class:</label>
            <Select
  onValueChange={(value) => {
    setSelectedClass(value);
    const selectedClassData = classes.find(cls => cls.classId === value);
    setSubSections(selectedClassData ? selectedClassData.subClass : []);
    setSelectedSubSection(""); // Reset sub-section selection
  }}
  value={selectedClass || ""}
>
  <SelectTrigger>
    <SelectValue placeholder="Select Class" />
  </SelectTrigger>
  <SelectContent>
    {classes.map((cls) => (
      <SelectItem key={cls.classId} value={cls.classId}>
        {cls.className}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

          </div>
          <div className="mb-4">
            <label className="font-medium">Select Sub-Section:</label>
            <Select
  onValueChange={setSelectedSubSection}
  value={selectedSubSection || ""}
  disabled={!selectedClass || subSections.length === 0} // Disable if no sub-sections available
>
  <SelectTrigger>
    <SelectValue placeholder="Select Sub-Section" />
  </SelectTrigger>
  <SelectContent>
    {subSections.map((subSec) => (
      <SelectItem key={subSec.subClassId} value={subSec.subClassId}>
        {subSec.subClassName}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolHomePage;
