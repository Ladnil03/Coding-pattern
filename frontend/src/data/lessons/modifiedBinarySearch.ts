import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const modifiedBinarySearchVisualization: VisualizationConfig = {
  type: "array",
  sampleInput: [4, 5, 6, 7, 0, 1, 2],
  inputLabel: "arr = [4, 5, 6, 7, 0, 1, 2], target = 0",
  steps: [
    {
      logicalStepId: "mbs-step-1",
      label: "Initialize boundaries",
      state: {
        array: [4, 5, 6, 7, 0, 1, 2],
        pointers: { low: 0, high: 6, mid: 3 },
        highlighted: [3],
        currentValue: 'mid_val = 7'
      },
      narration: "Set low = 0 (val 4) and high = 6 (val 2). Mid is index 3 (val 7). Since arr[low] <= arr[mid] (4 <= 7), the left half is sorted.",
    },
    {
      logicalStepId: "mbs-step-2",
      label: "Search right half",
      state: {
        array: [4, 5, 6, 7, 0, 1, 2],
        pointers: { low: 4, high: 6, mid: 5 },
        highlighted: [5],
        currentValue: 'mid_val = 1'
      },
      narration: "Target 0 does not fall within the sorted left range [4, 7] (0 < 4). Therefore, search in right half by setting low = 4. New mid is index 5 (val 1).",
    },
    {
      logicalStepId: "mbs-step-3",
      label: "Search left portion of right half",
      state: {
        array: [4, 5, 6, 7, 0, 1, 2],
        pointers: { low: 4, high: 4, mid: 4 },
        highlighted: [4],
        currentValue: 'mid_val = 0'
      },
      narration: "The sub-range [0, 1] is sorted, and target 0 is in it. Set high = mid - 1 = 4. New mid is index 4 (val 0).",
    },
    {
      logicalStepId: "mbs-step-4",
      label: "Target Found!",
      state: {
        array: [4, 5, 6, 7, 0, 1, 2],
        pointers: { low: 4, high: 4, mid: 4 },
        highlighted: [4],
        currentValue: 'found index = 4'
      },
      narration: "We find that arr[mid] (0) equals our target. Return the index 4.",
    },
  ],
};

export const modifiedBinarySearchLesson: Lesson = {
  patternId: 'modified-binary-search',
  explanation: `Binary search adapted for rotated arrays, boundaries, etc.`,
  stepByStepReasoning: `1. Set low=0, high=n-1.
2. Find mid. Check if arr[mid] is target.
3. Determine which half is sorted, and check if target is within it.`,
  whenToUse: ['Rotated sorted array', 'Find floor/ceil/boundaries'],
  timeComplexity: 'O(log N)',
  spaceComplexity: 'O(1)',
  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `int search(vector<int>& arr, int target) {
    int low = 0, high = arr.size()-1;
    while(low <= high) {
        int mid = low + (high-low)/2;
        if(arr[mid] == target) return mid;
        if(arr[low] <= arr[mid]) {
            if(target >= arr[low] && target < arr[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            if(target > arr[mid] && target <= arr[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}`,
      lineMapping: { 'mbs-step-1': [3], 'mbs-step-4': [5] }
    },
    python: {
      language: 'python',
      code: `def search(arr, target):
    low, high = 0, len(arr)-1
    while low <= high:
        mid = low + (high-low)//2
        if arr[mid] == target: return mid
        if arr[low] <= arr[mid]:
            if arr[low] <= target < arr[mid]: high = mid - 1
            else: low = mid + 1
        else:
            if arr[mid] < target <= arr[high]: low = mid + 1
            else: high = mid - 1
    return -1`,
      lineMapping: { 'mbs-step-1': [3], 'mbs-step-4': [5] }
    },
    java: {
      language: 'java',
      code: `public int search(int[] arr, int target) {
    int low = 0, high = arr.length-1;
    while(low <= high) {
        int mid = low + (high-low)/2;
        if(arr[mid] == target) return mid;
        if(arr[low] <= arr[mid]) {
            if(target >= arr[low] && target < arr[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            if(target > arr[mid] && target <= arr[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}`,
      lineMapping: { 'mbs-step-1': [3], 'mbs-step-4': [5] }
    }
  },
  visualization: modifiedBinarySearchVisualization,
  challenge: {
    id: "mbs-challenge-1",
    question: "How to avoid overflow during mid calculation?",
    type: "multiple-choice",
    options: [
      'mid = (low + high) / 2',
      'mid = low + (high - low) / 2',
      'mid = (low + high) >> 1',
      'None of these'
    ],
    correctAnswer: 1,
    hint: "Calculate difference first to avoid sum exceeding max integer.",
    explanation: 'Calculating low + (high - low) / 2 is mathematically equivalent but avoids intermediate integer overflow.'
  }
};
