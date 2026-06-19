export interface StepSnapshot {
  /** Unique logical step ID (language-agnostic) */
  logicalStepId: string;
  /** Human-readable label for this step */
  label: string;
  /** State of the data structure at this step */
  state: VisualizationState;
  /** Description of what happens at this step */
  narration: string;
}

export interface VisualizationState {
  /** Array/list contents (for array-based patterns) */
  array?: (number | string)[];
  /** Named pointer positions */
  pointers?: Record<string, number>;
  /** Window bounds [left, right] inclusive */
  window?: [number, number];
  /** Stack contents */
  stack?: (number | string)[];
  /** Queue contents */
  queue?: (number | string)[];
  /** Set of visited indices/nodes */
  visited?: number[];
  /** Current computed value (sum, count, etc.) */
  currentValue?: number | string;
  /** Highlighted elements (indices that changed this step) */
  highlighted?: number[];
  /** Graph adjacency (for tree/graph patterns) */
  graph?: Record<string, string[]>;
  /** Current node in graph traversal */
  currentNode?: string;
}

export interface VisualizationConfig {
  /** The type of visualization to render */
  type: 'array' | 'linked-list' | 'tree' | 'graph' | 'matrix' | 'stack-queue';
  /** Sample input for the visualization */
  sampleInput: unknown;
  /** Ordered sequence of step snapshots */
  steps: StepSnapshot[];
  /** Input label (e.g., "arr = [1,3,5,2,8], k = 10") */
  inputLabel: string;
}
