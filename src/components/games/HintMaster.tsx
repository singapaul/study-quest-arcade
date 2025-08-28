import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { StudyCard, GameScore } from "@/types/study";
import { CheckCircle, XCircle, Lightbulb, Eye } from "lucide-react";

interface HintMasterProps {
  cards: StudyCard[];
  onComplete: (score: GameScore) => void;
}

export const HintMaster = ({ cards, onComplete }: HintMasterProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(Date.now());
  const [gameCards] = useState(cards.slice(0, 10));

  const maxHints = 3;
  const currentCard = gameCards[currentIndex];

  const generateHints = (answer: string): string[] => {
    const hints = [];
    
    // Hint 1: Number of words and characters
    const wordCount = answer.split(/\s+/).length;
    const charCount = answer.length;
    hints.push(`This answer has ${wordCount} word${wordCount > 1 ? 's' : ''} and ${charCount} characters.`);
    
    // Hint 2: First and last letters
    const firstLetter = answer.charAt(0).toUpperCase();
    const lastLetter = answer.charAt(answer.length - 1).toUpperCase();
    hints.push(`It starts with "${firstLetter}" and ends with "${lastLetter}".`);
    
    // Hint 3: Show some letters with blanks
    const maskedAnswer = answer
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' ';
        if (index === 0 || index === answer.length - 1) return char;
        if (index % 3 === 0) return char;
        return '_';
      })
      .join('');
    hints.push(`Pattern: ${maskedAnswer}`);
    
    return hints;
  };

  const hints = generateHints(currentCard.answer);

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    
    const correct = userAnswer.trim().toLowerCase() === currentCard.answer.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    
    // Calculate points based on hints used (fewer hints = more points)
    const pointsEarned = correct ? Math.max(1, 4 - hintsUsed) : 0;
    setScore(prev => ({
      correct: prev.correct + pointsEarned,
      total: prev.total + 4 // Max possible points per question
    }));

    setTimeout(() => {
      if (currentIndex + 1 >= gameCards.length) {
        const finalScore = {
          correct: score.correct + pointsEarned,
          total: score.total + 4,
          timeSpent: Math.round((Date.now() - startTime) / 1000)
        };
        onComplete(finalScore);
      } else {
        setCurrentIndex(prev => prev + 1);
        setUserAnswer("");
        setShowResult(false);
        setIsCorrect(false);
        setHintsUsed(0);
      }
    }, 2500);
  };

  const showHint = () => {
    if (hintsUsed < maxHints) {
      setHintsUsed(prev => prev + 1);
    }
  };

  const showAnswer = () => {
    setHintsUsed(maxHints);
    setUserAnswer(currentCard.answer);
  };

  const progress = ((currentIndex + (showResult ? 1 : 0)) / gameCards.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Hint Master</h2>
          <div className="text-sm text-muted-foreground">
            {score.correct}/{score.total} points
          </div>
        </div>
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          Question {currentIndex + 1} of {gameCards.length}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-center">Guess the Answer</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Use fewer hints to earn more points! (4 points max per question)
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Question:</h3>
            <p className="text-lg p-4 bg-accent/10 rounded-lg">{currentCard.question}</p>
          </div>

          {/* Hints section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Hints ({hintsUsed}/{maxHints} used)
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={showHint}
                  disabled={hintsUsed >= maxHints || showResult}
                  className="flex items-center gap-1"
                >
                  <Lightbulb className="w-4 h-4" />
                  Get Hint
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={showAnswer}
                  disabled={showResult}
                  className="flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  Show Answer
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {hints.slice(0, hintsUsed).map((hint, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-700">{hint}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Answer input */}
          <div className="mb-6">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Your Answer:
            </label>
            <div className="flex gap-2">
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here..."
                disabled={showResult}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="flex-1"
              />
              <Button
                onClick={handleSubmit}
                disabled={!userAnswer.trim() || showResult}
              >
                Submit
              </Button>
            </div>
          </div>

          {showResult && (
            <div className={`text-center p-4 rounded-lg ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="font-semibold">
                  {isCorrect ? 
                    `Correct! +${Math.max(1, 4 - hintsUsed)} points` : 
                    'Incorrect! +0 points'
                  }
                </span>
              </div>
              <p className="text-sm">
                Correct answer: <strong>{currentCard.answer}</strong>
              </p>
              {isCorrect && hintsUsed === 0 && (
                <p className="text-xs mt-1 text-green-600">Perfect! No hints needed!</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Use hints wisely - fewer hints mean more points!
        </p>
      </div>
    </div>
  );
};