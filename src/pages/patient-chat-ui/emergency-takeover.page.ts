import { BasePage } from '../base.page';

// Selectors below are placeholders — not yet verified against a running app.
// Reflects US-041 (Per-Turn Red-Flag Detection and Emergency Intercept, EPIC-011) — a
// Confluence-only, Status: Proposed epic (no Jira ticket exists) — see
// docs/xray-exports/epic-011-testcases-2026-09-18.md.
//
// AC-041.1's own claim ("evaluates before or in parallel with LLM processing") is an internal
// architecture detail, not black-box observable — flagged Ambiguous in the testability review.
// This page object only exposes the observable outcome (did escalation fire), not the ordering.
export class EmergencyTakeoverPage extends BasePage {
  private readonly takeoverOverlay = this.page.getByTestId('emergency-takeover'); // TODO: placeholder selector (AC-041.3)
  private readonly takeoverMessage = this.page.getByTestId('emergency-takeover-message'); // TODO: placeholder selector (AC-041.3/AC-041.5)
  private readonly messageInput = this.page.getByRole('textbox'); // TODO: placeholder selector (AC-041.4)
  private readonly interactiveControls = this.page.getByRole('button'); // TODO: placeholder selector — broad, covers "interactive controls" generally (AC-041.4)

  async isTakeoverActive(): Promise<boolean> {
    return this.takeoverOverlay.isVisible();
  }

  async getTakeoverMessageText(): Promise<string | null> {
    return this.takeoverMessage.textContent();
  }

  /** AC-041.4 — during an active emergency takeover, free-text input and all interactive
   * controls must be disabled. Checks both, since AC-041.4 bundles them into one requirement. */
  async isChatLocked(): Promise<boolean> {
    const inputDisabled = await this.messageInput.isDisabled();
    const controlsCount = await this.interactiveControls.count();
    if (controlsCount === 0) return inputDisabled;
    const enabledControls = await this.interactiveControls.evaluateAll((els) =>
      els.filter((el) => !(el as HTMLButtonElement).disabled).length
    );
    return inputDisabled && enabledControls === 0;
  }
}
