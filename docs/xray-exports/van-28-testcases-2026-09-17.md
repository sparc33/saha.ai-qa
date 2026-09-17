# Test Plan: VAN-28

## Metadata

- Source: Jira story (no execution plan for this project — `sdlcIntegration.requirementsSourcePreference` puts `jira-story` first)
- Jira Key: VAN-28 (US-031 — New User Login & Account Activation), child of VAN-27 (EPIC-009: User Login & Authentication)
- Team: n/a (no team split for this project)
- Components: VAN
- Labels: `ManualTC`, `surface:patient-chat-ui`
- Generated: 2026-09-17
- Reviewed and approved at the PHASE 3.5 review gate before this file was written

## Scenario Coverage Summary

- Total test cases: 1
- Total steps: 1
- Source breakdown: 1 from Jira (VAN-28's description, unsplit — no AC field populated, no bullet/numbered structure to split on)
- Risk-gated coverage: all 4 categories (`clinical-red-flag-escalation`, `decision-support-not-diagnosis`, `tenant-isolation`, `patient-record-matching`) already fully covered by `docs/xray-exports/safety-net-baseline-testcases-2026-09-17.md` — **not re-synthesized for this run** (PHASE 1D step 0's new standing-coverage check)

**⚠ This test plan is intentionally thin, and that's a finding in itself, not a bug in test design.** VAN-28 has no formal acceptance criteria — only a one-line compound user-story description — which is exactly what the testability review posted on this ticket already flagged (Compound + Missing Data). One unsplit sentence produces one generic step that doesn't actually test login validation, OTP delivery/expiry, account activation, or the identity-matching precision that `patient-record-matching` cares about. This scenario should be replaced, not just supplemented, once VAN-28's acceptance criteria are written with the specifics requested in that review comment.

## Scenarios

### 1. Issue Id 200001 — As a first-time patient, I want to log in to the intake system using my Medical Record (MR) number or registered phone number and verify my identity with a one-time password (OTP), so that my account is activated and I can begin my intake session securely
- **Priority:** Medium *(mechanical keyword rule found no trigger words in the description — "OTP"/"login"/"identity" aren't in the rule's trigger list. Given the subject matter and its connection to `patient-record-matching`, a manual bump to High is worth considering once real ACs exist — not changed here since it wasn't requested at the review gate.)*
- **Test Type:** Manual
- **Source:** jira (VAN-28 description, unsplit)
- **Steps:**
  1. Action: Execute the scenario: [full description, verbatim] → Data: *(none)* → Expected: Scenario completes successfully without errors

## Reuse Notes For Playwright Test Creation

This scenario maps to one `test()`; its single step maps to one `test.step()`. Test title must match the Summary above **verbatim** for exact-title correlation. Routes to `patient-chat-ui` — no framework/spec exists yet for this surface specifically (only the shared `saha-ai-qa` scaffold with placeholder selectors); real automation should wait for both a live app to discover selectors against and a rewritten, testable version of this scenario once VAN-28's ACs are actually written.
