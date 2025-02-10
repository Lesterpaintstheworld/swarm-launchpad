export type AgeGroup = '4-5' | '6-7' | '8';
export type Mode = 'playful' | 'learning' | 'bedtime';

export interface ResponsesByMode {
  playful: string;
  learning: string;
  bedtime: string;
}

export interface Question {
  question: string;
  responses: Record<AgeGroup, ResponsesByMode>;
}

export interface Responses {
  questions: Record<string, Question>;
}
