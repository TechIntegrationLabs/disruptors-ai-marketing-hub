/**
 * Comprehensive Deployment Validation Script
 * Tests critical functionality of the deployed site
 */

import { chromium } from 'playwright';

const DEPLOYMENT_URL = 'https://adminoverhaul--cheerful-custard-2e6fc5.netlify.app';
const PRODUCTION_URL = 'https://dm4.wjwelsh.com';

const results = {
  timestamp: new Date().toISOString(),
  deploymentUrl: DEPLOYMENT_URL,
  productionUrl: PRODUCTION_URL,
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  }
};

function addTest(name, status, details = '', url = DEPLOYMENT_URL) {
  results.tests.push({
    name,
    status,
    details,
    url,
    timestamp: new Date().toISOString()
  });
  results.summary.total++;
  if (status === 'PASS') results.summary.passed++;
  else if (status === 'FAIL') results.summary.failed++;
  else if (status === 'WARN') results.summary.warnings++;
}

async function testHomepageLoad(page) {
  console.log('\n=== Testing Homepage Load ===');
  try {
    const response = await page.goto(DEPLOYMENT_URL, { waitUntil: 'networkidle', timeout: 30000 });
    const status = response.status();

    if (status === 200) {
      addTest('Homepage HTTP Status', 'PASS', `Status: ${status}`);
    } else {
      addTest('Homepage HTTP Status', 'FAIL', `Expected 200, got ${status}`);
    }

    const title = await page.title();
    if (title && title.includes('Disruptors')) {
      addTest('Homepage Title', 'PASS', `Title: "${title}"`);
    } else {
      addTest('Homepage Title', 'WARN', `Title: "${title}"`);
    }

    await page.waitForSelector('body', { timeout: 5000 });
    addTest('DOM Ready', 'PASS', 'Body element loaded');

    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.waitForTimeout(2000);

    if (errors.length === 0) {
      addTest('JavaScript Errors', 'PASS', 'No console errors detected');
    } else {
      addTest('JavaScript Errors', 'FAIL', `${errors.length} errors: ${errors.slice(0, 3).join(', ')}`);
    }

  } catch (error) {
    addTest('Homepage Load', 'FAIL', error.message);
  }
}

async function testNavigation(page) {
  console.log('\n=== Testing Navigation ===');
  try {
    const navLinks = await page.$$('nav a, header a');
    addTest('Navigation Links', 'PASS', `Found ${navLinks.length} navigation links`);

    const homeLink = await page.$('a[href="/"], a[href="/home"]');
    if (homeLink) {
      addTest('Home Navigation Link', 'PASS', 'Home link found');
    } else {
      addTest('Home Navigation Link', 'WARN', 'Home link not found');
    }

  } catch (error) {
    addTest('Navigation Test', 'FAIL', error.message);
  }
}

async function testSplineScenes(page) {
  console.log('\n=== Testing 3D Spline Scenes ===');
  try {
    await page.waitForTimeout(3000);

    const splineCanvas = await page.$('canvas, #spline-canvas');
    if (splineCanvas) {
      addTest('Spline 3D Canvas', 'PASS', 'Canvas element found');

      const canvasVisible = await splineCanvas.isVisible();
      if (canvasVisible) {
        addTest('Spline Canvas Visibility', 'PASS', 'Canvas is visible');
      } else {
        addTest('Spline Canvas Visibility', 'WARN', 'Canvas exists but not visible');
      }
    } else {
      addTest('Spline 3D Canvas', 'WARN', 'No canvas element found (may load dynamically)');
    }

    const splineScript = await page.$('script[src*="spline"]');
    if (splineScript) {
      addTest('Spline Script Load', 'PASS', 'Spline script tag found');
    } else {
      addTest('Spline Script Load', 'WARN', 'Spline script not found');
    }

  } catch (error) {
    addTest('Spline Scenes Test', 'FAIL', error.message);
  }
}

async function testClientLogoMarquee(page) {
  console.log('\n=== Testing Client Logo Marquee ===');
  try {
    const marquee = await page.$('[class*="marquee"], [class*="logo"]');
    if (marquee) {
      addTest('Client Logo Marquee', 'PASS', 'Marquee element found');

      const images = await page.$$('[class*="marquee"] img, [class*="logo"] img');
      if (images.length > 0) {
        addTest('Marquee Logo Images', 'PASS', `Found ${images.length} logo images`);
      } else {
        addTest('Marquee Logo Images', 'WARN', 'No logo images found');
      }
    } else {
      addTest('Client Logo Marquee', 'WARN', 'Marquee element not found');
    }

  } catch (error) {
    addTest('Logo Marquee Test', 'FAIL', error.message);
  }
}

async function testAdminAccess(page) {
  console.log('\n=== Testing Admin Access Patterns ===');
  try {
    const adminResponse = await page.goto(`${DEPLOYMENT_URL}/admin/secret`, { waitUntil: 'networkidle', timeout: 15000 });
    const adminStatus = adminResponse.status();

    if (adminStatus === 200) {
      addTest('Admin Route Access', 'PASS', `Admin route accessible (${adminStatus})`);

      const matrixLogin = await page.$('[class*="matrix"], [class*="login"]');
      if (matrixLogin) {
        addTest('Admin Login Interface', 'PASS', 'Matrix login interface found');
      } else {
        addTest('Admin Login Interface', 'WARN', 'Matrix login interface not detected');
      }
    } else if (adminStatus === 404) {
      addTest('Admin Route Access', 'WARN', 'Admin route returns 404 (SPA routing may handle this)');
    } else {
      addTest('Admin Route Access', 'FAIL', `Unexpected status: ${adminStatus}`);
    }

  } catch (error) {
    addTest('Admin Access Test', 'WARN', `Could not access admin route: ${error.message}`);
  }
}

async function testPerformanceMetrics(page) {
  console.log('\n=== Testing Performance Metrics ===');
  try {
    const performanceData = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: perf.loadEventEnd - perf.fetchStart,
        domContentLoaded: perf.domContentLoadedEventEnd - perf.fetchStart,
        responseTime: perf.responseEnd - perf.requestStart
      };
    });

    if (performanceData.loadTime < 5000) {
      addTest('Page Load Time', 'PASS', `${Math.round(performanceData.loadTime)}ms`);
    } else if (performanceData.loadTime < 10000) {
      addTest('Page Load Time', 'WARN', `${Math.round(performanceData.loadTime)}ms (slower than ideal)`);
    } else {
      addTest('Page Load Time', 'FAIL', `${Math.round(performanceData.loadTime)}ms (too slow)`);
    }

    if (performanceData.domContentLoaded < 3000) {
      addTest('DOM Content Loaded', 'PASS', `${Math.round(performanceData.domContentLoaded)}ms`);
    } else {
      addTest('DOM Content Loaded', 'WARN', `${Math.round(performanceData.domContentLoaded)}ms`);
    }

  } catch (error) {
    addTest('Performance Metrics', 'WARN', `Could not measure: ${error.message}`);
  }
}

async function testImageLoading(page) {
  console.log('\n=== Testing Image Loading ===');
  try {
    const images = await page.$$('img');
    const imageCount = images.length;

    if (imageCount > 0) {
      addTest('Images Present', 'PASS', `Found ${imageCount} images`);

      const brokenImages = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.filter(img => !img.complete || img.naturalHeight === 0).length;
      });

      if (brokenImages === 0) {
        addTest('Image Load Success', 'PASS', 'All images loaded successfully');
      } else {
        addTest('Image Load Success', 'WARN', `${brokenImages} images failed to load`);
      }
    } else {
      addTest('Images Present', 'WARN', 'No images found on page');
    }

  } catch (error) {
    addTest('Image Loading Test', 'FAIL', error.message);
  }
}

async function testMobileResponsiveness(page) {
  console.log('\n=== Testing Mobile Responsiveness ===');
  try {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    if (bodyWidth <= 375) {
      addTest('Mobile Viewport', 'PASS', 'No horizontal overflow on mobile');
    } else {
      addTest('Mobile Viewport', 'WARN', `Horizontal overflow detected: ${bodyWidth}px`);
    }

    await page.setViewportSize({ width: 1920, height: 1080 });

  } catch (error) {
    addTest('Mobile Responsiveness', 'FAIL', error.message);
  }
}

async function runAllTests() {
  console.log('Starting Comprehensive Deployment Validation');
  console.log('='.repeat(60));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  try {
    await testHomepageLoad(page);
    await testNavigation(page);
    await testSplineScenes(page);
    await testClientLogoMarquee(page);
    await testImageLoading(page);
    await testPerformanceMetrics(page);
    await testMobileResponsiveness(page);
    await testAdminAccess(page);

  } catch (error) {
    console.error('Test suite error:', error);
    addTest('Test Suite', 'FAIL', error.message);
  } finally {
    await browser.close();
  }

  printResults();
}

function printResults() {
  console.log('\n' + '='.repeat(60));
  console.log('DEPLOYMENT VALIDATION REPORT');
  console.log('='.repeat(60));
  console.log(`Deployment URL: ${DEPLOYMENT_URL}`);
  console.log(`Test Date: ${results.timestamp}`);
  console.log('\nSummary:');
  console.log(`  Total Tests: ${results.summary.total}`);
  console.log(`  ✓ Passed: ${results.summary.passed}`);
  console.log(`  ✗ Failed: ${results.summary.failed}`);
  console.log(`  ⚠ Warnings: ${results.summary.warnings}`);

  const passRate = ((results.summary.passed / results.summary.total) * 100).toFixed(1);
  console.log(`  Pass Rate: ${passRate}%`);

  console.log('\nDetailed Results:');
  console.log('-'.repeat(60));

  results.tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✓' : test.status === 'FAIL' ? '✗' : '⚠';
    console.log(`${icon} ${test.name}`);
    if (test.details) {
      console.log(`  ${test.details}`);
    }
  });

  console.log('\n' + '='.repeat(60));

  if (results.summary.failed > 0) {
    console.log('STATUS: DEPLOYMENT HAS CRITICAL ISSUES');
    process.exit(1);
  } else if (results.summary.warnings > 0) {
    console.log('STATUS: DEPLOYMENT SUCCESSFUL WITH WARNINGS');
    process.exit(0);
  } else {
    console.log('STATUS: DEPLOYMENT FULLY VALIDATED ✓');
    process.exit(0);
  }
}

runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
