import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const dpUnboundedKnapsackVisualization: VisualizationConfig = {
  type: "array",
  sampleInput: 'weights = [1, 2, 3], values = [1, 5, 7], capacity = 4',
  inputLabel: "wts = [1,2,3], vals = [1,5,7], cap = 4",
  steps: [
    {
      logicalStepId: "uk-step-1",
      label: "Initialize 1D DP Array",
      state: {
        array: [0, 0, 0, 0, 0],
        pointers: { w: 0 },
        highlighted: [0],
        currentValue: 'dp = [0, 0, 0, 0, 0]'
      },
      narration: "Initialize our 1D DP array of size W+1 (5 elements, indices 0 to 4) to 0. dp[w] stores max value at capacity w.",
    },
    {
      logicalStepId: "uk-step-2",
      label: "Compute w = 1",
      state: {
        array: [0, 1, 0, 0, 0],
        pointers: { w: 1 },
        highlighted: [1],
        currentValue: 'dp[1] = 1 (item 0)'
      },
      narration: "At capacity w = 1: check item 0 (wt 1, val 1). It fits, so value is 1 + dp[0] = 1. Other items exceed capacity 1. dp[1] = 1.",
    },
    {
      logicalStepId: "uk-step-3",
      label: "Compute w = 2",
      state: {
        array: [0, 1, 5, 0, 0],
        pointers: { w: 2 },
        highlighted: [2],
        currentValue: 'dp[2] = 5 (item 1)'
      },
      narration: "At capacity w = 2: check item 0 (wt 1, val 1) -> fits, value 1 + dp[1] = 2. Check item 1 (wt 2, val 5) -> fits, value 5 + dp[0] = 5. Best is 5.",
    },
    {
      logicalStepId: "uk-step-4",
      label: "Compute w = 3",
      state: {
        array: [0, 1, 5, 7, 0],
        pointers: { w: 3 },
        highlighted: [3],
        currentValue: 'dp[3] = 7 (item 2)'
      },
      narration: "At capacity w = 3: item 0 gives 1+5=6. Item 1 gives 5+1=6. Item 2 gives 7+0=7. Max value is 7.",
    },
    {
      logicalStepId: "uk-step-5",
      label: "Compute w = 4",
      state: {
        array: [0, 1, 5, 7, 10],
        pointers: { w: 4 },
        highlighted: [4],
        currentValue: 'dp[4] = 10 (item 1 twice)'
      },
      narration: "At capacity w = 4: item 0 gives 1+7=8. Item 1 gives 5+5=10. Item 2 gives 7+1=8. Best value is 10 (by selecting item 1 twice).",
    },
    {
      logicalStepId: "uk-step-6",
      label: "Finished. Max Value: 10",
      state: {
        array: [0, 1, 5, 7, 10],
        pointers: {},
        highlighted: [],
        currentValue: 'Result = 10'
      },
      narration: "Completed. The maximum value we can obtain with capacity 4 is 10.",
    },
  ],
};

export const dpUnboundedKnapsackLesson: Lesson = {
  patternId: 'dp-unbounded-knapsack',
  explanation: `Unbounded Knapsack selection: items can be chosen unlimited times.`,
  stepByStepReasoning: `dp[w] = max(dp[w], values[j] + dp[w - weights[j]]) for all items j.`,
  whenToUse: ['Items reusable infinitely', 'Coin Change problem'],
  timeComplexity: 'O(N * W)',
  spaceComplexity: 'O(W)',
  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `int unboundedKnapsack(vector<int>& wt, vector<int>& val, int W) {
    vector<int> dp(W+1, 0);
    for(int w=1; w<=W; w++) {
        for(int j=0; j<wt.size(); j++) {
            if(wt[j] <= w) dp[w] = max(dp[w], val[j] + dp[w - wt[j]]);
        }
    }
    return dp[W];
}`,
      lineMapping: { 'uk-step-1': [2], 'uk-step-4': [4, 5] }
    },
    python: {
      language: 'python',
      code: `def unboundedKnapsack(wt, val, W):
    dp = [0]*(W+1)
    for w in range(1, W+1):
        for j in range(len(wt)):
            if wt[j] <= w: dp[w] = max(dp[w], val[j] + dp[w - wt[j]])
    return dp[W]`,
      lineMapping: { 'uk-step-1': [2], 'uk-step-4': [4, 5] }
    },
    java: {
      language: 'java',
      code: `public int unbounded(int[] wt, int[] val, int W) {
    int[] dp = new int[W+1];
    for(int w=1; w<=W; w++) {
        for(int j=0; j<wt.length; j++) {
            if(wt[j] <= w) dp[w] = Math.max(dp[w], val[j] + dp[w - wt[j]]);
        }
    }
    return dp[W];
}`,
      lineMapping: { 'uk-step-1': [2], 'uk-step-4': [4, 5] }
    }
  },
  visualization: dpUnboundedKnapsackVisualization,
  challenge: {
    id: "uk-challenge-1",
    question: "Loop difference from 0/1 Knapsack?",
    type: "multiple-choice",
    options: [
      '0/1 Knapsack loops capacity backwards, Unbounded loops capacity forwards',
      'Unbounded requires sorting',
      'Unbounded requires 2D matrix',
      'No difference'
    ],
    correctAnswer: 0,
    hint: "Forwards capacity loop allows reusing item in same pass.",
    explanation: 'Iterating capacity forwards allows using updated values from current item in same pass, allowing infinite reuse.'
  }
};
