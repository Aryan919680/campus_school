import { useState,useCallback,useEffect } from "react";
import API_ENDPOINTS from "../../API/apiEndpoints";
import SchoolAddSubjects from "./SchoolAddSubjects";
import axios from "axios";
import ListTable from "../List/ListTable";
const SchoolTimeTablePage = () => {
  const [classes, setClasses] = useState([]);
   const [subClasses, setSubClasses] = useState([]);
   const [selectedClass, setSelectedClass] = useState("");
   const [selectedSubClass, setSelectedSubClass] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [timeTable, setTimeTable] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const parsedData = userData;
  const token = parsedData.token;
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
 
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.FETCH_CLASS(), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setClasses(data.data.class);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  const handleClassChange = (e) => {
    const selectedClassId = e.target.value;
    setSelectedClass(selectedClassId);

    // Find and update the subclasses dropdown
    const selectedClassObj = classes.find((cls) => cls.classId === selectedClassId);
    setSubClasses(selectedClassObj ? selectedClassObj.subClass : []);
    setSelectedSubClass(""); // Reset subclass selection
  };


  useEffect(() => {
    if (!selectedClass || !selectedSubClass) return;
    const fetchTimetable = async () => {
      try {
        const dayIndex = days.indexOf(selectedDay) + 1; // Convert to 1-based index
        const response = await fetch(
          `${API_ENDPOINTS.GET_TIMETABLE()}?subClassId=${selectedSubClass}&day=${dayIndex}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        setTimeTable(data.data);
      } catch (error) {
        console.error("Error fetching timetable:", error);
      }
    };
    fetchTimetable();
  }, [selectedSubClass, selectedClass, selectedDay]);


   const handleForm = useCallback(() => {
      setOpenForm(true);
    }, []);

    
  return (
    <div className="bg-white p-8 rounded-md w-full">
      <div className="flex items-center justify-between pb-6 flex-wrap gap-2">
        <h2 className="text-gray-600 font-semibold text-2xl">
         Timetable
        </h2>
        <div className="flex gap-4 mt-4">
       
            {/* Class Dropdown */}
            <select onChange={handleClassChange} value={selectedClass}>
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className}
                </option>
              ))}
            </select>

            {/* SubClass Dropdown */}
            <select
              onChange={(e) => setSelectedSubClass(e.target.value)}
              value={selectedSubClass}
              disabled={!selectedClass}
            >
              <option value="">Select Subclass</option>
              {subClasses.map((subCls) => (
                <option key={subCls.subClassId} value={subCls.subClassId}>
                  {subCls.subClassName}
                </option>
              ))}
            </select>
        
              <select
            onChange={(e) => setSelectedDay(e.target.value)}
            value={selectedDay}
            disabled={!selectedSubClass}
          >
            <option value="">Select Day</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
            </div>
        <div className="flex justify-center items-center">
          <button
            onClick={handleForm}
            className="bg-linear-blue text-white font-bold py-2 px-4 rounded w-full md:w-fit"
          >
            Create Timetable
          </button>
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

       {openForm && <SchoolAddSubjects />

       }
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

export default SchoolTimeTablePage;
