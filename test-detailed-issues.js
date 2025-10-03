/**
 * Detailed Investigation of Deployment Warnings
 */

import { chromium } from 'playwright';

const DEPLOYMENT_URL = 'https://adminoverhaul--cheerful-custard-2e6fc5.netlify.app';

async function investigateSplineLoading() {
  console.log('\n=== Detailed Spline Investigation ===');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto(DEPLOYMENT_URL, { waitUntil: 'networkidle' });

    // Wait longer for dynamic content
    await page.waitForTimeout(5000);

    // Check for Spline-related elements
    const splineElements = await page.evaluate(() => {
      const results = {
        canvasElements: document.querySelectorAll('canvas').length,
        splineContainers: document.querySelectorAll('[class*="spline"], [id*="spline"]').length,
        splineScripts: Array.from(document.querySelectorAll('script')).filter(s =>
          s.src && s.src.includes('spline')
        ).map(s => s.src),
        reactSplineComponents: document.querySelectorAll('[data-spline]').length,
        allCanvases: Array.from(document.querySelectorAll('canvas')).map(c => ({
          id: c.id,
          className: c.className,
          width: c.width,
          height: c.height,
          visible: c.offsetParent !== null
        }))
      };
      return results;
    });

    console.log('Spline Elements Found:');
    console.log(JSON.stringify(splineElements, null, 2));

    // Scroll down to trigger lazy loading
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(2000);

    const afterScrollElements = await page.evaluate(() => {
      return {
        canvasElements: document.querySelectorAll('canvas').length,
        splineContainers: document.querySelectorAll('[class*="spline"], [id*="spline"]').length
      };
    });

    console.log('\nAfter Scroll:');
    console.log(JSON.stringify(afterScrollElements, null, 2));

  } catch (error) {
    console.error('Spline investigation error:', error.message);
  } finally {
    await browser.close();
  }
}

async function investigateImageLoading() {
  console.log('\n=== Detailed Image Loading Investigation ===');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(DEPLOYMENT_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const imageData = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.map(img => ({
        src: img.src,
        alt: img.alt,
        loaded: img.complete && img.naturalHeight > 0,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayed: img.offsetParent !== null
      }));
    });

    const brokenImages = imageData.filter(img => !img.loaded);
    const workingImages = imageData.filter(img => img.loaded);

    console.log(`Total Images: ${imageData.length}`);
    console.log(`Working Images: ${workingImages.length}`);
    console.log(`Broken Images: ${brokenImages.length}`);

    if (brokenImages.length > 0) {
      console.log('\nBroken Image Sources (first 10):');
      brokenImages.slice(0, 10).forEach((img, i) => {
        console.log(`${i + 1}. ${img.src} (alt: "${img.alt}")`);
      });

      // Check if broken images are placeholders or actual missing files
      const brokenPatterns = {
        placeholder: brokenImages.filter(img =>
          img.src.includes('placeholder') ||
          img.src.includes('data:image') ||
          img.src.startsWith('/')
        ).length,
        external: brokenImages.filter(img =>
          img.src.startsWith('http') && !img.src.includes('cheerful-custard')
        ).length,
        local: brokenImages.filter(img =>
          img.src.includes('cheerful-custard') || !img.src.startsWith('http')
        ).length
      };

      console.log('\nBroken Image Categories:');
      console.log(`  Placeholders/Data URLs: ${brokenPatterns.placeholder}`);
      console.log(`  External URLs: ${brokenPatterns.external}`);
      console.log(`  Local Files: ${brokenPatterns.local}`);
    }

  } catch (error) {
    console.error('Image investigation error:', error.message);
  } finally {
    await browser.close();
  }
}

async function investigateMobileOverflow() {
  console.log('\n=== Detailed Mobile Overflow Investigation ===');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(DEPLOYMENT_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const overflowData = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;

      const wideElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 375;
      }).slice(0, 10).map(el => ({
        tag: el.tagName,
        className: el.className,
        id: el.id,
        width: el.getBoundingClientRect().width,
        computedWidth: window.getComputedStyle(el).width
      }));

      return {
        bodyWidth: body.scrollWidth,
        htmlWidth: html.scrollWidth,
        viewportWidth: window.innerWidth,
        wideElements
      };
    });

    console.log('Mobile Overflow Analysis:');
    console.log(`  Body Scroll Width: ${overflowData.bodyWidth}px`);
    console.log(`  HTML Scroll Width: ${overflowData.htmlWidth}px`);
    console.log(`  Viewport Width: ${overflowData.viewportWidth}px`);
    console.log(`  Overflow Amount: ${overflowData.bodyWidth - 375}px`);

    if (overflowData.wideElements.length > 0) {
      console.log('\nElements Causing Overflow (top 5):');
      overflowData.wideElements.slice(0, 5).forEach((el, i) => {
        console.log(`${i + 1}. <${el.tag}> ${el.className ? `class="${el.className}"` : ''} - ${el.width}px`);
      });
    }

  } catch (error) {
    console.error('Mobile overflow investigation error:', error.message);
  } finally {
    await browser.close();
  }
}

async function runInvestigation() {
  console.log('Starting Detailed Issue Investigation');
  console.log('='.repeat(60));

  await investigateSplineLoading();
  await investigateImageLoading();
  await investigateMobileOverflow();

  console.log('\n' + '='.repeat(60));
  console.log('Investigation Complete');
}

runInvestigation().catch(console.error);
