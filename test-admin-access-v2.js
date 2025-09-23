import { chromium } from 'playwright';

async function testAdminAccessV2() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  // Listen for console messages to catch debug output
  page.on('console', msg => {
    if (msg.text().includes('Secret access') || msg.text().includes('Matrix login')) {
      console.log(`🔐 Console: ${msg.text()}`);
    }
  });

  try {
    console.log('🔐 Testing secret admin access (V2)...');

    // Go to the site
    await page.goto('https://disruptors-ai-marketing-hub.netlify.app', {
      waitUntil: 'networkidle'
    });

    // Wait for the page to fully load and any loading screen to disappear
    console.log('⏳ Waiting for site to fully load...');
    await page.waitForTimeout(5000);

    // Look specifically for the header logo with the Disruptors Media alt text
    console.log('\n🎯 Step 1: Finding the specific header logo');

    const logoElement = await page.$('header img[alt="Disruptors Media Logo"]');

    if (!logoElement) {
      console.log('❌ Specific header logo not found, trying alternative selectors...');

      // Try to find any clickable logo in header
      const headerLogo = await page.$('header img, nav img');
      if (headerLogo) {
        console.log('✅ Found header image, using as logo');

        // Get the src to verify
        const src = await headerLogo.getAttribute('src');
        console.log(`  Logo src: ${src}`);

        // Click 5 times rapidly
        console.log('\n🖱️  Step 2: Clicking logo 5 times within 3 seconds');
        for (let i = 1; i <= 5; i++) {
          await headerLogo.click();
          console.log(`  Click ${i}/5`);
          await page.waitForTimeout(200); // Shorter delay to stay within 3 second window
        }
      } else {
        console.log('❌ No header logo found at all');
        await page.screenshot({ path: 'no-header-logo.png', fullPage: true });
        return;
      }
    } else {
      console.log('✅ Found Disruptors Media logo in header');

      // Click 5 times rapidly within the 3-second window
      console.log('\n🖱️  Step 2: Clicking logo 5 times within 3 seconds');
      for (let i = 1; i <= 5; i++) {
        await logoElement.click();
        console.log(`  Click ${i}/5`);
        await page.waitForTimeout(200); // Shorter delay to stay within 3 second window
      }
    }

    // Wait for Matrix login modal to appear
    console.log('\n⏳ Step 3: Waiting for Matrix login modal...');
    await page.waitForTimeout(2000);

    // Check for Matrix login modal
    const matrixSelectors = [
      '[data-testid="matrix-login"]',
      '.matrix-login',
      'div:has-text("Enter the Matrix")',
      'div:has-text("Admin Access")',
      'input[type="password"]'
    ];

    let matrixModal = null;
    let passwordInput = null;

    for (const selector of matrixSelectors) {
      const element = await page.$(selector);
      if (element) {
        console.log(`✅ Found Matrix element with selector: ${selector}`);
        matrixModal = element;
        break;
      }
    }

    if (!matrixModal) {
      console.log('⚠️  No Matrix modal found. Checking for password input...');

      // Look for password input directly
      passwordInput = await page.$('input[type="password"]');
      if (passwordInput) {
        console.log('✅ Found password input field');
      }
    } else {
      // Look for password input within the modal
      passwordInput = await page.$('input[type="password"]');
      if (!passwordInput && matrixModal) {
        passwordInput = await matrixModal.$('input');
      }
    }

    if (!passwordInput) {
      console.log('❌ No password input found after clicking sequence');
      console.log('🔍 Current page state:');

      // Check current URL
      console.log(`  URL: ${page.url()}`);

      // Check for any modal or overlay
      const allModals = await page.$$('[role="dialog"], .modal, .overlay, .fixed');
      console.log(`  Found ${allModals.length} potential modal elements`);

      // Take screenshot
      await page.screenshot({ path: 'admin-no-modal.png', fullPage: true });

      // Try the keyboard shortcut method instead
      console.log('\n🎹 Trying keyboard shortcut (Ctrl+Shift+D)...');
      await page.keyboard.press('Control+Shift+KeyD');
      await page.waitForTimeout(2000);

      passwordInput = await page.$('input[type="password"]');
      if (passwordInput) {
        console.log('✅ Password input appeared after keyboard shortcut!');
      } else {
        console.log('❌ Keyboard shortcut also failed');
        return;
      }
    }

    // Enter password
    console.log('\n🔑 Step 4: Entering password "DMadmin"');
    await passwordInput.fill('DMadmin');
    console.log('✅ Password entered');

    // Submit the form
    console.log('\n📤 Step 5: Submitting the form');

    // Try different submit methods
    const submitMethods = [
      async () => {
        const submitBtn = await page.$('button[type="submit"], button:has-text("Login"), button:has-text("Enter")');
        if (submitBtn) {
          await submitBtn.click();
          return 'button click';
        }
        return null;
      },
      async () => {
        await passwordInput.press('Enter');
        return 'Enter key';
      },
      async () => {
        await page.keyboard.press('Enter');
        return 'keyboard Enter';
      }
    ];

    let submitMethod = null;
    for (const method of submitMethods) {
      try {
        submitMethod = await method();
        if (submitMethod) {
          console.log(`✅ Submitted using: ${submitMethod}`);
          break;
        }
      } catch (e) {
        console.log(`⚠️  Submit method failed: ${e.message}`);
      }
    }

    // Wait for admin interface
    console.log('\n⏳ Step 6: Waiting for admin interface...');
    await page.waitForTimeout(3000);

    // Check for admin interface
    const adminSelectors = [
      '[data-testid="admin-panel"]',
      '.admin-panel',
      'div:has-text("Admin Dashboard")',
      'div:has-text("Disruptors Admin")',
      'h1:has-text("Admin")',
      'h2:has-text("Admin")'
    ];

    let adminPanel = null;
    for (const selector of adminSelectors) {
      const element = await page.$(selector);
      if (element) {
        console.log(`✅ Admin panel found with selector: ${selector}`);
        adminPanel = element;
        break;
      }
    }

    // Take final screenshot
    await page.screenshot({ path: 'admin-final-result.png', fullPage: true });

    if (adminPanel) {
      console.log('\n🎉 SUCCESS: Admin interface is accessible!');

      // Look for admin features
      const features = await page.$$eval('[data-testid*="admin"], button:has-text("Generate"), .admin-feature',
        els => els.map(el => el.textContent?.substring(0, 50))
      );

      if (features.length > 0) {
        console.log('🔧 Available admin features:', features);
      }

      return true;
    } else {
      console.log('\n⚠️  Admin interface not detected');
      console.log(`📍 Current URL: ${page.url()}`);

      // Check if page content changed significantly
      const bodyText = await page.textContent('body');
      console.log(`📝 Page content length: ${bodyText.length} characters`);

      return false;
    }

  } catch (error) {
    console.error('❌ Admin access test failed:', error.message);
    await page.screenshot({ path: 'admin-test-error.png', fullPage: true });
    return false;
  } finally {
    await browser.close();
  }
}

testAdminAccessV2();