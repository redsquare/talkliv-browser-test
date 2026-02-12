const { chromium } = require('playwright');
const crypto = require('crypto');

// Generate a random user agent to avoid detection
function generateRandomUserAgent() {
  const chromeVersions = ['120.0.0.0', '121.0.0.0', '122.0.0.0', '123.0.0.0', '124.0.0.0', '125.0.0.0'];
  const winVersions = ['10.0', '11.0'];
  const macVersions = ['10_15_7', '11_0', '12_0', '13_0', '14_0'];
  
  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const chromeVersion = rand(chromeVersions);
  
  const platforms = [
    `Mozilla/5.0 (Windows NT ${rand(winVersions)}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`,
    `Mozilla/5.0 (Macintosh; Intel Mac OS X ${rand(macVersions)}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`,
    `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`
  ];
  
  return rand(platforms);
}

(async () => {
  // 1. Generate Random Identity Data
  const randomId = crypto.randomBytes(4).toString('hex');
  const firstName = `User_${randomId}`;
  const lastName = `Test`;
  // Using a common burner domain pattern; replace with a real API for production
  const email = `tester_${randomId}@mail7.io`; 
  const password = `Pass_${randomId}!2026`;
  const userAgent = generateRandomUserAgent();

  console.log(`Using User-Agent: ${userAgent}`);
  
  const browser = await chromium.launch({ headless: false }); // Set to true for background run
  const context = await browser.newContext({
    userAgent: userAgent,
    viewport: { width: 1920, height: 1080 },
    locale: 'en-US',
    timezoneId: 'America/New_York'
  });
  const page = await context.newPage();

  try {
    console.log(`Starting registration for: ${email}`);
    
    // 2. Navigate to site
    await page.goto('https://talkliv.com/', { waitUntil: 'domcontentloaded' });
    
    // 3. Handle cookie consent popup
    const acceptCookies = page.getByRole('button', { name: 'Accept all' });
    if (await acceptCookies.isVisible({ timeout: 3000 }).catch(() => false)) {
      await acceptCookies.click();
      await page.waitForTimeout(500);
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
    
    // Check the terms checkbox by clicking its label (hidden checkbox pattern)
    await page.locator('label:has-text("I have read")').click();

    // 5. Submit Initial Form
    await page.getByRole('button', { name: 'Get started' }).click();
    console.log("Submitted initial form, waiting for next step...");

    // 6. Wait for and handle email/password step
    await page.waitForTimeout(2000);
    
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill(email);
      await page.fill('input[type="password"]', password);
      
      // Click submit/continue button
      const submitBtn = page.getByRole('button', { name: /Complete|Join|Continue|Sign up/i });
      if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await submitBtn.click();
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
    // Keep open for manual inspection
    await page.waitForTimeout(10000);
    await browser.close();
  }
})();