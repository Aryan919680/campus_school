import { useEffect, useState } from "react";

export default function NewTimeTable() {
  const teacherData = JSON.parse(localStorage.getItem("teacherData"));
  const campusId = teacherData?.campusId;
  const token = localStorage.getItem("token");

  const [employeeId, setEmployeeId] = useState('');
  const [timeTable, setTimeTable] = useState([]);

  // Fetch employeeId
  useEffect(() => {
    if (!campusId || !token) return;

    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/role/campus/${campusId}/employee`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.employeeId) {
          setEmployeeId(data.data.employeeId);
        }
      })
      .catch((err) => console.error("Error fetching employee ID:", err));
  }, [campusId, token]);

  // Fetch TimeTable after employeeId is set
  useEffect(() => {
    if (!employeeId) return;

    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/timeTable/campus/${campusId}/employee?employeeId=${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          setTimeTable(data.data);
        }
      })
      .catch((err) => console.error("Error fetching timetable:", err));
  }, [campusId, token, employeeId]);

  const getDayName = (dayNumber) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayNumber - 1] || "Unknown";
  };

  return (
    <div className="w-full ml-6 rounded-xl p-4">
      <h1 className="text-3xl font-bold pt-6 mb-6">Time Table</h1>

      {timeTable.length === 0 ? (
        <p className="text-gray-500">No timetable data available.</p>
      ) : (
        <table className="table-auto w-full text-left border border-collapse border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Day</th>
              <th className="border px-4 py-2">Period</th>
              <th className="border px-4 py-2">From</th>
              <th className="border px-4 py-2">To</th>
              <th className="border px-4 py-2">Subject ID</th>
              <th className="border px-4 py-2">Semester ID</th>
            </tr>
          </thead>
          <tbody>
            {timeTable.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{getDayName(item.dayNumber)}</td>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.from}:00</td>
                <td className="border px-4 py-2">{item.to}:00</td>
                <td className="border px-4 py-2">{item.subjectId}</td>
                <td className="border px-4 py-2">{item.semesterId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
