import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/ui/game-card";
import { StudyManager } from "@/components/StudyManager";
import { FlashcardGame } from "@/components/games/FlashcardGame";
import { QuickQuiz } from "@/components/games/QuickQuiz";
import { MemoryMatch } from "@/components/games/MemoryMatch";
import { WordScramble } from "@/components/games/WordScramble";
import { TrueFalse } from "@/components/games/TrueFalse";
import { TypeAnswer } from "@/components/games/TypeAnswer";
import { SpeedRound } from "@/components/games/SpeedRound";
import { FillBlanks } from "@/components/games/FillBlanks";
import { StudyCard, QuizQuestion, GameScore, GameType } from "@/types/study";
import { BookOpen, Brain, Zap, Shuffle, Trophy, Home, Settings, CheckSquare, Keyboard, Timer, Edit3 } from "lucide-react";
import { toast } from "sonner";
import studyHero from "@/assets/study-hero.jpg";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'manage' | GameType>('home');
  const [studyCards, setStudyCards] = useState<StudyCard[]>([]);

  const handleGameComplete = (score: GameScore) => {
    const percentage = Math.round((score.correct / score.total) * 100);
    toast.success(`Game completed! Score: ${score.correct}/${score.total} (${percentage}%)`);
    setCurrentView('home');
  };

  const generateQuizQuestions = (cards: StudyCard[]): QuizQuestion[] => {
    return cards.slice(0, 5).map((card, index) => {
      const incorrectAnswers = cards
        .filter(c => c.id !== card.id)
        .slice(0, 3)
        .map(c => c.answer);
      
      const options = [card.answer, ...incorrectAnswers].sort(() => Math.random() - 0.5);
      
      return {
        id: card.id,
        question: card.question,
        options,
        correctAnswer: options.indexOf(card.answer),
        explanation: `The correct answer is "${card.answer}"`
      };
    });
  };

  const renderGameContent = () => {
    if (studyCards.length < 3) {
      return (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Not enough study cards</h3>
          <p className="text-muted-foreground mb-6">
            You need at least 3 study cards to play games
          </p>
          <Button onClick={() => setCurrentView('manage')}>
            Add Study Cards
          </Button>
        </div>
      );
    }

    switch (currentView) {
      case 'flashcards':
        return <FlashcardGame cards={studyCards} onComplete={(score) => score && handleGameComplete(score)} />;
      case 'quiz':
        return <QuickQuiz questions={generateQuizQuestions(studyCards)} onComplete={handleGameComplete} />;
      case 'memory':
        return <MemoryMatch cards={studyCards} onComplete={handleGameComplete} />;
      case 'scramble':
        return <WordScramble cards={studyCards} onComplete={handleGameComplete} />;
      case 'truefalse':
        return <TrueFalse cards={studyCards} onComplete={handleGameComplete} />;
      case 'typeanswer':
        return <TypeAnswer cards={studyCards} onComplete={handleGameComplete} />;
      case 'speedround':
        return <SpeedRound cards={studyCards} onComplete={handleGameComplete} />;
      case 'fillblanks':
        return <FillBlanks cards={studyCards} onComplete={handleGameComplete} />;
      default:
        return null;
    }
  };

  if (currentView === 'manage') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 p-6 border-b">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Games
            </Button>
          </div>
          <StudyManager
            cards={studyCards}
            onCardsUpdate={setStudyCards}
            onStartStudying={() => setCurrentView('home')}
          />
        </div>
      </div>
    );
  }

  if (currentView !== 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="container mx-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Games
            </Button>
            <div className="text-sm text-muted-foreground">
              {studyCards.length} study cards loaded
            </div>
          </div>
          {renderGameContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src={studyHero} 
              alt="Study materials and learning" 
              className="rounded-2xl shadow-xl max-w-2xl w-full h-64 object-cover"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
            StudyBuddy Games
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your learning with interactive mini-games. Make studying fun and effective!
          </p>
        </div>

        {/* Stats and Quick Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{studyCards.length}</p>
              <p className="text-sm text-muted-foreground">Study Cards</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-2xl font-bold text-accent">8</p>
              <p className="text-sm text-muted-foreground">Mini Games</p>
            </div>
          </div>
          
          <Button
            onClick={() => setCurrentView('manage')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Manage Study Cards
          </Button>
        </div>

        {/* Game Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
          <GameCard
            title="Flashcards"
            description="Classic flip cards to test your memory. Perfect for quick reviews and memorization."
            icon={<BookOpen className="w-6 h-6" />}
            onClick={() => setCurrentView('flashcards')}
            difficulty="easy"
          />
          
          <GameCard
            title="Quick Quiz"
            description="Multiple choice questions with instant feedback. Challenge your knowledge!"
            icon={<Zap className="w-6 h-6" />}
            onClick={() => setCurrentView('quiz')}
            difficulty="medium"
          />
          
          <GameCard
            title="Memory Match"
            description="Match questions with answers in this brain-training memory game."
            icon={<Brain className="w-6 h-6" />}
            onClick={() => setCurrentView('memory')}
            difficulty="hard"
          />
          
          <GameCard
            title="Word Scramble"
            description="Unscramble the letters to reveal the correct answer. Fun and challenging!"
            icon={<Shuffle className="w-6 h-6" />}
            onClick={() => setCurrentView('scramble')}
            difficulty="medium"
          />

          <GameCard
            title="True or False"
            description="Quick true/false questions to test your knowledge rapidly."
            icon={<CheckSquare className="w-6 h-6" />}
            onClick={() => setCurrentView('truefalse')}
            difficulty="easy"
          />
          
          <GameCard
            title="Type Answer"
            description="Type the correct answer directly. Perfect for recall practice!"
            icon={<Keyboard className="w-6 h-6" />}
            onClick={() => setCurrentView('typeanswer')}
            difficulty="medium"
          />
          
          <GameCard
            title="Speed Round"
            description="Fast-paced 60-second challenge. How many can you answer correctly?"
            icon={<Timer className="w-6 h-6" />}
            onClick={() => setCurrentView('speedround')}
            difficulty="hard"
          />
          
          <GameCard
            title="Fill Blanks"
            description="Complete the missing words in the answers. Great for detailed learning!"
            icon={<Edit3 className="w-6 h-6" />}
            onClick={() => setCurrentView('fillblanks')}
            difficulty="medium"
          />
        </div>

        {studyCards.length === 0 && (
          <div className="text-center mt-12 p-8 border-2 border-dashed border-border rounded-2xl">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ready to start learning?</h3>
            <p className="text-muted-foreground mb-6">
              Add your first study cards to unlock all mini-games
            </p>
            <Button onClick={() => setCurrentView('manage')} size="lg">
              Create Study Cards
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;