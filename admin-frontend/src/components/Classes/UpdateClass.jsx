import React, { useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

export default function UpdateClass({ setUpdateClass, updateClassValue }) {
  const [updateType, setUpdateType] = useState("class"); // Default to class
  const [updateName, setUpdateName] = useState(updateClassValue.className || "");
  const [selectedSubclass, setSelectedSubclass] = useState(
    updateClassValue?.subClass[0]?.subClassId || ""
  );

  const handleUpdate = async () => {
    let payload;

    if (updateType === "class") {
      payload = {
        classId: updateClassValue.classId,
        className: updateName,
      };
    } else {
      payload = {
        subClassId: selectedSubclass,
        subclassName: updateName,
      };
    }

    try {
      const endpoint =
        updateType === "class"
          ? `${API_ENDPOINTS.CREATE_CLASS()}/${updateClassValue.classId}`
          : `${API_ENDPOINTS.CREATE_CLASS()}/${updateClassValue.classId}/subclass/${selectedSubclass}`;

      await axios.put(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert(`${updateType === "class" ? "Class" : "Subclass"} updated successfully!`);
      setUpdateClass(false);
    } catch (error) {
      console.error("Error updating:", error.response?.data || error.message);
      alert("Failed to update. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h3 className="text-lg font-bold mb-4">
          Update {updateType === "class" ? "Class" : "Subclass"}
        </h3>

        {/* Update Type Switch */}
        <div className="mb-4">
          <label className="block text-gray-700">Select Update Type</label>
          <select
            value={updateType}
            onChange={(e) => setUpdateType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="class">Update Class</option>
            <option value="subclass">Update Subclass</option>
          </select>
        </div>

        {/* Subclass Dropdown if Update Type is Subclass */}
        {updateType === "subclass" && (
          <div className="mb-4">
            <label className="block text-gray-700">Select Subclass</label>
            <select
              value={selectedSubclass}
              onChange={(e) => setSelectedSubclass(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {updateClassValue.subClass.map((sub) => (
                <option key={sub.subClassId} value={sub.subClassId}>
                  {sub.subClassName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Input Field for Name */}
        <div className="mb-4">
          <label className="block text-gray-700">
            {updateType === "class" ? "Class Name" : "Subclass Name"}
          </label>
          <input
            type="text"
            value={updateName}
            onChange={(e) => setUpdateName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setUpdateClass(false)}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="bg-gray-600 text-white py-2 px-4 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
