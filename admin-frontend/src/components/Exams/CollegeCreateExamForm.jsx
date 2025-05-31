import { useState, useEffect } from "react";
import API_ENDPOINTS from "../../API/apiEndpoints";
import QuestionsPageForm from "./QuestionPageForm";

export default function CollegeCreateExamForm({onClose}) {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    active: true,
    timeAllotted: 30,
    startAt: "",
    semesterId: '',
  });
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [questionsPage,setQuestionsPage] = useState(false);
  const [examId, setExamId] = useState();
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.GET_DEPARTMENTS(), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setDepartments(data.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!selectedDepartment) return;
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.GET_COURSES_OF_DEPARTMENT()}/${selectedDepartment}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        setCourses(data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [selectedDepartment]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  // Basic validation
  if (!formData.title.trim()) {
    alert("Title is required.");
    return;
  }

  if (!formData.description.trim()) {
    alert("Description is required.");
    return;
  }

  if (!formData.startAt) {
    alert("Start time is required.");
    return;
  }

  if (formData.timeAllotted <= 0) {
    alert("Time allotted must be greater than 0.");
    return;
  }

  if (!selectedSemester) {
    alert("Please select a semester.");
    return;
  }

  const payload = {
    ...formData,
    startAt: new Date(formData.startAt).toISOString(),
  };

  try {
    const response = await fetch(API_ENDPOINTS.CREATE_EXAM(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.success) {
      setExamId(data.data.examId)
      alert("Exam Created Successfully");
      setQuestionsPage(true);
    } else {
      alert(data.message || "Failed to create exam.");
    }

  } catch (error) {
    console.error("Some error occurred", error);
    alert("An error occurred while creating the exam.");
  }
};

const showDefaultPage = () =>{
  onClose();
  setQuestionsPage(false);
}

  return (
    <>
  {
    !questionsPage &&  <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create Exam</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="rounded"
          />
          <label className="text-sm font-medium">Active</label>
        </div>

        <div>
          <label className="block text-sm font-medium">Time Allotted (minutes)</label>
          <input
            type="number"
            name="timeAllotted"
            value={formData.timeAllotted}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Start At</label>
          <input
            type="datetime-local"
            name="startAt"
            value={formData.startAt.slice(0, 16)} // Format for input
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <select
            onChange={(e) => setSelectedDepartment(e.target.value)}
            value={selectedDepartment}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.departmentId} value={dept.departmentId}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              // Find the selected course and extract its semesters
              const selected = courses.find(
                (course) => course.courseId === e.target.value
              );
              setSemesters(selected ? selected.semester : []);
            }}
            value={selectedCourse}
            disabled={!selectedDepartment}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            onChange={(e) => {
              setSelectedSemester(e.target.value);
              setFormData((prev) => ({
                ...prev,
                semesterId: e.target.value,
              }));
            }}
            value={selectedSemester}
            disabled={!selectedCourse}
          >
            <option value="">Select Semester</option>
            {semesters.map((sem) => (
              <option key={sem.semesterId} value={sem.semesterId}>
                {sem.semesterName}
              </option>
            ))}
          </select>

        </div>
  <div className="flex  justify-between">
        <button
          type="submit"
          className="bg-linear-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Next Page
        </button>
          <button
         onClick={onClose}
          className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Cancel
        </button>
          </div>
      </form>
    
    </div>
  }
   
      {
        questionsPage && <QuestionsPageForm examId={examId} showDefaultPage={showDefaultPage}/>
      }
      </>
  );
}
