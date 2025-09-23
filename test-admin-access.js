import { chromium } from 'playwright';

async function testAdminAccess() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  try {
    console.log('🔐 Testing secret admin access...');

    // Go to the site
    await page.goto('https://disruptors-ai-marketing-hub.netlify.app', {
      waitUntil: 'networkidle'
    });

    // Wait for the page to fully load
    await page.waitForTimeout(3000);

    // Look for logo elements
    console.log('\n🎯 Step 1: Finding logo elements');

    // Try different logo selectors
    const logoSelectors = [
      'img[alt*="logo" i]',
      'img[src*="logo"]',
      '.logo',
      'header img',
      'nav img',
      '[data-testid*="logo"]'
    ];

    let logoElement = null;
    for (const selector of logoSelectors) {
      const elements = await page.$$(selector);
      if (elements.length > 0) {
        console.log(`  ✅ Found ${elements.length} elements with selector: ${selector}`);
        logoElement = elements[0]; // Use the first one found
        break;
      } else {
        console.log(`  ⚠️  No elements found with selector: ${selector}`);
      }
    }

    if (!logoElement) {
      console.log('❌ No logo element found, trying to find any clickable image in header');
      const headerImages = await page.$$('header img, nav img');
      if (headerImages.length > 0) {
        logoElement = headerImages[0];
        console.log('  ✅ Using first header image as logo');
      }
    }

    if (!logoElement) {
      console.log('❌ No suitable logo element found');
      await page.screenshot({ path: 'no-logo-found.png', fullPage: true });
      return;
    }

    // Click the logo 5 times
    console.log('\n🖱️  Step 2: Clicking logo 5 times');
    for (let i = 1; i <= 5; i++) {
      await logoElement.click();
      console.log(`  Click ${i}/5`);
      await page.waitForTimeout(500); // Small delay between clicks
    }

    // Wait a moment for any modal or interface to appear
    await page.waitForTimeout(2000);

    // Look for password input or admin interface
    console.log('\n🔍 Step 3: Looking for admin interface');

    // Check for password input field
    const passwordSelectors = [
      'input[type="password"]',
      'input[placeholder*="password" i]',
      'input[name*="password"]',
      '[data-testid*="password"]'
    ];

    let passwordInput = null;
    for (const selector of passwordSelectors) {
      const input = await page.$(selector);
      if (input) {
        console.log(`  ✅ Found password input with selector: ${selector}`);
        passwordInput = input;
        break;
      }
    }

    if (!passwordInput) {
      console.log('⚠️  No password input found. Checking for any modal or overlay...');

      // Look for modal or overlay
      const modalSelectors = [
        '.modal',
        '.overlay',
        '[role="dialog"]',
        '.admin-panel',
        '.login-form'
      ];

      for (const selector of modalSelectors) {
        const modal = await page.$(selector);
        if (modal) {
          console.log(`  ✅ Found modal/overlay with selector: ${selector}`);
          // Try to find password input within the modal
          passwordInput = await modal.$('input[type="password"], input');
          if (passwordInput) {
            console.log('  ✅ Found password input within modal');
            break;
          }
        }
      }
    }

    if (!passwordInput) {
      console.log('❌ No password input found. Taking screenshot for debugging...');
      await page.screenshot({ path: 'admin-access-no-input.png', fullPage: true });

      // Check what happened after clicking
      const bodyText = await page.textContent('body');
      console.log('📝 Page content length after clicks:', bodyText.length);

      return;
    }

    // Enter the password
    console.log('\n🔑 Step 4: Entering password "DMadmin"');
    await passwordInput.fill('DMadmin');

    // Look for submit button or form
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Login")',
      'button:has-text("Enter")',
      'button:has-text("Submit")'
    ];

    let submitButton = null;
    for (const selector of submitSelectors) {
      const button = await page.$(selector);
      if (button) {
        console.log(`  ✅ Found submit button with selector: ${selector}`);
        submitButton = button;
        break;
      }
    }

    if (submitButton) {
      await submitButton.click();
      console.log('  ✅ Clicked submit button');
    } else {
      // Try pressing Enter
      await passwordInput.press('Enter');
      console.log('  ✅ Pressed Enter key');
    }

    // Wait for admin interface to load
    await page.waitForTimeout(3000);

    // Check if admin panel loaded
    console.log('\n🎯 Step 5: Checking for admin interface');

    const adminSelectors = [
      '.admin-panel',
      '.admin-dashboard',
      '[data-testid*="admin"]',
      'h1:has-text("Admin")',
      'h2:has-text("Admin")'
    ];

    let adminFound = false;
    for (const selector of adminSelectors) {
      const element = await page.$(selector);
      if (element) {
        console.log(`  ✅ Admin interface found with selector: ${selector}`);
        adminFound = true;
        break;
      }
    }

    if (!adminFound) {
      console.log('⚠️  No obvious admin interface found. Checking URL and page changes...');
      console.log(`  Current URL: ${page.url()}`);

      const newBodyText = await page.textContent('body');
      console.log(`  Page content length: ${newBodyText.length}`);
    }

    // Take final screenshot
    await page.screenshot({ path: 'admin-access-result.png', fullPage: true });
    console.log('\n📸 Final screenshot saved as admin-access-result.png');

    if (adminFound) {
      console.log('\n🎉 SUCCESS: Admin access appears to be working!');
    } else {
      console.log('\n⚠️  Admin access test inconclusive - check screenshots for details');
    }

  } catch (error) {
    console.error('❌ Admin access test failed:', error.message);
    await page.screenshot({ path: 'admin-access-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testAdminAccess();