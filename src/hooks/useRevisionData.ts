import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RevisionService } from '@/services/revisionService';
import type { Tables } from '@/integrations/supabase/types';

type Subject = Tables<'subjects'>;
type Category = Tables<'categories'>;
type StudyCard = Tables<'study_cards'>;

export const useRevisionData = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [studyCards, setStudyCards] = useState<StudyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data using the service
      const [subjectsData, categoriesData, cardsData] = await Promise.all([
        RevisionService.getSubjects(),
        RevisionService.getCategories(),
        RevisionService.getStudyCards()
      ]);

      setSubjects(subjectsData);
      setCategories(categoriesData);
      setStudyCards(cardsData);
    } catch (err) {
      console.error('Error fetching revision data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCards = (subjectId?: string, categoryId?: string) => {
    let filtered = studyCards;
    
    if (subjectId) {
      const subjectCategories = categories.filter(cat => cat.subject_id === subjectId);
      const categoryIds = subjectCategories.map(cat => cat.id);
      filtered = filtered.filter(card => categoryIds.includes(card.category_id));
    }
    
    if (categoryId) {
      filtered = filtered.filter(card => card.category_id === categoryId);
    }
    
    return filtered;
  };

  const getSubjectStats = (subjectId: string) => {
    const subjectCategories = categories.filter(cat => cat.subject_id === subjectId);
    const categoryIds = subjectCategories.map(cat => cat.id);
    const cardCount = studyCards.filter(card => categoryIds.includes(card.category_id)).length;
    
    return {
      categoryCount: subjectCategories.length,
      cardCount,
      canPlayGames: cardCount >= 3
    };
  };

  const refreshData = () => {
    fetchData();
  };

  return {
    subjects,
    categories,
    studyCards,
    loading,
    error,
    getFilteredCards,
    getSubjectStats,
    refreshData
  };
};
