// Single import point for spec files that need the authenticated clinician-dashboard-ui page:
//   import { test, expect } from '../../src/fixtures';
// patient-chat-ui specs that don't need auth can import Playwright's own base test directly
// instead of this one.
export { test, expect } from './auth.fixture';
