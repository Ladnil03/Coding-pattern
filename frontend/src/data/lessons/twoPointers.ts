import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const twoPointersVisualization: VisualizationConfig = {
  type: "array",
  sampleInput: [1, 3, 5, 7, 9, 11],
  inputLabel: "arr = [1, 3, 5, 7, 9, 11], target = 12",
  steps: [
    {
      logicalStepId: "tp-step-1",
      label: "Initialize pointers",
      state: {
        array: [1, 3, 5, 7, 9, 11],
        pointers: { left: 0, right: 5 },
        currentValue: 12,
        highlighted: [0, 5],
      },
      narration: "Place left at index 0, right at index 5. Sum = arr[0]+arr[5] = 1+11 = 12. That equals target!",
    },
    {
      logicalStepId: "tp-step-2",
      label: "Found pair!",
      state: {
        array: [1, 3, 5, 7, 9, 11],
        pointers: { left: 0, right: 5 },
        currentValue: 12,
        highlighted: [0, 5],
      },
      narration: "Sum = 12 = target. Return indices [0, 5]. The pair (1, 11) sums to 12.",
    },
  ],
};

export const twoPointersLesson: Lesson = {
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
    id: "tp-challenge-1",
    question: "Given the sorted array [2, 4, 6, 8, 10, 12] and target = 14, the left pointer starts at index 0 (value 2) and right at index 5 (value 12). Sum = 14 which equals target. But what if target was 10? After comparing arr[0]+arr[5] = 2+12 = 14 > 10, which pointer moves?",
    type: "multiple-choice",
    options: [
      'Left pointer moves right (to index 1)',
      'Right pointer moves left (to index 4)',
      'Both pointers move inward',
      'Neither — the algorithm terminates',
    ],
    correctAnswer: 1,
    hint: "When the current sum is GREATER than target, you need a smaller sum. Since the array is sorted, which direction gives smaller values?",
    explanation: 'Sum 14 > target 10, so we need to decrease the sum. Moving the right pointer left gives us a smaller arr[right], reducing the sum. Right moves to index 4 (value 10), and next sum = 2+10 = 12, still > 10, so right moves again.',
  },
};
