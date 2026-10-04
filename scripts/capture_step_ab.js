const { chromium } = require('playwright');
const path = require('path');

async function capture() {
  const browser = await chromium.launch();
  const filePath = `file:///${path.join(__dirname, '../index.html').replace(/\\/g, '/')}`;

  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto(filePath);
    await page.waitForTimeout(1000); 

    // Skip intro
    await page.click('#enter-btn');
    await page.waitForTimeout(1500); 

    // Scroll a bit to trigger GSAP scrollTrigger for plat du jour
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(1000);

    // FR fullpage (client + plat du jour)
    await page.screenshot({ path: `../qa/step-ab-fr-${vp.name}-full.png`, fullPage: true });

    // Switch AR
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('button[data-lang="ar"]');
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(1000);

    // AR fullpage
    await page.screenshot({ path: `../qa/step-ab-ar-${vp.name}-full.png`, fullPage: true });

    await page.close();
  }

  await browser.close();
  console.log('Step A & B screenshots captured.');
}

capture();
