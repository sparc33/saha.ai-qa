import { BasePage } from '../base.page';

// Selectors below are placeholders — not yet verified against a running app.
// Reflects US-037 (Conversational Session Initialization and Consent, EPIC-011) — a
// Confluence-only, Status: Proposed epic (no Jira ticket exists) — see
// docs/xray-exports/epic-011-testcases-2026-09-18.md. Structure only, not a confirmed spec.
export class ConsentPage extends BasePage {
  private readonly welcomeMessage = this.page.getByTestId('welcome-message'); // TODO: placeholder selector (AC-037.1)
  private readonly consentCard = this.page.getByTestId('consent-card'); // TODO: placeholder selector (AC-037.1)
  private readonly acceptConsentButton = this.page.getByRole('button', { name: /accept|agree/i }); // TODO: placeholder selector (AC-037.1)
  private readonly declineConsentButton = this.page.getByRole('button', { name: /decline|opt out/i }); // TODO: placeholder selector (AC-037.ALT.1)
  private readonly disclaimerBanner = this.page.getByTestId('non-diagnostic-disclaimer'); // TODO: placeholder selector (AC-037.2)
  private readonly messageInput = this.page.getByRole('textbox'); // TODO: placeholder selector (AC-037.3)
  private readonly consentGateInstruction = this.page.getByText(/accept the terms before continuing/i); // TODO: placeholder selector (AC-037.3)
  private readonly staffRedirectMessage = this.page.getByTestId('staff-redirect-message'); // TODO: placeholder selector (AC-037.ALT.1)
  private readonly serviceUnavailableFallback = this.page.getByTestId('service-unavailable-fallback'); // TODO: placeholder selector (AC-037.EX.1)

  async isWelcomeMessageVisible(): Promise<boolean> {
    return this.welcomeMessage.isVisible();
  }

  async isConsentCardVisible(): Promise<boolean> {
    return this.consentCard.isVisible();
  }

  async acceptConsent(): Promise<void> {
    await this.acceptConsentButton.click();
  }

  async declineConsent(): Promise<void> {
    await this.declineConsentButton.click();
  }

  async isDisclaimerVisible(): Promise<boolean> {
    return this.disclaimerBanner.isVisible();
  }

  async getDisclaimerText(): Promise<string | null> {
    return this.disclaimerBanner.textContent();
  }

  /** AC-037.3 — input must stay disabled while consent is pending. */
  async isMessageInputDisabled(): Promise<boolean> {
    return this.messageInput.isDisabled();
  }

  async isConsentGateInstructionVisible(): Promise<boolean> {
    return this.consentGateInstruction.isVisible();
  }

  async isStaffRedirectVisible(): Promise<boolean> {
    return this.staffRedirectMessage.isVisible();
  }

  /** AC-037.EX.1 — AMBIGUOUS per the testability review: "without exposing system errors" has
   * no defined negative list. This only checks the fallback message renders, not its content
   * against a specific prohibited-terms list, since none is defined yet. */
  async isServiceUnavailableFallbackVisible(): Promise<boolean> {
    return this.serviceUnavailableFallback.isVisible();
  }

  async getServiceUnavailableFallbackText(): Promise<string | null> {
    return this.serviceUnavailableFallback.textContent();
  }
}
