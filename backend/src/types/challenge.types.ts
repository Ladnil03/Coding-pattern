// src/types/challenge.types.ts
export interface Challenge {
  id: string;
  patternId: string;
  question: string;
  options: string[];
  answer: string;
  hint: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChallengeDto {
  patternId: string;
  question: string;
  options: string[];
  answer: string;
  hint: string;
}

export interface SubmitChallengeDto {
  challengeId: string;
  answer: string;
}

export interface ChallengeResult {
  challengeId: string;
  isCorrect: boolean;
  correctAnswer: string;
}
