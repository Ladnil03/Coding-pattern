import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const slidingWindowVisualization: VisualizationConfig = {
  type: "array",
  sampleInput: [1, 3, 5, 2, 8, 4, 6],
  inputLabel: "arr = [1, 3, 5, 2, 8, 4, 6], k = 12",
  steps: [
    {
      logicalStepId: "sw-step-1",
      label: "Initialize",
      state: {
        array: [1, 3, 5, 2, 8, 4, 6],
        pointers: { left: 0, right: 0 },
        window: [0, 0],
        currentValue: 1,
        highlighted: [0],
      },
      narration: "Start with both pointers at index 0. Window sum = arr[0] = 1. Since 1 ≤ 12, record window size = 1.",
    },
    {
      logicalStepId: "sw-step-2",
      label: "Expand right to index 1",
      state: {
        array: [1, 3, 5, 2, 8, 4, 6],
        pointers: { left: 0, right: 1 },
        window: [0, 1],
        currentValue: 4,
        highlighted: [1],
      },
      narration: "Add arr[1]=3. sum = 1+3 = 4. Since 4 ≤ 12, record window size = 2.",
    },
    {
      logicalStepId: "sw-step-3",
      label: "Expand right to index 2",
      state: {
        array: [1, 3, 5, 2, 8, 4, 6],
        pointers: { left: 0, right: 2 },
        window: [0, 2],
        currentValue: 9,
        highlighted: [2],
      },
      narration: "Add arr[2]=5. sum = 4+5 = 9. Since 9 ≤ 12, record window size = 3.",
    },
    {
      logicalStepId: "sw-step-4",
      label: "Expand right to index 3",
      state: {
        array: [1, 3, 5, 2, 8, 4, 6],
        pointers: { left: 0, right: 3 },
        window: [0, 3],
        currentValue: 11,
        highlighted: [3],
      },
      narration: "Add arr[3]=2. sum = 9+2 = 11. Since 11 ≤ 12, record window size = 4. Best so far!",
    },
    {
      logicalStepId: "sw-step-5",
      label: "Expand right to index 4",
      state: {
        array: [1, 3, 5, 2, 8, 4, 6],
        pointers: { left: 0, right: 4 },
        window: [0, 4],
        currentValue: 19,
        highlighted: [4],
      },
      narration: "Add arr[4]=8. sum = 11+8 = 19. Since 19 > 12, we need to shrink the window.",
    },
    {
      logicalStepId: "sw-step-6",
      label: "Shrink: move left to index 1",
      state: {
        array: [1, 3, 5, 2, 8, 4, 6],
        pointers: { left: 1, right: 4 },
        window: [1, 4],
        currentValue: 18,
        highlighted: [0],
      },
      narration: "Remove arr[0]=1. sum = 19−1 = 18. Still 18 > 12, shrink again.",
    },
    {
      logicalStepId: "sw-step-7",
      label: "Shrink: move left to index 2",
      state: {
        array: [1, 3, 5, 2, 8, 4, 6],
        pointers: { left: 2, right: 4 },
        window: [2, 4],
        currentValue: 15,
        highlighted: [1],
      },
      narration: "Remove arr[1]=3. sum = 18−3 = 15. Still 15 > 12, shrink again.",
    },
    {
      logicalStepId: "sw-step-8",
      label: "Shrink: move left to index 3",
      state: {
        array: [1, 3, 5, 2, 8, 4, 6],
        pointers: { left: 3, right: 4 },
        window: [3, 4],
        currentValue: 10,
        highlighted: [2],
      },
      narration: "Remove arr[2]=5. sum = 15−5 = 10. Now 10 ≤ 12, window is valid. Size = 2.",
    },
  ],
};

export const slidingWindowLesson: Lesson = {
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
    id: "sw-challenge-1",
    question: "Given arr = [1, 3, 5, 2, 8, 4, 6] and k = 12, after expanding the window to include index 4 (value 8), the sum becomes 19 which exceeds k. How many times does the left pointer need to advance before the window becomes valid again?",
    type: "multiple-choice",
    options: [
      '1 time (left moves to index 1)',
      '2 times (left moves to index 2)',
      '3 times (left moves to index 3)',
      '4 times (left moves to index 4)',
    ],
    correctAnswer: 2,
    hint: "Track the sum after each removal: sum starts at 19. Remove arr[0]=1 → 18. Remove arr[1]=3 → 15. Remove arr[2]=5 → ?. Compare each result to k=12.",
    explanation: 'After including index 4, sum = 19. We remove arr[0]=1 (sum=18, still > 12), arr[1]=3 (sum=15, still > 12), arr[2]=5 (sum=10, now ≤ 12). So left advances 3 times to index 3.',
  },
};
