import { useEffect, useState } from "react";
import axios from "axios";

export default function ExamResultPage({title, onClose}) {
  const token = localStorage.getItem("token");
  const campusId = localStorage.getItem("campusId");
  const [resultData, setResultData] = useState([]);
   const examResult = localStorage.getItem('examResult');
   const studentData = JSON.parse(localStorage.getItem('studentData'));
   const studentName = studentData.name;


  return (
    <div className="w-full ml-6 rounded-xl p-4">
      <h1 className="text-3xl font-bold pt-6 mb-6">Exam Results</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
       
            <div
              
              className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 mb-2">
                  <strong>Student Name:</strong> {studentName}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Marks Obtained:</strong> {examResult} 
                </p>
                {/* <p className="text-sm text-gray-500">
                  <strong>Percentage:</strong> {((result.marksObtained / result.totalMarks) * 100).toFixed(2)}%
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Status:</strong>{" "}
                  {result.passed ? (
                    <span className="text-green-600 font-semibold">Passed</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Failed</span>
                  )}
                </p> */}
              </div>
            </div>
      <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
