import { BasePage } from '../base.page';

// Reflects the OTP-based patient login flow discovered from EPIC-009 (VAN-28 through
// VAN-31): an MR number or registered phone number, then OTP verification. Selectors
// below are placeholders, not yet verified against a running app — replace via
// ui-selector-discovery.agent.md once patient-chat-ui is reachable.
//
// Structure only, not behavior: OTP expiry/retry/lockout bounds are still undefined
// (see the testability review comments posted on VAN-28 through VAN-31) — this page
// object doesn't assert those bounds itself, it just gives automation something to
// drive once real acceptance criteria exist.
//
// Open question, not solved here: how a test actually obtains a valid OTP for a
// synthetic test identifier (a real SMS-delivered OTP can't be read programmatically
// without either a test-mode bypass or a way to intercept it) is unknown — ask the
// dev team rather than assume a bypass mechanism that may not exist.
export class OtpLoginPage extends BasePage {
  private readonly identifierInput = this.page.getByLabel(/MR number|medical record|phone number/i); // TODO: placeholder selector — not verified against a running app
  private readonly requestOtpButton = this.page.getByRole('button', { name: /send|request|continue/i }); // TODO: placeholder selector — not verified against a running app
  private readonly otpInput = this.page.getByLabel(/otp|one-time password|verification code/i); // TODO: placeholder selector — not verified against a running app
  private readonly verifyOtpButton = this.page.getByRole('button', { name: /verify|submit|confirm/i }); // TODO: placeholder selector — not verified against a running app
  private readonly resendOtpButton = this.page.getByRole('button', { name: /resend/i }); // TODO: placeholder selector — not verified against a running app
  private readonly errorMessage = this.page.getByRole('alert'); // TODO: placeholder selector — not verified against a running app
  private readonly identifierFormatError = this.page.getByTestId('identifier-format-error'); // TODO: placeholder selector — EPIC-011 AC-038.1
  private readonly maskedDestination = this.page.getByTestId('otp-masked-destination'); // TODO: placeholder selector — EPIC-011 AC-038.2
  private readonly resendCountdown = this.page.getByTestId('otp-resend-countdown'); // TODO: placeholder selector — EPIC-011 AC-038.2, duration unstated (see testability review)
  private readonly verifiedState = this.page.getByTestId('otp-verified-state'); // TODO: placeholder selector — EPIC-011 AC-038.3
  private readonly lockoutMessage = this.page.getByTestId('otp-lockout-message'); // TODO: placeholder selector — EPIC-011 AC-038.EX.1

  async requestOtp(identifier: string): Promise<void> {
    await this.goto('/login');
    await this.identifierInput.fill(identifier);
    await this.requestOtpButton.click();
  }

  async verifyOtp(otp: string): Promise<void> {
    await this.otpInput.fill(otp);
    await this.verifyOtpButton.click();
    await this.waitForLoad();
  }

  async resendOtp(): Promise<void> {
    await this.resendOtpButton.click();
  }

  async getErrorMessage(): Promise<string | null> {
    return this.errorMessage.textContent();
  }

  /** EPIC-011 AC-038.1 — format validation error on an invalid MRN/phone identifier. */
  async getIdentifierFormatError(): Promise<string | null> {
    return this.identifierFormatError.textContent();
  }

  async isMaskedDestinationVisible(): Promise<boolean> {
    return this.maskedDestination.isVisible();
  }

  /** AC-038.2 — MISSING DATA per the testability review: exact countdown duration unstated.
   * This only checks the countdown widget renders, not a specific duration value. */
  async isResendCountdownVisible(): Promise<boolean> {
    return this.resendCountdown.isVisible();
  }

  async isVerifiedStateVisible(): Promise<boolean> {
    return this.verifiedState.isVisible();
  }

  /** AC-038.EX.1 — locks out after 5 consecutive failed attempts (the one concrete threshold
   * in this story) and directs the patient to clinic staff. */
  async isLockedOut(): Promise<boolean> {
    return this.lockoutMessage.isVisible();
  }

  async getLockoutMessage(): Promise<string | null> {
    return this.lockoutMessage.textContent();
  }
}
