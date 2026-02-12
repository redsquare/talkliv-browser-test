# Talkliv Browser Automation Test

Automated browser test using Playwright for testing registration flow.

## Prerequisites

- Node.js (v16 or higher)

## Installation

```bash
npm install
```

This will install dependencies and automatically download the Chromium browser needed for testing.

## Running the Test

```bash
npm test
```

The test will:
1. Launch a Chromium browser (visible by default)
2. Navigate to the target site
3. Generate random user credentials
4. Complete the registration flow
5. Navigate through onboarding steps

## Configuration

- Set `headless: true` in test.js to run without showing the browser
- Adjust `waitForTimeout` values to change timing between steps

## Notes

- Each run generates unique credentials using random IDs
- The browser stays open for 10 seconds after completion for inspection
