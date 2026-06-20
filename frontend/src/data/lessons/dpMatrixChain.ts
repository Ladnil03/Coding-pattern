import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const dpMatrixChainVisualization: VisualizationConfig = {
  type: "matrix",
  sampleInput: 'dims = [10, 20, 30, 40] (3 matrices: 10x20, 20x30, 30x40)',
  inputLabel: "dims = [10, 20, 30, 40]",
  steps: [
    {
      logicalStepId: "mc-step-1",
      label: "Initialize Diagonal to 0",
      state: {
        array: [
          'Row 0 (A): [0, 0, 0]',
          'Row 1 (B): [0, 0, 0]',
          'Row 2 (C): [0, 0, 0]'
        ],
        pointers: { len: 1 },
        currentValue: 'dp[i][i] = 0'
      },
      narration: "Initialize our DP matrix. dp[i][j] stores the minimum multiplication cost for matrices i through j. Single matrices have multiplication cost 0.",
    },
    {
      logicalStepId: "mc-step-2",
      label: "Compute Length 2 Chains",
      state: {
        array: [
          'Row 0 (A): [0, 6000, 0]',
          'Row 1 (B): [0, 0, 24000]',
          'Row 2 (C): [0, 0, 0]'
        ],
        pointers: { len: 2 },
        highlighted: [0, 1],
        currentValue: 'dp[0][1]=6k, dp[1][2]=24k'
      },
      narration: "Compute cost for multiplying pairs: A*B takes 10x20x30 = 6000 ops. B*C takes 20x30x40 = 24000 ops.",
    },
    {
      logicalStepId: "mc-step-3",
      label: "Compute Length 3: Try Split at k=0",
      state: {
        array: [
          'Row 0 (A): [0, 6000, 32000]',
          'Row 1 (B): [0, 0, 24000]',
          'Row 2 (C): [0, 0, 0]'
        ],
        pointers: { len: 3, split: 0 },
        highlighted: [0],
        currentValue: 'Cost at k=0: 32000'
      },
      narration: "Compute cost for multiplying A*(B*C) (split after A). Total ops = cost of A (0) + cost of B*C (24000) + cost of multiplying results (10x20x40 = 8000) = 32000.",
    },
    {
      logicalStepId: "mc-step-4",
      label: "Compute Length 3: Try Split at k=1",
      state: {
        array: [
          'Row 0 (A): [0, 6000, 18000]',
          'Row 1 (B): [0, 0, 24000]',
          'Row 2 (C): [0, 0, 0]'
        ],
        pointers: { len: 3, split: 1 },
        highlighted: [0],
        currentValue: 'Cost at k=1: 18000'
      },
      narration: "Compute cost for multiplying (A*B)*C (split after B). Total ops = cost of A*B (6000) + cost of C (0) + cost of multiplying results (10x30x40 = 12000) = 18000. Since 18000 < 32000, save 18000.",
    },
    {
      logicalStepId: "mc-step-5",
      label: "Complete: Min Ops = 18000",
      state: {
        array: [
          'Row 0 (A): [0, 6000, 18000]',
          'Row 1 (B): [0, 0, 24000]',
          'Row 2 (C): [0, 0, 0]'
        ],
        pointers: {},
        highlighted: [],
        currentValue: 'Result = 18000'
      },
      narration: "All calculations complete. The optimal multiplication sequence is (A*B)*C, costing 18000 operations.",
    },
  ],
};

export const dpMatrixChainLesson: Lesson = {
  patternId: 'dp-matrix-chain',
  explanation: `Interval DP for evaluating partition points k: dp[i][j] = min(dp[i][k] + dp[k+1][j] + cost).`,
  stepByStepReasoning: `1. dp[i][i] = 0.
2. Loop len from 2 to N. Loop start index i. Loop split point k from i to j-1.`,
  whenToUse: ['Optimal splitting/merging of adjacent elements', 'Burst balloons'],
  timeComplexity: 'O(N^3)',
  spaceComplexity: 'O(N^2)',
  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `int matrixChain(const vector<int>& dims) {
    int n = dims.size() - 1;
    vector<vector<int>> dp(n, vector<int>(n, 0));
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1; dp[i][j] = INT_MAX;
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1];
                dp[i][j] = min(dp[i][j], cost);
            }
        }
    }
    return dp[0][n-1];
}`,
      lineMapping: { 'mc-step-1': [3], 'mc-step-4': [8, 9] }
    },
    python: {
      language: 'python',
      code: `def matrix_chain(dims):
    n = len(dims) - 1
    dp = [[0]*n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = 99999999
            for k in range(i, j):
                cost = dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1]
                dp[i][j] = min(dp[i][j], cost)
    return dp[0][n-1]`,
      lineMapping: { 'mc-step-1': [3], 'mc-step-4': [8, 9] }
    },
    java: {
      language: 'java',
      code: `public int matrixChain(int[] dims) {
    int n = dims.length - 1;
    int[][] dp = new int[n][n];
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1; dp[i][j] = Integer.MAX_VALUE;
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1];
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }
    return dp[0][n-1];
}`,
      lineMapping: { 'mc-step-1': [3], 'mc-step-4': [7, 8] }
    }
  },
  visualization: dpMatrixChainVisualization,
  challenge: {
    id: "mc-challenge-1",
    question: "Why is complexity O(N^3)?",
    type: "multiple-choice",
    options: ["3D matrix", "Three nested loops (len, i, k)", "N log N sorting", "None"],
    correctAnswer: 1,
    hint: "Look at loops.",
    explanation: 'We iterate through all O(N^2) intervals, and check O(N) split points for each interval.'
  }
};
