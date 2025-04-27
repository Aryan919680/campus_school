import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

export default function UpdateNoticePage({ noticeData,setEditPage }) {
  const navigate = useNavigate();

  const [active, setActive] = useState(noticeData?.active ?? true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData?.token;

      await axios.put(API_ENDPOINTS.CREATE_NOTICE(), {
        active,
        noticeId: noticeData.noticeId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Notice updated successfully!");
      // navigate("/notices");
      setEditPage(false);
    } catch (error) {
      console.error("Error updating notice:", error.response?.data || error.message);
      setErrorMessage("Failed to update notice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Update Notice</h2>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="active" className="text-gray-600 font-semibold">Active:</label>
          <input
            type="checkbox"
            id="active"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-5 h-5"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-linear-blue hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded mt-4"
        >
          {loading ? "Saving..." : "Update Notice"}
        </button>
      </form>
    </div>
    </div>
  );
}
