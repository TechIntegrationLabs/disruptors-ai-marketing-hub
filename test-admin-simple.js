import { chromium } from 'playwright';

async function testAdminSimple() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  try {
    console.log('🔐 Simple admin access test...');

    await page.goto('https://disruptors-ai-marketing-hub.netlify.app', {
      waitUntil: 'networkidle'
    });

    // Wait for full load
    await page.waitForTimeout(5000);

    // Test 1: Try to trigger the secret access manually via JavaScript
    console.log('\n🔧 Test 1: Manual JavaScript trigger');

    const result1 = await page.evaluate(() => {
      const logo = document.querySelector('header img[alt="Disruptors Media Logo"]');
      if (!logo) return { error: 'Logo not found' };

      // Simulate rapid clicks within the time window
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        detail: 1
      });

      let clickCount = 0;
      const startTime = Date.now();

      // Fire 5 clicks rapidly
      for (let i = 0; i < 5; i++) {
        logo.dispatchEvent(clickEvent);
        clickCount++;
      }

      const endTime = Date.now();

      return {
        success: true,
        clickCount,
        timeElapsed: endTime - startTime,
        logoElement: {
          tagName: logo.tagName,
          src: logo.src,
          alt: logo.alt
        }
      };
    });

    console.log('JavaScript trigger result:', result1);

    // Wait for potential modal
    await page.waitForTimeout(2000);

    // Check for modal
    const modalAfterJS = await page.$('input[type="password"], .matrix-login, [role="dialog"]');
    console.log(`Modal after JS trigger: ${modalAfterJS ? 'FOUND' : 'NOT FOUND'}`);

    // Test 2: Try Playwright clicks with different timing
    console.log('\n🖱️  Test 2: Playwright rapid clicks');

    const logo = await page.$('header img[alt="Disruptors Media Logo"]');
    if (logo) {
      // Very rapid clicks
      for (let i = 0; i < 5; i++) {
        await logo.click({ force: true });
        // No delay to stay within 3-second window
      }

      await page.waitForTimeout(1000);

      const modalAfterPlaywright = await page.$('input[type="password"], .matrix-login, [role="dialog"]');
      console.log(`Modal after Playwright clicks: ${modalAfterPlaywright ? 'FOUND' : 'NOT FOUND'}`);
    }

    // Test 3: Check if we can manually set the React state
    console.log('\n⚛️  Test 3: Manual React state manipulation');

    const reactManipulation = await page.evaluate(() => {
      // Try to find React fiber and manually trigger the modal
      const root = document.querySelector('#root');

      if (root && root._reactInternalFiber) {
        // This is a very hacky way, but let's see if we can find the hook state
        return { reactFiberFound: true };
      }

      // Alternative: try to trigger via event system
      const customEvent = new CustomEvent('showMatrixLogin');
      document.dispatchEvent(customEvent);

      return { reactFiberFound: false, customEventDispatched: true };
    });

    console.log('React manipulation result:', reactManipulation);

    await page.waitForTimeout(2000);

    // Test 4: Force show modal by manipulating DOM
    console.log('\n🎭 Test 4: Force modal via DOM manipulation');

    await page.evaluate(() => {
      // Create a mock Matrix login interface
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      modal.style.zIndex = '9999';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.color = '#00ff00';
      modal.style.fontFamily = 'monospace';
      modal.innerHTML = `
        <div style="text-align: center;">
          <h2>MATRIX LOGIN (TEST MODE)</h2>
          <p>Enter password:</p>
          <input type="password" id="test-password" style="background: black; color: #00ff00; border: 1px solid #00ff00; padding: 10px;">
          <br><br>
          <button id="test-submit" style="background: #00ff00; color: black; padding: 10px 20px; border: none; cursor: pointer;">ENTER</button>
        </div>
      `;
      modal.id = 'test-matrix-modal';
      document.body.appendChild(modal);

      // Add event listeners
      const passwordInput = modal.querySelector('#test-password');
      const submitBtn = modal.querySelector('#test-submit');

      submitBtn.onclick = () => {
        if (passwordInput.value === 'DMadmin') {
          modal.innerHTML = '<div style="text-align: center; color: #00ff00;"><h1>✅ ACCESS GRANTED</h1><p>Admin access would be enabled here</p></div>';
          setTimeout(() => modal.remove(), 3000);
        } else {
          modal.innerHTML = '<div style="text-align: center; color: red;"><h1>❌ ACCESS DENIED</h1></div>';
          setTimeout(() => modal.remove(), 2000);
        }
      };

      passwordInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
          submitBtn.click();
        }
      };

      // Focus the input
      passwordInput.focus();
    });

    console.log('✅ Test modal created - you can now test the password entry');

    // Wait for user interaction or timeout
    console.log('\n⏳ Waiting for password entry (will timeout in 30 seconds)...');

    try {
      // Wait for the modal to be removed (indicating password was entered)
      await page.waitForSelector('#test-matrix-modal', { state: 'detached', timeout: 30000 });
      console.log('✅ Test modal interaction completed');
    } catch (e) {
      console.log('⏰ Test modal timed out');
    }

    // Take final screenshot
    await page.screenshot({ path: 'admin-simple-test.png', fullPage: true });

    console.log('\n🎉 Simple admin test completed');

  } catch (error) {
    console.error('❌ Simple admin test failed:', error.message);
  } finally {
    // Don't close browser immediately to allow manual testing
    console.log('\n📝 Browser will stay open for manual inspection...');
    // await browser.close();
  }
}

testAdminSimple();