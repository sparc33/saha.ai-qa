import { BasePage } from '../base.page';

// Selectors below are placeholders — not yet verified against a running app.
// Replace via ui-selector-discovery.agent.md once clinician-dashboard-ui is reachable.
// Reflects US-019 (Triage Score and Rationale Visible in Note Drill-Down, VAN-22) and the
// note content itself from US-013 (VAN-18) — CONFIRMED ACs read from Jira 2026-09-17: full
// structured note (Chief Complaint, HPI, Relevant History, Flagged Concerns) + triage tier +
// rubric-referenced rationale + non-dismissible AI disclaimer, all in one view; clinician
// override action reachable from this same view (AC-019.6) without hiding the original
// AI-assigned score once overridden (AC-019.ALT.2, BRULE-040/041).
export class NoteDrilldownPage extends BasePage {
  private readonly triageTierBadge = this.page.getByTestId('triage-tier'); // TODO: placeholder selector — not verified against a running app
  private readonly triageRationale = this.page.getByTestId('triage-rationale'); // TODO: placeholder selector (AC-019.2)
  private readonly disclaimer = this.page.getByText(/for clinician review only/i); // TODO: placeholder selector (AC-019.3)
  private readonly structuredNote = this.page.getByTestId('structured-note'); // TODO: placeholder selector (AC-019.1)
  private readonly flaggedConcernsSection = this.page.getByTestId('flagged-concerns-section'); // TODO: placeholder selector (AC-019.4/ALT.1)
  private readonly overrideAction = this.page.getByRole('button', { name: /override/i }); // TODO: placeholder selector (AC-019.6)
  private readonly originalAiScoreBadge = this.page.getByTestId('original-ai-triage-tier'); // TODO: placeholder selector (AC-019.ALT.2)

  async getTriageTierText(): Promise<string | null> {
    return this.triageTierBadge.textContent();
  }

  /** AC-018.2 / 100008 — a tier is never a valid output without its rationale alongside it. */
  async isRationaleVisibleAlongsideTier(): Promise<boolean> {
    return (await this.triageTierBadge.isVisible()) && (await this.triageRationale.isVisible());
  }

  async isDisclaimerVisible(): Promise<boolean> {
    return this.disclaimer.isVisible();
  }

  /** AC-019.1 / 100010 — the full note must be reachable from the same view as the tier, not a separate navigation. */
  async isStructuredNoteReachableFromThisView(): Promise<boolean> {
    return this.structuredNote.isVisible();
  }

  /** AC-018.4/AC-020.6 / 100009 — used to assert suggestion language ("suggested urgency" /
   * "recommended for review"), never diagnostic or directive language. */
  async getTierPresentationText(): Promise<string | null> {
    return this.triageTierBadge.textContent();
  }

  async isFlaggedConcernsSectionVisible(): Promise<boolean> {
    return this.flaggedConcernsSection.isVisible();
  }

  async getFlaggedConcernsText(): Promise<string | null> {
    return this.flaggedConcernsSection.textContent();
  }

  async isOverrideActionAccessible(): Promise<boolean> {
    return this.overrideAction.isVisible();
  }

  async overrideTriageTier(): Promise<void> {
    await this.overrideAction.click();
    await this.waitForLoad();
  }

  async isOriginalAiScoreStillVisible(): Promise<boolean> {
    return this.originalAiScoreBadge.isVisible();
  }
}
