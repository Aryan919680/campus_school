
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
    console.log(examId)
    // const response = await axios.post(`${API_URL}/start-exam`);
    // return response.data;
  },

  getQuestions: async (examId: string) => {
    console.log(examId)
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/exam/campus/${campusId}/questions/${examId}`,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
    );
    console.log(response.data)
    return response.data.data;
  },
  
  // Submit exam answers
  submitExam: async (sessionId: string, answers: Record<number, number | null>): Promise<SubmitExamResponse> => {
    // Filter out null answers
    const validAnswers: Record<number, number> = {};
    Object.entries(answers).forEach(([questionId, answer]) => {
      if (answer !== null) {
        validAnswers[parseInt(questionId)] = answer;
      }
    });
    
    const response = await axios.post(`${API_URL}/submit-exam`, { 
      sessionId, 
      answers: validAnswers 
    });
    return response.data;
  },
  
  // Get exam results (for demonstration purposes)
  getResults: async (sessionId: string) => {
    const response = await axios.get(`${API_URL}/results/${sessionId}`);
    return response.data;
  }
};
