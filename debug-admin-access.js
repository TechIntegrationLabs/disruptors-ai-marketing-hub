/**
 * Debug Admin Access Script
 * Manually test the secret access mechanism on live site
 */

import { chromium } from 'playwright';

async function debugAdminAccess() {
    console.log('🔍 Debugging Disruptors AI Marketing Hub Admin Access...');

    const browser = await chromium.launch({
        headless: false,
        devtools: true,
        slowMo: 500
    });

    const page = await browser.newPage();

    try {
        console.log('\n📍 Step 1: Loading site...');
        await page.goto('https://disruptors-ai-marketing-hub.netlify.app');
        await page.waitForLoadState('networkidle');

        console.log('\n🔍 Step 2: Inspecting page structure...');

        // Check if the useSecretAccess hook is loaded
        const hasSecretAccess = await page.evaluate(() => {
            // Look for React components and hooks in the global space
            return window.React || window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || document.querySelector('[data-reactroot]') ? true : false;
        });

        console.log(`React components detected: ${hasSecretAccess}`);

        // Find all logo elements
        const logoElements = await page.locator('img[alt*="logo" i], img[alt*="disruptors" i], img[src*="logo"]').count();
        console.log(`Found ${logoElements} potential logo elements`);

        // Get all logo details
        const logoDetails = await page.locator('img[alt*="logo" i], img[alt*="disruptors" i], img[src*="logo"]').all();

        for (let i = 0; i < logoDetails.length; i++) {
            const logo = logoDetails[i];
            const src = await logo.getAttribute('src');
            const alt = await logo.getAttribute('alt');
            const clickable = await logo.isEnabled();
            console.log(`Logo ${i + 1}: src="${src}", alt="${alt}", clickable=${clickable}`);
        }

        console.log('\n🖱️ Step 3: Testing logo click behavior...');

        if (logoDetails.length > 0) {
            const primaryLogo = logoDetails[0];

            // Add event listener to detect clicks
            await page.evaluate(() => {
                window.clickCount = 0;
                window.clickTimes = [];

                document.addEventListener('click', (e) => {
                    if (e.target.tagName === 'IMG' && (e.target.alt?.toLowerCase().includes('disruptors') || e.target.src?.includes('logo'))) {
                        window.clickCount++;
                        window.clickTimes.push(Date.now());
                        console.log(`🖱️ Logo click detected! Count: ${window.clickCount}`);

                        // Check if useSecretAccess hook state exists
                        const reactFiber = e.target._reactInternalFiber || e.target._reactInternals;
                        if (reactFiber) {
                            console.log('🔍 React fiber found on logo element');
                        }
                    }
                });
            });

            console.log('Performing 5 rapid clicks...');

            // Perform clicks with timing
            for (let i = 0; i < 5; i++) {
                await primaryLogo.click({ force: true });
                console.log(`Click ${i + 1} completed`);
                await page.waitForTimeout(200); // 200ms between clicks (within 3s window)
            }

            // Wait and check results
            await page.waitForTimeout(2000);

            const clickResults = await page.evaluate(() => ({
                totalClicks: window.clickCount,
                clickTimes: window.clickTimes,
                timingWindow: window.clickTimes.length > 1 ?
                    window.clickTimes[window.clickTimes.length - 1] - window.clickTimes[0] : 0
            }));

            console.log(`Click results: ${clickResults.totalClicks} clicks in ${clickResults.timingWindow}ms`);

            console.log('\n🔍 Step 4: Checking for Matrix login modal...');

            // Check for various possible Matrix login selectors
            const matrixSelectors = [
                '[data-testid="matrix-login"]',
                '.matrix-login',
                'div:has-text("MATRIX")',
                'div:has-text("PASSWORD")',
                'input[type="password"]',
                'div:has-text("ADMIN")',
                'div:has-text("NEURAL")',
                '[class*="matrix"]',
                '[id*="matrix"]'
            ];

            let matrixFound = false;
            for (const selector of matrixSelectors) {
                const exists = await page.locator(selector).count() > 0;
                if (exists) {
                    console.log(`✅ Matrix element found: ${selector}`);
                    matrixFound = true;
                    break;
                } else {
                    console.log(`❌ Not found: ${selector}`);
                }
            }

            if (!matrixFound) {
                console.log('\n🔧 Step 5: Trying keyboard shortcut...');
                await page.keyboard.press('Control+Shift+KeyD');
                await page.waitForTimeout(1000);

                // Check again for Matrix modal
                for (const selector of matrixSelectors) {
                    const exists = await page.locator(selector).count() > 0;
                    if (exists) {
                        console.log(`✅ Matrix element found via keyboard: ${selector}`);
                        matrixFound = true;
                        break;
                    }
                }
            }

            if (!matrixFound) {
                console.log('\n🔍 Step 6: Inspecting React state...');

                // Try to inspect React component state
                const reactState = await page.evaluate(() => {
                    // Try to find React components with admin/secret access state
                    const reactElements = document.querySelectorAll('[data-reactroot] *');

                    for (let element of reactElements) {
                        const fiber = element._reactInternalFiber || element._reactInternals;
                        if (fiber && fiber.memoizedProps) {
                            const props = fiber.memoizedProps;
                            if (props.showMatrixLogin !== undefined ||
                                props.isAdminAuthenticated !== undefined ||
                                props.handleLogoClick !== undefined) {
                                return {
                                    showMatrixLogin: props.showMatrixLogin,
                                    isAdminAuthenticated: props.isAdminAuthenticated,
                                    clickCount: props.clickCount,
                                    isTimerActive: props.isTimerActive
                                };
                            }
                        }
                    }
                    return null;
                });

                if (reactState) {
                    console.log('🔍 React state found:', reactState);
                } else {
                    console.log('❌ Could not access React state');
                }
            }

            // Take final screenshot
            await page.screenshot({ path: 'test-screenshots/debug-admin-access.png', fullPage: true });

            if (matrixFound) {
                console.log('\n🎯 SUCCESS: Matrix login modal is accessible!');

                // Try to login
                console.log('\n🔐 Step 7: Attempting login...');
                const passwordInput = page.locator('input[type="password"]').first();
                await passwordInput.fill('DMadmin');

                const loginButton = page.locator('button:has-text("LOGIN"), button:has-text("ENTER"), button[type="submit"]').first();
                await loginButton.click();

                await page.waitForTimeout(3000);

                // Check for admin interface
                const adminInterfaceVisible = await page.locator('text="Neural Media Generator", text="AI Media Generator"').isVisible().catch(() => false);

                if (adminInterfaceVisible) {
                    console.log('🎉 SUCCESS: Admin interface is fully functional!');

                    // Test AI generation
                    console.log('\n🤖 Step 8: Testing AI generation...');

                    const promptInput = page.locator('textarea, input[placeholder*="describe"]').first();
                    await promptInput.fill('professional corporate office space with modern design');

                    const generateButton = page.locator('button:has-text("Generate")').first();
                    await generateButton.click();

                    console.log('⏳ Generation started, monitoring for 30 seconds...');

                    let hasResult = false;
                    for (let i = 0; i < 15; i++) {
                        await page.waitForTimeout(2000);
                        const imageCount = await page.locator('img[src*="blob:"], img[src*="https://"]').count();
                        if (imageCount > 0) {
                            hasResult = true;
                            console.log(`✅ AI generation successful! ${imageCount} image(s) generated`);
                            break;
                        }
                    }

                    if (!hasResult) {
                        console.log('❌ No images generated after 30 seconds');
                    }

                    await page.screenshot({ path: 'test-screenshots/ai-generation-result.png', fullPage: true });

                } else {
                    console.log('❌ Admin interface did not load after login');
                }

            } else {
                console.log('\n❌ ISSUE: Matrix login modal not triggered');
                console.log('This suggests the useSecretAccess hook may not be working properly.');
            }

        } else {
            console.log('❌ No logo elements found');
        }

    } catch (error) {
        console.error('❌ Debug failed:', error);
    } finally {
        console.log('\n🔍 Debug session complete. Check test-screenshots/ for visual evidence.');

        // Keep browser open for manual inspection
        console.log('Browser left open for manual testing. Close when done.');
        // await browser.close();
    }
}

debugAdminAccess();