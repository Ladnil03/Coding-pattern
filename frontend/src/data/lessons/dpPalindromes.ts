import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const dpPalindromesVisualization: VisualizationConfig = {
  type: "matrix",
  sampleInput: 's = "babad"',
  inputLabel: "s = \"babad\"",
  steps: [
    {
      logicalStepId: "pal-step-1",
      label: "Initialize Matrix",
      state: {
        array: [
          'Row 0 (b): [T, F, F, F, F]',
          'Row 1 (a): [F, T, F, F, F]',
          'Row 2 (b): [F, F, T, F, F]',
          'Row 3 (a): [F, F, F, T, F]',
          'Row 4 (d): [F, F, F, F, T]'
        ],
        pointers: { len: 1 },
        currentValue: 'Palindromes of len 1 = true'
      },
      narration: "Initialize DP matrix where dp[i][j] is true if s[i..j] is a palindrome. Any single character is a palindrome, so set diagonal to True.",
    },
    {
      logicalStepId: "pal-step-2",
      label: "Check Length 2",
      state: {
        array: [
          'Row 0 (b): [T, F, F, F, F]',
          'Row 1 (a): [F, T, F, F, F]',
          'Row 2 (b): [F, F, T, F, F]',
          'Row 3 (a): [F, F, F, T, F]',
          'Row 4 (d): [F, F, F, F, T]'
        ],
        pointers: { len: 2 },
        currentValue: 'All len 2 = False'
      },
      narration: "Inspect substrings of length 2. Since adjacent characters do not match (\"ba\", \"ab\", \"ba\", \"ad\"), all cells representing length 2 are set to False.",
    },
    {
      logicalStepId: "pal-step-3",
      label: "Check Length 3: Find \"bab\" & \"aba\"",
      state: {
        array: [
          'Row 0 (b): [T, F, T, F, F]',
          'Row 1 (a): [F, T, F, T, F]',
          'Row 2 (b): [F, F, T, F, F]',
          'Row 3 (a): [F, F, F, T, F]',
          'Row 4 (d): [F, F, F, F, T]'
        ],
        pointers: { len: 3 },
        highlighted: [0, 1],
        currentValue: 'Found "bab" and "aba"'
      },
      narration: "Inspect length 3. Substrings \"bab\" (dp[0][2]) and \"aba\" (dp[1][3]) have matching outer characters and a valid inner palindrome, so set to True.",
    },
    {
      logicalStepId: "pal-step-4",
      label: "Check Length 4",
      state: {
        array: [
          'Row 0 (b): [T, F, T, F, F]',
          'Row 1 (a): [F, T, F, T, F]',
          'Row 2 (b): [F, F, T, F, F]',
          'Row 3 (a): [F, F, F, T, F]',
          'Row 4 (d): [F, F, F, F, T]'
        ],
        pointers: { len: 4 },
        currentValue: 'All len 4 = False'
      },
      narration: "Inspect length 4. Substrings \"baba\" and \"abad\" are not palindromic, so all length 4 cells remain False.",
    },
    {
      logicalStepId: "pal-step-5",
      label: "Check Length 5",
      state: {
        array: [
          'Row 0 (b): [T, F, T, F, F]',
          'Row 1 (a): [F, T, F, T, F]',
          'Row 2 (b): [F, F, T, F, F]',
          'Row 3 (a): [F, F, F, T, F]',
          'Row 4 (d): [F, F, F, F, T]'
        ],
        pointers: { len: 5 },
        currentValue: 'All len 5 = False'
      },
      narration: "Inspect length 5. Substring \"babad\" does not match at ends (b != d), so it is False. The longest palindromic substring is 3 (\"bab\" or \"aba\").",
    },
  ],
};

export const dpPalindromesLesson: Lesson = {
  patternId: 'dp-palindromes',
  explanation: `Interval DP for detecting palindromic substrings.`,
  stepByStepReasoning: `dp[i][j] = (s[i] == s[j] && (j - i < 3 || dp[i+1][j-1]))`,
  whenToUse: ['Longest Palindromic Substring', 'Count Palindromic Substrings'],
  timeComplexity: 'O(N^2)',
  spaceComplexity: 'O(N^2)',
  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `string longestPalindrome(string s) {
    int n = s.length(); if (n <= 1) return s;
    vector<vector<bool>> dp(n, vector<bool>(n, false));
    int start = 0, maxLen = 1;
    for (int i = 0; i < n; i++) dp[i][i] = true;
    for (int i = 0; i < n - 1; i++) if (s[i] == s[i+1]) { dp[i][i+1] = true; start = i; maxLen = 2; }
    for (int len = 3; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            if (s[i] == s[j] && dp[i+1][j-1]) { dp[i][j] = true; start = i; maxLen = len; }
        }
    }
    return s.substr(start, maxLen);
}`,
      lineMapping: { 'pal-step-1': [5], 'pal-step-3': [9, 10] }
    },
    python: {
      language: 'python',
      code: `def longestPalindrome(s: str) -> str:
    n = len(s)
    if n <= 1: return s
    dp = [[False]*n for _ in range(n)]
    start, maxLen = 0, 1
    for i in range(n): dp[i][i] = True
    for i in range(n-1):
        if s[i] == s[i+1]: dp[i][i+1] = True; start = i; maxLen = 2
    for len_ in range(3, n + 1):
        for i in range(n - len_ + 1):
            j = i + len_ - 1
            if s[i] == s[j] and dp[i+1][j-1]: dp[i][j] = True; start = i; maxLen = len_
    return s[start:start+maxLen]`,
      lineMapping: { 'pal-step-1': [7], 'pal-step-3': [12, 13] }
    },
    java: {
      language: 'java',
      code: `public String longestPalindrome(String s) {
    int n = s.length(); if (n <= 1) return s;
    boolean[][] dp = new boolean[n][n];
    int start = 0, maxLen = 1;
    for (int i = 0; i < n; i++) dp[i][i] = true;
    for (int i = 0; i < n - 1; i++) if (s.charAt(i) == s.charAt(i+1)) { dp[i][i+1] = true; start = i; maxLen = 2; }
    for (int len = 3; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            if (s.charAt(i) == s.charAt(j) && dp[i+1][j-1]) { dp[i][j] = true; start = i; maxLen = len; }
        }
    }
    return s.substring(start, start + maxLen);
}`,
      lineMapping: { 'pal-step-1': [5], 'pal-step-3': [9, 10] }
    }
  },
  visualization: dpPalindromesVisualization,
  challenge: {
    id: "pal-challenge-1",
    question: "Why must we loop substring length from 3 up to N?",
    type: "multiple-choice",
    options: [
      'To print diagonal',
      'Because check for length L depends on subproblem of length L-2',
      'It is faster',
      'None'
    ],
    correctAnswer: 1,
    hint: "Look at dependency dp[i+1][j-1].",
    explanation: 'Inner substring is checked first, so smaller lengths must be computed before larger lengths.'
  }
};
