import { test, expect } from '@playwright/test';
import { OtpLoginPage } from '../../src/pages/patient-chat-ui/otp-login.page';

// EPIC-011 (Conversational AI Patient Intake) — US-038, Confluence-only, Status: Proposed,
// no Jira ticket exists. See docs/xray-exports/epic-011-testcases-2026-09-18.md. Test titles
// match the design-stage CSV's Summary field verbatim (rows 300007-300011).

test('In-chat identifier prompt with format validation (AC-038.1)', async ({ page }) => {
  const otpLogin = new OtpLoginPage(page);

  await test.step('Consent has been accepted and the assistant begins identification', async () => {
    await otpLogin.goto('/');
  });

  await test.step("An in-chat card requests the patient's MRN or registered phone number with format validation", async () => {
    await otpLogin.requestOtp('not-a-valid-format');
    const error = await otpLogin.getIdentifierFormatError();
    expect(error).toBeTruthy();
  });
});

test('OTP widget appears with masked destination and resend countdown (AC-038.2) — MISSING DATA: countdown duration unstated (see testability review)', async ({
  page,
}) => {
  const otpLogin = new OtpLoginPage(page);

  await test.step('A valid identifier is submitted and an OTP is dispatched', async () => {
    await otpLogin.goto('/');
    await otpLogin.requestOtp('TEST-000142');
  });

  await test.step("A six-digit entry widget appears with a masked destination and a resend countdown; exact countdown duration is unresolved pending the testability review's suggested rewrite", async () => {
    expect(await otpLogin.isMaskedDestinationVisible()).toBe(true);
    expect(await otpLogin.isResendCountdownVisible()).toBe(true);
  });
});

test('Successful OTP verification continues the same conversation without reload (AC-038.3)', async ({ page }) => {
  const otpLogin = new OtpLoginPage(page);
  await otpLogin.goto('/');
  await otpLogin.requestOtp('TEST-000142');

  await test.step('The patient enters the correct OTP', async () => {
    await otpLogin.verifyOtp(process.env.OTP_TEST_BYPASS_CODE ?? '');
  });

  await test.step('The widget changes to a verified state and the assistant continues in the same conversation without a page reload', async () => {
    expect(await otpLogin.isVerifiedStateVisible()).toBe(true);
  });
});

test("OTP resend restarts the countdown, subject to a session resend limit (AC-038.ALT.1) — MISSING DATA: resend limit value unstated (see testability review)", async ({
  page,
}) => {
  const otpLogin = new OtpLoginPage(page);
  await otpLogin.goto('/');
  await otpLogin.requestOtp('TEST-000142');

  await test.step('The resend timer has expired and the patient requests another code', async () => {
    await otpLogin.resendOtp();
  });

  await test.step("A new OTP is sent and the timer restarts, subject to a session resend limit; exact limit is unresolved pending the testability review's suggested rewrite", async () => {
    expect(await otpLogin.isResendCountdownVisible()).toBe(true);
  });
});

test('Verification locks out after five consecutive failed OTP attempts (AC-038.EX.1)', async ({ page }) => {
  const otpLogin = new OtpLoginPage(page);
  await otpLogin.goto('/');
  await otpLogin.requestOtp('TEST-000142');

  await test.step('Five consecutive OTP attempts fail', async () => {
    for (let i = 0; i < 5; i++) {
      await otpLogin.verifyOtp('000000');
    }
  });

  await test.step('The widget locks and directs the patient to clinic staff', async () => {
    expect(await otpLogin.isLockedOut()).toBe(true);
  });
});
