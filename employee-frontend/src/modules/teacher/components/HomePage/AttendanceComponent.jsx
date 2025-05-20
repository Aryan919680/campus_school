import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent,SelectItem } from "@/components/ui/select";


export default function AttendanceComponent({ onClose }) {
  const [date, setDate] = useState("");
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const token = localStorage.getItem("token");
  const teacherData = JSON.parse(localStorage.getItem("teacherData"));
  const campusId = teacherData?.campusId;


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

  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/department/campus/${campusId}`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setDepartments(data.data || []))
  //     .catch((err) => console.error("Error fetching departments:", err));
  // }, [campusId, token]);

  // useEffect(() => {
  //   if (!selectedDepartment) return;
  //   fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/department/campus/${campusId}/department/${selectedDepartment}`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setCourses(data.data || []))
  //     .catch((err) => console.error("Error fetching courses:", err));
  // }, [selectedDepartment, campusId, token]);

  // useEffect(() => {
  //   if (!selectedCourse) return;
  //   const selectedCourseObj = courses.find((course) => course.courseId === selectedCourse);
  //   setSemesters(selectedCourseObj ? selectedCourseObj.semester : []);
  // }, [selectedCourse, courses]);

  useEffect(() => {
    if (!selectedCourse || !selectedSemester){
      return;

    } 
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/student/campus/${campusId}?semesterId=${selectedSemester}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data.data || []))
      .catch((err) => console.error("Error fetching students:", err));
  }, [selectedCourse, selectedSemester, campusId, token]);

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
              {courses.length > 0 &&courses.map((course) => (
                <SelectItem key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <label className="font-medium">Select Semester:</label>
          <Select value={selectedSemester} onValueChange={setSelectedSemester} disabled={!selectedCourse}>
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
        {date && selectedCourse && students.length > 0 && (
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
