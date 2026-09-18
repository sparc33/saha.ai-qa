import { BasePage } from '../base.page';

// Selectors below are placeholders — not yet verified against a running app.
// Reflects US-042 (Intake Completion and Background Processing, EPIC-011) — a
// Confluence-only, Status: Proposed epic (no Jira ticket exists) — see
// docs/xray-exports/epic-011-testcases-2026-09-18.md.
export class IntakeCompletionPage extends BasePage {
  private readonly completionCard = this.page.getByTestId('completion-card'); // TODO: placeholder selector (AC-042.1)
  private readonly messageInput = this.page.getByRole('textbox'); // TODO: placeholder selector (AC-042.2)
  private readonly quickReplyOptions = this.page.getByTestId('quick-reply-option'); // TODO: placeholder selector (AC-042.2)
  private readonly attachmentControl = this.page.getByTestId('attachment-control'); // TODO: placeholder selector (AC-042.2)
  private readonly triageLevelIndicator = this.page.getByTestId('triage-tier'); // TODO: placeholder selector — must NOT appear here (AC-042.3)
  private readonly clinicalNoteContent = this.page.getByTestId('structured-note'); // TODO: placeholder selector — must NOT appear here (AC-042.3)
  private readonly staffReviewFlag = this.page.getByTestId('transcript-flagged-for-review'); // TODO: placeholder selector — likely staff-side only, not patient-observable (AC-042.EX.1)

  async isCompletionCardVisible(): Promise<boolean> {
    return this.completionCard.isVisible();
  }

  async getCompletionCardText(): Promise<string | null> {
    return this.completionCard.textContent();
  }

  /** AC-042.2 — session enters INTAKE_COMPLETE: input, attachments, and quick replies all
   * disabled. Checks all three since the AC bundles them into one requirement. */
  async isSessionFullyLocked(): Promise<boolean> {
    const inputDisabled = await this.messageInput.isDisabled();
    const quickRepliesGone = (await this.quickReplyOptions.count()) === 0;
    const attachmentGone = (await this.attachmentControl.count()) === 0;
    return inputDisabled && quickRepliesGone && attachmentGone;
  }

  /** AC-042.3 — internal triage levels and clinical notes must never be exposed to the
   * patient's own view of the completed conversation. */
  async isClinicalArtifactExposed(): Promise<boolean> {
    const triageVisible = await this.triageLevelIndicator.isVisible().catch(() => false);
    const noteVisible = await this.clinicalNoteContent.isVisible().catch(() => false);
    return triageVisible || noteVisible;
  }

  /** AC-042.EX.1 — NOTE: staff-side review flagging likely isn't observable from the patient's
   * own view at all; this method exists for completeness but may need to move to a
   * staff/clinician-facing page object once that surface for this epic is defined. */
  async isTranscriptFlaggedForReview(): Promise<boolean> {
    return this.staffReviewFlag.isVisible();
  }
}
