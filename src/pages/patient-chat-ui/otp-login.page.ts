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
}
