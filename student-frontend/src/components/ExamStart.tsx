
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface ExamStartProps {
  onStart: () => void;
  questionCount: number;
  examDuration: number;
}

export function ExamStart({ onStart, questionCount, examDuration }: ExamStartProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  return (
    <Card className="w-full max-w-2xl ">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Exam</CardTitle>
        <CardDescription>Please read the instructions carefully before starting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Exam Details</h3>
          <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
            {/* <li>Number of Questions: <span className="font-medium">{questionCount}</span></li> */}
            <li>Time Limit: <span className="font-medium">{examDuration} minutes</span></li>
            <li>Passing Score: <span className="font-medium">60%</span></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Important Rules:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>You must complete the exam within the allocated time.</li>
            <li><span className="font-medium text-red-600">Do not switch browser tabs or windows</span> during the exam.</li>
            <li>In case of internet disconnection, you have <span className="font-medium">30 seconds</span> to reconnect.</li>
            <li>Answer all questions to maximize your score.</li>
          </ul>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
          <label 
            htmlFor="terms" 
            className="text-sm text-gray-700 leading-tight cursor-pointer"
          >
            I understand the exam rules and agree not to use unauthorized resources
          </label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="lg" disabled={!agreedToTerms}>
              Start Exam
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you ready to begin?</AlertDialogTitle>
              <AlertDialogDescription>
                The timer will start immediately and you will have {examDuration} minutes to complete the exam.
                Make sure you have a stable internet connection and won't be disturbed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Not yet</AlertDialogCancel>
              <AlertDialogAction onClick={onStart}>Start Now</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
