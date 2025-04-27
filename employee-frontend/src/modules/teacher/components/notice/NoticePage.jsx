import { useState, useEffect, useCallback } from "react";
import axios from "axios";
export default function NoticePage(){
    const [notices, setNotices] = useState([]);
    const token = localStorage.getItem("token");
    const teacherData = JSON.parse(localStorage.getItem("teacherData"));
    const campusId = teacherData?.campusId;
    const fetchNotices = useCallback(async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/notice/campus/${campusId}/employees`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setNotices(response.data.data || []);
        } catch (error) {
          console.error("Error fetching notices:", error.response?.data || error.message);
          setErrorMessage("Failed to load notices.");
        }
      }, []);
    
      useEffect(() => {
        fetchNotices();
      }, [fetchNotices]);
    return(
        <div className="w-full ml-6 rounded-xl p-4">
        <h1 className="text-3xl font-bold pt-6 mb-6">Notice Page</h1>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mt-6">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <div
              key={notice.id}
              className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{notice.type}</h3>
                <p className="text-gray-600 ">{notice.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">No notices found.</div>
        )}
      </div>
  
 
   </div>
    )
}