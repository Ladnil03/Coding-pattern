import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const unionFindVisualization: VisualizationConfig = {
  type: "array",
  sampleInput: 'elements = 4, unions = [[0,1], [2,3], [1,3]]',
  inputLabel: "unions = [[0,1], [2,3], [1,3]]",
  steps: [
    {
      logicalStepId: "uf-step-1",
      label: "Initialize Disjoint Sets",
      state: {
        array: [0, 1, 2, 3],
        pointers: {},
        highlighted: [],
        currentValue: 'parents = [0, 1, 2, 3], ranks = [0, 0, 0, 0]'
      },
      narration: "Initialize the Disjoint Set Union (DSU) structure. Each of the 4 elements (0, 1, 2, 3) starts in its own separate component, pointing to itself as its root parent.",
    },
    {
      logicalStepId: "uf-step-2",
      label: "Union(0, 1)",
      state: {
        array: [0, 0, 2, 3],
        pointers: { root0: 0, root1: 1 },
        highlighted: [0, 1],
        currentValue: 'parents = [0, 0, 2, 3], ranks = [1, 0, 0, 0]'
      },
      narration: "Connect elements 0 and 1. Find root(0)=0 and root(1)=1. Since they are in different components, we merge component 1 under root 0. Parent array becomes: [0, 0, 2, 3].",
    },
    {
      logicalStepId: "uf-step-3",
      label: "Union(2, 3)",
      state: {
        array: [0, 0, 2, 2],
        pointers: { root2: 2, root3: 3 },
        highlighted: [2, 3],
        currentValue: 'parents = [0, 0, 2, 2], ranks = [1, 0, 1, 0]'
      },
      narration: "Connect elements 2 and 3. Find root(2)=2 and root(3)=3. Merge component 3 under root 2. Parent array becomes: [0, 0, 2, 2].",
    },
    {
      logicalStepId: "uf-step-4",
      label: "Union(1, 3) - Find Roots",
      state: {
        array: [0, 0, 2, 2],
        pointers: { find1: 0, find3: 2 },
        highlighted: [1, 3],
        currentValue: 'root(1)=0, root(3)=2'
      },
      narration: "Connect 1 and 3. Find root of 1: parent is 0, which is the root. Find root of 3: parent is 2, which is the root. Since roots differ (0 != 2), we proceed to merge.",
    },
    {
      logicalStepId: "uf-step-5",
      label: "Union(1, 3) - Merge Roots",
      state: {
        array: [0, 0, 0, 2],
        pointers: {},
        highlighted: [0, 2],
        currentValue: 'parents = [0, 0, 0, 2], ranks = [1, 0, 1, 0]'
      },
      narration: "Merge root 2 under root 0. Now element 2 points to 0. Element 3 points to 2 (which points to 0), forming a single unified component with root 0.",
    },
    {
      logicalStepId: "uf-step-6",
      label: "Find(3) with Path Compression",
      state: {
        array: [0, 0, 0, 0],
        pointers: { root3: 0 },
        highlighted: [3],
        currentValue: 'parents = [0, 0, 0, 0]'
      },
      narration: "Find(3) traverses 3 -> 2 -> 0. Path compression updates parent of 3 to point directly to root 0. Array becomes [0, 0, 0, 0].",
    },
  ],
};

export const unionFindLesson: Lesson = {
  patternId: 'union-find',
  explanation: `Data structure that tracks connected components in near-constant time O(α(N)).`,
  stepByStepReasoning: `1. Find root parent with Path Compression: update parent pointer directly to root.
2. Union by Rank/Size: merge smaller tree under root of larger tree.`,
  whenToUse: ['Connectivity in graphs', 'Kruskal MST cycle detection'],
  timeComplexity: 'O(α(N)) per operation (Inverse Ackermann function).',
  spaceComplexity: 'O(N)',
  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `class DSU {
    vector<int> parent, rank;
public:
    DSU(int n) {
        parent.resize(n); for(int i=0; i<n; i++) parent[i] = i;
        rank.assign(n, 0);
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]); // path compression
    }
    bool unite(int i, int j) {
        int rI = find(i), rJ = find(j);
        if (rI != rJ) {
            if (rank[rI] < rank[rJ]) parent[rI] = rJ;
            else if (rank[rI] > rank[rJ]) parent[rJ] = rI;
            else { parent[rJ] = rI; rank[rI]++; }
            return true;
        }
        return false;
    }
};`,
      lineMapping: { 'uf-step-1': [4], 'uf-step-2': [13], 'uf-step-6': [8, 9] }
    },
    python: {
      language: 'python',
      code: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    def find(self, i):
        if self.parent[i] == i: return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]
    def union(self, i, j):
        rI, rJ = self.find(i), self.find(j)
        if rI != rJ:
            if self.rank[rI] < self.rank[rJ]: self.parent[rI] = rJ
            elif self.rank[rI] > self.rank[rJ]: self.parent[rJ] = rI
            else: self.parent[rJ] = rI; self.rank[rI] += 1
            return True
        return False`,
      lineMapping: { 'uf-step-1': [2], 'uf-step-2': [10], 'uf-step-6': [5, 6] }
    },
    java: {
      language: 'java',
      code: `class DSU {
    int[] parent, rank;
    DSU(int n) {
        parent = new int[n]; for(int i=0; i<n; i++) parent[i] = i;
        rank = new int[n];
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
    boolean union(int i, int j) {
        int rI = find(i), rJ = find(j);
        if (rI != rJ) {
            if (rank[rI] < rank[rJ]) parent[rI] = rJ;
            else if (rank[rI] > rank[rJ]) parent[rJ] = rI;
            else { parent[rJ] = rI; rank[rI]++; }
            return true;
        }
        return false;
    }
}`,
      lineMapping: { 'uf-step-1': [3], 'uf-step-2': [11], 'uf-step-6': [7, 8] }
    }
  },
  visualization: unionFindVisualization,
  challenge: {
    id: "uf-challenge-1",
    question: "How does Path Compression improve search time?",
    type: "multiple-choice",
    options: [
      'By sorting elements',
      'By updating parent pointers along the path directly to the root, flattening the tree',
      'By converting tree to graph',
      'None'
    ],
    correctAnswer: 1,
    hint: "Flattens parent hierarchy.",
    explanation: 'Subsequent find queries resolve in one step because node parent references are flattened directly to the root.'
  }
};
