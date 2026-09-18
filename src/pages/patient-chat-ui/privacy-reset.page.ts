import { BasePage } from '../base.page';

// Selectors below are placeholders — not yet verified against a running app.
// Reflects US-043 (Shared Tablet Privacy Reset, EPIC-011) — a Confluence-only,
// Status: Proposed epic (no Jira ticket exists) — see
// docs/xray-exports/epic-011-testcases-2026-09-18.md.
//
// KNOWN GAP, not solved here: neither the completion timeout (AC-043.1) nor the idle
// threshold (AC-043.3) has a stated duration — both match the epic's own Dependency #5
// ("Confirm shared-tablet purge timing"). Tests using this page object either need a
// configurable short timeout in a test environment, or will need re-timing once that
// dependency resolves — there's no way to assert a specific wait today.
export class PrivacyResetPage extends BasePage {
  private readonly welcomeState = this.page.getByTestId('welcome-state'); // TODO: placeholder selector (AC-043.2)
  private readonly idleWarning = this.page.getByTestId('idle-countdown-warning'); // TODO: placeholder selector (AC-043.3)

  async isWelcomeStateVisible(): Promise<boolean> {
    return this.welcomeState.isVisible();
  }

  /** AC-043.1/AC-043.2 — after purge, checks the browser's own storage is actually empty,
   * not just that the UI looks reset (a UI-only check could pass while PHI remains in
   * localStorage/cookies, which is the actual privacy risk this story exists to prevent). */
  async isLocalStateFullyPurged(): Promise<boolean> {
    const storageState = await this.page.evaluate(() => ({
      localStorageEmpty: window.localStorage.length === 0,
      sessionStorageEmpty: window.sessionStorage.length === 0,
      cookiesEmpty: document.cookie === '',
    }));
    return storageState.localStorageEmpty && storageState.sessionStorageEmpty && storageState.cookiesEmpty;
  }

  async isIdleWarningVisible(): Promise<boolean> {
    return this.idleWarning.isVisible();
  }

  async getIdleWarningText(): Promise<string | null> {
    return this.idleWarning.textContent();
  }
}
