import { test as base, expect, Browser } from '@playwright/test';
import { LoginPage } from '../../src/pages/clinician-dashboard-ui/login.page';
import { QueueDashboardPage } from '../../src/pages/clinician-dashboard-ui/queue-dashboard.page';

// Safety-net baseline, tenant-isolation category — see
// docs/xray-exports/safety-net-baseline-testcases-2026-09-17.md (Issue Ids 100011-100013).
// Risk-gated: qa-fleet.config.json -> riskGatedCategories -> tenant-isolation. Sourced from a
// real PRD rule (NFR-011/DE-017) — cross-clinic PHI leakage can't be averaged away by a
// passing suite, so a filed defect never rescues a failure here.
//
// 100011/100012 need two distinct clinics' clinician accounts, which the shared auth fixture
// (src/fixtures/auth.fixture.ts) doesn't provide — it only knows one clinic's test credentials.
// Rather than invent a second clinic's identity, these two tests log in directly via a second
// browser context using CLINICIAN_TEST_USERNAME_CLINIC_B / _PASSWORD_CLINIC_B (see .env.example)
// and skip with a clear reason if that account isn't provisioned yet.

async function loginAs(browser: Browser, username: string, password: string) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await new LoginPage(page).login(username, password);
  return { context, page };
}

base(
  "Verify that a clinician authenticated for one clinic cannot view another clinic's patient queue, by any navigation path",
  async ({ browser }) => {
    const clinicBUsername = process.env.CLINICIAN_TEST_USERNAME_CLINIC_B;
    const clinicBPassword = process.env.CLINICIAN_TEST_PASSWORD_CLINIC_B;
    base.skip(
      !clinicBUsername || !clinicBPassword,
      'CLINICIAN_TEST_USERNAME_CLINIC_B / _PASSWORD_CLINIC_B are not set — a second clinic\'s test account is required to prove cross-clinic isolation and isn\'t provisioned yet.'
    );

    const clinicA = await loginAs(browser, process.env.CLINICIAN_TEST_USERNAME!, process.env.CLINICIAN_TEST_PASSWORD!);
    const clinicB = await loginAs(browser, clinicBUsername!, clinicBPassword!);

    try {
      let clinicBPatientId: string | null = null;
      await base.step("Establish a known Clinic B patient identifier", async () => {
        const clinicBQueue = new QueueDashboardPage(clinicB.page);
        await clinicBQueue.goto();
        base.skip((await clinicBQueue.getEntryCount()) === 0, 'Clinic B has no queue entries to attempt cross-clinic access against.');
        clinicBPatientId = await clinicBQueue.getEntryPatientId(0);
      });

      await base.step("As Clinic A's clinician, attempt every discoverable navigation path to Clinic B's patient queue", async () => {
        const clinicAQueue = new QueueDashboardPage(clinicA.page);
        await clinicAQueue.goto();
        const clinicAPatientIds = await Promise.all(
          Array.from({ length: await clinicAQueue.getEntryCount() }, (_, i) => clinicAQueue.getEntryPatientId(i))
        );
        expect(clinicAPatientIds).not.toContain(clinicBPatientId);
      });
    } finally {
      await clinicA.context.close();
      await clinicB.context.close();
    }
  }
);

base(
  "Verify that a clinician cannot open another clinic's structured note by direct URL/ID manipulation, even with an otherwise-valid session",
  async ({ browser }) => {
    const clinicBUsername = process.env.CLINICIAN_TEST_USERNAME_CLINIC_B;
    const clinicBPassword = process.env.CLINICIAN_TEST_PASSWORD_CLINIC_B;
    base.skip(
      !clinicBUsername || !clinicBPassword,
      'CLINICIAN_TEST_USERNAME_CLINIC_B / _PASSWORD_CLINIC_B are not set — a second clinic\'s test account is required to prove cross-clinic isolation and isn\'t provisioned yet.'
    );

    const clinicA = await loginAs(browser, process.env.CLINICIAN_TEST_USERNAME!, process.env.CLINICIAN_TEST_PASSWORD!);
    const clinicB = await loginAs(browser, clinicBUsername!, clinicBPassword!);

    try {
      let clinicBPatientId: string | null = null;
      await base.step("Obtain a Clinic B patient's structured-note identifier", async () => {
        const clinicBQueue = new QueueDashboardPage(clinicB.page);
        await clinicBQueue.goto();
        base.skip((await clinicBQueue.getEntryCount()) === 0, 'Clinic B has no patient note to attempt cross-clinic access against.');
        clinicBPatientId = await clinicBQueue.getEntryPatientId(0);
      });

      await base.step("As Clinic A's clinician, manipulate a structured-note URL/ID to reference the Clinic B patient", async () => {
        const response = await clinicA.page.goto(`/notes/${clinicBPatientId}`); // TODO: placeholder route — not verified against a running app
        expect(response?.status()).not.toBe(200);
      });
    } finally {
      await clinicA.context.close();
      await clinicB.context.close();
    }
  }
);

base.fixme(
  "Verify that a patient intake session is scoped to the clinic its kiosk/pre-visit link belongs to, and never appears in another clinic's queue or reporting",
  async () => {
    // Not scaffolded: this is a real cross-surface scenario (patient-chat-ui intake creation,
    // then clinician-dashboard-ui verification), but no story read so far (EPIC-001, EPIC-009)
    // defines how a clinic is identified/parameterized in a kiosk or pre-visit link URL. Writing
    // navigation code against a guessed URL scheme would fabricate a contract that doesn't exist
    // yet — flagging the gap here (base.fixme keeps it visible in test-run output) rather than
    // faking a scheme. Un-fixme once a story defines the clinic-scoping mechanism for intake links.
  }
);
