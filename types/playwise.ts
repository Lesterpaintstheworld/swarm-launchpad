type AgeGroup = '4-5' | '6-7' | '8';
type Mode = 'playful' | 'learning' | 'bedtime';

interface ResponsesByMode {
  playful: string;
  learning: string;
  bedtime: string;
}

interface Question {
  question: string;
  responses: {
    [K in AgeGroup]: ResponsesByMode;
  };
}

export interface Responses {
  questions: {
    [key: string]: Question;
  };
}
