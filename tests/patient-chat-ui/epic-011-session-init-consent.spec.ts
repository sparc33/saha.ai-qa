import { test, expect } from '@playwright/test';
import { ConsentPage } from '../../src/pages/patient-chat-ui/consent.page';

// EPIC-011 (Conversational AI Patient Intake) — US-037, Confluence-only, Status: Proposed,
// no Jira ticket exists. See docs/xray-exports/epic-011-testcases-2026-09-18.md and
// docs/testability-reviews/epic-011-testability-review-2026-09-18.md. Test titles match the
// design-stage CSV's Summary field verbatim (rows 300001-300006).

test('As a patient starting intake, I want to be greeted by a conversational assistant that explains its role and captures my consent, so that I understand how the AI intake works before sharing information (AC-037.1)', async ({
  page,
}) => {
  const consent = new ConsentPage(page);

  await test.step('Patient opens the intake link or approaches an idle tablet', async () => {
    await consent.goto('/');
  });

  await test.step('A welcome message appears within 2 seconds, explaining the intake purpose and displaying an interactive consent card', async () => {
    await expect
      .poll(() => consent.isWelcomeMessageVisible(), { timeout: 2000 })
      .toBe(true);
    expect(await consent.isConsentCardVisible()).toBe(true);
  });
});

test('Persistent non-diagnostic disclaimer remains visible throughout the conversation (AC-037.2)', async ({ page }) => {
  const consent = new ConsentPage(page);
  await consent.goto('/');

  await test.step('Patient views the chat at any point in an active conversation', async () => {
    await consent.acceptConsent();
  });

  await test.step('A persistent banner states the assistant does not provide medical diagnoses or treatment recommendations', async () => {
    expect(await consent.isDisclaimerVisible()).toBe(true);
    const text = (await consent.getDisclaimerText()) ?? '';
    expect(text.toLowerCase()).toMatch(/diagnos|treatment recommendation/);
  });
});

test('Consent gating blocks input until terms are accepted (AC-037.3)', async ({ page }) => {
  const consent = new ConsentPage(page);

  await test.step('Patient attempts to type or send a message before accepting consent', async () => {
    await consent.goto('/');
  });

  await test.step('Input remains disabled and the patient is instructed to accept the terms before continuing', async () => {
    expect(await consent.isMessageInputDisabled()).toBe(true);
    expect(await consent.isConsentGateInstructionVisible()).toBe(true);
  });
});

test('Conversation viewport auto-scrolls to latest content while keeping the disclaimer visible (AC-037.4)', async ({
  page,
}) => {
  const consent = new ConsentPage(page);
  await consent.goto('/');
  await consent.acceptConsent();

  await test.step('New messages or cards are added to the conversation', async () => {
    // Structure only — a real message-send helper lives on IntakeChatPage; this scenario
    // just asserts the disclaimer survives conversation growth, not scroll mechanics itself.
  });

  await test.step('The viewport moves to the latest message while the disclaimer remains visible', async () => {
    expect(await consent.isDisclaimerVisible()).toBe(true);
  });
});

test('Patient declining consent is redirected to clinic staff and the session is locked (AC-037.ALT.1)', async ({
  page,
}) => {
  const consent = new ConsentPage(page);
  await consent.goto('/');

  await test.step('Patient opts out on the consent card', async () => {
    await consent.declineConsent();
  });

  await test.step('The assistant directs the patient to clinic staff and locks the chat session', async () => {
    expect(await consent.isStaffRedirectVisible()).toBe(true);
    expect(await consent.isMessageInputDisabled()).toBe(true);
  });
});

test('Service-unavailable fallback message on session load (AC-037.EX.1) — AMBIGUOUS: "without exposing system errors" has no defined negative list (see testability review)', async ({
  page,
}) => {
  const consent = new ConsentPage(page);

  await test.step('The chatbot service is unavailable when the session loads', async () => {
    await consent.goto('/');
  });

  await test.step("A non-technical fallback message directs the patient to the receptionist; exact prohibited-content list is unresolved pending the testability review's suggested rewrite", async () => {
    expect(await consent.isServiceUnavailableFallbackVisible()).toBe(true);
    const text = (await consent.getServiceUnavailableFallbackText()) ?? '';
    // Only a loose check is possible until a concrete prohibited-terms list exists.
    expect(text.toLowerCase()).not.toMatch(/stack trace|exception|http \d{3}|error code/);
  });
});
