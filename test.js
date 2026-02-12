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
  const email = `scum_bags_${randomId}@mail7.io`; 
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
    await page.waitForTimeout(2000);
    
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill(email);
      console.log(`Filled email: ${email}`);
      
      await page.fill('input[type="password"]', password);
      console.log(`Filled password`);
      
      // Click submit/continue button - try multiple selectors
      const submitSelectors = [
        'button:has-text("Create account")',
        'button:has-text("Sign up")',
        'button:has-text("Complete")',
        'button:has-text("Join")',
        'button:has-text("Continue")',
        'button[type="submit"]',
        'form button'
      ];
      
      for (const selector of submitSelectors) {
        const btn = page.locator(selector).first();
        if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
          console.log(`Clicking submit button: ${selector}`);
          await btn.click();
          break;
        }
      }
    }

    // 7. Handle any onboarding steps
    console.log("Navigating onboarding steps...");
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(1500);
      const nextBtn = page.locator('button:has-text("Next"), button:has-text("Skip"), button:has-text("Continue")').first();
      if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nextBtn.click();
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