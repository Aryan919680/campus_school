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
  useEffect(() => {
    const getExamData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/exam/campus/${campusId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
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
  }, [campusId, token]);

  const startExamFunc = (examId,timeAllotted) => {
    console.log("Starting exam with ID:", examId);
    setExamId(examId);
setDuration(timeAllotted);
    setStartExam(true);
    // You can add navigation or logic to open the exam screen here.
  };

  return (
    <>
{
  !startExam && <div className="w-full ml-6 rounded-xl p-4">
      <h1 className="text-3xl font-bold pt-6 mb-6">Exam Page</h1>

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
                  onClick={() => startExamFunc(exam.examId, exam.timeAllotted)}
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
      
    </div>
}
    
      {startExam && <Exam examId={examId} duration={duration}/>}
        </>
  );
}
