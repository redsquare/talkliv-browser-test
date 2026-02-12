const { chromium } = require('playwright');
const crypto = require('crypto');

// Generate a random user agent to avoid detection
function generateRandomUserAgent() {
  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Chrome versions (recent)
  const chromeVersions = ['120.0.0.0', '121.0.0.0', '122.0.0.0', '123.0.0.0', '124.0.0.0', '125.0.0.0', '126.0.0.0', '127.0.0.0', '128.0.0.0'];

  // Firefox versions (recent)
  const firefoxVersions = ['121.0', '122.0', '123.0', '124.0', '125.0', '126.0', '127.0', '128.0'];

  // Edge versions
  const edgeVersions = ['120.0.0.0', '121.0.0.0', '122.0.0.0', '123.0.0.0', '124.0.0.0', '125.0.0.0'];

  // Safari versions
  const safariVersions = ['17.0', '17.1', '17.2', '17.3', '17.4', '16.6'];
  const webkitVersions = ['605.1.15', '537.36'];

  // OS versions
  const winVersions = ['10.0', '11.0'];
  const winBuilds = ['19041', '19042', '19043', '19044', '19045', '22000', '22621', '22631'];
  const macVersions = ['10_15_7', '11_0', '11_6', '12_0', '12_6', '13_0', '13_6', '14_0', '14_2', '14_3'];
  const linuxDistros = ['X11; Linux x86_64', 'X11; Ubuntu; Linux x86_64', 'X11; Fedora; Linux x86_64'];

  const userAgents = [
    // Chrome on Windows
    `Mozilla/5.0 (Windows NT ${rand(winVersions)}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${rand(chromeVersions)} Safari/537.36`,
    `Mozilla/5.0 (Windows NT ${rand(winVersions)}; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${rand(chromeVersions)} Safari/537.36`,

    // Chrome on Mac
    `Mozilla/5.0 (Macintosh; Intel Mac OS X ${rand(macVersions)}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${rand(chromeVersions)} Safari/537.36`,

    // Chrome on Linux
    `Mozilla/5.0 (${rand(linuxDistros)}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${rand(chromeVersions)} Safari/537.36`,

    // Firefox on Windows
    `Mozilla/5.0 (Windows NT ${rand(winVersions)}; Win64; x64; rv:${rand(firefoxVersions)}) Gecko/20100101 Firefox/${rand(firefoxVersions)}`,

    // Firefox on Mac
    `Mozilla/5.0 (Macintosh; Intel Mac OS X ${rand(macVersions)}; rv:${rand(firefoxVersions)}) Gecko/20100101 Firefox/${rand(firefoxVersions)}`,

    // Firefox on Linux
    `Mozilla/5.0 (${rand(linuxDistros)}; rv:${rand(firefoxVersions)}) Gecko/20100101 Firefox/${rand(firefoxVersions)}`,

    // Edge on Windows
    `Mozilla/5.0 (Windows NT ${rand(winVersions)}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${rand(chromeVersions)} Safari/537.36 Edg/${rand(edgeVersions)}`,

    // Safari on Mac
    `Mozilla/5.0 (Macintosh; Intel Mac OS X ${rand(macVersions)}) AppleWebKit/${rand(webkitVersions)} (KHTML, like Gecko) Version/${rand(safariVersions)} Safari/${rand(webkitVersions)}`,

    // Opera on Windows
    `Mozilla/5.0 (Windows NT ${rand(winVersions)}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${rand(chromeVersions)} Safari/537.36 OPR/${randInt(100, 110)}.0.0.0`,

    // Brave on Windows/Mac (looks like Chrome)
    `Mozilla/5.0 (Windows NT ${rand(winVersions)}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${rand(chromeVersions)} Safari/537.36`,
    `Mozilla/5.0 (Macintosh; Intel Mac OS X ${rand(macVersions)}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${rand(chromeVersions)} Safari/537.36`,
  ];

  return rand(userAgents);
}

(async () => {
  // 1. Generate Random Identity Data
  const randomId = crypto.randomBytes(4).toString('hex');

  // Generate random name with only letters (A-Z, a-z)
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Cameron', 'Dakota', 'Skyler', 'Jamie', 'Reese', 'Finley', 'Rowan', 'Charlie', 'Emery', 'Phoenix', 'Blake', 'Drew', 'Hayden', 'Kendall', 'Logan', 'Parker', 'Sage', 'Tatum', 'Peyton', 'Remy', 'Ellis', 'Marlowe'];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];

  const lastName = `Test`;
  // Using a common burner domain pattern; replace with a real API for production
  const email = `${firstName.toLowerCase()}_${randomId}@mail7.io`;
  const password = `Pass_${randomId}!2026`;
  const userAgent = generateRandomUserAgent();

  console.log(`Using User-Agent: ${userAgent}`);

  const browser = await chromium.launch({ headless: false }); // Set to true for background run
  const context = await browser.newContext({
    userAgent: userAgent,
    viewport: { width: 1920, height: 1080 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
    recordVideo: {
      dir: './recordings/',
      size: { width: 1920, height: 1080 }
    }
  });
  const page = await context.newPage();

  try {
    console.log(`Starting registration for: ${email}`);

    // 2. Navigate to site
    await page.goto('https://talkliv.com/', { waitUntil: 'domcontentloaded' });

    // 3. Handle cookie/privacy consent popup
    console.log("Checking for privacy popup...");
    await page.waitForTimeout(1000);

    // Try various common privacy popup button patterns
    const privacySelectors = [
      'button:has-text("Accept all")',
      'button:has-text("Accept")',
      'button:has-text("I Accept")',
      'button:has-text("OK")',
      'button:has-text("Allow")',
      'button:has-text("Allow all")',
      'button:has-text("Agree")',
      'button:has-text("Got it")',
      'button:has-text("Continue")',
      '[class*="cookie"] button',
      '[class*="consent"] button',
      '[class*="privacy"] button',
      '[id*="cookie"] button',
      '[id*="consent"] button'
    ];

    for (const selector of privacySelectors) {
      try {
        const btn = page.locator(selector).first();
        if (await btn.isVisible({ timeout: 500 }).catch(() => false)) {
          console.log(`Found privacy popup, clicking: ${selector}`);
          await btn.click();
          await page.waitForTimeout(500);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    // 4. Fill registration form (all on one page)
    // Select your gender (I am Male)
    await page.getByTestId('gender-male').click();

    // Select gender preference (Looking for Female)
    await page.getByTestId('option-female').click();

    // Fill Name (placeholder is "e.g Alex")
    await page.getByPlaceholder('e.g Alex').fill(firstName);

    // Fill Birthday (format MM/DD/YYYY)
    await page.getByPlaceholder('MM/DD/YYYY').fill('05/15/1998');

    // Check the terms checkbox by clicking its label
    await page.locator('label[for="terms-agree"]').click();

    // 5. Submit Initial Form
    await page.getByRole('button', { name: 'Get started' }).click();
    console.log("Submitted initial form, waiting for next step...");

    // 6. Wait for and handle email/password step
    await page.waitForTimeout(5000); // Wait for next screen to load

    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill(email);
      console.log(`Filled email: ${email}`);

      const passwordInput = page.locator('input[type="password"]');
      await passwordInput.fill(password);
      console.log(`Filled password`);

      // Log the form we're working with
      const form = page.locator('form').filter({ has: emailInput });
      const formButtons = await form.locator('button').all();
      console.log(`Found ${formButtons.length} buttons in form`);
      for (const btn of formButtons) {
        const text = await btn.textContent().catch(() => '');
        console.log(`  Form button: "${text.trim()}"`);
      }

      // Click submit button within the form containing email input
      const submitBtn = form.locator('button[type="submit"], button:has-text("Sign up"), button:has-text("Create")').first();
      if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        const btnText = await submitBtn.textContent().catch(() => '');
        console.log(`Clicking form submit: "${btnText.trim()}"`);

        // Use force click and dispatch click event
        await submitBtn.click({ force: true });

        // Also try JavaScript click as backup
        await submitBtn.evaluate(node => node.click()).catch(() => { });

        // Wait for page changes
        await page.waitForTimeout(5000);

        // Check if we navigated or if there's a new screen
        const currentUrl = page.url();
        console.log(`After submit - URL: ${currentUrl}`);

        // Check for any modal or overlay that appeared
        const overlaySelectors = [
          '[class*="modal"]',
          '[class*="popup"]',
          '[class*="overlay"]',
          '[class*="dialog"]',
          '[role="dialog"]'
        ];

        for (const sel of overlaySelectors) {
          const overlay = page.locator(sel).first();
          if (await overlay.isVisible({ timeout: 500 }).catch(() => false)) {
            console.log(`Found overlay: ${sel}`);

            // Try to click Accept/OK button in overlay
            const acceptBtn = overlay.locator('button:has-text("Accept all"), button:has-text("Accept"), button:has-text("OK"), button:has-text("Continue")').first();
            if (await acceptBtn.isVisible({ timeout: 500 }).catch(() => false)) {
              const btnText = await acceptBtn.textContent().catch(() => '');
              console.log(`Clicking overlay accept: "${btnText.trim()}"`);
              await acceptBtn.click();
              await page.waitForTimeout(2000);

              // Now try clicking the sign up button again
              if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
                console.log("Retrying form submit after closing overlay...");
                await submitBtn.click({ force: true });
                await page.waitForTimeout(3000);
              }
            }
            break;
          }
        }

        // Take a screenshot of current state for debugging
        await page.screenshot({ path: './recordings/debug-after-signup.png' });
        console.log(`Debug screenshot saved`);

      } else {
        // Fallback: click any visible submit-like button
        const fallbackSelectors = [
          'button:has-text("Create account")',
          'button:has-text("Sign up")',
          'button:has-text("Complete")',
          'button:has-text("Join")',
          'button:has-text("Continue")',
          'button[type="submit"]'
        ];

        for (const selector of fallbackSelectors) {
          const btn = page.locator(selector).first();
          if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
            const btnText = await btn.textContent().catch(() => selector);
            console.log(`Clicking fallback button: "${btnText.trim()}"`);
            await btn.click();
            break;
          }
        }
      }

      console.log("Waiting for account creation...");
      await page.waitForTimeout(3000);

      // Check current URL
      const currentUrl = page.url();
      console.log(`Current URL: ${currentUrl}`);

      await page.waitForTimeout(3000);
    } else {
      console.log("Email input not visible - checking for other flows...");

      // Maybe there's a different flow - log what's visible
      const allInputs = await page.locator('input').all();
      console.log(`Found ${allInputs.length} inputs on page`);
      for (const inp of allInputs.slice(0, 5)) {
        const type = await inp.getAttribute('type').catch(() => '');
        const placeholder = await inp.getAttribute('placeholder').catch(() => '');
        const visible = await inp.isVisible().catch(() => false);
        if (visible) {
          console.log(`  Input: type="${type}" placeholder="${placeholder}"`);
        }
      }
    }

    // 7. Handle profile creation / onboarding steps
    console.log("Navigating profile creation steps...");
    await page.waitForTimeout(3000); // Extra wait for profile page to load

    // Common button patterns for profile creation flows
    const profileButtonSelectors = [
      'button:has-text("Next")',
      'button:has-text("Skip")',
      'button:has-text("Continue")',
      'button:has-text("Save")',
      'button:has-text("Done")',
      'button:has-text("Finish")',
      'button:has-text("Complete")',
      'button:has-text("Let\'s go")',
      'button:has-text("Start")',
      'button:has-text("Get started")',
      'button:has-text("OK")',
      'button:has-text("Got it")',
      'button:has-text("Upload")',
      'button:has-text("Add")',
      'button:has-text("Set")',
      '[data-testid*="next"]',
      '[data-testid*="skip"]',
      '[data-testid*="continue"]',
      '.btn-primary',
      '.btn-next',
      '.next-btn'
    ];

    // Click through up to 15 screens
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(2000);

      // Debug: list all visible buttons
      if (i === 0) {
        const allButtons = await page.locator('button').all();
        console.log(`Found ${allButtons.length} buttons on page`);
        for (const btn of allButtons.slice(0, 5)) {
          const text = await btn.textContent().catch(() => '');
          const visible = await btn.isVisible().catch(() => false);
          if (visible && text.trim()) {
            console.log(`  Button: "${text.trim().substring(0, 30)}"`);
          }
        }
      }

      let clicked = false;
      for (const selector of profileButtonSelectors) {
        try {
          const btn = page.locator(selector).first();
          if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
            const btnText = await btn.textContent().catch(() => selector);
            console.log(`Step ${i + 1}: Clicking "${btnText.trim()}"`);
            await btn.click();
            clicked = true;
            await page.waitForTimeout(1000);
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }

      if (!clicked) {
        console.log(`No more profile steps found after ${i} steps`);
        break;
      }
    }

    console.log(`Successfully created profile for ${firstName}. Check ${email} for verification.`);

  } catch (error) {
    console.error("Script execution failed:", error);
  } finally {
    // Brief pause before closing
    await page.waitForTimeout(3000);

    // Save video path
    const videoPath = await page.video()?.path();
    if (videoPath) {
      console.log(`Video saved to: ${videoPath}`);
    }

    await context.close();
    await browser.close();
  }
})();