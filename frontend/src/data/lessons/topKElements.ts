import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const topKElementsVisualization: VisualizationConfig = {
  type: "stack-queue",
  sampleInput: [3, 1, 5, 12, 2, 11],
  inputLabel: "arr = [3, 1, 5, 12, 2, 11], k = 3",
  steps: [
    {
      logicalStepId: "tk-step-1",
      label: "Push first K: 3, 1, 5",
      state: {
        array: [3, 1, 5, 12, 2, 11],
        pointers: { i: 2 },
        stack: [1, 3, 5],
        currentValue: 'heap size = 3'
      },
      narration: "Insert the first K=3 elements into the min-heap. The heap structures them with the smallest element (1) at the top.",
    },
    {
      logicalStepId: "tk-step-2",
      label: "Inspect 12: Pop 1, Push 12",
      state: {
        array: [3, 1, 5, 12, 2, 11],
        pointers: { i: 3 },
        stack: [3, 5, 12],
        currentValue: 'heap size = 3'
      },
      narration: "Process value 12. Since 12 is greater than the heap root (1), pop 1 and insert 12. Heap root is now 3.",
    },
    {
      logicalStepId: "tk-step-3",
      label: "Inspect 2: Ignore",
      state: {
        array: [3, 1, 5, 12, 2, 11],
        pointers: { i: 4 },
        stack: [3, 5, 12],
        currentValue: 'heap size = 3'
      },
      narration: "Process value 2. Compare with heap root (3). Since 2 <= 3, it cannot be in the top 3 largest elements. Ignore it.",
    },
    {
      logicalStepId: "tk-step-4",
      label: "Inspect 11: Pop 3, Push 11",
      state: {
        array: [3, 1, 5, 12, 2, 11],
        pointers: { i: 5 },
        stack: [5, 11, 12],
        currentValue: 'heap size = 3'
      },
      narration: "Process final value 11. Since 11 is greater than the heap root (3), pop 3 and insert 11. Root is now 5.",
    },
    {
      logicalStepId: "tk-step-5",
      label: "Finished: Top K = [5, 11, 12]",
      state: {
        array: [3, 1, 5, 12, 2, 11],
        pointers: {},
        stack: [5, 11, 12],
        currentValue: 'Top K = [5, 11, 12]'
      },
      narration: "Array traversal complete. The min-heap holds the 3 largest values: [5, 11, 12].",
    },
  ],
};

export const topKElementsLesson: Lesson = {
  patternId: 'top-k-elements',
  explanation: `Use a heap to track K largest (min-heap) or smallest (max-heap) elements in O(N log K).`,
  stepByStepReasoning: `1. Put first K elements in min-heap.
2. For rest of elements, if larger than root, pop root and push element.`,
  whenToUse: ['Find K largest/smallest/most-frequent elements'],
  timeComplexity: 'O(N log K)',
  spaceComplexity: 'O(K)',
  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `vector<int> findKLargest(vector<int>& arr, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    for (int num : arr) {
        if (minHeap.size() < k) minHeap.push(num);
        else if (num > minHeap.top()) { minHeap.pop(); minHeap.push(num); }
    }
    vector<int> res;
    while(!minHeap.empty()) { res.push_back(minHeap.top()); minHeap.pop(); }
    return res;
}`,
      lineMapping: { 'tk-step-1': [3,4], 'tk-step-2': [5] }
    },
    python: {
      language: 'python',
      code: `import heapq
def findKLargest(arr, k):
    minHeap = []
    for num in arr:
        if len(minHeap) < k: heapq.heappush(minHeap, num)
        elif num > minHeap[0]: heapq.heapreplace(minHeap, num)
    return minHeap`,
      lineMapping: { 'tk-step-1': [4,5], 'tk-step-2': [6] }
    },
    java: {
      language: 'java',
      code: `public List<Integer> findKLargest(int[] arr, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for(int num : arr) {
        if(minHeap.size() < k) minHeap.add(num);
        else if(num > minHeap.peek()) { minHeap.poll(); minHeap.add(num); }
    }
    return new ArrayList<>(minHeap);
}`,
      lineMapping: { 'tk-step-1': [3,4], 'tk-step-2': [5] }
    }
  },
  visualization: topKElementsVisualization,
  challenge: {
    id: "tk-challenge-1",
    question: "Why use a min-heap for K largest elements?",
    type: "multiple-choice",
    options: [
      'Min-heap is smaller',
      'The root of min-heap contains the smallest of the K largest, letting us evict it in O(1) if a larger element is found',
      'Min-heaps sort faster',
      'None of these'
    ],
    correctAnswer: 1,
    hint: "We want to evict the smallest element from our K largest candidates.",
    explanation: 'The min-heap root always holds the smallest value in the heap. If a larger value appears, we easily evict this root.'
  }
};
