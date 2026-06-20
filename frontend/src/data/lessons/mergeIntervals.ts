import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const mergeIntervalsVisualization: VisualizationConfig = {
  type: "array",
  sampleInput: '[[1, 3], [2, 6], [8, 10], [15, 18]]',
  inputLabel: "intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]",
  steps: [
    {
      logicalStepId: "mi-step-1",
      label: "Sort and Initialize",
      state: {
        array: ['[1, 3]', '[2, 6]', '[8, 10]', '[15, 18]'],
        pointers: { current: 0 },
        highlighted: [0],
        currentNode: "[1, 3]"
      },
      narration: "Sort the intervals by their start values. Initialize the first interval [1, 3] as our active merging block.",
    },
    {
      logicalStepId: "mi-step-2",
      label: "Compare next: [2, 6]",
      state: {
        array: ['[1, 3]', '[2, 6]', '[8, 10]', '[15, 18]'],
        pointers: { current: 1 },
        highlighted: [0, 1],
        currentNode: "[1, 6]"
      },
      narration: "Check the next interval [2, 6]. Since its start (2) is less than or equal to active end (3), they overlap. Merge them into [1, 6].",
    },
    {
      logicalStepId: "mi-step-3",
      label: "Compare next: [8, 10]",
      state: {
        array: ['[1, 6]', '[8, 10]', '[15, 18]'],
        pointers: { current: 1 },
        highlighted: [1],
        currentNode: "[8, 10]"
      },
      narration: "Check [8, 10]. Its start (8) is greater than active end (6), so no overlap. We save [1, 6] to output and make [8, 10] the new active interval.",
    },
    {
      logicalStepId: "mi-step-4",
      label: "Compare next: [15, 18]",
      state: {
        array: ['[1, 6]', '[8, 10]', '[15, 18]'],
        pointers: { current: 2 },
        highlighted: [2],
        currentNode: "[15, 18]"
      },
      narration: "Check [15, 18]. No overlap with active [8, 10] (15 > 10). Save [8, 10] to output and make [15, 18] the new active interval.",
    },
    {
      logicalStepId: "mi-step-5",
      label: "Finish merging",
      state: {
        array: ['[1, 6]', '[8, 10]', '[15, 18]'],
        pointers: {},
        highlighted: [],
        currentNode: ""
      },
      narration: "End of list reached. Save the last active interval [15, 18] to output. Final merged intervals: [[1, 6], [8, 10], [15, 18]].",
    },
  ],
};

export const mergeIntervalsLesson: Lesson = {
  patternId: 'merge-intervals',
  explanation: `The **Merge Intervals** pattern is an efficient technique for dealing with overlapping intervals.

### Core Idea
By sorting the intervals based on their start times, we guarantee that if two intervals overlap, they must be adjacent in our sorted list. We can then make a single pass through the sorted intervals, merging overlapping ones on the fly.`,
  stepByStepReasoning: `1. **Sort intervals** by start times.
2. **Initialize active interval** with first interval.
3. **Iterate** and compare adjacent intervals.
4. **Merge** if overlapping, else commit to output.`,
  whenToUse: [
    'Merging overlapping schedules (e.g. calendar meetings)',
    'Finding free/busy times in a timetable',
  ],

  timeComplexity: 'O(N log N) — dominated by the initial sorting of N intervals.',
  spaceComplexity: 'O(N) — depending on output storage.',

  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {
    if (intervals.empty()) return {};
    sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b) {
        return a[0] < b[0];
    });
    vector<vector<int>> merged;
    vector<int> current = intervals[0];
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] <= current[1]) {
            current[1] = max(current[1], intervals[i][1]);
        } else {
            merged.push_back(current);
            current = intervals[i];
        }
    }
    merged.push_back(current);
    return merged;
}`,
      lineMapping: {
        'mi-step-1': [3, 4, 8, 9],
        'mi-step-2': [11, 12],
        'mi-step-3': [13, 14, 15],
        'mi-step-5': [18, 19],
      },
    },
    python: {
      language: 'python',
      code: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = []
    current = intervals[0]
    for i in range(1, len(intervals)):
        nxt = intervals[i]
        if nxt[0] <= current[1]:
            current[1] = max(current[1], nxt[1])
        else:
            merged.append(current)
            current = nxt
    merged.append(current)
    return merged`,
      lineMapping: {
        'mi-step-1': [3, 4, 6, 7],
        'mi-step-2': [9, 10],
        'mi-step-3': [12, 13, 14],
        'mi-step-5': [15, 16],
      },
    },
    java: {
      language: 'java',
      code: `public int[][] merge(int[][] intervals) {
    if (intervals.length <= 1) return intervals;
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    int[] current = intervals[0];
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] <= current[1]) {
            current[1] = Math.max(current[1], intervals[i][1]);
        } else {
            merged.add(current);
            current = intervals[i];
        }
    }
    merged.add(current);
    return merged.toArray(new int[merged.size()][]);
}`,
      lineMapping: {
        'mi-step-1': [3, 4, 6, 7],
        'mi-step-2': [9, 10],
        'mi-step-3': [11, 12, 13],
        'mi-step-5': [16, 17],
      },
    },
  },

  visualization: mergeIntervalsVisualization,

  challenge: {
    id: "mi-challenge-1",
    question: "Why must intervals be sorted by their start times prior to applying the merging sweep?",
    type: "multiple-choice",
    options: [
      'It is a requirements rule in binary sorting',
      'It ensures overlapping intervals must be adjacent, reducing the search space to O(N)',
      'It reduces the overall time complexity to O(log N)',
      'Sorting is optional and only helps display results neatly',
    ],
    correctAnswer: 1,
    hint: "If intervals are unsorted, could an overlap occur between the 1st and the 100th interval?",
    explanation: 'Sorting by start time guarantees that any overlapping intervals will be grouped adjacently, enabling a single linear pass to merge them.',
  },
};
