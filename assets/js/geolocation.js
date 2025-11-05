/**
 * High-Accuracy Geolocation Module with AWS Location Service
 * Uses AWS Identity Pool for authentication (no API keys needed in code!)
 * Provides GPS location with reverse geocoding for EXACT address detection
 */

// AWS Location Service Configuration
// See AWS_IDENTITY_POOL_SETUP.md for complete setup instructions
const AWS_CONFIG = {
  identityPoolId: 'ap-southeast-2:cd063ab7-873e-403b-b801-7a3a62110e2a', // Example: 'ap-southeast-2:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  region: 'ap-southeast-2', // Your AWS region (Sydney)
  placeIndexName: 'Place-Index-Oldiezone', // Example: 'OldieZone-PlaceIndex'
  language: 'vi' // Language for address results (Vietnamese)
};

// Geolocation options for maximum accuracy
const HIGH_ACCURACY_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0
};

// AWS SDK will be loaded dynamically
let locationClient = null;

/**
 * Load AWS SDK v3 libraries dynamically from CDN
 * Using Skypack CDN which is optimized for browser usage
 */
async function loadAWSSDK() {
  if (locationClient) {
    return; // Already loaded
  }

  try {
    console.log('Loading AWS SDK v3 from CDN (browser-optimized)...');

    // Load AWS SDK modules from Skypack (browser-compatible CDN)
    const locationModule = await import('https://cdn.skypack.dev/@aws-sdk/client-location@3.621.0');
    const credentialsModule = await import('https://cdn.skypack.dev/@aws-sdk/credential-providers@3.621.0');

    const { LocationClient, SearchPlaceIndexForPositionCommand } = locationModule;
    const { fromCognitoIdentityPool } = credentialsModule;

    // Create credentials using Cognito Identity Pool
    const credentials = fromCognitoIdentityPool({
      clientConfig: { region: AWS_CONFIG.region },
      identityPoolId: AWS_CONFIG.identityPoolId
    });

    // Create Location Service client with credentials
    locationClient = new LocationClient({
      region: AWS_CONFIG.region,
      credentials: credentials
    });

    // Store command class for later use
    window.SearchPlaceIndexForPositionCommand = SearchPlaceIndexForPositionCommand;

    console.log('AWS Location Service SDK loaded successfully');
    console.log('Using Identity Pool:', AWS_CONFIG.identityPoolId);
    console.log('Region:', AWS_CONFIG.region);
  } catch (error) {
    console.error('Failed to load AWS SDK:', error);
    throw new Error('Unable to load AWS Location Service. Please check your configuration.');
  }
}

/**
 * Get current GPS location with high accuracy
 * @returns {Promise<{latitude: number, longitude: number, accuracy: number}>}
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
 * Reverse geocode coordinates to detailed address using AWS Location Service
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object>}
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    // Check if Identity Pool ID is configured
    if (!AWS_CONFIG.identityPoolId || AWS_CONFIG.identityPoolId === 'YOUR_IDENTITY_POOL_ID') {
      console.warn('AWS Identity Pool not configured, falling back to OpenStreetMap');
      return await reverseGeocodeOSM(latitude, longitude);
    }

    // Check if Place Index Name is configured
    if (!AWS_CONFIG.placeIndexName || AWS_CONFIG.placeIndexName === 'YOUR_PLACE_INDEX_NAME') {
      console.warn('AWS Place Index Name not configured, falling back to OpenStreetMap');
      return await reverseGeocodeOSM(latitude, longitude);
    }

    // Load AWS SDK if not already loaded
    await loadAWSSDK();

    // Use AWS Location Service for reverse geocoding
    return await reverseGeocodeAWS(latitude, longitude);
  } catch (error) {
    console.error('Reverse geocoding error:', error);

    // Fallback to OpenStreetMap if AWS fails
    try {
      console.log('Falling back to OpenStreetMap...');
      return await reverseGeocodeOSM(latitude, longitude);
    } catch (osmError) {
      throw new Error('Unable to convert location to address. Please try again or enter manually.');
    }
  }
}

/**
 * Reverse geocode using AWS Location Service with Identity Pool
 * Provides EXACT address with detailed components
 */
async function reverseGeocodeAWS(latitude, longitude) {
  try {
    // AWS expects [longitude, latitude] format (different from standard lat/lng!)
    const input = {
      IndexName: AWS_CONFIG.placeIndexName,
      Position: [longitude, latitude], // Note: [lng, lat] NOT [lat, lng]
      Language: AWS_CONFIG.language,
      MaxResults: 1
    };

    console.log('AWS Reverse Geocoding Request:', input);

    // Create command and send request
    const command = new window.SearchPlaceIndexForPositionCommand(input);
    const response = await locationClient.send(command);

    console.log('AWS Geocoding Response:', response);

    if (!response.Results || response.Results.length === 0) {
      throw new Error('No address found for this location');
    }

    // Get the most accurate result
    const result = response.Results[0];
    const place = result.Place;

    console.log('AWS Place Details:', place);

    // Extract address components
    const addressNumber = place.AddressNumber || '';
    const street = place.Street || '';
    const neighborhood = place.Neighborhood || '';
    const municipality = place.Municipality || ''; // District/Quận/Huyện
    const subRegion = place.SubRegion || ''; // Province/Tỉnh/Thành phố
    const region = place.Region || '';
    const postalCode = place.PostalCode || '';
    const country = place.Country || '';

    // Build detailed street address for Vietnam
    const detailedStreet = buildAWSDetailedStreet({
      addressNumber,
      street,
      neighborhood,
      municipality
    });

    // Map to Vietnamese city format
    const city = mapAWSCityToVietnamese(subRegion, region, municipality);

    return {
      fullAddress: place.Label || '',
      detailedStreet: detailedStreet,
      streetNumber: addressNumber,
      route: street,
      ward: neighborhood,
      district: municipality,
      city: city,
      postalCode: postalCode,
      country: country,
      raw: place
    };
  } catch (error) {
    console.error('AWS Geocoding Error:', error);
    throw error;
  }
}

/**
 * Build detailed street address from AWS components
 * Format: "123 Nguyễn Văn Linh, Phường Tân Phú, Quận 7"
 */
function buildAWSDetailedStreet(components) {
  const parts = [];

  // Street number (Số nhà)
  if (components.addressNumber) {
    parts.push(components.addressNumber);
  }

  // Street name
  if (components.street) {
    parts.push(components.street);
  }

  // Neighborhood/Ward (Phường/Xã)
  if (components.neighborhood) {
    // Add prefix if needed
    const ward = components.neighborhood;
    if (!ward.toLowerCase().includes('phường') &&
        !ward.toLowerCase().includes('xã') &&
        !ward.toLowerCase().includes('ward')) {
      parts.push('Phường ' + ward);
    } else {
      parts.push(ward);
    }
  }

  // Municipality/District (Quận/Huyện)
  if (components.municipality) {
    const district = components.municipality;
    if (!district.toLowerCase().includes('quận') &&
        !district.toLowerCase().includes('huyện') &&
        !district.toLowerCase().includes('district')) {
      // Detect if urban or rural
      const isUrban = district.match(/^\d+$/) ||
                     district.toLowerCase().includes('city');
      const prefix = isUrban ? 'Quận ' : 'Huyện ';
      parts.push(prefix + district);
    } else {
      parts.push(district);
    }
  }

  return parts.join(', ');
}

/**
 * Map AWS city name to Vietnamese province format for dropdown
 */
function mapAWSCityToVietnamese(subRegion, region, municipality) {
  const cityName = subRegion || region || municipality || '';

  // Common mappings for major Vietnamese cities
  const cityMappings = {
    'Thành phố Hồ Chí Minh': 'TP. Hồ Chí Minh',
    'Hồ Chí Minh': 'TP. Hồ Chí Minh',
    'Ho Chi Minh City': 'TP. Hồ Chí Minh',
    'Thành phố Hà Nội': 'Hà Nội',
    'Hà Nội': 'Hà Nội',
    'Hanoi': 'Hà Nội',
    'Thành phố Đà Nẵng': 'Đà Nẵng',
    'Đà Nẵng': 'Đà Nẵng',
    'Da Nang': 'Đà Nẵng',
    'Thành phố Hải Phòng': 'Hải Phòng',
    'Hải Phòng': 'Hải Phòng',
    'Hai Phong': 'Hải Phòng',
    'Thành phố Cần Thơ': 'Cần Thơ',
    'Cần Thơ': 'Cần Thơ',
    'Can Tho': 'Cần Thơ'
  };

  // Check exact mapping
  if (cityMappings[cityName]) {
    return cityMappings[cityName];
  }

  // List of Vietnamese provinces (must match dropdown)
  const provinceList = [
    'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'Hà Giang', 'Cao Bằng', 'Lào Cai', 'Bắc Kạn', 'Lạng Sơn',
    'Tuyên Quang', 'Thái Nguyên', 'Phú Thọ', 'Yên Bái', 'Bắc Giang',
    'Quảng Ninh', 'Hòa Bình', 'Sơn La', 'Điện Biên', 'Lai Châu',
    'Vĩnh Phúc', 'Bắc Ninh', 'Hải Dương', 'Hưng Yên', 'Hà Nam',
    'Nam Định', 'Ninh Bình', 'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh',
    'Quảng Bình', 'Quảng Trị', 'Thừa Thiên - Huế', 'Quảng Nam', 'Quảng Ngãi',
    'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Ninh Thuận', 'Bình Thuận',
    'Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng',
    'Bình Phước', 'Tây Ninh', 'Bình Dương', 'Đồng Nai', 'Bà Rịa - Vũng Tàu',
    'Long An', 'Tiền Giang', 'Bến Tre', 'Trà Vinh', 'Vĩnh Long',
    'Đồng Tháp', 'An Giang', 'Kiên Giang', 'Hậu Giang', 'Sóc Trăng',
    'Bạc Liêu', 'Cà Mau'
  ];

  // Find matching province
  const searchText = cityName.toLowerCase();
  for (const province of provinceList) {
    const provinceClean = province.toLowerCase().replace('tp. ', '');
    if (searchText.includes(provinceClean) || provinceClean.includes(searchText)) {
      return province;
    }
  }

  // Return as-is if no match
  return cityName;
}

/**
 * Fallback: Reverse geocode using OpenStreetMap Nominatim
 * Less accurate but free without API key
 */
async function reverseGeocodeOSM(latitude, longitude) {
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
 * Uses AWS Location Service for EXACT address with house number
 * @param {Function} onSuccess - Callback with address object
 * @param {Function} onError - Callback with error message
 * @param {Function} onProgress - Optional callback for progress updates
 */
export async function getAddressFromGPS(onSuccess, onError, onProgress) {
  try {
    // Step 1: Get GPS location
    if (onProgress) onProgress('Getting your exact location...');

    const location = await getCurrentLocation();
    console.log('GPS Location:', location);
    console.log(`GPS Accuracy: ${Math.round(location.accuracy)}m`);

    // Check accuracy
    if (location.accuracy > 100) {
      console.warn(`Low accuracy: ${location.accuracy}m`);
      if (onProgress) onProgress('Location detected (low accuracy). Getting address...');
    } else if (location.accuracy < 20) {
      if (onProgress) onProgress('Excellent accuracy! Getting exact address...');
    } else {
      if (onProgress) onProgress('Good accuracy. Getting detailed address...');
    }

    // Step 2: Reverse geocode to get EXACT address from AWS
    const address = await reverseGeocode(location.latitude, location.longitude);
    console.log('AWS Geocoding - Detailed address:', address);

    // Step 3: Format result with EXACT detailed information
    const result = {
      // Detailed street includes house number, road, ward, district
      detailedStreet: address.detailedStreet,
      // Individual components for maximum flexibility
      streetNumber: address.streetNumber,
      route: address.route,
      ward: address.ward,
      district: address.district,
      // City matched to dropdown options
      city: address.city,
      zipCode: address.postalCode || address.zipCode,
      fullAddress: address.fullAddress,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy
      }
    };

    console.log('Final formatted result:', result);

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
