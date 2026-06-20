import type { Pattern, Lesson } from '../types/pattern';

import { slidingWindowLesson } from './lessons/slidingWindow';
import { twoPointersLesson } from './lessons/twoPointers';
import { fastSlowPointersLesson } from './lessons/fastSlowPointers';
import { mergeIntervalsLesson } from './lessons/mergeIntervals';
import { cyclicSortLesson } from './lessons/cyclicSort';
import { monotonicStackLesson } from './lessons/monotonicStack';
import { modifiedBinarySearchLesson } from './lessons/modifiedBinarySearch';
import { topKElementsLesson } from './lessons/topKElements';
import { kWayMergeLesson } from './lessons/kWayMerge';
import { bfsLesson } from './lessons/bfs';
import { dfsLesson } from './lessons/dfs';
import { topologicalSortLesson } from './lessons/topologicalSort';
import { subsetsBacktrackingLesson } from './lessons/subsetsBacktracking';
import { bitwiseXorLesson } from './lessons/bitwiseXor';
import { dp01KnapsackLesson } from './lessons/dp01Knapsack';
import { dpUnboundedKnapsackLesson } from './lessons/dpUnboundedKnapsack';
import { dpLcsLisLesson } from './lessons/dpLcsLis';
import { dpPalindromesLesson } from './lessons/dpPalindromes';
import { dpMatrixChainLesson } from './lessons/dpMatrixChain';
import { unionFindLesson } from './lessons/unionFind';

// ─── All 20 Pattern Metadata ─────────────────────────────────────────────────

export const patterns: Pattern[] = [
  // Array & String
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    category: 'array-string',
    difficulty: 'intermediate',
    tags: ['array', 'subarray', 'optimization'],
    summary: 'Maintain a dynamic window over a contiguous subarray to optimize brute-force nested loops.',
    icon: '🪟',
  },
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    category: 'array-string',
    difficulty: 'beginner',
    tags: ['array', 'sorted', 'in-place'],
    summary: 'Use two indices moving toward or away from each other to solve problems on sorted data.',
    icon: '👆',
  },
  {
    id: 'fast-slow-pointers',
    title: 'Fast & Slow Pointers',
    category: 'array-string',
    difficulty: 'intermediate',
    tags: ['linked-list', 'cycle-detection'],
    summary: 'Detect cycles or find midpoints using two pointers moving at different speeds.',
    icon: '🐢',
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    category: 'array-string',
    difficulty: 'intermediate',
    tags: ['intervals', 'sorting', 'greedy'],
    summary: 'Sort and merge overlapping intervals by comparing end and start boundaries.',
    icon: '📏',
  },
  {
    id: 'cyclic-sort',
    title: 'Cyclic Sort',
    category: 'array-string',
    difficulty: 'intermediate',
    tags: ['array', 'in-place', 'missing-number'],
    summary: 'Place each element at its correct index to find missing or duplicate numbers in O(n).',
    icon: '🔄',
  },
  {
    id: 'monotonic-stack',
    title: 'Monotonic Stack',
    category: 'array-string',
    difficulty: 'advanced',
    tags: ['stack', 'next-greater', 'histogram'],
    summary: 'Maintain a stack with monotonic ordering to efficiently find next greater/smaller elements.',
    icon: '📚',
  },
  // Search & Sort
  {
    id: 'modified-binary-search',
    title: 'Modified Binary Search',
    category: 'search-sort',
    difficulty: 'intermediate',
    tags: ['binary-search', 'sorted', 'logarithmic'],
    summary: 'Adapt classic binary search for rotated arrays, finding boundaries, and search spaces.',
    icon: '🎯',
  },
  {
    id: 'top-k-elements',
    title: 'Top K Elements (Heap)',
    category: 'search-sort',
    difficulty: 'intermediate',
    tags: ['heap', 'priority-queue', 'selection'],
    summary: 'Use a min/max heap to efficiently track the K largest or smallest elements.',
    icon: '🏔️',
  },
  {
    id: 'k-way-merge',
    title: 'K-way Merge',
    category: 'search-sort',
    difficulty: 'advanced',
    tags: ['heap', 'merge', 'sorted-lists'],
    summary: 'Merge K sorted arrays or lists using a min-heap to always pick the smallest head.',
    icon: '🔀',
  },
  // Tree & Graph
  {
    id: 'bfs',
    title: 'Breadth-First Search',
    category: 'tree-graph',
    difficulty: 'beginner',
    tags: ['tree', 'graph', 'level-order', 'queue'],
    summary: 'Explore nodes level by level using a queue — ideal for shortest paths and level-order traversal.',
    icon: '🌊',
  },
  {
    id: 'dfs',
    title: 'Depth-First Search',
    category: 'tree-graph',
    difficulty: 'beginner',
    tags: ['tree', 'graph', 'recursion', 'stack'],
    summary: 'Explore as deep as possible along each branch before backtracking.',
    icon: '🏊',
  },
  {
    id: 'topological-sort',
    title: 'Topological Sort',
    category: 'tree-graph',
    difficulty: 'advanced',
    tags: ['dag', 'ordering', 'dependencies'],
    summary: 'Order vertices of a DAG so every directed edge goes from earlier to later in the sequence.',
    icon: '📋',
  },
  // Backtracking & Subsets
  {
    id: 'subsets-backtracking',
    title: 'Subsets / Backtracking',
    category: 'backtracking-subsets',
    difficulty: 'intermediate',
    tags: ['recursion', 'combinations', 'permutations'],
    summary: 'Systematically generate all subsets, combinations, or permutations using recursive backtracking.',
    icon: '🎲',
  },
  {
    id: 'bitwise-xor',
    title: 'Bitwise XOR',
    category: 'backtracking-subsets',
    difficulty: 'intermediate',
    tags: ['bit-manipulation', 'xor', 'single-number'],
    summary: 'Exploit XOR properties (a⊕a=0, a⊕0=a) to find unique elements without extra space.',
    icon: '⊕',
  },
  // Dynamic Programming
  {
    id: 'dp-01-knapsack',
    title: 'DP: 0/1 Knapsack',
    category: 'dynamic-programming',
    difficulty: 'intermediate',
    tags: ['dp', 'knapsack', 'optimization'],
    summary: 'Choose items with given weights and values to maximize value within a weight capacity.',
    icon: '🎒',
  },
  {
    id: 'dp-unbounded-knapsack',
    title: 'DP: Unbounded Knapsack',
    category: 'dynamic-programming',
    difficulty: 'intermediate',
    tags: ['dp', 'knapsack', 'coin-change'],
    summary: 'Like 0/1 knapsack but each item can be selected unlimited times — coin change, rod cutting.',
    icon: '💰',
  },
  {
    id: 'dp-lcs-lis',
    title: 'DP: LCS / LIS',
    category: 'dynamic-programming',
    difficulty: 'advanced',
    tags: ['dp', 'subsequence', 'string'],
    summary: 'Find longest common or increasing subsequences using 2D or 1D DP tables.',
    icon: '📈',
  },
  {
    id: 'dp-palindromes',
    title: 'DP: Palindromes',
    category: 'dynamic-programming',
    difficulty: 'advanced',
    tags: ['dp', 'string', 'palindrome'],
    summary: 'Detect palindromic substrings/subsequences using expand-around-center or interval DP.',
    icon: '🪞',
  },
  {
    id: 'dp-matrix-chain',
    title: 'DP: Matrix Chain / Interval',
    category: 'dynamic-programming',
    difficulty: 'advanced',
    tags: ['dp', 'interval', 'optimization'],
    summary: 'Optimize over all possible split points in an interval — matrix multiplication, burst balloons.',
    icon: '🔢',
  },
  // Advanced
  {
    id: 'union-find',
    title: 'Union Find (Disjoint Set)',
    category: 'advanced',
    difficulty: 'advanced',
    tags: ['union-find', 'connectivity', 'graph'],
    summary: 'Track connected components with near-constant time union and find via path compression.',
    icon: '🔗',
  },
];

// ─── Helper to get pattern by ID ─────────────────────────────────────────────

export function getPatternById(id: string): Pattern | undefined {
  return patterns.find((p) => p.id === id);
}



// ─── Lessons Map (complete data for 2 patterns, stubs for the rest) ──────────

export const lessons: Record<string, Lesson> = {
  'sliding-window': slidingWindowLesson,
  'two-pointers': twoPointersLesson,
  'fast-slow-pointers': fastSlowPointersLesson,
  'merge-intervals': mergeIntervalsLesson,
  'cyclic-sort': cyclicSortLesson,
  'monotonic-stack': monotonicStackLesson,
  'modified-binary-search': modifiedBinarySearchLesson,
  'top-k-elements': topKElementsLesson,
  'k-way-merge': kWayMergeLesson,
  'bfs': bfsLesson,
  'dfs': dfsLesson,
  'topological-sort': topologicalSortLesson,
  'subsets-backtracking': subsetsBacktrackingLesson,
  'bitwise-xor': bitwiseXorLesson,
  'dp-01-knapsack': dp01KnapsackLesson,
  'dp-unbounded-knapsack': dpUnboundedKnapsackLesson,
  'dp-lcs-lis': dpLcsLisLesson,
  'dp-palindromes': dpPalindromesLesson,
  'dp-matrix-chain': dpMatrixChainLesson,
  'union-find': unionFindLesson,
};

export function getLessonByPatternId(patternId: string): Lesson | undefined {
  return lessons[patternId];
}
