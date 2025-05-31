
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, 
  AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface TimerProps {
  secondsLeft: number;
  onTimeUp: () => void;
}

export function Timer({ secondsLeft, onTimeUp }: TimerProps) {
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Format seconds into MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get color based on time remaining
  const getTimerColor = (seconds: number): string => {
    if (seconds <= 60) return "text-red-500"; // Last minute
    if (seconds <= 300) return "text-amber-500"; // Last 5 minutes
    return "text-green-600"; // More than 5 minutes
  };

  useEffect(() => {
    if (secondsLeft <= 300 && secondsLeft > 295 && !showTimeWarning) {
      // Show 5 minute warning
      setShowTimeWarning(true);
    }

    if (secondsLeft <= 60 && secondsLeft > 55 && !showTimeWarning) {
      // Show 1 minute warning
      setShowTimeWarning(true);
    }

    if (secondsLeft === 0 && !isTimeUp) {
      setIsTimeUp(true);
    }
  }, [secondsLeft, showTimeWarning, isTimeUp]);

  return (
    <>
      <div className="flex items-center gap-2 text-lg font-semibold">
        <span>Time Remaining:</span>
        <span className={getTimerColor(secondsLeft)}>
          {formatTime(secondsLeft)}
        </span>
      </div>

      <AlertDialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time Warning</AlertDialogTitle>
            <AlertDialogDescription>
              {secondsLeft <= 60 
                ? "Only 1 minute remaining! Please finalize your answers."
                : "Only 5 minutes remaining! Please start reviewing your answers."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Acknowledge</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isTimeUp} onOpenChange={(open) => {
        if (!open) {
          setIsTimeUp(false);
          onTimeUp();
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time's Up!</AlertDialogTitle>
            <AlertDialogDescription>
              Your exam time has expired. Your answers will be submitted automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={onTimeUp} variant="destructive">
              Submit Exam
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
