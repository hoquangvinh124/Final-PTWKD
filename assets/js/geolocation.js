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

// AWS SDK v2 is loaded from CDN in HTML (window.AWS)
let locationClient = null;

/**
 * Initialize AWS SDK v2 for Location Service
 * Uses global AWS object loaded from CDN
 * Following Amazon Q's recommended pattern for browser usage
 */
async function loadAWSSDK() {
  if (locationClient) {
    return; // Already initialized
  }

  try {
    // Check if AWS SDK is loaded
    if (typeof AWS === 'undefined' || !window.AWS) {
      throw new Error('AWS SDK not loaded. Please ensure aws-sdk-2.x.x.min.js is included in your HTML.');
    }

    console.log('Initializing AWS Location Service (SDK v2)...');

    // Configure AWS credentials with Cognito Identity Pool
    AWS.config.region = AWS_CONFIG.region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: AWS_CONFIG.identityPoolId
    });

    // Create Location Service client
    locationClient = new AWS.Location();

    console.log('✓ AWS Location Service initialized successfully');
    console.log('✓ Using Identity Pool:', AWS_CONFIG.identityPoolId);
    console.log('✓ Region:', AWS_CONFIG.region);
  } catch (error) {
    console.error('Failed to initialize AWS SDK:', error);
    throw new Error('Unable to initialize AWS Location Service. Please check your configuration.');
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
 * Uses AWS SDK v2 API
 */
async function reverseGeocodeAWS(latitude, longitude) {
  try {
    // AWS expects [longitude, latitude] format (different from standard lat/lng!)
    const params = {
      IndexName: AWS_CONFIG.placeIndexName,
      Position: [longitude, latitude], // Note: [lng, lat] NOT [lat, lng]
      Language: AWS_CONFIG.language,
      MaxResults: 1
    };

    console.log('AWS Reverse Geocoding Request:', params);

    // Call AWS Location Service (SDK v2 API pattern)
    const response = await locationClient.searchPlaceIndexForPosition(params).promise();

    console.log('AWS Geocoding Response:', response);

    if (!response.Results || response.Results.length === 0) {
      throw new Error('No address found for this location');
    }

    // Get the most accurate result
    const result = response.Results[0];
    const place = result.Place;

    console.log('AWS Place Details:', place);

    // Extract address components directly
    const addressNumber = place.AddressNumber || '';
    const street = place.Street || '';
    const neighborhood = place.Neighborhood || '';
    const municipality = place.Municipality || ''; // District/Quận/Huyện
    const subRegion = place.SubRegion || ''; // Province/Tỉnh/Thành phố
    const region = place.Region || '';
    const postalCode = place.PostalCode || '';
    const country = place.Country || '';

    // Use address directly without normalization
    const city = subRegion || region || municipality || '';

    return {
      fullAddress: place.Label || '',
      detailedStreet: place.Label || '',
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

    // Extract detailed address components directly
    const address = data.address;

    // Use address directly without normalization
    const city = address.city || address.town || address.village || address.municipality || address.state || '';

    return {
      fullAddress: data.display_name,
      detailedStreet: data.display_name,
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
