const { chromium } = require('playwright');
const fs = require('fs');

const dishes = [
  "Pizza Margherita", "Pasta Carbonara", "Tiramisu", "Bruschetta", "Lemonade drink", "Pepperoni Pizza",
  "Cheeseburger", "Ribeye Steak", "Cola glass", "Onion Rings", "French Fries", "Smash Burger",
  "Couscous", "Chicken Tajine", "Brik pastry", "Soup bowl", "Baklava", "Mint Tea",
  "Sushi Platter", "Ramen bowl", "Maki Rolls", "Edamame", "Bento Box", "Mochi dessert"
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  for (const dish of dishes) {
    try {
      console.log(`Searching Pexels for: ${dish}`);
      await page.goto(`https://www.pexels.com/search/${encodeURIComponent(dish)}/`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000); // let images load
      
      const imgInfo = await page.evaluate(() => {
        const img = document.querySelector('article img');
        if (!img) return null;
        const author = document.querySelector('article a[data-testid="photographer-name"]')?.innerText || 'Unknown Photographer';
        const url = img.src.split('?')[0]; // remove query params to get original
        const alt = img.alt;
        return { url, author, alt };
      });
      
      if (imgInfo) {
        imgInfo.dish = dish;
        results.push(imgInfo);
        console.log(`Found: ${imgInfo.url}`);
      } else {
        console.log(`No image found for ${dish}`);
      }
    } catch (e) {
      console.error(`Error searching ${dish}:`, e.message);
    }
  }
  
  fs.writeFileSync('scraped_images.json', JSON.stringify(results, null, 2));
  await browser.close();
}
run();
