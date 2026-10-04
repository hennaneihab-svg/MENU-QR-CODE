const { chromium } = require('playwright');
const path = require('path');

async function capture() {
  const browser = await chromium.launch();
  const filePath = `file:///${path.join(__dirname, '../index.html').replace(/\\/g, '/')}`;

  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  
  // Sequence of 5 frames
  await page.goto(filePath);
  
  await page.screenshot({ path: '../qa/step1-anim-frame1.png' }); // 0ms
  await page.waitForTimeout(400);
  await page.screenshot({ path: '../qa/step1-anim-frame2.png' }); // 400ms
  await page.waitForTimeout(400);
  await page.screenshot({ path: '../qa/step1-anim-frame3.png' }); // 800ms
  await page.waitForTimeout(400);
  await page.screenshot({ path: '../qa/step1-anim-frame4.png' }); // 1200ms
  await page.waitForTimeout(600);
  await page.screenshot({ path: '../qa/step1-anim-frame5.png' }); // 1800ms

  // Click Enter
  await page.click('#enter-btn');
  await page.waitForTimeout(1500); // Wait for slide up + fade in
  
  // Capture Mobile
  await page.screenshot({ path: '../qa/step1-fr-mobile-after-anim.png', fullPage: true });

  // Switch AR Mobile
  await page.click('button[data-lang="ar"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '../qa/step1-ar-mobile-after-anim.png', fullPage: true });

  // Capture Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.click('button[data-lang="fr"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '../qa/step1-fr-desktop-after-anim.png', fullPage: true });

  await browser.close();
  console.log('Animation frames and full page captures saved.');
}

capture();
