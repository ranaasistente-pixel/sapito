const { test, expect } = require('@playwright/test');

function expectedFrogCount(level) {
  const stageId = Math.min(6, Math.floor((level - 1) / 15) + 1);
  return stageId;
}

test('butterfly game full smoke across levels', async ({ page }) => {
  test.setTimeout(0);

  const checkedLevels = 95;
  const results = [];

  await page.goto('http://127.0.0.1:8080/?qa=1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1600);

  const spreadCheck = await page.evaluate(() => {
    const scene = document.getElementById('homeScene');
    const items = [...document.querySelectorAll('#homeItemsLayer .home-item')];
    if (!scene || items.length < 12) {
      return { ok: false, reason: 'not_enough_items', count: items.length };
    }
    const sceneRect = scene.getBoundingClientRect();
    const xs = items.map((el) => el.getBoundingClientRect().left - sceneRect.left).filter((x) => Number.isFinite(x));
    if (!xs.length) {
      return { ok: false, reason: 'no_positions', count: items.length };
    }
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const spread = maxX - minX;
    const leftBand = sceneRect.width * 0.22;
    const leftCount = xs.filter((x) => x <= leftBand).length;
    const leftRatio = leftCount / xs.length;
    const ok = spread >= sceneRect.width * 0.45 && leftRatio < 0.72;
    return {
      ok,
      count: xs.length,
      spread,
      sceneWidth: sceneRect.width,
      leftRatio
    };
  });

  expect(spreadCheck.ok).toBeTruthy();

  await page.click('#startBtn');
  await page.waitForSelector('.butterfly', { timeout: 10000 });

  // Loss + restart sanity check first.
  await page.keyboard.press('Shift+F9');
  await page.waitForFunction(() => !document.getElementById('resultScreen').classList.contains('hidden'));
  await page.click('#restartBtn');
  await page.waitForSelector('.butterfly', { timeout: 10000 });

  for (let n = 0; n < checkedLevels; n += 1) {
    const level = Number((await page.locator('#level').innerText()).trim());
    const frogs = await page.$$eval('.frog', (els) =>
      els.map((el) => (el.style.getPropertyValue('--frog-color') || '').trim().toLowerCase())
    );

    results.push({ level, frogCount: frogs.length, colors: [...new Set(frogs)] });

    expect(frogs.length).toBe(expectedFrogCount(level));

    if (level === 1) {
      expect(frogs.every((c) => c === '#52d768')).toBeTruthy();
    } else {
      expect(frogs.some((c) => c !== '#52d768')).toBeTruthy();
    }

    if (n === checkedLevels - 1) break;

    await page.keyboard.press('Shift+F10');
    await page.waitForFunction(() => !document.getElementById('resultScreen').classList.contains('hidden'));
    await page.click('#nextLevelBtn');
    await page.waitForFunction(() => document.getElementById('resultScreen').classList.contains('hidden'));
    await page.waitForSelector('.butterfly', { timeout: 10000 });
  }

  const checkpoints = [1, 2, 15, 16, 30, 31, 45, 46, 60, 61, 75, 76, 90, 91, 95];
  const byLevel = new Map(results.map((r) => [r.level, r]));
  const summary = checkpoints
    .map((lv) => byLevel.get(lv))
    .filter(Boolean)
    .map((r) => `L${r.level}: frogs=${r.frogCount} colors=${r.colors.join(',')}`)
    .join(' | ');

  console.log('\nE2E SUMMARY:', summary);
  console.log('HOME_SPREAD:', JSON.stringify(spreadCheck));
});
