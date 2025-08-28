import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StudyCard, GameScore } from "@/types/study";
import { CheckCircle, XCircle, FolderOpen, Shuffle } from "lucide-react";

interface CategorySortProps {
  cards: StudyCard[];
  onComplete: (score: GameScore) => void;
}

export const CategorySort = ({ cards, onComplete }: CategorySortProps) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  const [gameRounds, setGameRounds] = useState<Array<{
    targetCategory: string;
    cards: StudyCard[];
    correctCards: string[];
  }>>([]);

  useEffect(() => {
    // Group cards by category and create game rounds
    const categorizedCards = cards.filter(card => card.category);
    const categoryGroups = categorizedCards.reduce((groups, card) => {
      const category = card.category!;
      if (!groups[category]) groups[category] = [];
      groups[category].push(card);
      return groups;
    }, {} as Record<string, StudyCard[]>);

    // Create rounds - each round asks to select cards from a specific category
    const rounds = Object.entries(categoryGroups)
      .filter(([_, categoryCards]) => categoryCards.length >= 2)
      .slice(0, 5) // Max 5 rounds
      .map(([category, categoryCards]) => {
        // Get some cards from this category
        const correctCards = categoryCards.slice(0, Math.min(3, categoryCards.length));
        
        // Get some cards from other categories as distractors
        const otherCards = categorizedCards
          .filter(card => card.category !== category)
          .slice(0, 4);
        
        // Combine and shuffle
        const allCards = [...correctCards, ...otherCards].sort(() => Math.random() - 0.5);
        
        return {
          targetCategory: category,
          cards: allCards,
          correctCards: correctCards.map(card => card.id)
        };
      });

    setGameRounds(rounds);
  }, [cards]);

  const handleCardClick = (cardId: string) => {
    if (showResult) return;

    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const submitAnswer = () => {
    const currentRoundData = gameRounds[currentRound];
    const correctCardIds = new Set(currentRoundData.correctCards);
    const selectedCardIds = new Set(selectedCards);
    
    // Check if selected cards exactly match the correct cards
    const isRoundCorrect = 
      correctCardIds.size === selectedCardIds.size &&
      [...correctCardIds].every(id => selectedCardIds.has(id));
    
    setIsCorrect(isRoundCorrect);
    setShowResult(true);
    setScore(prev => ({
      correct: prev.correct + (isRoundCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    setTimeout(() => {
      if (currentRound + 1 >= gameRounds.length) {
        const finalScore = {
          correct: score.correct + (isRoundCorrect ? 1 : 0),
          total: score.total + 1,
          timeSpent: Math.round((Date.now() - startTime) / 1000)
        };
        onComplete(finalScore);
      } else {
        setCurrentRound(prev => prev + 1);
        setSelectedCards([]);
        setShowResult(false);
        setIsCorrect(false);
      }
    }, 2500);
  };

  if (gameRounds.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No categories found</h3>
        <p className="text-muted-foreground mb-4">
          You need study cards with categories to play this game.
        </p>
        <p className="text-sm text-muted-foreground">
          Add categories to your study cards in the manage section to unlock this game.
        </p>
      </div>
    );
  }

  const currentRoundData = gameRounds[currentRound];
  const progress = ((currentRound + (showResult ? 1 : 0)) / gameRounds.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Category Sort</h2>
          <div className="text-sm text-muted-foreground">
            {score.correct}/{score.total} correct
          </div>
        </div>
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          Round {currentRound + 1} of {gameRounds.length}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Select all cards from category: 
            <span className="text-primary">{currentRoundData.targetCategory}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3 mb-6">
            {currentRoundData.cards.map((card) => {
              const isSelected = selectedCards.includes(card.id);
              const isCorrect = currentRoundData.correctCards.includes(card.id);
              
              let cardVariant = "outline";
              let borderClass = "";
              
              if (showResult) {
                if (isCorrect && isSelected) {
                  cardVariant = "default";
                  borderClass = "border-green-500 bg-green-50";
                } else if (isCorrect && !isSelected) {
                  borderClass = "border-green-500 bg-green-50";
                } else if (!isCorrect && isSelected) {
                  borderClass = "border-red-500 bg-red-50";
                }
              } else if (isSelected) {
                cardVariant = "default";
              }

              return (
                <Card
                  key={card.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${borderClass} ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleCardClick(card.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">{card.question}</p>
                        <p className="text-muted-foreground text-xs">{card.answer}</p>
                        <p className="text-primary text-xs mt-1">
                          Category: {card.category}
                        </p>
                      </div>
                      {showResult && (
                        <div className="flex-shrink-0">
                          {isCorrect && isSelected && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          {isCorrect && !isSelected && (
                            <XCircle className="w-5 h-5 text-orange-500" />
                          )}
                          {!isCorrect && isSelected && (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {showResult && (
            <div className={`text-center p-4 rounded-lg mb-4 ${
              isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="font-semibold">
                  {isCorrect ? 'Perfect sorting!' : 'Not quite right'}
                </span>
              </div>
              <p className="text-sm">
                {isCorrect ? 
                  `You correctly identified all cards in the "${currentRoundData.targetCategory}" category!` :
                  `You selected ${selectedCards.length} cards, but there were ${currentRoundData.correctCards.length} cards in the "${currentRoundData.targetCategory}" category.`
                }
              </p>
            </div>
          )}

          {!showResult && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Selected: {selectedCards.length} cards
              </p>
              <Button
                onClick={submitAnswer}
                disabled={selectedCards.length === 0}
                size="lg"
              >
                Submit Selection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};