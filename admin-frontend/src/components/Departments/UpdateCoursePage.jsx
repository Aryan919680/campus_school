
import React, { useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

export default function UpdateCoursePage({ setUpdateCourse, updateCourseValue }) {
  const [updateType, setUpdateType] = useState("course"); // Default to course
  const [updateName, setUpdateName] = useState(updateCourseValue.courseName || "");
  const [selectedSemester, setSelectedSemester] = useState(updateCourseValue?.semester[0]?.semesterId || "");

  const handleUpdate = async () => {
    let payload;

    if (updateType === "course") {
      payload = {
        courseId: updateCourseValue.courseId,
        name: updateName,
      };
    } else {
      payload = {
        semesterId: selectedSemester,
        name: updateName,
      };
    }

    try {
      const endpoint =
        updateType === "course"
         ?`${API_ENDPOINTS.SUBMIT_COURSES()}/${updateCourseValue.departmentId}/course`
          :  `${API_ENDPOINTS.SUBMIT_COURSES()}/${updateCourseValue.departmentId}/course/semester`

      await axios.put(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert(`${updateType === "course" ? "Course" : "Semester"} updated successfully!`);
      setUpdateCourse(false);
    } catch (error) {
      console.error("Error updating:", error.response?.data || error.message);
      alert("Failed to update. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h3 className="text-lg font-bold mb-4">Update {updateType === "course" ? "Course" : "Semester"}</h3>

        <div className="mb-4">
          <label className="block text-gray-700">Select Update Type</label>
          <select
            value={updateType}
            onChange={(e) => setUpdateType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="course">Update Course</option>
            <option value="semester">Update Semester</option>
          </select>
        </div>

        {updateType === "semester" && (
          <div className="mb-4">
            <label className="block text-gray-700">Select Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {updateCourseValue.semester.map((sem) => (
                <option key={sem.semesterId} value={sem.semesterId}>
                  {sem.semesterName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700">
            {updateType === "course" ? "Course Name" : "Semester Name"}
          </label>
          <input
            type="text"
            value={updateName}
            onChange={(e) => setUpdateName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setUpdateCourse(false)}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="bg-linear-blue text-white py-2 px-4 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
