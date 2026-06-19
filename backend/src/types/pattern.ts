import { VisualizationConfig } from './visualization.js';

export type Language = 'cpp' | 'python' | 'java';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type CategoryId =
  | 'array-string'
  | 'search-sort'
  | 'tree-graph'
  | 'backtracking-subsets'
  | 'dynamic-programming'
  | 'advanced';

export interface ReferenceCode {
  language: Language;
  code: string;
  /** Maps logical step IDs → line numbers in this language's code */
  lineMapping: Record<string, number[]>;
}

export interface Pattern {
  id: string;
  title: string;
  category: CategoryId;
  difficulty: Difficulty;
  tags: string[];
  /** Brief one-line summary shown on cards */
  summary: string;
  /** Emoji icon for the pattern */
  icon: string;
}

export interface Lesson {
  patternId: string;
  /** Markdown content for the explanation */
  explanation: string;
  /** Step-by-step reasoning (markdown) */
  stepByStepReasoning: string;
  /** When to use this pattern */
  whenToUse: string[];
  /** Time complexity */
  timeComplexity: string;
  /** Space complexity */
  spaceComplexity: string;
  /** Canonical code in 3 languages */
  referenceCode: Record<Language, ReferenceCode>;
  /** Static visualization config */
  visualization: VisualizationConfig;
  /** Conceptual challenge */
  challenge: ConceptualChallenge;
}

export interface ConceptualChallenge {
  id: string;
  question: string;
  /** 'multiple-choice' | 'step-ordering' */
  type: 'multiple-choice' | 'step-ordering';
  options: string[];
  correctAnswer: number; // index of correct option
  hint: string;
  explanation: string; // shown after answering
}

export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  icon: string; // emoji
  patternIds: string[];
}
