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
 * Reverse geocode coordinates to detailed address using OpenStreetMap Nominatim
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object>}
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    // Using OpenStreetMap Nominatim API with maximum detail (zoom=18)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'OldieZone-Shop'
      }
    });

    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }

    const data = await response.json();

    if (!data || !data.address) {
      throw new Error('Unable to determine address from location');
    }

    // Extract detailed address components
    const address = data.address;

    // Build detailed street address with all components
    const detailedStreet = buildDetailedStreetAddress(address);
    const city = formatCityForVietnam(address);

    return {
      fullAddress: data.display_name,
      detailedStreet: detailedStreet,
      houseNumber: address.house_number || '',
      road: address.road || '',
      ward: address.suburb || address.neighbourhood || address.quarter || '',
      district: address.city_district || address.county || address.town || '',
      city: city,
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
 * Build detailed street address with house number, road, ward, district
 */
function buildDetailedStreetAddress(address) {
  const parts = [];

  // House number (Số nhà)
  if (address.house_number) {
    parts.push(address.house_number);
  }

  // Road/Street name (Đường)
  if (address.road) {
    parts.push(address.road);
  }

  // Ward/Suburb/Neighbourhood (Phường/Xã)
  const ward = address.suburb || address.neighbourhood || address.quarter || address.hamlet;
  if (ward) {
    // Add prefix if needed
    if (!ward.toLowerCase().includes('phường') &&
        !ward.toLowerCase().includes('xã') &&
        !ward.toLowerCase().includes('ward')) {
      parts.push('Phường ' + ward);
    } else {
      parts.push(ward);
    }
  }

  // District (Quận/Huyện)
  const district = address.city_district || address.county || address.town;
  if (district) {
    // Add prefix if needed
    if (!district.toLowerCase().includes('quận') &&
        !district.toLowerCase().includes('huyện') &&
        !district.toLowerCase().includes('district')) {
      // Try to detect if it's urban (Quận) or rural (Huyện)
      const isUrbanDistrict = district.match(/^\d+$/) ||
                              address.city === 'Ho Chi Minh City' ||
                              address.city === 'Hanoi';
      const prefix = isUrbanDistrict ? 'Quận ' : 'Huyện ';
      parts.push(prefix + district);
    } else {
      parts.push(district);
    }
  }

  return parts.join(', ') || '';
}

/**
 * Format city specifically for Vietnam with proper province names
 */
function formatCityForVietnam(address) {
  // Get city/province name
  const cityName = address.city ||
                   address.town ||
                   address.village ||
                   address.municipality ||
                   address.state ||
                   '';

  // Map to standard Vietnamese province names
  return mapToVietnameseProvince(cityName, address);
}

/**
 * Map to standard Vietnamese province names (must match dropdown options)
 */
function mapToVietnameseProvince(cityName, address) {
  const searchText = cityName.toLowerCase();

  // Exact mappings for major cities
  const exactMappings = {
    'hanoi': 'Hà Nội',
    'ha noi': 'Hà Nội',
    'hà nội': 'Hà Nội',
    'ho chi minh city': 'TP. Hồ Chí Minh',
    'ho chi minh': 'TP. Hồ Chí Minh',
    'saigon': 'TP. Hồ Chí Minh',
    'sài gòn': 'TP. Hồ Chí Minh',
    'thành phố hồ chí minh': 'TP. Hồ Chí Minh',
    'da nang': 'Đà Nẵng',
    'đà nẵng': 'Đà Nẵng',
    'danang': 'Đà Nẵng',
    'hai phong': 'Hải Phòng',
    'hải phòng': 'Hải Phòng',
    'haiphong': 'Hải Phòng',
    'can tho': 'Cần Thơ',
    'cần thơ': 'Cần Thơ',
    'cantho': 'Cần Thơ'
  };

  // Check exact match first
  if (exactMappings[searchText]) {
    return exactMappings[searchText];
  }

  // Full list of Vietnamese provinces (must match dropdown in user-profile.html)
  const provinces = [
    'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'Hà Giang', 'Cao Bằng', 'Lào Cai', 'Bắc Kạn', 'Lạng Sơn',
    'Tuyên Quang', 'Thái Nguyên', 'Phú Thọ', 'Yên Bái', 'Bắc Giang',
    'Quảng Ninh', 'Hòa Bình', 'Sơn La', 'Điện Biên', 'Lai Châu',
    'Vĩnh Phúc', 'Bắc Ninh', 'Hải Dương', 'Hưng Yên', 'Hà Nam',
    'Nam Định', 'Ninh Bình', 'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh',
    'Quảng Bình', 'Quảng Trị', 'Thừa Thiên - Huế', 'Quảng Nam', 'Quảng Ngãi',
    'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Ninh Thuận'
  ];

  // Try to find matching province by partial name
  for (const province of provinces) {
    const provinceClean = province.toLowerCase()
      .replace('tp. ', '')
      .replace('thừa thiên - ', '');

    if (searchText.includes(provinceClean) || provinceClean.includes(searchText)) {
      return province;
    }
  }

  // If no match found, return original with proper capitalization
  return cityName.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
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

    // Step 2: Reverse geocode to get detailed address
    const address = await reverseGeocode(location.latitude, location.longitude);
    console.log('Detailed address:', address);

    // Step 3: Format result with detailed information
    const result = {
      // Detailed street includes: house number, road, ward, district
      detailedStreet: address.detailedStreet,
      // Individual components for flexibility
      houseNumber: address.houseNumber,
      road: address.road,
      ward: address.ward,
      district: address.district,
      // City matched to dropdown options
      city: address.city,
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
