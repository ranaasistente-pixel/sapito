const { test, expect } = require('@playwright/test');

test('settings rules popup opens and renders codified table', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/?qa=1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  await page.click('#settingsToggleBtn');
  await page.click('#openRulesBtn');
  await expect(page.locator('#rulesPopup')).toBeVisible();
  await expect(page.locator('#rulesTableWrap .rules-table')).toBeVisible();
  await expect(page.locator('#rulesTableWrap')).toContainText('PASS ALL 8 GAMES');
  await page.click('#closeRulesBtn');
  await expect(page.locator('#rulesPopup')).toBeHidden();
});
