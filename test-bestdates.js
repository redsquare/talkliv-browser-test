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
        `Mozilla/5.0 (${rand(linuxDistros)}; rv:${rand(firefoxVersions)}) Gecko/20101 Firefox/${rand(firefoxVersions)}`,

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

    // Generate random birth date (age 18-60)
    const currentYear = 2026;
    const minYear = currentYear - 60; // 1966
    const maxYear = currentYear - 18; // 2008
    const birthYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
    const birthMonth = Math.floor(Math.random() * 12) + 1; // 1-12
    const birthDay = Math.floor(Math.random() * 28) + 1; // 1-28 (safe for all months)

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
        console.log(`Starting registration for Bestdates: ${email}`);

        // 2. Navigate to site
        await page.goto('https://bestdates.com/', {
            waitUntil: 'load',
            timeout: 60000 // Increase timeout to 60 seconds
        });
        console.log("Page loaded successfully");

        // 3. Handle cookie/privacy consent popup
        console.log("Checking for privacy popup...");
        await page.waitForTimeout(3000); // Wait longer for popup to appear

        // Try various common privacy popup button patterns with more specific Bestdates selectors
        const privacySelectors = [
            '.cookie-popup__btn',
            '.cookie-popup button',
            'button:has-text("Accept all")',
            'button:has-text("Accept")',
            'button:has-text("OK, get it")',
            'button:has-text("I Accept")',
            'button:has-text("OK")',
            'button:has-text("Allow")',
            'button:has-text("Allow all")',
            'button:has-text("Agree & close")',
            'button:has-text("Agree")',
            'button:has-text("Got it")',
            'button:has-text("Continue")',
            '[class*="cookie"] button',
            '[class*="consent"] button',
            '[class*="privacy"] button',
            '[id*="cookie"] button',
            '[id*="consent"] button',
            'button[class*="accept"]',
            'button[class*="agree"]'
        ];

        let cookieHandled = false;
        for (const selector of privacySelectors) {
            try {
                const btn = page.locator(selector).first();
                if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
                    console.log(`Found privacy popup, clicking: ${selector}`);
                    await btn.click({ force: true });
                    await page.waitForTimeout(1000);
                    cookieHandled = true;
                    break;
                }
            } catch (e) {
                // Continue to next selector
            }
        }

        if (!cookieHandled) {
            console.log("No cookie popup detected or it may have already been accepted");
        }

        // 4. Scroll to form if needed
        await page.waitForTimeout(2000);
        const formElement = page.locator('.regform').first();
        if (await formElement.isVisible({ timeout: 2000 }).catch(() => false)) {
            await formElement.scrollIntoViewIfNeeded();
            await page.waitForTimeout(500);
        }

        // 5. Fill registration form

        // Select gender preference (using test id)
        console.log("Selecting gender preference...");
        const genderOptions = [
            'male,female',  // I am a man looking for a woman
            'male,male',    // I am a man looking for a man
            'male,all',     // I am a man looking for everyone
            'female,male',  // I am a woman looking for a man
            'female,female',// I am a woman looking for a woman
            'female,all'    // I am a woman looking for everyone
        ];
        const randomGenderOption = genderOptions[Math.floor(Math.random() * genderOptions.length)];
        await page.getByTestId('gender').selectOption(randomGenderOption);
        console.log(`Selected gender option: ${randomGenderOption}`);

        // Fill Name
        console.log("Filling name...");
        await page.getByTestId('firstname').fill(firstName);
        console.log(`Filled name: ${firstName}`);

        // Fill Birthday (month, day, year dropdowns)
        console.log("Filling birthday...");
        await page.getByTestId('month').selectOption(birthMonth.toString());
        await page.getByTestId('day').selectOption(birthDay.toString());
        await page.getByTestId('year').selectOption(birthYear.toString());
        console.log(`Filled birthday: ${birthMonth}/${birthDay}/${birthYear}`);

        // Fill Email
        console.log("Filling email...");
        await page.getByTestId('email').fill(email);
        console.log(`Filled email: ${email}`);

        // Fill Password
        console.log("Filling password...");
        await page.getByTestId('password').fill(password);
        console.log(`Filled password`);

        // Check the terms checkbox
        console.log("Checking terms checkbox...");
        await page.waitForTimeout(1000);

        // The checkbox is visually hidden, so we must click the label
        const termsLabel = page.locator('label[for="terms-agree"]');
        await termsLabel.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);

        // Try clicking the label multiple times if needed
        for (let i = 0; i < 3; i++) {
            await termsLabel.click({ force: true });
            await page.waitForTimeout(300);

            // Check if it's now checked
            const isChecked = await page.locator('#terms-agree').isChecked().catch(() => false);
            console.log(`Attempt ${i + 1}: Checkbox checked status: ${isChecked}`);

            if (isChecked) {
                console.log("Successfully checked terms checkbox");
                break;
            }

            if (i === 2) {
                console.log("Warning: Checkbox may not be checked after 3 attempts");
            }
        }

        await page.waitForTimeout(1000);

        // Final verification
        const isFinallyChecked = await page.locator('#terms-agree').isChecked().catch(() => false);
        console.log(`Terms checkbox final status: ${isFinallyChecked}`);

        // Check for any visible error messages before submitting
        const errorTexts = await page.locator('.error-text').all();
        let visibleErrors = 0;
        for (const error of errorTexts) {
            const isVisible = await error.isVisible().catch(() => false);
            if (isVisible) {
                const text = await error.textContent().catch(() => '');
                console.log(`Warning: Visible error message: "${text.trim()}"`);
                visibleErrors++;
            }
        }
        console.log(`Total visible errors: ${visibleErrors}`);

        // 6. Submit the form
        console.log("Submitting registration form...");

        // Take screenshot before submission
        await page.screenshot({ path: './recordings/bestdates-before-submit.png' });
        console.log("Screenshot saved before submission");

        const registerButton = page.locator('button.btn_regform, button:has-text("Register")').first();

        if (await registerButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            const btnText = await registerButton.textContent().catch(() => '');
            const isEnabled = await registerButton.isEnabled().catch(() => false);
            console.log(`Register button: "${btnText.trim()}" - Enabled: ${isEnabled}`);

            // Scroll to button
            await registerButton.scrollIntoViewIfNeeded();
            await page.waitForTimeout(500);

            // Click with force if needed
            const initialUrl = page.url();
            console.log(`Before click - URL: ${initialUrl}`);

            await registerButton.click({ force: true });
            console.log("Clicked register button, waiting to see what happens...");

            // Wait and observe what happens
            await page.waitForTimeout(2000);

            // Check if URL changed (navigation)
            let currentUrl = page.url();
            console.log(`2 seconds after click - URL: ${currentUrl}`);

            if (currentUrl !== initialUrl) {
                console.log("✓ Page navigated to new URL");
            } else {
                console.log("⚠ Still on same page, checking for changes...");

                // Check for any error messages that appeared
                const newErrors = await page.locator('.error-text').all();
                for (const error of newErrors) {
                    const isVisible = await error.isVisible().catch(() => false);
                    if (isVisible) {
                        const text = await error.textContent().catch(() => '');
                        console.log(`⚠ Error message appeared: "${text.trim()}"`);
                    }
                }

                // Check for success messages
                const successSelectors = [
                    '[class*="success"]',
                    '[class*="confirm"]',
                    '[class*="thankyou"]',
                    'text="success"',
                    'text="thank you"',
                    'text="check your email"'
                ];

                for (const selector of successSelectors) {
                    const elem = page.locator(selector).first();
                    if (await elem.isVisible({ timeout: 500 }).catch(() => false)) {
                        const text = await elem.textContent().catch(() => '');
                        console.log(`✓ Success indicator found: "${text.trim().substring(0, 50)}"`);
                    }
                }
            }

            // Continue waiting and monitoring
            await page.waitForTimeout(3000);
            currentUrl = page.url();
            console.log(`5 seconds after click - URL: ${currentUrl}`);

            // Take screenshot after submission
            await page.screenshot({ path: './recordings/bestdates-after-submit.png' });
            console.log("Screenshot saved after submission");

            // Wait a bit more to see if there's a delayed navigation
            await page.waitForTimeout(5000);
            currentUrl = page.url();
            console.log(`10 seconds after click - Final URL: ${currentUrl}`);

            // Take final screenshot
            await page.screenshot({ path: './recordings/bestdates-final-state.png' });
            console.log("Final screenshot saved");

        } else {
            console.log("Register button not found - checking for alternative submission methods...");

            // Try submitting the form directly
            const form = page.locator('form').first();
            if (await form.isVisible({ timeout: 1000 }).catch(() => false)) {
                console.log("Attempting form submission...");
                await form.evaluate(f => f.submit());
                await page.waitForTimeout(5000);
            }
        }

        // 7. Handle any post-registration steps or onboarding
        console.log("Checking for post-registration steps...");
        await page.waitForTimeout(3000);

        // Common button patterns for profile creation/onboarding flows
        const nextStepSelectors = [
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
            '[data-testid*="next"]',
            '[data-testid*="skip"]',
            '[data-testid*="continue"]',
            '.btn-primary',
            '.btn-next'
        ];

        // Click through up to 10 onboarding screens
        for (let i = 0; i < 10; i++) {
            await page.waitForTimeout(2000);

            // Debug: list all visible buttons on first iteration
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
            for (const selector of nextStepSelectors) {
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
                console.log(`No more onboarding steps found after ${i} steps`);
                break;
            }
        }

        // Take a final screenshot
        await page.screenshot({ path: './recordings/bestdates-final.png' });
        console.log(`Final screenshot saved`);

        console.log(`Successfully completed registration for ${firstName} on Bestdates.`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

    } catch (error) {
        console.error("Script execution failed:", error);

        // Take error screenshot
        try {
            await page.screenshot({ path: './recordings/bestdates-error.png' });
            console.log(`Error screenshot saved`);
        } catch (e) {
            // Ignore screenshot errors
        }
    } finally {
        // Wait longer before closing so you can see what happened
        console.log("\n=== Keeping browser open for 10 seconds for inspection ===");
        await page.waitForTimeout(10000);

        // Save video path
        const videoPath = await page.video()?.path();
        if (videoPath) {
            console.log(`Video saved to: ${videoPath}`);
        }

        console.log("Closing browser...");
        await context.close();
        await browser.close();
    }
})();
