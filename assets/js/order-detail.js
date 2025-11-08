// Import auth functions
import { getPurchasedOrderById, getCurrentUser } from './auth.js';

// Cache for products
let productsCache = null;

// Fetch products from product.json
async function fetchProducts() {
  if (productsCache) return productsCache;

  try {
    const response = await fetch('product.json');
    if (!response.ok) throw new Error('Failed to fetch products');
    productsCache = await response.json();
    return productsCache;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Get product by ID from product.json
function getProductById(products, productId) {
  return products.find(p => p.id === productId);
}

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
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Get status class
function getStatusClass(status) {
  const statusLower = status.toLowerCase();
  if (statusLower === 'delivered') return 'delivered';
  if (statusLower === 'shipped') return 'shipped';
  return 'processing';
}

// Get order ID from URL
function getOrderIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('orderId');
}

// Render order details
async function renderOrderDetails() {
  const orderId = getOrderIdFromURL();

  if (!orderId) {
    alert('No order ID provided');
    window.location.href = 'user-profile.html';
    return;
  }

  const order = getPurchasedOrderById(orderId);

  if (!order) {
    alert('Order not found');
    window.location.href = 'user-profile.html';
    return;
  }

  // Fetch all products from product.json
  const allProducts = await fetchProducts();

  // Render order header
  document.getElementById('orderIdDisplay').textContent = order.orderId;

  const statusElement = document.getElementById('orderStatusDisplay');
  statusElement.textContent = order.status;
  statusElement.className = `order-status-large ${getStatusClass(order.status)}`;

  // Render header info
  document.getElementById('orderHeaderInfo').innerHTML = `
    <div class="order-info-item">
      <div class="order-info-label">Order Date</div>
      <div class="order-info-value">${formatDate(order.orderDate)}</div>
    </div>
    <div class="order-info-item">
      <div class="order-info-label">Payment Method</div>
      <div class="order-info-value">${order.payment.method || 'Credit/Debit Card'}</div>
    </div>
    <div class="order-info-item">
      <div class="order-info-label">Shipping Method</div>
      <div class="order-info-value">${order.shipping.method || 'Standard Shipping'}</div>
    </div>
  `;

  // Render products - get fresh data from product.json
  document.getElementById('productsList').innerHTML = order.products.map(orderProduct => {
    // Find the actual product from product.json
    const actualProduct = getProductById(allProducts, orderProduct.id);

    // Use actual product data if found, otherwise fallback to order data
    const productImage = actualProduct?.image_front || orderProduct.image || 'assets/images/placeholder.jpg';
    const productName = actualProduct?.name || orderProduct.name;
    let productPrice = actualProduct?.price || orderProduct.price;

    // Parse price if it's a string with ₫
    if (typeof productPrice === 'string') {
      productPrice = parseInt(productPrice.replace(/[₫,.]/g, ''));
    }

    return `
      <a href="single-product.html?id=${orderProduct.id}" class="product-item">
        <div class="product-image">
          <img src="${productImage}"
               alt="${productName}"
               onerror="this.src='assets/images/placeholder.jpg'">
        </div>
        <div class="product-info">
          <div class="product-name">${productName}</div>
          <div class="product-price-qty">
            <div class="product-price">${formatPrice(productPrice * orderProduct.quantity)}</div>
            <div class="product-qty">Quantity: ${orderProduct.quantity}</div>
          </div>
        </div>
      </a>
    `;
  }).join('');

  // Render order summary
  document.getElementById('orderSummary').innerHTML = `
    <div class="summary-row">
      <div class="summary-label">Subtotal</div>
      <div class="summary-value">${formatPrice(order.subtotal)}</div>
    </div>
    <div class="summary-row">
      <div class="summary-label">Shipping Fee</div>
      <div class="summary-value">${order.shippingCost > 0 ? formatPrice(order.shippingCost) : 'FREE'}</div>
    </div>
    <div class="summary-row">
      <div class="summary-label">Tax</div>
      <div class="summary-value">${formatPrice(order.tax || 0)}</div>
    </div>
    <div class="summary-row">
      <div class="summary-label">Total</div>
      <div class="summary-value">${formatPrice(order.total)}</div>
    </div>
  `;

  // Render customer information
  document.getElementById('customerInfo').innerHTML = `
    <div class="customer-info-group">
      <h3>Contact Information</h3>
      <div class="customer-info-row">
        <div class="customer-label">Name:</div>
        <div class="customer-value">${order.customer.firstName} ${order.customer.lastName}</div>
      </div>
      <div class="customer-info-row">
        <div class="customer-label">Email:</div>
        <div class="customer-value">${order.customer.email}</div>
      </div>
      <div class="customer-info-row">
        <div class="customer-label">Phone:</div>
        <div class="customer-value">${order.customer.phone}</div>
      </div>
    </div>
    <div class="customer-info-group">
      <h3>Shipping Address</h3>
      <div class="customer-info-row">
        <div class="customer-label">Address:</div>
        <div class="customer-value">${order.customer.address}</div>
      </div>
      <div class="customer-info-row">
        <div class="customer-label">City:</div>
        <div class="customer-value">${order.customer.city}</div>
      </div>
    </div>
  `;
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  const currentUser = getCurrentUser();
  if (!currentUser) {
    alert('Please login to view order details');
    window.location.href = 'login.html';
    return;
  }

  await renderOrderDetails();
});
