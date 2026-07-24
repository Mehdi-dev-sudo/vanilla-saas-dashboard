# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-regression.spec.js >> Visual Regression >> users page loads with data table
- Location: __tests__\e2e\visual-regression.spec.js:29:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('#usersTableBody') to be visible

```

# Page snapshot

```yaml
- main [ref=e3]:
  - banner [ref=e4]:
    - search [ref=e6]:
      - img [ref=e7]
      - textbox "Search" [ref=e10]:
        - /placeholder: Search users, transactions...
      - generic [ref=e11]: Ctrl+K
    - generic [ref=e12]:
      - button "Toggle theme" [ref=e13] [cursor=pointer]:
        - img [ref=e14]
      - generic "Current time" [ref=e20]: 15:14:38
      - generic "Online users" [ref=e21]: 20 online
      - generic "Last updated time" [ref=e23]:
        - img [ref=e24]
        - text: Updated 03:14 PM
      - generic [ref=e27] [cursor=pointer]: API ✓
      - button "Notifications" [ref=e29] [cursor=pointer]:
        - img [ref=e30]
        - generic [ref=e33]: "3"
      - button "User profile" [ref=e35] [cursor=pointer]:
        - generic [ref=e37]: AR
        - generic [ref=e38]:
          - generic [ref=e39]: Loading...
          - generic [ref=e40]: Enterprise Plan
  - generic [ref=e43]:
    - generic [ref=e44]:
      - img [ref=e45]
      - heading "Sign in to SaaSify" [level=1] [ref=e48]
      - paragraph [ref=e49]: Enter your credentials to access the dashboard
    - generic [ref=e50]:
      - generic [ref=e51]:
        - generic [ref=e52]: Username or Email
        - textbox "Username or Email" [active] [ref=e53]:
          - /placeholder: Enter your username
      - generic [ref=e54]:
        - generic [ref=e55]: Password
        - textbox "Password" [ref=e56]:
          - /placeholder: Enter your password
      - generic [ref=e57]:
        - generic [ref=e60] [cursor=pointer]: Remember me
        - link "Forgot password?" [ref=e61] [cursor=pointer]:
          - /url: "#"
      - button "Sign In" [ref=e62] [cursor=pointer]
    - generic [ref=e63]: "Demo: any username / password (3+ chars)"
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | const BASE_URL = 'http://localhost:3000';
  4   | 
  5   | test.describe('Visual Regression', () => {
  6   | 
  7   |   test('design-system page renders all sections', async ({ page }) => {
  8   |     await page.goto(`${BASE_URL}/#design-system`);
  9   |     await page.waitForSelector('.ds-layout', { timeout: 10000 });
  10  | 
  11  |     var navButtons = await page.locator('.ds-nav-btn').all();
  12  |     expect(navButtons.length).toBeGreaterThanOrEqual(15);
  13  | 
  14  |     for (var btn of navButtons) {
  15  |       await btn.click();
  16  |       await page.waitForTimeout(300);
  17  |       await expect(page.locator('.ds-section__title')).toBeVisible();
  18  |     }
  19  |   });
  20  | 
  21  |   test('dashboard page loads metrics and charts', async ({ page }) => {
  22  |     await page.goto(`${BASE_URL}/`);
  23  |     await page.waitForSelector('.stats-grid', { timeout: 10000 });
  24  | 
  25  |     await expect(page.locator('.stat-card')).toHaveCount(4);
  26  |     await expect(page.locator('canvas')).toHaveCount(2);
  27  |   });
  28  | 
  29  |   test('users page loads with data table', async ({ page }) => {
  30  |     await page.goto(`${BASE_URL}/#users`);
> 31  |     await page.waitForSelector('#usersTableBody', { timeout: 10000 });
      |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  32  | 
  33  |     var rows = await page.locator('#usersTableBody tr').count();
  34  |     expect(rows).toBeGreaterThan(0);
  35  |   });
  36  | 
  37  |   test('dark mode toggles correctly', async ({ page }) => {
  38  |     await page.goto(`${BASE_URL}/`);
  39  |     await page.waitForSelector('.stats-grid', { timeout: 10000 });
  40  | 
  41  |     var html = page.locator('html');
  42  |     var initialTheme = await html.getAttribute('data-theme');
  43  | 
  44  |     await page.evaluate(() => { ThemeManager.toggle(); });
  45  |     await page.waitForTimeout(300);
  46  |     var toggledTheme = await html.getAttribute('data-theme');
  47  |     expect(toggledTheme).not.toBe(initialTheme);
  48  | 
  49  |     await page.evaluate(() => { ThemeManager.toggle(); });
  50  |     await page.waitForTimeout(300);
  51  |     var restoredTheme = await html.getAttribute('data-theme');
  52  |     expect(restoredTheme).toBe(initialTheme);
  53  |   });
  54  | 
  55  |   test('transactions page has sortable columns', async ({ page }) => {
  56  |     await page.goto(`${BASE_URL}/#transactions`);
  57  |     await page.waitForSelector('#transactionsTableBody', { timeout: 10000 });
  58  | 
  59  |     var sortHeaders = await page.locator('#transactionTable th[data-sort]').all();
  60  |     expect(sortHeaders.length).toBeGreaterThan(0);
  61  | 
  62  |     await sortHeaders[0].click();
  63  |     await page.waitForTimeout(200);
  64  |   });
  65  | 
  66  |   test('settings page loads all sections', async ({ page }) => {
  67  |     await page.goto(`${BASE_URL}/#settings`);
  68  |     await page.waitForSelector('.settings-section', { timeout: 10000 });
  69  | 
  70  |     var sections = await page.locator('.settings-section').count();
  71  |     expect(sections).toBeGreaterThanOrEqual(3);
  72  |   });
  73  | 
  74  |   test('support page loads FAQ accordion', async ({ page }) => {
  75  |     await page.goto(`${BASE_URL}/#support`);
  76  |     await page.waitForSelector('.faq-list', { timeout: 10000 });
  77  | 
  78  |     var faqItems = await page.locator('.faq-item').count();
  79  |     expect(faqItems).toBeGreaterThan(0);
  80  | 
  81  |     await page.locator('.faq-item').first().click();
  82  |     await page.waitForTimeout(200);
  83  |     await expect(page.locator('.faq-item').first().locator('.faq-answer')).toBeVisible();
  84  |   });
  85  | 
  86  |   test('analytics page renders charts', async ({ page }) => {
  87  |     await page.goto(`${BASE_URL}/#analytics`);
  88  |     await page.waitForSelector('.charts-grid', { timeout: 10000 });
  89  | 
  90  |     var canvases = await page.locator('canvas').count();
  91  |     expect(canvases).toBeGreaterThanOrEqual(3);
  92  |   });
  93  | 
  94  |   test('sidebar navigation links work', async ({ page }) => {
  95  |     await page.goto(`${BASE_URL}/`);
  96  |     await page.waitForSelector('.sidebar', { timeout: 10000 });
  97  | 
  98  |     var navLinks = await page.locator('.sidebar__nav a').all();
  99  |     expect(navLinks.length).toBeGreaterThan(5);
  100 | 
  101 |     for (var i = 0; i < navLinks.length; i++) {
  102 |       var links = await page.locator('.sidebar__nav a').all();
  103 |       await links[i].click();
  104 |       await page.waitForTimeout(300);
  105 |     }
  106 |   });
  107 | 
  108 | });
  109 | 
```