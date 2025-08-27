import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StudyCard } from "@/types/study";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface StudyManagerProps {
  cards: StudyCard[];
  onCardsUpdate: (cards: StudyCard[]) => void;
  onStartStudying: () => void;
}

export const StudyManager = ({ cards, onCardsUpdate, onStartStudying }: StudyManagerProps) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const addCard = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error("Please fill in both question and answer");
      return;
    }

    const newCard: StudyCard = {
      id: Date.now().toString(),
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: newCategory.trim() || undefined
    };

    onCardsUpdate([...cards, newCard]);
    setNewQuestion("");
    setNewAnswer("");
    setNewCategory("");
    toast.success("Study card added!");
  };

  const removeCard = (id: string) => {
    onCardsUpdate(cards.filter(card => card.id !== id));
    toast.success("Card removed");
  };

  const loadSampleData = () => {
    const sampleCards: StudyCard[] = [
      {
        id: "1",
        question: "What is the capital of France?",
        answer: "Paris",
        category: "Geography"
      },
      {
        id: "2", 
        question: "What is 2 + 2?",
        answer: "4",
        category: "Math"
      },
      {
        id: "3",
        question: "Who wrote Romeo and Juliet?",
        answer: "William Shakespeare",
        category: "Literature"
      },
      {
        id: "4",
        question: "What is the largest planet in our solar system?",
        answer: "Jupiter",
        category: "Science"
      },
      {
        id: "5",
        question: "In what year did World War II end?",
        answer: "1945",
        category: "History"
      },
      {
        id: "6",
        question: "What is the chemical symbol for gold?",
        answer: "Au",
        category: "Chemistry"
      }
    ];
    
    onCardsUpdate(sampleCards);
    toast.success("Sample study materials loaded!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">Study Materials</h2>
        <p className="text-muted-foreground">
          Create and manage your study cards for all mini-games
        </p>
      </div>

      {/* Add new card form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Study Card</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter your question here..."
              className="min-h-[80px]"
            />
          </div>
          
          <div>
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Enter the answer here..."
              className="min-h-[80px]"
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g., Math, Science, History..."
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={addCard} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Card
            </Button>
            
            {cards.length === 0 && (
              <Button variant="outline" onClick={loadSampleData} className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Load Sample Data
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Existing cards */}
      {cards.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Study Cards ({cards.length})</h3>
            <Button onClick={onStartStudying} className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Start Studying
            </Button>
          </div>
          
          <div className="grid gap-3">
            {cards.map((card) => (
              <Card key={card.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-primary mb-1">Question:</p>
                        <p className="text-sm">{card.question}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-accent mb-1">Answer:</p>
                        <p className="text-sm">{card.answer}</p>
                      </div>
                    </div>
                    {card.category && (
                      <div className="mt-2">
                        <span className="inline-block text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          {card.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCard(card.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
