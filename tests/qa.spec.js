const { test, expect } = require('@playwright/test');

const restaurants = ['napoli-forno', 'urban-grill', 'dar-el-bey', 'sakura-bar'];
const languages = ['fr', 'ar'];

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'desktop', width: 1440, height: 900 }
];

test.describe('Menu QR Code QA', () => {
  let errors = [];

  test.beforeEach(({ page }) => {
    errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        if (!msg.text().includes('favicon')) {
          errors.push(msg.text());
        }
      }
    });
    page.on('pageerror', error => {
      errors.push(error.message);
    });
  });

  for (const rest of restaurants) {
    for (const lang of languages) {
      for (const vp of viewports) {
        test(`Screenshot & checks ${rest} ${lang} ${vp.name}`, async ({ page }) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          
          await page.goto(`/index.html?rest=${rest}&lang=${lang}`, { waitUntil: 'networkidle' });
          
          // Wait for menu to load
          await page.waitForSelector('.menu-item', { timeout: 10000 });
          
          // Wait for all images to actually load
          const images = await page.locator('.menu-item img').all();
          for (const img of images) {
            await img.evaluate(node => {
              if (node.complete) return;
              return new Promise(resolve => {
                node.onload = resolve;
                node.onerror = resolve;
              });
            });
            // naturalWidth check
            const naturalWidth = await img.evaluate(node => node.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
          }

          // Check for errors
          expect(errors.length).toBe(0);

          // 2. Overlap check (bounding boxes)
          const items = await page.locator('.menu-item').all();
          for (const item of items) {
            const imgBox = await item.locator('img').boundingBox();
            const infoBox = await item.locator('.menu-item-info').boundingBox();
            const btnBox = await item.locator('.add-btn').boundingBox();
            
            // Check no overlap horizontally
            if (lang === 'fr') {
              expect(imgBox.x + imgBox.width).toBeLessThanOrEqual(infoBox.x + 1);
              expect(infoBox.x + infoBox.width).toBeLessThanOrEqual(btnBox.x + 1);
            } else {
              expect(btnBox.x + btnBox.width).toBeLessThanOrEqual(infoBox.x + 1);
              expect(infoBox.x + infoBox.width).toBeLessThanOrEqual(imgBox.x + 1);
            }
          }

          // Simple overflow check
          const hasOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });
          expect(hasOverflow).toBe(false);

          // Take screenshot
          await page.screenshot({ path: `qa/${rest}-${lang}-${vp.name}.png`, fullPage: true });
        });
      }
    }
  }

  test('Check unique images across data', async ({ request }) => {
    const res = await request.get('/data/menus.json');
    const data = await res.json();
    
    const imageMap = new Map();
    let totalItems = 0;
    
    for (const rest of Object.values(data.restaurants)) {
      for (const item of rest.items) {
        totalItems++;
        if (imageMap.has(item.image800)) {
          throw new Error(`Shared image found! ${item.image800} is shared by ${item.id} and ${imageMap.get(item.image800)}`);
        }
        imageMap.set(item.image800, item.id);
        
        if (imageMap.has(item.image1600)) {
           throw new Error(`Shared image found! ${item.image1600} is shared by ${item.id} and ${imageMap.get(item.image1600)}`);
        }
        imageMap.set(item.image1600, item.id);
      }
    }
    
    expect(imageMap.size).toBe(totalItems * 2);
  });
});
