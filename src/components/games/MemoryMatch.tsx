import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StudyCard, GameScore } from "@/types/study";
import { Shuffle, RotateCcw } from "lucide-react";

interface MemoryCard {
  id: string;
  content: string;
  type: 'question' | 'answer';
  matchId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchProps {
  cards: StudyCard[];
  onComplete: (score: GameScore) => void;
}

export const MemoryMatch = ({ cards, onComplete }: MemoryMatchProps) => {
  const [gameCards, setGameCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<MemoryCard[]>([]);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());

  const initializeGame = () => {
    const memoryCards: MemoryCard[] = [];
    
    cards.slice(0, 6).forEach((card) => {
      memoryCards.push({
        id: `q-${card.id}`,
        content: card.question,
        type: 'question',
        matchId: card.id,
        isFlipped: false,
        isMatched: false
      });
      
      memoryCards.push({
        id: `a-${card.id}`,
        content: card.answer,
        type: 'answer',
        matchId: card.id,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle the cards
    const shuffled = memoryCards.sort(() => Math.random() - 0.5);
    setGameCards(shuffled);
    setFlippedCards([]);
    setMatches(0);
    setAttempts(0);
  };

  useEffect(() => {
    initializeGame();
  }, [cards]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setAttempts(prev => prev + 1);
      
      if (flippedCards[0].matchId === flippedCards[1].matchId) {
        // Match found
        setGameCards(prev => prev.map(card => 
          card.matchId === flippedCards[0].matchId 
            ? { ...card, isMatched: true }
            : card
        ));
        setMatches(prev => prev + 1);
        setFlippedCards([]);
        
        // Check if game is complete
        if (matches + 1 === cards.slice(0, 6).length) {
          const timeSpent = Math.floor((Date.now() - startTime) / 1000);
          onComplete({
            correct: matches + 1,
            total: cards.slice(0, 6).length,
            timeSpent
          });
        }
      } else {
        // No match - flip cards back after delay
        setTimeout(() => {
          setGameCards(prev => prev.map(card => 
            flippedCards.some(fc => fc.id === card.id)
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1500);
      }
    }
  }, [flippedCards, matches, cards, startTime, onComplete]);

  const handleCardClick = (card: MemoryCard) => {
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const updatedCard = { ...card, isFlipped: true };
    setGameCards(prev => prev.map(c => c.id === card.id ? updatedCard : c));
    setFlippedCards(prev => [...prev, updatedCard]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Memory Match</h2>
        <p className="text-muted-foreground">Match questions with their answers</p>
        
        <div className="flex justify-center gap-8 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-success">{matches}</p>
            <p className="text-sm text-muted-foreground">Matches</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{attempts}</p>
            <p className="text-sm text-muted-foreground">Attempts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">
              {attempts > 0 ? Math.round((matches / attempts) * 100) : 0}%
            </p>
            <p className="text-sm text-muted-foreground">Accuracy</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {gameCards.map((card) => (
          <Card
            key={card.id}
            className={`aspect-square p-4 cursor-pointer transition-all duration-300 ${
              card.isMatched 
                ? 'bg-success/10 border-success/30' 
                : card.isFlipped
                ? 'bg-primary/10 border-primary/30'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => handleCardClick(card)}
          >
            <div className="h-full flex items-center justify-center text-center">
              {card.isFlipped || card.isMatched ? (
                <div className="space-y-2">
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                    card.type === 'question' 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-accent/20 text-accent'
                  }`}>
                    {card.type === 'question' ? 'Q' : 'A'}
                  </div>
                  <p className="text-sm leading-tight">{card.content}</p>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                  <div className="text-2xl font-bold text-muted-foreground">?</div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={initializeGame}
          className="flex items-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Restart Game
        </Button>
      </div>
    </div>
  );
};