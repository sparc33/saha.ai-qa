# Test Plan: EPIC-011 — Conversational AI Patient Intake

## Metadata

- Source: Confluence page "EPIC-011 — Conversational AI Patient Intake" (id `5885919637`), Status: **Proposed** — not a Jira ticket, no `VAN-XX` key exists for this epic or any of its stories as of 2026-09-18
- Requirements source type: `confluence-page` (per `sdlcIntegration.requirementsSourcePreference` in `qa-fleet.config.json`) — used here as the *sole* source, not a fallback for a ticket that has one, since no Jira ticket exists at all for this epic
- Preceded by a full Story Testability Reviewer pass (methodology in `story-testability-reviewer.agent.md`, applied directly to this Confluence content) — see `docs/testability-reviews/epic-011-testability-review-2026-09-18.md`
- Team: n/a (no team split for this project)
- Components: VAN (placeholder)
- Labels: `ManualTC` + `surface:patient-chat-ui` per row
- Generated: 2026-09-18

## Scenario Coverage Summary

- Total ACs reviewed: 36 (across US-037 through US-043)
- Total test cases generated: 37 (AC-040.5 was scored `Compound` in the testability review and split into two independent test cases — typing indicator, and duplicate/out-of-order submission prevention)
- 23 of 36 source ACs were `Testable` as written; the remaining 13 (`Ambiguous`, `Missing Data`, or `Compound`) still got a test case each, with the specific gap called out inline in that row's `Step Expected Result` and title — not skipped, since skipping a safety-relevant AC (e.g. AC-041.1/AC-041.2, both in the red-flag/escalation story) would silently drop coverage that should instead stay visible as "written, but blocked on an open question."
- Risk-gated coverage: **no new synthesized rows added.** All four categories (`clinical-red-flag-escalation`, `decision-support-not-diagnosis`, `tenant-isolation`, `patient-record-matching`) are already at 100% coverage via `safety-net-baseline-testcases-2026-09-17.csv` — per the PHASE 1D dedup check, re-synthesizing here would duplicate that existing baseline. Real, story-sourced coverage from this epic (rows 300024-300028, US-041) is additive to — not a replacement for — the generic safety-net rows already covering `clinical-red-flag-escalation`.

## PHASE 2.5 risk-gated silence, carried over from the testability review

Two categories the safety-net baseline covers generically are **not addressed by any AC in this epic at all**, worth remembering if this epic ever gets ticketed for real:
- `decision-support-not-diagnosis` — this epic is entirely patient-facing; the clinician-facing tier/rationale/override behaviors that category requires live in EPIC-004, not here.
- `tenant-isolation` — no AC in this epic mentions clinic-scoping.

`patient-record-matching` is partially touched (US-038's identity verification) but never addresses the exact-match-vs-fuzzy-match precision the category specifically requires.

## Open dependencies inherited from the source epic

Several test cases above are explicitly blocked on the six dependencies the epic itself lists as "incomplete" (see the Confluence page's "Dependencies and open delivery items" section) — most directly: clinical ruleset validation (blocks 300024/300025/300026/300027/300028), the chief-complaint/HPI slot schema (blocks 300016), and shared-tablet purge timing (blocks 300034/300036). These test cases exist now so the coverage gap is visible in the design artifact itself, not because the underlying behavior is ready to assert against precisely.

## Reuse Notes For Playwright Test Creation

All 37 scenarios route to `patient-chat-ui` — this epic's entire scope is the patient-facing conversational surface. Test titles in the generated Playwright specs should match each row's `Summary` verbatim, per the same exact-title correlation convention used elsewhere in this fleet. Not scaffolded into Playwright yet, unlike the safety-net baseline — this epic is `Status: Proposed`, not confirmed backlog, so building executable specs against ACs that may still change would risk churn; recommend waiting until this is actually ticketed in Jira before automating, same reasoning as holding off on `conversation-api`.
