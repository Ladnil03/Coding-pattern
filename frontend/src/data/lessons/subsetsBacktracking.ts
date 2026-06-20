import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const subsetsBacktrackingVisualization: VisualizationConfig = {
  type: "tree",
  sampleInput: [1, 2],
  inputLabel: "nums = [1, 2]",
  steps: [
    {
      logicalStepId: "sub-step-1",
      label: "Start (index 0)",
      state: {
        array: [1, 2],
        pointers: { index: 0 },
        stack: [],
        currentValue: 'results = []'
      },
      narration: "Begin generating subsets at index 0. Our current subset helper path is empty [].",
    },
    {
      logicalStepId: "sub-step-2",
      label: "Decision: Include 1",
      state: {
        array: [1, 2],
        pointers: { index: 1 },
        stack: [1],
        currentValue: 'results = []'
      },
      narration: "We decide to INCLUDE the element 1. We push 1 onto our subset path and move recursively to index 1.",
    },
    {
      logicalStepId: "sub-step-3",
      label: "Decision: Include 2 (Leaf)",
      state: {
        array: [1, 2],
        pointers: { index: 2 },
        stack: [1, 2],
        currentValue: 'results = [[1, 2]]'
      },
      narration: "From index 1, we decide to INCLUDE 2. Move to index 2. This is our base case (leaf node). Save [1, 2] to output. Backtrack by popping 2.",
    },
    {
      logicalStepId: "sub-step-4",
      label: "Decision: Exclude 2 (Leaf)",
      state: {
        array: [1, 2],
        pointers: { index: 2 },
        stack: [1],
        currentValue: 'results = [[1, 2], [1]]'
      },
      narration: "Explore the branch where we EXCLUDE 2. Move to index 2. Add [1] to output. Backtrack by returning and popping 1.",
    },
    {
      logicalStepId: "sub-step-5",
      label: "Decision: Exclude 1",
      state: {
        array: [1, 2],
        pointers: { index: 1 },
        stack: [],
        currentValue: 'results = [[1, 2], [1]]'
      },
      narration: "Backtrack all the way to index 0 and explore the EXCLUDE 1 branch. Our current subset is empty again, and we move to index 1.",
    },
    {
      logicalStepId: "sub-step-6",
      label: "Decision: Include 2 (Leaf)",
      state: {
        array: [1, 2],
        pointers: { index: 2 },
        stack: [2],
        currentValue: 'results = [[1, 2], [1], [2]]'
      },
      narration: "From index 1, decide to INCLUDE 2. Move to index 2. Save [2] to output. Backtrack by popping 2.",
    },
    {
      logicalStepId: "sub-step-7",
      label: "Decision: Exclude 2 (Leaf) - Complete",
      state: {
        array: [1, 2],
        pointers: { index: 2 },
        stack: [],
        currentValue: 'results = [[1, 2], [1], [2], []]'
      },
      narration: "Explore the EXCLUDE 2 branch. Move to index 2. Add [] to output. Backtracking terminates; we have all 4 subsets.",
    },
  ],
};

export const subsetsBacktrackingLesson: Lesson = {
  patternId: 'subsets-backtracking',
  explanation: `Systematically generate subsets/combinations using recursive backtracking.`,
  stepByStepReasoning: `1. If index == nums.length, save copy of subset and return.
2. Include element, recurse, backtrack.
3. Exclude element, recurse.`,
  whenToUse: ['Generating powersets', 'Combinations/Permutations'],
  timeComplexity: 'O(2^N)',
  spaceComplexity: 'O(N)',
  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `void back(int idx, vector<int>& nums, vector<int>& curr, vector<vector<int>>& res) {
    if(idx == nums.size()) { res.push_back(curr); return; }
    curr.push_back(nums[idx]);
    back(idx+1, nums, curr, res);
    curr.pop_back();
    back(idx+1, nums, curr, res);
}`,
      lineMapping: { 'sub-step-1': [2], 'sub-step-2': [3, 4] }
    },
    python: {
      language: 'python',
      code: `def back(idx, nums, curr, res):
    if idx == len(nums):
        res.append(list(curr))
        return
    curr.append(nums[idx])
    back(idx+1, nums, curr, res)
    curr.pop()
    back(idx+1, nums, curr, res)`,
      lineMapping: { 'sub-step-1': [2,3], 'sub-step-2': [5, 6] }
    },
    java: {
      language: 'java',
      code: `void back(int idx, int[] nums, List<Integer> curr, List<List<Integer>> res) {
    if(idx == nums.length) { res.add(new ArrayList<>(curr)); return; }
    curr.add(nums[idx]);
    back(idx+1, nums, curr, res);
    curr.remove(curr.size()-1);
    back(idx+1, nums, curr, res);
}`,
      lineMapping: { 'sub-step-1': [2], 'sub-step-2': [3, 4] }
    }
  },
  visualization: subsetsBacktrackingVisualization,
  challenge: {
    id: "sub-challenge-1",
    question: "Why copy list when saving to results?",
    type: "multiple-choice",
    options: [
      'Java needs garbage collection',
      'Lists are references; without copying, future backtrack pops will empty the saved results',
      'It sorts the results',
      'None of these'
    ],
    correctAnswer: 1,
    hint: "If we modify the object, all references see the modification.",
    explanation: 'Copying preserves the snapshot of the array at that base case step.'
  }
};
