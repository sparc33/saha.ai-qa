import { test, expect } from '@playwright/test';
import { OtpLoginPage } from '../../src/pages/patient-chat-ui/otp-login.page';
import { IntakeChatPage } from '../../src/pages/patient-chat-ui/intake-chat.page';
import { loadSyntheticPatients } from '../../src/utilities/patientDataLoader';

// Safety-net baseline, patient-record-matching category — see
// docs/xray-exports/safety-net-baseline-testcases-2026-09-17.md (Issue Ids 100014-100016).
// Risk-gated: qa-fleet.config.json -> riskGatedCategories -> patient-record-matching.
// A cross-patient mismatch here is a clinical-safety incident, not an ordinary bug — sourced
// from a real testability-review finding on VAN-29, reinforced 2026-09-17 by BRULE-030/031/033.
//
// SURFACE REASSIGNMENT, flagged not silent: same as red-flag-escalation-safety-net.spec.ts —
// the design doc routed these to `conversation-api` (no spec location yet); implemented here
// against the real OTP login surface (EPIC-009) instead of fabricating an API contract.
//
// KNOWN GAP, not solved here: how a test obtains a real OTP for a synthetic identifier is
// still unknown (see otp-login.page.ts header comment) — these tests assume an
// OTP_TEST_BYPASS_CODE-style mechanism the dev team hasn't confirmed exists yet, and will fail
// at the verifyOtp step until that's resolved. Left in place (not skipped) so the gap is visible
// in run output rather than silently absent from the suite.

test('Verify that a patient logging in with an MR number or registered phone number is matched to their own record via an exact identifier match — never a fuzzy or partial match that could resolve to a different patient', async ({
  page,
}) => {
  const patients = loadSyntheticPatients();
  test.skip(patients.length === 0, 'No synthetic patient fixtures exist yet in docs/test-data/patients/ — see the draft roster pending review.');

  const patient = patients[0];
  const otpLogin = new OtpLoginPage(page);
  const intakeChat = new IntakeChatPage(page);

  await test.step('Log in with a valid MR number or registered phone number and a correct OTP', async () => {
    await otpLogin.requestOtp(String(patient.medicalRecordNumber ?? patient.phone));
    await otpLogin.verifyOtp(String(process.env.OTP_TEST_BYPASS_CODE ?? ''));
  });

  await test.step('The system matches the patient to their own record via an exact identifier match', async () => {
    const summary = await intakeChat.getPrePopulatedHistorySummary();
    expect(summary).toContain(patient.id);
  });
});

test("Verify that a login attempt with an MR number or phone number that doesn't exactly match any existing patient record is rejected outright, never silently matched to the nearest similar record", async ({
  page,
}) => {
  const otpLogin = new OtpLoginPage(page);

  await test.step('Attempt to log in with an MR number or phone number that doesn\'t exactly match any existing patient record', async () => {
    await otpLogin.requestOtp('TEST-000000-DOES-NOT-EXIST');
  });

  await test.step('The login attempt is rejected outright — never silently matched to the nearest similar record', async () => {
    const error = await otpLogin.getErrorMessage();
    expect(error).toBeTruthy();
  });
});

test('Verify that two patients with plausibly similar identifiers (e.g. typo-adjacent phone numbers, similar MR numbers) never have their intake data merged or cross-attached to the wrong record', async ({
  page,
}) => {
  test.skip(
    true,
    'Requires two synthetic patient fixtures with deliberately typo-adjacent identifiers — the current draft roster (TEST-000142/TEST-000143) was never approved and no such adjacent-identifier pair exists yet. Un-skip once that fixture pair is written and reviewed.'
  );
});
