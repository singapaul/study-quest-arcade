import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StudyCard, GameScore } from "@/types/study";
import { Timer, Zap, Target } from "lucide-react";

interface SpeedRoundProps {
  cards: StudyCard[];
  onComplete: (score: GameScore) => void;
}

export const SpeedRound = ({ cards, onComplete }: SpeedRoundProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds total
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>>([]);

  useEffect(() => {
    // Generate speed round questions
    const speedQuestions = cards.slice(0, 20).map(card => {
      const incorrectAnswers = cards
        .filter(c => c.id !== card.id)
        .slice(0, 3)
        .map(c => c.answer);
      
      const options = [card.answer, ...incorrectAnswers].sort(() => Math.random() - 0.5);
      
      return {
        question: card.question,
        options,
        correctAnswer: options.indexOf(card.answer)
      };
    });
    
    setQuestions(speedQuestions);
  }, [cards]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameStarted && !gameEnded && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameEnded(true);
            onComplete({ ...score, total: score.total, timeSpent: 60 });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [gameStarted, gameEnded, timeLeft, score, onComplete]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setTimeLeft(60);
    setGameEnded(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || gameEnded) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === questions[currentIndex].correctAnswer;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1 && timeLeft > 0) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameEnded(true);
        onComplete({ 
          correct: score.correct + (isCorrect ? 1 : 0),
          total: score.total + 1, 
          timeSpent: 60 - timeLeft 
        });
      }
    }, 1000);
  };

  const currentQuestion = questions[currentIndex];

  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Speed Round</h2>
          <p className="text-muted-foreground mb-8">
            Answer as many questions as you can in 60 seconds!
          </p>
        </div>

        <Card className="p-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-warning/10 px-4 py-2 rounded-lg">
            <Zap className="w-5 h-5 text-warning" />
            <span className="font-medium text-warning">High Speed Challenge</span>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg">
                <Timer className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-primary">60</p>
                <p className="text-sm text-muted-foreground">Seconds</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Target className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold text-accent">{questions.length}</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Zap className="w-8 h-8 mx-auto mb-2 text-warning" />
                <p className="text-2xl font-bold text-warning">⚡</p>
                <p className="text-sm text-muted-foreground">Fast Pace</p>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Answer questions as quickly as possible</p>
              <p>• Each question auto-advances after 1 second</p>
              <p>• Try to beat your personal best!</p>
            </div>
          </div>

          <Button onClick={startGame} size="lg" className="w-full">
            Start Speed Round
          </Button>
        </Card>
      </div>
    );
  }

  if (gameEnded) {
    const percentage = Math.round((score.correct / score.total) * 100);
    const questionsPerMinute = Math.round((score.total / (60 - timeLeft)) * 60);
    
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Speed Round Complete!</h2>
        </div>

        <Card className="p-8 text-center space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-success/10 rounded-lg border border-success/20">
              <p className="text-3xl font-bold text-success">{score.correct}</p>
              <p className="text-sm text-success">Correct Answers</p>
            </div>
            <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-3xl font-bold text-primary">{percentage}%</p>
              <p className="text-sm text-primary">Accuracy</p>
            </div>
            <div className="p-6 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-3xl font-bold text-accent">{score.total}</p>
              <p className="text-sm text-accent">Total Questions</p>
            </div>
            <div className="p-6 bg-warning/10 rounded-lg border border-warning/20">
              <p className="text-3xl font-bold text-warning">{questionsPerMinute}</p>
              <p className="text-sm text-warning">Questions/Min</p>
            </div>
          </div>

          <Button onClick={() => window.location.reload()} size="lg" className="w-full">
            Play Again
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary">Speed Round</h2>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            timeLeft <= 10 ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'
          }`}>
            <Timer className="w-4 h-4" />
            <span className="font-bold">{timeLeft}s</span>
          </div>
        </div>
        
        <div className="flex justify-center gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-success">{score.correct}</p>
            <p className="text-sm text-muted-foreground">Correct</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{score.total}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-6 text-center">{currentQuestion.question}</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedAnswer === index
                  ? showResult
                    ? index === currentQuestion.correctAnswer
                      ? 'border-success bg-success/10 text-success-foreground'
                      : 'border-destructive bg-destructive/10 text-destructive-foreground'
                    : 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50 hover:bg-primary/5'
              }`}
              disabled={showResult}
            >
              <span className="text-sm">{option}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${
            timeLeft <= 10 ? 'bg-destructive' : 'bg-warning'
          }`}
          style={{ width: `${(timeLeft / 60) * 100}%` }}
        />
      </div>
    </div>
  );
};