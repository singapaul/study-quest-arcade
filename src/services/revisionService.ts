import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Subject = Tables<'subjects'>;
type Category = Tables<'categories'>;
type StudyCard = Tables<'study_cards'>;

export class RevisionService {
  // ===== SUBJECTS =====
  static async createSubject(data: Omit<Subject, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<Subject | null> {
    try {
      const { data: subject, error } = await supabase
        .from('subjects')
        .insert({
          ...data,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Subject created successfully!');
      return subject;
    } catch (error) {
      console.error('Error creating subject:', error);
      toast.error('Failed to create subject');
      return null;
    }
  }

  static async updateSubject(id: string, data: Partial<Subject>): Promise<Subject | null> {
    try {
      const { data: subject, error } = await supabase
        .from('subjects')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Subject updated successfully!');
      return subject;
    } catch (error) {
      console.error('Error updating subject:', error);
      toast.error('Failed to update subject');
      return null;
    }
  }

  static async deleteSubject(id: string): Promise<boolean> {
    try {
      // Soft delete - mark as inactive
      const { error } = await supabase
        .from('subjects')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Subject deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast.error('Failed to delete subject');
      return false;
    }
  }

  static async getSubjects(): Promise<Subject[]> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to load subjects');
      return [];
    }
  }

  // ===== CATEGORIES =====
  static async createCategory(data: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<Category | null> {
    try {
      const { data: category, error } = await supabase
        .from('categories')
        .insert({
          ...data,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Category created successfully!');
      return category;
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
      return null;
    }
  }

  static async updateCategory(id: string, data: Partial<Category>): Promise<Category | null> {
    try {
      const { data: category, error } = await supabase
        .from('categories')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Category updated successfully!');
      return category;
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
      return null;
    }
  }

  static async deleteCategory(id: string): Promise<boolean> {
    try {
      // Soft delete - mark as inactive
      const { error } = await supabase
        .from('categories')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Category deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
      return false;
    }
  }

  static async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      return [];
    }
  }

  static async getCategoriesBySubject(subjectId: string): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('subject_id', subjectId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories by subject:', error);
      return [];
    }
  }

  // ===== STUDY CARDS =====
  static async createStudyCard(data: Omit<StudyCard, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<StudyCard | null> {
    try {
      const { data: card, error } = await supabase
        .from('study_cards')
        .insert({
          ...data,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Study card created successfully!');
      return card;
    } catch (error) {
      console.error('Error creating study card:', error);
      toast.error('Failed to create study card');
      return null;
    }
  }

  static async updateStudyCard(id: string, data: Partial<StudyCard>): Promise<StudyCard | null> {
    try {
      const { data: card, error } = await supabase
        .from('study_cards')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Study card updated successfully!');
      return card;
    } catch (error) {
      console.error('Error updating study card:', error);
      toast.error('Failed to update study card');
      return null;
    }
  }

  static async deleteStudyCard(id: string): Promise<boolean> {
    try {
      // Soft delete - mark as inactive
      const { error } = await supabase
        .from('study_cards')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Study card deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting study card:', error);
      toast.error('Failed to delete study card');
      return false;
    }
  }

  static async getStudyCards(): Promise<StudyCard[]> {
    try {
      const { data, error } = await supabase
        .from('study_cards')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching study cards:', error);
      toast.error('Failed to load study cards');
      return [];
    }
  }

  static async getStudyCardsByCategory(categoryId: string): Promise<StudyCard[]> {
    try {
      const { data, error } = await supabase
        .from('study_cards')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching study cards by category:', error);
      return [];
    }
  }

  static async getStudyCardsBySubject(subjectId: string): Promise<StudyCard[]> {
    try {
      // First get categories for the subject
      const categories = await this.getCategoriesBySubject(subjectId);
      const categoryIds = categories.map(cat => cat.id);
      
      if (categoryIds.length === 0) return [];

      // Then get study cards for those categories
      const { data, error } = await supabase
        .from('study_cards')
        .select('*')
        .in('category_id', categoryIds)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching study cards by subject:', error);
      return [];
    }
  }

  // ===== BULK OPERATIONS =====
  static async bulkCreateStudyCards(cards: Array<Omit<StudyCard, 'id' | 'created_at' | 'updated_at' | 'is_active'>>): Promise<StudyCard[]> {
    try {
      const cardsWithMetadata = cards.map(card => ({
        ...card,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('study_cards')
        .insert(cardsWithMetadata)
        .select();

      if (error) throw error;
      
      toast.success(`${cards.length} study cards created successfully!`);
      return data || [];
    } catch (error) {
      console.error('Error bulk creating study cards:', error);
      toast.error('Failed to create study cards');
      return [];
    }
  }

  // ===== DATA VALIDATION =====
  static validateStudyCard(data: Partial<StudyCard>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.question || data.question.trim().length === 0) {
      errors.push('Question is required');
    }

    if (!data.answer || data.answer.trim().length === 0) {
      errors.push('Answer is required');
    }

    if (!data.category_id) {
      errors.push('Category is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateCategory(data: Partial<Category>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Category name is required');
    }

    if (!data.subject_id) {
      errors.push('Subject is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateSubject(data: Partial<Subject>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Subject name is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
