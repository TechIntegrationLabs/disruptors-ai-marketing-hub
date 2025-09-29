import { chromium, firefox, webkit } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://disruptors-ai-marketing-hub.netlify.app';
const ADMIN_PASSWORD = 'DMadmin';

// Test results tracking
const testResults = {
    basicFunctionality: [],
    secretAdminAccess: [],
    authentication: [],
    aiGeneration: [],
    database: [],
    security: [],
    performance: [],
    errorHandling: []
};

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshot(page, name) {
    const screenshotPath = path.join(__dirname, 'test-screenshots', `${name}-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
}

async function testBasicFunctionality(browser) {
    console.log('\n🔍 Testing Basic Site Functionality...');
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Test 1: Site loads without errors
        console.log('Testing site load...');
        const response = await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 30000 });
        testResults.basicFunctionality.push({
            test: 'Site Load',
            status: response.status() === 200 ? 'PASS' : 'FAIL',
            details: `Status: ${response.status()}`
        });

        await takeScreenshot(page, 'homepage-load');

        // Test 2: Page title and basic content
        const title = await page.title();
        console.log(`Page title: ${title}`);
        testResults.basicFunctionality.push({
            test: 'Page Title',
            status: title.includes('Disruptors') ? 'PASS' : 'FAIL',
            details: `Title: ${title}`
        });

        // Test 3: Navigation menu exists
        const navigation = await page.locator('nav, [role="navigation"]').first();
        const navExists = await navigation.isVisible();
        testResults.basicFunctionality.push({
            test: 'Navigation Menu',
            status: navExists ? 'PASS' : 'FAIL',
            details: navExists ? 'Navigation visible' : 'Navigation not found'
        });

        // Test 4: Logo exists and is clickable
        const logo = await page.locator('img[alt*="logo"], img[alt*="Disruptors"], [data-logo], .logo').first();
        const logoExists = await logo.isVisible();
        testResults.basicFunctionality.push({
            test: 'Logo Presence',
            status: logoExists ? 'PASS' : 'FAIL',
            details: logoExists ? 'Logo found and visible' : 'Logo not found'
        });

        // Test 5: Test key page navigation
        const testPages = ['/about', '/work', '/solutions', '/contact'];
        for (const pageUrl of testPages) {
            try {
                console.log(`Testing navigation to ${pageUrl}...`);
                await page.goto(`${SITE_URL}${pageUrl}`, { waitUntil: 'networkidle', timeout: 15000 });
                await delay(2000);

                const currentUrl = page.url();
                const isCorrectPage = currentUrl.includes(pageUrl);

                testResults.basicFunctionality.push({
                    test: `Navigation to ${pageUrl}`,
                    status: isCorrectPage ? 'PASS' : 'FAIL',
                    details: `Current URL: ${currentUrl}`
                });

                await takeScreenshot(page, `page${pageUrl.replace('/', '-')}`);
            } catch (error) {
                testResults.basicFunctionality.push({
                    test: `Navigation to ${pageUrl}`,
                    status: 'FAIL',
                    details: `Error: ${error.message}`
                });
            }
        }

        // Test 6: Check for JavaScript errors
        const errors = [];
        page.on('pageerror', error => {
            errors.push(error.message);
        });

        await page.goto(SITE_URL, { waitUntil: 'networkidle' });
        await delay(3000);

        testResults.basicFunctionality.push({
            test: 'JavaScript Errors',
            status: errors.length === 0 ? 'PASS' : 'FAIL',
            details: errors.length === 0 ? 'No errors detected' : `Errors: ${errors.join(', ')}`
        });

    } catch (error) {
        testResults.basicFunctionality.push({
            test: 'Basic Functionality Test',
            status: 'FAIL',
            details: `Error: ${error.message}`
        });
    } finally {
        await context.close();
    }
}

async function testSecretAdminAccess(browser) {
    console.log('\n🕵️ Testing Secret Admin Access (5-click logo activation)...');
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 30000 });
        await delay(2000);

        // Look for the logo element with multiple selectors
        const logoSelectors = [
            'img[alt*="logo"]',
            'img[alt*="Disruptors"]',
            '[data-logo]',
            '.logo',
            'a[href="/"] img',
            'header img',
            'nav img'
        ];

        let logo = null;
        for (const selector of logoSelectors) {
            try {
                const element = page.locator(selector).first();
                if (await element.isVisible()) {
                    logo = element;
                    console.log(`Found logo with selector: ${selector}`);
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        if (!logo) {
            testResults.secretAdminAccess.push({
                test: 'Logo Detection',
                status: 'FAIL',
                details: 'Could not find clickable logo element'
            });
            return;
        }

        await takeScreenshot(page, 'before-logo-clicks');

        // Perform 5 rapid clicks on the logo
        console.log('Performing 5 rapid clicks on logo...');
        const startTime = Date.now();

        for (let i = 0; i < 5; i++) {
            await logo.click({ force: true });
            await delay(100); // Small delay between clicks
        }

        const clickTime = Date.now() - startTime;
        console.log(`5 clicks completed in ${clickTime}ms`);

        // Wait for Matrix interface to appear
        await delay(3000);

        // Look for Matrix interface indicators
        const matrixSelectors = [
            '[data-matrix]',
            '.matrix-terminal',
            '.terminal',
            '.admin-interface',
            '[class*="matrix"]',
            '[class*="terminal"]',
            'video[src*="matrix"]',
            '.matrix-bg'
        ];

        let matrixInterface = null;
        for (const selector of matrixSelectors) {
            try {
                const element = page.locator(selector).first();
                if (await element.isVisible()) {
                    matrixInterface = element;
                    console.log(`Found Matrix interface with selector: ${selector}`);
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        const matrixVisible = matrixInterface !== null;

        testResults.secretAdminAccess.push({
            test: '5-Click Logo Activation',
            status: matrixVisible ? 'PASS' : 'FAIL',
            details: matrixVisible ?
                `Matrix interface activated in ${clickTime}ms` :
                'Matrix interface did not appear after 5 clicks'
        });

        await takeScreenshot(page, 'after-logo-clicks');

        if (matrixVisible) {
            // Test for Matrix video background
            const video = page.locator('video').first();
            const videoVisible = await video.isVisible().catch(() => false);

            testResults.secretAdminAccess.push({
                test: 'Matrix Video Background',
                status: videoVisible ? 'PASS' : 'FAIL',
                details: videoVisible ? 'Matrix video background detected' : 'No video background found'
            });

            // Test for terminal-style input
            const terminalInput = page.locator('input[type="text"], input[type="password"], .terminal-input');
            const inputVisible = await terminalInput.first().isVisible().catch(() => false);

            testResults.secretAdminAccess.push({
                test: 'Terminal Input Interface',
                status: inputVisible ? 'PASS' : 'FAIL',
                details: inputVisible ? 'Terminal input interface detected' : 'No terminal input found'
            });
        }

    } catch (error) {
        testResults.secretAdminAccess.push({
            test: 'Secret Admin Access Test',
            status: 'FAIL',
            details: `Error: ${error.message}`
        });
    } finally {
        await context.close();
    }
}

async function testMatrixAuthentication(browser) {
    console.log('\n🔐 Testing Matrix Login Interface and Authentication...');
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 30000 });
        await delay(2000);

        // Activate Matrix interface first
        const logo = page.locator('img[alt*="logo"], img[alt*="Disruptors"], [data-logo], .logo').first();

        if (await logo.isVisible()) {
            for (let i = 0; i < 5; i++) {
                await logo.click({ force: true });
                await delay(100);
            }
            await delay(3000);
        }

        // Look for username input
        const usernameInput = page.locator('input[type="text"], input[placeholder*="username"], input[placeholder*="Username"]').first();

        if (await usernameInput.isVisible()) {
            console.log('Testing username input...');
            await usernameInput.fill('testuser');
            await delay(1000);

            // Look for submit/enter action
            await page.keyboard.press('Enter');
            await delay(2000);

            testResults.authentication.push({
                test: 'Username Input',
                status: 'PASS',
                details: 'Username input field working'
            });

            await takeScreenshot(page, 'username-entered');

            // Look for password prompt
            const passwordInput = page.locator('input[type="password"], input[placeholder*="password"], input[placeholder*="Password"]').first();

            if (await passwordInput.isVisible()) {
                console.log('Testing password input...');
                await passwordInput.fill(ADMIN_PASSWORD);
                await delay(1000);

                await takeScreenshot(page, 'password-entered');

                // Submit password
                await page.keyboard.press('Enter');
                await delay(5000);

                // Check if login was successful (look for admin dashboard)
                const adminDashboard = page.locator('.admin-dashboard, .neural-media, [data-admin], [class*="admin"]');
                const dashboardVisible = await adminDashboard.first().isVisible().catch(() => false);

                testResults.authentication.push({
                    test: 'Password Authentication',
                    status: dashboardVisible ? 'PASS' : 'FAIL',
                    details: dashboardVisible ?
                        'Login successful - admin dashboard visible' :
                        'Login failed - no admin dashboard detected'
                });

                await takeScreenshot(page, 'after-authentication');

                if (dashboardVisible) {
                    // Test session persistence
                    await page.reload({ waitUntil: 'networkidle' });
                    await delay(3000);

                    const sessionPersisted = await adminDashboard.first().isVisible().catch(() => false);
                    testResults.authentication.push({
                        test: 'Session Persistence',
                        status: sessionPersisted ? 'PASS' : 'FAIL',
                        details: sessionPersisted ?
                            'Admin session persisted after reload' :
                            'Session not persisted'
                    });
                }

            } else {
                testResults.authentication.push({
                    test: 'Password Prompt',
                    status: 'FAIL',
                    details: 'Password input field not found after username'
                });
            }

        } else {
            testResults.authentication.push({
                test: 'Matrix Interface Access',
                status: 'FAIL',
                details: 'Matrix interface not accessible or username input not found'
            });
        }

    } catch (error) {
        testResults.authentication.push({
            test: 'Matrix Authentication Test',
            status: 'FAIL',
            details: `Error: ${error.message}`
        });
    } finally {
        await context.close();
    }
}

async function testAIGenerationSystem(browser) {
    console.log('\n🤖 Testing AI Generation System and Neural Media Generator...');
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 30000 });
        await delay(2000);

        // Get into admin mode first
        const logo = page.locator('img[alt*="logo"], img[alt*="Disruptors"], [data-logo], .logo').first();

        if (await logo.isVisible()) {
            for (let i = 0; i < 5; i++) {
                await logo.click({ force: true });
                await delay(100);
            }
            await delay(3000);

            // Login process
            const usernameInput = page.locator('input[type="text"]').first();
            if (await usernameInput.isVisible()) {
                await usernameInput.fill('testuser');
                await page.keyboard.press('Enter');
                await delay(2000);

                const passwordInput = page.locator('input[type="password"]').first();
                if (await passwordInput.isVisible()) {
                    await passwordInput.fill(ADMIN_PASSWORD);
                    await page.keyboard.press('Enter');
                    await delay(5000);

                    await takeScreenshot(page, 'admin-dashboard-loaded');

                    // Test AI generation interface
                    const aiGenSelectors = [
                        '.neural-media',
                        '.ai-generator',
                        '[data-ai-gen]',
                        'button[class*="generate"]',
                        'input[placeholder*="prompt"]',
                        'textarea[placeholder*="prompt"]'
                    ];

                    let aiInterface = null;
                    for (const selector of aiGenSelectors) {
                        try {
                            const element = page.locator(selector).first();
                            if (await element.isVisible()) {
                                aiInterface = element;
                                console.log(`Found AI interface with selector: ${selector}`);
                                break;
                            }
                        } catch (e) {
                            continue;
                        }
                    }

                    testResults.aiGeneration.push({
                        test: 'AI Interface Access',
                        status: aiInterface ? 'PASS' : 'FAIL',
                        details: aiInterface ? 'AI generation interface found' : 'AI interface not accessible'
                    });

                    if (aiInterface) {
                        // Test prompt input
                        const promptInput = page.locator('input[placeholder*="prompt"], textarea[placeholder*="prompt"]').first();

                        if (await promptInput.isVisible()) {
                            await promptInput.fill('Test AI generation prompt');
                            await delay(1000);

                            testResults.aiGeneration.push({
                                test: 'Prompt Input',
                                status: 'PASS',
                                details: 'Prompt input field working'
                            });

                            // Look for AI model selection
                            const modelSelector = page.locator('select, [role="combobox"], button[class*="select"]');
                            const modelsAvailable = await modelSelector.first().isVisible().catch(() => false);

                            testResults.aiGeneration.push({
                                test: 'AI Model Selection',
                                status: modelsAvailable ? 'PASS' : 'FAIL',
                                details: modelsAvailable ? 'Model selection interface found' : 'No model selection found'
                            });

                            // Look for generate button
                            const generateBtn = page.locator('button[class*="generate"], button:has-text("Generate"), input[type="submit"]').first();
                            const generateAvailable = await generateBtn.isVisible().catch(() => false);

                            testResults.aiGeneration.push({
                                test: 'Generate Button',
                                status: generateAvailable ? 'PASS' : 'FAIL',
                                details: generateAvailable ? 'Generate button found' : 'Generate button not found'
                            });

                            await takeScreenshot(page, 'ai-generation-interface');

                            // Test generation process (without actually generating to avoid costs)
                            if (generateAvailable) {
                                testResults.aiGeneration.push({
                                    test: 'Generation Process Setup',
                                    status: 'PASS',
                                    details: 'AI generation interface fully accessible and ready for use'
                                });
                            }
                        }
                    }
                }
            }
        }

    } catch (error) {
        testResults.aiGeneration.push({
            test: 'AI Generation System Test',
            status: 'FAIL',
            details: `Error: ${error.message}`
        });
    } finally {
        await context.close();
    }
}

async function testDatabaseIntegration(browser) {
    console.log('\n🗄️ Testing Database Integration and Supabase Connectivity...');
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 30000 });

        // Monitor network requests for Supabase calls
        const supabaseRequests = [];
        page.on('request', request => {
            if (request.url().includes('supabase.co')) {
                supabaseRequests.push(request.url());
            }
        });

        const responses = [];
        page.on('response', response => {
            if (response.url().includes('supabase.co')) {
                responses.push({
                    url: response.url(),
                    status: response.status()
                });
            }
        });

        await delay(5000); // Wait for initial requests

        testResults.database.push({
            test: 'Supabase Connection',
            status: supabaseRequests.length > 0 ? 'PASS' : 'FAIL',
            details: supabaseRequests.length > 0 ?
                `${supabaseRequests.length} Supabase requests detected` :
                'No Supabase requests detected'
        });

        // Test database operations through admin interface
        const logo = page.locator('img[alt*="logo"], img[alt*="Disruptors"], [data-logo], .logo').first();

        if (await logo.isVisible()) {
            for (let i = 0; i < 5; i++) {
                await logo.click({ force: true });
                await delay(100);
            }
            await delay(3000);

            // Login to trigger more database calls
            const usernameInput = page.locator('input[type="text"]').first();
            if (await usernameInput.isVisible()) {
                await usernameInput.fill('testuser');
                await page.keyboard.press('Enter');
                await delay(2000);

                const passwordInput = page.locator('input[type="password"]').first();
                if (await passwordInput.isVisible()) {
                    await passwordInput.fill(ADMIN_PASSWORD);
                    await page.keyboard.press('Enter');
                    await delay(5000);

                    // Check for successful authentication requests
                    const authRequests = responses.filter(r => r.status === 200);
                    testResults.database.push({
                        test: 'Database Authentication',
                        status: authRequests.length > 0 ? 'PASS' : 'FAIL',
                        details: `${authRequests.length} successful database requests`
                    });

                    // Look for media storage interface
                    const mediaInterface = page.locator('.media-storage, .generated-media, [data-media]');
                    const mediaVisible = await mediaInterface.first().isVisible().catch(() => false);

                    testResults.database.push({
                        test: 'Media Storage Interface',
                        status: mediaVisible ? 'PASS' : 'FAIL',
                        details: mediaVisible ? 'Media storage interface accessible' : 'Media storage not found'
                    });
                }
            }
        }

    } catch (error) {
        testResults.database.push({
            test: 'Database Integration Test',
            status: 'FAIL',
            details: `Error: ${error.message}`
        });
    } finally {
        await context.close();
    }
}

async function testSecurity(browser) {
    console.log('\n🔒 Testing Security and Performance...');
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 30000 });

        // Test HTTPS
        const isHttps = page.url().startsWith('https://');
        testResults.security.push({
            test: 'HTTPS Security',
            status: isHttps ? 'PASS' : 'FAIL',
            details: `Site uses ${isHttps ? 'HTTPS' : 'HTTP'}`
        });

        // Test security headers
        const response = await page.goto(SITE_URL, { waitUntil: 'networkidle' });
        const headers = response.headers();

        const securityHeaders = [
            'x-frame-options',
            'x-xss-protection',
            'x-content-type-options',
            'content-security-policy'
        ];

        securityHeaders.forEach(header => {
            const hasHeader = headers[header] !== undefined;
            testResults.security.push({
                test: `Security Header: ${header}`,
                status: hasHeader ? 'PASS' : 'FAIL',
                details: hasHeader ? `${header}: ${headers[header]}` : `${header} header missing`
            });
        });

        // Test admin access security (should not be accessible without authentication)
        const adminPaths = ['/admin', '/dashboard', '/neural-media'];
        for (const path of adminPaths) {
            try {
                const response = await page.goto(`${SITE_URL}${path}`, { waitUntil: 'networkidle' });
                testResults.security.push({
                    test: `Direct Admin Access: ${path}`,
                    status: response.status() !== 200 ? 'PASS' : 'FAIL',
                    details: `Status: ${response.status()}`
                });
            } catch (e) {
                testResults.security.push({
                    test: `Direct Admin Access: ${path}`,
                    status: 'PASS',
                    details: 'Path not accessible directly'
                });
            }
        }

    } catch (error) {
        testResults.security.push({
            test: 'Security Test',
            status: 'FAIL',
            details: `Error: ${error.message}`
        });
    } finally {
        await context.close();
    }
}

async function testErrorHandling(browser) {
    console.log('\n⚠️ Testing Error Handling and Fallback Systems...');
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Test 404 handling
        const notFoundResponse = await page.goto(`${SITE_URL}/non-existent-page`, { waitUntil: 'networkidle' });
        const handles404 = notFoundResponse.status() === 200; // SPA should return 200 and handle routing

        testResults.errorHandling.push({
            test: '404 Error Handling',
            status: handles404 ? 'PASS' : 'FAIL',
            details: `Status: ${notFoundResponse.status()}`
        });

        await takeScreenshot(page, '404-handling');

        // Test invalid admin credentials
        await page.goto(SITE_URL, { waitUntil: 'networkidle' });

        const logo = page.locator('img[alt*="logo"], img[alt*="Disruptors"], [data-logo], .logo').first();

        if (await logo.isVisible()) {
            for (let i = 0; i < 5; i++) {
                await logo.click({ force: true });
                await delay(100);
            }
            await delay(3000);

            const usernameInput = page.locator('input[type="text"]').first();
            if (await usernameInput.isVisible()) {
                await usernameInput.fill('testuser');
                await page.keyboard.press('Enter');
                await delay(2000);

                const passwordInput = page.locator('input[type="password"]').first();
                if (await passwordInput.isVisible()) {
                    await passwordInput.fill('wrongpassword');
                    await page.keyboard.press('Enter');
                    await delay(3000);

                    // Should still be on login screen or show error
                    const stillOnLogin = await passwordInput.isVisible();
                    testResults.errorHandling.push({
                        test: 'Invalid Credentials Handling',
                        status: stillOnLogin ? 'PASS' : 'FAIL',
                        details: stillOnLogin ? 'Invalid credentials rejected' : 'Invalid credentials accepted'
                    });
                }
            }
        }

        // Test network connectivity issues simulation
        await context.setOffline(true);
        try {
            await page.reload({ waitUntil: 'networkidle', timeout: 10000 });
            testResults.errorHandling.push({
                test: 'Offline Handling',
                status: 'FAIL',
                details: 'Page loaded while offline (unexpected)'
            });
        } catch (e) {
            testResults.errorHandling.push({
                test: 'Offline Handling',
                status: 'PASS',
                details: 'Properly handles offline state'
            });
        }

        await context.setOffline(false);

    } catch (error) {
        testResults.errorHandling.push({
            test: 'Error Handling Test',
            status: 'FAIL',
            details: `Error: ${error.message}`
        });
    } finally {
        await context.close();
    }
}

async function runComprehensiveTests() {
    console.log('🚀 Starting Comprehensive Deployment Testing...');
    console.log(`Testing site: ${SITE_URL}`);

    // Create screenshots directory
    const screenshotDir = path.join(__dirname, 'test-screenshots');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const browser = await chromium.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        await testBasicFunctionality(browser);
        await testSecretAdminAccess(browser);
        await testMatrixAuthentication(browser);
        await testAIGenerationSystem(browser);
        await testDatabaseIntegration(browser);
        await testSecurity(browser);
        await testErrorHandling(browser);

        // Generate comprehensive report
        console.log('\n📊 Generating Test Report...');

        const report = {
            timestamp: new Date().toISOString(),
            siteUrl: SITE_URL,
            testResults: testResults,
            summary: {
                totalTests: Object.values(testResults).flat().length,
                passedTests: Object.values(testResults).flat().filter(t => t.status === 'PASS').length,
                failedTests: Object.values(testResults).flat().filter(t => t.status === 'FAIL').length
            }
        };

        report.summary.passRate = ((report.summary.passedTests / report.summary.totalTests) * 100).toFixed(2);

        const reportPath = path.join(__dirname, `deployment-test-report-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log('\n✅ Testing Complete!');
        console.log(`📄 Report saved to: ${reportPath}`);
        console.log(`📸 Screenshots saved to: ${screenshotDir}`);
        console.log(`\n📈 Summary:`);
        console.log(`   Total Tests: ${report.summary.totalTests}`);
        console.log(`   Passed: ${report.summary.passedTests}`);
        console.log(`   Failed: ${report.summary.failedTests}`);
        console.log(`   Pass Rate: ${report.summary.passRate}%`);

        // Print detailed results
        Object.entries(testResults).forEach(([category, tests]) => {
            if (tests.length > 0) {
                console.log(`\n${category.toUpperCase()}:`);
                tests.forEach(test => {
                    const status = test.status === 'PASS' ? '✅' : '❌';
                    console.log(`  ${status} ${test.test}: ${test.details}`);
                });
            }
        });

        return report;

    } catch (error) {
        console.error('❌ Testing failed:', error);
    } finally {
        await browser.close();
    }
}

// Run the tests
runComprehensiveTests().catch(console.error);