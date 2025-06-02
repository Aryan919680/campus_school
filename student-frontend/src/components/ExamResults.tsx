
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface Option {
  id: string;
  option: string;
}

interface Question {
  id: string; // was number
  question: string;
  options: Option[];
  correctAnswer: string; // was number
}

interface ExamResultsProps {
  questions: Question[];
  answers: Record<string, string | null>; // was number
  score: number;
  onRestart: () => void;
}


export function ExamResults({ questions, answers, score, onRestart }: ExamResultsProps) {
  const percentage = Math.round((score / questions.length) * 100);
  const isPassed = percentage >= 60;

  return (
    <div className="w-full max-w-3xl space-y-6">
      <Card>
        <CardHeader className={`text-center ${isPassed ? 'bg-green-50' : 'bg-red-50'} rounded-t-lg`}>
          <CardTitle className="text-2xl">
            {isPassed ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle /> Exam Passed!
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-red-600">
                <XCircle /> Exam Failed
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {percentage}%
                </span>
              </div>
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#e6e6e6" 
                  strokeWidth="8" 
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke={isPassed ? "#22c55e" : "#ef4444"} 
                  strokeWidth="8" 
                  strokeDasharray={`${percentage * 2.83} 283`} 
                  strokeDashoffset="0" 
                  transform="rotate(-90 50 50)" 
                />
              </svg>
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg">
                Your score: <span className="font-semibold">{score}/{questions.length}</span>
              </p>
              <p className="text-sm text-gray-500">
                Passing score: 60%
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onRestart}>Take Another Exam</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Question Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
      {questions.map((question, index) => {
  const userAnswer = answers[question.id];
  const isCorrect = userAnswer === question.correctAnswer;

  return (
    <div key={question.id} className="border-b pb-4 last:border-b-0 last:pb-0">
      <div className="flex justify-between">
        <h3 className="font-medium">Question {index + 1}</h3>
        {userAnswer !== null ? (
          isCorrect ? (
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" /> Correct
            </span>
          ) : (
            <span className="text-red-600 flex items-center gap-1">
              <XCircle className="h-4 w-4" /> Incorrect
            </span>
          )
        ) : (
          <span className="text-gray-400">Not answered</span>
        )}
      </div>

      <p className="mt-1">{question.question}</p>

      <div className="mt-2 space-y-1">
        {question.options.map((option) => {
          const isCorrectOption = option.id === question.correctAnswer;
          const isUserAnswer = option.id === userAnswer;

          return (
            <div 
              key={option.id}
              className={`px-3 py-2 text-sm rounded-md ${
                isCorrectOption
                  ? 'bg-green-100 text-green-800'
                  : isUserAnswer
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-50'
              }`}
            >
              {option.option}
              {isCorrectOption && (
                <span className="ml-2 text-green-600 text-xs">(Correct answer)</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
})}


        </CardContent>
      </Card>
    </div>
  );
}
