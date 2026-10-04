const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const menuData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/menus.json'), 'utf8'));

let html = '<html><body style="display:flex; flex-wrap:wrap; gap:10px;">';
for (const restId in menuData.restaurants) {
  for (const item of menuData.restaurants[restId].items) {
    const imgPath = `file:///${path.join(__dirname, '../assets/img', item.image800).replace(/\\/g, '/')}`;
    html += `<div style="width:200px; border:1px solid #ccc; padding:5px;">
      <img src="${imgPath}" style="width:100%; height:150px; object-fit:cover;" />
      <p style="margin:5px 0 0; font-size:12px; text-align:center;">${item.id}: ${item.name.en}</p>
    </div>`;
  }
}
html += '</body></html>';
fs.writeFileSync('collage.html', html);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.goto(`file:///${path.join(__dirname, 'collage.html').replace(/\\/g, '/')}`);
  await page.waitForTimeout(1000); // Wait for local images
  await page.screenshot({ path: '../qa/collage.png', fullPage: true });
  await browser.close();
  console.log('Collage saved to qa/collage.png');
})();
