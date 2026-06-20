import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const monotonicStackVisualization: VisualizationConfig = {
  type: "stack-queue",
  sampleInput: [2, 1, 2, 4, 3],
  inputLabel: "arr = [2, 1, 2, 4, 3]",
  steps: [
    {
      logicalStepId: "ms-step-1",
      label: "Inspect index 0 (val 2)",
      state: {
        array: [2, 1, 2, 4, 3],
        pointers: { i: 0 },
        stack: [0],
        highlighted: [0],
        currentValue: 'res = [-1, -1, -1, -1, -1]'
      },
      narration: "Initialize traversal at index 0. Since the stack is empty, we push the index 0 (val 2) onto the stack.",
    },
    {
      logicalStepId: "ms-step-2",
      label: "Inspect index 1 (val 1)",
      state: {
        array: [2, 1, 2, 4, 3],
        pointers: { i: 1 },
        stack: [0, 1],
        highlighted: [1],
        currentValue: 'res = [-1, -1, -1, -1, -1]'
      },
      narration: "At index 1, value is 1. We compare it with the element represented by the stack top (index 0, value 2). Since 1 is smaller or equal, we push index 1.",
    },
    {
      logicalStepId: "ms-step-3",
      label: "Inspect index 2 (val 2) - Pop 1",
      state: {
        array: [2, 1, 2, 4, 3],
        pointers: { i: 2 },
        stack: [0],
        highlighted: [2, 1],
        currentValue: 'res = [-1, 2, -1, -1, -1]'
      },
      narration: "At index 2, value is 2. The stack top is index 1 (value 1). Since 2 > 1, we found the next greater element for index 1! We pop 1, update res[1] = 2, and then push index 2.",
    },
    {
      logicalStepId: "ms-step-4",
      label: "Inspect index 3 (val 4) - Pop 2 & 0",
      state: {
        array: [2, 1, 2, 4, 3],
        pointers: { i: 3 },
        stack: [],
        highlighted: [3, 2, 0],
        currentValue: 'res = [4, 2, 4, -1, -1]'
      },
      narration: "At index 3, value is 4. Compare with stack top index 2 (value 2). 4 > 2, so pop 2 and set res[2]=4. Compare with next top index 0 (value 2). 4 > 2, so pop 0 and set res[0]=4. Push index 3.",
    },
    {
      logicalStepId: "ms-step-5",
      label: "Inspect index 4 (val 3)",
      state: {
        array: [2, 1, 2, 4, 3],
        pointers: { i: 4 },
        stack: [3, 4],
        highlighted: [4],
        currentValue: 'res = [4, 2, 4, -1, -1]'
      },
      narration: "At index 4, value is 3. Compare with stack top index 3 (value 4). Since 3 <= 4, push index 4 to stack.",
    },
    {
      logicalStepId: "ms-step-6",
      label: "Traversal Complete",
      state: {
        array: [2, 1, 2, 4, 3],
        pointers: {},
        stack: [3, 4],
        highlighted: [],
        currentValue: 'res = [4, 2, 4, -1, -1]'
      },
      narration: "End of array. The remaining indices in the stack (3 and 4) have no greater elements following them, so their results remain -1.",
    },
  ],
};

export const monotonicStackLesson: Lesson = {
  patternId: 'monotonic-stack',
  explanation: `A **Monotonic Stack** is a stack that enforces an ordering. Decreasing stack finds Next Greater Element.`,
  stepByStepReasoning: `Maintain indices in stack. If current is larger than top, pop and record. Push current.`,
  whenToUse: ['Next Greater/Smaller element', 'Histogram area'],
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `vector<int> nextGreater(vector<int>& arr) {
    vector<int> res(arr.size(), -1);
    stack<int> st;
    for(int i=0; i<arr.size(); ++i) {
        while(!st.empty() && arr[i] > arr[st.top()]) {
            res[st.top()] = arr[i]; st.pop();
        }
        st.push(i);
    }
    return res;
}`,
      lineMapping: { 'ms-step-1': [4], 'ms-step-3': [5, 6] }
    },
    python: {
      language: 'python',
      code: `def nextGreater(arr):
    res = [-1] * len(arr)
    st = []
    for i in range(len(arr)):
        while st and arr[i] > arr[st[-1]]:
            idx = st.pop()
            res[idx] = arr[i]
        st.append(i)
    return res`,
      lineMapping: { 'ms-step-1': [4], 'ms-step-3': [5, 6] }
    },
    java: {
      language: 'java',
      code: `public int[] nextGreater(int[] arr) {
    int[] res = new int[arr.length];
    Arrays.fill(res, -1);
    Stack<Integer> st = new Stack<>();
    for(int i=0; i<arr.length; i++) {
        while(!st.isEmpty() && arr[i] > arr[st.peek()]) {
            res[st.pop()] = arr[i];
        }
        st.push(i);
    }
    return res;
}`,
      lineMapping: { 'ms-step-1': [5], 'ms-step-3': [6, 7] }
    }
  },
  visualization: monotonicStackVisualization,
  challenge: {
    id: "ms-challenge-1",
    question: "To find the first smaller to left, what stack is needed?",
    type: "multiple-choice",
    options: [
      'Iterate left-to-right, keep stack Decreasing',
      'Iterate left-to-right, keep stack Increasing',
      'Iterate right-to-left, keep stack Decreasing',
      'Iterate right-to-left, keep stack Increasing'
    ],
    correctAnswer: 1,
    hint: "Traverse left-to-right, pop larger elements.",
    explanation: 'Increasing stack keeps smaller elements at the bottom, letting you find the first smaller element on the left.'
  }
};
