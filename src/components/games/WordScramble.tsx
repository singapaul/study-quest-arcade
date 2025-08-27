import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StudyCard, GameScore } from "@/types/study";
import { Shuffle, CheckCircle, XCircle, RotateCcw } from "lucide-react";

interface WordScrambleProps {
  cards: StudyCard[];
  onComplete: (score: GameScore) => void;
}

export const WordScramble = ({ cards, onComplete }: WordScrambleProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledWord, setScrambledWord] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [startTime] = useState(Date.now());

  const currentCard = cards[currentIndex];

  const scrambleWord = (word: string) => {
    const words = word.toLowerCase().split(' ');
    return words.map(w => {
      if (w.length <= 2) return w;
      const chars = w.split('');
      for (let i = chars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
      return chars.join('');
    }).join(' ');
  };

  useEffect(() => {
    if (currentCard) {
      setScrambledWord(scrambleWord(currentCard.answer));
      setUserAnswer("");
      setShowResult(false);
    }
  }, [currentCard]);

  const handleSubmit = () => {
    const correct = userAnswer.toLowerCase().trim() === currentCard.answer.toLowerCase().trim();
    setIsCorrect(correct);
    setShowResult(true);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      onComplete({ ...score, timeSpent });
    }
  };

  const handleNewScramble = () => {
    setScrambledWord(scrambleWord(currentCard.answer));
  };

  if (!currentCard) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Word Scramble</h2>
        <p className="text-muted-foreground">
          Question {currentIndex + 1} of {cards.length}
        </p>
        <div className="w-full bg-muted rounded-full h-2 mt-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">Unscramble the answer to:</h3>
          <p className="text-xl font-semibold text-primary mb-6">{currentCard.question}</p>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Scrambled word:</p>
            <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-3 rounded-lg">
              <span className="text-2xl font-mono font-bold tracking-wider">
                {scrambledWord}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewScramble}
                className="p-1"
              >
                <Shuffle className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="text-center text-lg"
              onKeyPress={(e) => e.key === 'Enter' && !showResult && handleSubmit()}
              disabled={showResult}
            />

            {!showResult ? (
              <Button
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                className="w-full"
              >
                Check Answer
              </Button>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg text-center ${
                  isCorrect 
                    ? 'bg-success/10 border border-success/20' 
                    : 'bg-destructive/10 border border-destructive/20'
                }`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span className="font-medium text-success">Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-destructive" />
                        <span className="font-medium text-destructive">Incorrect</span>
                      </>
                    )}
                  </div>
                  {!isCorrect && (
                    <p className="text-sm">
                      The correct answer was: <strong>{currentCard.answer}</strong>
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full"
                >
                  {currentIndex === cards.length - 1 ? 'Complete Game' : 'Next Question'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Score: {score.correct} / {score.total} correct
      </div>
    </div>
  );
};