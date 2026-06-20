// src/types/pattern.types.ts
export interface Pattern {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  description: string;
  content: string;
  estimatedTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePatternDto {
  slug: string;
  title: string;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  description: string;
  content: string;
  estimatedTime: number;
}

export interface UpdatePatternDto extends Partial<CreatePatternDto> {}
