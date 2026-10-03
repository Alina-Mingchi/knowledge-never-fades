# Lavender workflow update

## What will change
- Shift the existing dark glass look from cyan to a richer lavender and purple palette while preserving contrast, glass surfaces, and motion.
- Add Chinese (Simplified, `zh-CN`) to the language picker and provide Chinese copy for Capture, Map, and Teach.
- Add a three-way Capture source selector:
  1. Open the current invoice demo.
  2. Upload a tutorial video and show the selected file ready for analysis.
  3. Start or stop real browser screen sharing, with a live preview when permission is granted.
- After confirming the Map teach-back, ask for a tutor name before creating it. Store created tutor names in the browser so they are available on Teach.
- Add a tutor selector to Teach, including a built-in default when no custom tutor has been created.
- Make vendor and amount editable in Teach. Keep the €10,000 guardrail tied to the entered amount and clear stale save warnings when inputs change.
- Add a Finish tutorial action and a completed summary state.

## Validation
- Add focused tests for the €10,000 threshold and tutor-name storage behavior.
- Verify the full flow in the preview: choose Chinese, switch Capture sources, name a tutor, select it in Teach, edit vendor and amount, trigger the guardrail, and finish the tutorial.
- Check desktop and mobile layouts and confirm all pages still load without errors.

## Technical details
- Keep this as a frontend MVP using browser storage; no account or database setup is required.
- Use the browser MediaDevices API for screen sharing and stop all capture tracks when the user ends sharing or leaves the page.
- Centralize tutor persistence and guardrail logic in small shared modules so the behavior is testable and consistent.
