const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  
  async function runTest(vpName, width, height) {
    const page = await browser.newPage({ viewport: { width, height } });
    const url = 'https://hennaneihab-svg.github.io/MENU-QR-CODE/';
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // let UI settle
    
    // Enter demo
    await page.click('#entry-demo-btn').catch(() => {});
    await page.waitForTimeout(1000);

    // 1. Napoli Forno categories and items
    await page.screenshot({ path: `qa/public-${vpName}-point1-categories.png` });

    // 2. Banner presence
    await page.screenshot({ path: `qa/public-${vpName}-point2-banner.png` });

    // 3. Add pack to cart
    await page.click('.offer-btn');
    await page.waitForTimeout(1000);
    
    // Checkout to show receipt
    await page.click('#checkout-btn');
    await page.waitForTimeout(500);
    await page.click('#confirm-order-btn');
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: `qa/public-${vpName}-point3-pack-receipt.png` });

    await page.close();
  }

  await runTest('mobile', 375, 812);
  await runTest('desktop', 1440, 900);

  await browser.close();
  console.log("Public URL testing completed and captures saved.");
})();
