import React, { useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

const EditClass = ({ selectedClassForEdit, errorMessage }) => {
  const [className, setClassName] = useState(selectedClassForEdit?.className || "");
  const [subsections, setSubsections] = useState(
    selectedClassForEdit?.subClass.map((sec) => sec.subClassName) || []
  );
    const [newSubsection, setNewSubsection] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingClass, setEditingClass] = useState(false);
  const [editingSections, setEditingSections] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData.token;

  // Handle class name change
  const handleClassNameChange = (e) => setClassName(e.target.value);

  // Handle subsection input change
  const handleSubsectionChange = (e) => setNewSubsection(e.target.value);

  // Add new subsection
  const addSubsection = () => {
    if (!newSubsection.trim()) return alert("Please enter a subsection.");
    setSubsections([...subsections, newSubsection.trim()]);
    setNewSubsection("");
  };

  // Delete a subsection
  const deleteSubsection = (subsection) => {
    setSubsections(subsections.filter((item) => item !== subsection));
  };

  // Save class name update
  const saveClassName = async () => {
    setLoading(true);
    try {
      await axios.put(API_ENDPOINTS.UPDATE_CLASS, 
        { className }, 
        { 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      setEditingClass(false);
      alert("Class updated successfully.");
    } catch (error) {
      console.error("Error updating class:", error);
      alert("Failed to update class.");
    } finally {
      setLoading(false);
    }
  };

  // Save sections update
  const saveSections = async () => {
    setLoading(true);
    try {
      await axios.put(API_ENDPOINTS.UPDATE_SECTIONS, 
        { className, subsections }, 
        { 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      setEditingSections(false);
      alert("Sections updated successfully.");
    } catch (error) {
      console.error("Error updating sections:", error);
      alert("Failed to update sections.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 border border-gray-100">
      <div className="bg-gray-800 p-8 rounded-xl w-3/12">
        <form className="text-white">
          {/* Class Name Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">Class Name</label>
            {editingClass ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={className}
                  onChange={handleClassNameChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                  placeholder="Enter class name (e.g., Grade 1)"
                />
                <button
                  type="button"
                  onClick={saveClassName}
                  className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-white">{className}</span>
                <button
                  type="button"
                  onClick={() => setEditingClass(true)}
                  className="text-blue-400 text-sm"
                >
                  Edit Class
                </button>
              </div>
            )}
          </div>

          {/* Subsections Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">Subsections</label>
            {editingSections ? (
              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    value={newSubsection}
                    onChange={handleSubsectionChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                    placeholder="Enter subsection (e.g., A)"
                  />
                  <button
                    type="button"
                    onClick={addSubsection}
                    className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <div>
                  {subsections.map((subsection) => (
                    <div key={subsection} className="flex justify-between items-center mb-2">
                      <span>{subsection}</span>
                      <button
                        type="button"
                        onClick={() => deleteSubsection(subsection)}
                        className="text-red-400 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={saveSections}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Save Sections
                </button>
              </div>
            ) : (
              <div>
                <ul>
                  {subsections.map((subsection) => (
                    <li key={subsection} className="flex justify-between items-center mb-2">
                      <span>{subsection}</span>
                      <button
                        type="button"
                        onClick={() => deleteSubsection(subsection)}
                        className="text-red-400 text-sm"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setEditingSections(true)}
                  className="text-blue-400 text-sm"
                >
                  Edit Sections
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}

          {/* Cancel & Close Button */}
          <div className="flex justify-end items-center mt-4 gap-4">
            <button
              className="px-4 w-1/2 py-2 text-white border-red-500 border-2 rounded-lg hover:bg-red-500"
              type="button"

            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClass;
