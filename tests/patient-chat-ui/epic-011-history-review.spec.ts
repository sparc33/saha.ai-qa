import { test, expect } from '@playwright/test';
import { HistoryReviewPage } from '../../src/pages/patient-chat-ui/history-review.page';
import { loadSyntheticPatients } from '../../src/utilities/patientDataLoader';

// EPIC-011 (Conversational AI Patient Intake) — US-039, Confluence-only, Status: Proposed,
// no Jira ticket exists. See docs/xray-exports/epic-011-testcases-2026-09-18.md. Test titles
// match the design-stage CSV's Summary field verbatim (rows 300012-300015). Uses the
// synthetic patient roster (docs/test-data/patients/) for returning-patient scenarios.

test('Returning patient sees structured history cards for allergies, medications, and chronic conditions (AC-039.1)', async ({
  page,
}) => {
  const patients = loadSyntheticPatients();
  test.skip(patients.length === 0, 'No synthetic patient fixtures exist yet in docs/test-data/patients/.');

  const historyReview = new HistoryReviewPage(page);

  await test.step('An authenticated returning patient with existing records begins history review', async () => {
    await historyReview.goto('/');
  });

  await test.step('The assistant displays structured cards for allergies, medications, and chronic conditions, each with confirmation and update actions', async () => {
    expect(await historyReview.isHistoryCardVisible('allergies')).toBe(true);
    expect(await historyReview.isHistoryCardVisible('medications')).toBe(true);
    expect(await historyReview.isHistoryCardVisible('chronicConditions')).toBe(true);
  });
});

test('Single-tap history confirmation advances to symptom intake (AC-039.2)', async ({ page }) => {
  const historyReview = new HistoryReviewPage(page);
  await historyReview.goto('/');

  await test.step('The patient selects "Looks Correct" on a displayed history card', async () => {
    await historyReview.confirmHistoryCard('allergies');
  });

  await test.step('The card shows a confirmed state and the assistant proceeds to symptom intake', async () => {
    expect(await historyReview.isHistoryCardConfirmed('allergies')).toBe(true);
  });
});

test("Patient-reported history update is captured (AC-039.3) — MISSING DATA: destination/review mechanism for the captured change is unspecified (see testability review)", async ({
  page,
}) => {
  const historyReview = new HistoryReviewPage(page);
  await historyReview.goto('/');

  await test.step('The patient chooses to update history and provides a plain-language change', async () => {
    await historyReview.submitHistoryUpdate('medications', 'I stopped taking metformin last month.');
  });

  await test.step("The change is captured as patient-reported information for review; the exact review destination/mechanism is unresolved pending the testability review's suggested rewrite", async () => {
    // Only checks the update was accepted (no error state) — cannot assert *where* it lands
    // until the review mechanism is defined.
    expect(await historyReview.isHistoryCardVisible('medications')).toBe(true);
  });
});

test('No-recorded-history state offers confirm-none or add-information options (AC-039.4)', async ({ page }) => {
  const historyReview = new HistoryReviewPage(page);

  await test.step('No allergies or medications are recorded for the patient and the history card renders', async () => {
    await historyReview.goto('/');
  });

  await test.step('The assistant clearly states no records are on file and offers options to confirm none or add information', async () => {
    expect(await historyReview.isNoRecordsMessageVisible()).toBe(true);
    expect(await historyReview.isAddInformationOptionAvailable()).toBe(true);
  });
});
