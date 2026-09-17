# saha.ai-qa

QA automation framework for the **AI Clinical Intake & Triage Assistant** (B2B, clinic-facing) — a conversational pre-visit intake agent with red-flag escalation and clinician-facing triage.

This is a **dedicated satellite repo**, not colocated with the portal or backend app repos. It's generated and maintained by a separate QA agent fleet (`qa-fleet.config.json`, `*.agent.md` specs — local at `C:\ARC QA`), invoked by a developer typing `QA <ticket-id>`. See that repo's `CLAUDE.md` / `INTEGRATION.md` for the full pipeline this framework is a downstream target of. This README covers only what's local to running/maintaining the framework itself.

## Structure

One repo, three Playwright **projects** (not three separate frameworks) — see `playwright.config.ts`:

| Project | Type | Tests against |
|---|---|---|
| `patient-chat-ui` | browser | Patient-facing conversational intake widget (kiosk/tablet/pre-visit link) |
| `clinician-dashboard-ui` | browser | Clinician-facing triage queue + structured note view |
| `conversation-api` | api | Backend orchestration: intake dialogue, red-flag detection, note generation, triage scoring |

```
src/
  pages/{patient-chat-ui,clinician-dashboard-ui}/   Page Object Model, one set per UI surface
  selectors/{patient-chat-ui,clinician-dashboard-ui}/  Selectors kept out of spec files
  api/                                               conversation-api helper classes
  fixtures/                                          Shared Playwright fixtures
tests/
  patient-chat-ui/*.spec.ts
  clinician-dashboard-ui/*.spec.ts
  api/*.spec.ts                                      conversation-api schema/behavior tests
  e2e/*.spec.ts                                       Cross-surface scenarios (e.g. chat -> dashboard)
docs/
  xray-exports/        Generated CSVs + Markdown test plans (design stage)
  api-test-plans/       API Test Case Builder's Markdown output
  ui-selectors/         Selector maps + screenshots (UI Selector Discovery)
  test-results/         JUnit/HTML reports (gitignored — regenerated every run)
  test-data/patients/   Synthetic patient roster fixtures — see policy below
```

Every one of the currently-empty directories above is where a real ticket flowing through the QA fleet's `design → automate` stages will eventually land content — nothing here is fabricated ahead of that.

## Setup

```bash
npm install
npx playwright install          # downloads browser binaries, not run automatically
cp .env.example .env            # then fill in real, non-production base URLs
npm run typecheck
```

## Running

```bash
npm test                        # everything
npm run test:patient-chat       # one surface
npm run test:clinician-dashboard
npm run test:api
npm run test:ui                 # Playwright's interactive UI mode
npm run report                  # open the last HTML report
```

## `docs/test-data/patients/` — synthetic data only, no exceptions

Every fixture patient in this directory must be **entirely fabricated**, never copied, derived, or anonymized from a real patient record, and never sourced from a "realistic example" offered as something to imitate. Concrete conventions every generated record must follow (see the QA fleet's `qa-fleet.config.json` -> `testData.syntheticDataGenerationRules` for the authoritative version):

- Names prefixed `TEST_` (e.g. `TEST_Jordan Ellery`)
- Phone numbers only in the reserved fictional range `555-01XX`
- Email addresses only `@example.com` / `@example.org` / `@example.test`
- Addresses a clearly placeholder shape (e.g. `123 Test St, Testville, ZZ 00000`)
- MRN/insurance IDs prefixed `TEST-`
- Every record carries an explicit `"synthetic": true` field
- A human must explicitly review and approve generated roster content before it's committed here

No agent or person adding fixtures to this directory is authorized to source or accept real PHI, even "de-identified" data offered by someone else.
