import { chromium } from 'playwright';

async function debugDeployment() {
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
      text: msg.text(),
      location: msg.location()
    });
  });

  // Capture network failures
  const networkFailures = [];
  page.on('requestfailed', request => {
    networkFailures.push({
      url: request.url(),
      failure: request.failure()?.errorText
    });
  });

  // Capture JavaScript errors
  const jsErrors = [];
  page.on('pageerror', error => {
    jsErrors.push(error.message);
  });

  try {
    console.log('🔍 Debugging Disruptors AI Marketing Hub deployment...');

    await page.goto('https://disruptors-ai-marketing-hub.netlify.app', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for potential React hydration
    await page.waitForTimeout(5000);

    // Check the DOM structure
    const htmlContent = await page.content();
    console.log('\n📄 HTML Content Length:', htmlContent.length);

    // Check if main div exists
    const rootDiv = await page.$('#root');
    if (rootDiv) {
      const rootContent = await rootDiv.innerHTML();
      console.log('📦 Root div content length:', rootContent.length);
      console.log('📦 Root div content preview:', rootContent.substring(0, 200));
    } else {
      console.log('❌ No #root div found');
    }

    // Check for script tags
    const scripts = await page.$$eval('script', scripts =>
      scripts.map(s => ({ src: s.src, hasContent: s.innerHTML.length > 0 }))
    );
    console.log('\n📜 Script tags found:', scripts.length);
    scripts.forEach((script, i) => {
      console.log(`  ${i + 1}. ${script.src || 'inline'} (${script.hasContent ? 'has content' : 'empty'})`);
    });

    // Check for CSS
    const stylesheets = await page.$$eval('link[rel="stylesheet"]', links =>
      links.map(l => l.href)
    );
    console.log('\n🎨 Stylesheets found:', stylesheets.length);
    stylesheets.forEach((css, i) => {
      console.log(`  ${i + 1}. ${css}`);
    });

    // Report console messages
    console.log('\n💬 Console Messages:');
    consoleMessages.forEach(msg => {
      const prefix = msg.type === 'error' ? '❌' :
                    msg.type === 'warning' ? '⚠️' :
                    msg.type === 'info' ? 'ℹ️' : '📝';
      console.log(`  ${prefix} [${msg.type}] ${msg.text}`);
    });

    // Report network failures
    if (networkFailures.length > 0) {
      console.log('\n🌐 Network Failures:');
      networkFailures.forEach(failure => {
        console.log(`  ❌ ${failure.url} - ${failure.failure}`);
      });
    } else {
      console.log('\n✅ No network failures detected');
    }

    // Report JavaScript errors
    if (jsErrors.length > 0) {
      console.log('\n🐛 JavaScript Errors:');
      jsErrors.forEach(error => {
        console.log(`  ❌ ${error}`);
      });
    } else {
      console.log('\n✅ No JavaScript errors detected');
    }

    // Check environment variables availability
    const envCheck = await page.evaluate(() => {
      return {
        hasImport: typeof window.import !== 'undefined',
        location: window.location.href,
        userAgent: navigator.userAgent
      };
    });

    console.log('\n🔧 Environment Check:');
    console.log('  Import available:', envCheck.hasImport);
    console.log('  Current location:', envCheck.location);

    // Take a screenshot for visual debugging
    await page.screenshot({
      path: 'debug-deployment.png',
      fullPage: true
    });

    console.log('\n📸 Screenshot saved as debug-deployment.png');

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugDeployment();