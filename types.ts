export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  FILL_IN_BLANK = 'FILL_IN_BLANK',
  REARRANGE = 'REARRANGE'
}

export interface Question {
  id: number;
  type: QuestionType;
  questionText: string; 
  imageUrl?: string;
  audioUrl?: string;
  options?: string[]; 
  rearrangeParts?: string[]; 
  correctAnswer: string; 
  explanation: string;
}

export interface UserAnswer {
  questionId: number;
  userResponse: string;
  isCorrect: boolean;
  skipped?: boolean;
}

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}