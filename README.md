# Browser Automation Tests

Automated browser tests using Playwright for testing registration flows on multiple platforms.

## Prerequisites

- Node.js (v16 or higher)

## Installation

```bash
npm install
```

This will install dependencies and automatically download the Chromium browser needed for testing.

## Running the Tests

### Talkliv Test

```bash
npm test
```

### Bestdates Test

```bash
npm run test:bestdates
```

## What the Tests Do

Both tests will:

1. Launch a Chromium browser (visible by default)
2. Navigate to the target site
3. Generate random user credentials
4. Complete the registration flow
5. Handle cookie/privacy consent popups
6. Navigate through onboarding steps
7. Record video of the session

### Talkliv Test (`test.js`)

- Tests registration flow on talkliv.com
- Handles gender selection, birthday, email/password
- Navigates multi-step profile creation

### Bestdates Test (`test-bestdates.js`)

- Tests registration flow on bestdates.com
- Handles gender preference dropdown, name, birthday (separate fields), email/password
- Uses data-testid selectors for reliable form interaction

## Configuration

- Set `headless: true` in the test files to run without showing the browser
- Adjust `waitForTimeout` values to change timing between steps
- Videos are saved to `./recordings/` directory

## Notes

- Each run generates unique credentials using random IDs
- Random user agents are generated to simulate real browsers
- Birth dates are randomly generated (age 18-60)
- The browser stays open for 3 seconds after completion for inspection
- Screenshots are saved for debugging purposes
