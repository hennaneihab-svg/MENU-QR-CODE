const fs = require('fs');
const https = require('https');
const path = require('path');

const menuData = {
  restaurants: {
    "napoli-forno": {
      id: "napoli-forno", name: "Napoli Forno",
      theme: { primary: "#d32f2f", secondary: "#ffc107", background: "#fff5ee", font: "'Playfair Display', serif" },
      categories: ["Pizza", "Pasta", "Starters", "Desserts", "Drinks", "Specials"],
      items: [
        { id: "nf-1", categoryId: "Pizza", price: 15, name: { en: "Margherita", fr: "Margherita", ar: "مارغريتا" }, description: { en: "Classic tomato and mozzarella", fr: "Tomate et mozzarella", ar: "طماطم وموزاريلا" } },
        { id: "nf-2", categoryId: "Pasta", price: 18, name: { en: "Carbonara", fr: "Carbonara", ar: "كاربونارا" }, description: { en: "Pasta with guanciale and egg", fr: "Pâtes avec guanciale et oeuf", ar: "مكرونة" } },
        { id: "nf-3", categoryId: "Desserts", price: 8, name: { en: "Tiramisu", fr: "Tiramisu", ar: "تيراميسو" }, description: { en: "Coffee-flavored dessert", fr: "Dessert au café", ar: "حلوى بالقهوة" } },
        { id: "nf-4", categoryId: "Starters", price: 12, name: { en: "Bruschetta", fr: "Bruschetta", ar: "بروشيتا" }, description: { en: "Garlic bread with tomatoes", fr: "Pain à l'ail et tomates", ar: "خبز بالثوم" } },
        { id: "nf-5", categoryId: "Drinks", price: 5, name: { en: "Limoncello", fr: "Limoncello", ar: "ليمونشيلو" }, description: { en: "Lemon liqueur", fr: "Liqueur de citron", ar: "مشروب ليمون" } },
        { id: "nf-6", categoryId: "Pizza", price: 17, name: { en: "Pepperoni", fr: "Pepperoni", ar: "بيبروني" }, description: { en: "Spicy salami pizza", fr: "Pizza au salami piquant", ar: "بيتزا بيبيروني" } }
      ]
    },
    "urban-grill": {
      id: "urban-grill", name: "Urban Grill",
      theme: { primary: "#212121", secondary: "#ff5722", background: "#f5f5f5", font: "'Roboto', sans-serif" },
      categories: ["Burgers", "Steaks", "Sides", "Drinks", "Desserts", "Combos"],
      items: [
        { id: "ug-1", categoryId: "Burgers", price: 12, name: { en: "Cheeseburger", fr: "Cheeseburger", ar: "تشيز برجر" }, description: { en: "Beef patty with cheddar", fr: "Steak de bœuf cheddar", ar: "لحم شيدر" } },
        { id: "ug-2", categoryId: "Steaks", price: 25, name: { en: "Ribeye Steak", fr: "Entrecôte", ar: "ستيك" }, description: { en: "Grilled ribeye", fr: "Entrecôte grillée", ar: "ستيك مشوي" } },
        { id: "ug-3", categoryId: "Drinks", price: 5, name: { en: "Craft Cola", fr: "Cola Artisanal", ar: "كولا" }, description: { en: "House-made cola", fr: "Cola fait maison", ar: "كولا منزلية" } },
        { id: "ug-4", categoryId: "Sides", price: 6, name: { en: "Onion Rings", fr: "Rondelles d'oignon", ar: "حلقات بصل" }, description: { en: "Crispy fried onions", fr: "Oignons frits croustillants", ar: "بصل مقلي" } },
        { id: "ug-5", categoryId: "Sides", price: 5, name: { en: "French Fries", fr: "Frites", ar: "بطاطس مقلية" }, description: { en: "Golden potato fries", fr: "Frites dorées", ar: "بطاطس" } },
        { id: "ug-6", categoryId: "Burgers", price: 16, name: { en: "Double Smash", fr: "Double Smash", ar: "دبل سماش" }, description: { en: "Two smashed patties", fr: "Deux steaks smashés", ar: "لحم مضاعف" } }
      ]
    },
    "dar-el-bey": {
      id: "dar-el-bey", name: "Dar El Bey",
      theme: { primary: "#00796b", secondary: "#cddc39", background: "#fafafa", font: "'Amiri', serif" },
      categories: ["Main", "Starters", "Soups", "Sweets", "Drinks", "Specialties"],
      items: [
        { id: "deb-1", categoryId: "Main", price: 18, name: { en: "Lamb Couscous", fr: "Couscous Agneau", ar: "كسكس ضأن" }, description: { en: "Traditional couscous", fr: "Couscous traditionnel", ar: "كسكس تقليدي" } },
        { id: "deb-2", categoryId: "Main", price: 15, name: { en: "Chicken Tajine", fr: "Tajine Poulet", ar: "طاجين دجاج" }, description: { en: "Chicken tajine with olives", fr: "Tajine de poulet aux olives", ar: "طاجين بالزيتون" } },
        { id: "deb-3", categoryId: "Starters", price: 6, name: { en: "Brik", fr: "Brik à l'oeuf", ar: "بريك" }, description: { en: "Crispy pastry with egg", fr: "Feuille de brick croustillante", ar: "بريك مقرمش" } },
        { id: "deb-4", categoryId: "Soups", price: 8, name: { en: "Chorba", fr: "Chorba", ar: "شوربة" }, description: { en: "Traditional soup", fr: "Soupe traditionnelle", ar: "شوربة تقليدية" } },
        { id: "deb-5", categoryId: "Sweets", price: 7, name: { en: "Baklava", fr: "Baklava", ar: "بقلاوة" }, description: { en: "Sweet pastry with nuts", fr: "Pâtisserie aux amandes", ar: "حلوى بالمكسرات" } },
        { id: "deb-6", categoryId: "Drinks", price: 3, name: { en: "Mint Tea", fr: "Thé à la menthe", ar: "شاي بالنعناع" }, description: { en: "Fresh mint tea", fr: "Thé à la menthe fraîche", ar: "شاي طازج" } }
      ]
    },
    "sakura-bar": {
      id: "sakura-bar", name: "Sakura Bar",
      theme: { primary: "#e91e63", secondary: "#3f51b5", background: "#fff0f5", font: "'Noto Sans JP', sans-serif" },
      categories: ["Sushi", "Ramen", "Appetizers", "Bento", "Desserts", "Drinks"],
      items: [
        { id: "sb-1", categoryId: "Sushi", price: 22, name: { en: "Sushi Platter", fr: "Plateau Sushi", ar: "طبق سوشي" }, description: { en: "Assorted fresh sushi", fr: "Assortiment de sushis", ar: "سوشي منوع" } },
        { id: "sb-2", categoryId: "Ramen", price: 16, name: { en: "Tonkotsu Ramen", fr: "Ramen Tonkotsu", ar: "رامن" }, description: { en: "Pork broth ramen", fr: "Ramen bouillon de porc", ar: "رامن لحم" } },
        { id: "sb-3", categoryId: "Sushi", price: 8, name: { en: "Maki Rolls", fr: "Makis", ar: "ماكي" }, description: { en: "Tuna and salmon maki", fr: "Makis thon et saumon", ar: "ماكي تونة" } },
        { id: "sb-4", categoryId: "Appetizers", price: 7, name: { en: "Edamame", fr: "Edamame", ar: "إدامامي" }, description: { en: "Salted green beans", fr: "Fèves vertes salées", ar: "فول الصويا" } },
        { id: "sb-5", categoryId: "Bento", price: 20, name: { en: "Bento Box", fr: "Bento Box", ar: "بينتو" }, description: { en: "Complete bento meal", fr: "Repas complet bento", ar: "وجبة بينتو" } },
        { id: "sb-6", categoryId: "Desserts", price: 6, name: { en: "Mochi", fr: "Mochi", ar: "موتشي" }, description: { en: "Ice cream mochi", fr: "Mochi glacé", ar: "موتشي آيس كريم" } }
      ]
    }
  }
};

const imgDir = path.join(__dirname, '../assets/img');

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    // foodish uses https
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
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  const allItems = [];
  for (const restId in menuData.restaurants) {
    for (const item of menuData.restaurants[restId].items) {
      allItems.push(item);
    }
  }
  
  // Cleanup old images
  const oldFiles = fs.readdirSync(imgDir);
  for (const f of oldFiles) {
    fs.unlinkSync(path.join(imgDir, f));
  }

  // Iterate and download
  const usedImages = new Set();
  
  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    
    // Get unique image from foodish
    let imgUrl = null;
    while (!imgUrl) {
      const res = await fetch('https://foodish-api.com/api/');
      const data = await res.json();
      if (!usedImages.has(data.image)) {
        imgUrl = data.image;
        usedImages.add(imgUrl);
      }
    }
    
    console.log(`Downloading ${item.id} from ${imgUrl}...`);
    
    const dest800 = path.join(imgDir, `${item.id}-800.jpg`);
    const dest1600 = path.join(imgDir, `${item.id}-1600.jpg`);
    
    // Download the same image twice (since foodish doesn't support width query)
    // we just save the full res as both for the sake of the exercise, or just copy it.
    await downloadImage(imgUrl, dest1600);
    fs.copyFileSync(dest1600, dest800); // Copy to simulate 800w
    
    item.image800 = `${item.id}-800.jpg`;
    item.image1600 = `${item.id}-1600.jpg`;
  }

  // Write new json
  fs.writeFileSync(path.join(__dirname, '../data/menus.json'), JSON.stringify(menuData, null, 2));
  console.log('All images downloaded and menus.json updated. Total items:', allItems.length);
}

run().catch(console.error);
