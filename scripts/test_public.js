const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  
  async function runTest(vpName, width, height) {
    const page = await browser.newPage({ viewport: { width, height } });
    const url = 'https://hennaneihab-svg.github.io/MENU-QR-CODE/';
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // let UI settle
    
    // 1. Home (no banner)
    await page.screenshot({ path: `qa/public-${vpName}-point1-2-home.png` });

    // Click enter
    await page.click('#enter-btn').catch(() => {});
    await page.waitForTimeout(1000);

    // 3. Categories aligned
    await page.screenshot({ path: `qa/public-${vpName}-point3-categories.png` });

    // 2. Fiche plat (click first item)
    await page.click('.menu-item-info');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `qa/public-${vpName}-point2-ficheplat.png` });
    
    // 5. Add to cart & Receipt
    await page.click('#dish-modal-add');
    await page.waitForTimeout(1000);
    await page.click('#checkout-btn');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `qa/public-${vpName}-point5-checkout.png` });
    await page.click('#confirm-order-btn');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `qa/public-${vpName}-point5-receipt.png` });
    
    // Close receipt -> Tracking
    await page.click('#close-receipt-btn');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `qa/public-${vpName}-point6-tracking.png` });

    // 4. Admin Dashboard
    const adminPage = await browser.newPage({ viewport: { width, height } });
    await adminPage.goto(url + 'admin.html', { waitUntil: 'networkidle' });
    await adminPage.waitForTimeout(2000);
    await adminPage.screenshot({ path: `qa/public-${vpName}-point4-admin.png` });

    await page.close();
    await adminPage.close();
  }

  await runTest('mobile', 375, 812);
  await runTest('desktop', 1440, 900);

  await browser.close();
  console.log("Public URL testing completed and captures saved.");
})();
