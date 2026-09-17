import { test, expect } from '../../src/fixtures';
import { QueueDashboardPage } from '../../src/pages/clinician-dashboard-ui/queue-dashboard.page';
import { NoteDrilldownPage } from '../../src/pages/clinician-dashboard-ui/note-drilldown.page';

// Safety-net baseline, decision-support-not-diagnosis category — see
// docs/xray-exports/safety-net-baseline-testcases-2026-09-17.md (Issue Ids 100008-100010).
// Risk-gated: qa-fleet.config.json -> riskGatedCategories -> decision-support-not-diagnosis.
// This is the product's core regulatory-positioning requirement (FDA CDS guidance) — a filed
// defect does not rescue a failure here, same as clinical-red-flag-escalation.
//
// Uses the shared clinician auth fixture — clinician-dashboard-ui is confirmed auth-required
// (AC-021.2). Test titles match the safety-net baseline plan's Summary field verbatim.

test('Verify that the assigned triage tier is always displayed together with its rubric-referenced rationale — never the tier alone, with no exception for the routine tier', async ({
  authenticatedPage,
}) => {
  const queue = new QueueDashboardPage(authenticatedPage);
  const drilldown = new NoteDrilldownPage(authenticatedPage);

  let routineIndex = -1;
  await test.step('Complete an intake session that results in a triage tier being assigned (routine)', async () => {
    await queue.goto();
    routineIndex = await queue.findFirstEntryIndexByTier('routine');
  });

  test.skip(
    routineIndex === -1,
    'No Routine-tier entry is currently in the queue — this fleet has no deterministic way yet to seed a specific tier outcome (no dev/test override is defined by any story).'
  );

  await test.step('The assigned triage tier is displayed together with its rubric-referenced rationale — never the tier alone', async () => {
    await queue.openEntry(routineIndex);
    expect(await drilldown.isRationaleVisibleAlongsideTier()).toBe(true);
  });
});

test('Verify that the UI/copy presents the tier as a suggestion for clinician review — never as a diagnosis, a directive, or a decision already made', async ({
  authenticatedPage,
}) => {
  const queue = new QueueDashboardPage(authenticatedPage);
  const drilldown = new NoteDrilldownPage(authenticatedPage);

  await test.step("Open a completed intake's structured note and triage tier in the clinician dashboard", async () => {
    await queue.goto();
    test.skip((await queue.getEntryCount()) === 0, 'No completed intake sessions are currently in the queue to open.');
    await queue.openEntry(0);
  });

  await test.step('The tier is presented with suggestion language — never as a diagnosis, a directive, or a decision already made', async () => {
    const tierText = (await drilldown.getTierPresentationText()) ?? '';
    expect(tierText.toLowerCase()).not.toMatch(/\bdiagnos(is|ed)\b/);
    expect(tierText.toLowerCase()).toMatch(/suggest|recommend/);
  });
});

test('Verify that the clinician can open the full structured note from the same view as the tier, so the basis for the recommendation is always independently reviewable', async ({
  authenticatedPage,
}) => {
  const queue = new QueueDashboardPage(authenticatedPage);
  const drilldown = new NoteDrilldownPage(authenticatedPage);

  await test.step("From the clinician dashboard queue, open a patient's triage tier entry", async () => {
    await queue.goto();
    test.skip((await queue.getEntryCount()) === 0, 'No queue entries currently exist to open.');
    await queue.openEntry(0);
  });

  await test.step('The full structured note (chief complaint, HPI, relevant history, flagged concerns) is reachable from the same view as the tier', async () => {
    expect(await drilldown.isStructuredNoteReachableFromThisView()).toBe(true);
  });
});
