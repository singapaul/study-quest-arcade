import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StudyCard, GameScore } from "@/types/study";
import { CheckCircle, RotateCcw, Shuffle } from "lucide-react";

interface SequenceMatchProps {
  cards: StudyCard[];
  onComplete: (score: GameScore) => void;
}

export const SequenceMatch = ({ cards, onComplete }: SequenceMatchProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  const [gameCards, setGameCards] = useState<StudyCard[]>([]);

  useEffect(() => {
    // Filter cards that have answers with multiple words
    const multiWordCards = cards.filter(card => 
      card.answer.trim().split(/\s+/).length >= 3
    ).slice(0, 10);
    
    setGameCards(multiWordCards);
    if (multiWordCards.length > 0) {
      setupQuestion(0, multiWordCards);
    }
  }, [cards]);

  const setupQuestion = (index: number, cardsToUse: StudyCard[]) => {
    const card = cardsToUse[index];
    const words = card.answer.trim().split(/\s+/);
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    
    setAvailableWords(shuffledWords);
    setSelectedWords([]);
    setShowResult(false);
    setIsCorrect(false);
  };

  const handleWordClick = (word: string, fromAvailable: boolean) => {
    if (showResult) return;

    if (fromAvailable) {
      setSelectedWords(prev => [...prev, word]);
      setAvailableWords(prev => prev.filter((w, i) => i !== prev.indexOf(word)));
    } else {
      const wordIndex = selectedWords.indexOf(word);
      setSelectedWords(prev => prev.filter((_, i) => i !== wordIndex));
      setAvailableWords(prev => [...prev, word]);
    }
  };

  const checkAnswer = () => {
    const currentCard = gameCards[currentIndex];
    const correctSequence = currentCard.answer.trim().split(/\s+/);
    const userSequence = selectedWords;
    
    const correct = correctSequence.length === userSequence.length &&
      correctSequence.every((word, index) => word === userSequence[index]);
    
    setIsCorrect(correct);
    setShowResult(true);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));

    setTimeout(() => {
      if (currentIndex + 1 >= gameCards.length) {
        const finalScore = {
          correct: score.correct + (correct ? 1 : 0),
          total: score.total + 1,
          timeSpent: Math.round((Date.now() - startTime) / 1000)
        };
        onComplete(finalScore);
      } else {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setupQuestion(nextIndex, gameCards);
      }
    }, 2000);
  };

  const shuffleAvailable = () => {
    if (!showResult) {
      setAvailableWords(prev => [...prev].sort(() => Math.random() - 0.5));
    }
  };

  if (gameCards.length === 0) {
    return (
      <div className="text-center py-12">
        <Shuffle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No suitable cards found</h3>
        <p className="text-muted-foreground">
          You need study cards with answers containing at least 3 words to play this game
        </p>
      </div>
    );
  }

  const currentCard = gameCards[currentIndex];
  const progress = ((currentIndex + (showResult ? 1 : 0)) / gameCards.length) * 100;
  const canCheck = selectedWords.length > 0 && availableWords.length === 0;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Sequence Match</h2>
          <div className="text-sm text-muted-foreground">
            {score.correct}/{score.total} correct
          </div>
        </div>
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          Question {currentIndex + 1} of {gameCards.length}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-center">Put the words in correct order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Question:</h3>
            <p className="text-lg">{currentCard.question}</p>
          </div>

          {/* Selected words area */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Your Answer:</h4>
            <div className="min-h-[60px] p-4 border-2 border-dashed border-border rounded-lg">
              {selectedWords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedWords.map((word, index) => (
                    <Button
                      key={`selected-${index}`}
                      variant="default"
                      size="sm"
                      onClick={() => handleWordClick(word, false)}
                      disabled={showResult}
                      className="h-8"
                    >
                      {word}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center">Click words below to build your answer</p>
              )}
            </div>
          </div>

          {/* Available words */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">Available Words:</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={shuffleAvailable}
                disabled={showResult}
                className="h-8"
              >
                <Shuffle className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableWords.map((word, index) => (
                <Button
                  key={`available-${index}`}
                  variant="outline"
                  size="sm"
                  onClick={() => handleWordClick(word, true)}
                  disabled={showResult}
                  className="h-8"
                >
                  {word}
                </Button>
              ))}
            </div>
          </div>

          {showResult && (
            <div className={`text-center p-4 rounded-lg ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className={`w-5 h-5 ${isCorrect ? 'text-green-500' : 'text-red-500'}`} />
                <span className="font-semibold">
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-sm">
                Correct answer: <strong>{currentCard.answer}</strong>
              </p>
            </div>
          )}

          {!showResult && (
            <div className="text-center">
              <Button
                onClick={checkAnswer}
                disabled={!canCheck}
                size="lg"
              >
                Check Answer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};