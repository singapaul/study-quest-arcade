import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { RevisionService } from '@/services/revisionService';
import { ExportService } from '@/services/exportService';
import { ArrowLeft, Plus, Edit, Trash2, Play, BookOpen, Brain, Zap, Shuffle, CheckSquare, Keyboard, Timer, Edit3, RotateCcw, ArrowUpDown, Lightbulb, FolderOpen, Target, Heart, Download, Upload, Database } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Subject = Tables<'subjects'>;
type Category = Tables<'categories'>;
type StudyCard = Tables<'study_cards'>;

const SUBJECTS = [
  { id: 'english', name: 'English', color: 'bg-blue-500' },
  { id: 'maths', name: 'Maths', color: 'bg-green-500' },
  { id: 'biology', name: 'Biology', color: 'bg-emerald-500' },
  { id: 'physics', name: 'Physics', color: 'bg-purple-500' },
  { id: 'chemistry', name: 'Chemistry', color: 'bg-orange-500' },
  { id: 'religious-education', name: 'Religious Education', color: 'bg-indigo-500' },
  { id: 'history', name: 'History', color: 'bg-red-500' },
  { id: 'geography', name: 'Geography', color: 'bg-teal-500' }
];

const GAME_TYPES = [
  { id: 'flashcards', name: 'Flashcards', icon: BookOpen, difficulty: 'easy' },
  { id: 'quiz', name: 'Quick Quiz', icon: Zap, difficulty: 'medium' },
  { id: 'memory', name: 'Memory Match', icon: Brain, difficulty: 'hard' },
  { id: 'scramble', name: 'Word Scramble', icon: Shuffle, difficulty: 'medium' },
  { id: 'truefalse', name: 'True or False', icon: CheckSquare, difficulty: 'easy' },
  { id: 'typeanswer', name: 'Type Answer', icon: Keyboard, difficulty: 'medium' },
  { id: 'speedround', name: 'Speed Round', icon: Timer, difficulty: 'hard' },
  { id: 'fillblanks', name: 'Fill Blanks', icon: Edit3, difficulty: 'medium' },
  { id: 'reversequiz', name: 'Reverse Quiz', icon: RotateCcw, difficulty: 'medium' },
  { id: 'sequencematch', name: 'Sequence Match', icon: ArrowUpDown, difficulty: 'hard' },
  { id: 'hintmaster', name: 'Hint Master', icon: Lightbulb, difficulty: 'easy' },
  { id: 'categorysort', name: 'Category Sort', icon: FolderOpen, difficulty: 'medium' },
  { id: 'splat', name: 'Splat Game', icon: Target, difficulty: 'hard' },
  { id: 'swipe', name: 'Swipe Study', icon: Heart, difficulty: 'easy' }
];

const RevisionManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [studyCards, setStudyCards] = useState<StudyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('subjects');

  // Form states
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingCard, setEditingCard] = useState<StudyCard | null>(null);

  // Form data
  const [subjectForm, setSubjectForm] = useState({ name: '', description: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', subject_id: '' });
  const [cardForm, setCardForm] = useState({ question: '', answer: '', category_id: '' });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data using the service
      const [subjectsData, categoriesData, cardsData] = await Promise.all([
        RevisionService.getSubjects(),
        RevisionService.getCategories(),
        RevisionService.getStudyCards()
      ]);

      setSubjects(subjectsData);
      setCategories(categoriesData);
      setStudyCards(cardsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      let result;
      if (editingSubject) {
        result = await RevisionService.updateSubject(editingSubject.id, {
          name: subjectForm.name,
          description: subjectForm.description
        });
      } else {
        result = await RevisionService.createSubject({
          name: subjectForm.name,
          description: subjectForm.description,
          created_by: user.id
        });
      }

      if (result) {
        setIsSubjectDialogOpen(false);
        setEditingSubject(null);
        setSubjectForm({ name: '', description: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error saving subject:', error);
      // Error handling is done in the service
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !categoryForm.subject_id) return;

    try {
      let result;
      if (editingCategory) {
        result = await RevisionService.updateCategory(editingCategory.id, {
          name: categoryForm.name,
          description: categoryForm.description
        });
      } else {
        result = await RevisionService.createCategory({
          name: categoryForm.name,
          description: categoryForm.description,
          subject_id: categoryForm.subject_id,
          created_by: user.id
        });
      }

      if (result) {
        setIsCategoryDialogOpen(false);
        setEditingCategory(null);
        setCategoryForm({ name: '', description: '', subject_id: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error saving category:', error);
      // Error handling is done in the service
    }
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !cardForm.category_id) return;

    try {
      let result;
      if (editingCard) {
        result = await RevisionService.updateStudyCard(editingCard.id, {
          question: cardForm.question,
          answer: cardForm.answer
        });
      } else {
        result = await RevisionService.createStudyCard({
          question: cardForm.question,
          answer: cardForm.answer,
          category_id: cardForm.category_id,
          created_by: user.id
        });
      }

      if (result) {
        setIsCardDialogOpen(false);
        setEditingCard(null);
        setCardForm({ question: '', answer: '', category_id: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error saving study card:', error);
      // Error handling is done in the service
    }
  };

  const deleteSubject = async (subjectId: string) => {
    if (!confirm('Are you sure you want to delete this subject? This will also delete all associated categories and study cards.')) return;

    try {
      const success = await RevisionService.deleteSubject(subjectId);
      if (success) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      // Error handling is done in the service
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all associated study cards.')) return;

    try {
      const success = await RevisionService.deleteCategory(categoryId);
      if (success) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      // Error handling is done in the service
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this study card?')) return;

    try {
      const success = await RevisionService.deleteCard(cardId);
      if (success) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting study card:', error);
      // Error handling is done in the service
    }
  };

  // Export/Import functions
  const handleExportData = async () => {
    try {
      const result = await ExportService.exportData();
      if (result) {
        toast.success('Data exported successfully!');
      } else {
        toast.error('Failed to export data');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const success = await ExportService.importData(file);
      if (success) {
        toast.success('Data imported successfully!');
        fetchData(); // Refresh the data
      } else {
        toast.error('Failed to import data');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Import failed');
    }

    // Reset the input
    event.target.value = '';
  };

  const startGame = (gameType: string) => {
    if (!selectedSubject) {
      toast.error('Please select a subject first');
      return;
    }
    
    // Navigate to the game with subject filter
    navigate(`/?subject=${selectedSubject}&game=${gameType}`);
  };

  const getFilteredCards = () => {
    let filtered = studyCards;
    
    if (selectedSubject) {
      const subjectCategories = categories.filter(cat => cat.subject_id === selectedSubject);
      const categoryIds = subjectCategories.map(cat => cat.id);
      filtered = filtered.filter(card => categoryIds.includes(card.category_id));
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(card => card.category_id === selectedCategory);
    }
    
    return filtered;
  };

  const filteredCards = getFilteredCards();
  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>

          {/* Export/Import Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="import-file"
              />
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                asChild
              >
                <label htmlFor="import-file">
                  <Upload className="w-4 h-4" />
                  Import
                </label>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left sidebar - Subjects and Categories */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6 lg:h-fit">
            {/* Data Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Data Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Subjects:</span>
                  <span className="font-medium">{subjects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Categories:</span>
                  <span className="font-medium">{categories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Study Cards:</span>
                  <span className="font-medium">{studyCards.length}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Cards:</span>
                    <span className="font-medium text-primary">{studyCards.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subjects */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Subjects</CardTitle>
                <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setEditingSubject(null)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingSubject ? 'Edit Subject' : 'Create Subject'}
                      </DialogTitle>
                      <DialogDescription>
                        Add a new subject for organizing your study materials.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubjectSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject-name">Subject Name</Label>
                        <Input
                          id="subject-name"
                          value={subjectForm.name}
                          onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Mathematics"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject-description">Description</Label>
                        <Textarea
                          id="subject-description"
                          value={subjectForm.description}
                          onChange={(e) => setSubjectForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of the subject"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          {editingSubject ? 'Update' : 'Create'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsSubjectDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-2">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSubject === subject.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedSubject(subject.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{subject.name}</h4>
                        {subject.description && (
                          <p className="text-sm text-muted-foreground">{subject.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSubject(subject);
                            setSubjectForm({ name: subject.name, description: subject.description || '' });
                            setIsSubjectDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSubject(subject.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Categories */}
            {selectedSubject && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Categories</CardTitle>
                  <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setEditingCategory(null)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingCategory ? 'Edit Category' : 'Create Category'}
                        </DialogTitle>
                        <DialogDescription>
                          Add a new category within {selectedSubjectData?.name}.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="category-name">Category Name</Label>
                          <Input
                            id="category-name"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Algebra"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category-description">Description</Label>
                          <Textarea
                            id="category-description"
                            value={categoryForm.description}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Brief description of the category"
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" className="flex-1">
                            {editingCategory ? 'Update' : 'Create'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsCategoryDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories
                    .filter(cat => cat.subject_id === selectedSubject)
                    .map((category) => (
                      <div
                        key={category.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedCategory === category.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{category.name}</h4>
                            {category.description && (
                              <p className="text-sm text-muted-foreground">{category.description}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCategory(category);
                                setCategoryForm({
                                  name: category.name,
                                  description: category.description || '',
                                  subject_id: category.subject_id
                                });
                                setIsCategoryDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCategory(category.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main content - Study Cards and Games */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="subjects">Study Cards</TabsTrigger>
                <TabsTrigger value="games">Play Games</TabsTrigger>
              </TabsList>

              <TabsContent value="subjects" className="space-y-6">
                {/* Study Cards Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Study Cards</h2>
                    {selectedSubject && (
                      <p className="text-muted-foreground">
                        {selectedSubjectData?.name}
                        {selectedCategory && ` > ${selectedCategoryData?.name}`}
                      </p>
                    )}
                  </div>
                  <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingCard(null)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Card
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingCard ? 'Edit Study Card' : 'Create Study Card'}
                        </DialogTitle>
                        <DialogDescription>
                          Add a new study card with a question and answer.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCardSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-category">Category</Label>
                          <Select
                            value={cardForm.category_id}
                            onValueChange={(value) => setCardForm(prev => ({ ...prev, category_id: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories
                                .filter(cat => !selectedSubject || cat.subject_id === selectedSubject)
                                .map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-question">Question</Label>
                          <Textarea
                            id="card-question"
                            value={cardForm.question}
                            onChange={(e) => setCardForm(prev => ({ ...prev, question: e.target.value }))}
                            placeholder="Enter the question"
                            rows={3}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-answer">Answer</Label>
                          <Textarea
                            id="card-answer"
                            value={cardForm.answer}
                            onChange={(e) => setCardForm(prev => ({ ...prev, answer: e.target.value }))}
                            placeholder="Enter the answer"
                            rows={3}
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" className="flex-1">
                            {editingCard ? 'Update' : 'Create'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsCardDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Study Cards List */}
                <div className="space-y-4">
                  {filteredCards.length === 0 ? (
                    <Card className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No study cards yet</h3>
                      <p className="text-muted-foreground mb-6">
                        {selectedSubject 
                          ? `Create your first study card in ${selectedSubjectData?.name}`
                          : 'Select a subject to start creating study cards'
                        }
                      </p>
                      {selectedSubject && (
                        <Button onClick={() => setIsCardDialogOpen(true)}>
                          Create Study Card
                        </Button>
                      )}
                    </Card>
                  ) : (
                    filteredCards.map((card) => {
                      const category = categories.find(c => c.id === card.category_id);
                      const subject = subjects.find(s => s.id === category?.subject_id);
                      
                      return (
                        <Card key={card.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                  {subject && (
                                    <Badge variant="secondary" className={SUBJECTS.find(s => s.id === subject.id)?.color + ' text-white'}>
                                      {subject.name}
                                    </Badge>
                                  )}
                                  {category && (
                                    <Badge variant="outline">{category.name}</Badge>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Question:</h4>
                                  <p className="text-muted-foreground">{card.question}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Answer:</h4>
                                  <p className="text-muted-foreground">{card.answer}</p>
                                </div>
                              </div>
                              <div className="flex gap-1 ml-4">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingCard(card);
                                    setCardForm({
                                      question: card.question,
                                      answer: card.answer,
                                      category_id: card.category_id
                                    });
                                    setIsCardDialogOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteCard(card.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>

              <TabsContent value="games" className="space-y-6">
                {/* Games Header */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">Play Games</h2>
                  {selectedSubject ? (
                    <p className="text-muted-foreground">
                      Play games with your {selectedSubjectData?.name} study cards
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      Select a subject to play games with those study cards
                    </p>
                  )}
                </div>

                {/* Subject Selection for Games */}
                {!selectedSubject && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Choose a Subject</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {SUBJECTS.map((subject) => (
                        <Button
                          key={subject.id}
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-center gap-2"
                          onClick={() => setSelectedSubject(subject.id)}
                        >
                          <div className={`w-8 h-8 rounded-full ${subject.color} flex items-center justify-center`}>
                            <BookOpen className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium">{subject.name}</span>
                        </Button>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Games Grid */}
                {selectedSubject && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {GAME_TYPES.map((game) => {
                      const IconComponent = game.icon;
                      const cardCount = filteredCards.length;
                      const canPlay = cardCount >= 3;

                      return (
                        <Card
                          key={game.id}
                          className={`cursor-pointer transition-all hover:shadow-lg ${
                            canPlay ? 'hover:border-primary' : 'opacity-50'
                          }`}
                          onClick={() => canPlay && startGame(game.id)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className={`w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-3 flex items-center justify-center`}>
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-medium mb-1">{game.name}</h3>
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <Badge variant="secondary" className="text-xs">
                                {game.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {cardCount} cards
                              </Badge>
                            </div>
                            {canPlay ? (
                              <Button size="sm" className="w-full">
                                <Play className="w-4 h-4 mr-2" />
                                Play
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" className="w-full" disabled>
                                Need {3 - cardCount} more cards
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background/50 border-t mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">StudyBuddy</h3>
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
            <p>&copy; 2025 StudyBuddy. Built with React, TypeScript, and Supabase.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RevisionManager;
