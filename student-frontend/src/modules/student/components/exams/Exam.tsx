
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Timer } from "@/components/Timer";
import { NetworkStatus } from "@/components/NetworkStatus";
import { QuestionCard } from "@/components/QuestionCard";
import { QuestionNavigator } from "@/components/QuestionNavigator";
import { ExamStart } from "@/components/ExamStart";
import { TabSwitchWarning } from "@/components/TabSwitchWarning";
import { useExam, ExamProvider } from "@/contexts/ExamContext";
import { useVisibilityTracking } from "@/hooks/useVisibilityTracking";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, 
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { ExamResultsWrapper } from "@/components/ExamResultsWrapper";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ExamResultPage from "./ExamResultPage";

function ExamComponent({examId, duration, title, onClose}) {
  const { 
    questions, 
    currentQuestion, 
    answers, 
    timeLeft, 
    isExamStarted, 
    isExamFinished,
    startExam, 
    endExam, 
    setAnswer, 
    nextQuestion, 
    prevQuestion, 
    jumpToQuestion
  } = useExam();

  const { isHidden, tabSwitchCount } = useVisibilityTracking();
  const { isOnline, disconnectionTime, reconnectionCountdown } = useConnectionStatus(30);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [showNetworkWarning, setShowNetworkWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showExamResult, setShowExamResult] = useState(false);
  // Tab switching detection
  useEffect(() => {
    if (isExamStarted && !isExamFinished && isHidden) {
      setShowTabWarning(true);
    }
  }, [isHidden, isExamStarted, isExamFinished]);

  // Network status monitoring
  useEffect(() => {
    if (!isOnline && isExamStarted && !isExamFinished) {
      setShowNetworkWarning(true);
      toast({
        title: "Connection Lost",
        description: `Reconnect within ${reconnectionCountdown} seconds to continue the exam.`,
        variant: "destructive"
      });
    }

    if (isOnline && disconnectionTime && showNetworkWarning) {
      setShowNetworkWarning(false);
      toast({
        title: "Connection Restored",
        description: "You may continue your exam.",
        variant: "default"
      });
    }
  }, [isOnline, disconnectionTime, reconnectionCountdown, isExamStarted, isExamFinished, showNetworkWarning]);

  // Auto-submit if reconnection grace period expires
  useEffect(() => {
    if (!isOnline && reconnectionCountdown === 0 && isExamStarted && !isExamFinished) {
      toast({
        title: "Exam Terminated",
        description: "You were offline for too long. Exam has been submitted.",
        variant: "destructive"
      });
      endExam();
    }
  }, [isOnline, reconnectionCountdown, isExamStarted, isExamFinished, endExam]);

  // Handle tab switch warnings and termination
  const handleTabWarningClose = () => {
    setShowTabWarning(false);
  };

  const handleExcessTabSwitches = (examId) => {
    toast({
      title: "Exam Terminated",
      description: "Too many tab switches detected. This may be considered cheating.",
      variant: "destructive"
    });
    endExam(examId);
  };
  
  const handleStartExam = async (examId) => {
    setIsLoading(true);
    try {
      await startExam(examId);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEndExam = async (examId) => {
    setIsLoading(true);
    try {
      await endExam(examId);
      setShowExamResult(true);
    } finally {
      setIsLoading(false);
    }
  };

  // If not started or finished, show appropriate screens
  if (!isExamStarted) {
    return (
      <div className="flex items-center justify-center">
        <ExamStart 
          onStart={() => handleStartExam(examId)} 
          questionCount={10} 
          examDuration={duration} 
        />
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2">Loading exam questions from server...</p>
            </div>
          </div>
        )}
      </div>
    );
  }


  // will do later when i want to show result
  if (showExamResult) {
  
    return <ExamResultPage title={title} onClose={onClose}/>;
  }



  // Main exam interface
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      {/* Tab switching warning */}
      <TabSwitchWarning 
        isVisible={showTabWarning}
        tabSwitchCount={tabSwitchCount}
        onClose={handleTabWarningClose}
        onExceedLimit={() => handleExcessTabSwitches(examId)}
        maxAllowedSwitches={3}
      />
      
      {/* Network status indicator */}
      <div className={`fixed top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800 animate-pulse'}`}>
        {isOnline ? 'Online' : `Offline (${reconnectionCountdown}s)`}
      </div>
      
      {/* Network reconnect alert */}
      {!isOnline && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-red-600 mb-4">Connection Lost!</h2>
            <p>Your internet connection has been lost.</p>
            <div className="my-4">
              <p className="mb-1">Reconnect within: <span className="font-bold text-red-600">{reconnectionCountdown}s</span></p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-red-600 h-2.5 rounded-full animate-pulse-slow" 
                  style={{ width: `${(reconnectionCountdown/30)*100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Attempting to reconnect... If you don't reconnect within the time limit, your exam will be submitted automatically.
            </p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <Timer minutesLeft={duration} onTimeUp={() => handleEndExam(examId)} />
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Submit Exam</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will end your exam. You won't be able to make any further changes.
                
                <div className="mt-4 p-3 bg-yellow-50 rounded-md text-sm">
                  {questions.length > 0 && Object.keys(answers).length < questions.length && (
                    <p className="text-amber-600 font-medium">
                      Warning: You have {questions.length - Object.keys(answers).length} unanswered questions.
                    </p>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue Exam</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleEndExam(examId)} className="bg-destructive">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Submit Exam"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {questions.length > 0 ? (
<QuestionCard
  question={questions[currentQuestion]}
  currentAnswer={answers[questions[currentQuestion]?.id] ?? ""}
  onAnswerSelect={(optionId) => setAnswer(questions[currentQuestion].id, optionId)}
  onNext={nextQuestion}
  onPrev={prevQuestion}
  questionNumber={currentQuestion}
  totalQuestions={questions.length}
/>

      ) : (
        <div className="p-8 bg-white rounded-lg shadow text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Loading questions...</p>
        </div>
      )}
      
      <QuestionNavigator
        questionsCount={questions.length}
        currentQuestion={currentQuestion}
        answers={answers}
        onQuestionClick={jumpToQuestion}
      />
    </div>
  );
}

export default function Exam({examId, duration, title, onClose}) {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 flex flex-col">
      {/* <Header /> */}
      <div className="flex-grow">
        <ExamProvider>
          <ExamComponent examId={examId} duration={duration} title={title} onClose={onClose}/>
        </ExamProvider>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
