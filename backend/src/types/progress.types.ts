// src/types/progress.types.ts
export interface Progress {
  id: string;
  userId: string;
  patternId: string;
  completionPercentage: number;
  completed: boolean;
  lastViewed: Date;
  updatedAt: Date;
}

export interface CreateProgressDto {
  userId: string;
  patternId: string;
  completionPercentage: number;
  completed: boolean;
}

export interface UpdateProgressDto extends Partial<CreateProgressDto> {}
