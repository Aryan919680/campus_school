import React, { useEffect, useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

const CheckFees = ({ classId, setIsClassFees }) => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData.token;
  const campusId = userData.data.campusId;

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.FETCH_FEES()}/fees?classId=${classId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFees(response.data.data.fees);
      } catch (err) {
        setError("Failed to fetch fees. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchFees();
    }
  }, [classId, token, campusId]);
console.log(fees)
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-80">
      <div className="bg-white p-6 rounded-xl w-4/12 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Class Fee Details</h2>
        {loading ? (
          <p>Loading fees...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : fees.length > 0 ? (
          <ul className="list-disc pl-4">
            {fees.map((fee, index) => (
              <li key={index} className="mb-2">
                <strong>{fee.name}:</strong> ${fee.amount} ({fee.type})
              </li>
            ))}
          </ul>
        ) : (
          <p>No fees available for this class.</p>
        )}
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
          onClick={() => setIsClassFees(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default React.memo(CheckFees);
