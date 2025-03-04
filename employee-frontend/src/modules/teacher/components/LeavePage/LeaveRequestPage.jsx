
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


const LeaveRequests = () => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const teacherData = JSON.parse(localStorage.getItem("teacherData"));
  const campusId = teacherData?.campusId;




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
  //     .then((data) => {
  //       setCourses(data.data || []);
  //     })
  //     .catch((err) => console.error("Error fetching courses:", err));
  // }, [selectedDepartment, campusId, token]);

  // useEffect(() => {
  //   if (!selectedCourse) return;
  //   const selectedCourseObj = courses.find((course) => course.courseId === selectedCourse);
  //   setSemesters(selectedCourseObj ? selectedCourseObj.semester : []);
  // }, [selectedCourse, courses]);



  useEffect(() => {
    //if (!selectedSemester) return;
    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/leave/campus/${campusId}/students?status=PENDING`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch leave requests");
        return response.json();
      })
      .then((data) => {
        setLeaveRequests(data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [selectedSemester]);


  const handleLeaveAction = (leaveId, status) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/leave/campus/${campusId}/students`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ leaveId, status }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update leave status");
        return response.json();
      })
      .then(() => {
        setLeaveRequests((prevRequests) =>
          prevRequests.filter((request) => request.leaveId !== leaveId)
        );
      })
      .catch((error) => console.error("Error updating leave status:", error));
  };

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Leave Requests</h1>

      {/* <div className="mb-4">
        <label className="font-medium">Select Department:</label>
        <Select onValueChange={setSelectedDepartment} value={selectedDepartment || ''}>
          <SelectTrigger>
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.departmentId} value={dept.departmentId}>
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
            {courses
              .filter((course) => course.departmentId === selectedDepartment)
              .map((course) => (
                <SelectItem key={course.courseId} value={course.courseId}>
                  {course.courseName}
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
            {semesters
              .map((sem) => (
                <SelectItem key={sem.semesterId} value={sem.semesterId}>
                  {sem.semesterName}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div> */}

      <div className="mt-6">
   
        {loading ? (
          <p>Loading leave requests...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Student ID</th>
                <th className="border border-gray-300 p-2">Reason</th>
                <th className="border border-gray-300 p-2">No. of Days</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.length > 0 ? (
                leaveRequests.map((leave) => (
                  <tr key={leave.leaveId} className="border border-gray-300">
                    <td className="border border-gray-300 p-2">{leave.studentId}</td>
                    <td className="border border-gray-300 p-2">{leave.reason}</td>
                    <td className="border border-gray-300 p-2">{leave.noOfDays}</td>
                    <td className="border border-gray-300 p-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLeaveAction(leave.leaveId, "APPROVED")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLeaveAction(leave.leaveId, "REJECTED")}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-2">No leave requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;
