const fs = require('fs');
async function searchUnsplash(query) {
  const url = `https://unsplash.com/s/photos/${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  // Unsplash has changed its markup often. Let's just regex for raw URLs
  const rawUrls = [...html.matchAll(/"raw":"(https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^"]*?)"/g)];
  if (rawUrls.length > 0) {
    console.log(`Found for ${query}:`, rawUrls[0][1]);
  } else {
    console.log(`No URLs found in HTML for ${query}`);
  }
}
searchUnsplash('sushi');
searchUnsplash('ramen');
