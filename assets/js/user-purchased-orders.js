// Import auth functions
import { getPurchasedOrders } from './auth.js';

// Format price to Vietnamese currency
function formatPrice(price) {
  if (typeof price === 'string' && price.includes('₫')) return price;
  if (typeof price === 'number') {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
  }
  return price;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Get status class
function getStatusClass(status) {
  const statusLower = status.toLowerCase();
  if (statusLower === 'delivered') return 'delivered';
  if (statusLower === 'shipped') return 'shipped';
  return 'processing';
}

// Render orders
function renderOrders() {
  const ordersList = document.getElementById('ordersList');
  if (!ordersList) return;

  const orders = getPurchasedOrders();

  if (!orders || orders.length === 0) {
    ordersList.innerHTML = `
      <div class="orders-empty">
        <i class="fas fa-shopping-bag"></i>
        <h3>No orders yet</h3>
        <p>Your order history will appear here</p>
      </div>
    `;
    return;
  }

  ordersList.innerHTML = orders.map(order => {
    const productsHtml = order.products.slice(0, 3).map(product => `
      <div class="order-product-item">
        <span class="order-product-qty">${product.quantity}x</span>
        <span>${product.name}</span>
      </div>
    `).join('');

    const moreProducts = order.products.length > 3
      ? `<div class="order-product-item">+ ${order.products.length - 3} more items</div>`
      : '';

    return `
      <div class="order-card" data-order-id="${order.orderId}">
        <div class="order-card-header">
          <div class="order-id">${order.orderId}</div>
          <div class="order-status ${getStatusClass(order.status)}">${order.status}</div>
        </div>
        <div class="order-card-body">
          <div class="order-info">
            <div class="order-info-row">
              <span class="order-info-label">Date:</span>
              <span class="order-info-value">${formatDate(order.orderDate)}</span>
            </div>
            <div class="order-info-row">
              <span class="order-info-label">Shipping:</span>
              <span class="order-info-value">${order.shipping.method || 'Standard Shipping'}</span>
            </div>
            <div class="order-info-row">
              <span class="order-info-label">Payment:</span>
              <span class="order-info-value">${order.payment.method || 'Credit/Debit Card'}</span>
            </div>
            <div class="order-info-row">
              <span class="order-info-label">Address:</span>
              <span class="order-info-value">${order.customer.address}, ${order.customer.city}</span>
            </div>
          </div>
          <div class="order-products">
            <div class="order-products-title">Products:</div>
            <div class="order-products-list">
              ${productsHtml}
              ${moreProducts}
            </div>
          </div>
        </div>
        <div class="order-total">
          <span class="order-total-label">Total:</span>
          <span class="order-total-amount">${formatPrice(order.total)}</span>
        </div>
      </div>
    `;
  }).join('');

  // Add click handlers to order cards
  document.querySelectorAll('.order-card').forEach(card => {
    card.addEventListener('click', () => {
      const orderId = card.dataset.orderId;
      window.location.href = `order-detail.html?orderId=${encodeURIComponent(orderId)}`;
    });
  });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', renderOrders);
