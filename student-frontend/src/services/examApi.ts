
import axios from 'axios';
import { Question } from '@/data/sampleQuestions';

const API_URL = 'http://localhost:3001/api';
   const campusId = localStorage.getItem("campusId");
     const token = localStorage.getItem("token");
interface StartExamResponse {
  sessionId: string;
  questions: Question[];
}

interface SubmitExamResponse {
  score: number;
  totalQuestions: number;
  timeTaken: number;
}

export const examApi = {

  // Start a new exam and get questions
  startExam: async (examId: string) => {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/exam/campus/${campusId}/start/${examId}`, null,
       {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
    );
   return response.data.data;
  },

  getQuestions: async (examId: string) => {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/exam/campus/${campusId}/questions/${examId}`,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
    );
    return response.data.data;
  },
  
  // Submit exam answers
 submitExam: async (
  sessionId: string,
  answers: Record<string, string | null> ,
  examId: string
): Promise<SubmitExamResponse> => {
  const validAnswers = Object.entries(answers)
    .filter(([_, answer]) => answer !== null)
    .map(([questionId, answer]) => ({
      questionId,
      answerSelected: answer as string,
    }));

  const payload = {
    sessionId,
    answers: validAnswers,
  };

  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/exam/campus/${campusId}/end/${examId}`, 
    payload,
      {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
  );
  return response.data.data;
},

  
  // Get exam results (for demonstration purposes)
  getResults: async (sessionId: string) => {
    const response = await axios.get(`${API_URL}/results/${sessionId}`);
    return response.data;
  }
};
