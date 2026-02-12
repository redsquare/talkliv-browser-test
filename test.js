const { chromium } = require('playwright');
const crypto = require('crypto');

(async () => {
  // 1. Generate Random Identity Data
  const randomId = crypto.randomBytes(4).toString('hex');
  const firstName = `User_${randomId}`;
  const lastName = `Test`;
  // Using a common burner domain pattern; replace with a real API for production
  const email = `tester_${randomId}@mail7.io`; 
  const password = `Pass_${randomId}!2026`;

  const browser = await chromium.launch({ headless: false }); // Set to true for background run
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    console.log(`Starting registration for: ${email}`);
    
    // 2. Navigate and Handle Cookies (if any)
    await page.goto('https://talkliv.com/', { waitUntil: 'domcontentloaded' });
    
    // 3. Step-by-Step Profile Creation
    // Selecting Gender (Male/Female)
    await page.locator('label').filter({ hasText: 'Male' }).click();
    await page.locator('label').filter({ hasText: 'Female' }).click(); // Target preference

    // Fill Name
    await page.getByPlaceholder('Name').fill(firstName);

    // Birthday Selection 
    // Most dating sites use custom pickers; this targets the standard input flow
    const birthdayInput = page.locator('input[name="birthday"], .birthday-picker');
    if (await birthdayInput.isVisible()) {
        await birthdayInput.fill('1998-05-15');
    }

    // 4. Submit Initial Form
    await page.getByRole('button', { name: /Get started|Next|Sign Up/i }).click();

    // 5. Credentials Step
    await page.waitForSelector('input[type="email"]');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);

    // Click Final Register
    await page.getByRole('button', { name: /Complete|Join/i }).click();

    // 6. The "Profile Quiz" Loop
    // This part clicks "Next" or "Skip" until the dashboard is reached
    console.log("Navigating onboarding steps...");
    for (let i = 0; i < 5; i++) {
        const nextBtn = page.locator('button:has-text("Next"), button:has-text("Skip")');
        if (await nextBtn.isVisible()) {
            await nextBtn.click();
            await page.waitForTimeout(1500); // Wait for animation
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