// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// const departments = [
//   { id: "dept1", name: "Computer Science" },
//   { id: "dept2", name: "Mechanical Engineering" },
// ];

// const courses = [
//   { id: "course1", name: "Data Structures", semesterId: "sem1" },
//   { id: "course2", name: "Thermodynamics", semesterId: "sem2" },
// ];

// const semesters = [
//   { id: "sem1", name: "Semester 1" },
//   { id: "sem2", name: "Semester 2" },
// ];

// const students = [
//   { id: "0a074415-4336-4a88-977f-c015e931a322", name: "Alice Johnson", rollNo: "001" },
//   // { id: "abc12345-xyz67890", name: "Brian Carter", rollNo: "002" },
//   // { id: "def56789-uvw12345", name: "Charlie Evans", rollNo: "003" },
// ];

// export default function AttendanceComponent( {onClose} ) {
//   const [date, setDate] = useState("");
//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [selectedSemester, setSelectedSemester] = useState("");
//   const teacherData = JSON.parse(localStorage.getItem("teacherData"));
//   const campusId = teacherData.campusId;
//   const token = localStorage.getItem("token");
//   const [attendance, setAttendance] = useState(
//     students.reduce((acc, student) => {
//       acc[student.id] = "";
//       return acc;
//     }, {})
//   );

//   const handleAttendanceChange = (id, status) => {
//     setAttendance((prev) => ({ ...prev, [id]: status }));
//   };

//   const handleSave = () => {
//     const attendancePayload = {
//       attendance: students.map((student) => ({
//         id: student.id,
//         status: attendance[student.id] ? attendance[student.id].toUpperCase() : "ABSENT",
//       })),
//     };
//     try {
//       const response = fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/attendance/campus/${campusId}/students` ,
//         {
//           method: "POST", 
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(attendancePayload), 
//         }
      
//       )
//       console.log(response)
//     } catch (error) {
//       console.log(error)
//     }

//     console.log("Attendance Data:", attendancePayload);
//     onClose();
//   };

//   return (
//     <Card className="p-6 max-w-lg mx-auto shadow-lg">
//       <CardContent>
//         <div className="mb-4">
//           <Label>Select Date:</Label>
//           <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
//         </div>
//         <div className="mb-4">
//           <Label>Select Department:</Label>
//           <Select onValueChange={setSelectedDepartment}>
//   <SelectTrigger className="w-full">
//     <SelectValue placeholder="Select Department" />
//   </SelectTrigger>
//   <SelectContent>
//     {departments.map((dept) => (
//       <SelectItem key={dept.id} value={dept.id}>
//         {dept.name}
//       </SelectItem>
//     ))}
//   </SelectContent>
// </Select>

//         </div>
//         <div className="mb-4">
//           <Label>Select Course:</Label>
//           <Select onValueChange={setSelectedCourse}>
//   <SelectTrigger className="w-full">
//     <SelectValue placeholder="Select Course" />
//   </SelectTrigger>
//   <SelectContent>
//     {courses.map((course) => (
//       <SelectItem key={course.id} value={course.id}>
//         {course.name}
//       </SelectItem>
//     ))}
//   </SelectContent>
// </Select>

//         </div>
//         <div className="mb-4">
//           <Label>Select Semester:</Label>
//           <Select onValueChange={setSelectedSemester}>
//   <SelectTrigger className="w-full">
//     <SelectValue placeholder="Select Semester" />
//   </SelectTrigger>
//   <SelectContent>
//     {semesters.map((sem) => (
//       <SelectItem key={sem.id} value={sem.id}>
//         {sem.name}
//       </SelectItem>
//     ))}
//   </SelectContent>
// </Select>

//         </div>
//         {date && selectedCourse && students.length > 0 && (
//           <div className="border p-4 rounded-lg mt-4">
//             <table className="w-full text-left">
//               <thead>
//                 <tr>
//                   <th>Student Name</th>
//                   <th>Roll No.</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {students.map((student) => (
//                   <tr key={student.id}>
//                     <td>{student.name}</td>
//                     <td>{student.rollNo}</td>
//                     <td>
//                       <input
//                         type="radio"
//                         name={student.id}
//                         checked={attendance[student.id] === "PRESENT"}
//                         onChange={() => handleAttendanceChange(student.id, "PRESENT")}
//                       /> Present
//                       <input
//                         type="radio"
//                         name={student.id}
//                         checked={attendance[student.id] === "ABSENT"}
//                         onChange={() => handleAttendanceChange(student.id, "ABSENT")}
//                         className="ml-2"
//                       /> Absent
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//         <Button className="mt-4 w-full" onClick={handleSave}>Save Attendance</Button>
//       </CardContent>
//     </Card>
//   );
// }


import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/department/campus/${campusId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDepartments(data.data || []))
      .catch((err) => console.error("Error fetching departments:", err));
  }, [campusId, token]);

  useEffect(() => {
    if (!selectedDepartment) return;
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/department/campus/${campusId}/department/${selectedDepartment}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCourses(data.data || []))
      .catch((err) => console.error("Error fetching courses:", err));
  }, [selectedDepartment, campusId, token]);

  useEffect(() => {
    if (!selectedCourse) return;
    const selectedCourseObj = courses.find((course) => course.courseId === selectedCourse);
    setSemesters(selectedCourseObj ? selectedCourseObj.semester : []);
  }, [selectedCourse, courses]);

  useEffect(() => {
    if (!selectedCourse || !selectedSemester) return;
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/student/campus/${campusId}?semesterId=${selectedSemester}&courseId=${selectedCourse}`, {
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
          <Label>Select Date:</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="mb-4">
          <Label>Select Department:</Label>
          <Select value={selectedDepartment || ""} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.departmentId} value={dept.departmentId}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Label>Select Course:</Label>
          <Select onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.courseId} value={course.courseId}>{course.courseName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Label>Select Semester:</Label>
          <Select onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((sem) => (
                <SelectItem key={sem.semesterId} value={sem.semesterId}>{sem.semesterName}</SelectItem>
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
