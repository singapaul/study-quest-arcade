import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/ui/game-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreDisplay } from "@/components/ui/score-display";
import { SubscriptionStatus } from "@/components/ui/subscription-status";
import UserProfile from "@/components/UserProfile";
import { useNavigate } from "react-router-dom";
import { useRevisionData } from "@/hooks/useRevisionData";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { FlashcardGame } from "@/components/games/FlashcardGame";
import { QuickQuiz } from "@/components/games/QuickQuiz";
import { MemoryMatch } from "@/components/games/MemoryMatch";
import { WordScramble } from "@/components/games/WordScramble";
import { TrueFalse } from "@/components/games/TrueFalse";
import { TypeAnswer } from "@/components/games/TypeAnswer";
import { SpeedRound } from "@/components/games/SpeedRound";
import { FillBlanks } from "@/components/games/FillBlanks";
import { ReverseQuiz } from "@/components/games/ReverseQuiz";
import { SequenceMatch } from "@/components/games/SequenceMatch";
import { HintMaster } from "@/components/games/HintMaster";
import { CategorySort } from "@/components/games/CategorySort";
import { SplatGame } from "@/components/games/SplatGame";
import { SwipeGame } from "@/components/games/SwipeGame";
import { StudyCard, QuizQuestion, GameScore, GameType } from "@/types/study";
import { BookOpen, Brain, Zap, Shuffle, Trophy, Home, Settings, CheckSquare, Keyboard, Timer, Edit3, RotateCcw, ArrowUpDown, Lightbulb, FolderOpen, Target, Heart, User } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { toast } from "sonner";
import studyHero from "@/assets/study-hero.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'home' | GameType>('home');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState<GameScore | null>(null);
  const [completedGameType, setCompletedGameType] = useState<GameType | null>(null);
  const { subjects, categories, studyCards, loading } = useRevisionData();
  const { incrementGamesPlayed } = useSubscription();

  const handleGameComplete = (score: GameScore) => {
    setGameScore(score);
    setCompletedGameType(currentView as GameType);
    incrementGamesPlayed();
  };

  const handlePlayAgain = () => {
    setGameScore(null);
    setCompletedGameType(null);
    // The game will restart automatically since we're not changing currentView
  };

  const handleGoHome = () => {
    setGameScore(null);
    setCompletedGameType(null);
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

  const getFilteredCards = () => {
    if (!selectedSubject) return studyCards;
    
    const subjectCategories = categories.filter(cat => cat.subject_id === selectedSubject);
    const categoryIds = subjectCategories.map(cat => cat.id);
    return studyCards.filter(card => categoryIds.includes(card.category_id));
  };

  const filteredCards = getFilteredCards();

  const renderGameContent = () => {
    if (filteredCards.length < 3) {
      return (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Not enough study cards</h3>
          <p className="text-muted-foreground mb-6">
            {selectedSubject 
              ? `You need at least 3 study cards in ${subjects.find(s => s.id === selectedSubject)?.name} to play games`
              : 'You need at least 3 study cards to play games'
            }
          </p>
          <Button onClick={() => navigate('/revision')}>
            Add Study Cards
          </Button>
        </div>
      );
    }

    switch (currentView) {
      case 'flashcards':
        return <FlashcardGame cards={filteredCards} onComplete={(score) => score && handleGameComplete(score)} />;
      case 'quiz':
        return <QuickQuiz questions={generateQuizQuestions(filteredCards)} onComplete={handleGameComplete} />;
      case 'memory':
        return <MemoryMatch cards={filteredCards} onComplete={handleGameComplete} />;
      case 'scramble':
        return <WordScramble cards={filteredCards} onComplete={handleGameComplete} />;
      case 'truefalse':
        return <TrueFalse cards={filteredCards} onComplete={handleGameComplete} />;
      case 'typeanswer':
        return <TypeAnswer cards={filteredCards} onComplete={handleGameComplete} />;
      case 'speedround':
        return <SpeedRound cards={filteredCards} onComplete={handleGameComplete} />;
      case 'fillblanks':
        return <FillBlanks cards={filteredCards} onComplete={handleGameComplete} />;
      case 'reversequiz':
        return <ReverseQuiz cards={filteredCards} onComplete={handleGameComplete} />;
      case 'sequencematch':
        return <SequenceMatch cards={filteredCards} onComplete={handleGameComplete} />;
      case 'hintmaster':
        return <HintMaster cards={filteredCards} onComplete={handleGameComplete} />;
      case 'categorysort':
        return <CategorySort cards={filteredCards} onComplete={handleGameComplete} />;
      case 'splat':
        return <SplatGame cards={filteredCards} onComplete={handleGameComplete} />;
      case 'swipe':
        return <SwipeGame cards={filteredCards} onComplete={handleGameComplete} />;
      default:
        return null;
    }
  };



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
            <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">
              {filteredCards.length} study cards loaded
              {selectedSubject && ` in ${subjects.find(s => s.id === selectedSubject)?.name}`}
            </div>
              <UserProfile />
            </div>
          </div>
          {gameScore && completedGameType ? (
            <ScoreDisplay
              score={gameScore}
              gameType={completedGameType}
              onPlayAgain={handlePlayAgain}
              onGoHome={handleGoHome}
            />
          ) : (
            renderGameContent()
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Study Games</h1>
            <p className="text-muted-foreground mt-1">Choose a game mode to start studying</p>
          </div>
          <UserProfile />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Stats and Controls */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6 lg:h-fit">
            {/* Subscription Status */}
            <SubscriptionStatus />
            
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Cards:</span>
                  <span className="text-2xl font-bold text-primary">{studyCards.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subjects:</span>
                  <span className="text-xl font-semibold text-accent">{subjects.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Games Available:</span>
                  <span className="text-xl font-semibold text-accent">14</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Filtered Cards:</span>
                    <span className="font-medium text-primary">{filteredCards.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject Filter */}
            {subjects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filter by Subject</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={selectedSubject === null ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedSubject(null)}
                  >
                    All Subjects
                  </Button>
                  {subjects.map((subject) => (
                    <Button
                      key={subject.id}
                      variant={selectedSubject === subject.id ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedSubject(subject.id)}
                    >
                      {subject.name}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => navigate('/revision')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Cards
                </Button>
                <Button
                  onClick={() => navigate('/profile')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Game Cards */}
          <div className="lg:col-span-3">
            {/* Welcome Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Logo size="lg" className="text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent pb-2">
                  Studybug Games
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Transform your learning with interactive mini-games. Make studying fun and effective!
              </p>
            </div>

            {/* Game Cards Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <GameCard
            title="Flashcards"
            description="Classic flip cards to test your memory. Perfect for quick reviews and memorization."
            icon={<BookOpen className="w-6 h-6" />}
            onClick={() => setCurrentView('flashcards')}
            difficulty="easy"
            gameType="flashcards"
          />
          
          <GameCard
            title="Quick Quiz"
            description="Multiple choice questions with instant feedback. Challenge your knowledge!"
            icon={<Zap className="w-6 h-6" />}
            onClick={() => setCurrentView('quiz')}
            difficulty="medium"
            gameType="quiz"
          />
          
          <GameCard
            title="Memory Match"
            description="Match questions with answers in this brain-training memory game."
            icon={<Brain className="w-6 h-6" />}
            onClick={() => setCurrentView('memory')}
            difficulty="hard"
            gameType="memory"
          />
          
          <GameCard
            title="Word Scramble"
            description="Unscramble the letters to reveal the correct answer. Fun and challenging!"
            icon={<Shuffle className="w-6 h-6" />}
            onClick={() => setCurrentView('scramble')}
            difficulty="medium"
            gameType="scramble"
          />

          <GameCard
            title="True or False"
            description="Quick true/false questions to test your knowledge rapidly."
            icon={<CheckSquare className="w-6 h-6" />}
            onClick={() => setCurrentView('truefalse')}
            difficulty="easy"
            gameType="truefalse"
          />
          
          <GameCard
            title="Type Answer"
            description="Type the correct answer directly. Perfect for recall practice!"
            icon={<Keyboard className="w-6 h-6" />}
            onClick={() => setCurrentView('typeanswer')}
            difficulty="medium"
            gameType="typeanswer"
          />
          
          <GameCard
            title="Speed Round"
            description="Fast-paced 60-second challenge. How many can you answer correctly?"
            icon={<Timer className="w-6 h-6" />}
            onClick={() => setCurrentView('speedround')}
            difficulty="hard"
            gameType="speedround"
          />
          
          <GameCard
            title="Fill Blanks"
            description="Complete the missing words in the answers. Great for detailed learning!"
            icon={<Edit3 className="w-6 h-6" />}
            onClick={() => setCurrentView('fillblanks')}
            difficulty="medium"
            gameType="fillblanks"
          />

          <GameCard
            title="Reverse Quiz"
            description="See the answer and choose the correct question. Test your reverse thinking!"
            icon={<RotateCcw className="w-6 h-6" />}
            onClick={() => setCurrentView('reversequiz')}
            difficulty="medium"
            gameType="reversequiz"
          />
          
          <GameCard
            title="Sequence Match"
            description="Put scrambled words back in the correct order. Perfect for complex answers!"
            icon={<ArrowUpDown className="w-6 h-6" />}
            onClick={() => setCurrentView('sequencematch')}
            difficulty="hard"
            gameType="sequencematch"
          />
          
          <GameCard
            title="Hint Master"
            description="Progressive hints help you guess the answer. Use fewer hints for more points!"
            icon={<Lightbulb className="w-6 h-6" />}
            onClick={() => setCurrentView('hintmaster')}
            difficulty="easy"
            gameType="hintmaster"
          />
          
          <GameCard
            title="Category Sort"
            description="Group study cards by their categories. Great for organized learning!"
            icon={<FolderOpen className="w-6 h-6" />}
            onClick={() => setCurrentView('categorysort')}
            difficulty="medium"
            gameType="categorysort"
          />
          
          <GameCard
            title="Splat Game"
            description="Find the correct answer in a sea of options. Quick thinking required!"
            icon={<Target className="w-6 h-6" />}
            onClick={() => setCurrentView('splat')}
            difficulty="hard"
            gameType="splat"
          />
          
          <GameCard
            title="Swipe Study"
            description="Swipe like Tinder for revision! Test your confidence level on each card."
            icon={<Heart className="w-6 h-6" />}
            onClick={() => setCurrentView('swipe')}
            difficulty="easy"
            gameType="swipe"
          />
        </div>

          {/* Empty State Messages */}
          {studyCards.length === 0 && (
            <div className="text-center mt-12 p-8 border-2 border-dashed border-border rounded-2xl">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready to start learning?</h3>
              <p className="text-muted-foreground mb-6">
                Add your first revision cards to unlock all mini-games
              </p>
              <Button onClick={() => navigate('/revision')} size="lg">
                Create Revision Cards
              </Button>
            </div>
          )}

          {studyCards.length > 0 && filteredCards.length === 0 && selectedSubject && (
            <div className="text-center mt-12 p-8 border-2 border-dashed border-border rounded-2xl">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No cards in this subject</h3>
              <p className="text-muted-foreground mb-6">
                You don't have any study cards in {subjects.find(s => s.id === selectedSubject)?.name} yet
              </p>
              <Button onClick={() => navigate('/revision')} size="lg">
                Add Cards to {subjects.find(s => s.id === selectedSubject)?.name}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background/50 border-t mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Studybug</h3>
              <p className="text-muted-foreground text-sm">
                Transform your learning with interactive mini-games. Make studying fun and effective!
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button 
                    onClick={() => navigate('/')}
                    className="hover:text-primary transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/revision')}
                    className="hover:text-primary transition-colors"
                  >
                    Manage Cards
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/profile')}
                    className="hover:text-primary transition-colors"
                  >
                    Profile
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>14 Mini Games</li>
                <li>Subject Organization</li>
                <li>Progress Tracking</li>
                <li>Magic Link Auth</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 mt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Studybug. Built with React, TypeScript, and Supabase.</p>
          </div>
                </div>
      </footer>
      </div>
    </div>
    
  );
};

export default Index;