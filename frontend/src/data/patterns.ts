import type { Pattern, Lesson } from '../types/pattern';
import type { VisualizationConfig } from '../types/visualization';

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

// ─── Full Lesson Data (2 complete patterns for MVP, rest stubbed) ────────────

const slidingWindowVisualization: VisualizationConfig = {
  type: 'array',
  sampleInput: [1, 3, 5, 2, 8, 4, 6],
  inputLabel: 'arr = [1, 3, 5, 2, 8, 4, 6], k = 12',
  steps: [
    {
      logicalStepId: 'sw-step-1',
      label: 'Initialize',
      state: {
        array: [1, 3, 5, 2, 8, 4, 6],
        pointers: { left: 0, right: 0 },
        window: [0, 0],
        currentValue: 1,
        highlighted: [0],
      },
      narration: 'Start with both pointers at index 0. Window sum = arr[0] = 1. Since 1 ≤ 12, record window size = 1.',
    },
    {
      logicalStepId: 'sw-step-2',
      label: 'Expand right to index 1',
      state: {
        array: [1, 3, 5, 2, 8, 4, 6],
        pointers: { left: 0, right: 1 },
        window: [0, 1],
        currentValue: 4,
        highlighted: [1],
      },
      narration: 'Add arr[1]=3. sum = 1+3 = 4. Since 4 ≤ 12, record window size = 2.',
    },
    {
      logicalStepId: 'sw-step-3',
      label: 'Expand right to index 2',
      state: {
        array: [1, 3, 5, 2, 8, 4, 6],
        pointers: { left: 0, right: 2 },
        window: [0, 2],
        currentValue: 9,
        highlighted: [2],
      },
      narration: 'Add arr[2]=5. sum = 4+5 = 9. Since 9 ≤ 12, record window size = 3.',
    },
    {
      logicalStepId: 'sw-step-4',
      label: 'Expand right to index 3',
      state: {
        array: [1, 3, 5, 2, 8, 4, 6],
        pointers: { left: 0, right: 3 },
        window: [0, 3],
        currentValue: 11,
        highlighted: [3],
      },
      narration: 'Add arr[3]=2. sum = 9+2 = 11. Since 11 ≤ 12, record window size = 4. Best so far!',
    },
    {
      logicalStepId: 'sw-step-5',
      label: 'Expand right to index 4',
      state: {
        array: [1, 3, 5, 2, 8, 4, 6],
        pointers: { left: 0, right: 4 },
        window: [0, 4],
        currentValue: 19,
        highlighted: [4],
      },
      narration: 'Add arr[4]=8. sum = 11+8 = 19. Since 19 > 12, we need to shrink the window.',
    },
    {
      logicalStepId: 'sw-step-6',
      label: 'Shrink: move left to index 1',
      state: {
        array: [1, 3, 5, 2, 8, 4, 6],
        pointers: { left: 1, right: 4 },
        window: [1, 4],
        currentValue: 18,
        highlighted: [0],
      },
      narration: 'Remove arr[0]=1. sum = 19−1 = 18. Still 18 > 12, shrink again.',
    },
    {
      logicalStepId: 'sw-step-7',
      label: 'Shrink: move left to index 2',
      state: {
        array: [1, 3, 5, 2, 8, 4, 6],
        pointers: { left: 2, right: 4 },
        window: [2, 4],
        currentValue: 15,
        highlighted: [1],
      },
      narration: 'Remove arr[1]=3. sum = 18−3 = 15. Still 15 > 12, shrink again.',
    },
    {
      logicalStepId: 'sw-step-8',
      label: 'Shrink: move left to index 3',
      state: {
        array: [1, 3, 5, 2, 8, 4, 6],
        pointers: { left: 3, right: 4 },
        window: [3, 4],
        currentValue: 10,
        highlighted: [2],
      },
      narration: 'Remove arr[2]=5. sum = 15−5 = 10. Now 10 ≤ 12, window is valid. Size = 2.',
    },
  ],
};

const slidingWindowLesson: Lesson = {
  patternId: 'sliding-window',
  explanation: `The **Sliding Window** pattern is used to perform operations on a specific window (contiguous subarray) of a given array or string. Instead of recalculating results for every possible subarray (which would be O(n²) or worse), we maintain a window that "slides" through the data — expanding from the right and shrinking from the left — to achieve **O(n)** time complexity.

This pattern transforms brute-force nested loops into a single pass. The key insight is that when the window moves one position, most of the computation from the previous position is reusable — we only need to account for the one element entering and the one element leaving the window.

### Core Mechanics
The window is defined by two pointers: \`left\` and \`right\`. The right pointer expands the window by including new elements, while the left pointer contracts it when some constraint is violated (e.g., sum exceeds a threshold, or a character repeats).

### Common Variations
- **Fixed-size window**: Window size is predetermined (e.g., maximum sum of k consecutive elements)
- **Variable-size window**: Window expands/contracts based on conditions (e.g., smallest subarray with sum ≥ target)
- **String windows**: Finding substrings with certain character constraints`,

  stepByStepReasoning: `1. **Initialize two pointers** at the start of the array: \`left = 0\`, \`right = 0\`. Also initialize any tracking variables (sum, count, hash map).

2. **Expand the window** by moving \`right\` forward and including \`arr[right]\` in the window's state (add to sum, update frequency map, etc.).

3. **Check the constraint**: Is the current window valid? (e.g., sum ≤ k, all characters present, no duplicates)

4. **If invalid, shrink from the left**: Remove \`arr[left]\` from the window's state and increment \`left\`. Repeat until the window is valid again.

5. **Update the answer**: After ensuring the window is valid, check if the current window is the best answer so far (longest, shortest, maximum sum, etc.).

6. **Repeat steps 2–5** until \`right\` reaches the end of the array. The answer has been found in a single pass — O(n) time.`,

  whenToUse: [
    'Finding the longest/shortest subarray or substring satisfying a condition',
    'Maximum/minimum sum of a fixed-size subarray',
    'Counting subarrays with at most K distinct elements',
    'Finding an anagram of a pattern in a text',
    'Any problem asking about "contiguous" sequences with constraints',
  ],

  timeComplexity: 'O(n) — each element is added and removed from the window at most once',
  spaceComplexity: 'O(1) for sum-based problems, O(k) when tracking element frequencies',

  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `// Longest subarray with sum ≤ k
int longestSubarrayWithSumAtMostK(vector<int>& arr, int k) {
    int n = arr.size();
    int left = 0, sum = 0, maxLen = 0;

    for (int right = 0; right < n; right++) {
        sum += arr[right];            // expand window

        while (sum > k) {             // shrink until valid
            sum -= arr[left];
            left++;
        }

        maxLen = max(maxLen, right - left + 1);
    }

    return maxLen;
}`,
      lineMapping: {
        'sw-step-1': [3],
        'sw-step-2': [6],
        'sw-step-3': [6],
        'sw-step-4': [6],
        'sw-step-5': [6, 8],
        'sw-step-6': [9, 10],
        'sw-step-7': [9, 10],
        'sw-step-8': [9, 10, 13],
      },
    },
    python: {
      language: 'python',
      code: `# Longest subarray with sum ≤ k
def longest_subarray_sum_at_most_k(arr: list[int], k: int) -> int:
    left = 0
    current_sum = 0
    max_len = 0

    for right in range(len(arr)):
        current_sum += arr[right]     # expand window

        while current_sum > k:        # shrink until valid
            current_sum -= arr[left]
            left += 1

        max_len = max(max_len, right - left + 1)

    return max_len`,
      lineMapping: {
        'sw-step-1': [3, 4],
        'sw-step-2': [8],
        'sw-step-3': [8],
        'sw-step-4': [8],
        'sw-step-5': [8, 10],
        'sw-step-6': [11, 12],
        'sw-step-7': [11, 12],
        'sw-step-8': [11, 12, 14],
      },
    },
    java: {
      language: 'java',
      code: `// Longest subarray with sum ≤ k
public int longestSubarrayWithSumAtMostK(int[] arr, int k) {
    int left = 0, sum = 0, maxLen = 0;

    for (int right = 0; right < arr.length; right++) {
        sum += arr[right];            // expand window

        while (sum > k) {             // shrink until valid
            sum -= arr[left];
            left++;
        }

        maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
}`,
      lineMapping: {
        'sw-step-1': [3],
        'sw-step-2': [6],
        'sw-step-3': [6],
        'sw-step-4': [6],
        'sw-step-5': [6, 8],
        'sw-step-6': [9, 10],
        'sw-step-7': [9, 10],
        'sw-step-8': [9, 10, 13],
      },
    },
  },

  visualization: slidingWindowVisualization,

  challenge: {
    id: 'sw-challenge-1',
    question: 'Given arr = [1, 3, 5, 2, 8, 4, 6] and k = 12, after expanding the window to include index 4 (value 8), the sum becomes 19 which exceeds k. How many times does the left pointer need to advance before the window becomes valid again?',
    type: 'multiple-choice',
    options: [
      '1 time (left moves to index 1)',
      '2 times (left moves to index 2)',
      '3 times (left moves to index 3)',
      '4 times (left moves to index 4)',
    ],
    correctAnswer: 2,
    hint: 'Track the sum after each removal: sum starts at 19. Remove arr[0]=1 → 18. Remove arr[1]=3 → 15. Remove arr[2]=5 → ?. Compare each result to k=12.',
    explanation: 'After including index 4, sum = 19. We remove arr[0]=1 (sum=18, still > 12), arr[1]=3 (sum=15, still > 12), arr[2]=5 (sum=10, now ≤ 12). So left advances 3 times to index 3.',
  },
};

// ─── Two Pointers Complete Lesson ────────────────────────────────────────────

const twoPointersVisualization: VisualizationConfig = {
  type: 'array',
  sampleInput: [1, 3, 5, 7, 9, 11],
  inputLabel: 'arr = [1, 3, 5, 7, 9, 11], target = 12',
  steps: [
    {
      logicalStepId: 'tp-step-1',
      label: 'Initialize pointers',
      state: {
        array: [1, 3, 5, 7, 9, 11],
        pointers: { left: 0, right: 5 },
        currentValue: 12,
        highlighted: [0, 5],
      },
      narration: 'Place left at index 0, right at index 5. Sum = arr[0]+arr[5] = 1+11 = 12. That equals target!',
    },
    {
      logicalStepId: 'tp-step-2',
      label: 'Found pair!',
      state: {
        array: [1, 3, 5, 7, 9, 11],
        pointers: { left: 0, right: 5 },
        currentValue: 12,
        highlighted: [0, 5],
      },
      narration: 'Sum = 12 = target. Return indices [0, 5]. The pair (1, 11) sums to 12.',
    },
  ],
};

const twoPointersLesson: Lesson = {
  patternId: 'two-pointers',
  explanation: `The **Two Pointers** pattern uses two references (indices or iterators) that traverse a data structure — typically a sorted array — from different positions or at different speeds. By maintaining two "cursors," we can solve problems in **O(n)** time that would otherwise require O(n²) with brute force.

### Core Idea
Instead of checking every pair of elements (nested loops), we use the sorted order to intelligently skip unnecessary comparisons. If the current pair's sum is too small, we move the left pointer right to increase it. If it's too large, we move the right pointer left to decrease it.

### Variants
- **Opposite-direction**: Left starts at beginning, right at end — classic pair-sum
- **Same-direction**: Both start at beginning, one moves faster — removing duplicates
- **Three pointers**: Extension for 3Sum problems`,

  stepByStepReasoning: `1. **Sort the array** (if not already sorted). Two pointers requires monotonic ordering.

2. **Initialize pointers**: Set \`left = 0\` and \`right = n - 1\` (opposite ends).

3. **Compute the current pair's value**: \`sum = arr[left] + arr[right]\`.

4. **Compare to target**: If sum equals target, we found the answer. If sum < target, increment \`left\` (we need a larger value). If sum > target, decrement \`right\` (we need a smaller value).

5. **Repeat** until \`left < right\`. Each iteration eliminates at least one candidate, ensuring O(n) total steps.

6. **Edge cases**: Handle no-solution (pointers meet), duplicates (skip equal adjacent values), and negative numbers (sorting handles sign).`,

  whenToUse: [
    'Finding a pair in a sorted array that sums to a target',
    'Removing duplicates from a sorted array in-place',
    'Comparing strings character by character (palindrome check)',
    'Merging two sorted arrays',
    'Container with most water / trapping rain water',
  ],

  timeComplexity: 'O(n) after sorting — each pointer moves at most n times total',
  spaceComplexity: 'O(1) — only two index variables needed',

  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `// Two Sum in sorted array — return indices of pair
vector<int> twoSumSorted(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;

    while (left < right) {
        int sum = arr[left] + arr[right];

        if (sum == target) {
            return {left, right};     // found!
        } else if (sum < target) {
            left++;                   // need larger sum
        } else {
            right--;                  // need smaller sum
        }
    }

    return {};  // no pair found
}`,
      lineMapping: {
        'tp-step-1': [3, 6],
        'tp-step-2': [8],
      },
    },
    python: {
      language: 'python',
      code: `# Two Sum in sorted array — return indices of pair
def two_sum_sorted(arr: list[int], target: int) -> list[int]:
    left, right = 0, len(arr) - 1

    while left < right:
        current_sum = arr[left] + arr[right]

        if current_sum == target:
            return [left, right]      # found!
        elif current_sum < target:
            left += 1                 # need larger sum
        else:
            right -= 1               # need smaller sum

    return []  # no pair found`,
      lineMapping: {
        'tp-step-1': [3, 6],
        'tp-step-2': [9],
      },
    },
    java: {
      language: 'java',
      code: `// Two Sum in sorted array — return indices of pair
public int[] twoSumSorted(int[] arr, int target) {
    int left = 0, right = arr.length - 1;

    while (left < right) {
        int sum = arr[left] + arr[right];

        if (sum == target) {
            return new int[]{left, right};  // found!
        } else if (sum < target) {
            left++;                          // need larger sum
        } else {
            right--;                         // need smaller sum
        }
    }

    return new int[]{};  // no pair found
}`,
      lineMapping: {
        'tp-step-1': [3, 6],
        'tp-step-2': [9],
      },
    },
  },

  visualization: twoPointersVisualization,

  challenge: {
    id: 'tp-challenge-1',
    question: 'Given the sorted array [2, 4, 6, 8, 10, 12] and target = 14, the left pointer starts at index 0 (value 2) and right at index 5 (value 12). Sum = 14 which equals target. But what if target was 10? After comparing arr[0]+arr[5] = 2+12 = 14 > 10, which pointer moves?',
    type: 'multiple-choice',
    options: [
      'Left pointer moves right (to index 1)',
      'Right pointer moves left (to index 4)',
      'Both pointers move inward',
      'Neither — the algorithm terminates',
    ],
    correctAnswer: 1,
    hint: 'When the current sum is GREATER than target, you need a smaller sum. Since the array is sorted, which direction gives smaller values?',
    explanation: 'Sum 14 > target 10, so we need to decrease the sum. Moving the right pointer left gives us a smaller arr[right], reducing the sum. Right moves to index 4 (value 10), and next sum = 2+10 = 12, still > 10, so right moves again.',
  },
};

// ─── Lessons Map (complete data for 2 patterns, stubs for the rest) ──────────

function createStubLesson(patternId: string, title: string): Lesson {
  return {
    patternId,
    explanation: `# ${title}\n\nThis lesson is coming soon. The ${title} pattern will be covered with full explanation, reference code in C++/Python/Java, step-by-step visualization, and a conceptual challenge.\n\nCheck back soon!`,
    stepByStepReasoning: '1. Coming soon...',
    whenToUse: ['Details coming soon'],
    timeComplexity: 'TBD',
    spaceComplexity: 'TBD',
    referenceCode: {
      cpp: { language: 'cpp', code: '// Coming soon', lineMapping: {} },
      python: { language: 'python', code: '# Coming soon', lineMapping: {} },
      java: { language: 'java', code: '// Coming soon', lineMapping: {} },
    },
    visualization: {
      type: 'array',
      sampleInput: [],
      inputLabel: 'Coming soon',
      steps: [],
    },
    challenge: {
      id: `${patternId}-challenge-stub`,
      question: 'This challenge is coming soon.',
      type: 'multiple-choice',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      hint: 'Check back soon!',
      explanation: 'This challenge has not been authored yet.',
    },
  };
}

export const lessons: Record<string, Lesson> = {
  'sliding-window': slidingWindowLesson,
  'two-pointers': twoPointersLesson,
  'fast-slow-pointers': createStubLesson('fast-slow-pointers', 'Fast & Slow Pointers'),
  'merge-intervals': createStubLesson('merge-intervals', 'Merge Intervals'),
  'cyclic-sort': createStubLesson('cyclic-sort', 'Cyclic Sort'),
  'monotonic-stack': createStubLesson('monotonic-stack', 'Monotonic Stack'),
  'modified-binary-search': createStubLesson('modified-binary-search', 'Modified Binary Search'),
  'top-k-elements': createStubLesson('top-k-elements', 'Top K Elements'),
  'k-way-merge': createStubLesson('k-way-merge', 'K-way Merge'),
  'bfs': createStubLesson('bfs', 'Breadth-First Search'),
  'dfs': createStubLesson('dfs', 'Depth-First Search'),
  'topological-sort': createStubLesson('topological-sort', 'Topological Sort'),
  'subsets-backtracking': createStubLesson('subsets-backtracking', 'Subsets / Backtracking'),
  'bitwise-xor': createStubLesson('bitwise-xor', 'Bitwise XOR'),
  'dp-01-knapsack': createStubLesson('dp-01-knapsack', '0/1 Knapsack'),
  'dp-unbounded-knapsack': createStubLesson('dp-unbounded-knapsack', 'Unbounded Knapsack'),
  'dp-lcs-lis': createStubLesson('dp-lcs-lis', 'LCS / LIS'),
  'dp-palindromes': createStubLesson('dp-palindromes', 'Palindromes'),
  'dp-matrix-chain': createStubLesson('dp-matrix-chain', 'Matrix Chain / Interval'),
  'union-find': createStubLesson('union-find', 'Union Find'),
};

export function getLessonByPatternId(patternId: string): Lesson | undefined {
  return lessons[patternId];
}
