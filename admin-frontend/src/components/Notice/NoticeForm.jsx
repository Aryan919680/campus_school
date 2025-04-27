import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints"; // adjust your import as needed

const NoticeForm = ({ onClose, refreshNotices }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [text, setText] = useState("");
  const [type, setType] = useState("EVENT");
  const [audience, setAudience] = useState("STUDENTS");
  const [active, setActive] = useState(true);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter a notice text.");
      return;
    }

    const payload = {
      notice: {
        type,
        text,
        active,
        additional_details: {
          [key || "key"]: value || "value",
        },
        audience,
      },
    };

    setLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.CREATE_NOTICE(), payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        alert("Notice created successfully!");
        // refreshNotices?.(); // optional: refresh notice list
        onClose();
      }
    } catch (error) {
      console.error("Error creating notice:", error.response?.data || error.message);
      alert("Failed to create notice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-gray-800 p-8 rounded-xl w-3/12">
        <form className="text-white space-y-5">
          <h2 className="text-2xl font-bold text-center mb-4">Create Notice</h2>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 rounded-md text-black"
            >
              <option value="EVENT">Event</option>
              <option value="ANNOUNCEMENT">Announcement</option>
              <option value="REMINDER">Reminder</option>
            </select>
          </div>

          {/* Text */}
          <div>
            <label className="block text-sm font-medium mb-1">Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 rounded-md text-black"
              placeholder="Enter notice text"
              rows={3}
            />
          </div>

          {/* Audience */}
          <div>
            <label className="block text-sm font-medium mb-1">Audience</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full p-2 rounded-md text-black"
            >
              <option value="STUDENTS">Students</option>
              <option value="EMPLOYEES">Employees</option>
              <option value="ALL">Everyone</option>
            </select>
          </div>

          {/* Active */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={active}
              onChange={() => setActive(!active)}
              className="w-5 h-5"
            />
            <label className="font-medium">Active</label>
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-sm font-medium mb-1">Additional Details</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Key"
                className="w-1/2 p-2 rounded-md text-black"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Value"
                className="w-1/2 p-2 rounded-md text-black"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="px-4 py-2 w-1/2 border-2 border-red-500 rounded-lg hover:bg-red-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 w-1/2 bg-green-600 rounded-lg hover:bg-green-700"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(NoticeForm);
