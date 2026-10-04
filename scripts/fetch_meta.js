const https = require('https');
const ids = ['g6FKXPq0SI0', 'hatqfX3b9Vo', 'kcA-c3f_3FE', 'MqT0asuoIcU', 'Fo80DfhsJUk', 'fdlZBWIP0aM', 'UC0HZdUitWY', 'KMr81U6o3Vg', 'g4jSyttFc08', 'zcUgjyqEwe8', 'IGfIGP5ONV0', 'Mzy-OjtCI70', 'ZBSJ57K0Vcg', '-YHSwy6uqvk', '7WVpQhFGUqQ', '4_jhDO54BYg', 'ml49hEv55WI', 'awj7sRviVXo', 'eeqbbemH9-c', 'ZuIDLSz3XLg'];

async function run() {
  for (let id of ids) {
    try {
      const res = await fetch(`https://unsplash.com/napi/photos/${id}`);
      if (res.status === 200) {
        const data = await res.json();
        console.log(`ID: ${id}`);
        console.log(`Title: ${data.alt_description || data.description}`);
        console.log(`Author: ${data.user.name}`);
        console.log(`URL: ${data.urls.raw}`);
        console.log('---');
      }
    } catch(e) {}
  }
}
run();
