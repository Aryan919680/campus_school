import { useEffect, useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

export default function ExamResultPage({ exam, onClose }) {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;

  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      try {
        const res = await axios.get(`${API_ENDPOINTS.CREATE_EXAM()}/${exam.examId}/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setResultData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch exam result", err);
        setLoading(false);
      }
    }

    fetchResult();
  }, [exam, token]);

  if (loading) {
    return <div className="p-6">Loading result...</div>;
  }

  if (!resultData) {
    return <div className="p-6 text-red-600">Result not available.</div>;
  }

  return (
    <div className="w-full ml-6 rounded-xl p-4">
      <h1 className="text-3xl font-bold pt-6 mb-6">Exam Results</h1>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="mb-2">
          <strong>Exam Title:</strong> {exam.title}
        </p>
        <p className="mb-2">
          <strong>Total Marks:</strong> {resultData.totalMarks}
        </p>
        <p className="mb-2">
          <strong>Total Questions:</strong> {resultData.totalQuestions}
        </p>
        <p className="mb-4">
          <strong>Total Students Attempted:</strong> {resultData.totalStudentsAttempted}
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">Student Results</h2>

        {/* Table Format */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 rounded-md">
            <thead className="bg-gray-100">
              <tr>
               
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Correct Answers</th>
                <th className="border p-2 text-left">Wrong Answers</th>
                <th className="border p-2 text-left">Marks</th>
                <th className="border p-2 text-left">Percentage</th>
                <th className="border p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {resultData.students.map((student, index) => {
                const percentage = (
                  (student.scoreFromCorrectAnswers / resultData.totalMarks) * 100
                ).toFixed(2);
                const passed = percentage >= 33;

                return (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    
                    <td className="border p-2">{student.studentName}</td>
                    <td className="border p-2">{student.correctAnswers}</td>
                    <td className="border p-2">{student.wrongAnswers}</td>
                    <td className="border p-2">
                      {student.scoreFromCorrectAnswers} / {resultData.totalMarks}
                    </td>
                    <td className="border p-2">{percentage}%</td>
                    <td className="border p-2">
                      <span className={passed ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                        {passed ? "Passed" : "Failed"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-md text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
