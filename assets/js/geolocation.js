/**
 * High-Accuracy Geolocation Module
 * Provides GPS location with reverse geocoding for address detection
 */

// Geolocation options for high accuracy
const HIGH_ACCURACY_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0
};

/**
 * Get current GPS location with high accuracy
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your GPS settings.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        reject(new Error(errorMessage));
      },
      HIGH_ACCURACY_OPTIONS
    );
  });
}

/**
 * Reverse geocode coordinates to address using OpenStreetMap Nominatim
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object>}
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    // Using OpenStreetMap Nominatim API (free, no API key required)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'OldieZone-Shop' // Required by Nominatim
      }
    });

    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }

    const data = await response.json();

    if (!data || !data.address) {
      throw new Error('Unable to determine address from location');
    }

    // Extract and format address components
    const address = data.address;

    return {
      fullAddress: data.display_name,
      street: formatStreetAddress(address),
      city: formatCity(address),
      state: address.state || '',
      country: address.country || '',
      postcode: address.postcode || '',
      raw: data
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw new Error('Unable to convert location to address. Please try again or enter manually.');
  }
}

/**
 * Format street address from Nominatim address components
 */
function formatStreetAddress(address) {
  const parts = [];

  // Street number and name
  if (address.house_number) parts.push(address.house_number);
  if (address.road) parts.push(address.road);

  // Alternative address components
  if (!parts.length && address.hamlet) parts.push(address.hamlet);
  if (!parts.length && address.suburb) parts.push(address.suburb);
  if (!parts.length && address.neighbourhood) parts.push(address.neighbourhood);

  return parts.join(' ') || '';
}

/**
 * Format city from Nominatim address components
 */
function formatCity(address) {
  // Try different city-level components in order of preference
  return address.city ||
         address.town ||
         address.village ||
         address.municipality ||
         address.county ||
         address.state_district ||
         '';
}

/**
 * Map Vietnamese province names to standard format
 */
function mapVietnameseProvince(city, state) {
  const vietnameseProvinces = {
    'Hà Nội': ['Hanoi', 'Ha Noi', 'Hà Nội'],
    'TP. Hồ Chí Minh': ['Ho Chi Minh City', 'Saigon', 'Sài Gòn', 'Thành phố Hồ Chí Minh'],
    'Đà Nẵng': ['Da Nang', 'Đà Nẵng', 'Danang'],
    'Hải Phòng': ['Hai Phong', 'Hải Phòng', 'Haiphong'],
    'Cần Thơ': ['Can Tho', 'Cần Thơ', 'Cantho']
  };

  const searchText = (city + ' ' + state).toLowerCase();

  for (const [standard, variants] of Object.entries(vietnameseProvinces)) {
    if (variants.some(v => searchText.includes(v.toLowerCase()))) {
      return standard;
    }
  }

  return city || state;
}

/**
 * Get address from GPS with loading UI feedback
 * @param {Function} onSuccess - Callback with address object
 * @param {Function} onError - Callback with error message
 * @param {Function} onProgress - Optional callback for progress updates
 */
export async function getAddressFromGPS(onSuccess, onError, onProgress) {
  try {
    // Step 1: Get GPS location
    if (onProgress) onProgress('Getting your location...');

    const location = await getCurrentLocation();
    console.log('GPS Location:', location);

    // Check accuracy
    if (location.accuracy > 100) {
      console.warn(`Low accuracy: ${location.accuracy}m`);
      if (onProgress) onProgress('Location detected (low accuracy). Getting address...');
    } else {
      if (onProgress) onProgress('High accuracy location detected. Getting address...');
    }

    // Step 2: Reverse geocode
    const address = await reverseGeocode(location.latitude, location.longitude);
    console.log('Reverse geocoded address:', address);

    // Step 3: Format for Vietnam
    const formattedCity = mapVietnameseProvince(address.city, address.state);

    const result = {
      street: address.street,
      city: formattedCity,
      zipCode: address.postcode,
      fullAddress: address.fullAddress,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy
      }
    };

    if (onSuccess) onSuccess(result);
    return result;

  } catch (error) {
    console.error('GPS Address Error:', error);
    if (onError) onError(error.message);
    throw error;
  }
}

/**
 * Show GPS loading indicator
 */
export function showGPSLoading(buttonElement) {
  if (!buttonElement) return;

  const originalHTML = buttonElement.innerHTML;
  buttonElement.disabled = true;
  buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';

  return () => {
    buttonElement.disabled = false;
    buttonElement.innerHTML = originalHTML;
  };
}

/**
 * Check if browser supports geolocation
 */
export function isGeolocationSupported() {
  return 'geolocation' in navigator;
}

/**
 * Request geolocation permission
 */
export async function requestGeolocationPermission() {
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state; // 'granted', 'denied', or 'prompt'
  } catch (error) {
    // Fallback: try to get location directly
    try {
      await getCurrentLocation();
      return 'granted';
    } catch {
      return 'denied';
    }
  }
}
