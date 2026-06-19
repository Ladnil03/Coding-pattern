# Master Prompt: Interactive Coding-Pattern Learning Website

Paste everything below into your AI assistant of choice.

---

## ROLE & CONTEXT

You are a senior UI/UX designer and full-stack engineer who specializes in educational technology platforms for computer science learners. You have deep experience building interactive coding-pattern curricula (sliding window, two pointers, fast & slow pointers, merge intervals, cyclic sort, monotonic stack, modified binary search, top-K/heap, k-way merge, BFS/DFS, topological sort, backtracking/subsets, bitwise XOR, DP variants, and union-find).

Your target audience: computer science students and interview-prep learners who already know basic programming (C++, Python, Java) and want to internalize *patterns*, not just memorize individual problems.

**Important scope clarification**: This is a learning/explanation site, not a coding-practice IDE. Students do **not** write or run their own code on this site. For each pattern, the site presents the canonical reference implementation (in C++, Python, and Java) and helps the student *understand and visualize* how that existing code executes on sample inputs. There is no code editor, no "Run" button, and no code execution sandbox anywhere in this product — remove any such features from your plan.

Your task: produce a complete project plan, design spec, and starter code for a polished, accessible, multi-language interactive learning website covering the following 20 patterns, grouped by category:

1. **Array & String Patterns**: Sliding Window, Two Pointers, Fast & Slow Pointers, Merge Intervals, Cyclic Sort, Monotonic Stack
2. **Search & Sort Patterns**: Modified Binary Search, Top K Elements (Heap), K-way Merge
3. **Tree & Graph Patterns**: BFS, DFS, Topological Sort
4. **Backtracking & Subsets**: Subsets/Backtracking, Bitwise XOR
5. **Dynamic Programming Patterns**: DP 0/1 Knapsack, DP Unbounded Knapsack, DP LCS/LIS, DP Palindromes, DP Matrix Chain/Interval
6. **Advanced Pattern**: Union Find (Disjoint Set)

---

## SCOPE & FEATURE SET (MVP + phased enhancements)

### MVP (Phase 1)
- Interactive lesson page per pattern: explanation, step-by-step reasoning, and the canonical reference code in **C++, Python, and Java** (read-only, syntax-highlighted, switchable by tab — no editing, no execution).
- Static (non-animated) code visualization: a labeled diagram of the pattern's mechanics on one sample input, with clear mapping between the visualization and the specific lines of the reference code it represents.
- Navigation: pattern index grouped by category, basic search, progress checkboxes (completed/not completed) stored in localStorage.
- One interactive challenge per pattern, framed as a **conceptual check** (e.g., "predict what the pointers do next," "identify which line causes the window to shrink") rather than a code-writing exercise — with a "check answer" button and a single hint.
- Light/dark mode toggle; responsive layout (mobile, tablet, desktop).
- Baseline accessibility: semantic HTML, keyboard-navigable nav, WCAG AA contrast.

### Phase 2 (Enhancement)
- Animated step-by-step execution traces (canvas/SVG) of the reference code on sample inputs, with the current line of code highlighted in sync with the animation, and play/pause/step/scrub controls.
- Multiple sample inputs per pattern (e.g., typical case, edge case, worst case) that the student can switch between to re-run the same visualization.
- Tag-based filtering (difficulty, data structure, time complexity) in addition to category search.
- Multi-hint progressive disclosure + automatic feedback on conceptual challenges (e.g., multiple-choice on "what happens next," drag-to-order steps).
- Account-based progress sync (replacing localStorage) via backend.

### Phase 3 (Stretch)
- Spaced-repetition review queue across completed patterns.
- Side-by-side comparison view: visualize two related patterns (e.g., sliding window vs two pointers) on the same input to highlight mechanical differences.
- Pattern "mixer" challenges that show a snippet of reference code and ask the student to identify which pattern it implements.

For each phase, produce **time estimates in developer-days** and **milestone checkpoints**.

---

## DELIVERABLES — produce ALL of the following, clearly labeled with headers

### 1. Feature-Spec Document
- User stories in the format: "As a [role], I want [feature], so that [benefit]."
- Acceptance criteria per user story (bullet checklist, testable).
- Explicitly separate MVP vs Phase 2 vs Phase 3 stories.

### 2. MVP Roadmap
- Milestone-based roadmap (e.g., M1: Content & Navigation Shell, M2: Code Display & Lesson Pages, M3: Visualization Engine, M4: Conceptual Challenges & Progress, M5: Polish & Accessibility Audit).
- Time estimate per milestone in developer-days, and a suggested team size (solo vs 2-3 person team) with adjusted estimates for each.
- Explicit dependencies between milestones.

### 3. UI Wireframes / Component Map (textual)
- A textual wireframe (ASCII or structured description) for: Home/Pattern Index, Lesson Page (explanation + code tabs + visualizer), Challenge View (conceptual check), Progress Dashboard.
- A component map showing the React component tree (e.g., `App > Layout > Sidebar/PatternIndex, App > Layout > LessonPage > {ExplanationPanel, CodeTabs, Visualizer, ChallengePanel}`).
- Note which components are shared/reusable vs pattern-specific.

### 4. Starter Code Skeleton (TypeScript/React)
Provide working, minimal-but-real code for:
- Project scaffold notes (Vite + React + TypeScript recommended; minimal routing via `react-router-dom`).
- `PatternIndex` component (renders the 6 categories and 20 patterns from a typed data model).
- A `Pattern` and `Lesson` TypeScript interface/type definitions covering: id, category, title, difficulty, tags, explanation (markdown), referenceCode (per language, read-only source + line-number metadata for highlighting), visualizationConfig (step-trace data + line-mapping), challenge (conceptual question + options/answer + hint).
- A `LessonPage` component skeleton with read-only, syntax-highlighted tabs for C++/Python/Java reference code display (use a code-highlighting library choice and justify it; no editing affordances).
- A `CodeVisualizer` component skeleton (canvas or SVG — choose one and justify) with props for step data and play/pause/step controls, plus a way to highlight the corresponding line(s) of the active code tab as the visualization steps through — even if the animation logic itself is stubbed.
- A `ProgressContext` (React Context + hooks) for tracking completed/not-completed state, with localStorage persistence for MVP.
- A `ConceptualChallenge` component skeleton (e.g., multiple-choice or step-ordering question about the pattern's behavior) with a stubbed "check answer" handler and hint reveal.
- State management approach: justify Context+hooks vs a state library for this scope.

### 5. Visualization Technical Plan
- Compare canvas vs SVG for animated execution traces of the reference code on sample inputs; recommend one with justification (consider: number of simultaneous animated elements, ease of styling/theming for light/dark mode, accessibility of SVG via ARIA, ease of syncing with code-line highlighting).
- Describe the data model for a "step trace": a sequence of state snapshots (e.g., pointer positions, window bounds, stack/queue contents, visited sets) each tagged with the corresponding source line number(s) in each language's reference code, so the same trace can drive both the visualization and the line-highlight in the code panel.
- Describe how a single step-trace dataset can stay in sync across three language tabs (C++/Python/Java) even though line numbers differ per language — propose a normalized "logical step" abstraction independent of any one language's exact line numbers.
- Note performance considerations for animating larger sample inputs (e.g., array of 30+ elements) smoothly on lower-end devices.

### 6. Sample Prompt Templates
Provide 2-3 reusable prompt templates (for use with an LLM) for:
- Generating a new lesson's explanation + step-by-step reasoning + canonical reference code samples in 3 languages, given just a pattern name.
- Generating a visualization step-trace (sequence of state snapshots, each mapped to logical steps and per-language line numbers) for a given pattern + sample input, in a structured JSON format consumable by the `CodeVisualizer` component.
- Generating a new conceptual challenge (a question that tests understanding of the pattern's mechanics — e.g., "what is the window size after this step," "which line triggers the pointer to advance" — plus answer options and a hint) for a given pattern, without requiring the student to write any code.

### 7. Backend & Stitch MCP Integration Plan
- Propose an API surface (REST or RPC-style) covering: content delivery (`GET /patterns`, `GET /patterns/:id` — including reference code, explanation, and step-trace data), and user progress (`GET/POST /progress`). No code-execution endpoint is needed since the site does not run user-submitted code.
- Describe how the **Stitch MCP server** would be used to design/deploy visual assets (e.g., generating illustrative diagrams, icons, or UI mockups) as part of the content pipeline — outline what gets generated via Stitch vs hand-built.
- Cover authentication approach (e.g., anonymous + optional account upgrade), content delivery strategy (static JSON/MDX vs CMS), and how generated visual assets from Stitch are stored/versioned and served.
- Flag any assumptions about Stitch MCP capabilities you are making, since exact tool capabilities should be verified against current documentation before implementation.

### 8. Design System Notes
- Define a small design token set (color palette for light/dark, type scale, spacing scale) aimed at a "premium, human-made" feel rather than generic default-template look — reference specific design choices (e.g., warm off-white background instead of pure white, a distinctive accent color, custom-feel typography pairing) rather than boilerplate Tailwind defaults.
- State the chosen styling approach (CSS Modules vs CSS-in-JS) and justify briefly.
- Note specific accessibility commitments: keyboard focus states, skip-to-content link, ARIA labeling for the visualizer's animated states, minimum contrast ratios for both themes.

---

## OUTPUT FORMAT INSTRUCTIONS

- Use clear `##`/`###` headers matching the 8 deliverables above.
- Where code is requested, output complete, syntactically valid TypeScript/React — not pseudocode — but keep animation/visualization logic stubbed with clear `// TODO` markers where full implementation is out of scope for this pass.
- Keep the feature-spec and roadmap concise and scannable (tables/bullets preferred over prose).
- End with a short "Open Questions / Assumptions" section listing anything you had to assume (e.g., team size, hosting platform, exact Stitch MCP capabilities) so the developer can confirm or correct before implementation begins.

---

## BEFORE YOU START

If anything about the stack, scope, or feature priorities above is ambiguous or you believe an alternative approach would serve this project better, briefly state your recommended adjustment and the trade-off, then proceed with your best-judgment version of the plan rather than stopping to ask — the developer will iterate on your output afterward.
