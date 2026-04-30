const { test, expect } = require('@playwright/test');

const TARGETS = [30, 40, 50, 60, 70, 80, 90, 100];
const STAGE1_PRIZE_B = [30, 50, 50, 60, 70, 80, 90, 100];

function stageForLevel(level) {
  return Math.min(5, Math.floor((level - 1) / 8) + 1);
}

function gameIndexForLevel(level) {
  return (level - 1) % 8;
}

function levelPrize(level) {
  const stage = stageForLevel(level);
  const idx = gameIndexForLevel(level);
  const target = TARGETS[idx];

  if (stage === 1) {
    return { butterflies: STAGE1_PRIZE_B[idx], worms: 0, flies: 0, medals: 0 };
  }
  if (stage === 2) {
    return { butterflies: target, worms: 20, flies: 0, medals: 0 };
  }
  if (stage === 3) {
    return { butterflies: target, worms: 25, flies: 30, medals: 0 };
  }
  return { butterflies: target, worms: 0, flies: 0, medals: 0 };
}

function stageBonus(level) {
  if (gameIndexForLevel(level) !== 7) {
    return { butterflies: 0, worms: 0, flies: 0, medals: 0 };
  }
  const stage = stageForLevel(level);
  if (stage === 1) return { butterflies: 500, worms: 0, flies: 0, medals: 1 };
  if (stage === 2) return { butterflies: 500, worms: 100, flies: 0, medals: 1 };
  if (stage === 3) return { butterflies: 500, worms: 100, flies: 75, medals: 1 };
  return { butterflies: 0, worms: 0, flies: 0, medals: 0 };
}

function sum(a, b) {
  return {
    butterflies: a.butterflies + b.butterflies,
    worms: a.worms + b.worms,
    flies: a.flies + b.flies,
    medals: a.medals + b.medals
  };
}

function parseStats(text) {
  const food = Number((text.match(/Food:\s*(\d+)/) || [])[1] || 0);
  const worms = Number((text.match(/Worms:\s*(\d+)/) || [])[1] || 0);
  const flies = Number((text.match(/Flies:\s*(\d+)/) || [])[1] || 0);
  const medals = Number((text.match(/Medals:\s*(\d+)/) || [])[1] || 0);
  return { butterflies: food, worms, flies, medals };
}

test('rewards follow codified table for levels 1-24', async ({ page }) => {
  test.setTimeout(0);

  await page.goto('http://127.0.0.1:8080/?qa=1', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);

  await page.click('#startBtn');
  await page.waitForSelector('.butterfly', { timeout: 10000 });

  const baseFood = Number((await page.locator('#food').innerText()).trim());
  let expected = { butterflies: Number.isFinite(baseFood) ? baseFood : 0, worms: 0, flies: 0, medals: 0 };

  for (let level = 1; level <= 24; level += 1) {
    const shownLevel = Number((await page.locator('#level').innerText()).trim());
    expect(shownLevel).toBe(level);

    await page.keyboard.press('Shift+F10');
    await page.waitForFunction(() => !document.getElementById('resultScreen').classList.contains('hidden'));

    expected = sum(expected, sum(levelPrize(level), stageBonus(level)));

    const statsText = await page.locator('#resultStats').innerText();
    const actual = parseStats(statsText);
    expect(actual).toEqual(expected);

    if (level < 24) {
      await page.click('#nextLevelBtn');
      await page.waitForFunction(() => document.getElementById('resultScreen').classList.contains('hidden'));
      await page.waitForSelector('.butterfly', { timeout: 10000 });
    }
  }
});
