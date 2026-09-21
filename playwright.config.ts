import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

// Multi-project config for the AI Clinical Intake & Triage Assistant — one repo,
// three surfaces (mirrors this repo's own qa-fleet.config.json -> testSurfaces).
// Base URLs come only from env vars — see .env.example. Never hard-code a real host
// here; cross-check any value against the fleet's browserAutomation allow-list before use.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'docs/test-results/html-report', open: 'never' }],
    ['junit', { outputFile: 'docs/test-results/junit.xml' }],
  ],
  outputDir: 'docs/test-results/artifacts',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'patient-chat-ui',
      testDir: './tests/patient-chat-ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.PATIENT_CHAT_BASE_URL,
      },
    },
    {
      name: 'clinician-dashboard-ui',
      testDir: './tests/clinician-dashboard-ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.CLINICIAN_DASHBOARD_BASE_URL,
      },
    },
    {
      name: 'conversation-api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.CONVERSATION_API_BASE_URL,
      },
    },
  ],
});
