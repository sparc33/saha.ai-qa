import { test as base, Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/clinician-dashboard-ui/login.page';

// clinician-dashboard-ui is confirmed auth-required (PRD: AC-021.2 / INT-009 Authentication
// Service — every dashboard route without auth must reject + redirect to login).
// patient-chat-ui must never use this fixture — it's confirmed to need no auth (BRULE-052).
export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    const username = process.env.CLINICIAN_TEST_USERNAME;
    const password = process.env.CLINICIAN_TEST_PASSWORD;
    if (!username || !password) {
      throw new Error(
        'CLINICIAN_TEST_USERNAME / CLINICIAN_TEST_PASSWORD must be set (see .env.example) — ' +
          'clinician-dashboard-ui is confirmed auth-required, this fixture cannot proceed without them.'
      );
    }
    const loginPage = new LoginPage(page);
    await loginPage.login(username, password);
    await use(page);
  },
});

export { expect };
