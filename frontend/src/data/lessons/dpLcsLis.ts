import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const dpLcsLisVisualization: VisualizationConfig = {
  type: "matrix",
  sampleInput: 's1 = "abcde", s2 = "ace"',
  inputLabel: "s1 = \"abcde\", s2 = \"ace\"",
  steps: [
    {
      logicalStepId: "lcs-step-1",
      label: "Initialize LCS Grid",
      state: {
        array: [
          'Row 0 (empty): [0, 0, 0, 0]',
          'Row 1 (a):     [0, 0, 0, 0]',
          'Row 2 (b):     [0, 0, 0, 0]',
          'Row 3 (c):     [0, 0, 0, 0]',
          'Row 4 (d):     [0, 0, 0, 0]',
          'Row 5 (e):     [0, 0, 0, 0]'
        ],
        pointers: { row: 0, col: 0 },
        currentValue: 'LCS = 0'
      },
      narration: "Initialize the LCS DP matrix. Rows represent characters of \"abcde\" and columns represent \"ace\". All cells initialized to 0.",
    },
    {
      logicalStepId: "lcs-step-2",
      label: "Process row 1 (char a)",
      state: {
        array: [
          'Row 0 (empty): [0, 0, 0, 0]',
          'Row 1 (a):     [0, 1, 1, 1]',
          'Row 2 (b):     [0, 0, 0, 0]',
          'Row 3 (c):     [0, 0, 0, 0]',
          'Row 4 (d):     [0, 0, 0, 0]',
          'Row 5 (e):     [0, 0, 0, 0]'
        ],
        pointers: { row: 1 },
        highlighted: [1],
        currentValue: 'dp[1][1] = 1'
      },
      narration: "For row 1 (a): s1[0] matches s2[0] (a), so cell dp[1][1] = 1 + dp[0][0] = 1. The match propagates rightwards, so row 1 is [0, 1, 1, 1].",
    },
    {
      logicalStepId: "lcs-step-3",
      label: "Process row 2 (char b)",
      state: {
        array: [
          'Row 0 (empty): [0, 0, 0, 0]',
          'Row 1 (a):     [0, 1, 1, 1]',
          'Row 2 (b):     [0, 1, 1, 1]',
          'Row 3 (c):     [0, 0, 0, 0]',
          'Row 4 (d):     [0, 0, 0, 0]',
          'Row 5 (e):     [0, 0, 0, 0]'
        ],
        pointers: { row: 2 },
        highlighted: [2],
        currentValue: 'dp[2][j] = dp[1][j]'
      },
      narration: "For row 2 (b): b does not match a, c, or e. We carry over maximum values from top cells: dp[2][j] = max(dp[1][j], dp[2][j-1]). Row 2: [0, 1, 1, 1].",
    },
    {
      logicalStepId: "lcs-step-4",
      label: "Process row 3 (char c)",
      state: {
        array: [
          'Row 0 (empty): [0, 0, 0, 0]',
          'Row 1 (a):     [0, 1, 1, 1]',
          'Row 2 (b):     [0, 1, 1, 1]',
          'Row 3 (c):     [0, 1, 2, 2]',
          'Row 4 (d):     [0, 0, 0, 0]',
          'Row 5 (e):     [0, 0, 0, 0]'
        ],
        pointers: { row: 3 },
        highlighted: [3],
        currentValue: 'dp[3][2] = 2'
      },
      narration: "For row 3 (c): c matches s2[1] (c) at col 2. dp[3][2] = 1 + diagonal dp[2][1] (1) = 2. Row 3 becomes: [0, 1, 2, 2].",
    },
    {
      logicalStepId: "lcs-step-5",
      label: "Process row 4 (char d)",
      state: {
        array: [
          'Row 0 (empty): [0, 0, 0, 0]',
          'Row 1 (a):     [0, 1, 1, 1]',
          'Row 2 (b):     [0, 1, 1, 1]',
          'Row 3 (c):     [0, 1, 2, 2]',
          'Row 4 (d):     [0, 1, 2, 2]',
          'Row 5 (e):     [0, 0, 0, 0]'
        ],
        pointers: { row: 4 },
        highlighted: [4],
        currentValue: 'dp[4][j] = dp[3][j]'
      },
      narration: "For row 4 (d): no match. Carry over values from row 3. Row 4 is [0, 1, 2, 2].",
    },
    {
      logicalStepId: "lcs-step-6",
      label: "Process row 5 (char e) - Final Match",
      state: {
        array: [
          'Row 0 (empty): [0, 0, 0, 0]',
          'Row 1 (a):     [0, 1, 1, 1]',
          'Row 2 (b):     [0, 1, 1, 1]',
          'Row 3 (c):     [0, 1, 2, 2]',
          'Row 4 (d):     [0, 1, 2, 2]',
          'Row 5 (e):     [0, 1, 2, 3]'
        ],
        pointers: { row: 5 },
        highlighted: [5],
        currentValue: 'dp[5][3] = 3'
      },
      narration: "For row 5 (e): e matches s2[2] (e) at col 3. dp[5][3] = 1 + diagonal dp[4][2] (2) = 3. Final LCS length is 3.",
    },
  ],
};

export const dpLcsLisLesson: Lesson = {
  patternId: 'dp-lcs-lis',
  explanation: `LCS finds longest matching subsequence. LIS finds longest increasing sequence.`,
  stepByStepReasoning: `LCS: if chars match: 1 + dp[i-1][j-1]; else: max(dp[i-1][j], dp[i][j-1]).`,
  whenToUse: ['Diff tool comparison', 'Bioinformatics alignments'],
  timeComplexity: 'O(M * N)',
  spaceComplexity: 'O(M * N)',
  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `int lcs(string s1, string s2) {
    int m = s1.length(), n = s2.length();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for(int i=1; i<=m; i++) {
        for(int j=1; j<=n; j++) {
            if(s1[i-1] == s2[j-1]) dp[i][j] = 1 + dp[i-1][j-1];
            else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m][n];
}`,
      lineMapping: { 'lcs-step-1': [3], 'lcs-step-6': [7, 8] }
    },
    python: {
      language: 'python',
      code: `def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]
            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
      lineMapping: { 'lcs-step-1': [3], 'lcs-step-6': [6, 7] }
    },
    java: {
      language: 'java',
      code: `public int lcs(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m+1][n+1];
    for(int i=1; i<=m; i++) {
        for(int j=1; j<=n; j++) {
            if(s1.charAt(i-1) == s2.charAt(j-1)) dp[i][j] = 1 + dp[i-1][j-1];
            else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m][n];
}`,
      lineMapping: { 'lcs-step-1': [3], 'lcs-step-6': [6, 7] }
    }
  },
  visualization: dpLcsLisVisualization,
  challenge: {
    id: "lcs-challenge-1",
    question: "How does Substring DP differ from Subsequence DP?",
    type: "multiple-choice",
    options: [
      'Substring has no DP',
      'If current characters do not match, substring dp[i][j] resets to 0',
      'Substring uses addition instead of max',
      'None'
    ],
    correctAnswer: 1,
    hint: "Substring must be contiguous.",
    explanation: 'For contiguous substrings, mismatch breaks the chain, resetting local length to 0.'
  }
};
