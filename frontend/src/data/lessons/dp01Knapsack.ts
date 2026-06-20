import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const dp01KnapsackVisualization: VisualizationConfig = {
  type: "matrix",
  sampleInput: 'weights = [1, 2, 3], values = [1, 5, 7], capacity = 4',
  inputLabel: "wts = [1,2,3], vals = [1,5,7], cap = 4",
  steps: [
    {
      logicalStepId: "kp-step-1",
      label: "Initialize Matrix",
      state: {
        array: [
          'Row 0 (No items): [0, 0, 0, 0, 0]',
          'Row 1 (wt 1, val 1): [0, 0, 0, 0, 0]',
          'Row 2 (wt 2, val 5): [0, 0, 0, 0, 0]',
          'Row 3 (wt 3, val 7): [0, 0, 0, 0, 0]'
        ],
        pointers: { row: 0, col: 0 },
        currentValue: 'dp[0][w] = 0'
      },
      narration: "Initialize the Dynamic Programming matrix. Row 0 represents using 0 items, and Col 0 represents capacity 0. All values are set to 0.",
    },
    {
      logicalStepId: "kp-step-2",
      label: "Fill Item 1 (wt=1, val=1)",
      state: {
        array: [
          'Row 0 (No items): [0, 0, 0, 0, 0]',
          'Row 1 (wt 1, val 1): [0, 1, 1, 1, 1]',
          'Row 2 (wt 2, val 5): [0, 0, 0, 0, 0]',
          'Row 3 (wt 3, val 7): [0, 0, 0, 0, 0]'
        ],
        pointers: { row: 1 },
        highlighted: [1],
        currentValue: 'dp[1][1..4] = 1'
      },
      narration: "Process item 1 (weight 1, value 1). For capacity w >= 1, we can include it, yielding a value of 1. Row 1 becomes: [0, 1, 1, 1, 1].",
    },
    {
      logicalStepId: "kp-step-3",
      label: "Fill Item 2 (wt=2, val=5)",
      state: {
        array: [
          'Row 0 (No items): [0, 0, 0, 0, 0]',
          'Row 1 (wt 1, val 1): [0, 1, 1, 1, 1]',
          'Row 2 (wt 2, val 5): [0, 1, 5, 6, 6]',
          'Row 3 (wt 3, val 7): [0, 0, 0, 0, 0]'
        ],
        pointers: { row: 2 },
        highlighted: [2],
        currentValue: 'dp[2][3] = max(1, 5+dp[1][1]) = 6'
      },
      narration: "Process item 2 (weight 2, value 5). At capacity 2, we can include it (val 5). At capacity 3, we take both item 1 and item 2 (val 6). Row 2: [0, 1, 5, 6, 6].",
    },
    {
      logicalStepId: "kp-step-4",
      label: "Fill Item 3 (wt=3, val=7)",
      state: {
        array: [
          'Row 0 (No items): [0, 0, 0, 0, 0]',
          'Row 1 (wt 1, val 1): [0, 1, 1, 1, 1]',
          'Row 2 (wt 2, val 5): [0, 1, 5, 6, 6]',
          'Row 3 (wt 3, val 7): [0, 1, 5, 7, 8]'
        ],
        pointers: { row: 3 },
        highlighted: [3],
        currentValue: 'dp[3][4] = max(6, 7+dp[2][1]) = 8'
      },
      narration: "Process item 3 (weight 3, value 7). At capacity 3, we take item 3 (val 7). At capacity 4, we take item 3 and item 1 (val 7+1=8). Row 3: [0, 1, 5, 7, 8].",
    },
    {
      logicalStepId: "kp-step-5",
      label: "Max Value Found: 8",
      state: {
        array: [
          'Row 0 (No items): [0, 0, 0, 0, 0]',
          'Row 1 (wt 1, val 1): [0, 1, 1, 1, 1]',
          'Row 2 (wt 2, val 5): [0, 1, 5, 6, 6]',
          'Row 3 (wt 3, val 7): [0, 1, 5, 7, 8]'
        ],
        pointers: {},
        highlighted: [],
        currentValue: 'Result = 8'
      },
      narration: "DP calculation completed. The bottom-right cell in our matrix holds our final answer: 8.",
    },
  ],
};

export const dp01KnapsackLesson: Lesson = {
  patternId: 'dp-01-knapsack',
  explanation: `0/1 Knapsack selection under capacity. Items can be chosen at most once.`,
  stepByStepReasoning: `dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]])`,
  whenToUse: ['Optimal selection problems', 'Partition subsets sum'],
  timeComplexity: 'O(N * W)',
  spaceComplexity: 'O(N * W) -> O(W)',
  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `int knapsack(vector<int>& wt, vector<int>& val, int W) {
    int n = wt.size();
    vector<vector<int>> dp(n+1, vector<int>(W+1, 0));
    for(int i=1; i<=n; i++) {
        for(int w=1; w<=W; w++) {
            if(wt[i-1] <= w) dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]]);
            else dp[i][w] = dp[i-1][w];
        }
    }
    return dp[n][W];
}`,
      lineMapping: { 'kp-step-1': [3], 'kp-step-4': [7, 8] }
    },
    python: {
      language: 'python',
      code: `def knapsack(wt, val, W):
    n = len(wt)
    dp = [[0]*(W+1) for _ in range(n+1)]
    for i in range(1, n+1):
        for w in range(1, W+1):
            if wt[i-1] <= w: dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]])
            else: dp[i][w] = dp[i-1][w]
    return dp[n][W]`,
      lineMapping: { 'kp-step-1': [3], 'kp-step-4': [6, 7] }
    },
    java: {
      language: 'java',
      code: `public int knapsack(int[] wt, int[] val, int W) {
        int n = wt.length;
        int[][] dp = new int[n+1][W+1];
        for(int i=1; i<=n; i++) {
            for(int w=1; w<=W; w++) {
                if(wt[i-1] <= w) dp[i][w] = Math.max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]]);
                else dp[i][w] = dp[i-1][w];
            }
        }
        return dp[n][W];
    }`,
      lineMapping: { 'kp-step-1': [3], 'kp-step-4': [6, 7] }
    }
  },
  visualization: dp01KnapsackVisualization,
  challenge: {
    id: "kp-challenge-1",
    question: "How to optimize space to 1D?",
    type: "multiple-choice",
    options: [
      'Iterate capacity w forwards (0 to W)',
      'Iterate capacity w backwards (W down to 0)',
      'Use hashmap',
      'Cannot optimize'
    ],
    correctAnswer: 1,
    hint: "Iterate backwards so values referenced are from the previous row.",
    explanation: 'Iterating backwards prevents overwriting previous row values, avoiding multiple selection.'
  }
};
