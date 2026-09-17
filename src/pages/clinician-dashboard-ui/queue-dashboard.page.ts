import { BasePage } from '../base.page';

// Selectors below are placeholders — not yet verified against a running app.
// Replace via ui-selector-discovery.agent.md once clinician-dashboard-ui is reachable.
// Reflects US-020 (View Urgency-Sorted Patient Queue Dashboard, VAN-23) — CONFIRMED ACs
// read directly from Jira 2026-09-17: sort order Emergency -> Urgent -> Routine, each entry
// carries patient identifier / tier / intake time / escalation-flag status, real-time updates,
// Emergency entries distinguished by colour+icon+position (not colour alone, AC-020.4), a
// persistent decision-support disclaimer, and a staleness indicator if real-time updates fail.
export type TriageTier = 'emergency' | 'urgent' | 'routine';

export class QueueDashboardPage extends BasePage {
  private readonly queueEntries = this.page.getByTestId('queue-entry'); // TODO: placeholder selector — not verified against a running app
  private readonly emptyState = this.page.getByText(/no active intake sessions/i); // TODO: placeholder selector (AC-020.ALT.1)
  private readonly disclaimer = this.page.getByText(/decision support/i).and(this.page.getByText(/not a diagnos/i)); // TODO: placeholder selector (AC-020.6)
  private readonly stalenessIndicator = this.page.getByTestId('queue-staleness-indicator'); // TODO: placeholder selector (AC-020.EX.1)

  async goto(path: string = '/dashboard'): Promise<void> {
    await super.goto(path);
  }

  async getEntryCount(): Promise<number> {
    return this.queueEntries.count();
  }

  /** Tiers in on-screen DOM order — used to assert the Emergency -> Urgent -> Routine sort (AC-020.1). */
  async getEntryTiersInOrder(): Promise<TriageTier[]> {
    const tiers = await this.queueEntries.evaluateAll((entries) =>
      entries.map((e) => (e.getAttribute('data-tier') || '').toLowerCase())
    );
    return tiers as TriageTier[];
  }

  /** First entry index matching the given tier, or -1 if none is currently queued. Callers should
   * skip rather than fail when a specific tier isn't present — this fleet doesn't control which
   * tier a given synthetic intake session lands in without a seeded/deterministic scenario, which
   * doesn't exist yet (see decision-support-safety-net.spec.ts). */
  async findFirstEntryIndexByTier(tier: TriageTier): Promise<number> {
    const tiers = await this.getEntryTiersInOrder();
    return tiers.indexOf(tier);
  }

  async getEntryPatientId(index: number): Promise<string | null> {
    return this.queueEntries.nth(index).getAttribute('data-patient-id'); // TODO: placeholder attribute — not verified against a running app
  }

  async isEscalationFlagVisibleForEntry(index: number): Promise<boolean> {
    return this.queueEntries.nth(index).getByTestId('escalation-flag').isVisible(); // TODO: placeholder selector (AC-020.5)
  }

  async isDisclaimerVisible(): Promise<boolean> {
    return this.disclaimer.isVisible();
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return this.emptyState.isVisible();
  }

  async openEntry(index: number): Promise<void> {
    await this.queueEntries.nth(index).click();
    await this.waitForLoad();
  }

  async isStalenessIndicatorVisible(): Promise<boolean> {
    return this.stalenessIndicator.isVisible();
  }
}
