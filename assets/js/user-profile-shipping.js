// User Profile Shipping Address Handler
import { updateShippingAddress, getShippingAddress, getCurrentUser } from './auth.js';
import { getAddressFromGPS, showGPSLoading, isGeolocationSupported } from './geolocation.js';

// Initialize shipping address functionality
document.addEventListener('DOMContentLoaded', () => {
  const shippingForm = document.getElementById('shippingAddressForm');
  const shippingSaveBtn = document.getElementById('shippingSaveBtn');
  const shippingClearBtn = document.getElementById('shippingClearBtn');
  const shippingEditBtn = document.getElementById('shippingEditBtn');
  const shippingGPSBtn = document.getElementById('shippingGPSBtn');
  const shippingFormPanel = document.getElementById('shippingAddressForm');
  const shippingSavedDisplay = document.getElementById('shippingAddressSaved');

  if (!shippingForm) return;

  // Load saved shipping address
  loadShippingAddress();

  // GPS Button Handler
  if (shippingGPSBtn) {
    // Check if geolocation is supported
    if (!isGeolocationSupported()) {
      shippingGPSBtn.disabled = true;
      shippingGPSBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> GPS Not Supported';
      shippingGPSBtn.title = 'Your browser does not support geolocation';
    }

    shippingGPSBtn.addEventListener('click', async () => {
      const hideLoading = showGPSLoading(shippingGPSBtn);

      try {
        await getAddressFromGPS(
          // onSuccess
          (addressData) => {
            hideLoading();

            // Fill in the form with GPS data
            const streetInput = document.getElementById('shippingStreet');
            const citySelect = document.getElementById('shippingCity');

            if (streetInput && addressData.street) {
              streetInput.value = addressData.street;
            }

            if (citySelect && addressData.city) {
              // Try to select the city in the dropdown
              const options = Array.from(citySelect.options);
              const matchingOption = options.find(opt =>
                opt.value.toLowerCase().includes(addressData.city.toLowerCase()) ||
                addressData.city.toLowerCase().includes(opt.value.toLowerCase())
              );

              if (matchingOption) {
                citySelect.value = matchingOption.value;
              } else {
                // If not found in dropdown, just set the value (will show as text)
                citySelect.value = addressData.city;
              }
            }

            // Show success notification
            showNotification('Location detected successfully!', 'success');

            // Log accuracy
            if (addressData.coordinates) {
              console.log(`GPS Accuracy: ${Math.round(addressData.coordinates.accuracy)}m`);
              if (addressData.coordinates.accuracy > 50) {
                showNotification('Location accuracy is moderate. You may need to adjust the address.', 'info');
              }
            }
          },
          // onError
          (errorMessage) => {
            hideLoading();
            showNotification(errorMessage, 'error');
          },
          // onProgress (optional)
          (message) => {
            console.log('GPS Progress:', message);
          }
        );
      } catch (error) {
        hideLoading();
        console.error('GPS Error:', error);
      }
    });
  }

  // Save Button Handler
  if (shippingSaveBtn) {
    shippingSaveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      saveShippingAddress();
    });
  }

  // Clear Button Handler
  if (shippingClearBtn) {
    shippingClearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const savedAddress = getShippingAddress();
      if (savedAddress && Object.values(savedAddress).some(v => v)) {
        // Show saved display if there's saved data
        shippingFormPanel.style.display = 'none';
        shippingSavedDisplay.classList.remove('d-none');
      } else {
        // Just clear the form
        clearShippingForm();
      }
    });
  }

  // Edit Button Handler
  if (shippingEditBtn) {
    shippingEditBtn.addEventListener('click', (e) => {
      e.preventDefault();
      shippingFormPanel.style.display = 'block';
      shippingSavedDisplay.classList.add('d-none');
      loadShippingAddress(); // Load data into form
    });
  }
});

// Load shipping address from user data
function loadShippingAddress() {
  const address = getShippingAddress();

  if (!address) return;

  // Fill in form fields
  const fullNameInput = document.getElementById('shippingFullName');
  const phoneInput = document.getElementById('shippingPhone');
  const citySelect = document.getElementById('shippingCity');
  const streetInput = document.getElementById('shippingStreet');
  const addressTypeRadios = document.querySelectorAll('input[name="addressType"]');

  if (fullNameInput) fullNameInput.value = address.fullName || '';
  if (phoneInput) phoneInput.value = address.phone || '';
  if (citySelect) citySelect.value = address.city || '';
  if (streetInput) streetInput.value = address.street || '';

  if (addressTypeRadios && address.addressType) {
    addressTypeRadios.forEach(radio => {
      radio.checked = radio.value === address.addressType;
    });
  }

  // Update display
  updateShippingDisplay(address);

  // Show appropriate panel
  const hasData = Object.values(address).some(v => v);
  const shippingFormPanel = document.getElementById('shippingAddressForm');
  const shippingSavedDisplay = document.getElementById('shippingAddressSaved');

  if (hasData && shippingFormPanel && shippingSavedDisplay) {
    shippingFormPanel.style.display = 'none';
    shippingSavedDisplay.classList.remove('d-none');
  }
}

// Save shipping address
function saveShippingAddress() {
  const fullName = document.getElementById('shippingFullName')?.value.trim();
  const phone = document.getElementById('shippingPhone')?.value.trim();
  const city = document.getElementById('shippingCity')?.value;
  const street = document.getElementById('shippingStreet')?.value.trim();
  const addressType = document.querySelector('input[name="addressType"]:checked')?.value || 'home';

  // Validation
  if (!fullName || !phone || !city || !street) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }

  const addressData = {
    fullName,
    phone,
    city,
    street,
    zipCode: '', // Can be added if needed
    addressType
  };

  // Save to user profile
  const success = updateShippingAddress(addressData);

  if (success) {
    showNotification('Shipping address saved successfully!', 'success');

    // Update display
    updateShippingDisplay(addressData);

    // Hide form, show saved display
    const shippingFormPanel = document.getElementById('shippingAddressForm');
    const shippingSavedDisplay = document.getElementById('shippingAddressSaved');

    if (shippingFormPanel) shippingFormPanel.style.display = 'none';
    if (shippingSavedDisplay) shippingSavedDisplay.classList.remove('d-none');
  } else {
    showNotification('Failed to save shipping address', 'error');
  }
}

// Update shipping address display
function updateShippingDisplay(address) {
  const displayFullName = document.getElementById('displayShippingFullName');
  const displayPhone = document.getElementById('displayShippingPhone');
  const displayCity = document.getElementById('displayShippingCity');
  const displayStreet = document.getElementById('displayShippingStreet');

  if (displayFullName) displayFullName.textContent = address.fullName || '--';
  if (displayPhone) displayPhone.textContent = address.phone || '--';
  if (displayCity) displayCity.textContent = address.city || '--';
  if (displayStreet) displayStreet.textContent = address.street || '--';
}

// Clear shipping form
function clearShippingForm() {
  const fullNameInput = document.getElementById('shippingFullName');
  const phoneInput = document.getElementById('shippingPhone');
  const citySelect = document.getElementById('shippingCity');
  const streetInput = document.getElementById('shippingStreet');

  if (fullNameInput) fullNameInput.value = '';
  if (phoneInput) phoneInput.value = '';
  if (citySelect) citySelect.value = '';
  if (streetInput) streetInput.value = '';
}

// Show notification helper
function showNotification(message, type = 'info') {
  // Check if notification system exists
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
  } else {
    // Fallback to alert
    alert(message);
  }
}
