import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const kWayMergeVisualization: VisualizationConfig = {
  type: "stack-queue",
  sampleInput: [[2, 6], [3, 7], [1, 4]],
  inputLabel: "lists = [[2, 6], [3, 7], [1, 4]]",
  steps: [
    {
      logicalStepId: "kwm-step-1",
      label: "Initialize Heap with Heads",
      state: {
        array: ['L0:[2, 6]', 'L1:[3, 7]', 'L2:[1, 4]'],
        pointers: { L0: 0, L1: 0, L2: 0 },
        stack: ['1(L2)', '2(L0)', '3(L1)'],
        currentValue: 'merged = []'
      },
      narration: "Push the first element of each list onto the min-heap. The heap contains: 1 (from list 2), 2 (from list 0), 3 (from list 1). Output is empty.",
    },
    {
      logicalStepId: "kwm-step-2",
      label: "Pop 1, Push 4 from L2",
      state: {
        array: ['L0:[2, 6]', 'L1:[3, 7]', 'L2:[1, 4]'],
        pointers: { L0: 0, L1: 0, L2: 1 },
        stack: ['2(L0)', '3(L1)', '4(L2)'],
        currentValue: 'merged = [1]'
      },
      narration: "Pop the smallest element, which is 1 (from list 2). Add it to our merged list. Insert the next element from list 2, which is 4, into the heap.",
    },
    {
      logicalStepId: "kwm-step-3",
      label: "Pop 2, Push 6 from L0",
      state: {
        array: ['L0:[2, 6]', 'L1:[3, 7]', 'L2:[1, 4]'],
        pointers: { L0: 1, L1: 0, L2: 1 },
        stack: ['3(L1)', '4(L2)', '6(L0)'],
        currentValue: 'merged = [1, 2]'
      },
      narration: "Pop the smallest element 2 (from list 0). Add to output. Insert the next element from list 0, which is 6, into the heap.",
    },
    {
      logicalStepId: "kwm-step-4",
      label: "Pop 3, Push 7 from L1",
      state: {
        array: ['L0:[2, 6]', 'L1:[3, 7]', 'L2:[1, 4]'],
        pointers: { L0: 1, L1: 1, L2: 1 },
        stack: ['4(L2)', '6(L0)', '7(L1)'],
        currentValue: 'merged = [1, 2, 3]'
      },
      narration: "Pop the smallest element 3 (from list 1). Add to output. Insert the next element from list 1, which is 7, into the heap.",
    },
    {
      logicalStepId: "kwm-step-5",
      label: "Pop remaining elements",
      state: {
        array: ['L0:[2, 6]', 'L1:[3, 7]', 'L2:[1, 4]'],
        pointers: {},
        stack: [],
        currentValue: 'merged = [1, 2, 3, 4, 6, 7]'
      },
      narration: "Pop the remaining elements 4, 6, and 7 one by one from the heap and add them to the output. Merge completed.",
    },
  ],
};

export const kWayMergeLesson: Lesson = {
  patternId: 'k-way-merge',
  explanation: `Merge K sorted arrays/streams using a Min-Heap of size K in O(N log K).`,
  stepByStepReasoning: `1. Put heads of K lists in heap.
2. Pop smallest, append to output, and push next element from that same list.`,
  whenToUse: ['Merging K sorted lists', 'Merge sort external files'],
  timeComplexity: 'O(N log K)',
  spaceComplexity: 'O(K)',
  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `struct E { int val, lIdx, eIdx; bool operator>(const E& o) const { return val > o.val; } };
vector<int> mergeK(vector<vector<int>>& lists) {
    priority_queue<E, vector<E>, greater<E>> h;
    for(int i=0; i<lists.size(); ++i) if(!lists[i].empty()) h.push({lists[i][0], i, 0});
    vector<int> res;
    while(!h.empty()) {
        E c = h.top(); h.pop(); res.push_back(c.val);
        if(c.eIdx + 1 < lists[c.lIdx].size()) h.push({lists[c.lIdx][c.eIdx+1], c.lIdx, c.eIdx+1});
    }
    return res;
}`,
      lineMapping: { 'kwm-step-1': [4], 'kwm-step-2': [7, 8] }
    },
    python: {
      language: 'python',
      code: `import heapq
def mergeK(lists):
    h = []
    for i, l in enumerate(lists):
        if l: heapq.heappush(h, (l[0], i, 0))
    res = []
    while h:
        val, lIdx, eIdx = heapq.heappop(h)
        res.append(val)
        if eIdx + 1 < len(lists[lIdx]):
            heapq.heappush(h, (lists[lIdx][eIdx+1], lIdx, eIdx+1))
    return res`,
      lineMapping: { 'kwm-step-1': [4, 5], 'kwm-step-2': [8, 9] }
    },
    java: {
      language: 'java',
      code: `class Node implements Comparable<Node> {
    int val, lIdx, eIdx;
    Node(int v, int l, int e) { val=v; lIdx=l; eIdx=e; }
    public int compareTo(Node o) { return Integer.compare(val, o.val); }
}
public List<Integer> merge(int[][] lists) {
    PriorityQueue<Node> h = new PriorityQueue<>();
    for(int i=0; i<lists.length; i++) if(lists[i].length>0) h.add(new Node(lists[i][0], i, 0));
    List<Integer> res = new ArrayList<>();
    while(!h.isEmpty()) {
        Node c = h.poll(); res.add(c.val);
        if(c.eIdx+1 < lists[c.lIdx].length) h.add(new Node(lists[c.lIdx][c.eIdx+1], c.lIdx, c.eIdx+1));
    }
    return res;
}`,
      lineMapping: { 'kwm-step-1': [8], 'kwm-step-2': [11, 12] }
    }
  },
  visualization: kWayMergeVisualization,
  challenge: {
    id: "kwm-challenge-1",
    question: "What is the maximum elements in heap at any time?",
    type: "multiple-choice",
    options: ["N elements", "K elements", "N/K elements", "Log K elements"],
    correctAnswer: 1,
    hint: "One element from each list.",
    explanation: 'We only keep one active element per list in the heap, so size is at most K.'
  }
};
