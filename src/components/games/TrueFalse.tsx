import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StudyCard, GameScore } from "@/types/study";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface TrueFalseProps {
  cards: StudyCard[];
  onComplete: (score: GameScore) => void;
}

export const TrueFalse = ({ cards, onComplete }: TrueFalseProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [questions, setQuestions] = useState<Array<{ question: string; isTrue: boolean; explanation: string }>>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    // Generate true/false questions from study cards
    const trueFalseQuestions = cards.slice(0, 10).map(card => {
      const shouldBeTrue = Math.random() > 0.5;
      
      if (shouldBeTrue) {
        return {
          question: `True or False: ${card.question} - ${card.answer}`,
          isTrue: true,
          explanation: `Correct! ${card.answer} is the right answer to "${card.question}"`
        };
      } else {
        // Create a false statement by using a wrong answer
        const wrongAnswer = cards.find(c => c.id !== card.id)?.answer || "incorrect answer";
        return {
          question: `True or False: ${card.question} - ${wrongAnswer}`,
          isTrue: false,
          explanation: `False! The correct answer to "${card.question}" is "${card.answer}", not "${wrongAnswer}"`
        };
      }
    });
    
    setQuestions(trueFalseQuestions);
  }, [cards]);

  const currentQuestion = questions[currentIndex];

  const handleAnswerSelect = (answer: boolean) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const isCorrect = selectedAnswer === currentQuestion.isTrue;
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

  const isCorrect = selectedAnswer === currentQuestion.isTrue;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary">True or False</h2>
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
        <h3 className="text-xl font-medium mb-8 text-center leading-relaxed">
          {currentQuestion.question}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswerSelect(true)}
            className={`p-6 text-center rounded-lg border-2 font-semibold text-lg transition-all duration-200 ${
              selectedAnswer === true
                ? showResult
                  ? currentQuestion.isTrue
                    ? 'border-success bg-success/10 text-success'
                    : 'border-destructive bg-destructive/10 text-destructive'
                  : 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-success/50 hover:bg-success/5 text-success'
            }`}
            disabled={showResult}
          >
            <div className="flex items-center justify-center gap-2">
              <span>TRUE</span>
              {showResult && selectedAnswer === true && (
                currentQuestion.isTrue ? 
                  <CheckCircle className="w-5 h-5" /> : 
                  <XCircle className="w-5 h-5" />
              )}
              {showResult && currentQuestion.isTrue && selectedAnswer !== true && (
                <CheckCircle className="w-5 h-5 text-success" />
              )}
            </div>
          </button>

          <button
            onClick={() => handleAnswerSelect(false)}
            className={`p-6 text-center rounded-lg border-2 font-semibold text-lg transition-all duration-200 ${
              selectedAnswer === false
                ? showResult
                  ? !currentQuestion.isTrue
                    ? 'border-success bg-success/10 text-success'
                    : 'border-destructive bg-destructive/10 text-destructive'
                  : 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-destructive/50 hover:bg-destructive/5 text-destructive'
            }`}
            disabled={showResult}
          >
            <div className="flex items-center justify-center gap-2">
              <span>FALSE</span>
              {showResult && selectedAnswer === false && (
                !currentQuestion.isTrue ? 
                  <CheckCircle className="w-5 h-5" /> : 
                  <XCircle className="w-5 h-5" />
              )}
              {showResult && !currentQuestion.isTrue && selectedAnswer !== false && (
                <CheckCircle className="w-5 h-5 text-success" />
              )}
            </div>
          </button>
        </div>

        {showResult && (
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