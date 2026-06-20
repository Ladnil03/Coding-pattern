import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const cyclicSortVisualization: VisualizationConfig = {
  type: "array",
  sampleInput: [3, 1, 5, 4, 2],
  inputLabel: "arr = [3, 1, 5, 4, 2]",
  steps: [
    {
      logicalStepId: "cs-step-1",
      label: "Inspect index 0 (val 3)",
      state: {
        array: [3, 1, 5, 4, 2],
        pointers: { i: 0 },
        highlighted: [0, 2]
      },
      narration: "Value 3 is at index 0. Its correct position is index 2. Since index 2 contains 5, swap index 0 and 2.",
    },
    {
      logicalStepId: "cs-step-2",
      label: "Inspect index 0 (val 5)",
      state: {
        array: [5, 1, 3, 4, 2],
        pointers: { i: 0 },
        highlighted: [0, 4]
      },
      narration: "After swap, index 0 contains 5. Correct position for 5 is index 4. Swap index 0 and 4.",
    },
    {
      logicalStepId: "cs-step-3",
      label: "Inspect index 0 (val 2)",
      state: {
        array: [2, 1, 3, 4, 5],
        pointers: { i: 0 },
        highlighted: [0, 1]
      },
      narration: "After swap, index 0 contains 2. Correct position for 2 is index 1. Swap index 0 and 1.",
    },
    {
      logicalStepId: "cs-step-4",
      label: "Inspect index 0 (val 1)",
      state: {
        array: [1, 2, 3, 4, 5],
        pointers: { i: 0 },
        highlighted: [0]
      },
      narration: "Index 0 now contains 1, which is correct. Advance our loop index i to 1.",
    },
    {
      logicalStepId: "cs-step-5",
      label: "Inspect index 1 (val 2)",
      state: {
        array: [1, 2, 3, 4, 5],
        pointers: { i: 1 },
        highlighted: [1]
      },
      narration: "Index 1 contains 2, which is correct. Advance i to 2.",
    },
    {
      logicalStepId: "cs-step-6",
      label: "Sort Completed",
      state: {
        array: [1, 2, 3, 4, 5],
        pointers: {},
        highlighted: []
      },
      narration: "Remaining elements are already in their correct places. The sorting is complete!",
    },
  ],
};

export const cyclicSortLesson: Lesson = {
  patternId: 'cyclic-sort',
  explanation: `The **Cyclic Sort** pattern is an incredibly powerful approach for sorting arrays containing numbers in a given range, typically [1, n] or [0, n] in O(n) time and O(1) space.`,
  stepByStepReasoning: `1. Start index i=0. Determine correctIdx = arr[i]-1. If arr[i] != arr[correctIdx], swap; else, increment i.`,
  whenToUse: ['Numbers in range 1 to N', 'Find missing/duplicate numbers'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1) in-place',
  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `void cyclicSort(vector<int>& arr) {
    int i = 0;
    while (i < arr.size()) {
        int correctIdx = arr[i] - 1;
        if (arr[i] != arr[correctIdx]) swap(arr[i], arr[correctIdx]);
        else i++;
    }
}`,
      lineMapping: { 'cs-step-1': [3,4,5,6], 'cs-step-6': [8] }
    },
    python: {
      language: 'python',
      code: `def cyclic_sort(arr):
    i = 0
    while i < len(arr):
        correct = arr[i] - 1
        if arr[i] != arr[correct]: arr[i], arr[correct] = arr[correct], arr[i]
        else: i += 1`,
      lineMapping: { 'cs-step-1': [3,4,5], 'cs-step-6': [7] }
    },
    java: {
      language: 'java',
      code: `public void cyclicSort(int[] arr) {
    int i = 0;
    while (i < arr.length) {
        int correct = arr[i] - 1;
        if (arr[i] != arr[correct]) {
            int tmp = arr[i]; arr[i] = arr[correct]; arr[correct] = tmp;
        } else i++;
    }
}`,
      lineMapping: { 'cs-step-1': [3,4,5,6], 'cs-step-6': [8] }
    }
  },
  visualization: cyclicSortVisualization,
  challenge: {
    id: "cs-challenge-1",
    question: "How many swaps in the worst case for size N?",
    type: "multiple-choice",
    options: ["N - 1 swaps", "N*N swaps", "N log N swaps", "2N swaps"],
    correctAnswer: 0,
    hint: "Each swap places at least one element correctly.",
    explanation: 'At most N-1 swaps will place N-1 elements correctly, and the last will automatically fall into place.'
  }
};
