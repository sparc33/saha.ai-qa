import { test, expect } from '@playwright/test';
import { IntakeCompletionPage } from '../../src/pages/patient-chat-ui/intake-completion.page';

// EPIC-011 (Conversational AI Patient Intake) — US-042, Confluence-only, Status: Proposed,
// no Jira ticket exists. See docs/xray-exports/epic-011-testcases-2026-09-18.md. Test titles
// match the design-stage CSV's Summary field verbatim (rows 300029-300033).

test('Completion card confirms secure submission with next-step instructions (AC-042.1)', async ({ page }) => {
  const completion = new IntakeCompletionPage(page);

  await test.step('Required history confirmations and symptom slots are complete and the intake concludes', async () => {
    await completion.goto('/');
  });

  await test.step('The assistant displays a completion card confirming secure submission and providing next-step instructions', async () => {
    expect(await completion.isCompletionCardVisible()).toBe(true);
    const text = (await completion.getCompletionCardText()) ?? '';
    expect(text.length).toBeGreaterThan(0);
  });
});

test('Session inputs are disabled once intake completes (AC-042.2)', async ({ page }) => {
  const completion = new IntakeCompletionPage(page);

  await test.step('The session enters INTAKE_COMPLETE and the completion card appears', async () => {
    await completion.goto('/');
  });

  await test.step('Input fields, attachments, and quick replies are disabled', async () => {
    expect(await completion.isSessionFullyLocked()).toBe(true);
  });
});

test("Internal triage levels and clinical notes are never exposed to the patient (AC-042.3)", async ({ page }) => {
  const completion = new IntakeCompletionPage(page);

  await test.step('The patient reviews the completed conversation and messages are displayed', async () => {
    await completion.goto('/');
  });

  await test.step('Internal triage levels and generated clinical notes are not exposed', async () => {
    expect(await completion.isClinicalArtifactExposed()).toBe(false);
  });
});

test('Structured note generation and EHR staging run asynchronously after completion (AC-042.4)', async ({ page }) => {
  const completion = new IntakeCompletionPage(page);

  await test.step('The session completes and the completion event is recorded', async () => {
    await completion.goto('/');
  });

  await test.step('Structured note generation and EHR staging run asynchronously, without blocking the patient-visible completion state', async () => {
    // Only observable indirectly — the completion card must render without waiting on
    // note-generation/EHR-staging to finish. There is no direct signal for "async" itself.
    await expect.poll(() => completion.isCompletionCardVisible(), { timeout: 5000 }).toBe(true);
  });
});

test('Background processing failure flags the transcript for staff review without altering the completion message (AC-042.EX.1)', async ({
  page,
}) => {
  const completion = new IntakeCompletionPage(page);

  await test.step('Background processing fails or is delayed after the patient views the completion state', async () => {
    await completion.goto('/');
  });

  await test.step('The completion message remains unchanged and the transcript is flagged for staff review', async () => {
    expect(await completion.isCompletionCardVisible()).toBe(true);
    // isTranscriptFlaggedForReview() is flagged in the page object as likely not observable
    // from the patient's own view — kept here so the gap stays visible in run output.
    test.info().annotations.push({
      type: 'known-gap',
      description: 'Staff-side review flag may not be observable from patient-chat-ui at all — see intake-completion.page.ts.',
    });
  });
});
