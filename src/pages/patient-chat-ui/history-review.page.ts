import { BasePage } from '../base.page';

// Selectors below are placeholders — not yet verified against a running app.
// Reflects US-039 (Returning Patient History Review Using Chat Cards, EPIC-011) — a
// Confluence-only, Status: Proposed epic (no Jira ticket exists) — see
// docs/xray-exports/epic-011-testcases-2026-09-18.md.
export type HistoryCardCategory = 'allergies' | 'medications' | 'chronicConditions';

export class HistoryReviewPage extends BasePage {
  private historyCard(category: HistoryCardCategory) {
    return this.page.getByTestId(`history-card-${category}`); // TODO: placeholder selector (AC-039.1)
  }

  private confirmButton(category: HistoryCardCategory) {
    return this.historyCard(category).getByRole('button', { name: /looks correct/i }); // TODO: placeholder selector (AC-039.2)
  }

  private updateButton(category: HistoryCardCategory) {
    return this.historyCard(category).getByRole('button', { name: /update/i }); // TODO: placeholder selector (AC-039.3)
  }

  private readonly noRecordsMessage = this.page.getByText(/no records? (are )?on file/i); // TODO: placeholder selector (AC-039.4)
  private readonly confirmNoneButton = this.page.getByRole('button', { name: /confirm none/i }); // TODO: placeholder selector (AC-039.4)
  private readonly addInfoButton = this.page.getByRole('button', { name: /add information/i }); // TODO: placeholder selector (AC-039.4)

  async isHistoryCardVisible(category: HistoryCardCategory): Promise<boolean> {
    return this.historyCard(category).isVisible();
  }

  async confirmHistoryCard(category: HistoryCardCategory): Promise<void> {
    await this.confirmButton(category).click();
  }

  async isHistoryCardConfirmed(category: HistoryCardCategory): Promise<boolean> {
    return this.historyCard(category).getAttribute('data-confirmed').then((v) => v === 'true'); // TODO: placeholder attribute (AC-039.2)
  }

  /** AC-039.3 — MISSING DATA per the testability review: the review destination/mechanism for
   * a captured update is unspecified. This only submits a plain-language change and does not
   * assert where it ends up. */
  async submitHistoryUpdate(category: HistoryCardCategory, changeText: string): Promise<void> {
    await this.updateButton(category).click();
    await this.page.getByRole('textbox').fill(changeText); // TODO: placeholder selector — update-entry input, not verified
  }

  async isNoRecordsMessageVisible(): Promise<boolean> {
    return this.noRecordsMessage.isVisible();
  }

  async confirmNoRecords(): Promise<void> {
    await this.confirmNoneButton.click();
  }

  async isAddInformationOptionAvailable(): Promise<boolean> {
    return this.addInfoButton.isVisible();
  }
}
