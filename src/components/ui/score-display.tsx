import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Target, Home, RotateCcw } from "lucide-react";
import { GameScore } from "@/types/study";

interface ScoreDisplayProps {
  score: GameScore;
  gameType: string;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const ScoreDisplay = ({ score, gameType, onPlayAgain, onGoHome }: ScoreDisplayProps) => {
  const percentage = Math.round((score.correct / score.total) * 100);
  const timeSpentMinutes = Math.floor(score.timeSpent / 60);
  const timeSpentSeconds = score.timeSpent % 60;

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-500";
    if (percentage >= 70) return "text-yellow-500";
    if (percentage >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent! Outstanding performance!";
    if (percentage >= 70) return "Good job! Well done!";
    if (percentage >= 50) return "Not bad! Keep practicing!";
    return "Keep studying! You'll get better!";
  };

  const getGameTypeDisplayName = (gameType: string) => {
    const gameNames: Record<string, string> = {
      flashcards: "Flashcards",
      quiz: "Quick Quiz",
      memory: "Memory Match",
      scramble: "Word Scramble",
      truefalse: "True or False",
      typeanswer: "Type Answer",
      speedround: "Speed Round",
      fillblanks: "Fill Blanks",
      reversequiz: "Reverse Quiz",
      sequencematch: "Sequence Match",
      hintmaster: "Hint Master",
      categorysort: "Category Sort",
      splat: "Splat Game",
      swipe: "Swipe Study"
    };
    return gameNames[gameType] || gameType;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">Game Complete!</h2>
        <p className="text-muted-foreground">
          {getGameTypeDisplayName(gameType)} - Results
        </p>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className={`w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center ${getPerformanceColor(percentage)}`}>
              <Trophy className="w-12 h-12" />
            </div>
          </div>
          <CardTitle className="text-2xl">{getPerformanceMessage(percentage)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{score.correct}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-muted-foreground">{score.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getPerformanceColor(percentage)}`}>{percentage}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
          </div>

          {/* Time Spent */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              Time: {timeSpentMinutes}:{timeSpentSeconds.toString().padStart(2, '0')}
            </span>
          </div>

          {/* Performance Badge */}
          <div className="flex justify-center">
            <Badge 
              variant={percentage >= 90 ? "default" : percentage >= 70 ? "secondary" : "outline"}
              className="text-lg px-4 py-2"
            >
              {percentage >= 90 ? "🏆 Master" : 
               percentage >= 70 ? "🥈 Advanced" : 
               percentage >= 50 ? "🥉 Intermediate" : "📚 Beginner"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={onPlayAgain}
          className="flex items-center gap-2 px-8"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </Button>
        <Button
          onClick={onGoHome}
          variant="outline"
          className="flex items-center gap-2 px-8"
        >
          <Home className="w-4 h-4" />
          Back to Games
        </Button>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="font-medium">Average Time</div>
          <div>{(score.timeSpent / score.total).toFixed(1)}s per question</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="font-medium">Success Rate</div>
          <div>{score.correct} out of {score.total} correct</div>
        </div>
      </div>
    </div>
  );
};
