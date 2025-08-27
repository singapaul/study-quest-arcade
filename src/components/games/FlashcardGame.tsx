import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StudyCard } from "@/types/study";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

interface FlashcardGameProps {
  cards: StudyCard[];
  onComplete: (score?: { correct: number; total: number; timeSpent: number }) => void;
}

export const FlashcardGame = ({ cards, onComplete }: FlashcardGameProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<Set<number>>(new Set());

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setReviewedCards(prev => new Set([...prev, currentIndex]));
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      onComplete({
        correct: reviewedCards.size + 1,
        total: cards.length,
        timeSpent: 0
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (!currentCard) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Flashcards</h2>
        <p className="text-muted-foreground">
          Card {currentIndex + 1} of {cards.length}
        </p>
        <div className="w-full bg-muted rounded-full h-2 mt-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <div 
        className="relative h-80 cursor-pointer"
        onClick={handleFlip}
      >
        <Card className={`absolute inset-0 p-8 flex items-center justify-center text-center transition-all duration-500 ${
          isFlipped ? 'transform rotateY-180 opacity-0' : 'transform rotateY-0 opacity-100'
        }`}>
          <div>
            <p className="text-lg font-medium mb-4">Question</p>
            <p className="text-xl">{currentCard.question}</p>
            <p className="text-sm text-muted-foreground mt-6">Click to reveal answer</p>
          </div>
        </Card>

        <Card className={`absolute inset-0 p-8 flex items-center justify-center text-center bg-secondary transition-all duration-500 ${
          isFlipped ? 'transform rotateY-0 opacity-100' : 'transform rotateY-180 opacity-0'
        }`}>
          <div>
            <p className="text-lg font-medium mb-4 text-secondary-foreground">Answer</p>
            <p className="text-xl text-secondary-foreground">{currentCard.answer}</p>
            <p className="text-sm text-secondary-foreground/70 mt-6">Click to flip back</p>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <Button
          variant="outline"
          onClick={handleFlip}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Flip Card
        </Button>

        <Button
          onClick={handleNext}
          className="flex items-center gap-2"
        >
          {currentIndex === cards.length - 1 ? 'Complete' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Reviewed: {reviewedCards.size} / {cards.length} cards
      </div>
    </div>
  );
};