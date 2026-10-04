const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../data/menus.json');
const menuData = JSON.parse(fs.readFileSync(file, 'utf8'));

const priceMap = {
  'nf-1': 800, 'nf-2': 1200, 'nf-3': 1400, 'nf-4': 1300, 'nf-5': 600, 'nf-6': 700,
  'ug-1': 800, 'ug-2': 1200, 'ug-3': 1400, 'ug-4': 300, 'ug-5': 1500, 'ug-6': 150,
  'deb-1': 1500, 'deb-2': 1600, 'deb-3': 600, 'deb-4': 500, 'deb-5': 700, 'deb-6': 700,
  'sb-1': 2000, 'sb-2': 1800, 'sb-3': 1500, 'sb-4': 1200, 'sb-5': 1000, 'sb-6': 2500
};

for (const restId in menuData.restaurants) {
  for (const item of menuData.restaurants[restId].items) {
    if (priceMap[item.id]) {
      item.price = priceMap[item.id];
    }
  }
}

fs.writeFileSync(file, JSON.stringify(menuData, null, 2));

// Update menus.js as well
const jsContent = `window.MENU_DATA = ${JSON.stringify(menuData, null, 2)};`;
fs.writeFileSync(path.join(__dirname, '../data/menus.js'), jsContent);

console.log('Prices updated to DZD in both menus.json and menus.js.');
