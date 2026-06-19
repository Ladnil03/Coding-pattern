# Master Prompt: Take the Coding-Pattern Learning Site from MVP to Production-Grade

Paste everything below into your AI assistant of choice. This assumes the MVP (pattern lessons, read-only multi-language code, static visualization, conceptual challenges, light/dark mode, localStorage progress) is already built and working.

---

## ROLE & CONTEXT

You are a senior full-stack engineer and technical lead who specializes in taking educational web MVPs to production. You will be given an existing React + TypeScript codebase for an interactive coding-pattern learning site (20 patterns across 6 categories: Array/String, Search/Sort, Tree/Graph, Backtracking/Subsets, Dynamic Programming, Advanced/Union-Find). The MVP currently has: per-pattern lessons with explanation + C++/Python/Java reference code, a basic static visualization, conceptual challenges, light/dark mode, and localStorage-based progress tracking.

Your job is **not** to redesign the product — it is to harden, scale, and polish the existing implementation into something you would be comfortable shipping to real users and maintaining long-term. Treat this as a production-readiness engagement: assume real traffic, real accounts, real content for all 20 patterns, and ongoing maintenance by a small team.

---

## SCOPE: WHAT "PRODUCTION-GRADE" MEANS HERE

Address every category below. For each, state current-state assumptions you're making about the MVP, then specify the production bar and the concrete work to get there.

### 1. Content Completeness & Quality
- All 20 patterns fully authored (explanation, step-by-step reasoning, reference code in C++/Python/Java, sample inputs covering typical/edge/worst case, full step-trace data for visualization, at least 2-3 conceptual challenges each) — no placeholder or "TODO" content.
- A content style guide (tone, terminology consistency, code formatting conventions per language, complexity-analysis notation) so future pattern additions stay consistent.
- A content review/QA checklist (technical accuracy, pedagogical clarity, code correctness verified against actual compilers/interpreters offline, visualization accuracy vs the reference code).
- A process for adding new patterns later without code changes (content-as-data, ideally in versioned JSON/MDX files, not hardcoded in components).

### 2. Animation & Visualization Robustness
- Move from static diagrams to fully animated, line-synced step traces for all 20 patterns (per the Phase 2 visualization plan from the MVP spec).
- Verify visualizations remain smooth and visually correct across sample input sizes (small, large/worst-case) and across both themes.
- Define and handle edge cases: empty input, single-element input, no-solution cases — visualizations must not break or show blank/confusing states.
- Performance budget for animations (target frame rate, max DOM/SVG node count, debouncing on rapid scrub/seek interactions).

### 3. Accessibility (full audit, not baseline)
- Full WCAG 2.1 AA audit across all pages and both themes (automated via axe/Lighthouse + manual screen-reader pass with NVDA/VoiceOver).
- Keyboard-only walkthrough of every interactive element including the animation scrubber/play controls and conceptual challenges.
- Proper ARIA roles/live-regions so animated visualization state changes are announced sensibly to screen-reader users without being noisy.
- Reduced-motion support (respect `prefers-reduced-motion`, provide a manual "reduce motion" toggle as fallback).
- Document results and any known gaps with remediation plan/timeline.

### 4. Performance & Frontend Engineering
- Code-splitting and lazy-loading per pattern/route so initial bundle stays lean as content scales to 20+ patterns.
- Image/asset optimization (especially any Stitch-MCP-generated diagrams/icons): correct formats, responsive sizing, lazy loading.
- Core Web Vitals targets (LCP, CLS, INP) with a measurement plan (Lighthouse CI in the pipeline) and concrete thresholds to gate releases.
- Caching strategy for static content (pattern JSON/MDX, step-trace data) — CDN-level and browser-level.
- Memory-leak check for the visualization engine on repeated mount/unmount across pattern navigation.

### 5. Backend & Data Layer
- Replace localStorage-only progress with a real backend: data model for users, progress, and (optionally) saved preferences.
- Authentication: support anonymous usage by default, with optional account creation/login (email or OAuth) to sync progress across devices — specify provider/approach and session handling.
- API design: finalize REST/RPC contract for `GET /patterns`, `GET /patterns/:id`, `GET/POST /progress`, with versioning strategy (e.g., `/v1/`) and pagination/filtering for the pattern list.
- Database choice and schema for users/progress (justify SQL vs NoSQL for this access pattern).
- Rate limiting and abuse protection on any public write endpoints (progress writes, account creation).
- Migration plan: how existing localStorage progress is preserved/migrated into the new backend for returning users (don't silently wipe their progress).

### 6. Stitch MCP Asset Pipeline (production version)
- Formalize the content pipeline: which visual assets are Stitch-MCP-generated vs hand-built, how they're versioned, and how a content update (e.g., revised diagram for a pattern) flows from generation → review → deployment without manual file shuffling.
- Define ownership/storage (e.g., asset bucket + CDN) and a rollback plan if a generated asset needs to be reverted.
- Flag any Stitch MCP capability assumptions that need verifying against current docs before this pipeline is finalized.

### 7. Testing Strategy
- Unit tests for core logic: progress tracking, step-trace data parsing, challenge answer-checking.
- Component tests (React Testing Library) for key components: LessonPage, CodeVisualizer (mock step data), ConceptualChallenge, PatternIndex/search/filter.
- Integration tests covering full user flows: browse → open lesson → switch language tab → step through visualization → complete challenge → progress persists.
- Visual regression testing for the visualizer and both themes (e.g., Chromatic/Playwright screenshot diffing) to catch unintended rendering breaks as patterns/content are added.
- Accessibility tests wired into CI (axe-core via Playwright or jest-axe).
- Define a minimum coverage bar and which test types are required to merge vs nice-to-have.

### 8. CI/CD & Environments
- CI pipeline stages: lint, type-check, unit/component tests, build, Lighthouse/axe checks, visual regression — define what blocks a merge vs what's advisory.
- Environment strategy: local, staging/preview (e.g., per-PR preview deploys), production — with config/secrets handled per environment (never hardcoded).
- Deployment strategy (e.g., static frontend on a CDN/edge platform, backend as a separate service) with rollback procedure.
- Versioning/release process (semantic versioning or date-based, changelog discipline).

### 9. Observability & Reliability
- Error tracking (e.g., Sentry-style) wired into the frontend and backend, with alerting thresholds.
- Analytics for product decisions: pattern completion rates, drop-off points, challenge accuracy — specify what's tracked and a privacy-respecting approach (no PII beyond what's necessary, clear retention policy).
- Uptime/health-check monitoring for the backend API.
- Logging strategy (structured logs, what's logged at each layer, log retention).
- A basic incident-response runbook: what to do if the API is down, if a visualization is broken for a specific pattern, if auth breaks.

### 10. Security
- Standard web hardening: CSP headers, HTTPS-only, secure cookie flags for session tokens, input validation/sanitization on any user-writable fields (progress notes, account fields if any).
- Dependency vulnerability scanning in CI (e.g., npm audit / Dependabot equivalent) with a patching SLA.
- Review of third-party libraries used for code-highlighting/markdown rendering for injection risks (especially if any user-generated content is ever rendered as markdown/HTML).
- Secrets management (no API keys or credentials in the repo or client bundle).

### 11. SEO & Discoverability (if public-facing)
- Server-side rendering or static generation for lesson pages so pattern content is crawlable/indexable.
- Per-pattern meta tags, structured data (e.g., `LearningResource` schema), and a sitemap.
- Social share previews (OG tags) per pattern page.

### 12. Documentation & Maintainability
- README covering local setup, environment variables, how to add a new pattern (content schema + required assets), and how to run the full test suite.
- Architecture doc: high-level diagram of frontend/backend/asset-pipeline boundaries and data flow.
- Contribution guidelines (code style, PR template, required checks) if more than one person will touch this codebase.

---

## DELIVERABLES — produce ALL of the following

1. **Production Readiness Audit** — a checklist-style gap analysis: for each of the 12 categories above, list current-state assumption, target bar, and concrete remaining work, with a rough effort estimate (developer-days) per item.
2. **Prioritized Hardening Roadmap** — group the audit items into milestones (e.g., "Pre-launch blockers," "Launch-week," "Post-launch hardening") with sequencing and dependencies, and a total estimated timeline for a small team (1-3 engineers).
3. **Updated Architecture Diagram (textual)** — frontend, backend, database, CDN/asset pipeline, CI/CD, monitoring — showing how they connect in production.
4. **Concrete Implementation Snippets** for the highest-priority items, specifically:
   - Backend API route skeletons (with auth middleware stub) for `/v1/patterns`, `/v1/patterns/:id`, `/v1/progress`.
   - A migration utility (TypeScript) that reads existing localStorage progress and POSTs it to the new backend on first login, with conflict handling (e.g., merge by most-recent timestamp).
   - A CI pipeline config (e.g., GitHub Actions YAML) implementing the stages from section 8.
   - A reduced-motion-aware wrapper for the `CodeVisualizer` component (from section 2).
5. **Testing Plan Detail** — a table mapping each of the 8 testing types in section 7 to specific tools/frameworks, and 2-3 example test cases written out in full (not just described) for the most critical flow (lesson → visualize → challenge → progress saved).
6. **Risk Register** — top 8-10 risks to a successful production launch (technical, content, accessibility, security), each with likelihood, impact, and mitigation.
7. **Launch Checklist** — a final go/no-go checklist to run through immediately before flipping the site live.

---

## OUTPUT FORMAT INSTRUCTIONS

- Use clear `##`/`###` headers matching the 7 deliverables above.
- Prefer tables and checklists over prose wherever something is enumerable (gap analysis, roadmap, risk register, launch checklist).
- Code snippets must be complete and syntactically valid (TypeScript/YAML as appropriate) — not pseudocode — though backend persistence/auth internals can be stubbed with clear `// TODO` markers if a specific provider isn't yet chosen.
- Be explicit and opinionated about trade-offs (e.g., SQL vs NoSQL, SSR vs static generation) rather than listing options without a recommendation — this is a build decision, not a survey.
- End with a short "Assumptions Made" section listing anything about the current MVP implementation, team size, hosting platform, or auth provider you had to assume, so I can confirm or correct before you proceed.

---

## BEFORE YOU START

If you believe any of the above scope is unnecessary for this project's actual scale (e.g., full SSR/SEO work if this will only ever be used by a closed cohort of students, not public search traffic), flag that trade-off explicitly and propose a leaner alternative — but still produce a complete plan rather than stopping to ask first.