const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  
  try {
    const url = 'https://hennaneihab-svg.github.io/MENU-QR-CODE/';
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // let UI settle
    
    // Skip intro
    await page.click('#enter-btn').catch(() => {});
    await page.waitForTimeout(1000);
    
    // Capture home
    await page.screenshot({ path: 'qa/public-home.png' });

    // Click first dish to open modal
    await page.click('.menu-item-info');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'qa/public-dish-modal.png' });
    
    // Add to cart
    await page.click('#dish-modal-add');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'qa/public-cart-added.png' });
    
    // Checkout
    await page.click('#checkout-btn');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'qa/public-checkout.png' });
    
    // Confirm
    await page.click('#confirm-order-btn');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'qa/public-tracking.png' });

    // Open admin in another page
    const adminPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await adminPage.goto(url + 'admin.html', { waitUntil: 'networkidle' });
    await adminPage.waitForTimeout(2000);
    await adminPage.screenshot({ path: 'qa/public-admin.png' });

    console.log("Public URL testing completed and captures saved.");
  } catch (e) {
    console.error("Test failed:", e.message);
  } finally {
    await browser.close();
  }
})();
