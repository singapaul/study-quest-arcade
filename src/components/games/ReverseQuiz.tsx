import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StudyCard, GameScore } from "@/types/study";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

interface ReverseQuizProps {
  cards: StudyCard[];
  onComplete: (score: GameScore) => void;
}

export const ReverseQuiz = ({ cards, onComplete }: ReverseQuizProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());
  const [questions, setQuestions] = useState<Array<{
    answer: string;
    options: string[];
    correctIndex: number;
  }>>([]);

  useEffect(() => {
    // Generate questions by showing answers and asking for questions
    const gameQuestions = cards.slice(0, 10).map(card => {
      const incorrectQuestions = cards
        .filter(c => c.id !== card.id)
        .slice(0, 3)
        .map(c => c.question);
      
      const options = [card.question, ...incorrectQuestions].sort(() => Math.random() - 0.5);
      
      return {
        answer: card.answer,
        options,
        correctIndex: options.indexOf(card.question)
      };
    });
    
    setQuestions(gameQuestions);
  }, [cards]);

  const handleAnswer = (optionIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(optionIndex);
    setShowResult(true);
    
    const isCorrect = optionIndex === questions[currentIndex].correctIndex;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        const finalScore = {
          correct: score.correct + (isCorrect ? 1 : 0),
          total: score.total + 1,
          timeSpent: Math.round((Date.now() - startTime) / 1000)
        };
        onComplete(finalScore);
      } else {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 1500);
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Reverse Quiz</h2>
          <div className="text-sm text-muted-foreground">
            {score.correct}/{score.total} correct
          </div>
        </div>
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          Question {currentIndex + 1} of {questions.length}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-center text-primary">
            Which question matches this answer?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 bg-accent/10 rounded-lg border-2 border-accent/20 mb-6">
            <p className="text-xl font-semibold">{currentQuestion.answer}</p>
          </div>

          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => {
              let variant = "outline";
              let icon = null;
              
              if (showResult && selectedAnswer !== null) {
                if (index === currentQuestion.correctIndex) {
                  variant = "default";
                  icon = <CheckCircle className="w-4 h-4 text-green-500" />;
                } else if (index === selectedAnswer) {
                  variant = "destructive";
                  icon = <XCircle className="w-4 h-4 text-red-500" />;
                }
              }

              return (
                <Button
                  key={index}
                  variant={variant as any}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className="justify-start h-auto p-4 text-left"
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="flex-1">{option}</span>
                    {icon}
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Look at the answer and choose the correct question!
        </p>
      </div>
    </div>
  );
};