
import { ExamResults as ExamResultsOriginal } from "./ExamResults";
import { useExam } from "@/contexts/ExamContext";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export const ExamResultsWrapper = () => {
  const { questions, answers, examResults, startExam, getScore } = useExam();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRestart = async () => {
    setIsLoading(true);
    try {
      await startExam();
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!examResults) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Processing Results</h2>
        <Loader2 className="animate-spin h-8 w-8 mx-auto" />
        <p className="mt-4">Please wait while we calculate your score...</p>
      </div>
    );
  }

  return (
    <div>
      <ExamResultsOriginal 
        questions={questions} 
        answers={answers} 
        score={examResults.score.score}
        onRestart={handleRestart}
      />
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Time taken: {Math.floor(examResults.timeTaken / 60)}:{(examResults.timeTaken % 60).toString().padStart(2, '0')}</p>
        <p>Results have been saved on the server</p>
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center mt-4 gap-2">
          <Loader2 className="animate-spin h-4 w-4" />
          <span>Loading new exam...</span>
        </div>
      )}
    </div>
  );
};
