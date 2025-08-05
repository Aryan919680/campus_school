import React, { useEffect, useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import AssignTeacher from "./AssignTeacher";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const CreateTimetable = ({
  subjectData,
  setShowAssignSubjectPage,
  setOpenForm,
}) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;
  const campusType = userData?.data.campusType;
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [formData, setFormData] = useState({
    day: "",
    from: "",
    to: "",
    subjectId: "",
    employeeId: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showTimetablePage, setShowTimetablePage] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.GET_DEPARTMENTS(), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(response.data.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, [token]);

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    //   handleChange(e);

    if (!departmentId) return;

    try {
      const response = await axios.get(
        `${API_ENDPOINTS.GET_COURSES_OF_DEPARTMENT()}/${departmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(response.data.data);
      setSemesters([]);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);

    const selectedCourse = courses.find((c) => c.courseId === courseId);
    if (selectedCourse) {
      setSemesters(selectedCourse.semester);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idParam =
          campusType.toLowerCase() === "college"
            ? `courseId=${selectedCourseId}`
            : `classId=${subjectData.classId}`;

        const [subjectRes] = await Promise.all([
          axios.get(`${API_ENDPOINTS.GET_SUBJECTS()}?${idParam}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setSubjects(subjectRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token, selectedCourseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "semesterId") {
      setSelectedSemesterId(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssign = () => {
    const { day, from, to, subjectId } = formData;

    if (!day || !from || !to || !subjectId) {
      alert("Please fill all fields.");
      return;
    }

    const subject = subjects.find((s) => s.subjectId === subjectId);
    const newEntry = {
      subjectId,
      from,
      to,
      day: days.indexOf(day) + 1,
      name: `Period ${timetable.length + 1}`,
      subjectName: subject.name,
      subjectCode: subject.subjectCode,
    };

    if (isEditing && editIndex !== null) {
      const updated = [...timetable];
      updated[editIndex] = newEntry;
      setTimetable(updated);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      const exists = timetable.some(
        (entry) =>
          entry.day === newEntry.day &&
          entry.from === newEntry.from &&
          entry.to === newEntry.to
      );
      if (exists) {
        alert("Time slot already assigned for this day and time.");
        return;
      }

      setTimetable((prev) => [...prev, newEntry]);
    }

    setFormData({ day: "", from: "", to: "", subjectId: "" });
  };

  const handleSaveTimetable = async () => {
    const payload = {
      records: timetable.map((entry) => ({
        subjectId: entry.subjectId,
        from: entry.from,
        to: entry.to,
        day: entry.day,
        name: entry.name,
      })),
      ...(campusType.toLowerCase() === "college"
        ? { semesterId: selectedSemesterId }
        : { subClassId: subjectData.subClassId }),
    };

    try {
      await axios.post(API_ENDPOINTS.CREATE_TIMETABLE(), payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Timetable saved successfully!");
      setIsSaved(true);
      //  setTimetable([]);
      // onClose();
    } catch (error) {
      console.error("Error saving timetable:", error);
      alert("Error saving timetable.");
    }
  };

  const onClose = () => {

    setShowTimetablePage(false);
    setOpenForm(false);
  };

  const handleNextPage = () => {
    setShowTimetablePage(true);
  };

  return (
    <>
      {!showTimetablePage && (
        <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-xl w-7/12 mx-auto text-white">
            <h2 className="text-xl font-bold mb-4">Step 1: Create Timetable</h2>

            <div className="grid grid-cols-2 gap-4">
              <select
                name="departmentId"
                onChange={handleDepartmentChange}
                className="block w-full p-2 rounded-md text-black"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.name}
                  </option>
                ))}
              </select>

              <select
                name="courseId"
                value={selectedCourseId}
                onChange={handleCourseChange}
                className="block w-full p-2 rounded-md text-black"
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseName}
                  </option>
                ))}
              </select>

              <select
                name="semesterId"
                value={selectedSemesterId}
                onChange={handleChange}
                className="block w-full p-2 rounded-md text-black"
              >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem.semesterId} value={sem.semesterId}>
                    {sem.semesterName}
                  </option>
                ))}
              </select>

              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="p-2 rounded-md text-black"
              >
                <option value="">Select Day</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                className="p-2 rounded-md text-black"
                placeholder="Start Time"
              />

              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                className="p-2 rounded-md text-black"
                placeholder="End Time"
              />

              <select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                className="p-2 rounded-md text-black"
              >
                <option value="">Select Subject</option>
                {subjects.map((subj) => (
                  <option key={subj.subjectId} value={subj.subjectId}>
                    {subj.subjectCode}-{subj.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAssign}
              className="mt-4 bg-linear-blue hover:bg-blue-600 text-white w-full py-2 rounded-md"
            >
              Assign to Timetable
            </button>
            {isEditing && (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditIndex(null);
                  setFormData({ day: "", from: "", to: "", subjectId: "" });
                }}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-md"
              >
                Cancel Edit
              </button>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold">Assigned Timetable:</h3>
              {timetable.length === 0 ? (
                <p className="text-sm text-gray-300">No slots assigned yet.</p>
              ) : (
                <>
                  <table className="w-full mt-3 text-sm text-white border border-gray-700">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="p-2 border">Day</th>
                        <th className="p-2 border">Time Slot</th>
                        <th className="p-2 border">Subject</th>
                        <th className="p-2 border">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map((entry, idx) => (
                        <tr
                          key={idx}
                          className="text-center border-t border-gray-600"
                        >
                          <td className="p-2 border">{days[entry.day - 1]}</td>
                          <td className="p-2 border">
                            {entry.from} - {entry.to}
                          </td>
                          <td className="p-2 border">
                            {entry.subjectCode}-{entry.subjectName}
                          </td>
                          <td className="p-2 border">
                            <button
                              onClick={() => {
                                setFormData({
                                  day: days[entry.day - 1],
                                  from: entry.from,
                                  to: entry.to,
                                  subjectId: entry.subjectId,
                                });
                                setIsEditing(true);
                                setEditIndex(idx);
                              }}
                              className="bg-yellow-500 px-2 py-1 rounded text-sm hover:bg-yellow-600"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button
                    onClick={handleSaveTimetable}
                    disabled={isSaved || timetable.length === 0}
                    className={`mt-4 ${
                      isSaved || timetable.length === 0
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    } w-full py-2 rounded-md`}
                  >
                    Save Timetable
                  </button>

                  <button
                    onClick={handleNextPage}
                    className="mt-4 bg-yellow-500 hover:bg-blue-600 text-white w-full py-2 rounded-md"
                  >
                    Assign Subjects
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {showTimetablePage && (
        <AssignTeacher selectedCourseId={selectedCourseId} selectedSemesterId={selectedSemesterId} onClose={onClose} />
      )}
    </>
  );
};

export default CreateTimetable;
