/**
 * Comprehensive Deployment Validation Suite
 * Tests all critical functionality after deployment
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL || 'https://disruptorsmedia.com';
const SCREENSHOTS_DIR = path.join(process.cwd(), 'deployment-screenshots');
const REPORT_PATH = path.join(process.cwd(), 'deployment-report.json');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const report = {
  timestamp: new Date().toISOString(),
  deploymentUrl: DEPLOYMENT_URL,
  testResults: {
    pageLoads: {},
    navigation: {},
    adminAccess: {},
    console: {},
    apiIntegrations: {},
    responsive: {},
    security: {},
    performance: {}
  },
  summary: {
    totalTests: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  }
};

async function runTest(name, testFn) {
  console.log(`\n🧪 Testing: ${name}...`);
  report.summary.totalTests++;

  try {
    const result = await testFn();
    if (result.status === 'passed') {
      console.log(`✓ ${name} - PASSED`);
      report.summary.passed++;
    } else if (result.status === 'warning') {
      console.log(`⚠ ${name} - WARNING: ${result.message}`);
      report.summary.warnings++;
    } else {
      console.log(`✗ ${name} - FAILED: ${result.message}`);
      report.summary.failed++;
    }
    return result;
  } catch (error) {
    console.log(`✗ ${name} - ERROR: ${error.message}`);
    report.summary.failed++;
    return { status: 'failed', message: error.message, error: error.stack };
  }
}

async function testPageLoad(browser, pageName, url) {
  const page = await browser.newPage();
  const startTime = Date.now();

  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const loadTime = Date.now() - startTime;

    if (!response || !response.ok()) {
      return {
        status: 'failed',
        message: `HTTP ${response?.status() || 'unknown'}: ${response?.statusText() || 'No response'}`,
        loadTime
      };
    }

    // Wait for page to be interactive
    await page.waitForLoadState('domcontentloaded');

    // Take screenshot
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `${pageName}.png`),
      fullPage: true
    });

    // Check for critical content
    const title = await page.title();
    const hasContent = await page.locator('body').count() > 0;

    return {
      status: loadTime > 3000 ? 'warning' : 'passed',
      message: loadTime > 3000 ? `Load time ${loadTime}ms exceeds 3s threshold` : 'Page loaded successfully',
      loadTime,
      title,
      hasContent,
      statusCode: response.status()
    };
  } catch (error) {
    return {
      status: 'failed',
      message: error.message,
      error: error.stack
    };
  } finally {
    await page.close();
  }
}

async function testNavigation(browser) {
  const page = await browser.newPage();

  try {
    await page.goto(DEPLOYMENT_URL, { waitUntil: 'networkidle' });

    // Test navigation links
    const navLinks = await page.locator('nav a').count();
    const results = {
      linksFound: navLinks,
      tested: []
    };

    // Test a few key navigation items
    const testLinks = ['About', 'Work', 'Solutions', 'Contact'];

    for (const linkText of testLinks) {
      try {
        const link = page.locator(`nav a:has-text("${linkText}")`).first();
        if (await link.count() > 0) {
          await link.click();
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(1000);

          const url = page.url();
          results.tested.push({
            link: linkText,
            status: 'success',
            url
          });

          // Go back to home
          await page.goto(DEPLOYMENT_URL);
          await page.waitForLoadState('domcontentloaded');
        }
      } catch (error) {
        results.tested.push({
          link: linkText,
          status: 'failed',
          error: error.message
        });
      }
    }

    return {
      status: results.tested.every(t => t.status === 'success') ? 'passed' : 'failed',
      message: `Tested ${results.tested.length} navigation links`,
      ...results
    };
  } catch (error) {
    return {
      status: 'failed',
      message: error.message
    };
  } finally {
    await page.close();
  }
}

async function testAdminAccess(browser) {
  const page = await browser.newPage();

  try {
    await page.goto(DEPLOYMENT_URL, { waitUntil: 'networkidle' });

    // Test keyboard shortcut (Ctrl+Shift+D)
    console.log('   Testing keyboard shortcut...');
    await page.keyboard.press('Control+Shift+D');
    await page.waitForTimeout(1000);

    // Check if Matrix login appeared
    const matrixVisible = await page.locator('.matrix-login, [class*="matrix"]').count() > 0;

    // Take screenshot
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'admin-keyboard-access.png')
    });

    // Exit admin mode
    await page.keyboard.press('Control+Shift+Escape');
    await page.waitForTimeout(500);

    // Test logo clicks
    console.log('   Testing logo click pattern...');
    await page.goto(DEPLOYMENT_URL);
    await page.waitForLoadState('domcontentloaded');

    const logo = page.locator('header img, header svg, [class*="logo"]').first();
    const logoExists = await logo.count() > 0;

    if (logoExists) {
      for (let i = 0; i < 5; i++) {
        await logo.click({ force: true });
        await page.waitForTimeout(400);
      }

      const matrixVisibleAfterClicks = await page.locator('.matrix-login, [class*="matrix"]').count() > 0;

      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, 'admin-logo-clicks.png')
      });

      return {
        status: (matrixVisible || matrixVisibleAfterClicks) ? 'passed' : 'warning',
        message: (matrixVisible || matrixVisibleAfterClicks)
          ? 'Admin access patterns working'
          : 'Matrix login not detected - may be timing issue',
        keyboardShortcut: matrixVisible,
        logoClicks: matrixVisibleAfterClicks,
        logoExists
      };
    }

    return {
      status: matrixVisible ? 'passed' : 'warning',
      message: 'Logo not found, tested keyboard shortcut only',
      keyboardShortcut: matrixVisible,
      logoClicks: false,
      logoExists
    };
  } catch (error) {
    return {
      status: 'failed',
      message: error.message
    };
  } finally {
    await page.close();
  }
}

async function testConsoleErrors(browser) {
  const page = await browser.newPage();
  const errors = [];
  const warnings = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    } else if (msg.type() === 'warning') {
      warnings.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(`PageError: ${error.message}`);
  });

  try {
    await page.goto(DEPLOYMENT_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // Wait for any delayed errors

    return {
      status: errors.length === 0 ? 'passed' : errors.length < 5 ? 'warning' : 'failed',
      message: errors.length === 0
        ? 'No console errors detected'
        : `Found ${errors.length} errors and ${warnings.length} warnings`,
      errors: errors.slice(0, 10),
      warnings: warnings.slice(0, 5),
      totalErrors: errors.length,
      totalWarnings: warnings.length
    };
  } catch (error) {
    return {
      status: 'failed',
      message: error.message
    };
  } finally {
    await page.close();
  }
}

async function testResponsive(browser) {
  const viewports = [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 }
  ];

  const results = [];

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });

    try {
      await page.goto(DEPLOYMENT_URL, { waitUntil: 'networkidle' });

      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, `responsive-${viewport.name.toLowerCase()}.png`),
        fullPage: false
      });

      // Check if content is visible and properly laid out
      const bodyVisible = await page.locator('body').isVisible();
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });

      results.push({
        viewport: viewport.name,
        dimensions: `${viewport.width}x${viewport.height}`,
        status: bodyVisible && !hasOverflow ? 'passed' : 'warning',
        bodyVisible,
        hasHorizontalOverflow: hasOverflow
      });
    } catch (error) {
      results.push({
        viewport: viewport.name,
        status: 'failed',
        error: error.message
      });
    } finally {
      await page.close();
    }
  }

  const allPassed = results.every(r => r.status === 'passed');
  const anyFailed = results.some(r => r.status === 'failed');

  return {
    status: anyFailed ? 'failed' : allPassed ? 'passed' : 'warning',
    message: `Tested ${viewports.length} viewports`,
    results
  };
}

async function testSecurityHeaders(browser) {
  const page = await browser.newPage();

  try {
    const response = await page.goto(DEPLOYMENT_URL, { waitUntil: 'networkidle' });
    const headers = response.headers();

    const securityHeaders = {
      'x-frame-options': headers['x-frame-options'],
      'x-xss-protection': headers['x-xss-protection'],
      'x-content-type-options': headers['x-content-type-options'],
      'content-security-policy': headers['content-security-policy'],
      'referrer-policy': headers['referrer-policy']
    };

    const missingHeaders = Object.entries(securityHeaders)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    return {
      status: missingHeaders.length === 0 ? 'passed' : missingHeaders.length < 3 ? 'warning' : 'failed',
      message: missingHeaders.length === 0
        ? 'All security headers present'
        : `Missing ${missingHeaders.length} security headers`,
      headers: securityHeaders,
      missingHeaders
    };
  } catch (error) {
    return {
      status: 'failed',
      message: error.message
    };
  } finally {
    await page.close();
  }
}

async function testPerformance(browser) {
  const page = await browser.newPage();

  try {
    await page.goto(DEPLOYMENT_URL, { waitUntil: 'networkidle' });

    const metrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');

      return {
        domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
        loadComplete: perf.loadEventEnd - perf.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        domInteractive: perf.domInteractive - perf.fetchStart,
        totalLoadTime: perf.loadEventEnd - perf.fetchStart
      };
    });

    // Check Core Web Vitals thresholds
    const fcp = metrics.firstContentfulPaint;
    const status = fcp < 1500 ? 'passed' : fcp < 2500 ? 'warning' : 'failed';

    return {
      status,
      message: `FCP: ${Math.round(fcp)}ms (target: <1500ms)`,
      metrics: {
        ...metrics,
        'FCP Status': fcp < 1500 ? 'Good' : fcp < 2500 ? 'Needs Improvement' : 'Poor'
      }
    };
  } catch (error) {
    return {
      status: 'failed',
      message: error.message
    };
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('🚀 Starting Comprehensive Deployment Validation');
  console.log(`📍 Testing: ${DEPLOYMENT_URL}\n`);

  const browser = await chromium.launch({ headless: true });

  try {
    // Test 1: Critical Page Loads
    console.log('\n═══════════════════════════════════════');
    console.log('📄 CRITICAL PAGE LOADS');
    console.log('═══════════════════════════════════════');

    const pages = [
      { name: 'home', url: DEPLOYMENT_URL },
      { name: 'about', url: `${DEPLOYMENT_URL}/about` },
      { name: 'work', url: `${DEPLOYMENT_URL}/work` },
      { name: 'solutions', url: `${DEPLOYMENT_URL}/solutions` },
      { name: 'contact', url: `${DEPLOYMENT_URL}/contact` }
    ];

    for (const page of pages) {
      report.testResults.pageLoads[page.name] = await runTest(
        `Page Load: ${page.name}`,
        () => testPageLoad(browser, page.name, page.url)
      );
    }

    // Test 2: Navigation
    console.log('\n═══════════════════════════════════════');
    console.log('🧭 NAVIGATION TESTING');
    console.log('═══════════════════════════════════════');

    report.testResults.navigation = await runTest(
      'Navigation functionality',
      () => testNavigation(browser)
    );

    // Test 3: Admin Access
    console.log('\n═══════════════════════════════════════');
    console.log('🔒 ADMIN ACCESS PATTERNS');
    console.log('═══════════════════════════════════════');

    report.testResults.adminAccess = await runTest(
      'Admin access patterns',
      () => testAdminAccess(browser)
    );

    // Test 4: Console Errors
    console.log('\n═══════════════════════════════════════');
    console.log('🐛 CONSOLE ERROR CHECK');
    console.log('═══════════════════════════════════════');

    report.testResults.console = await runTest(
      'Console errors',
      () => testConsoleErrors(browser)
    );

    // Test 5: Responsive Design
    console.log('\n═══════════════════════════════════════');
    console.log('📱 RESPONSIVE DESIGN');
    console.log('═══════════════════════════════════════');

    report.testResults.responsive = await runTest(
      'Responsive design',
      () => testResponsive(browser)
    );

    // Test 6: Security Headers
    console.log('\n═══════════════════════════════════════');
    console.log('🛡️ SECURITY HEADERS');
    console.log('═══════════════════════════════════════');

    report.testResults.security = await runTest(
      'Security headers',
      () => testSecurityHeaders(browser)
    );

    // Test 7: Performance
    console.log('\n═══════════════════════════════════════');
    console.log('⚡ PERFORMANCE METRICS');
    console.log('═══════════════════════════════════════');

    report.testResults.performance = await runTest(
      'Performance metrics',
      () => testPerformance(browser)
    );

  } finally {
    await browser.close();
  }

  // Generate summary
  console.log('\n\n═══════════════════════════════════════');
  console.log('📊 DEPLOYMENT VALIDATION SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`Total Tests: ${report.summary.totalTests}`);
  console.log(`✓ Passed: ${report.summary.passed}`);
  console.log(`⚠ Warnings: ${report.summary.warnings}`);
  console.log(`✗ Failed: ${report.summary.failed}`);
  console.log(`\n📈 Success Rate: ${Math.round((report.summary.passed / report.summary.totalTests) * 100)}%`);

  const overallStatus = report.summary.failed === 0
    ? (report.summary.warnings === 0 ? '✅ EXCELLENT' : '⚠️ GOOD WITH WARNINGS')
    : (report.summary.failed < 3 ? '❌ NEEDS ATTENTION' : '🚨 CRITICAL ISSUES');

  console.log(`\n🎯 Overall Status: ${overallStatus}`);

  // Save report
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\n📄 Full report saved to: ${REPORT_PATH}`);
  console.log(`📸 Screenshots saved to: ${SCREENSHOTS_DIR}`);

  // Exit with appropriate code
  process.exit(report.summary.failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});