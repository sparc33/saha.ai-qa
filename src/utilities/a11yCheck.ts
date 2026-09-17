import { Page, TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Generic WCAG accessibility scan — works against whatever page is currently loaded,
// regardless of surface. Closes the "no accessibility-testing capability" gap flagged
// in INTEGRATION.md §6 (real NFR-019 requirement, not speculative). VAN-13 (Accessible
// Intake Interface) is the feature this exists to validate once its own bounds are
// actually written — this utility doesn't assert VAN-13's specific undefined criteria
// ("plain language", "large text", "staff-assisted mode"), it only checks WCAG 2.1 AA
// conformance, which is necessary but not sufficient for that story.
export async function assertNoAccessibilityViolations(
  page: Page,
  testInfo: TestInfo,
  tags: string[] = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(tags).analyze();

  if (results.violations.length > 0) {
    await testInfo.attach('accessibility-violations', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });
    const summary = results.violations
      .map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)`)
      .join('; ');
    throw new Error(`${results.violations.length} accessibility violation(s) found: ${summary}`);
  }
}
