import { chromium } from 'playwright';

async function testDeployment() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  try {
    console.log('🚀 Testing Disruptors AI Marketing Hub deployment...');

    // Test 1: Basic site loading
    console.log('\n📍 Test 1: Loading main site');
    await page.goto('https://disruptors-ai-marketing-hub.netlify.app', {
      waitUntil: 'networkidle'
    });

    // Take screenshot
    await page.screenshot({
      path: 'test-homepage.png',
      fullPage: true
    });

    // Check for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait a bit for any dynamic content
    await page.waitForTimeout(3000);

    console.log('✅ Site loaded successfully');
    console.log(`📄 Page title: ${await page.title()}`);
    console.log(`🌐 Current URL: ${page.url()}`);

    // Test 2: Check navigation elements
    console.log('\n📍 Test 2: Checking navigation');
    const navItems = await page.$$eval('[data-testid*="nav"], nav a, header a',
      els => els.map(el => ({ text: el.textContent?.trim(), href: el.href }))
    );

    if (navItems.length > 0) {
      console.log('✅ Navigation found:', navItems.slice(0, 5));
    } else {
      console.log('⚠️  No navigation elements found');
    }

    // Test 3: Check for main content areas
    console.log('\n📍 Test 3: Checking main content');
    const hasMainContent = await page.$('main, [role="main"], .main-content, #root');
    if (hasMainContent) {
      console.log('✅ Main content area found');
    } else {
      console.log('⚠️  No main content area identified');
    }

    // Test 4: Check for any visible text content
    const bodyText = await page.textContent('body');
    const textLength = bodyText?.trim().length || 0;
    console.log(`📝 Body text length: ${textLength} characters`);

    if (textLength < 100) {
      console.log('⚠️  Very little content detected - possible loading issue');
    }

    // Test 5: Check for React/JS framework loading
    const hasReact = await page.evaluate(() => {
      return window.React || document.querySelector('[data-reactroot]') || document.querySelector('#root');
    });

    if (hasReact) {
      console.log('✅ React framework detected');
    } else {
      console.log('⚠️  React framework not detected');
    }

    // Test 6: Secret admin access check - count logos
    console.log('\n📍 Test 4: Looking for logo elements for secret access');
    const logoElements = await page.$$eval('img[alt*="logo"], img[src*="logo"], .logo',
      els => els.length
    );
    console.log(`🎯 Found ${logoElements} potential logo elements for secret access`);

    // Report console errors
    if (errors.length > 0) {
      console.log('\n❌ Console errors detected:');
      errors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('\n✅ No console errors detected');
    }

    console.log('\n🎉 Basic deployment test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testDeployment();