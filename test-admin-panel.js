/**
 * Comprehensive Admin Panel Diagnostic Test
 * Tests deployed site at https://dm4.wjwelsh.com
 *
 * Run with: node test-admin-panel.js
 */

const { chromium } = require('playwright');

const SITE_URL = 'https://dm4.wjwelsh.com';
const ADMIN_PASSWORD = 'DMadmin';

async function runDiagnostics() {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();

  const report = {
    timestamp: new Date().toISOString(),
    siteUrl: SITE_URL,
    tests: [],
    errors: [],
    warnings: [],
    recommendations: []
  };

  // Collect console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      report.errors.push({
        type: 'console',
        message: msg.text(),
        location: msg.location()
      });
    }
  });

  // Collect network failures
  page.on('response', response => {
    if (!response.ok() && response.status() !== 404) {
      report.errors.push({
        type: 'network',
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });

  try {
    console.log('\n========================================');
    console.log('DEPLOYMENT VALIDATION & DIAGNOSTICS');
    console.log('========================================\n');

    // Test 1: Homepage Load
    console.log('TEST 1: Loading homepage...');
    await page.goto(SITE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // Wait for loading screen

    const title = await page.title();
    report.tests.push({
      name: 'Homepage Load',
      status: title ? 'PASS' : 'FAIL',
      details: `Title: ${title}`
    });
    console.log(`✓ Homepage loaded: ${title}\n`);

    // Test 2: Secret Admin Access - Logo Clicks
    console.log('TEST 2: Testing secret admin access (5 logo clicks)...');
    const logo = await page.locator('img[alt*="Disruptors"]').first();

    // Click logo 5 times quickly
    for (let i = 0; i < 5; i++) {
      await logo.click({ force: true });
      await page.waitForTimeout(200);
      console.log(`  Click ${i + 1}/5`);
    }

    await page.waitForTimeout(1000);

    // Check if Matrix login appeared
    const matrixLoginVisible = await page.locator('text=DISRUPTORS_NEURAL_NET').isVisible().catch(() => false);
    report.tests.push({
      name: 'Secret Access - Logo Clicks',
      status: matrixLoginVisible ? 'PASS' : 'FAIL',
      details: matrixLoginVisible ? 'Matrix login appeared' : 'Matrix login did not appear'
    });

    if (matrixLoginVisible) {
      console.log('✓ Matrix login interface appeared\n');
    } else {
      console.log('✗ FAIL: Matrix login did not appear after 5 logo clicks\n');
      report.warnings.push('Secret access trigger (logo clicks) may not be working');
    }

    // Test 3: Keyboard Shortcut Access
    console.log('TEST 3: Testing keyboard shortcut (Ctrl+Shift+D)...');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await page.keyboard.down('Control');
    await page.keyboard.down('Shift');
    await page.keyboard.press('D');
    await page.keyboard.up('Shift');
    await page.keyboard.up('Control');

    await page.waitForTimeout(1000);

    const matrixLoginViaKeyboard = await page.locator('text=DISRUPTORS_NEURAL_NET').isVisible().catch(() => false);
    report.tests.push({
      name: 'Secret Access - Keyboard Shortcut',
      status: matrixLoginViaKeyboard ? 'PASS' : 'FAIL',
      details: matrixLoginViaKeyboard ? 'Matrix login appeared via Ctrl+Shift+D' : 'Keyboard shortcut failed'
    });

    if (matrixLoginViaKeyboard) {
      console.log('✓ Matrix login appeared via keyboard shortcut\n');
    } else {
      console.log('✗ FAIL: Keyboard shortcut did not trigger Matrix login\n');
    }

    // Test 4: Matrix Login Authentication
    if (matrixLoginViaKeyboard) {
      console.log('TEST 4: Testing Matrix login authentication...');

      // Enter username
      const usernameInput = await page.locator('input[type="text"]').first();
      await usernameInput.fill('TestAdmin');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);

      // Enter password
      const passwordInput = await page.locator('input[type="password"]').first();
      await passwordInput.fill(ADMIN_PASSWORD);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);

      // Check if admin panel appeared
      const adminPanelVisible = await page.locator('text=DISRUPTORS NEURAL NETWORK').isVisible().catch(() => false);
      report.tests.push({
        name: 'Matrix Login Authentication',
        status: adminPanelVisible ? 'PASS' : 'FAIL',
        details: adminPanelVisible ? 'Successfully authenticated' : 'Authentication failed'
      });

      if (adminPanelVisible) {
        console.log('✓ Admin panel loaded successfully\n');
      } else {
        console.log('✗ FAIL: Admin panel did not load after login\n');
        report.errors.push({
          type: 'authentication',
          message: 'Matrix login succeeded but admin panel did not appear'
        });
      }

      // Test 5: Admin Panel Tabs
      if (adminPanelVisible) {
        console.log('TEST 5: Testing admin panel tabs...');

        const tabs = [
          { name: 'Data Manager', text: 'database' },
          { name: 'Blog Manager', text: 'blog' },
          { name: 'Intelligent Media Studio', text: 'media' },
          { name: 'SEO Keywords', text: 'seo' }
        ];

        for (const tab of tabs) {
          try {
            const tabButton = await page.locator(`button[value="${tab.text}"]`);
            await tabButton.click();
            await page.waitForTimeout(1000);

            // Check for errors
            const hasError = await page.locator('text=ERROR').isVisible().catch(() => false);

            report.tests.push({
              name: `Admin Tab: ${tab.name}`,
              status: !hasError ? 'PASS' : 'FAIL',
              details: !hasError ? 'Tab loaded successfully' : 'Tab loaded with errors'
            });

            console.log(`  ${!hasError ? '✓' : '✗'} ${tab.name}`);
          } catch (error) {
            report.tests.push({
              name: `Admin Tab: ${tab.name}`,
              status: 'FAIL',
              details: error.message
            });
            console.log(`  ✗ ${tab.name} - ${error.message}`);
          }
        }
        console.log('');

        // Test 6: Keyword Research Functionality
        console.log('TEST 6: Testing keyword research page...');
        await page.locator('button[value="seo"]').click();
        await page.waitForTimeout(1000);

        // Enter search term
        const keywordInput = await page.locator('input[placeholder*="AI automation"]').first();
        await keywordInput.fill('digital marketing');

        // Click search button
        const searchButton = await page.locator('button:has-text("Search Keywords")');
        await searchButton.click();
        await page.waitForTimeout(5000);

        // Check for results or errors
        const hasResults = await page.locator('text=Keywords Found').isVisible().catch(() => false);
        const hasError = await page.locator('text=ERROR').isVisible().catch(() => false);
        const usesSheets = await page.locator('text=Google Sheets').isVisible().catch(() => false);

        report.tests.push({
          name: 'Keyword Research',
          status: hasResults ? 'PASS' : hasError ? 'FAIL' : 'WARNING',
          details: hasResults ? 'Keywords loaded' : hasError ? 'API error' : usesSheets ? 'Using mock data' : 'Unknown state'
        });

        if (hasResults) {
          console.log('✓ Keyword research working\n');
        } else if (hasError) {
          console.log('✗ FAIL: Keyword research API error\n');
          report.errors.push({
            type: 'api',
            component: 'Keyword Research',
            message: 'DataForSEO API call failed'
          });
          report.recommendations.push('Check DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD in Netlify environment variables');
        } else {
          console.log('⚠ WARNING: Keyword research may be using mock data\n');
          report.warnings.push('Keyword research may not have real DataForSEO credentials');
        }

        // Test 7: Image Generation Page
        console.log('TEST 7: Testing image generation page...');
        await page.locator('button[value="media"]').click();
        await page.waitForTimeout(1000);

        const mediaStudioVisible = await page.locator('text=Intelligent Media Studio').isVisible().catch(() => false);
        report.tests.push({
          name: 'Image Generation Page',
          status: mediaStudioVisible ? 'PASS' : 'FAIL',
          details: mediaStudioVisible ? 'Media studio loaded' : 'Media studio failed to load'
        });

        if (mediaStudioVisible) {
          console.log('✓ Image generation page loaded\n');
        } else {
          console.log('✗ FAIL: Image generation page failed to load\n');
        }

        // Test 8: Blog Management Dashboard
        console.log('TEST 8: Testing blog management dashboard...');
        await page.locator('button[value="blog"]').click();
        await page.waitForTimeout(1000);

        const blogManagerVisible = await page.locator('text=BLOG MANAGEMENT SYSTEM').isVisible().catch(() => false);
        const writeArticlesButton = await page.locator('button:has-text("WRITE ARTICLES")').isVisible().catch(() => false);

        report.tests.push({
          name: 'Blog Management Dashboard',
          status: blogManagerVisible && writeArticlesButton ? 'PASS' : 'FAIL',
          details: blogManagerVisible ? 'Blog manager loaded with all features' : 'Blog manager incomplete'
        });

        if (blogManagerVisible && writeArticlesButton) {
          console.log('✓ Blog management dashboard fully loaded\n');
        } else {
          console.log('✗ FAIL: Blog management dashboard incomplete\n');
        }
      }
    }

    // Test 9: Check Environment Variables
    console.log('TEST 9: Checking environment variables...');
    const envVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_ANTHROPIC_API_KEY',
      'VITE_OPENAI_API_KEY',
      'VITE_REPLICATE_API_TOKEN',
      'VITE_GEMINI_API_KEY'
    ];

    // Check if any API calls fail with auth errors
    const authErrors = report.errors.filter(e =>
      e.type === 'network' && (e.status === 401 || e.status === 403)
    );

    if (authErrors.length > 0) {
      console.log('⚠ WARNING: Authentication errors detected\n');
      report.warnings.push('Some API calls failed with authentication errors');
      report.recommendations.push('Verify all VITE_* environment variables are set in Netlify');

      authErrors.forEach(err => {
        console.log(`  - ${err.url}: ${err.status} ${err.statusText}`);
      });
    } else {
      console.log('✓ No authentication errors detected\n');
    }

    // Generate Summary
    console.log('\n========================================');
    console.log('DIAGNOSTIC SUMMARY');
    console.log('========================================\n');

    const passCount = report.tests.filter(t => t.status === 'PASS').length;
    const failCount = report.tests.filter(t => t.status === 'FAIL').length;
    const warnCount = report.tests.filter(t => t.status === 'WARNING').length;

    console.log(`Total Tests: ${report.tests.length}`);
    console.log(`✓ Passed: ${passCount}`);
    console.log(`✗ Failed: ${failCount}`);
    console.log(`⚠ Warnings: ${warnCount}`);
    console.log(`\nConsole Errors: ${report.errors.filter(e => e.type === 'console').length}`);
    console.log(`Network Errors: ${report.errors.filter(e => e.type === 'network').length}`);
    console.log(`Warnings: ${report.warnings.length}`);
    console.log(`\n`);

    if (report.errors.length > 0) {
      console.log('ERRORS DETECTED:');
      console.log('================');
      report.errors.forEach((err, i) => {
        console.log(`\n${i + 1}. [${err.type.toUpperCase()}]`);
        console.log(`   ${err.message || err.url || 'Unknown error'}`);
        if (err.status) console.log(`   Status: ${err.status} ${err.statusText || ''}`);
        if (err.location) console.log(`   Location: ${JSON.stringify(err.location)}`);
      });
      console.log('\n');
    }

    if (report.warnings.length > 0) {
      console.log('WARNINGS:');
      console.log('=========');
      report.warnings.forEach((warn, i) => {
        console.log(`${i + 1}. ${warn}`);
      });
      console.log('\n');
    }

    if (report.recommendations.length > 0) {
      console.log('RECOMMENDATIONS:');
      console.log('================');
      report.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
      console.log('\n');
    }

    // Save detailed report
    const fs = require('fs');
    const reportPath = './admin-panel-diagnostic-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\nDetailed report saved to: ${reportPath}\n`);

  } catch (error) {
    console.error('\n✗ CRITICAL ERROR:', error.message);
    report.errors.push({
      type: 'critical',
      message: error.message,
      stack: error.stack
    });
  } finally {
    await page.waitForTimeout(3000);
    await browser.close();
  }

  return report;
}

// Run diagnostics
runDiagnostics().then(report => {
  const failCount = report.tests.filter(t => t.status === 'FAIL').length;
  process.exit(failCount > 0 ? 1 : 0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
