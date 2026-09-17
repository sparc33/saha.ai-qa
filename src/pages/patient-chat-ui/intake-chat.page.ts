import { BasePage } from '../base.page';

// Selectors below are placeholders — not yet verified against a running app.
// Replace via ui-selector-discovery.agent.md once patient-chat-ui is reachable.
//
// Auth note, corrected 2026-09-17: no *clinician*-level auth applies here (PRD BRULE-052),
// but patients themselves do go through OTP identity verification first (EPIC-009,
// VAN-28 through VAN-31) — see OtpLoginPage. This class covers the conversational
// surface reached after that step, not the login step itself.
export class IntakeChatPage extends BasePage {
  private readonly messageInput = this.page.getByRole('textbox'); // TODO: placeholder selector — not verified against a running app
  private readonly sendButton = this.page.getByRole('button', { name: /send/i }); // TODO: placeholder selector — not verified against a running app
  private readonly completionConfirmation = this.page.getByRole('status'); // TODO: placeholder selector — not verified against a running app (US-003)
  private readonly prePopulatedHistorySummary = this.page.getByTestId('prior-history-summary'); // TODO: placeholder selector — not verified against a running app (US-005)
  private readonly escalationFlag = this.page.getByTestId('escalate-now-flag'); // TODO: placeholder selector — not verified against a running app. Exact escalation UI treatment (inline banner vs. redirect vs. modal) is undefined in every story read so far (EPIC-002); this only checks *some* visible indicator exists, not a specific presentation.

  async sendMessage(text: string): Promise<void> {
    await this.messageInput.fill(text);
    await this.sendButton.click();
  }

  async waitForResponseContaining(text: string | RegExp): Promise<void> {
    await this.page.getByText(text).waitFor();
  }

  /** US-003 — Intake Session Completion & Handoff Confirmation. "Clear confirmation" is
   * still undefined (format/content/channel unspecified in the story) — this just reads
   * whatever confirmation state exists, it doesn't assert a specific shape yet. */
  async getCompletionConfirmationText(): Promise<string | null> {
    return this.completionConfirmation.textContent();
  }

  /** US-004/US-005 — Returning Patient Recognition & Prior History Pre-Population.
   * Reads whatever pre-populated history summary is shown after OTP login recognizes
   * a returning patient; does not assert exact-match correctness itself — that's the
   * `patient-record-matching` risk-gated category's job, at the conversation-api level. */
  async getPrePopulatedHistorySummary(): Promise<string | null> {
    return this.prePopulatedHistorySummary.textContent();
  }

  /** clinical-red-flag-escalation risk-gated category — checks that *some* escalate-now
   * indicator appeared, not any particular wording or channel (that's undefined pending
   * OQ-03/BLK-03, see clinicalSafety.redFlagSymptomsNote in the QA fleet's qa-fleet.config.json). */
  async isEscalationFlagVisible(): Promise<boolean> {
    return this.escalationFlag.isVisible();
  }
}
