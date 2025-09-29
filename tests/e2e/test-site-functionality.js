import { chromium } from 'playwright';

async function testSiteFunctionality() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  const results = {
    navigation: {},
    forms: {},
    responsiveness: {},
    performance: {},
    issues: []
  };

  try {
    console.log('🧪 Testing site functionality...');

    await page.goto('https://disruptors-ai-marketing-hub.netlify.app', {
      waitUntil: 'networkidle'
    });

    // Wait for full load
    await page.waitForTimeout(3000);

    console.log('\n🧭 Test 1: Navigation Testing');

    // Test navigation links
    const navLinks = await page.$$eval('nav a, header a', links =>
      links.map(link => ({
        text: link.textContent?.trim(),
        href: link.href,
        hasHref: !!link.href
      })).filter(link => link.text && link.hasHref)
    );

    console.log(`  Found ${navLinks.length} navigation links`);
    results.navigation.linksFound = navLinks.length;
    results.navigation.links = navLinks.slice(0, 5); // Sample first 5

    // Test a few navigation links
    for (let i = 0; i < Math.min(3, navLinks.length); i++) {
      const link = navLinks[i];
      console.log(`  Testing link: ${link.text}`);

      try {
        // Navigate to the link
        await page.goto(link.href, { waitUntil: 'networkidle', timeout: 10000 });

        // Check if page loaded
        const title = await page.title();
        const url = page.url();

        console.log(`    ✅ ${link.text} -> ${title}`);
        results.navigation[link.text] = { success: true, title, url };

        // Go back to home
        await page.goto('https://disruptors-ai-marketing-hub.netlify.app', {
          waitUntil: 'networkidle'
        });
        await page.waitForTimeout(2000);

      } catch (error) {
        console.log(`    ❌ ${link.text} failed: ${error.message}`);
        results.navigation[link.text] = { success: false, error: error.message };
        results.issues.push(`Navigation link "${link.text}" failed: ${error.message}`);
      }
    }

    console.log('\n📝 Test 2: Form Testing');

    // Look for forms
    const forms = await page.$$eval('form', forms =>
      forms.map((form, index) => ({
        index,
        action: form.action,
        method: form.method,
        inputs: Array.from(form.querySelectorAll('input, textarea, select')).map(input => ({
          type: input.type,
          name: input.name,
          placeholder: input.placeholder,
          required: input.required
        }))
      }))
    );

    console.log(`  Found ${forms.length} forms`);
    results.forms.formsFound = forms.length;
    results.forms.details = forms;

    if (forms.length > 0) {
      // Test the first form
      const form = forms[0];
      console.log(`  Testing form with ${form.inputs.length} inputs`);

      // Fill out the form
      for (const input of form.inputs) {
        const selector = input.name ? `[name="${input.name}"]` : `input[type="${input.type}"]`;

        try {
          const element = await page.$(selector);
          if (element) {
            let testValue = '';

            switch (input.type) {
              case 'email':
                testValue = 'test@example.com';
                break;
              case 'tel':
              case 'phone':
                testValue = '(555) 123-4567';
                break;
              case 'text':
              case 'textarea':
                testValue = input.name?.includes('name') ? 'Test User' :
                           input.name?.includes('company') ? 'Test Company' :
                           'Test message content';
                break;
              default:
                testValue = 'Test value';
            }

            await element.fill(testValue);
            console.log(`    ✅ Filled ${input.name || input.type}: ${testValue}`);
          }
        } catch (error) {
          console.log(`    ⚠️  Could not fill ${input.name || input.type}: ${error.message}`);
        }
      }

      // Try to submit the form (but don't actually submit)
      const submitButton = await page.$('button[type="submit"], input[type="submit"], button:has-text("Submit")');
      if (submitButton) {
        console.log('  ✅ Submit button found (not clicking to avoid spam)');
        results.forms.submitButtonFound = true;
      } else {
        console.log('  ⚠️  No submit button found');
        results.forms.submitButtonFound = false;
      }
    }

    console.log('\n📱 Test 3: Responsiveness Testing');

    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(1000);

      // Check if content is visible and properly sized
      const contentCheck = await page.evaluate(() => {
        const body = document.body;
        const hasHorizontalScroll = body.scrollWidth > window.innerWidth;
        const visibleElements = document.querySelectorAll('h1, h2, nav, main').length;

        return {
          hasHorizontalScroll,
          visibleElements,
          windowWidth: window.innerWidth,
          bodyWidth: body.scrollWidth
        };
      });

      console.log(`  ${viewport.name} (${viewport.width}x${viewport.height}): ${contentCheck.visibleElements} elements visible`);

      if (contentCheck.hasHorizontalScroll) {
        console.log(`    ⚠️  Horizontal scroll detected`);
        results.issues.push(`Horizontal scroll on ${viewport.name} viewport`);
      }

      results.responsiveness[viewport.name] = contentCheck;
    }

    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });

    console.log('\n⚡ Test 4: Performance Check');

    // Measure load time
    const performanceMetrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: perf.loadEventEnd - perf.loadEventStart,
        domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
        totalTime: perf.loadEventEnd - perf.fetchStart
      };
    });

    console.log(`  Load time: ${performanceMetrics.loadTime}ms`);
    console.log(`  DOM content loaded: ${performanceMetrics.domContentLoaded}ms`);
    console.log(`  Total time: ${performanceMetrics.totalTime}ms`);

    results.performance = performanceMetrics;

    console.log('\n🔍 Test 5: Content Validation');

    // Check for key content elements
    const contentElements = await page.evaluate(() => {
      const checks = {
        hasHeadings: document.querySelectorAll('h1, h2, h3').length,
        hasImages: document.querySelectorAll('img').length,
        hasLinks: document.querySelectorAll('a').length,
        hasButtons: document.querySelectorAll('button').length,
        hasForms: document.querySelectorAll('form').length,
        bodyTextLength: document.body.textContent?.length || 0
      };

      return checks;
    });

    console.log('  Content check:', contentElements);
    results.content = contentElements;

    // Take final screenshot
    await page.screenshot({ path: 'site-functionality-test.png', fullPage: true });

    console.log('\n🎉 Site functionality testing completed!');

    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`  ✅ Navigation links: ${results.navigation.linksFound}`);
    console.log(`  ✅ Forms found: ${results.forms.formsFound}`);
    console.log(`  ✅ Content elements: ${results.content.hasHeadings} headings, ${results.content.hasImages} images`);
    console.log(`  ⚡ Load performance: ${results.performance.totalTime}ms total`);

    if (results.issues.length > 0) {
      console.log(`  ⚠️  Issues found: ${results.issues.length}`);
      results.issues.forEach((issue, i) => {
        console.log(`    ${i + 1}. ${issue}`);
      });
    } else {
      console.log('  ✅ No critical issues found');
    }

    return results;

  } catch (error) {
    console.error('❌ Site functionality test failed:', error.message);
    results.error = error.message;
    return results;
  } finally {
    await browser.close();
  }
}

testSiteFunctionality();