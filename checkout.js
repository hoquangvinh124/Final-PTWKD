// CHECKOUT.JS - Load cart from localStorage and manage checkout flow
console.log('Checkout.js loading...');

// Import auth functions - using dynamic import for non-module script
let addPurchasedOrder, getCurrentUser, isAuthenticated, getShippingAddress;
let getAddressFromGPS, showGPSLoading, isGeolocationSupported;

// Dynamically import auth and geolocation functions
(async () => {
  try {
    const authModule = await import('./assets/js/auth.js');
    addPurchasedOrder = authModule.addPurchasedOrder;
    getCurrentUser = authModule.getCurrentUser;
    isAuthenticated = authModule.isAuthenticated;
    getShippingAddress = authModule.getShippingAddress;

    const geoModule = await import('./assets/js/geolocation.js');
    getAddressFromGPS = geoModule.getAddressFromGPS;
    showGPSLoading = geoModule.showGPSLoading;
    isGeolocationSupported = geoModule.isGeolocationSupported;

    // Initialize buttons after modules are loaded
    initializeAddressButtons();
  } catch (error) {
    console.error('Failed to load modules:', error);
  }
})();

// Global variables
let currentStep = 1;
let orderData = {
  customer: {},
  products: [],
  shipping: { type: 'standard', price: 9.99 },
  payment: { type: 'card' },
  taxRate: 0
};

// Email template data - will be populated when order is completed
let emailData = {
  order_number: '',
  customer_name: '',
  shipping_name: '',
  shipping_address: '',
  shipping_phone: '',
  payment_method: '',
  payment_status: 'Pending',
  items: [],
  subtotal: '',
  shipping_fee: '',
  discount: '0₫',
  grand_total: ''
};

// Load cart data from localStorage
function loadCartData() {
  const cartData = localStorage.getItem('cart');
  if (cartData) {
    try {
      const cartItems = JSON.parse(cartData);
      orderData.products = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));
      console.log('Loaded cart data:', orderData.products);
      return true;
    } catch (error) {
      console.error('Error loading cart data:', error);
      return false;
    }
  }
  return false;
}

// Format price to Vietnamese currency
function formatPrice(price) {
  if (typeof price === 'string' && price.includes('₫')) return price;
  if (typeof price === 'number') return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
  if (typeof price === 'string') {
    const numPrice = parseInt(price.replace(/\./g, '').replace('₫', '').trim());
    if (!isNaN(numPrice)) return numPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
  }
  return price;
}

// Parse price from Vietnamese format to number
function parsePrice(priceString) {
  if (typeof priceString === 'number') return priceString;
  if (typeof priceString === 'string') {
    const cleanPrice = priceString.replace(/\./g, '').replace('₫', '').trim();
    return parseInt(cleanPrice) || 0;
  }
  return 0;
}

// Render products from cart in step 2
function renderProductsStep() {
  const step2Container = document.querySelector('#step2 .form-section');
  if (!step2Container) return;
  step2Container.innerHTML = '';
  orderData.products.forEach((product, index) => {
    const productHTML = `
      <div class="product-option selected" data-index="${index}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
        </div>
        <div class="product-details">
          <div class="product-name">${product.name}</div>
          <div class="product-price">${formatPrice(product.price)}</div>
        </div>
        <div class="quantity-control">
          <button class="qty-btn" data-action="decrease" data-index="${index}">-</button>
          <input type="text" class="qty-input" value="${product.quantity}" data-index="${index}">
          <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
        </div>
      </div>
    `;
    step2Container.insertAdjacentHTML('beforeend', productHTML);
  });
  setupQuantityControls();
}

// Setup quantity controls for products
function setupQuantityControls() {
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const action = this.dataset.action;
      const index = parseInt(this.dataset.index);
      const input = this.parentElement.querySelector('.qty-input');
      let value = parseInt(input.value);
      if (action === 'increase') {
        value++;
      } else if (action === 'decrease' && value > 1) {
        value--;
      }
      input.value = value;
      orderData.products[index].quantity = value;
      updateOrderSummary();
    });
  });
  document.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', function() {
      const index = parseInt(this.dataset.index);
      let value = parseInt(this.value);
      if (isNaN(value) || value < 1) {
        value = 1;
        this.value = 1;
      }
      orderData.products[index].quantity = value;
      updateOrderSummary();
    });
  });
}

// Setup all event listeners
function setupEventListeners() {
  document.querySelectorAll('.shipping-option').forEach(option => {
    option.addEventListener('click', function() {
      const shippingType = this.dataset.shipping;
      const shippingPrice = parseFloat(this.dataset.price);
      document.querySelectorAll('.shipping-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      this.classList.add('selected');
      orderData.shipping.type = shippingType;
      orderData.shipping.price = shippingPrice;
      updateOrderSummary();
    });
  });
  document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('.payment-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      this.classList.add('selected');
      orderData.payment.type = this.dataset.payment;
    });
  });
}

// Initialize address buttons (called after modules are loaded)
function initializeAddressButtons() {
  const useDefaultBtn = document.getElementById('useDefaultAddressBtn');
  const gpsBtn = document.getElementById('checkoutGPSBtn');

  // Use Default Address Button
  if (useDefaultBtn) {
    useDefaultBtn.addEventListener('click', fillDefaultAddress);
  }

  // GPS Button
  if (gpsBtn) {
    if (!isGeolocationSupported || !isGeolocationSupported()) {
      gpsBtn.disabled = true;
      gpsBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> GPS Not Supported';
    } else {
      gpsBtn.addEventListener('click', fillAddressFromGPS);
    }
  }
}

// Fill default address from user profile
function fillDefaultAddress() {
  if (!isAuthenticated || !isAuthenticated()) {
    alert('Please login to use your saved address');
    return;
  }

  const address = getShippingAddress();

  if (!address || !address.fullName) {
    alert('No saved address found. Please set your shipping address in your profile first.');
    return;
  }

  // Parse full name into first and last name
  const nameParts = (address.fullName || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Get current user email if available
  const currentUser = getCurrentUser && getCurrentUser();
  const userEmail = (currentUser && currentUser.email) || '';

  // Fill in the form with saved data
  document.getElementById('firstName').value = firstName;
  document.getElementById('lastName').value = lastName;
  document.getElementById('email').value = userEmail;
  document.getElementById('phone').value = address.phone || '';

  // Use the detailed street address saved from user profile
  // This includes: house number, road, ward, district (saved from GPS or manual input)
  document.getElementById('address').value = address.street || '';

  // Use the EXACT city value from dropdown that was selected in user profile
  // This is already in the correct format (e.g., "TP. Hồ Chí Minh", "Hà Nội")
  document.getElementById('city').value = address.city || '';

  document.getElementById('zipCode').value = address.zipCode || '';

  console.log('Filled from saved address:', {
    street: address.street,
    city: address.city,
    zipCode: address.zipCode
  });

  // Update order data
  orderData.customer = {
    firstName,
    lastName,
    email: userEmail,
    phone: address.phone || '',
    address: address.street || '',
    city: address.city || '',
    zipCode: address.zipCode || ''
  };

  showQuickFillConfirmation('Saved address filled successfully!');
}

// Fill address from GPS
async function fillAddressFromGPS() {
  const gpsBtn = document.getElementById('checkoutGPSBtn');
  const hideLoading = showGPSLoading(gpsBtn);

  try {
    await getAddressFromGPS(
      // onSuccess
      (addressData) => {
        hideLoading();

        // Fill in the form with DETAILED GPS data
        const addressInput = document.getElementById('address');
        const cityInput = document.getElementById('city');
        const zipCodeInput = document.getElementById('zipCode');

        // Use detailedStreet which includes: house number, road, ward, district
        if (addressInput && addressData.detailedStreet) {
          addressInput.value = addressData.detailedStreet;
          console.log('Checkout - Detailed address filled:', addressData.detailedStreet);
        }

        // Fill city/province - already matched to Vietnamese standard
        if (cityInput && addressData.city) {
          cityInput.value = addressData.city;
          console.log('Checkout - City filled:', addressData.city);
        }

        // Fill zipcode if available
        if (zipCodeInput && addressData.zipCode) {
          zipCodeInput.value = addressData.zipCode;
        }

        // Show detailed success message
        const accuracy = addressData.coordinates ? Math.round(addressData.coordinates.accuracy) : 0;
        let message = `Detailed address detected! (Accuracy: ${accuracy}m)`;

        console.log('GPS Components:', {
          houseNumber: addressData.houseNumber,
          road: addressData.road,
          ward: addressData.ward,
          district: addressData.district,
          city: addressData.city
        });

        showQuickFillConfirmation(message);

        // Warn if accuracy is low
        if (accuracy > 50) {
          setTimeout(() => {
            alert(`GPS accuracy is ${accuracy}m. Please verify the address is correct before proceeding.`);
          }, 500);
        }
      },
      // onError
      (errorMessage) => {
        hideLoading();
        alert(errorMessage);
      }
    );
  } catch (error) {
    hideLoading();
    console.error('GPS Error:', error);
    alert('Unable to get your location. Please enter address manually.');
  }
}

// Initialize the checkout process
document.addEventListener('DOMContentLoaded', function() {
  const hasCartData = loadCartData();
  if (!hasCartData || orderData.products.length === 0) {
    alert('Giỏ hàng của bạn đang trống! Vui lòng thêm sản phẩm trước khi thanh toán.');
    window.location.href = 'homepage.html';
    return;
  }
  updateProgressSteps();
  renderProductsStep();
  updateOrderSummary();
  setupEventListeners();
});

// Fill default customer information
function fillDefaultInfo() {
  const defaultInfo = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'San Francisco',
    zipCode: '94103'
  };
  document.getElementById('firstName').value = defaultInfo.firstName;
  document.getElementById('lastName').value = defaultInfo.lastName;
  document.getElementById('email').value = defaultInfo.email;
  document.getElementById('phone').value = defaultInfo.phone;
  document.getElementById('address').value = defaultInfo.address;
  document.getElementById('city').value = defaultInfo.city;
  document.getElementById('zipCode').value = defaultInfo.zipCode;
  orderData.customer = defaultInfo;
  showQuickFillConfirmation();
}

// Show confirmation when default info is filled
function showQuickFillConfirmation() {
  const confirmation = document.createElement('div');
  confirmation.className = 'quick-fill-confirmation';
  confirmation.innerHTML = `
    <div class="confirmation-content">
      <i class="fas fa-check-circle"></i>
      <span>Default information filled successfully!</span>
    </div>
  `;
  const style = document.createElement('style');
  style.textContent = `
    .quick-fill-confirmation {
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--dark-strong);
      border: 1px solid var(--accent);
      border-radius: 8px;
      padding: 15px 20px;
      color: var(--highlight);
      z-index: 1000;
      animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2s forwards;
    }
    .confirmation-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .confirmation-content i {
      font-size: 1.2rem;
    }
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(confirmation);
  setTimeout(() => {
    if (confirmation.parentNode) confirmation.parentNode.removeChild(confirmation);
    if (style.parentNode) style.parentNode.removeChild(style);
  }, 2500);
}

// Update progress steps
function updateProgressSteps() {
  document.querySelectorAll('.step').forEach(step => {
    const stepNumber = parseInt(step.dataset.step);
    step.classList.remove('active', 'completed');
    if (stepNumber === currentStep) {
      step.classList.add('active');
    } else if (stepNumber < currentStep) {
      step.classList.add('completed');
    }
  });
}

// Show specific step
function showStep(stepNumber) {
  document.querySelectorAll('.checkout-form').forEach(form => {
    form.classList.remove('active');
  });
  document.getElementById(`step${stepNumber}`).classList.add('active');
  currentStep = stepNumber;
  updateProgressSteps();
}

// Navigate to next step
function nextStep(fromStep) {
  if (fromStep === 1 && !validateCustomerInfo()) {
    alert('Please fill in all required customer information');
    return;
  }
  if (fromStep === 2 && !validateProducts()) {
    alert('Please select at least one product');
    return;
  }
  showStep(fromStep + 1);
}

// Navigate to previous step
function prevStep(fromStep) {
  showStep(fromStep - 1);
}

// Validate customer information
function validateCustomerInfo() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const city = document.getElementById('city').value.trim();
  const zipCode = document.getElementById('zipCode').value.trim();
  if (!firstName || !lastName || !email || !phone || !address || !city || !zipCode) {
    return false;
  }
  orderData.customer = { firstName, lastName, email, phone, address, city, zipCode };
  return true;
}

// Validate products selection
function validateProducts() {
  const totalQuantity = orderData.products.reduce((sum, product) => sum + product.quantity, 0);
  return totalQuantity > 0;
}

// Update order summary
function updateOrderSummary() {
  const summaryItems = document.getElementById('summaryItems');
  const subtotalElement = document.getElementById('subtotal');
  const shippingCostElement = document.getElementById('shippingCost');
  const taxAmountElement = document.getElementById('taxAmount');
  const totalAmountElement = document.getElementById('totalAmount');
  
  if (!summaryItems) return;
  
  summaryItems.innerHTML = '';
  orderData.products.forEach(product => {
    if (product.quantity > 0) {
      const productPrice = parsePrice(product.price);
      const productElement = document.createElement('div');
      productElement.className = 'summary-product';
      productElement.innerHTML = `
        <div class="summary-product-image">
          <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
        </div>
        <div class="summary-product-info">
          <div class="summary-product-name">${product.name}</div>
          <div class="summary-product-variant">Qty: ${product.quantity}</div>
        </div>
        <div class="summary-product-price">${formatPrice(productPrice * product.quantity)}</div>
      `;
      summaryItems.appendChild(productElement);
    }
  });
  
  const subtotal = orderData.products.reduce((sum, product) => {
    const productPrice = parsePrice(product.price);
    return sum + (productPrice * product.quantity);
  }, 0);
  const shipping = orderData.shipping.price;
  const tax = subtotal * orderData.taxRate;
  const total = subtotal + shipping + tax;
  
  if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
  if (shippingCostElement) shippingCostElement.textContent = shipping > 0 ? formatPrice(shipping) : 'FREE';
  if (taxAmountElement) taxAmountElement.textContent = formatPrice(tax);
  if (totalAmountElement) totalAmountElement.textContent = formatPrice(total);
}

// Complete order
function completeOrder() {
  const loadingScreen = document.getElementById('loadingScreen');
  loadingScreen.classList.add('active');

  // Prepare email data
  prepareEmailData();

  setTimeout(() => {
    loadingScreen.classList.remove('active');
    const orderId = `#LDIE${new Date().getFullYear()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    document.getElementById('orderId').textContent = orderId;

    // Store email data with order ID
    emailData.order_number = orderId;

    // Save email data to localStorage for sending
    localStorage.setItem('orderEmailData', JSON.stringify(emailData));

    // Send email (you can implement this later)
    sendOrderConfirmationEmail(emailData);

    // Save order to user's purchased orders (if logged in)
    if (isAuthenticated && addPurchasedOrder) {
      const subtotal = orderData.products.reduce((sum, product) => {
        return sum + (parsePrice(product.price) * product.quantity);
      }, 0);
      const shipping = orderData.shipping.price;
      const tax = subtotal * orderData.taxRate;
      const total = subtotal + shipping + tax;

      // Get shipping method name
      const shippingMethods = {
        'standard': 'Standard Shipping',
        'express': 'Express Shipping',
        'pickup': 'Store Pickup'
      };

      const paymentMethods = {
        'card': 'Credit/Debit Card',
        'paypal': 'PayPal',
        'giftcard': 'Gift Card'
      };

      const orderToSave = {
        orderId: orderId,
        orderDate: new Date().toISOString(),
        status: 'Processing',
        customer: orderData.customer,
        products: orderData.products.map(p => ({
          ...p,
          price: parsePrice(p.price)
        })),
        shipping: {
          type: orderData.shipping.type,
          price: shipping,
          method: shippingMethods[orderData.shipping.type] || 'Standard Shipping'
        },
        payment: {
          type: orderData.payment.type,
          method: paymentMethods[orderData.payment.type] || 'Credit/Debit Card'
        },
        subtotal: subtotal,
        shippingCost: shipping,
        tax: tax,
        total: total
      };

      addPurchasedOrder(orderToSave);
      console.log('Order saved to user profile:', orderToSave);
    }

    // Clear cart
    localStorage.removeItem('cart');
    showStep(5);
  }, 3000);
}

// Prepare email data from order information
function prepareEmailData() {
  // Customer information
  emailData.customer_name = `${orderData.customer.firstName} ${orderData.customer.lastName}`;
  emailData.shipping_name = emailData.customer_name;
  emailData.shipping_address = `${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.zipCode}`;
  emailData.shipping_phone = orderData.customer.phone;
  
  // Payment information
  const paymentMethods = {
    'card': 'Credit/Debit Card',
    'paypal': 'PayPal',
    'giftcard': 'Gift Card'
  };
  emailData.payment_method = paymentMethods[orderData.payment.type] || 'Credit/Debit Card';
  emailData.payment_status = 'Confirmed';
  
  // Product items for email
  emailData.items = orderData.products.map(product => ({
    name: product.name,
    image: product.image,
    variant: 'Standard', // You can add variant info if needed
    quantity: product.quantity,
    price: formatPrice(parsePrice(product.price) * product.quantity)
  }));
  
  // Calculate totals
  const subtotal = orderData.products.reduce((sum, product) => {
    return sum + (parsePrice(product.price) * product.quantity);
  }, 0);
  const shipping = orderData.shipping.price;
  const tax = subtotal * orderData.taxRate;
  const total = subtotal + shipping + tax;
  
  emailData.subtotal = formatPrice(subtotal);
  emailData.shipping_fee = shipping > 0 ? formatPrice(shipping) : 'FREE';
  emailData.discount = '0₫';
  emailData.grand_total = formatPrice(total);
  
  console.log('Email data prepared:', emailData);
  return emailData;
}

// Send order confirmation email (placeholder function)
function sendOrderConfirmationEmail(data) {
  console.log('Sending order confirmation email with data:', data);
  
  // Prepare email payload
  const emailPayload = {
    customer_email: orderData.customer.email,
    order_data: {
      order_number: data.order_number,
      customer_name: data.customer_name,
      items: data.items,
      subtotal: data.subtotal,
      shipping_fee: data.shipping_fee,
      discount: data.discount,
      grand_total: data.grand_total,
      shipping_name: data.shipping_name,
      shipping_address: data.shipping_address,
      shipping_phone: data.shipping_phone,
      payment_method: data.payment_method,
      payment_status: data.payment_status
    }
  };
  
  console.log('Email payload:', emailPayload);
  
  // Send email via AWS Lambda API
  fetch('https://688ypaf41h.execute-api.ap-southeast-2.amazonaws.com/default/Order-Confirmation', {
    method: 'POST',
    headers: {
      'x-api-key': 'oldiezone',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailPayload)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(result => {
    console.log('Email sent successfully:', result);
  })
  .catch(error => {
    console.error('Error sending email:', error);
    alert('Order completed but email failed to send. Please contact support.');
  });
}

// Go to home page
function goHome() {
  window.location.href = 'homepage.html';
}
