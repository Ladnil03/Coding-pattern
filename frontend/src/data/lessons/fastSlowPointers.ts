import type { Lesson } from '../../types/pattern';
import type { VisualizationConfig } from '../../types/visualization';

const fastSlowPointersVisualization: VisualizationConfig = {
  type: "linked-list",
  sampleInput: '1 -> 2 -> 3 -> 4 -> 5 -> 3 (cycle)',
  inputLabel: "head = [1, 2, 3, 4, 5], cycle at node 3",
  steps: [
    {
      logicalStepId: "fsp-step-1",
      label: "Initialize pointers",
      state: {
        array: [1, 2, 3, 4, 5],
        pointers: { slow: 0, fast: 0 },
        visited: [0]
      },
      narration: "Place both slow and fast pointers at the head node (index 0, value 1).",
    },
    {
      logicalStepId: "fsp-step-2",
      label: "First move",
      state: {
        array: [1, 2, 3, 4, 5],
        pointers: { slow: 1, fast: 2 },
        visited: [0, 1, 2]
      },
      narration: "Slow moves 1 step to index 1 (value 2). Fast moves 2 steps to index 2 (value 3). No cycle detected yet.",
    },
    {
      logicalStepId: "fsp-step-3",
      label: "Second move",
      state: {
        array: [1, 2, 3, 4, 5],
        pointers: { slow: 2, fast: 4 },
        visited: [0, 1, 2, 3, 4]
      },
      narration: "Slow moves to index 2 (value 3). Fast moves to index 4 (value 5). Pointers have not met.",
    },
    {
      logicalStepId: "fsp-step-4",
      label: "Third move (Fast enters cycle)",
      state: {
        array: [1, 2, 3, 4, 5],
        pointers: { slow: 3, fast: 2 },
        visited: [0, 1, 2, 3, 4]
      },
      narration: "Slow moves to index 3 (value 4). Fast enters the cycle, moving from node 5 to node 3 (index 2).",
    },
    {
      logicalStepId: "fsp-step-5",
      label: "Fourth move",
      state: {
        array: [1, 2, 3, 4, 5],
        pointers: { slow: 4, fast: 4 },
        visited: [0, 1, 2, 3, 4]
      },
      narration: "Slow moves to node 5. Fast moves 2 steps from node 3 to node 5. Both pointers are now at node 5. Cycle detected!",
    },
  ],
};

export const fastSlowPointersLesson: Lesson = {
  patternId: 'fast-slow-pointers',
  explanation: `The **Fast & Slow Pointers** (Hare & Tortoise) algorithm uses two pointers moving at different speeds.

### Core Mechanics
- **Slow Pointer**: Moves one step at a time (\`slow = slow.next\`).
- **Fast Pointer**: Moves two steps at a time (\`fast = fast.next.next\`).`,
  stepByStepReasoning: `1. **Initialize pointers**: Set both \`slow\` and \`fast\` to head.
2. **Move pointers**: Loop while \`fast\` and \`fast.next\` exist.
3. **Check meeting**: If \`slow === fast\`, cycle exists.`,
  whenToUse: [
    'Detecting a loop in a linked list',
    'Finding middle of a list',
  ],

  timeComplexity: 'O(n) — where n is the number of nodes.',
  spaceComplexity: 'O(1) — only two pointer variables.',

  referenceCode: {
    cpp: {
      language: 'cpp',
      code: `bool hasCycle(ListNode* head) {
    if (!head || !head->next) return false;
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
      lineMapping: {
        'fsp-step-1': [3, 4, 5],
        'fsp-step-2': [7, 8],
        'fsp-step-5': [9],
      },
    },
    python: {
      language: 'python',
      code: `def has_cycle(head: ListNode) -> bool:
    if not head or not head.next:
        return False
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
      lineMapping: {
        'fsp-step-1': [4, 5],
        'fsp-step-2': [7, 8],
        'fsp-step-5': [9, 10],
      },
    },
    java: {
      language: 'java',
      code: `public boolean hasCycle(ListNode head) {
    if (head == null || head.next == null) return false;
    ListNode slow = head;
    ListNode fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
      lineMapping: {
        'fsp-step-1': [3, 4, 5],
        'fsp-step-2': [7, 8],
        'fsp-step-5': [9],
      },
    },
  },

  visualization: fastSlowPointersVisualization,

  challenge: {
    id: "fsp-challenge-1",
    question: "If a linked list has a cycle of length C, once the slow pointer enters the cycle, what is the maximum number of steps the fast pointer needs to catch up?",
    type: "multiple-choice",
    options: [
      'C steps',
      '2 * C steps',
      'C / 2 steps',
      'Infinite steps — they may never meet',
    ],
    correctAnswer: 0,
    hint: "Think about the relative speed of the fast pointer compared to the slow pointer.",
    explanation: 'The fast pointer reduces the distance to the slow pointer by 1 in each step. Therefore, it will catch up in at most C steps.',
  },
};
