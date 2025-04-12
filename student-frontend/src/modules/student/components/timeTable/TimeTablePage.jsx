import { useState,useCallback,useEffect } from "react";
import axios from "axios";
const TimeTablePage = () => {
  
  const [errorMessage, setErrorMessage] = useState('');
  const [timeTable, setTimeTable] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const userData = JSON.parse(localStorage.getItem("studentData"));
  const parsedData = userData;
  console.log("test",parsedData)
  const token = localStorage.getItem("token");
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const campusType = parsedData.campusType;
  const semesterId = campusType === "COLLEGE" ? parsedData.semester.semesterId : parsedData.subclass.subClassId;
  const campusId = parsedData.campusId;
  console.log(semesterId)
  useEffect(() => {
    if (!semesterId || !selectedDay) return;
    const fetchTimetable = async () => {
      try {
        const dayIndex = days.indexOf(selectedDay) + 1; // Convert to 1-based index
        const response = await fetch(
          campusType === "COLLEGE" ? `${import.meta.env.VITE_BASE_URL}/api/v1/timeTable/campus/${campusId}/?semesterId=${semesterId}&day=${dayIndex}` :
          `${import.meta.env.VITE_BASE_URL}/api/v1/timeTable/campus/${campusId}/?subClassId=${semesterId}&day=${dayIndex}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        setTimeTable(data.data);
      } catch (error) {
        console.error("Error fetching timetable:", error);
      }
    };
    fetchTimetable();
  }, [semesterId, selectedDay]);



    
  return (
    <div className="bg-white p-8 rounded-md w-full">
      <div className="flex items-center justify-between pb-6 flex-wrap gap-2">
        <h2 className="text-gray-600 font-semibold text-2xl">
         Timetable
        </h2>
        <div className="flex gap-4 mt-4">
             
              <select
            onChange={(e) => setSelectedDay(e.target.value)}
            value={selectedDay}
          >
            <option value="">Select Day</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
            </div>
      
      </div>

      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

{timeTable.length > 0 && (
  <div className="mt-8">
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border-b">Subject Name</th>
          <th className="py-2 px-4 border-b">Day</th>
          <th className="py-2 px-4 border-b">From</th>
          <th className="py-2 px-4 border-b">To</th>
          <th className="py-2 px-4 border-b">Period Name</th>
        </tr>
      </thead>
      <tbody>
        {timeTable.map((item) => (
          <tr key={item.timtableId} className="text-center">
            <td className="py-2 px-4 border-b">{item.subjectName}</td>
            <td className="py-2 px-4 border-b">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][item.dayNumber - 1]}
            </td>
            <td className="py-2 px-4 border-b">{item.from}</td>
            <td className="py-2 px-4 border-b">{item.to}</td>
            <td className="py-2 px-4 border-b">{item.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
};

export default TimeTablePage;
