import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface TimerProps {
  minutesLeft: number;
  onTimeUp: () => void;
}

export function Timer({ minutesLeft, onTimeUp }: TimerProps) {
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Format time as MM:00
  const formatTime = (minutes: number): string => {
    return `${minutes.toString().padStart(2, "0")}:00`;
  };

  // Get color based on time remaining
  const getTimerColor = (minutes: number): string => {
    if (minutes <= 1) return "text-red-500";     // Last 1 minute
    if (minutes <= 5) return "text-amber-500";   // Last 5 minutes
    return "text-green-600";                     // More than 5 minutes
  };

  useEffect(() => {
    if ((minutesLeft === 5 || minutesLeft === 1) && !showTimeWarning) {
      setShowTimeWarning(true);
    }

    if (minutesLeft === 0 && !isTimeUp) {
      setIsTimeUp(true);
    }
  }, [minutesLeft, showTimeWarning, isTimeUp]);

  return (
    <>
      <div className="flex items-center gap-2 text-lg font-semibold">
        <span>Time Remaining:</span>
        <span className={getTimerColor(minutesLeft)}>
          {formatTime(minutesLeft)}
        </span>
      </div>

      <AlertDialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time Warning</AlertDialogTitle>
            <AlertDialogDescription>
              {minutesLeft <= 1
                ? "Only 1 minute remaining! Please finalize your answers."
                : "Only 5 minutes remaining! Please start reviewing your answers."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Acknowledge</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isTimeUp}
        onOpenChange={(open) => {
          if (!open) {
            setIsTimeUp(false);
            onTimeUp();
          }
        }}
      >
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
