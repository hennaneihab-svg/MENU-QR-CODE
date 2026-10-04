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

    // FR fullpage
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000); // let footer animation trigger
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `../qa/step1-fr-${vp.name}-full.png`, fullPage: true });

    // Switch to AR
    await page.click('button[data-lang="ar"]');
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `../qa/step1-ar-${vp.name}-full.png`, fullPage: true });

    await page.close();
  }

  await browser.close();
  console.log('Step 1 screenshots captured.');
}

capture();
