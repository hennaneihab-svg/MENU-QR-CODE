const fs = require('fs');
const path = require('path');
const https = require('https');

const file = path.join(__dirname, '../data/menus.json');
const menuData = JSON.parse(fs.readFileSync(file, 'utf8'));

// Fixes based on visual audit
function updateItem(restId, itemId, newName, newCat) {
  const item = menuData.restaurants[restId].items.find(i => i.id === itemId);
  if (item) {
    item.name = { en: newName.en, fr: newName.fr, ar: newName.ar };
    if (newCat) item.categoryId = newCat;
  }
}

updateItem('napoli-forno', 'nf-3', { en: 'Pasta Bolognese', fr: 'Pâtes Bolognaise', ar: 'مكرونة بولونيز' });
updateItem('urban-grill', 'ug-6', { en: 'Coca-Cola', fr: 'Coca-Cola', ar: 'كوكا كولا' });
updateItem('dar-el-bey', 'deb-1', { en: 'Chicken Curry', fr: 'Curry de Poulet', ar: 'كاري الدجاج' });
updateItem('dar-el-bey', 'deb-3', { en: 'Avocado Egg Toast', fr: 'Toast Avocat Oeuf', ar: 'توست الأفوكادو والبيض' });
updateItem('dar-el-bey', 'deb-5', { en: 'Berry Pancakes', fr: 'Pancakes Fruits Rouges', ar: 'فطائر التوت' });
updateItem('sakura-bar', 'sb-4', { en: 'Mushroom Rice Bowl', fr: 'Bol de Riz aux Champignons', ar: 'وعاء أرز بالفطر' });
updateItem('sakura-bar', 'sb-5', { en: 'Tofu Veggie Bowl', fr: 'Bol Végétarien au Tofu', ar: 'وعاء التوفو النباتي' });

fs.writeFileSync(file, JSON.stringify(menuData, null, 2));
console.log('Menu data updated with visually verified names.');
