const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../data/menus.json');
const menuData = JSON.parse(fs.readFileSync(file, 'utf8'));

const descMap = {
  'nf-1': {
    fr: "Sauce tomate San Marzano, mozzarella di bufala fraîche, feuilles de basilic et un filet d'huile d'olive extra vierge.",
    en: "San Marzano tomato sauce, fresh buffalo mozzarella, basil leaves, and a drizzle of extra virgin olive oil.",
    ar: "صلصة طماطم سان مارزانو، جبنة موزاريلا دي بوفالا الطازجة، أوراق الريحان، ورشة من زيت الزيتون البكر."
  },
  'nf-2': {
    fr: "Pâte artisanale cuite au feu de bois, garnie de fromages affinés, tomates cerises et herbes sauvages.",
    en: "Wood-fired artisanal crust topped with aged cheeses, cherry tomatoes, and wild herbs.",
    ar: "عجينة تقليدية مخبوزة على الحطب، مغطاة بأجبان معتقة، طماطم كرزية وأعشاب برية."
  },
  'nf-3': {
    fr: "Pâtes fraîches accompagnées d'un riche ragoût de bœuf mijoté lentement à la tomate et aux petits légumes.",
    en: "Fresh pasta served with a rich slow-cooked beef ragout in tomato sauce with finely diced vegetables.",
    ar: "مكرونة طازجة تقدم مع يخنة لحم بقري غنية مطبوخة ببطء بصلصة الطماطم والخضار."
  },
  'nf-4': {
    fr: "Une base généreuse en mozzarella, recouverte de tranches de pepperoni épicé et croustillant.",
    en: "A generous mozzarella base topped with crispy, spicy pepperoni slices.",
    ar: "قاعدة غنية بجبن الموزاريلا ومغطاة بشرائح البيروني الحارة والمقرمشة."
  },
  'nf-5': {
    fr: "Génoise légère superposée de crème onctueuse et couronnée de framboises fraîches acidulées.",
    en: "Light sponge cake layered with smooth cream and crowned with fresh, tart raspberries.",
    ar: "كعكة إسفنجية خفيفة بطبقات من الكريمة الناعمة ومزينة بتوت العليق الطازج والمنعش."
  },
  'nf-6': {
    fr: "Jeunes pousses croquantes, cerneaux de noix torréfiés, copeaux de fromage affiné et vinaigrette balsamique.",
    en: "Crisp mixed greens, toasted walnuts, shaved aged cheese, and balsamic vinaigrette.",
    ar: "خضار طازجة ومقرمشة، جوز محمص، شرائح الجبن المعتق وتتبيلة الخل البلسمي."
  },
  'ug-1': {
    fr: "Double steak haché de bœuf juteux, cheddar fondu, laitue croquante, oignons frais et sauce maison.",
    en: "Juicy double beef patty, melted cheddar, crisp lettuce, fresh onions, and house sauce.",
    ar: "شريحة لحم بقري مزدوجة وعصارية، شيدر ذائب، خس مقرمش، بصل طازج وصلصة منزلية."
  },
  'ug-2': {
    fr: "Steak écrasé à la plancha pour une croûte caramélisée, double fromage fondant et pain brioché moelleux.",
    en: "Smashed beef patty with a caramelized crust, double melted cheese on a soft brioche bun.",
    ar: "شريحة لحم مضغوطة ومقرمشة، جبن مزدوج ذائب وخبز بريوش طري."
  },
  'ug-3': {
    fr: "Burger gourmet servi sur planche, avec bacon croustillant, tomates mûres et sauce barbecue fumée.",
    en: "Gourmet burger served on a wooden board, with crispy bacon, ripe tomatoes, and smoky BBQ sauce.",
    ar: "برجر فاخر يقدم على لوح خشبي، مع لحم مقدد مقرمش، طماطم ناضجة وصلصة باربيكيو مدخنة."
  },
  'ug-4': {
    fr: "Frites coupées au couteau, dorées et croustillantes, saupoudrées de sel marin et d'herbes fines.",
    en: "Hand-cut french fries, golden and crispy, sprinkled with sea salt and fine herbs.",
    ar: "بطاطس مقلية مقطعة يدوياً، ذهبية ومقرمشة، مرشوشة بملح البحر والأعشاب الدقيقة."
  },
  'ug-5': {
    fr: "Brochettes de viandes marinées cuites à la flamme, accompagnées de légumes grillés tendres et parfumés.",
    en: "Flame-grilled marinated meat skewers served with tender, fragrant roasted vegetables.",
    ar: "أسياخ لحم متبلة ومشوية على اللهب، تقدم مع خضار مشوية طرية وعطرة."
  },
  'ug-6': {
    fr: "La boisson gazeuse classique, servie très fraîche avec des glaçons pour une pause désaltérante.",
    en: "The classic carbonated beverage, served ice-cold for a refreshing break.",
    ar: "المشروب الغازي الكلاسيكي، يقدم مثلجاً ومنعشاً."
  },
  'deb-1': {
    fr: "Morceaux de poulet tendres mijotés dans une sauce curry riche en épices indiennes, servis avec du riz basmati.",
    en: "Tender chicken pieces simmered in a rich Indian spice curry sauce, served with basmati rice.",
    ar: "قطع دجاج طرية مطبوخة بصلصة كاري غنية بالبهارات الهندية، تقدم مع أرز بسمتي."
  },
  'deb-2': {
    fr: "Poulet lentement confit aux épices marocaines, accompagné de pommes de terre, carottes et olives savoureuses.",
    en: "Slow-cooked Moroccan chicken with spices, accompanied by potatoes, carrots, and savory olives.",
    ar: "دجاج مطبوخ ببطء بالبهارات المغربية، يقدم مع البطاطس، الجزر والزيتون اللذيذ."
  },
  'deb-3': {
    fr: "Tranche de pain rustique grillée, purée d'avocat crémeuse, jeunes pousses et œufs durs en tranches.",
    en: "Toasted rustic bread, creamy avocado mash, baby greens, and sliced hard-boiled eggs.",
    ar: "شريحة خبز ريفي محمص، هريس الأفوكادو الكريمي، خضار صغيرة وشرائح بيض مسلوق."
  },
  'deb-4': {
    fr: "Mélange coloré d'avocat, tomates cerises, pois chiches et radis croquants, assaisonné d'une vinaigrette légère.",
    en: "Colorful mix of avocado, cherry tomatoes, chickpeas, and crunchy radishes with a light vinaigrette.",
    ar: "مزيج ملون من الأفوكادو، طماطم كرزية، حمص وفجل مقرمش، متبلة بصلصة خفيفة."
  },
  'deb-5': {
    fr: "Pancakes moelleux et dorés, généreusement garnis de fruits rouges frais et nappés de sirop.",
    en: "Fluffy, golden pancakes generously topped with fresh berries and drizzled with syrup.",
    ar: "فطائر بان كيك طرية وذهبية، مغطاة بسخاء بالتوت الطازج ومزينة بالقطر."
  },
  'deb-6': {
    fr: "Délicieux pancakes américains parsemés de myrtilles sauvages, servis fondants avec un coulis fruité.",
    en: "Delicious American pancakes dotted with wild blueberries, served warm with a fruity coulis.",
    ar: "فطائر أمريكية لذيذة مرصعة بالتوت البري، تقدم دافئة مع صلصة فواكه."
  },
  'sb-1': {
    fr: "Assortiment premium de makis et nigiris au saumon frais, préparés dans la plus pure tradition japonaise.",
    en: "Premium assortment of fresh salmon makis and nigiris, prepared in the purest Japanese tradition.",
    ar: "تشكيلة فاخرة من ماكي ونيجيري السلمون الطازج، محضرة على الطريقة اليابانية الأصيلة."
  },
  'sb-2': {
    fr: "Bouillon de porc onctueux mijoté 24h, nouilles fraîches, œuf mollet mariné et tranches de chashu fondantes.",
    en: "Creamy 24h-simmered pork broth, fresh noodles, marinated soft-boiled egg, and melting chashu slices.",
    ar: "مرق لحم خنزير غني مطبوخ لـ 24 ساعة، نودلز طازجة، بيض متبل وشرائح لحم طرية."
  },
  'sb-3': {
    fr: "Bateau majestueux proposant une variété de rouleaux fusion, alliant croquant, fondant et saveurs exquises.",
    en: "Majestic boat featuring a variety of fusion rolls, combining crunch, melt-in-mouth textures, and exquisite flavors.",
    ar: "قارب مهيب يقدم مجموعة متنوعة من لفائف الفيوجن، تجمع بين القرمشة، النعومة والنكهات الرائعة."
  },
  'sb-4': {
    fr: "Bol rustique de riz parfumé, surmonté de champignons poêlés et d'une sauce umami réconfortante.",
    en: "Rustic bowl of fragrant rice, topped with pan-seared mushrooms and a comforting umami sauce.",
    ar: "وعاء ريفي من الأرز العطري، مغطى بالفطر المقلي وصلصة أومامي اللذيذة."
  },
  'sb-5': {
    fr: "Bol santé et vegan réunissant tofu mariné, maïs croquant, chou rouge et crudités rafraîchissantes.",
    en: "Healthy vegan bowl combining marinated tofu, sweet corn, red cabbage, and refreshing raw vegetables.",
    ar: "وعاء نباتي صحي يجمع بين التوفو المتبل، الذرة الحلوة، الملفوف الأحمر والخضار الطازجة."
  },
  'sb-6': {
    fr: "Pavé de saumon rôti à la perfection, croûte croustillante et cœur moelleux, servi avec sa salsa verte.",
    en: "Perfectly roasted salmon fillet, crispy crust and tender center, served with a green salsa.",
    ar: "شريحة سلمون مشوية بامتياز، قشرة مقرمشة وقلب طري، تقدم مع صلصة خضراء."
  }
};

// Assign specials
const specials = {
  'napoli-forno': 'nf-2',
  'urban-grill': 'ug-5',
  'dar-el-bey': 'deb-2',
  'sakura-bar': 'sb-1'
};

for (const restId in menuData.restaurants) {
  const rest = menuData.restaurants[restId];
  rest.specialId = specials[restId];
  
  for (const item of rest.items) {
    if (descMap[item.id]) {
      item.description = descMap[item.id];
    }
  }
}

fs.writeFileSync(file, JSON.stringify(menuData, null, 2));

const jsContent = `window.MENU_DATA = ${JSON.stringify(menuData, null, 2)};`;
fs.writeFileSync(path.join(__dirname, '../data/menus.js'), jsContent);

console.log('Descriptions and specials updated.');
