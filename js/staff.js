const bc = new BroadcastChannel('menu_orders');

let orders = {};

bc.onmessage = (e) => {
  if (e.data.type === 'NEW_ORDER') {
    orders[e.data.orderId] = {
      ...e.data,
      status: 1
    };
    renderOrders();
  }
};

function updateStatus(orderId, status) {
  orders[orderId].status = parseInt(status);
  bc.postMessage({
    type: 'STATUS_UPDATE',
    orderId,
    status: orders[orderId].status
  });
}

function renderOrders() {
  const container = document.getElementById('orders-list');
  container.innerHTML = '';

  Object.values(orders).forEach(order => {
    const el = document.createElement('div');
    el.className = 'order-card';
    el.innerHTML = `
      <h3>${order.orderId} - ${order.restaurant}</h3>
      <p>${order.items.length} items</p>
      <select onchange="updateStatus('${order.orderId}', this.value)">
        <option value="1" ${order.status === 1 ? 'selected' : ''}>1. Reçue</option>
        <option value="2" ${order.status === 2 ? 'selected' : ''}>2. En préparation</option>
        <option value="3" ${order.status === 3 ? 'selected' : ''}>3. Prête</option>
        <option value="4" ${order.status === 4 ? 'selected' : ''}>4. Servie</option>
      </select>
    `;
    container.appendChild(el);
  });
}

document.getElementById('clear-orders').addEventListener('click', () => {
  orders = {};
  renderOrders();
});
