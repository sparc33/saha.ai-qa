# Testability Review — EPIC-011: Conversational AI Patient Intake

**Source:** Confluence page "EPIC-011 — Conversational AI Patient Intake" (id `5885919637`), Status: **Proposed**. No Jira ticket exists for this epic or any of its stories as of 2026-09-18 — this review was run directly against the Confluence content, applying `story-testability-reviewer.agent.md`'s methodology without a Jira fetch (PHASE 0 of that spec normally fetches via Jira; here the "confluence-page" source type from `sdlcIntegration.requirementsSourcePreference` was used as the sole source, not a fallback).

## Verdict Summary

| Verdict | Count |
|---|---|
| Testable | 23 |
| Ambiguous | 5 |
| Missing Data | 7 |
| Not Testable | 0 |
| Compound | 1 |

**Overall: 23/36 criteria are test-design-ready.**

## Per-Criterion Review — non-Testable findings

### AC-037.EX.1 — Service unavailable
- **Verdict:** Ambiguous
- **Why:** "Non-technical fallback message... without exposing system errors" has no defined negative list.
- **Suggested rewrite:** Specify prohibited content explicitly (no stack traces, HTTP status codes, or internal error codes).

### AC-038.2 — OTP widget
- **Verdict:** Missing Data
- **Why:** Resend countdown duration is unstated.
- **Suggested rewrite:** State the exact countdown (e.g. "60 seconds").

### AC-038.ALT.1 — OTP resend
- **Verdict:** Missing Data
- **Why:** "Session resend limit" — value unstated.
- **Suggested rewrite:** State the exact limit.

### AC-039.3 — History modification
- **Verdict:** Missing Data
- **Why:** "Captured... for review" — review destination/mechanism unspecified.
- **Suggested rewrite:** Name where the change lands (structured note field? a separate review queue?) and who acts on it.

### AC-040.1 — Chief complaint extraction
- **Verdict:** Missing Data
- **Why:** "Details such as..." is an open-ended list, not a closed slot schema — directly matches the epic's own Dependency #2 ("Define the authoritative slot schema").
- **Suggested rewrite:** Replace with the finalized slot list once that dependency resolves.

### AC-040.2 — Adaptive follow-up
- **Verdict:** Ambiguous
- **Why:** "Concise" and "contextually relevant" are unbounded.
- **Suggested rewrite:** Define a max question length/complexity and a concrete relevance rule.

### AC-040.3 — Quick replies
- **Verdict:** Ambiguous
- **Why:** "While retaining access to free text where appropriate" — "where appropriate" undefined.
- **Suggested rewrite:** Enumerate exactly which prompt types get free-text fallback.

### AC-040.5 — Turn management
- **Verdict:** Compound
- **Why:** Bundles two independent behaviors (typing indicator display; duplicate/out-of-order submission prevention).
- **Suggested rewrite:** Split into two ACs — they need separate test cases regardless (done in the generated test plan: rows 300020/300021).

### AC-041.1 — Per-turn evaluation
- **Verdict:** Ambiguous, leaning Not-Testable
- **Why:** "Before or in parallel with LLM processing" is an internal architecture claim, not black-box observable.
- **Suggested rewrite:** Drop the ordering claim; assert the actually-observable guarantee instead — every red-flag test message triggers escalation, 100% of the time, regardless of internal sequencing.

### AC-041.2 — Escalation dispatch
- **Verdict:** Missing Data
- **Why:** "Immediately" has no bound. Not unique to this AC — the master PRD's NFR-002 explicitly lists this exact latency as an OPEN QUESTION, so the two documents corroborate the same gap rather than one resolving the other.

### AC-043.1 — Completion purge
- **Verdict:** Missing Data
- **Why:** "Configured completion timeout" — value unstated, matching the epic's own Dependency #5 ("Confirm shared-tablet purge timing").

### AC-043.3 — Idle warning
- **Verdict:** Missing Data
- **Why:** Same root cause as AC-043.1 — idle threshold unstated.

### AC-043.4 — Abandonment purge
- **Verdict:** Ambiguous
- **Why:** "Approved staff-accessible processes" names no actual mechanism or role.

## PHASE 2.5 — Risk-Gated Coverage Check

- **`clinical-red-flag-escalation`**: Covered — US-041 addresses escalation handling extensively.
- **`decision-support-not-diagnosis`**: Gap — this entire epic is patient-facing; none of its ACs touch the clinician-facing tier/rationale display, suggestion-language framing, or override behavior this category requires (that lives in EPIC-004). AC-040.4 is a related but distinct patient-facing non-diagnostic guardrail, not a substitute.
- **`tenant-isolation`**: Gap — no AC anywhere in this epic mentions clinic-scoping.
- **`patient-record-matching`**: Partial — US-038 covers identity verification generally (identifier + OTP) but never addresses the exact-match-vs-fuzzy-match precision this category specifically requires.

## Recommendation

Not ready to move to design/dev as-is. The epic already self-declares 6 open dependencies, and this review independently landed on several of the same gaps as testability issues rather than just dependency line items — AC-038.2/ALT.1 (OTP thresholds), AC-040.1 (slot schema), AC-041.2 (escalation latency, also open in the master PRD's NFR-002), and AC-043.1/.3 (purge timing) all restate Dependencies #1, #3, and #5 in AC form. That corroboration is a good sign the epic's own dependency list is accurate. Given AC-041.1's safety-critical subject matter (red-flag detection) is the one flagged Ambiguous-leaning-Not-Testable, and the whole epic is still `Status: Proposed`, prioritize resolving Dependency #1 (clinical ruleset validation) and rewriting AC-041.1 before anything here gets built against for real.

A design-stage test plan was generated anyway from the available information (see `docs/xray-exports/epic-011-testcases-2026-09-18.md`) so the coverage gaps stay visible as concrete test cases rather than an abstract list — not because the epic is considered ready.
