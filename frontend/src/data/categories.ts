import type { Category } from '../types/pattern';

export const categories: Category[] = [
  {
    id: 'array-string',
    title: 'Array & String Patterns',
    description: 'Fundamental techniques for processing sequences efficiently',
    icon: '📊',
    patternIds: ['sliding-window', 'two-pointers', 'fast-slow-pointers', 'merge-intervals', 'cyclic-sort', 'monotonic-stack'],
  },
  {
    id: 'search-sort',
    title: 'Search & Sort Patterns',
    description: 'Efficient search and ordering strategies',
    icon: '🔍',
    patternIds: ['modified-binary-search', 'top-k-elements', 'k-way-merge'],
  },
  {
    id: 'tree-graph',
    title: 'Tree & Graph Patterns',
    description: 'Traversal and structural exploration of connected data',
    icon: '🌳',
    patternIds: ['bfs', 'dfs', 'topological-sort'],
  },
  {
    id: 'backtracking-subsets',
    title: 'Backtracking & Subsets',
    description: 'Systematic enumeration and combinatorial exploration',
    icon: '🧩',
    patternIds: ['subsets-backtracking', 'bitwise-xor'],
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming Patterns',
    description: 'Optimal substructure and overlapping subproblems',
    icon: '🧮',
    patternIds: ['dp-01-knapsack', 'dp-unbounded-knapsack', 'dp-lcs-lis', 'dp-palindromes', 'dp-matrix-chain'],
  },
  {
    id: 'advanced',
    title: 'Advanced Pattern',
    description: 'Specialized data structures for complex problems',
    icon: '⚡',
    patternIds: ['union-find'],
  },
];
