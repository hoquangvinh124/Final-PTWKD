// Global variables
let currentStep = 1;
let orderData = {
  customer: {},
  products: {
    vinyl: { name: "Vinyl Record Player - Retro Edition", price: 299.00, quantity: 1 },
    cassette: { name: "Cassette Player - Vintage", price: 159.00, quantity: 0 }
  },
  shipping: { type: "standard", price: 9.99 },
  payment: { type: "card" },
  taxRate: 0.08 // 8% tax rate
};

// Initialize the checkout process
document.addEventListener('DOMContentLoaded', function() {
  updateProgressSteps();
  updateOrderSummary();
  
  // Add event listeners for product selection
  document.querySelectorAll('.product-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('.product-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      this.classList.add('selected');
    });
  });

  // Add event listeners for shipping options
  document.querySelectorAll('.shipping-option').forEach(option => {
    option.addEventListener('click', function() {
      const shippingType = this.dataset.shipping;
      const shippingPrice = parseFloat(this.dataset.price);
      
      document.querySelectorAll('.shipping-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      this.classList.add('selected');
      
      // Update order data
      orderData.shipping.type = shippingType;
      orderData.shipping.price = shippingPrice;
      
      // Update order summary
      updateOrderSummary();
    });
  });

  // Add event listeners for payment options
  document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('.payment-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      this.classList.add('selected');
      
      // Update order data
      orderData.payment.type = this.dataset.payment;
    });
  });

  // Add event listeners for quantity controls
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const action = this.dataset.action;
      const product = this.closest('.product-option').dataset.product;
      const input = this.parentElement.querySelector('.qty-input');
      let value = parseInt(input.value);
      
      if (action === 'increase') {
        value++;
      } else if (action === 'decrease' && value > 0) {
        value--;
      }
      
      input.value = value;
      
      // Update order data
      orderData.products[product].quantity = value;
      
      // Update order summary
      updateOrderSummary();
    });
  });
  
  // Add event listeners for quantity input changes
  document.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', function() {
      const product = this.dataset.product;
      let value = parseInt(this.value);
      
      if (isNaN(value) || value < 0) {
        value = 0;
        this.value = 0;
      }
      
      // Update order data
      orderData.products[product].quantity = value;
      
      // Update order summary
      updateOrderSummary();
    });
  });
});

// Fill default customer information
function fillDefaultInfo() {
  const defaultInfo = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street",
    city: "San Francisco",
    zipCode: "94103"
  };
  
  // Fill the form fields
  document.getElementById('firstName').value = defaultInfo.firstName;
  document.getElementById('lastName').value = defaultInfo.lastName;
  document.getElementById('email').value = defaultInfo.email;
  document.getElementById('phone').value = defaultInfo.phone;
  document.getElementById('address').value = defaultInfo.address;
  document.getElementById('city').value = defaultInfo.city;
  document.getElementById('zipCode').value = defaultInfo.zipCode;
  
  // Save to order data
  orderData.customer = defaultInfo;
  
  // Show confirmation message
  showQuickFillConfirmation();
}

// Show confirmation when default info is filled
function showQuickFillConfirmation() {
  // Create a temporary confirmation message
  const confirmation = document.createElement('div');
  confirmation.className = 'quick-fill-confirmation';
  confirmation.innerHTML = `
    <div class="confirmation-content">
      <i class="fas fa-check-circle"></i>
      <span>Default information filled successfully!</span>
    </div>
  `;
  
  // Add styles for the confirmation
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
  
  // Add to document and remove after animation
  document.body.appendChild(confirmation);
  setTimeout(() => {
    if (confirmation.parentNode) {
      confirmation.parentNode.removeChild(confirmation);
    }
    if (style.parentNode) {
      style.parentNode.removeChild(style);
    }
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
  // Validate current step before proceeding
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
  
  // Save customer info to order data
  orderData.customer = {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    zipCode
  };
  
  return true;
}

// Validate products selection
function validateProducts() {
  const totalQuantity = Object.values(orderData.products).reduce((sum, product) => sum + product.quantity, 0);
  return totalQuantity > 0;
}

// Update order summary
function updateOrderSummary() {
  const summaryItems = document.getElementById('summaryItems');
  const subtotalElement = document.getElementById('subtotal');
  const shippingCostElement = document.getElementById('shippingCost');
  const taxAmountElement = document.getElementById('taxAmount');
  const totalAmountElement = document.getElementById('totalAmount');
  
  // Clear current items
  summaryItems.innerHTML = '';
  
  // Add products to summary
  Object.values(orderData.products).forEach(product => {
    if (product.quantity > 0) {
      const productElement = document.createElement('div');
      productElement.className = 'summary-product';
      productElement.innerHTML = `
        <div class="summary-product-image">
          <i class="fa-solid fa-${product === orderData.products.vinyl ? 'record-vinyl' : 'cassette-tape'}"></i>
        </div>
        <div class="summary-product-info">
          <div class="summary-product-name">${product.name}</div>
          <div class="summary-product-variant">Qty: ${product.quantity}</div>
        </div>
        <div class="summary-product-price">$${(product.price * product.quantity).toFixed(2)}</div>
      `;
      summaryItems.appendChild(productElement);
    }
  });
  
  // Calculate totals
  const subtotal = Object.values(orderData.products).reduce((sum, product) => 
    sum + (product.price * product.quantity), 0);
  const shipping = orderData.shipping.price;
  const tax = subtotal * orderData.taxRate;
  const total = subtotal + shipping + tax;
  
  // Update summary values
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  shippingCostElement.textContent = shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE';
  taxAmountElement.textContent = `$${tax.toFixed(2)}`;
  totalAmountElement.textContent = `$${total.toFixed(2)}`;
}

// Complete order
function completeOrder() {
  // Show loading screen
  const loadingScreen = document.getElementById('loadingScreen');
  loadingScreen.classList.add('active');
  
  // Simulate order processing
  setTimeout(() => {
    // Hide loading screen
    loadingScreen.classList.remove('active');
    
    // Generate random order ID
    const orderId = `#LDIE${new Date().getFullYear()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    document.getElementById('orderId').textContent = orderId;
    
    // Show success screen
    showStep(5);
  }, 3000);
}

// Go to home page
function goHome() {
  window.location.href = 'index.html';
}