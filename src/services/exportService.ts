import { RevisionService } from './revisionService';
import type { Tables } from '@/integrations/supabase/types';

type Subject = Tables<'subjects'>;
type Category = Tables<'categories'>;
type StudyCard = Tables<'study_cards'>;

export interface ExportData {
  subjects: Subject[];
  categories: Category[];
  studyCards: StudyCard[];
  exportedAt: string;
  version: string;
}

export class ExportService {
  static readonly VERSION = '1.0.0';

  // Export all revision data to JSON
  static async exportData(): Promise<ExportData | null> {
    try {
      const [subjects, categories, studyCards] = await Promise.all([
        RevisionService.getSubjects(),
        RevisionService.getCategories(),
        RevisionService.getStudyCards()
      ]);

      const exportData: ExportData = {
        subjects,
        categories,
        studyCards,
        exportedAt: new Date().toISOString(),
        version: this.VERSION
      };

      // Create and download the file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `revision-cards-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return exportData;
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  // Import revision data from JSON
  static async importData(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const importData: ExportData = JSON.parse(text);

      // Validate the import data
      if (!this.validateImportData(importData)) {
        throw new Error('Invalid import data format');
      }

      // Import subjects first
      for (const subject of importData.subjects) {
        await RevisionService.createSubject({
          name: subject.name,
          description: subject.description,
          created_by: subject.created_by || ''
        });
      }

      // Import categories
      for (const category of importData.categories) {
        await RevisionService.createCategory({
          name: category.name,
          description: category.description,
          subject_id: category.subject_id,
          created_by: category.created_by || ''
        });
      }

      // Import study cards
      for (const card of importData.studyCards) {
        await RevisionService.createStudyCard({
          question: card.question,
          answer: card.answer,
          category_id: card.category_id,
          created_by: card.created_by || ''
        });
      }

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Validate import data structure
  private static validateImportData(data: any): data is ExportData {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.subjects) &&
      Array.isArray(data.categories) &&
      Array.isArray(data.studyCards) &&
      typeof data.exportedAt === 'string' &&
      typeof data.version === 'string'
    );
  }

  // Get data summary for display
  static async getDataSummary(): Promise<{
    subjectCount: number;
    categoryCount: number;
    cardCount: number;
    totalSize: string;
  }> {
    try {
      const [subjects, categories, studyCards] = await Promise.all([
        RevisionService.getSubjects(),
        RevisionService.getCategories(),
        RevisionService.getStudyCards()
      ]);

      const exportData: ExportData = {
        subjects,
        categories,
        studyCards,
        exportedAt: new Date().toISOString(),
        version: this.VERSION
      };

      const dataStr = JSON.stringify(exportData);
      const sizeInBytes = new Blob([dataStr]).size;
      const totalSize = this.formatBytes(sizeInBytes);

      return {
        subjectCount: subjects.length,
        categoryCount: categories.length,
        cardCount: studyCards.length,
        totalSize
      };
    } catch (error) {
      console.error('Error getting data summary:', error);
      return {
        subjectCount: 0,
        categoryCount: 0,
        cardCount: 0,
        totalSize: '0 B'
      };
    }
  }

  // Format bytes to human readable format
  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
