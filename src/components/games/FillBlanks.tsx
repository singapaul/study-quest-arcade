import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StudyCard, GameScore } from "@/types/study";
import { CheckCircle, XCircle, Clock, Eye, EyeOff } from "lucide-react";

interface FillBlanksProps {
  cards: StudyCard[];
  onComplete: (score: GameScore) => void;
}

export const FillBlanks = ({ cards, onComplete }: FillBlanksProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [blankQuestions, setBlankQuestions] = useState<Array<{
    question: string;
    blankedAnswer: string;
    blanks: string[];
    originalAnswer: string;
  }>>([]);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    // Generate fill-in-the-blank questions
    const blankedQuestions = cards.map(card => {
      const answer = card.answer;
      const words = answer.split(' ');
      
      // Determine which words to blank out (25-50% of words, minimum 1)
      const blankCount = Math.max(1, Math.floor(words.length * 0.4));
      const blankedIndices = new Set<number>();
      
      // Randomly select words to blank out, avoiding articles and prepositions
      const avoidWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
      const importantWords = words
        .map((word, index) => ({ word: word.toLowerCase(), index }))
        .filter(({ word }) => !avoidWords.includes(word) && word.length > 2)
        .map(({ index }) => index);
      
      // Select words to blank out
      while (blankedIndices.size < blankCount && blankedIndices.size < importantWords.length) {
        const randomIndex = importantWords[Math.floor(Math.random() * importantWords.length)];
        blankedIndices.add(randomIndex);
      }
      
      // If no important words found, just blank out random words
      if (blankedIndices.size === 0) {
        for (let i = 0; i < blankCount; i++) {
          blankedIndices.add(Math.floor(Math.random() * words.length));
        }
      }
      
      const blanks: string[] = [];
      const blankedAnswer = words.map((word, index) => {
        if (blankedIndices.has(index)) {
          blanks.push(word);
          return '___________';
        }
        return word;
      }).join(' ');
      
      return {
        question: card.question,
        blankedAnswer,
        blanks,
        originalAnswer: answer
      };
    });
    
    setBlankQuestions(blankedQuestions);
  }, [cards]);

  useEffect(() => {
    if (blankQuestions[currentIndex]) {
      setUserAnswers(new Array(blankQuestions[currentIndex].blanks.length).fill(''));
      setShowResult(false);
      setShowAnswers(false);
    }
  }, [currentIndex, blankQuestions]);

  const currentQuestion = blankQuestions[currentIndex];

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const checkAnswers = () => {
    let correctCount = 0;
    
    userAnswers.forEach((answer, index) => {
      const correctAnswer = currentQuestion.blanks[index];
      const isCorrect = answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
      if (isCorrect) correctCount++;
    });
    
    const allCorrect = correctCount === currentQuestion.blanks.length;
    
    setScore(prev => ({
      correct: prev.correct + (allCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < blankQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      onComplete({ ...score, timeSpent });
    }
  };

  const renderBlankedText = () => {
    if (!currentQuestion) return null;
    
    const parts = currentQuestion.blankedAnswer.split('___________');
    const result: React.ReactNode[] = [];
    
    parts.forEach((part, index) => {
      result.push(<span key={`text-${index}`}>{part}</span>);
      
      if (index < parts.length - 1) {
        const isCorrect = showResult && 
          userAnswers[index]?.toLowerCase().trim() === currentQuestion.blanks[index]?.toLowerCase().trim();
        
        result.push(
          <span key={`blank-${index}`} className="inline-block mx-1">
            <Input
              value={userAnswers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              className={`inline-block w-32 text-center h-8 px-2 ${
                showResult
                  ? isCorrect
                    ? 'border-success bg-success/10 text-success'
                    : 'border-destructive bg-destructive/10 text-destructive'
                  : 'border-primary/50'
              }`}
              disabled={showResult}
              placeholder={`Blank ${index + 1}`}
            />
          </span>
        );
      }
    });
    
    return <div className="text-lg leading-relaxed">{result}</div>;
  };

  if (!currentQuestion) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary">Fill in the Blanks</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
        <p className="text-muted-foreground">
          Question {currentIndex + 1} of {blankQuestions.length}
        </p>
        <div className="w-full bg-muted rounded-full h-2 mt-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / blankQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Fill in the blanks to complete the answer:
          </p>
        </div>

        <div className="bg-muted/30 p-6 rounded-lg">
          {renderBlankedText()}
        </div>

        {showResult && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Your answers vs correct answers:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="flex items-center gap-2"
                >
                  {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showAnswers ? 'Hide' : 'Show'} Details
                </Button>
              </div>
              
              {showAnswers && (
                <div className="space-y-2">
                  {currentQuestion.blanks.map((correct, index) => {
                    const userAnswer = userAnswers[index] || '';
                    const isCorrect = userAnswer.toLowerCase().trim() === correct.toLowerCase().trim();
                    
                    return (
                      <div key={index} className="flex items-center gap-4 text-sm">
                        <span className="w-16">Blank {index + 1}:</span>
                        <div className="flex items-center gap-2">
                          {isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <XCircle className="w-4 h-4 text-destructive" />
                          )}
                          <span className={isCorrect ? 'text-success' : 'text-destructive'}>
                            {userAnswer || '(empty)'}
                          </span>
                          {!isCorrect && (
                            <>
                              <span className="text-muted-foreground">→</span>
                              <span className="text-success font-medium">{correct}</span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-medium mb-2">Complete correct answer:</p>
              <p className="text-primary">{currentQuestion.originalAnswer}</p>
            </div>
          </div>
        )}

        {!showResult ? (
          <Button
            onClick={checkAnswers}
            disabled={userAnswers.some(answer => !answer.trim())}
            className="w-full"
          >
            Check Answers
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="w-full"
          >
            {currentIndex === blankQuestions.length - 1 ? 'Complete Game' : 'Next Question'}
          </Button>
        )}
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Score: {score.correct} / {score.total} correct
      </div>
    </div>
  );
};