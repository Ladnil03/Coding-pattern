import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const dfsVisualization: VisualizationConfig = {
  type: "graph",
  sampleInput: { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: [] },
  inputLabel: "graph = { A: [B, C], B: [D], C: [E] }",
  steps: [
    {
      logicalStepId: "dfs-step-1",
      label: "Visit A",
      state: {
        graph: { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: [] },
        currentNode: "A",
        stack: ['A'],
        visited: [0]
      },
      narration: "Start DFS. We visit root node A, push it to our tracking stack, and mark it as visited.",
    },
    {
      logicalStepId: "dfs-step-2",
      label: "Go Deep: Visit B",
      state: {
        graph: { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: [] },
        currentNode: "B",
        stack: ['A', 'B'],
        visited: [0, 1]
      },
      narration: "From A, we check neighbors. B is unvisited. We move down to B, mark B visited, and push B to stack.",
    },
    {
      logicalStepId: "dfs-step-3",
      label: "Go Deep: Visit D",
      state: {
        graph: { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: [] },
        currentNode: "D",
        stack: ['A', 'B', 'D'],
        visited: [0, 1, 3]
      },
      narration: "From B, check neighbors. D is unvisited. Move deep to D, mark D visited, and push D to stack.",
    },
    {
      logicalStepId: "dfs-step-4",
      label: "Backtrack: Pop D & B",
      state: {
        graph: { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: [] },
        currentNode: "A",
        stack: ['A'],
        visited: [0, 1, 3]
      },
      narration: "D has no neighbors, so we pop D. Back at B, there are no other neighbors, so pop B. We return to A.",
    },
    {
      logicalStepId: "dfs-step-5",
      label: "Go Deep: Visit C",
      state: {
        graph: { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: [] },
        currentNode: "C",
        stack: ['A', 'C'],
        visited: [0, 1, 3, 2]
      },
      narration: "From A, the next neighbor is C. Since C is unvisited, we visit C and push it onto the stack.",
    },
    {
      logicalStepId: "dfs-step-6",
      label: "Go Deep: Visit E",
      state: {
        graph: { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: [] },
        currentNode: "E",
        stack: ['A', 'C', 'E'],
        visited: [0, 1, 3, 2, 4]
      },
      narration: "From C, E is unvisited. Move down to E, mark E visited, and push E to stack.",
    },
    {
      logicalStepId: "dfs-step-7",
      label: "Backtrack & Finish",
      state: {
        graph: { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: [] },
        currentNode: "",
        stack: [],
        visited: [0, 1, 3, 2, 4]
      },
      narration: "Pop E, pop C, and finally pop A. The stack is empty. All reachable nodes have been traversed.",
    },
  ],
};

export const dfsLesson: Lesson = {
  patternId: 'dfs',
  explanation: `Explore as deep as possible along each branch before backtracking. Recursive or explicit Stack.`,
  stepByStepReasoning: `1. Mark node visited.
2. For each neighbor: if not visited, recurse.`,
  whenToUse: ['Path finding', 'Detect cycles', 'Topological sort'],
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V) recursion stack',
  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `void dfsHelper(int node, const vector<vector<int>>& adj, vector<bool>& vis) {
    vis[node] = true;
    for (int n : adj[node]) if (!vis[n]) dfsHelper(n, adj, vis);
}
void dfs(int start, const vector<vector<int>>& adj) {
    vector<bool> vis(adj.size(), false);
    dfsHelper(start, adj, vis);
}`,
      lineMapping: { 'dfs-step-1': [2], 'dfs-step-2': [3] }
    },
    python: {
      language: 'python',
      code: `def dfs(node, adj, vis=None):
    if vis is None: vis = set()
    vis.add(node)
    for n in adj[node]:
        if n not in vis: dfs(n, adj, vis)`,
      lineMapping: { 'dfs-step-1': [3], 'dfs-step-2': [5] }
    },
    java: {
      language: 'java',
      code: `private void dfs(int node, List<List<Integer>> adj, boolean[] vis) {
    vis[node] = true;
    for(int n : adj.get(node)) if(!vis[n]) dfs(n, adj, vis);
}`,
      lineMapping: { 'dfs-step-1': [2], 'dfs-step-2': [3] }
    }
  },
  visualization: dfsVisualization,
  challenge: {
    id: "dfs-challenge-1",
    question: "What is backtracking?",
    type: "multiple-choice",
    options: [
      'Traversing backwards',
      'Reverting choices when returning up recursion stack in DFS',
      'Sorting trees',
      'None of these'
    ],
    correctAnswer: 1,
    hint: "Restoring state on returning.",
    explanation: 'Unwinding changes (like popping element from subset) so we can try other paths in recursion.'
  }
};
