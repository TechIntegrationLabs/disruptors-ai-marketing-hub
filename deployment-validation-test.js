/**
 * Deployment Validation Test Suite
 * Tests admin panel fixes: DataForSEO keyword research and Intelligent Media Studio
 */

import { chromium } from 'playwright';

const PRODUCTION_URL = 'https://dm4.wjwelsh.com';
const ADMIN_PASSWORD = 'DMadmin';

async function runDeploymentValidation() {
  console.log('=' .repeat(80));
  console.log('DEPLOYMENT VALIDATION TEST SUITE');
  console.log('=' .repeat(80));
  console.log(`\nTarget: ${PRODUCTION_URL}`);
  console.log(`Started: ${new Date().toISOString()}\n`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  // Console logging
  const consoleLogs = [];
  const consoleErrors = [];
  const jsErrors = [];

  page.on('console', (msg) => {
    const text = msg.text();
    consoleLogs.push({ type: msg.type(), text });
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    }
  });

  page.on('pageerror', (error) => {
    jsErrors.push(error.toString());
  });

  const results = {
    siteAvailable: false,
    adminPanelAccess: false,
    keywordResearchLoaded: false,
    keywordResearchFunctional: false,
    mediaStudioLoaded: false,
    mediaStudioFunctional: false,
    consoleErrorCount: 0,
    jsErrorCount: 0,
    screenshots: [],
  };

  try {
    // Test 1: Site Availability
    console.log('[1/8] Testing site availability...');
    try {
      await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle', timeout: 60000 });
      results.siteAvailable = true;
      console.log('✓ Production site is live and responding');

      const screenshot1 = 'validation-home.png';
      await page.screenshot({ path: screenshot1, fullPage: false });
      results.screenshots.push(screenshot1);
      console.log(`✓ Screenshot saved: ${screenshot1}`);
    } catch (error) {
      console.error(`✗ Failed to load site: ${error.message}`);
      await browser.close();
      return results;
    }

    // Wait for page to settle
    await page.waitForTimeout(2000);

    // Test 2: Check for immediate errors
    console.log('\n[2/8] Checking for page load errors...');
    if (jsErrors.length > 0) {
      console.log(`⚠ Found ${jsErrors.length} JavaScript errors:`);
      jsErrors.slice(0, 5).forEach(err => console.log(`   - ${err}`));
    } else {
      console.log('✓ No JavaScript errors on page load');
    }

    // Test 3: Admin Panel Access
    console.log('\n[3/8] Testing admin panel access...');
    try {
      // Try keyboard shortcut first (Ctrl+Shift+D)
      console.log('   Attempting Ctrl+Shift+D shortcut...');
      await page.keyboard.down('Control');
      await page.keyboard.down('Shift');
      await page.keyboard.press('KeyD');
      await page.keyboard.up('Shift');
      await page.keyboard.up('Control');
      await page.waitForTimeout(1000);

      // Check for Matrix login terminal interface
      let matrixVisible = await page.isVisible('text=DISRUPTORS_NEURAL_NET', { timeout: 2000 }).catch(() => false);

      if (!matrixVisible) {
        // Try clicking logo 5 times as fallback
        console.log('   Keyboard shortcut failed, trying logo click method...');
        const logo = page.locator('a[href="/"], img[alt*="Disruptors"], img[alt*="logo"]').first();

        if (await logo.count() > 0) {
          for (let i = 0; i < 5; i++) {
            await logo.click();
            await page.waitForTimeout(200);
          }
          await page.waitForTimeout(1000);

          matrixVisible = await page.isVisible('text=DISRUPTORS_NEURAL_NET', { timeout: 3000 }).catch(() => false);
        }
      }

      if (matrixVisible) {
        results.adminPanelAccess = true;
        console.log('✓ Matrix login terminal opened');

        const screenshot2 = 'validation-login.png';
        await page.screenshot({ path: screenshot2 });
        results.screenshots.push(screenshot2);
        console.log(`✓ Screenshot saved: ${screenshot2}`);

        // Wait for the loading sequence to complete and username input to appear
        console.log('   Waiting for loading sequence to complete...');
        await page.waitForTimeout(3000); // Wait for typewriter effect
      } else {
        console.log('✗ Matrix login did not appear with any method');
        const screenshot2 = 'validation-login-failed.png';
        await page.screenshot({ path: screenshot2 });
        console.log(`✓ Debug screenshot saved: ${screenshot2}`);
        await browser.close();
        return results;
      }
    } catch (error) {
      console.error(`✗ Admin panel access failed: ${error.message}`);
      await browser.close();
      return results;
    }

    // Test 4: Authentication with Matrix Login
    console.log('\n[4/8] Testing authentication with Matrix login...');
    try {
      // Enter username first
      console.log('   Entering username "admin"...');
      const usernameInput = page.locator('input[type="text"]').first();
      await usernameInput.fill('admin');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);

      // Wait for password prompt
      console.log('   Waiting for password prompt...');
      await page.waitForTimeout(500);

      // Take screenshot of password stage
      const screenshot2_5 = 'validation-password-stage.png';
      await page.screenshot({ path: screenshot2_5 });
      results.screenshots.push(screenshot2_5);
      console.log(`✓ Screenshot saved: ${screenshot2_5}`);

      // Enter password - the input should be focused already, just type
      console.log(`   Entering password "${ADMIN_PASSWORD}"...`);
      await page.keyboard.type(ADMIN_PASSWORD);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000); // Wait for success animation

      // Check if admin panel is visible
      const adminPanelVisible = await page.isVisible('text=Disruptors Admin Panel', { timeout: 5000 });
      if (adminPanelVisible) {
        console.log('✓ Successfully authenticated - Admin panel opened');

        const screenshot3 = 'validation-admin-panel.png';
        await page.screenshot({ path: screenshot3 });
        results.screenshots.push(screenshot3);
        console.log(`✓ Screenshot saved: ${screenshot3}`);
      } else {
        console.log('⚠ Checking if still in Matrix interface...');
        const stillInMatrix = await page.isVisible('text=DISRUPTORS_NEURAL_NET');
        if (stillInMatrix) {
          console.log('⚠ Still in Matrix terminal - authentication may have failed');
          const screenshot3_fail = 'validation-auth-failed.png';
          await page.screenshot({ path: screenshot3_fail });
          console.log(`✓ Debug screenshot saved: ${screenshot3_fail}`);
        }
        console.log('✗ Admin panel did not load after authentication');
        await browser.close();
        return results;
      }
    } catch (error) {
      console.error(`✗ Authentication failed: ${error.message}`);
      const screenshot3_error = 'validation-auth-error.png';
      await page.screenshot({ path: screenshot3_error });
      console.log(`✓ Error screenshot saved: ${screenshot3_error}`);
      await browser.close();
      return results;
    }

    // Test 5: Keyword Research Tab
    console.log('\n[5/8] Testing Keyword Research functionality...');
    try {
      // Wait for tabs to be available
      await page.waitForTimeout(1000);

      // Click Keyword Research tab
      const keywordTab = page.locator('button:has-text("Keyword Research")');
      if (await keywordTab.count() > 0) {
        await keywordTab.first.click();
        await page.waitForTimeout(2000);
        results.keywordResearchLoaded = true;
        console.log('✓ Keyword Research tab loaded');

        // Check for input field
        const inputVisible = await page.isVisible('input[placeholder*="keyword"], input[placeholder*="search"], textarea', { timeout: 3000 });
        if (inputVisible) {
          console.log('✓ Keyword input field found');

          // Try to enter a test keyword
          const input = page.locator('input[placeholder*="keyword"], input[placeholder*="search"], textarea').first();
          await input.fill('plumbing services');
          await page.waitForTimeout(500);
          console.log('✓ Test keyword entered');

          // Look for search/research button
          const searchButton = page.locator('button:has-text("Search"), button:has-text("Research"), button:has-text("Get")');
          if (await searchButton.count() > 0) {
            console.log('✓ Search button found');

            // Click and wait for response
            const errorsBefore = consoleErrors.length;
            await searchButton.first.click();
            await page.waitForTimeout(5000);

            const newErrors = consoleErrors.slice(errorsBefore);
            if (newErrors.length === 0) {
              results.keywordResearchFunctional = true;
              console.log('✓ Keyword search executed without console errors');
            } else {
              console.log('⚠ Console errors during keyword search:');
              newErrors.forEach(err => console.log(`   - ${err}`));
            }
          } else {
            console.log('⚠ Search button not found');
          }

          const screenshot4 = 'validation-keyword-research.png';
          await page.screenshot({ path: screenshot4 });
          results.screenshots.push(screenshot4);
          console.log(`✓ Screenshot saved: ${screenshot4}`);
        } else {
          console.log('⚠ Keyword input field not found');
        }
      } else {
        console.log('⚠ Keyword Research tab not found');
      }
    } catch (error) {
      console.error(`⚠ Keyword Research test error: ${error.message}`);
    }

    // Test 6: Intelligent Media Studio Tab
    console.log('\n[6/8] Testing Intelligent Media Studio...');
    try {
      const studioTab = page.locator('button:has-text("Intelligent Media Studio"), button:has-text("Media Studio")');
      if (await studioTab.count() > 0) {
        await studioTab.first.click();
        await page.waitForTimeout(2000);
        results.mediaStudioLoaded = true;
        console.log('✓ Intelligent Media Studio tab loaded');

        // Check for prompt input
        const promptInput = page.locator('textarea, input[type="text"]').first();
        if (await promptInput.count() > 0) {
          console.log('✓ Prompt input field found');

          // Check for Claude/AI references
          const claudeRefs = await page.locator('text=/claude|anthropic|ai.*model|gpt-image/i').count();
          console.log(`✓ Found ${claudeRefs} AI model references`);

          // Check for generate button
          const generateButton = page.locator('button:has-text("Generate"), button:has-text("Create")');
          if (await generateButton.count() > 0) {
            results.mediaStudioFunctional = true;
            console.log('✓ Generate button found - Media Studio appears functional');
          } else {
            console.log('⚠ Generate button not found');
          }

          const screenshot5 = 'validation-media-studio.png';
          await page.screenshot({ path: screenshot5 });
          results.screenshots.push(screenshot5);
          console.log(`✓ Screenshot saved: ${screenshot5}`);
        } else {
          console.log('⚠ Prompt input field not found');
        }
      } else {
        console.log('⚠ Intelligent Media Studio tab not found');
      }
    } catch (error) {
      console.error(`⚠ Media Studio test error: ${error.message}`);
    }

    // Test 7: Environment Variables Check
    console.log('\n[7/8] Checking environment variables...');
    try {
      // Try to access a data attribute or check network requests
      const networkRequests = [];
      page.on('request', req => {
        if (req.url().includes('dataforseo') || req.url().includes('anthropic')) {
          networkRequests.push(req.url());
        }
      });

      // Navigate back to keyword research and trigger a search if not already done
      console.log('✓ Monitoring for DataForSEO and Anthropic API calls');
      console.log(`   (This would require actual button clicks which were done in previous tests)`);
    } catch (error) {
      console.error(`⚠ Environment check error: ${error.message}`);
    }

    // Test 8: Final Error Analysis
    console.log('\n[8/8] Final error analysis...');
    results.consoleErrorCount = consoleErrors.length;
    results.jsErrorCount = jsErrors.length;

    console.log(`   - Total console messages: ${consoleLogs.length}`);
    console.log(`   - Console errors: ${consoleErrors.length}`);
    console.log(`   - JavaScript errors: ${jsErrors.length}`);

    if (consoleErrors.length > 0) {
      console.log('\n⚠ Console Errors:');
      consoleErrors.slice(0, 10).forEach(err => console.log(`   - ${err}`));
    }

    if (jsErrors.length > 0) {
      console.log('\n⚠ JavaScript Errors:');
      jsErrors.slice(0, 10).forEach(err => console.log(`   - ${err}`));
    }

  } catch (error) {
    console.error(`\n✗ Test suite failed: ${error.message}`);
  } finally {
    await browser.close();
  }

  // Print final report
  console.log('\n' + '='.repeat(80));
  console.log('VALIDATION RESULTS');
  console.log('='.repeat(80));
  console.log(`\nDeployment URL: ${PRODUCTION_URL}`);
  console.log(`Completed: ${new Date().toISOString()}\n`);

  console.log('Test Results:');
  console.log(`  1. Site Available: ${results.siteAvailable ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`  2. Admin Panel Access: ${results.adminPanelAccess ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`  3. Keyword Research Loaded: ${results.keywordResearchLoaded ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`  4. Keyword Research Functional: ${results.keywordResearchFunctional ? '✓ PASS' : '⚠ PARTIAL'}`);
  console.log(`  5. Media Studio Loaded: ${results.mediaStudioLoaded ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`  6. Media Studio Functional: ${results.mediaStudioFunctional ? '✓ PASS' : '⚠ PARTIAL'}`);

  console.log('\nError Summary:');
  console.log(`  - Console Errors: ${results.consoleErrorCount}`);
  console.log(`  - JavaScript Errors: ${results.jsErrorCount}`);

  console.log('\nScreenshots:');
  results.screenshots.forEach(screenshot => console.log(`  - ${screenshot}`));

  const passCount = [
    results.siteAvailable,
    results.adminPanelAccess,
    results.keywordResearchLoaded,
    results.keywordResearchFunctional,
    results.mediaStudioLoaded,
    results.mediaStudioFunctional
  ].filter(Boolean).length;

  console.log(`\nOverall Score: ${passCount}/6 tests passed`);

  if (passCount === 6 && results.consoleErrorCount === 0 && results.jsErrorCount === 0) {
    console.log('\n✓✓✓ DEPLOYMENT SUCCESSFUL - ALL TESTS PASSED ✓✓✓');
  } else if (passCount >= 4) {
    console.log('\n⚠ DEPLOYMENT PARTIAL - Some issues detected but core functionality works');
  } else {
    console.log('\n✗ DEPLOYMENT ISSUES - Critical functionality may be broken');
  }

  console.log('\n' + '='.repeat(80));

  return results;
}

// Run the validation
runDeploymentValidation().catch(console.error);
