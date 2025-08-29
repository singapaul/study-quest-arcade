import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StudyCard, GameScore } from "@/types/study";
import { Heart, X, Clock, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface SwipeGameProps {
  cards: StudyCard[];
  onComplete: (score: GameScore) => void;
}

export const SwipeGame = ({ cards, onComplete }: SwipeGameProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [showAnswer, setShowAnswer] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentCard = cards[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleSwipe = (direction: 'left' | 'right', isCorrect: boolean) => {
    if (isAnimating) return;
    
    setSwipeDirection(direction);
    setIsAnimating(true);
    
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setShowAnswer(false);
        setSwipeDirection(null);
        setIsAnimating(false);
      } else {
        const finalScore = {
          correct: score.correct + (isCorrect ? 1 : 0),
          total: cards.length,
          timeSpent
        };
        onComplete(finalScore);
      }
    }, 500);
  };

  const toggleCard = () => {
    if (!isAnimating) {
      setShowAnswer(!showAnswer);
    }
  };

  if (!currentCard) return null;

  const getCardTransform = () => {
    if (swipeDirection === 'left') return 'translateX(-100%) rotate(-30deg)';
    if (swipeDirection === 'right') return 'translateX(100%) rotate(30deg)';
    return 'translateX(0) rotate(0deg)';
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Heart className="w-7 h-7" />
            Swipe Study
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
        <p className="text-muted-foreground mb-2">
          Card {currentIndex + 1} of {cards.length}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Swipe ❌ if you need more practice, ✅ if you know it well!
        </p>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative h-96 perspective-1000">
        <Card 
          className={`absolute inset-0 cursor-pointer transition-all duration-500 ${
            showAnswer ? 'transform rotateY-180' : ''
          }`}
          style={{
            transform: `${getCardTransform()} ${showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)'}`,
            transition: isAnimating ? 'transform 0.5s ease-out' : 'transform 0.3s ease'
          }}
          onClick={toggleCard}
        >
          <div className="h-full p-8 flex items-center justify-center text-center">
            {!showAnswer ? (
              <div className="backface-hidden">
                <p className="text-lg font-medium mb-4 text-primary">Question</p>
                <p className="text-xl mb-6">{currentCard.question}</p>
                <p className="text-sm text-muted-foreground">Tap to reveal answer</p>
              </div>
            ) : (
              <div className="backface-hidden transform rotateY-180">
                <p className="text-lg font-medium mb-4 text-accent">Answer</p>
                <p className="text-xl mb-6">{currentCard.answer}</p>
                <p className="text-sm text-muted-foreground">Now swipe based on your knowledge!</p>
              </div>
            )}
          </div>
        </Card>

        {/* Swipe indicators */}
        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 ${
          swipeDirection === 'left' ? 'opacity-100' : 'opacity-30'
        }`}>
          <div className="bg-destructive text-destructive-foreground p-3 rounded-full">
            <X className="w-8 h-8" />
          </div>
        </div>
        
        <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 ${
          swipeDirection === 'right' ? 'opacity-100' : 'opacity-30'
        }`}>
          <div className="bg-success text-success-foreground p-3 rounded-full">
            <Heart className="w-8 h-8" />
          </div>
        </div>
      </div>

      {showAnswer && !isAnimating && (
        <div className="flex justify-center gap-6">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleSwipe('left', false)}
            className="flex items-center gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <X className="w-5 h-5" />
            Need Practice
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleSwipe('right', true)}
            className="flex items-center gap-2 border-success/50 text-success hover:bg-success/10"
          >
            <Heart className="w-5 h-5" />
            Know It Well
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={toggleCard}
          className="flex items-center gap-2"
          disabled={isAnimating}
        >
          <RotateCcw className="w-4 h-4" />
          Flip Card
        </Button>
        
        <div className="text-sm text-muted-foreground">
          Score: {score.correct} / {score.total}
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        💡 Tip: Be honest about your knowledge level to get the most out of your study session!
      </div>
    </div>
  );
};