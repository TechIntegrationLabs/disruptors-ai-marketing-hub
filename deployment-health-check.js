import fetch from 'node-fetch';

const DEPLOYMENT_URLS = [
  'https://dm4.wjwelsh.com',
  'https://master--cheerful-custard-2e6fc5.netlify.app'
];

const CRITICAL_PATHS = [
  '/',
  '/about',
  '/contact',
  '/solutions',
  '/work'
];

async function checkEndpoint(url, path) {
  const fullUrl = `${url}${path}`;
  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Deployment-Health-Check/1.0'
      },
      timeout: 10000
    });

    const status = response.status;
    const ok = response.ok;
    const contentType = response.headers.get('content-type');

    return {
      url: fullUrl,
      status,
      ok,
      contentType,
      success: ok && status === 200
    };
  } catch (error) {
    return {
      url: fullUrl,
      status: 0,
      ok: false,
      error: error.message,
      success: false
    };
  }
}

async function runHealthCheck() {
  console.log('🏥 Running Post-Deployment Health Check\n');
  console.log('='.repeat(60));

  let totalChecks = 0;
  let passedChecks = 0;
  let failedChecks = 0;

  for (const baseUrl of DEPLOYMENT_URLS) {
    console.log(`\n📍 Checking: ${baseUrl}`);
    console.log('-'.repeat(60));

    for (const path of CRITICAL_PATHS) {
      totalChecks++;
      const result = await checkEndpoint(baseUrl, path);

      if (result.success) {
        passedChecks++;
        console.log(`✅ ${result.url} - Status: ${result.status}`);
      } else {
        failedChecks++;
        console.log(`❌ ${result.url} - Status: ${result.status}${result.error ? ` (${result.error})` : ''}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Health Check Summary');
  console.log('='.repeat(60));
  console.log(`Total Checks: ${totalChecks}`);
  console.log(`✅ Passed: ${passedChecks}`);
  console.log(`❌ Failed: ${failedChecks}`);
  console.log(`Success Rate: ${((passedChecks / totalChecks) * 100).toFixed(2)}%`);

  if (failedChecks === 0) {
    console.log('\n🎉 All health checks passed! Deployment is healthy.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some health checks failed. Review the logs above.');
    process.exit(1);
  }
}

runHealthCheck();
