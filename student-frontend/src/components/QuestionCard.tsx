
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Question {
  id: string; // from questionId
  question: string;
  options: string[]; // just the labels
  correctAnswer: number; // convert from "A"/"B" to 0/1/2/3
}

interface QuestionCardProps {
  question: Question;
  currentAnswer: number | null;
  onAnswerSelect: (optionId: string) => void;
  onNext: () => void;
  onPrev: () => void;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({
  question,
  currentAnswer,
  onAnswerSelect,
  onNext,
  onPrev,
  questionNumber,
  totalQuestions
}: QuestionCardProps) {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="px-2 py-1">
            Question {questionNumber + 1}/{totalQuestions}
          </Badge>
          <Badge 
            variant={currentAnswer !== null ? "default" : "outline"}
            className={`${currentAnswer !== null ? "bg-green-100 text-green-800 hover:bg-green-100" : "text-gray-500"}`}
          >
            {currentAnswer !== null ? "Answered" : "Not Answered"}
          </Badge>
        </div>
        <CardTitle className="text-xl mt-2">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
<RadioGroup
  value={currentAnswer ?? ""}
  onValueChange={(value) => onAnswerSelect(value)}
>
         {question.options.map((option, index) => (
  <div key={index} className="flex items-center space-x-2 mb-3 p-2 rounded-lg hover:bg-gray-50">
    <RadioGroupItem value={option.id} id={`option-${index}`} />
    <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer py-1">
      {option.option}
    </Label>
  </div>
))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrev}
          disabled={questionNumber === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button 
          onClick={onNext}
          disabled={questionNumber === totalQuestions - 1}
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
