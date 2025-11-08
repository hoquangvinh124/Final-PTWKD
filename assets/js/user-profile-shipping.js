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

  // Initialize shipping address display
  initShippingDisplay();

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

            // Fill in the form with DETAILED GPS data
            const streetInput = document.getElementById('shippingStreet');
            const citySelect = document.getElementById('shippingCity');

            // Use detailedStreet which includes house number, road, ward, district
            if (streetInput && addressData.detailedStreet) {
              streetInput.value = addressData.detailedStreet;
              console.log('Detailed street filled:', addressData.detailedStreet);
            }

            // Auto-select the exact city/province in dropdown
            // City is already matched to dropdown options by matchCityToDropdown() in geolocation.js
            if (citySelect && addressData.city) {
              citySelect.value = addressData.city;
              console.log('City auto-selected:', addressData.city);

              // Show warning if original city name was different (for debugging)
              if (addressData.originalCity && addressData.originalCity !== addressData.city) {
                console.log(`City matched: "${addressData.originalCity}" → "${addressData.city}"`);
              }

              // Verify selection worked
              if (!citySelect.value) {
                console.warn('City not found in dropdown:', addressData.city);
                showNotification(`City "${addressData.city}" not found in list. Please select manually.`, 'warning');
              }
            }

            // Show success notification with details
            const accuracy = addressData.coordinates ? Math.round(addressData.coordinates.accuracy) : 0;
            let message = `Location detected! Accuracy: ${accuracy}m`;

            if (addressData.houseNumber) {
              message += `\nHouse: ${addressData.houseNumber}`;
            }
            if (addressData.road) {
              message += `\nRoad: ${addressData.road}`;
            }
            if (addressData.ward) {
              message += `\nWard: ${addressData.ward}`;
            }
            if (addressData.district) {
              message += `\nDistrict: ${addressData.district}`;
            }

            console.log(message);
            showNotification('Detailed address filled successfully!', 'success');

            // Warn if accuracy is low
            if (accuracy > 50) {
              showNotification(`GPS accuracy: ${accuracy}m. Please verify the address is correct.`, 'info');
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
  const currentUser = getCurrentUser();

  // Fill in form fields
  const fullNameInput = document.getElementById('shippingFullName');
  const phoneInput = document.getElementById('shippingPhone');
  const citySelect = document.getElementById('shippingCity');
  const streetInput = document.getElementById('shippingStreet');
  const addressTypeRadios = document.querySelectorAll('input[name="addressType"]');

  if (address) {
    // Load saved address data
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
  }

  // Auto-fill full name from user profile if empty
  if (fullNameInput && !fullNameInput.value && currentUser) {
    const defaultFullName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
    if (defaultFullName) {
      fullNameInput.value = defaultFullName;
      console.log('Auto-filled full name from user profile:', defaultFullName);
    }
  }
}

// Initialize shipping address display on page load
function initShippingDisplay() {
  const address = getShippingAddress();
  const hasData = address && Object.values(address).some(v => v);
  const shippingFormPanel = document.getElementById('shippingAddressForm');
  const shippingSavedDisplay = document.getElementById('shippingAddressSaved');

  if (hasData && shippingFormPanel && shippingSavedDisplay) {
    shippingFormPanel.style.display = 'none';
    shippingSavedDisplay.classList.remove('d-none');
    updateShippingDisplay(address);
  } else {
    // Form is showing (no saved data), auto-fill full name from user profile
    const currentUser = getCurrentUser();
    const fullNameInput = document.getElementById('shippingFullName');

    if (fullNameInput && !fullNameInput.value && currentUser) {
      const defaultFullName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
      if (defaultFullName) {
        fullNameInput.value = defaultFullName;
        console.log('Auto-filled full name on page load:', defaultFullName);
      }
    }
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
