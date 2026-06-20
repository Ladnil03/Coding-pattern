import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const topologicalSortVisualization: VisualizationConfig = {
  type: "graph",
  sampleInput: { 0: [2], 1: [2], 2: [3], 3: [4], 4: [] },
  inputLabel: "DAG: 0->2, 1->2, 2->3, 3->4",
  steps: [
    {
      logicalStepId: "ts-step-1",
      label: "Calculate Indegrees & Queue 0-degree",
      state: {
        graph: { '0': ['2'], '1': ['2'], '2': ['3'], '3': ['4'], '4': [] },
        queue: ['0', '1'],
        visited: [],
        currentValue: 'indegrees = {0:0, 1:0, 2:2, 3:1, 4:1}'
      },
      narration: "First, count the incoming edges (indegrees) for all nodes. Nodes 0 and 1 have an indegree of 0, so enqueue them.",
    },
    {
      logicalStepId: "ts-step-2",
      label: "Process Node 0",
      state: {
        graph: { '0': ['2'], '1': ['2'], '2': ['3'], '3': ['4'], '4': [] },
        currentNode: "0",
        queue: ['1'],
        visited: [0],
        currentValue: 'indegrees = {2:1, 3:1, 4:1}'
      },
      narration: "Dequeue 0. Add 0 to our sorted result. Decrement the indegree of neighbor 2 from 2 to 1.",
    },
    {
      logicalStepId: "ts-step-3",
      label: "Process Node 1, Queue 2",
      state: {
        graph: { '0': ['2'], '1': ['2'], '2': ['3'], '3': ['4'], '4': [] },
        currentNode: "1",
        queue: ['2'],
        visited: [0, 1],
        currentValue: 'indegrees = {2:0, 3:1, 4:1}'
      },
      narration: "Dequeue 1 and append it to our sorted output. Decrement the indegree of neighbor 2 again; it becomes 0, so we enqueue 2.",
    },
    {
      logicalStepId: "ts-step-4",
      label: "Process Node 2, Queue 3",
      state: {
        graph: { '0': ['2'], '1': ['2'], '2': ['3'], '3': ['4'], '4': [] },
        currentNode: "2",
        queue: ['3'],
        visited: [0, 1, 2],
        currentValue: 'indegrees = {3:0, 4:1}'
      },
      narration: "Dequeue 2. Add it to our sorted output. Decrement neighbor 3's indegree from 1 to 0 and enqueue 3.",
    },
    {
      logicalStepId: "ts-step-5",
      label: "Process Node 3, Queue 4",
      state: {
        graph: { '0': ['2'], '1': ['2'], '2': ['3'], '3': ['4'], '4': [] },
        currentNode: "3",
        queue: ['4'],
        visited: [0, 1, 2, 3],
        currentValue: 'indegrees = {4:0}'
      },
      narration: "Dequeue 3. Add to output. Decrement neighbor 4's indegree to 0 and enqueue 4.",
    },
    {
      logicalStepId: "ts-step-6",
      label: "Process Node 4 - Complete",
      state: {
        graph: { '0': ['2'], '1': ['2'], '2': ['3'], '3': ['4'], '4': [] },
        currentNode: "4",
        queue: [],
        visited: [0, 1, 2, 3, 4],
        currentValue: 'Result = [0, 1, 2, 3, 4]'
      },
      narration: "Dequeue 4. Add to output. Since the queue is now empty and our output length matches the graph size, we have a valid topological order!",
    },
  ],
};

export const topologicalSortLesson: Lesson = {
  patternId: 'topological-sort',
  explanation: `Topological ordering of Directed Acyclic Graph (DAG) using Kahn's algorithm.`,
  stepByStepReasoning: `1. Calc indegrees. Enqueue 0-indegree nodes.
2. While queue not empty, pop curr, push to result, and decrement neighbor indegrees. Enqueue if neighbor becomes 0.`,
  whenToUse: ['Task scheduling with prerequisites', 'Dependency resolution'],
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `vector<int> topo(int n, const vector<vector<int>>& adj) {
    vector<int> ind(n, 0);
    for(int u=0; u<n; u++) for(int v : adj[u]) ind[v]++;
    queue<int> q; for(int i=0; i<n; i++) if(ind[i]==0) q.push(i);
    vector<int> res;
    while(!q.empty()) {
        int u = q.front(); q.pop(); res.push_back(u);
        for(int v : adj[u]) if(--ind[v] == 0) q.push(v);
    }
    return res.size() == n ? res : vector<int>{};
}`,
      lineMapping: { 'ts-step-1': [3,4], 'ts-step-2': [7, 8] }
    },
    python: {
      language: 'python',
      code: `from collections import deque
def topo(n, adj):
    ind = [0]*n
    for u in range(n):
        for v in adj[u]: ind[v] += 1
    q = deque([i for i in range(n) if ind[i]==0])
    res = []
    while q:
        u = q.popleft()
        res.append(u)
        for v in adj[u]:
            ind[v] -= 1
            if ind[v] == 0: q.append(v)
    return res if len(res) == n else []`,
      lineMapping: { 'ts-step-1': [5,6], 'ts-step-2': [9, 10] }
    },
    java: {
      language: 'java',
      code: `public int[] topo(int n, List<List<Integer>> adj) {
    int[] ind = new int[n];
    for(int u=0; u<n; u++) for(int v : adj.get(u)) ind[v]++;
    Queue<Integer> q = new LinkedList<>();
    for(int i=0; i<n; i++) if(ind[i]==0) q.add(i);
    int[] res = new int[n]; int idx=0;
    while(!q.isEmpty()) {
        int u = q.poll(); res[idx++] = u;
        for(int v : adj.get(u)) if(--ind[v] == 0) q.add(v);
    }
    return idx == n ? res : new int[0];
}`,
      lineMapping: { 'ts-step-1': [5], 'ts-step-2': [8, 9] }
    }
  },
  visualization: topologicalSortVisualization,
  challenge: {
    id: "ts-challenge-1",
    question: "What if final result has fewer nodes than N?",
    type: "multiple-choice",
    options: ["Graph is disconnected", "Graph has cycle", "BFS stack overflowed", "None"],
    correctAnswer: 1,
    hint: "Nodes inside cycle never get indegree 0.",
    explanation: 'A cycle ensures indegrees of nodes in the cycle never drop to 0, so they are never processed.'
  }
};
