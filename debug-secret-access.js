import { chromium } from 'playwright';

async function debugSecretAccess() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  // Capture all console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  try {
    console.log('🔍 Debugging secret access implementation...');

    await page.goto('https://disruptors-ai-marketing-hub.netlify.app', {
      waitUntil: 'networkidle'
    });

    // Wait for full load
    await page.waitForTimeout(5000);

    console.log('\n🔍 Step 1: Checking if useSecretAccess hook is working');

    // Inject debug code to check the secret access hook
    const hookStatus = await page.evaluate(() => {
      // Try to find the React fiber tree to see if the hook is active
      const headerLogo = document.querySelector('header img[alt="Disruptors Media Logo"]');

      if (!headerLogo) {
        return { error: 'Header logo not found' };
      }

      // Check if logo has click handler
      const hasClickHandler = headerLogo.onclick !== null ||
                              headerLogo.addEventListener !== undefined;

      // Try to manually trigger React's event system
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });

      // Store original console.log to capture our debug
      const originalLog = console.log;
      const logs = [];
      console.log = (...args) => {
        logs.push(args.join(' '));
        originalLog(...args);
      };

      // Click the logo and see what happens
      headerLogo.dispatchEvent(clickEvent);

      // Restore console.log
      console.log = originalLog;

      return {
        hasClickHandler,
        logoFound: !!headerLogo,
        logoSrc: headerLogo.src,
        logoAlt: headerLogo.alt,
        capturedLogs: logs
      };
    });

    console.log('🔍 Hook status:', hookStatus);

    if (hookStatus.error) {
      console.log('❌', hookStatus.error);
      return;
    }

    console.log('\n🖱️  Step 2: Manually triggering click events');

    // Try clicking through Playwright first
    const logoElement = await page.$('header img[alt="Disruptors Media Logo"]');
    if (logoElement) {
      // Click 5 times and monitor for changes
      for (let i = 1; i <= 5; i++) {
        console.log(`  Clicking ${i}/5...`);

        // Use different click methods
        await logoElement.click();

        // Wait briefly and check for modal
        await page.waitForTimeout(300);

        const modalCheck = await page.evaluate(() => {
          const modals = document.querySelectorAll('.modal, [role="dialog"], .matrix-login');
          return modals.length;
        });

        console.log(`    Modals found after click ${i}: ${modalCheck}`);
      }
    }

    console.log('\n🔍 Step 3: Checking React state directly');

    // Try to access React state if possible
    const reactState = await page.evaluate(() => {
      // Look for React DevTools or React fiber
      const reactFiber = document.querySelector('#root')?._reactInternalFiber ||
                        document.querySelector('#root')?._reactInternalInstance;

      if (reactFiber) {
        return { reactDetected: true };
      }

      // Try to find any React-related global variables
      const reactGlobals = Object.keys(window).filter(key =>
        key.toLowerCase().includes('react') ||
        key.includes('__REACT') ||
        key.includes('_react')
      );

      return {
        reactDetected: false,
        reactGlobals,
        windowKeys: Object.keys(window).length
      };
    });

    console.log('🔍 React state:', reactState);

    console.log('\n🎹 Step 4: Testing keyboard shortcut');

    // Clear any existing modals
    await page.evaluate(() => {
      const modals = document.querySelectorAll('.modal, [role="dialog"]');
      modals.forEach(modal => modal.remove());
    });

    // Try the keyboard shortcut
    await page.keyboard.down('Control');
    await page.keyboard.down('Shift');
    await page.keyboard.press('KeyD');
    await page.keyboard.up('Shift');
    await page.keyboard.up('Control');

    await page.waitForTimeout(2000);

    const finalModalCheck = await page.evaluate(() => {
      const modals = document.querySelectorAll('.modal, [role="dialog"], input[type="password"]');
      return {
        modalCount: modals.length,
        modalDetails: Array.from(modals).map(modal => ({
          tagName: modal.tagName,
          className: modal.className,
          id: modal.id
        }))
      };
    });

    console.log('🔍 Final modal check:', finalModalCheck);

    // Check all console messages
    console.log('\n📝 All console messages:');
    consoleMessages.forEach(msg => {
      if (msg.text.includes('Secret') || msg.text.includes('Matrix') || msg.text.includes('admin')) {
        console.log(`  🔐 ${msg.type}: ${msg.text}`);
      }
    });

    // Take final screenshot
    await page.screenshot({ path: 'debug-secret-access.png', fullPage: true });

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugSecretAccess();