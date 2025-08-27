export interface StudyCard {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface GameScore {
  correct: number;
  total: number;
  timeSpent: number;
}

export interface StudySession {
  gameType: string;
  score: GameScore;
  timestamp: Date;
}

export type GameType = "flashcards" | "quiz" | "memory" | "scramble";