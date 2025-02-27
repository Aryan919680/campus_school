// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectItem } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const students = [
//   { name: "Alice Johnson", rollNo: "001" },
//   { name: "Brian Carter", rollNo: "002" },
//   { name: "Charlie Evans", rollNo: "003" },
// ];

// export default function AttendanceComponent() {
//   const [date, setDate] = useState("");
//   const [selectedClass, setSelectedClass] = useState("");
//   const [attendance, setAttendance] = useState(
//     students.reduce((acc, student) => {
//       acc[student.rollNo] = "";
//       return acc;
//     }, {})
//   );

//   const handleAttendanceChange = (rollNo, status) => {
//     setAttendance((prev) => ({ ...prev, [rollNo]: status }));
//   };

//   const handleSave = () => {
//     console.log("Attendance Data:", { date, selectedClass, attendance });
//   };

//   return (
//     <Card className="p-6 max-w-lg mx-auto shadow-lg">
//       <CardContent>
//         <div className="mb-4">
//           <Label>Select Date:</Label>
//           <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
//         </div>
//         <div className="mb-4">
//           <Label>Select Class:</Label>
//           {/* <Select onValueChange={setSelectedClass}>
//             {["1A", "1B", "2A", "2B"].map((cls) => (
//             //   <SelectItem key={cls} value={cls}>{cls}</SelectItem>
//             ))}
//           </Select> */}
//         </div>
//         <div className="border p-4 rounded-lg mt-4">
//           <table className="w-full text-left">
//             <thead>
//               <tr>
//                 <th>Student Name</th>
//                 <th>Roll No.</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((student) => (
//                 <tr key={student.rollNo}>
//                   <td>{student.name}</td>
//                   <td>{student.rollNo}</td>
//                   <td>
//                     <input
//                       type="radio"
//                       name={student.rollNo}
//                       checked={attendance[student.rollNo] === "Present"}
//                       onChange={() => handleAttendanceChange(student.rollNo, "Present")}
//                     /> Present
//                     <input
//                       type="radio"
//                       name={student.rollNo}
//                       checked={attendance[student.rollNo] === "Absent"}
//                       onChange={() => handleAttendanceChange(student.rollNo, "Absent")}
//                       className="ml-2"
//                     /> Absent
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <Button className="mt-4 w-full" onClick={handleSave}>Save Attendance</Button>
//       </CardContent>
//     </Card>
//   );
// }

import { useState, useEffect,useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/auth/context/AuthContext";

export default function AttendanceComponent() {
  const [date, setDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const { data } = useContext(AuthContext);
   const token = localStorage.getItem('token');
  useEffect(() => {
    console.log(data.campusId,token)
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/department/campus/${data.campusId}`,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
    })
      .then((res) => res.json())
      .then((data) => setDepartments(data.data));
  }, [data,token]);

  useEffect(() => {
    if (selectedDepartment) {
      fetch(`http://localhost:4000/api/v1/attendance/campus/courses?department=${selectedDepartment}`)
        .then((res) => res.json())
        .then((data) => setCourses(data));
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedCourse) {
      const course = courses.find((c) => c.id === selectedCourse);
      if (course) setSemesterId(course.semesterId);
    }
  }, [selectedCourse, courses]);

  useEffect(() => {
    if (date && semesterId) {
      fetch(`http://localhost:4000/api/v1/attendance/campus/60002bf9-7e65-49a5-9d2c-ce5ddd291337/students?date=${date}&semesterId=${semesterId}`)
        .then((res) => res.json())
        .then((data) => {
          setStudents(data);
          setAttendance(
            data.reduce((acc, student) => {
              acc[student.rollNo] = "";
              return acc;
            }, {})
          );
        });
    }
  }, [date, semesterId]);

  const handleAttendanceChange = (rollNo, status) => {
    setAttendance((prev) => ({ ...prev, [rollNo]: status }));
  };

  const handleSave = () => {
    console.log("Attendance Data:", { date, selectedClass, attendance });
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
          <Select onValueChange={setSelectedDepartment}>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="mb-4">
          <Label>Select Course:</Label>
          <Select onValueChange={setSelectedCourse}>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
            ))}
          </Select>
        </div>
        {date && semesterId && students.length > 0 && (
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
                  <tr key={student.rollNo}>
                    <td>{student.name}</td>
                    <td>{student.rollNo}</td>
                    <td>
                      <input
                        type="radio"
                        name={student.rollNo}
                        checked={attendance[student.rollNo] === "Present"}
                        onChange={() => handleAttendanceChange(student.rollNo, "Present")}
                      /> Present
                      <input
                        type="radio"
                        name={student.rollNo}
                        checked={attendance[student.rollNo] === "Absent"}
                        onChange={() => handleAttendanceChange(student.rollNo, "Absent")}
                        className="ml-2"
                      /> Absent
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
