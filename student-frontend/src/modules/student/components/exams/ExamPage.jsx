import { useEffect, useContext, useState } from "react";
import { AuthContext } from "@/auth/context/AuthContext";
import axios from "axios";
import Exam from "./Exam";

export default function ExamPage() {
  const token = localStorage.getItem("token");
  const campusId = localStorage.getItem("campusId");
  const [startExam, setStartExam] = useState(false);
  const [examData, setExamData] = useState([]);
  const [examId, setExamId] = useState();
  const [duration,setDuration] = useState();
   const [searchTerm, setSearchTerm] = useState("");
      const [pageNumber, setPageNumber] = useState(1);
      const [pageSize] = useState(6); // you can make this dynamic too
 const [examTitle,setExamTitle]= useState();
  useEffect(() => {
    const getExamData = async () => {
      const campusId = localStorage.getItem("campusId");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/exam/campus/${campusId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
             params: {
        search: searchTerm,
        pageNumber,
        pageSize,
      },
          }
        );
        setExamData(response.data.data);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    if (campusId && token) {
      getExamData();
    }
  }, [campusId, token,pageNumber,searchTerm,pageSize]);

const startExamFunc = (examId, timeAllotted, startAt, title) => {
  const now = new Date().getTime();
  const startTime = new Date(startAt).getTime();
  const endTime = startTime + timeAllotted * 60 * 1000; // Convert minutes to ms

  if (now < startTime) {
    alert("You cannot start the exam before the scheduled start time.");
    return;
  }

  if (now > endTime) {
    alert("The time to start this exam has expired.");
    return;
  }

  setExamId(examId);
  setDuration(timeAllotted);
  setStartExam(true);
  setExamTitle()
};

const onClose = () =>{
    setStartExam(false);
}


  return (
    <>
{
  !startExam && <div className="w-full ml-6 rounded-xl p-4">
    <div className="flex gap-4">
  <h1 className="text-3xl font-bold pt-6 mb-6">Exam Page</h1>
  <div className="mb-4 w-full sm:w-1/2 mt-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Exam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[400px] pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">
                🔍
              </span>
            </div>
          </div>
    </div>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          
        {examData.length > 0 ? (
          examData.map((exam) => (
            <div
              key={exam.examId}
              className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {exam.title}
                </h3>
                <p className="text-gray-600 mb-2">{exam.description}</p>
                <p className="text-sm text-gray-500">
                  <strong>Start At:</strong>{" "}
                  {new Date(exam.startAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Duration:</strong> {exam.timeAllotted} mins
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Status:</strong> {exam.active ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
               <button
  onClick={() =>
    startExamFunc(exam.examId, exam.timeAllotted, exam.startAt, exam.title)
  }
  className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-md text-sm"
>
  Start Exam
</button>

              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No exams found.
          </div>
        )}
      </div>
      <div className="flex justify-between mt-6">
    <button
      onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
      disabled={pageNumber === 1}
      className="bg-gray-200 px-4 py-2 rounded"
    >
      Prev
    </button>
    <span>Page {pageNumber}</span>
    <button
      onClick={() => setPageNumber((prev) => prev + 1)}
      className="bg-gray-200 px-4 py-2 rounded"
    >
      Next
    </button>
  </div>
    </div>
}
    
      {startExam && <Exam examId={examId} duration={duration} title={examTitle} onClose={onClose}/>}
        </>
  );
}
