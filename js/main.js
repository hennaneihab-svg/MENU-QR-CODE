const bc = new BroadcastChannel('menu_orders');

let menuData = {};
let currentRest = 'napoli-forno';
let currentLang = 'fr';
let cart = [];
let myOrderId = null;

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('rest')) currentRest = urlParams.get('rest');
  if (urlParams.has('lang')) currentLang = urlParams.get('lang');

  // Lang segmented control
  const langBtns = document.querySelectorAll('#lang-segment button');
  langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      langBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentLang = e.target.getAttribute('data-lang');
      renderMenu();
    });
    if (btn.getAttribute('data-lang') === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Demo restaurant select
  const restSelect = document.getElementById('restaurant-select');
  if (restSelect) {
    restSelect.value = currentRest;
    restSelect.addEventListener('change', (e) => {
      currentRest = e.target.value;
      renderMenu();
    });
  }

  // Load Data
  try {
    if (!window.MENU_DATA) throw new Error("Les données du menu n'ont pas pu être chargées.");
    menuData = window.MENU_DATA;
    document.getElementById('menu-container').className = '';
    document.getElementById('menu-container').innerHTML = '';
    renderMenu();
  } catch(err) {
    document.getElementById('menu-container').innerHTML = '<div style="padding: 20px; text-align: center; color: red;">Erreur de chargement des données. L\'application doit inclure data/menus.js.</div>';
    console.error(err);
  }

  // Header scroll effect
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Footer animation observer
  const footer = document.getElementById('main-footer');
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      footer.classList.add('visible');
      observer.disconnect();
    }
  });
  if (footer) observer.observe(footer);

  document.getElementById('checkout-btn')?.addEventListener('click', placeOrder);

  bc.onmessage = (e) => {
    if (e.data.type === 'STATUS_UPDATE' && e.data.orderId === myOrderId) {
      updateTracking(e.data.status);
    }
  };
}

function formatPrice(price) {
  // Algerian Dinar: space as thousands separator
  return price.toLocaleString('fr-DZ').replace(',', ' ') + ' DA';
}

function renderMenu() {
  const rest = menuData.restaurants[currentRest];
  if (!rest) return;

  document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

  // Apply theme variables
  document.documentElement.style.setProperty('--primary', rest.theme.primary);
  document.documentElement.style.setProperty('--bg', rest.theme.background);
  // Optional: override font if we want to use the JSON font, but manager asked for "display + text font".
  // Let's rely on CSS for typography, but keep this for backwards compatibility.
  
  // Set header and footer text
  const logoEl = document.getElementById('restaurant-name-logo');
  if (logoEl) logoEl.textContent = rest.name;
  
  const footerNameEl = document.getElementById('footer-restaurant-name');
  if (footerNameEl) footerNameEl.textContent = rest.name;
  
  const specialLabels = { fr: 'Plat du jour', en: "Today's special", ar: 'طبق اليوم' };
  
  const container = document.getElementById('menu-container');
  container.innerHTML = '';
  
  const specialContainer = document.getElementById('special-container');
  specialContainer.innerHTML = '';

  const specialItem = rest.items.find(i => i.id === rest.specialId);
  if (specialItem) {
    const sImgSrcset = `assets/img/${specialItem.image800} 800w, assets/img/${specialItem.image1600} 1600w`;
    const sImgSrc = `assets/img/${specialItem.image800}`;
    
    specialContainer.innerHTML = `
      <h2 class="special-title">${specialLabels[currentLang]}</h2>
      <div class="special-card reveal-scroll">
        <img src="${sImgSrc}" srcset="${sImgSrcset}" sizes="(max-width: 600px) 100vw, 1200px" alt="${specialItem.name[currentLang]}">
        <div class="special-info">
          <h3>${specialItem.name[currentLang]}</h3>
          <p>${specialItem.description[currentLang]}</p>
          <strong>${formatPrice(specialItem.price)}</strong>
        </div>
        <button class="add-btn special-add" aria-label="Add ${specialItem.name[currentLang]}" onclick="addToCart('${specialItem.id}', ${specialItem.price})">+</button>
      </div>
    `;
  }

  rest.items.forEach(item => {
    if (item.id === rest.specialId) return; // Don't show special twice
    
    const el = document.createElement('div');
    el.className = 'menu-item';
    
    const imgSrcset = `assets/img/${item.image800} 800w, assets/img/${item.image1600} 1600w`;
    const imgSrc = `assets/img/${item.image800}`;
    
    el.innerHTML = `
      <img src="${imgSrc}" srcset="${imgSrcset}" sizes="(max-width: 600px) 800px, 1600px" alt="${item.name[currentLang]}">
      <div class="menu-item-info" style="cursor:pointer;" onclick="openDish('${item.id}')">
        <h3>${item.name[currentLang]}</h3>
        <p>${item.description[currentLang]}</p>
        <strong>${formatPrice(item.price)}</strong>
      </div>
      <button class="add-btn" aria-label="Add ${item.name[currentLang]}" onclick="addToCart('${item.id}', ${item.price})">+</button>
    `;
    container.appendChild(el);
  });

  updateCartUI();
}

window.addToCart = function(id, price) {
  cart.push({ id, price });
  updateCartUI();
};

function updateCartUI() {
  const cartBar = document.getElementById('cart-bar');
  if (!cartBar) return;
  if (cart.length > 0) {
    cartBar.classList.remove('hidden');
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    const totalLabel = currentLang === 'ar' ? 'المجموع' : (currentLang === 'en' ? 'Total' : 'Total');
    document.getElementById('cart-total-text').textContent = `${totalLabel}: ${formatPrice(total)}`;
  } else {
    cartBar.classList.add('hidden');
  }
}

function placeOrder() {
  if (cart.length === 0) return;
  myOrderId = 'ORD-' + Math.floor(Math.random() * 10000);
  
  const type = document.querySelector('input[name="order-type"]:checked').value;
  const table = document.getElementById('table-number').value;
  const address = document.getElementById('delivery-address').value;
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  bc.postMessage({
    type: 'NEW_ORDER',
    orderId: myOrderId,
    restaurant: currentRest,
    items: cart,
    orderType: type,
    table: table,
    address: address,
    total: total
  });

  cart = [];
  updateCartUI();
  
  document.getElementById('order-tracking')?.classList.remove('hidden');
  updateTracking(1);
}

function updateTracking(statusLevel) {
  for (let i = 1; i <= 4; i++) {
    const step = document.getElementById('step-' + i);
    if (step) {
      if (i === statusLevel) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    }
  }
}

// -- Dish Modal Logic --
window.openDish = function(id) {
  const rest = menuData.restaurants[currentRest];
  const item = rest.items.find(i => i.id === id) || (rest.specialId === id ? rest.items.find(i => i.id === id) : null);
  if (!item) return;
  
  document.getElementById('dish-modal-title').textContent = item.name[currentLang];
  document.getElementById('dish-modal-desc').textContent = item.description[currentLang];
  document.getElementById('dish-modal-price').textContent = formatPrice(item.price);
  document.getElementById('dish-modal-img').src = `assets/img/${item.image800}`;
  
  const addBtn = document.getElementById('dish-modal-add');
  addBtn.onclick = () => {
    addToCart(item.id, item.price);
    closeModal('dish-modal');
  };
  
  const modal = document.getElementById('dish-modal');
  modal.classList.remove('hidden');
  gsap.fromTo('.dish-modal-content', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
};

document.getElementById('close-dish-btn').addEventListener('click', () => closeModal('dish-modal'));

function closeModal(id) {
  const modal = document.getElementById(id);
  gsap.to(modal.querySelector('.modal-content'), { scale: 0.8, opacity: 0, duration: 0.2, onComplete: () => {
    modal.classList.add('hidden');
  }});
}

// -- Checkout Logic --
document.getElementById('checkout-btn')?.addEventListener('click', () => {
  const modal = document.getElementById('checkout-modal');
  modal.classList.remove('hidden');
  gsap.fromTo(modal.querySelector('.modal-content'), { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
});

document.querySelectorAll('input[name="order-type"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    document.getElementById('table-number').style.display = e.target.value === 'table' ? 'block' : 'none';
    document.getElementById('delivery-address').style.display = e.target.value === 'livraison' ? 'block' : 'none';
  });
});

document.getElementById('confirm-order-btn').addEventListener('click', () => {
  closeModal('checkout-modal');
  placeOrder();
});

// -- Demo Sequence --
document.getElementById('start-demo-btn')?.addEventListener('click', async () => {
  const legend = document.getElementById('demo-legend');
  legend.classList.remove('hidden');
  
  const text = document.getElementById('demo-legend-text');
  
  text.textContent = 'Étape 1/5 : Navigation';
  window.scrollTo({ top: 500, behavior: 'smooth' });
  await new Promise(r => setTimeout(r, 2000));
  
  text.textContent = 'Étape 2/5 : Clic sur un plat';
  const firstItem = document.querySelector('.menu-item-info');
  if (firstItem) firstItem.click();
  await new Promise(r => setTimeout(r, 2000));
  
  text.textContent = 'Étape 3/5 : Ajout au panier';
  document.getElementById('dish-modal-add').click();
  await new Promise(r => setTimeout(r, 2000));
  
  text.textContent = 'Étape 4/5 : Commander (Sur place)';
  document.getElementById('checkout-btn').click();
  await new Promise(r => setTimeout(r, 1500));
  document.getElementById('confirm-order-btn').click();
  await new Promise(r => setTimeout(r, 2000));
  
  text.textContent = 'Étape 5/5 : Suivi direct';
  await new Promise(r => setTimeout(r, 3000));
  
  legend.classList.add('hidden');
});
document.getElementById('stop-demo-btn')?.addEventListener('click', () => {
  document.getElementById('demo-legend').classList.add('hidden');
});

// GSAP Animations and Lenis
function initAnimations() {
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Entry animation
  const tl = gsap.timeline();
  tl.to('.mask-text', { y: 0, duration: 1, ease: 'power4.out', delay: 0.2 })
    .to('#enter-btn', { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, "-=0.4");

  document.getElementById('enter-btn').addEventListener('click', () => {
    gsap.to('#entry-screen', { 
      y: '-100%', duration: 1, ease: 'power4.inOut',
      onComplete: () => {
        document.getElementById('entry-screen').style.display = 'none';
        
        // Reveal main content
        gsap.to(['#main-header', '.demo-controls', '#app'], {
          autoAlpha: 1, duration: 0.5, stagger: 0.1,
          onComplete: () => {
            ScrollTrigger.refresh();
          }
        });
      }
    });
  });

  // Reveal elements on scroll
  gsap.utils.toArray('.reveal-scroll').forEach(el => {
    gsap.fromTo(el, 
      { autoAlpha: 0, y: 50 },
      {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }
    );
  });

  // Fullscreen Menu Toggle
  const menuBtn = document.getElementById('menu-toggle-btn');
  const closeBtn = document.getElementById('close-menu-btn');
  const overlay = document.getElementById('fullscreen-menu');
  const overlayBg = document.querySelector('.overlay-bg');
  
  menuBtn.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    gsap.to(overlayBg, { opacity: 1, duration: 0.3 });
    
    // Inject categories dynamically from menuData
    const nav = document.getElementById('category-nav');
    nav.innerHTML = '';
    const rest = menuData.restaurants[currentRest];
    if (rest && rest.categories) {
      rest.categories.forEach(cat => {
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'cat-link';
        a.textContent = cat;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          closeMenu();
        });
        nav.appendChild(a);
      });
    }
    
    gsap.to('.cat-link', { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.1 });
  });

  function closeMenu() {
    gsap.to('.cat-link', { y: 20, opacity: 0, duration: 0.3, stagger: 0.05, ease: 'power2.in' });
    gsap.to(overlayBg, { opacity: 0, duration: 0.4, delay: 0.2, onComplete: () => {
      overlay.classList.add('hidden');
    }});
  }
  
  closeBtn.addEventListener('click', closeMenu);
}

// Ensure GSAP is initialized after load
window.addEventListener('load', () => {
  initAnimations();
});

init();
