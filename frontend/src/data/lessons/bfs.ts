import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const bfsVisualization: VisualizationConfig = {
  type: "graph",
  sampleInput: { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: [] },
  inputLabel: "graph = { A: [B, C], B: [D], C: [E] }",
  steps: [
    {
      logicalStepId: "bfs-step-1",
      label: "Initialize at Node A",
      state: {
        graph: { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: [] },
        currentNode: "A",
        queue: ['A'],
        visited: [0]
      },
      narration: "Start the BFS traversal at node A. We push A onto the queue and mark it as visited.",
    },
    {
      logicalStepId: "bfs-step-2",
      label: "Pop A, Add Neighbors B, C",
      state: {
        graph: { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: [] },
        currentNode: "A",
        queue: ['B', 'C'],
        visited: [0, 1, 2]
      },
      narration: "Dequeue A. Inspect its neighbors: B and C are unvisited. We enqueue both B and C and mark them as visited.",
    },
    {
      logicalStepId: "bfs-step-3",
      label: "Pop B, Add Neighbor D",
      state: {
        graph: { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: [] },
        currentNode: "B",
        queue: ['C', 'D'],
        visited: [0, 1, 2, 3]
      },
      narration: "Dequeue B. Its neighbor D is unvisited. We enqueue D and mark it as visited. Queue is now [C, D].",
    },
    {
      logicalStepId: "bfs-step-4",
      label: "Pop C, Add Neighbor E",
      state: {
        graph: { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: [] },
        currentNode: "C",
        queue: ['D', 'E'],
        visited: [0, 1, 2, 3, 4]
      },
      narration: "Dequeue C. Its neighbor E is unvisited. Enqueue E and mark it as visited. Queue is now [D, E].",
    },
    {
      logicalStepId: "bfs-step-5",
      label: "Pop D (No Neighbors)",
      state: {
        graph: { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: [] },
        currentNode: "D",
        queue: ['E'],
        visited: [0, 1, 2, 3, 4]
      },
      narration: "Dequeue D. Since D has no neighbors, the queue becomes [E] and no new nodes are visited.",
    },
    {
      logicalStepId: "bfs-step-6",
      label: "Pop E (No Neighbors) - Complete",
      state: {
        graph: { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: [] },
        currentNode: "E",
        queue: [],
        visited: [0, 1, 2, 3, 4]
      },
      narration: "Dequeue E. Queue is empty now, which signals that our level-order BFS traversal of the graph is complete.",
    },
  ],
};

export const bfsLesson: Lesson = {
  patternId: 'bfs',
  explanation: `Explore graph level by level using a Queue (FIFO).`,
  stepByStepReasoning: `1. Enqueue start.
2. While queue not empty, pop curr, process, and enqueue unvisited neighbors.`,
  whenToUse: ['Shortest path in unweighted graphs', 'Level-order traversal'],
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `void bfs(int start, vector<vector<int>>& adj) {
    vector<bool> vis(adj.size(), false);
    queue<int> q; vis[start] = true; q.push(start);
    while(!q.empty()) {
        int c = q.front(); q.pop();
        for(int n : adj[c]) if(!vis[n]) { vis[n] = true; q.push(n); }
    }
}`,
      lineMapping: { 'bfs-step-1': [3], 'bfs-step-2': [5, 6] }
    },
    python: {
      language: 'python',
      code: `from collections import deque
def bfs(start, adj):
    vis = {start}
    q = deque([start])
    while q:
        c = q.popleft()
        for n in adj[c]:
            if n not in vis: vis.add(n); q.append(n)`,
      lineMapping: { 'bfs-step-1': [3,4], 'bfs-step-2': [6, 7] }
    },
    java: {
      language: 'java',
      code: `public void bfs(int start, List<List<Integer>> adj) {
    boolean[] vis = new boolean[adj.size()];
    Queue<Integer> q = new LinkedList<>(); vis[start] = true; q.add(start);
    while(!q.isEmpty()) {
        int c = q.poll();
        for(int n : adj.get(c)) if(!vis[n]) { vis[n]=true; q.add(n); }
    }
}`,
      lineMapping: { 'bfs-step-1': [3], 'bfs-step-2': [5, 6] }
    }
  },
  visualization: bfsVisualization,
  challenge: {
    id: "bfs-challenge-1",
    question: "Why does BFS guarantee shortest path in unweighted graph?",
    type: "multiple-choice",
    options: [
      'Queues sort elements',
      'It explores nodes in increasing order of step distance from source',
      'It uses recursion',
      'None of these'
    ],
    correctAnswer: 1,
    hint: "BFS visits level 1 before level 2.",
    explanation: 'By exploring level by level, we guarantee the first time we see a node is the shortest step distance from the source.'
  }
};
