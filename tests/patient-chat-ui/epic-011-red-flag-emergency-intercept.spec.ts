import { test, expect } from '@playwright/test';
import { IntakeChatPage } from '../../src/pages/patient-chat-ui/intake-chat.page';
import { EmergencyTakeoverPage } from '../../src/pages/patient-chat-ui/emergency-takeover.page';

// EPIC-011 (Conversational AI Patient Intake) — US-041, Confluence-only, Status: Proposed,
// no Jira ticket exists. See docs/xray-exports/epic-011-testcases-2026-09-18.md. Test titles
// match the design-stage CSV's Summary field verbatim (rows 300024-300028). All five are
// High priority — this story is the safety-critical core of EPIC-011, and its Dependency #1
// ("Validate the clinical red-flag ruleset") is still unresolved for every scenario below.

test('Every patient message is evaluated by the deterministic red-flag engine (AC-041.1) — AMBIGUOUS: "before or in parallel with LLM processing" is an internal ordering claim, not black-box observable; rewritten here to the observable guarantee (see testability review)', async ({
  page,
}) => {
  const intakeChat = new IntakeChatPage(page);

  await test.step('Any patient message is submitted during an active chat session', async () => {
    await intakeChat.goto('/');
    await intakeChat.sendMessage("I've been having really bad chest pain for the last hour.");
  });

  await test.step('A deterministic red-flag engine evaluates the message, and every red-flag test message results in escalation being triggered', async () => {
    await expect.poll(() => intakeChat.isEscalationFlagVisible()).toBe(true);
  });
});

test('Confirmed red-flag match dispatches an immediate escalation event to the clinician/staff dashboard (AC-041.2) — MISSING DATA: exact latency bound unstated; also an OPEN QUESTION in the master PRD (NFR-002)', async ({
  page,
}) => {
  const intakeChat = new IntakeChatPage(page);

  await test.step('A patient message matches a validated red-flag criterion', async () => {
    await intakeChat.goto('/');
    await intakeChat.sendMessage("I've been having really bad chest pain for the last hour.");
  });

  await test.step('An emergency escalation event is sent to the clinician or staff dashboard; exact maximum latency is unresolved (NFR-002, OPEN QUESTION)', async () => {
    // Only observable from patient-chat-ui as the escalation flag firing on this side —
    // asserting dashboard-side receipt requires the clinician-dashboard-ui surface, and no
    // exact latency bound exists yet to assert against even then.
    await expect.poll(() => intakeChat.isEscalationFlagVisible()).toBe(true);
  });
});

test('Emergency takeover displays a high-contrast directive message (AC-041.3)', async ({ page }) => {
  const intakeChat = new IntakeChatPage(page);
  const takeover = new EmergencyTakeoverPage(page);

  await test.step('A red flag is detected and the user interface updates', async () => {
    await intakeChat.goto('/');
    await intakeChat.sendMessage("I've been having really bad chest pain for the last hour.");
  });

  await test.step('A high-contrast message directs the patient to notify clinic staff or contact emergency services immediately', async () => {
    await expect.poll(() => takeover.isTakeoverActive()).toBe(true);
    const message = (await takeover.getTakeoverMessageText()) ?? '';
    expect(message.toLowerCase()).toMatch(/staff|emergency services|911/);
  });
});

test('Chat is locked during an active emergency takeover (AC-041.4)', async ({ page }) => {
  const intakeChat = new IntakeChatPage(page);
  const takeover = new EmergencyTakeoverPage(page);

  await test.step('An emergency takeover is active and the patient views the interface', async () => {
    await intakeChat.goto('/');
    await intakeChat.sendMessage("I've been having really bad chest pain for the last hour.");
    await expect.poll(() => takeover.isTakeoverActive()).toBe(true);
  });

  await test.step('Free-text input and interactive controls are disabled', async () => {
    expect(await takeover.isChatLocked()).toBe(true);
  });
});

test('Emergency message contains no diagnostic claim or speculation (AC-041.5)', async ({ page }) => {
  const intakeChat = new IntakeChatPage(page);
  const takeover = new EmergencyTakeoverPage(page);

  await test.step('An emergency message is displayed and the patient reads it', async () => {
    await intakeChat.goto('/');
    await intakeChat.sendMessage("I've been having really bad chest pain for the last hour.");
    await expect.poll(() => takeover.isTakeoverActive()).toBe(true);
  });

  await test.step('The content contains no diagnostic claim or speculation', async () => {
    const message = ((await takeover.getTakeoverMessageText()) ?? '').toLowerCase();
    expect(message).not.toMatch(/\byou (have|are having) a\b|\bthis (is|looks like) a\b heart attack/);
  });
});
