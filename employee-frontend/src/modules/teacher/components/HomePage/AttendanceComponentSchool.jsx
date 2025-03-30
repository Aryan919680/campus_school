import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function AttendanceComponentSchool({ onClose,handleShowAttendance }) {
  const [date, setDate] = useState("");
  // const [classes, setClasses] = useState([]);
  // const [selectedClass, setSelectedClass] = useState("");
  const [subClasses, setSubClasses] = useState([]);
  const [selectedSubClass, setSelectedSubClass] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const token = localStorage.getItem("token");
  const teacherData = JSON.parse(localStorage.getItem("teacherData"));
  const campusId = teacherData?.campusId;
  const [classes, setClasses] = useState([]);
  const [subSections, setSubSections] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSubSection, setSelectedSubSection] = useState("");
  
  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/class/campus/${campusId}`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setClasses(data.data.class || []))
  //     .catch((err) => console.error("Error fetching classes:", err));
  // }, [campusId, token]);

  useEffect(() => {
    if (!selectedClass) return;
    const selectedClassObj = classes.find((cls) => cls.classId === selectedClass);
    setSubClasses(selectedClassObj ? selectedClassObj.subClass : []);
  }, [selectedClass, classes]);

  useEffect(() => {
    if (!selectedSubSection) return;
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/student/campus/${campusId}?subClassId=${selectedSubSection}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data.data || []))
      .catch((err) => console.error("Error fetching students:", err));
  }, [selectedSubSection, campusId, token]);

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

  const handleAttendanceChange = (id, status) => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
  };

  const handleSave = () => {
    const attendancePayload = {
      attendance: students.map((student) => ({
        id: student.studentId,
        status: attendance[student.studentId] ? attendance[student.studentId].toUpperCase() : "ABSENT",
      })),
    };

    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/attendance/campus/${campusId}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(attendancePayload),
    })
      .then((res) => res.json())
      .then(() => onClose())
      .catch((error) => console.error("Error saving attendance:", error));
  };

  

  return (
    <Card className="p-6 max-w-lg mx-auto shadow-lg">
      <CardContent>
        <div className="mb-4">
          <Label>Select Date:</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
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
            </> )
}
        { students.length > 0 && (
          <div className="border p-4 rounded-lg mt-4">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll No.</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.studentId}>
                    <td>{student.name}</td>
                    <td>{student.rollNo}</td>
                    <td>
                      <input type="radio" name={student.studentId} checked={attendance[student.studentId] === "PRESENT"} onChange={() => handleAttendanceChange(student.studentId, "PRESENT")} /> Present
                      <input type="radio" name={student.studentId} checked={attendance[student.studentId] === "ABSENT"} onChange={() => handleAttendanceChange(student.studentId, "ABSENT")} className="ml-2" /> Absent
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Button className="mt-4 w-full" onClick={handleSave}>Save Attendance</Button>
      </CardContent>
    </Card>
  );
}
