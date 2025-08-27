import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StudyCard, GameScore } from "@/types/study";
import { CheckCircle, XCircle, Clock, KeyboardIcon } from "lucide-react";

interface TypeAnswerProps {
  cards: StudyCard[];
  onComplete: (score: GameScore) => void;
}

export const TypeAnswer = ({ cards, onComplete }: TypeAnswerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [hint, setHint] = useState("");

  const currentCard = cards[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    if (currentCard) {
      setUserAnswer("");
      setShowResult(false);
      setHint("");
    }
  }, [currentCard]);

  const generateHint = () => {
    const answer = currentCard.answer.toLowerCase();
    const words = answer.split(' ');
    
    if (words.length > 1) {
      // Multi-word answer: show first letter of each word
      setHint(words.map(word => word[0] + '_'.repeat(word.length - 1)).join(' '));
    } else {
      // Single word: show first and last letter
      if (answer.length > 2) {
        setHint(answer[0] + '_'.repeat(answer.length - 2) + answer[answer.length - 1]);
      } else {
        setHint('_'.repeat(answer.length));
      }
    }
  };

  const checkAnswer = (userInput: string, correctAnswer: string) => {
    const normalize = (str: string) => 
      str.toLowerCase().trim().replace(/[^\w\s]/g, '');
    
    const userNormalized = normalize(userInput);
    const correctNormalized = normalize(correctAnswer);
    
    // Exact match
    if (userNormalized === correctNormalized) return true;
    
    // Partial credit for close matches (80% similarity)
    const similarity = calculateSimilarity(userNormalized, correctNormalized);
    return similarity >= 0.8;
  };

  const calculateSimilarity = (str1: string, str2: string) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string) => {
    const matrix = Array.from({ length: str2.length + 1 }, (_, i) => [i]);
    matrix[0] = Array.from({ length: str1.length + 1 }, (_, i) => i);

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2[i - 1] === str1[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  const handleSubmit = () => {
    const correct = checkAnswer(userAnswer, currentCard.answer);
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

  if (!currentCard) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary">Type the Answer</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
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
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg mb-4">
            <KeyboardIcon className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Type your answer</span>
          </div>
          <h3 className="text-xl font-semibold mb-6">{currentCard.question}</h3>
        </div>

        <div className="space-y-4">
          {hint && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Hint:</p>
              <div className="inline-block bg-accent/10 px-4 py-2 rounded-lg">
                <span className="font-mono text-lg tracking-wider text-accent">{hint}</span>
              </div>
            </div>
          )}

          <Input
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="text-center text-lg py-4"
            onKeyPress={(e) => e.key === 'Enter' && !showResult && userAnswer.trim() && handleSubmit()}
            disabled={showResult}
            autoFocus
          />

          {!showResult ? (
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                className="flex-1"
              >
                Submit Answer
              </Button>
              {!hint && (
                <Button
                  variant="outline"
                  onClick={generateHint}
                  className="px-4"
                >
                  Hint
                </Button>
              )}
            </div>
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
                      <span className="font-medium text-destructive">Close, but not quite</span>
                    </>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Your answer:</strong> {userAnswer}</p>
                  <p><strong>Correct answer:</strong> {currentCard.answer}</p>
                </div>
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
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Score: {score.correct} / {score.total} correct
      </div>
    </div>
  );
};