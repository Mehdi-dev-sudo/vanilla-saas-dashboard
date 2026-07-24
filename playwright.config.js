const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './__tests__/e2e',
  timeout: 30000,
  expect: { timeout: 10000 },
  use: {
    headless: true,
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
    channel: 'chrome',
    launchOptions: {
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    }
  ],
  webServer: {
    command: 'npx serve dist/ -s -l 3000 --no-clipboard',
    port: 3000,
    timeout: 15000,
    reuseExistingServer: false
  }
});
