import axios from "axios";
import { useState } from "react";
import API_ENDPOINTS from "../../API/apiEndpoints";
export default function QuestionPageForm({ examId, showDefaultPage }) {
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: [{ id: "A", option: "" }, { id: "B", option: "" }],
      answer: "",
      score: 0,
    },
  ]);
 const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: [{ id: "A", option: "" }, { id: "B", option: "" }],
        answer: "",
        score: 0,
      },
    ]);
  };

  const addOption = (qIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: [
                ...q.options,
                {
                  id: String.fromCharCode(65 + q.options.length), // A, B, C, ...
                  option: "",
                },
              ],
            }
          : q
      )
    );
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    );
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === oIndex ? { ...opt, option: value } : opt
              ),
            }
          : q
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        alert(`Question ${i + 1} is empty`);
        return;
      }
      if (q.options.length < 2) {
        alert(`Question ${i + 1} must have at least 2 options`);
        return;
      }
      if (!q.answer) {
        alert(`Select an answer for Question ${i + 1}`);
        return;
      }
      if (!q.options.find((opt) => opt.id === q.answer)) {
        alert(`Answer for Question ${i + 1} does not match any option`);
        return;
      }
      if (q.score <= 0) {
        alert(`Score must be greater than 0 for Question ${i + 1}`);
        return;
      }
    }
    console.log(questions);
  try {
  const response = await axios.post(
    `${API_ENDPOINTS.CREATE_EXAM()}/questions/${examId}`,
    {questions},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if(response){
  alert("Questions Added Successfully");
  showDefaultPage();
  }

} catch (error) {
  console.log(error);
}

  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-semibold">Add Questions</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="p-4 border rounded-lg space-y-4">
            <div>
              <label className="block font-medium">Question {qIndex + 1}</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "question", e.target.value)
                }
                className="w-full border p-2 rounded mt-1"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium">Options</label>
              {q.options.map((opt, oIndex) => (
                <div key={opt.id} className="flex items-center space-x-2">
                  <span className="w-6">{opt.id}.</span>
                  <input
                    type="text"
                    value={opt.option}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                    className="flex-1 border p-2 rounded"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIndex)}
                className="text-sm text-blue-600 hover:underline"
              >
                + Add Option
              </button>
            </div>

            <div>
              <label className="block font-medium">Correct Answer (A, B, ...)</label>
              <input
                type="text"
                value={q.answer}
                maxLength={1}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "answer", e.target.value.toUpperCase())
                }
                className="w-20 border p-2 rounded mt-1"
              />
            </div>

            <div>
              <label className="block font-medium">Score</label>
              <input
                type="number"
                value={q.score}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "score", parseInt(e.target.value))
                }
                className="w-24 border p-2 rounded mt-1"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          + Add Another Question
        </button>

       <div className="flex  justify-between">
          <button
            type="submit"
            className="bg-linear-blue text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit Questions
          </button>
             <button
         onClick={showDefaultPage}
          className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Cancel
        </button>
        </div>
      </form>
    </div>
  );
}
