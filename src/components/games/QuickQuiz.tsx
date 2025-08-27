import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuizQuestion, GameScore } from "@/types/study";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface QuickQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: GameScore) => void;
}

export const QuickQuiz = ({ questions, onComplete }: QuickQuizProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      setScore(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1
      }));

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        const finalScore = {
          correct: score.correct + (isCorrect ? 1 : 0),
          total: questions.length,
          timeSpent
        };
        onComplete(finalScore);
      }
    } else {
      setShowResult(true);
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setShowResult(false);
        } else {
          onComplete({ ...score, total: questions.length, timeSpent });
        }
      }, 2000);
    }
  };

  if (!currentQuestion) return null;

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary">Quick Quiz</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
        <p className="text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </p>
        <div className="w-full bg-muted rounded-full h-2 mt-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-medium mb-6">{currentQuestion.question}</h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedAnswer === index
                  ? showResult
                    ? index === currentQuestion.correctAnswer
                      ? 'border-success bg-success/10 text-success-foreground'
                      : 'border-destructive bg-destructive/10 text-destructive-foreground'
                    : 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50 hover:bg-primary/5'
              }`}
              disabled={showResult}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && (
                  <div className="flex items-center gap-2">
                    {index === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                    {selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {showResult && currentQuestion.explanation && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Explanation:</p>
            <p className="text-sm">{currentQuestion.explanation}</p>
          </div>
        )}
      </Card>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Score: {score.correct} / {score.total + (selectedAnswer !== null ? 1 : 0)}
        </div>
        
        <Button
          onClick={handleNext}
          disabled={selectedAnswer === null && !showResult}
        >
          {currentIndex === questions.length - 1 ? 'Complete Quiz' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};