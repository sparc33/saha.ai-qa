import { BasePage } from '../base.page';

// Selectors below are placeholders — not yet verified against a running app.
// Replace via ui-selector-discovery.agent.md (in the QA fleet repo) once
// clinician-dashboard-ui is reachable; see playwright-ui-framework-builder.agent.md
// for the real-vs-placeholder convention this follows.
export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.getByLabel(/username|email/i); // TODO: placeholder selector — not verified against a running app
  private readonly passwordInput = this.page.getByLabel(/password/i); // TODO: placeholder selector — not verified against a running app
  private readonly submitButton = this.page.getByRole('button', { name: /log in|sign in/i }); // TODO: placeholder selector — not verified against a running app

  async login(username: string, password: string): Promise<void> {
    await this.goto('/login');
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.waitForLoad();
  }
}
