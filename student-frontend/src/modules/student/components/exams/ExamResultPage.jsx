import { useEffect, useState } from "react";
import axios from "axios";

export default function ExamResultPage({ title, examId, onClose }) {
  const token = localStorage.getItem("token");
  const studentData = JSON.parse(localStorage.getItem("studentData"));
  const studentId = studentData?.id;
  const studentName = studentData?.name;

  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      const campusId = localStorage.getItem('campusId');
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/exam/campus/${campusId}/${examId}/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        // Find result for this student
        const studentResult = data.students.find(
          (student) => student.studentId === studentId
        );

        if (studentResult) {
          setResultData({
            studentName: studentName,
            totalMarks: data.totalMarks,
            obtainedMarks: studentResult.scoreFromCorrectAnswers,
            correctAnswers: studentResult.correctAnswers,
            wrongAnswers: studentResult.wrongAnswers,
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch exam result", err);
        setLoading(false);
      }
    }

    fetchResult();
  }, [examId, token, studentId]);

  if (loading) {
    return <div className="p-6">Loading result...</div>;
  }

  if (!resultData) {
    return <div className="p-6 text-red-600">Result not available.</div>;
  }

  const percentage = ((resultData.obtainedMarks / resultData.totalMarks) * 100).toFixed(2);
  const passed = percentage >= 33;

  return (
    <div className="w-full ml-6 rounded-xl p-4">
      <h1 className="text-3xl font-bold pt-6 mb-6">Exam Results</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        <div className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition-all flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 mb-2">
              <strong>Student Name:</strong> {resultData.studentName}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Marks Obtained:</strong> {resultData.obtainedMarks} / {resultData.totalMarks}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Correct Answers:</strong> {resultData.correctAnswers}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Wrong Answers:</strong> {resultData.wrongAnswers}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Percentage:</strong> {percentage}%
            </p>
            <p className="text-sm">
              <strong>Status:</strong>{" "}
              {passed ? (
                <span className="text-green-600 font-semibold">Passed</span>
              ) : (
                <span className="text-red-600 font-semibold">Failed</span>
              )}
            </p>

            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
