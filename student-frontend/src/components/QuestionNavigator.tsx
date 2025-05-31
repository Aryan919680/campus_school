
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface QuestionNavigatorProps {
  questionsCount: number;
  currentQuestion: number;
  answers: Record<number, number | null>;
  onQuestionClick: (index: number) => void;
}

export function QuestionNavigator({
  questionsCount,
  currentQuestion,
  answers,
  onQuestionClick
}: QuestionNavigatorProps) {
  return (
    <Card className="p-4 w-full max-w-3xl">
      <h3 className="font-semibold mb-2 text-sm text-gray-700">Question Navigator</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: questionsCount }).map((_, index) => {
          const questionId = index + 1;
          const isAnswered = answers[questionId] !== undefined;
          const isCurrent = currentQuestion === index;
          
          return (
            <Button
              key={index}
              variant={isCurrent ? "default" : isAnswered ? "outline" : "secondary"}
              onClick={() => onQuestionClick(index)}
              className={`w-full h-10 p-0 ${isAnswered ? "border-green-500" : ""}`}
            >
              {index + 1}
              {isAnswered && (
                <span className="ml-1 w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              )}
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
