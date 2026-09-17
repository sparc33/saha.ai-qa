import { Page } from '@playwright/test';

// Shared, surface-agnostic helpers. Surface-specific page objects extend this
// rather than duplicating navigation/wait boilerplate across patient-chat-ui
// and clinician-dashboard-ui.
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
