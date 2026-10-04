const bc = new BroadcastChannel('menu_orders');
let orders = [];
let kpiCount = 0;
let kpiRevenue = 0;

bc.onmessage = (e) => {
  if (e.data.type === 'NEW_ORDER') {
    orders.unshift(e.data);
    kpiCount++;
    kpiRevenue += e.data.total;
    updateKPIs();
    renderOrders();
  }
};

function updateKPIs() {
  document.getElementById('kpi-count').textContent = kpiCount;
  document.getElementById('kpi-revenue').textContent = kpiRevenue.toLocaleString('fr-DZ') + ' DA';
  const avg = kpiCount > 0 ? Math.round(kpiRevenue / kpiCount) : 0;
  document.getElementById('kpi-avg').textContent = avg.toLocaleString('fr-DZ') + ' DA';
}

function renderOrders() {
  const container = document.getElementById('orders-container');
  container.innerHTML = '';
  
  orders.forEach(order => {
    const typeBadge = order.orderType === 'table' ? `Table ${order.table}` : `Livraison: ${order.address}`;
    const div = document.createElement('div');
    div.className = 'order-card';
    div.innerHTML = `
      <h4><span>${order.orderId} <span class="badge">${typeBadge}</span></span>
        <select onchange="changeStatus('${order.orderId}', this.value)">
          <option value="1">1. Reçue</option>
          <option value="2">2. En préparation</option>
          <option value="3">3. Prête</option>
          <option value="4">4. Servie/Livrée</option>
        </select>
      </h4>
      <p>${order.items.map(i => i.name.fr).join(', ')}</p>
      <strong>${order.total.toLocaleString('fr-DZ')} DA</strong>
    `;
    container.appendChild(div);
  });
}

window.changeStatus = function(orderId, status) {
  bc.postMessage({ type: 'UPDATE_STATUS', orderId: orderId, status: parseInt(status) });
};

function renderDishes() {
  const container = document.getElementById('dish-container');
  container.innerHTML = '';
  
  const rest = window.MENU_DATA.restaurants['napoli-forno'];
  
  rest.items.forEach(item => {
    const isSpecial = rest.specialId === item.id;
    const div = document.createElement('div');
    div.className = 'dish-item';
    div.innerHTML = `
      <div class="dish-info">
        <img src="assets/img/${item.image800}" alt="">
        <span>${item.name.fr}</span>
      </div>
      <div>
        <button class="toggle-btn">Désactiver</button>
        <button class="special-btn">${isSpecial ? '★ Plat du jour' : 'Rendre spécial'}</button>
      </div>
    `;
    container.appendChild(div);
  });
}

renderDishes();
