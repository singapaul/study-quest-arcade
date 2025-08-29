import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StudyCard, GameScore } from "@/types/study";
import { Target, Clock, Zap } from "lucide-react";

interface SplatGameProps {
  cards: StudyCard[];
  onComplete: (score: GameScore) => void;
}

export const SplatGame = ({ cards, onComplete }: SplatGameProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [allAnswers, setAllAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentCard = cards[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    // Generate a sea of answers (correct + random incorrect ones)
    if (currentCard) {
      const correctAnswer = currentCard.answer;
      const otherAnswers = cards
        .filter(c => c.id !== currentCard.id)
        .map(c => c.answer)
        .slice(0, 11); // Get 11 other answers
      
      const shuffled = [correctAnswer, ...otherAnswers]
        .sort(() => Math.random() - 0.5); // Randomize positions
      
      setAllAnswers(shuffled);
    }
  }, [currentCard, cards]);

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentCard.answer;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        const finalScore = {
          correct: score.correct + (isCorrect ? 1 : 0),
          total: cards.length,
          timeSpent
        };
        onComplete(finalScore);
      }
    }, 1500);
  };

  if (!currentCard) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Target className="w-7 h-7" />
            Splat Game
          </h2>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>{score.correct}/{score.total}</span>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground mb-2">
          Question {currentIndex + 1} of {cards.length}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Find the correct answer in the sea of options!
        </p>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-medium mb-6 text-center bg-primary/5 p-4 rounded-lg">
          {currentCard.question}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {allAnswers.map((answer, index) => {
            const isCorrect = answer === currentCard.answer;
            const isSelected = selectedAnswer === answer;
            
            return (
              <button
                key={`${answer}-${index}`}
                onClick={() => handleAnswerSelect(answer)}
                className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  showResult
                    ? isCorrect
                      ? 'border-success bg-success/20 text-success-foreground'
                      : isSelected
                      ? 'border-destructive bg-destructive/20 text-destructive-foreground'
                      : 'border-border bg-muted opacity-50'
                    : 'border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
                }`}
                disabled={showResult}
              >
                {answer}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-6 text-center">
            {selectedAnswer === currentCard.answer ? (
              <div className="text-success">
                <p className="font-medium">Correct! 🎉</p>
                <p className="text-sm opacity-90">Great job finding the right answer!</p>
              </div>
            ) : (
              <div className="text-destructive">
                <p className="font-medium">Not quite! 😔</p>
                <p className="text-sm opacity-90">The correct answer was: {currentCard.answer}</p>
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Score: {score.correct} / {score.total} • {currentIndex === cards.length - 1 ? 'Final Question!' : 'Keep going!'}
      </div>
    </div>
  );
};