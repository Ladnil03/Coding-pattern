import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const bitwiseXorVisualization: VisualizationConfig = {
  type: "array",
  sampleInput: [4, 1, 2, 1, 2],
  inputLabel: "arr = [4, 1, 2, 1, 2]",
  steps: [
    {
      logicalStepId: "xor-step-1",
      label: "Initialize",
      state: {
        array: [4, 1, 2, 1, 2],
        pointers: { i: 0 },
        highlighted: [0],
        currentValue: 'xor_sum = 0 -> 4'
      },
      narration: "Initialize our XOR accumulator to 0. XOR it with the first element (4), resulting in xor_sum = 4.",
    },
    {
      logicalStepId: "xor-step-2",
      label: "XOR with 1",
      state: {
        array: [4, 1, 2, 1, 2],
        pointers: { i: 1 },
        highlighted: [1],
        currentValue: 'xor_sum = 4 -> 5'
      },
      narration: "Advance to index 1. XOR with 1, which updates xor_sum to 5 (binary 101).",
    },
    {
      logicalStepId: "xor-step-3",
      label: "XOR with 2",
      state: {
        array: [4, 1, 2, 1, 2],
        pointers: { i: 2 },
        highlighted: [2],
        currentValue: 'xor_sum = 5 -> 7'
      },
      narration: "Advance to index 2. XOR with 2, updating xor_sum to 7 (binary 111).",
    },
    {
      logicalStepId: "xor-step-4",
      label: "XOR with 1 (Duplicate 1 cancels)",
      state: {
        array: [4, 1, 2, 1, 2],
        pointers: { i: 3 },
        highlighted: [3],
        currentValue: 'xor_sum = 7 -> 6'
      },
      narration: "Advance to index 3. XOR with 1. Since 1 was XORed earlier, this step cancels out the 1 bits, reducing xor_sum to 6 (binary 110).",
    },
    {
      logicalStepId: "xor-step-5",
      label: "XOR with 2 (Duplicate 2 cancels)",
      state: {
        array: [4, 1, 2, 1, 2],
        pointers: { i: 4 },
        highlighted: [4],
        currentValue: 'xor_sum = 6 -> 4'
      },
      narration: "Advance to index 4. XOR with 2. This cancels out the 2 bits. xor_sum returns to 4 (binary 100).",
    },
    {
      logicalStepId: "xor-step-6",
      label: "Finished: Single Number is 4",
      state: {
        array: [4, 1, 2, 1, 2],
        pointers: {},
        highlighted: [],
        currentValue: 'Result = 4'
      },
      narration: "Array traversal complete. All duplicate numbers have cancelled each other out, leaving only the unique single number, which is 4.",
    },
  ],
};

export const bitwiseXorLesson: Lesson = {
  patternId: 'bitwise-xor',
  explanation: `Exploit properties of XOR to solve element matching in O(N) time and O(1) space.`,
  stepByStepReasoning: `Identity: a^0 = a. Self-inverse: a^a = 0. Commutative & Associative. XOR all elements to cancel duplicates.`,
  whenToUse: ['Find single number in duplicates', 'Find missing number'],
  timeComplexity: 'O(N)',
  spaceComplexity: 'O(1)',
  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `int findSingle(vector<int>& arr) {
    int x = 0;
    for(int n : arr) x ^= n;
    return x;
}`,
      lineMapping: { 'xor-step-1': [3,4] }
    },
    python: {
      language: 'python',
      code: `def findSingle(arr):
    x = 0
    for n in arr: x ^= n
    return x`,
      lineMapping: { 'xor-step-1': [2,3] }
    },
    java: {
      language: 'java',
      code: `public int findSingle(int[] arr) {
    int x = 0;
    for(int n : arr) x ^= n;
    return x;
}`,
      lineMapping: { 'xor-step-1': [3,4] }
    }
  },
  visualization: bitwiseXorVisualization,
  challenge: {
    id: "xor-challenge-1",
    question: "How to find missing number in range 1..N+1?",
    type: "multiple-choice",
    options: [
      'XOR all elements in array',
      'XOR all elements, then XOR the result with XOR of 1..N+1',
      'XOR first and last',
      'None'
    ],
    correctAnswer: 1,
    hint: "Numbers present in both will cancel, leaving the missing one.",
    explanation: 'XORing array elements and complete range cancels duplicates, isolating the missing number.'
  }
};
