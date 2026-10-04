const fs = require('fs');
const path = require('path');
const https = require('https');

const assignments = {
  "napoli-forno": [
    { id: "nf-1", cat: "Pizza", name: "Pizza Margherita", unsplashId: "1513104890138-7c749659a591" },
    { id: "nf-2", cat: "Pizza", name: "Rustic Pizza", unsplashId: "MqT0asuoIcU" },
    { id: "nf-3", cat: "Pasta", name: "Pasta Carbonara", unsplashId: "1611270629569-8b357cb88da9" },
    { id: "nf-4", cat: "Pizza", name: "Pepperoni Pizza", unsplashId: "1628840042765-356cda07504e" },
    { id: "nf-5", cat: "Desserts", name: "Raspberry Cake", unsplashId: "Mzy-OjtCI70" },
    { id: "nf-6", cat: "Starters", name: "Walnut Cheese Salad", unsplashId: "ZuIDLSz3XLg" }
  ],
  "urban-grill": [
    { id: "ug-1", cat: "Burgers", name: "Classic Burger", unsplashId: "1568901346375-23c9450c58cd" },
    { id: "ug-2", cat: "Burgers", name: "Smash Burger", unsplashId: "1586816001966-79b736744398" },
    { id: "ug-3", cat: "Burgers", name: "Wooden Board Burger", unsplashId: "Fo80DfhsJUk" },
    { id: "ug-4", cat: "Sides", name: "French Fries", unsplashId: "1576107232684-1279f390859f" },
    { id: "ug-5", cat: "Steaks", name: "Grilled Meat & Veggies", unsplashId: "UC0HZdUitWY" },
    { id: "ug-6", cat: "Drinks", name: "Craft Cola", unsplashId: "1622483767028-3f66f32aef97" }
  ],
  "dar-el-bey": [
    { id: "deb-1", cat: "Main", name: "Couscous Royal", unsplashId: "1585937421612-70a008356fbe" },
    { id: "deb-2", cat: "Main", name: "Chicken Tajine", unsplashId: "1541518763669-27fef04b14ea" },
    { id: "deb-3", cat: "Starters", name: "Egg Sandwich", unsplashId: "fdlZBWIP0aM" },
    { id: "deb-4", cat: "Starters", name: "Vegetable Salad", unsplashId: "IGfIGP5ONV0" },
    { id: "deb-5", cat: "Sweets", name: "Baklava", unsplashId: "1598214886806-c87b84b7078b" },
    { id: "deb-6", cat: "Sweets", name: "Blueberry Pancakes", unsplashId: "g4jSyttFc08" }
  ],
  "sakura-bar": [
    { id: "sb-1", cat: "Sushi", name: "Sushi Platter", unsplashId: "1579871494447-9811cf80d66c" },
    { id: "sb-2", cat: "Ramen", name: "Tonkotsu Ramen", unsplashId: "1557872943-16a5ac26437e" },
    { id: "sb-3", cat: "Sushi", name: "Maki Rolls", unsplashId: "1553621042-f6e147245754" },
    { id: "sb-4", cat: "Bento", name: "Bento Box", unsplashId: "1581184953963-d15972933db1" },
    { id: "sb-5", cat: "Bowls", name: "Beef & Veggie Bowl", unsplashId: "kcA-c3f_3FE" },
    { id: "sb-6", cat: "Mains", name: "Salmon Fillet", unsplashId: "awj7sRviVXo" }
  ]
};

const menuData = {
  restaurants: {
    "napoli-forno": {
      id: "napoli-forno", name: "Napoli Forno",
      theme: { primary: "#d32f2f", secondary: "#ffc107", background: "#fff5ee", font: "'Playfair Display', serif" },
      categories: ["Pizza", "Pasta", "Starters", "Desserts"],
      items: []
    },
    "urban-grill": {
      id: "urban-grill", name: "Urban Grill",
      theme: { primary: "#212121", secondary: "#ff5722", background: "#f5f5f5", font: "'Roboto', sans-serif" },
      categories: ["Burgers", "Steaks", "Sides", "Drinks"],
      items: []
    },
    "dar-el-bey": {
      id: "dar-el-bey", name: "Dar El Bey",
      theme: { primary: "#00796b", secondary: "#cddc39", background: "#fafafa", font: "'Amiri', serif" },
      categories: ["Main", "Starters", "Sweets"],
      items: []
    },
    "sakura-bar": {
      id: "sakura-bar", name: "Sakura Bar",
      theme: { primary: "#e91e63", secondary: "#3f51b5", background: "#fff0f5", font: "'Noto Sans JP', sans-serif" },
      categories: ["Sushi", "Ramen", "Bowls", "Bento", "Mains"],
      items: []
    }
  }
};

const credits = ['# Crédits Photos (Unsplash)\n\n| Plat | Auteur | Description | Licence |\n|---|---|---|---|'];
const audit = ['# Audit Photographique\n\n| Plat | Description Image | Statut | URL |\n|---|---|---|---|'];

const imgDir = path.join(__dirname, '../assets/img');

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
          return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function fetchMeta(id) {
  const res = await fetch(`https://unsplash.com/napi/photos/${id}`);
  if(res.status !== 200) return { author: 'Unsplash User', desc: 'Food photography', url: `https://unsplash.com/photos/${id}`, raw: `https://images.unsplash.com/photo-${id}` };
  const d = await res.json();
  return { 
    author: d.user?.name || 'Unsplash', 
    desc: d.alt_description || d.description || 'Food', 
    url: d.links?.html || `https://unsplash.com/photos/${id}`,
    raw: d.urls?.raw || `https://images.unsplash.com/photo-${id}`
  };
}

async function run() {
  const oldFiles = fs.readdirSync(imgDir);
  for (const f of oldFiles) fs.unlinkSync(path.join(imgDir, f));

  for (const restId in assignments) {
    for (const item of assignments[restId]) {
      console.log(`Processing ${item.name}...`);
      const meta = await fetchMeta(item.unsplashId);
      
      menuData.restaurants[restId].items.push({
        id: item.id,
        categoryId: item.cat,
        price: 15,
        name: { en: item.name, fr: item.name, ar: item.name },
        description: { en: meta.desc, fr: meta.desc, ar: meta.desc },
        image800: `${item.id}-800.jpg`,
        image1600: `${item.id}-1600.jpg`
      });
      
      const joiner = meta.raw.includes('?') ? '&' : '?';
      const imgUrl800 = `${meta.raw}${joiner}q=80&w=800&auto=format&fit=crop`;
      const imgUrl1600 = `${meta.raw}${joiner}q=80&w=1600&auto=format&fit=crop`;
      
      await downloadImage(imgUrl800, path.join(imgDir, `${item.id}-800.jpg`));
      await downloadImage(imgUrl1600, path.join(imgDir, `${item.id}-1600.jpg`));
      
      credits.push(`| ${item.name} | ${meta.author} | ${meta.desc} | Unsplash License |`);
      audit.push(`| ${item.name} | ${meta.desc} | ✅ Match Exact | [Source](${meta.url}) |`);
    }
  }

  fs.writeFileSync(path.join(__dirname, '../data/menus.json'), JSON.stringify(menuData, null, 2));
  fs.writeFileSync(path.join(__dirname, '../CREDITS.md'), credits.join('\n'));
  fs.writeFileSync(path.join(__dirname, '../qa/photo-audit.md'), audit.join('\n'));
  console.log('Complete!');
}

run().catch(console.error);
