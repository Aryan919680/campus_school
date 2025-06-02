
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Question } from "@/data/sampleQuestions";
import { examApi } from "@/services/examApi";
import { response } from "express";

interface ExamContextType {
  questions: Question[];
  currentQuestion: number;
 answers: Record<string, string>; // questionId -> optionId (e.g., "q123": "B")
  timeLeft: number;
  isExamStarted: boolean;
  isExamFinished: boolean;
  disconnectionTime: number | null;
  tabSwitchCount: number;
  sessionId: string | null;
  examResults: ExamResults | null;
  startExam: () => Promise<void>;
  endExam: () => Promise<void>;
  setAnswer: (questionId: string, optionId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  handleVisibilityChange: () => void;
  handleConnectionChange: (isOnline: boolean) => void;
  resetDisconnectionTime: () => void;
  getScore: () => number;
}

interface ExamResults {
  score: number;
  totalQuestions: number;
  timeTaken: number;
}

const EXAM_DURATION = 10 * 60; // 10 minutes in seconds
const RECONNECTION_GRACE_PERIOD = 30; // 30 seconds

const ExamContext = createContext<ExamContextType | null>(null);

export const ExamProvider = ({ children }: { children: ReactNode }) => {
  const [isExamStarted, setIsExamStarted] = useState<boolean>(false);
  const [isExamFinished, setIsExamFinished] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [timeLeft, setTimeLeft] = useState<number>(EXAM_DURATION);
  const [disconnectionTime, setDisconnectionTime] = useState<number | null>(null);
  const [tabSwitchCount, setTabSwitchCount] = useState<number>(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [examResults, setExamResults] = useState<ExamResults | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Timer effect
  useEffect(() => {
    let timer: number | undefined;
    if (isExamStarted && !isExamFinished) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            endExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isExamStarted, isExamFinished]);

  const startExam = async (examId) => {
    try {
      setIsLoading(true);
      // Reset the state
      setAnswers({});
      setCurrentQuestion(0);
      setTabSwitchCount(0);
      setDisconnectionTime(null);
      
      // Get questions from the server
      const data = await examApi.startExam(examId);
     const quesData = await examApi.getQuestions(examId);

// Convert quesData to internal Question[]
const formattedQuestions: Question[] = quesData.map((q) => ({
  id: q.questionId,
  question: q.question,
  options: q.options.map((opt) => ({
    id: opt.id, // e.g., "A", "B", "C"
    option: opt.option
  })),
  correctAnswer: q.answer // This is already the option ID (like "A")
}));


setQuestions(formattedQuestions);

      setSessionId(data.sessionId);
      
      // Start the exam
      setTimeLeft(EXAM_DURATION);
      setIsExamStarted(true);
      setIsExamFinished(false);
      setExamResults(null);
      
      toast({
        title: "Exam Started",
        description: "Good luck with your exam!",
      });
    } catch (error) {
      console.error("Failed to start exam:", error.response.data.message);
      alert(error.response.data.message)
      toast({
        title: "Failed to Start Exam",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endExam = async (examId) => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "Invalid exam session",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      // Submit answers to the server
      const results = await examApi.submitExam(sessionId, answers, examId);
      
      // Update the state
      setIsExamFinished(true);
      setExamResults(results);
      alert(`Exam Submitted and your score is ${results.score}`)
      toast({
        title: "Exam Submitted",
        description: `Your score: ${results.score}`,
      });
    } catch (error) {
      console.error("Failed to submit exam:", error.response.data.message);
         alert(`Failed to submit exam:`, error.response.data.message);
      // Still mark the exam as finished even if submission fails
      setIsExamFinished(true);
      
      toast({
        title: "Failed to Submit Exam",
        description: "Please check your internet connection, but your exam has been marked as finished.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

const setAnswer = (questionId: string, optionId: string) => {
  setAnswers((prev) => ({
    ...prev,
    [questionId]: optionId
  }));
};


  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestion(index);
    }
  };

  const handleVisibilityChange = () => {
    if (isExamStarted && !isExamFinished && document.visibilityState === "hidden") {
      setTabSwitchCount(prev => prev + 1);
      toast({
        title: "Warning!",
        description: `Tab switch detected (#${tabSwitchCount + 1}). Multiple violations may result in exam termination.`,
        variant: "destructive"
      });
    }
  };

  const handleConnectionChange = (isOnline: boolean) => {
    if (!isOnline && isExamStarted && !isExamFinished) {
      setDisconnectionTime(Date.now());
      toast({
        title: "Connection Lost",
        description: "You are offline. Reconnect within 30 seconds to continue the exam.",
        variant: "destructive"
      });
    } else if (isOnline && disconnectionTime) {
      const reconnectionTime = Date.now();
      const disconnectionDuration = (reconnectionTime - disconnectionTime) / 1000;
      
      if (disconnectionDuration <= RECONNECTION_GRACE_PERIOD) {
        toast({
          title: "Connection Restored",
          description: `You were offline for ${Math.round(disconnectionDuration)} seconds. You may continue the exam.`,
          variant: "default"
        });
        setDisconnectionTime(null);
      } else {
        toast({
          title: "Exam Terminated",
          description: `You were offline for too long (${Math.round(disconnectionDuration)} seconds). Exam has been submitted.`,
          variant: "destructive"
        });
        endExam();
      }
    }
  };

  const resetDisconnectionTime = () => {
    setDisconnectionTime(null);
  };

 const getScore = () => {
  let score = 0;
  questions.forEach((q) => {
    if (answers[q.id] === q.answer) {
      score += 1;
    }
  });
  return score;
};



  return (
    <ExamContext.Provider
      value={{
        questions,
        currentQuestion,
        answers,
        timeLeft,
        isExamStarted,
        isExamFinished,
        disconnectionTime,
        tabSwitchCount,
        sessionId,
        examResults,
        startExam,
        endExam,
        setAnswer,
        nextQuestion,
        prevQuestion,
        jumpToQuestion,
        handleVisibilityChange,
        handleConnectionChange,
        resetDisconnectionTime,
        getScore
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExam must be used within an ExamProvider");
  }
  return context;
};
