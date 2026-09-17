# Test Plan: Safety-Net Baseline (Risk-Gated Coverage)

## Metadata

- Source: PRD-sourced `riskGatedCategories` requirements (`qa-fleet.config.json`), not a single Jira story — synthesized per `jira-confluence-to-xray-csv-agent.md` PHASE 1D
- Team: n/a (no team split for this project)
- Components: VAN (placeholder — correct if a different value is preferred)
- Labels: `ManualTC` + `risk-gated:<key>` + `surface:<key>` per row
- Generated: 2026-09-17
- Reviewed and approved at the PHASE 3.5 review gate before this file was written

## Scenario Coverage Summary

- Total test cases: 16
- Total steps: 16 (one step each)
- Source breakdown: 16 synthesized (0 from a source Jira story's ACs)
- Risk-gated coverage:
  - `clinical-red-flag-escalation`: 7/7 items covered (100% synthesized, sourced from the initial product pitch)
  - `decision-support-not-diagnosis`: 3/3 items covered (100% synthesized, sourced from the PRD)
  - `tenant-isolation`: 3/3 items covered (100% synthesized, sourced from PRD NFR-011)
  - `patient-record-matching`: 3/3 items covered (100% synthesized, sourced from a real testability-review finding on VAN-29, 2026-09-17 — the newest category, added after the pipeline's first live run against Jira surfaced it)

**⚠ Every scenario in this file is `risk-gated-synthesized` — none is derived from a real story's acceptance criteria.** They exist to guarantee the pipeline's safety-net gate has something real to check against for this product, but their exact wording, assertion detail, and surface assignment should be revisited once real per-feature stories and their ACs exist. Surface tagging (`conversation-api` vs `clinician-dashboard-ui`) is this agent's best-effort placement, not confirmed against real system design.

## Scenarios

### 1. Issue Id 100001 — Patient reports chest pain during intake — assistant immediately escalates instead of continuing routine intake
- **Priority:** High
- **Test Type:** Manual
- **Source:** risk-gated-synthesized (`clinical-red-flag-escalation`)
- **Steps:**
  1. Action: Patient reports chest pain during intake → Expected: Assistant immediately triggers the escalate-now flag instead of continuing routine intake

### 2. Issue Id 100002 — Patient reports difficulty breathing / shortness of breath during intake — assistant immediately escalates instead of continuing routine intake
- **Priority:** High | **Test Type:** Manual | **Source:** risk-gated-synthesized (`clinical-red-flag-escalation`)
- **Steps:** 1. Action: Patient reports difficulty breathing / shortness of breath during intake → Expected: Assistant immediately triggers the escalate-now flag instead of continuing routine intake

### 3. Issue Id 100003 — Patient reports severe uncontrolled bleeding during intake — assistant immediately escalates instead of continuing routine intake
- **Priority:** High | **Test Type:** Manual | **Source:** risk-gated-synthesized (`clinical-red-flag-escalation`)
- **Steps:** 1. Action: Patient reports severe uncontrolled bleeding during intake → Expected: Assistant immediately triggers the escalate-now flag instead of continuing routine intake

### 4. Issue Id 100004 — Patient reports signs of stroke (facial droop; slurred speech; sudden one-sided weakness) during intake — assistant immediately escalates instead of continuing routine intake
- **Priority:** High | **Test Type:** Manual | **Source:** risk-gated-synthesized (`clinical-red-flag-escalation`)
- **Steps:** 1. Action: Patient reports signs of stroke (facial droop; slurred speech; sudden one-sided weakness) during intake → Expected: Assistant immediately triggers the escalate-now flag instead of continuing routine intake

### 5. Issue Id 100005 — Patient reports loss of consciousness or unresponsiveness during intake — assistant immediately escalates instead of continuing routine intake
- **Priority:** High | **Test Type:** Manual | **Source:** risk-gated-synthesized (`clinical-red-flag-escalation`)
- **Steps:** 1. Action: Patient reports loss of consciousness or unresponsiveness during intake → Expected: Assistant immediately triggers the escalate-now flag instead of continuing routine intake

### 6. Issue Id 100006 — Patient reports signs of severe allergic reaction / anaphylaxis during intake — assistant immediately escalates instead of continuing routine intake
- **Priority:** High | **Test Type:** Manual | **Source:** risk-gated-synthesized (`clinical-red-flag-escalation`)
- **Steps:** 1. Action: Patient reports signs of severe allergic reaction / anaphylaxis during intake → Expected: Assistant immediately triggers the escalate-now flag instead of continuing routine intake

### 7. Issue Id 100007 — Patient reports suicidal ideation or stated intent to self-harm during intake — assistant immediately escalates instead of continuing routine intake
- **Priority:** High | **Test Type:** Manual | **Source:** risk-gated-synthesized (`clinical-red-flag-escalation`)
- **Steps:** 1. Action: Patient reports suicidal ideation or stated intent to self-harm during intake → Expected: Assistant immediately triggers the escalate-now flag instead of continuing routine intake

### 8. Issue Id 100008 — Verify that the assigned triage tier is always displayed together with its rubric-referenced rationale — never the tier alone, with no exception for the routine tier
- **Priority:** High | **Test Type:** Manual | **Source:** risk-gated-synthesized (`decision-support-not-diagnosis`)
- **Steps:** 1. Action: Complete an intake session that results in a triage tier being assigned (routine) → Expected: The assigned triage tier is displayed together with its rubric-referenced rationale — never the tier alone

### 9. Issue Id 100009 — Verify that the UI/copy presents the tier as a suggestion for clinician review — never as a diagnosis, a directive, or a decision already made
- **Priority:** High | **Test Type:** Manual | **Source:** risk-gated-synthesized (`decision-support-not-diagnosis`)
- **Steps:** 1. Action: Open a completed intake's structured note and triage tier in the clinician dashboard → Expected: The tier is presented with suggestion language (e.g. "suggested urgency" / "recommended for review") — never as a diagnosis, a directive, or a decision already made

### 10. Issue Id 100010 — Verify that the clinician can open the full structured note from the same view as the tier, so the basis for the recommendation is always independently reviewable
- **Priority:** High | **Test Type:** Manual | **Source:** risk-gated-synthesized (`decision-support-not-diagnosis`)
- **Steps:** 1. Action: From the clinician dashboard queue, open a patient's triage tier entry → Expected: The full structured note (chief complaint, HPI, relevant history, flagged concerns) is reachable from the same view as the tier

### 11. Issue Id 100011 — Verify that a clinician authenticated for one clinic cannot view another clinic's patient queue, by any navigation path
- **Priority:** High | **Test Type:** Manual | **Source:** risk-gated-synthesized (`tenant-isolation`)
- **Steps:** 1. Action: As a clinician authenticated for Clinic A, attempt every discoverable navigation path to Clinic B's patient queue → Expected: Access is denied for all attempted paths

### 12. Issue Id 100012 — Verify that a clinician cannot open another clinic's structured note by direct URL/ID manipulation, even with an otherwise-valid session
- **Priority:** High | **Test Type:** Manual | **Source:** risk-gated-synthesized (`tenant-isolation`)
- **Steps:** 1. Action: As a clinician authenticated for Clinic A, manipulate a structured-note URL/ID to reference a Clinic B patient → Expected: Access is denied — the note is never rendered

### 13. Issue Id 100013 — Verify that a patient intake session is scoped to the clinic its kiosk/pre-visit link belongs to, and never appears in another clinic's queue or reporting
- **Priority:** High | **Test Type:** Manual | **Source:** risk-gated-synthesized (`tenant-isolation`)
- **Steps:** 1. Action: Complete a patient intake session via Clinic A's kiosk/pre-visit link → Expected: The session appears only in Clinic A's queue/reporting

### 14. Issue Id 100014 — Verify that a patient logging in with an MR number or registered phone number is matched to their own record via an exact identifier match — never a fuzzy or partial match that could resolve to a different patient
- **Priority:** High | **Test Type:** Manual | **Source:** risk-gated-synthesized (`patient-record-matching`)
- **Steps:** 1. Action: Log in with a valid MR number or registered phone number and a correct OTP → Expected: The system matches the patient to their own record via an exact identifier match — never a fuzzy or partial match

### 15. Issue Id 100015 — Verify that a login attempt with an MR number or phone number that doesn't exactly match any existing patient record is rejected outright, never silently matched to the nearest similar record
- **Priority:** High | **Test Type:** Manual | **Source:** risk-gated-synthesized (`patient-record-matching`)
- **Steps:** 1. Action: Attempt to log in with an MR number or phone number that doesn't exactly match any existing patient record → Expected: The login attempt is rejected outright — never silently matched to the nearest similar record

### 16. Issue Id 100016 — Verify that two patients with plausibly similar identifiers (e.g. typo-adjacent phone numbers, similar MR numbers) never have their intake data merged or cross-attached to the wrong record
- **Priority:** High | **Test Type:** Manual | **Source:** risk-gated-synthesized (`patient-record-matching`)
- **Steps:** 1. Action: Two patients exist with plausibly similar identifiers; one completes an intake session → Expected: The intake data attaches only to the correct patient's record — never merged or cross-attached

## Reuse Notes For Playwright Test Creation

Each scenario maps to one `test()`; its single step maps to one `test.step()`. Test titles must match the `Summary` above **verbatim** for exact-title correlation (used both by `full`-mode Xray matching and `local-only`-mode local-plan correlation, per `test-execution-runner.agent.md`).

**Implemented 2026-09-17** in `saha.ai-qa` (structure only — placeholder selectors throughout, none verified against a running app):

- Scenarios 1–7 (`clinical-red-flag-escalation`) and 14–16 (`patient-record-matching`): **reassigned from the `conversation-api` placeholder above to `patient-chat-ui`**, since `conversation-api` still has no spec location or API contract (`testSurfaces.conversation-api.specLocation` is still `null` — writing API tests against it would mean fabricating a contract). The same behavior is observable at the UI layer via `IntakeChatPage`/`OtpLoginPage`, which already exist. See `tests/patient-chat-ui/red-flag-escalation-safety-net.spec.ts` and `tests/patient-chat-ui/patient-record-matching-safety-net.spec.ts`.
- Scenario 13 (`tenant-isolation`, clinic-scoped intake session): **not scaffolded** — genuinely cross-surface (patient-chat-ui intake creation + clinician-dashboard-ui verification), but no story read so far defines how a clinic is identified/parameterized in a kiosk or pre-visit link URL. Left as `test.fixme()` in `tests/clinician-dashboard-ui/tenant-isolation-safety-net.spec.ts` with the specific unknown named, rather than guessing a URL scheme.
- Scenarios 8–12 route to `clinician-dashboard-ui` as originally planned — see `tests/clinician-dashboard-ui/decision-support-safety-net.spec.ts` and `tenant-isolation-safety-net.spec.ts`. 100011/100012 additionally need a second clinic's test credentials (`CLINICIAN_TEST_USERNAME_CLINIC_B` / `_PASSWORD_CLINIC_B`, see `.env.example`) not yet provisioned — they skip with a clear reason until that account exists, rather than failing.

Also note: `clinicalSafety.redFlagSymptoms` in `qa-fleet.config.json` grew two new items after this file was generated (BRULE-010/BRULE-014, added 2026-09-17) — this baseline is now 7/9 on `clinical-red-flag-escalation`, not 7/7. Not regenerated here since it would require re-running the full PHASE 1D synthesis; flagging the drift rather than leaving the summary silently stale.
