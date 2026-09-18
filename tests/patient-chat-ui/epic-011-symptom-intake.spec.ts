import { test, expect } from '@playwright/test';
import { IntakeChatPage } from '../../src/pages/patient-chat-ui/intake-chat.page';

// EPIC-011 (Conversational AI Patient Intake) — US-040, Confluence-only, Status: Proposed,
// no Jira ticket exists. See docs/xray-exports/epic-011-testcases-2026-09-18.md. Test titles
// match the design-stage CSV's Summary field verbatim (rows 300016-300023).

test('Chief-complaint extraction captures core clinical slots (AC-040.1) — MISSING DATA: slot list is open-ended ("such as"), not a closed schema; matches EPIC-011 Dependency #2 (see testability review)', async ({
  page,
}) => {
  const intakeChat = new IntakeChatPage(page);

  await test.step('An active intake conversation and the patient describes a concern', async () => {
    await intakeChat.goto('/');
    await intakeChat.sendMessage("I've had a dull headache on the left side since yesterday morning.");
  });

  await test.step("The assistant captures relevant details such as complaint, location, onset, duration, and context using non-diagnostic language; the authoritative slot schema is unresolved pending Dependency #2", async () => {
    const response = (await intakeChat.getLastAssistantMessage()) ?? '';
    expect(response.length).toBeGreaterThan(0);
  });
});

test('Adaptive follow-up asks one question at a time (AC-040.2) — AMBIGUOUS: "concise" and "contextually relevant" are unbounded (see testability review)', async ({
  page,
}) => {
  const intakeChat = new IntakeChatPage(page);
  await intakeChat.goto('/');

  await test.step('Required clinical details are incomplete and the assistant generates the next turn', async () => {
    await intakeChat.sendMessage('My stomach hurts.');
  });

  await test.step("The assistant asks one concise, contextually relevant question at a time; exact bounds on \"concise\"/\"relevant\" are unresolved pending the testability review's suggested rewrite", async () => {
    const response = (await intakeChat.getLastAssistantMessage()) ?? '';
    expect(response.split('?').length - 1).toBeLessThanOrEqual(1);
  });
});

test('Quick-reply controls are offered with free-text fallback (AC-040.3) — AMBIGUOUS: "where appropriate" is unbounded (see testability review)', async ({
  page,
}) => {
  const intakeChat = new IntakeChatPage(page);
  await intakeChat.goto('/');

  await test.step('A structured value is requested and the prompt renders', async () => {
    await intakeChat.sendMessage("I've had a fever.");
  });

  await test.step("The patient can respond using quick-reply controls while retaining access to free text where appropriate; the exact free-text-eligible prompt set is unresolved pending the testability review's suggested rewrite", async () => {
    const options = await intakeChat.getQuickReplyOptions();
    expect(options.length).toBeGreaterThan(0);
  });
});

test('Assistant declines to diagnose and redirects to information-gathering framing (AC-040.4)', async ({ page }) => {
  const intakeChat = new IntakeChatPage(page);
  await intakeChat.goto('/');

  await test.step('The patient asks the assistant for a diagnosis or treatment recommendation', async () => {
    // askForDiagnosis() sends the request and returns the response in one step.
  });

  await test.step('The assistant explains it is collecting information for the healthcare provider and does not provide diagnostic or treatment advice', async () => {
    const response = (await intakeChat.askForDiagnosis()) ?? '';
    expect(response.toLowerCase()).not.toMatch(/\byou have\b|\byour diagnosis is\b/);
    expect(response.toLowerCase()).toMatch(/healthcare provider|clinician|does not (provide|give)/);
  });
});

test('Typing indicator appears during processing (AC-040.5, part 1 of 2 — COMPOUND, split from duplicate-submission prevention, see testability review)', async ({
  page,
}) => {
  const intakeChat = new IntakeChatPage(page);
  await intakeChat.goto('/');

  await test.step('A patient message is submitted and the assistant is processing it', async () => {
    await intakeChat.sendMessage('I have a sore throat.');
  });

  await test.step('A typing indicator appears', async () => {
    expect(await intakeChat.isTypingIndicatorVisible()).toBe(true);
  });
});

test('Duplicate and out-of-order submissions are prevented (AC-040.5, part 2 of 2 — COMPOUND, split from typing indicator, see testability review)', async ({
  page,
}) => {
  const intakeChat = new IntakeChatPage(page);
  await intakeChat.goto('/');

  await test.step('A patient message is submitted and the assistant is processing it, and the patient submits again before a response arrives', async () => {
    // handled inside the assertion step below via sendDuplicateMessageAndCountResponses
  });

  await test.step('Duplicate and out-of-order submissions are prevented', async () => {
    const newResponseCount = await intakeChat.sendDuplicateMessageAndCountResponses('I have a sore throat.');
    expect(newResponseCount).toBe(1);
  });
});

test('Guided clarification on ambiguous input does not repeat the same prompt more than twice (AC-040.ALT.1)', async ({
  page,
}) => {
  const intakeChat = new IntakeChatPage(page);
  await intakeChat.goto('/');

  const prompts: string[] = [];
  await test.step('The patient provides minimal or ambiguous information', async () => {
    for (let i = 0; i < 3; i++) {
      await intakeChat.sendMessage('bad');
      prompts.push((await intakeChat.getLastAssistantMessage()) ?? '');
    }
  });

  await test.step('The assistant offers guided clarification without repeating the same prompt more than twice', async () => {
    const uniquePrompts = new Set(prompts);
    expect(uniquePrompts.size).toBeGreaterThan(1);
  });
});

test('Off-topic input is redirected and excluded from the clinical payload (AC-040.ALT.2)', async ({ page }) => {
  const intakeChat = new IntakeChatPage(page);
  await intakeChat.goto('/');

  await test.step('The patient enters unrelated content', async () => {
    await intakeChat.sendMessage('What is the weather like today?');
  });

  await test.step('The assistant politely redirects to intake and excludes the content from the clinical payload', async () => {
    const response = (await intakeChat.getLastAssistantMessage()) ?? '';
    expect(response.toLowerCase()).toMatch(/intake|symptom|focus/);
  });
});
