const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Visual Regression', () => {

  test('design-system page renders all sections', async ({ page }) => {
    await page.goto(`${BASE_URL}/#design-system`);
    await page.waitForSelector('.ds-layout', { timeout: 10000 });

    var navButtons = await page.locator('.ds-nav-btn').all();
    expect(navButtons.length).toBeGreaterThanOrEqual(15);

    for (var btn of navButtons) {
      await btn.click();
      await page.waitForTimeout(300);
      await expect(page.locator('.ds-section__title')).toBeVisible();
    }
  });

  test('dashboard page loads metrics and charts', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForSelector('.stats-grid', { timeout: 10000 });

    await expect(page.locator('.stat-card')).toHaveCount(4);
    await expect(page.locator('canvas')).toHaveCount(2);
  });

  test('users page loads with data table', async ({ page }) => {
    await page.goto(`${BASE_URL}/#users`);
    await page.waitForSelector('#usersTableBody', { timeout: 10000 });

    var rows = await page.locator('#usersTableBody tr').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('dark mode toggles correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForSelector('.stats-grid', { timeout: 10000 });

    var html = page.locator('html');
    var initialTheme = await html.getAttribute('data-theme');

    await page.evaluate(() => { ThemeManager.toggle(); });
    await page.waitForTimeout(300);
    var toggledTheme = await html.getAttribute('data-theme');
    expect(toggledTheme).not.toBe(initialTheme);

    await page.evaluate(() => { ThemeManager.toggle(); });
    await page.waitForTimeout(300);
    var restoredTheme = await html.getAttribute('data-theme');
    expect(restoredTheme).toBe(initialTheme);
  });

  test('transactions page has sortable columns', async ({ page }) => {
    await page.goto(`${BASE_URL}/#transactions`);
    await page.waitForSelector('#transactionsTableBody', { timeout: 10000 });

    var sortHeaders = await page.locator('#transactionTable th[data-sort]').all();
    expect(sortHeaders.length).toBeGreaterThan(0);

    await sortHeaders[0].click();
    await page.waitForTimeout(200);
  });

  test('settings page loads all sections', async ({ page }) => {
    await page.goto(`${BASE_URL}/#settings`);
    await page.waitForSelector('.settings-section', { timeout: 10000 });

    var sections = await page.locator('.settings-section').count();
    expect(sections).toBeGreaterThanOrEqual(3);
  });

  test('support page loads FAQ accordion', async ({ page }) => {
    await page.goto(`${BASE_URL}/#support`);
    await page.waitForSelector('.faq-list', { timeout: 10000 });

    var faqItems = await page.locator('.faq-item').count();
    expect(faqItems).toBeGreaterThan(0);

    await page.locator('.faq-item').first().click();
    await page.waitForTimeout(200);
    await expect(page.locator('.faq-item').first().locator('.faq-answer')).toBeVisible();
  });

  test('analytics page renders charts', async ({ page }) => {
    await page.goto(`${BASE_URL}/#analytics`);
    await page.waitForSelector('.charts-grid', { timeout: 10000 });

    var canvases = await page.locator('canvas').count();
    expect(canvases).toBeGreaterThanOrEqual(3);
  });

  test('sidebar navigation links work', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForSelector('.sidebar', { timeout: 10000 });

    var navLinks = await page.locator('.sidebar__nav a').all();
    expect(navLinks.length).toBeGreaterThan(5);

    for (var i = 0; i < navLinks.length; i++) {
      var links = await page.locator('.sidebar__nav a').all();
      await links[i].click();
      await page.waitForTimeout(300);
    }
  });

});
