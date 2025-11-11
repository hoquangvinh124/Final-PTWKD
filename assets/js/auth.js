const AUTH_KEY = 'demo.auth';
export const USERS_KEY = 'demo.users';

// DEFAULT_USERS will be loaded from users.json
let DEFAULT_USERS = [];
let usersLoaded = false;

// Load default users from JSON file
async function loadDefaultUsers() {
  try {
    const response = await fetch('users.json');
    if (!response.ok) {
      throw new Error('Failed to load users.json');
    }
    DEFAULT_USERS = await response.json();
    usersLoaded = true;
    console.log('Default users loaded successfully from users.json');
    return DEFAULT_USERS;
  } catch (error) {
    console.error('Error loading default users:', error);
    // Fallback to empty array if fetch fails
    DEFAULT_USERS = [];
    usersLoaded = true;
    return DEFAULT_USERS;
  }
}

// Initialize users in localStorage from users.json if not exists
export async function initializeUsers() {
  // Check if users already exist in localStorage
  const existingUsers = localStorage.getItem(USERS_KEY);
  
  if (!existingUsers) {
    console.log('No users in localStorage, loading from users.json...');
    await loadDefaultUsers();
    
    if (DEFAULT_USERS.length > 0) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      console.log(`Initialized ${DEFAULT_USERS.length} users in localStorage`);
    }
  } else {
    console.log('Users already exist in localStorage');
    // Still load DEFAULT_USERS for fallback
    await loadDefaultUsers();
  }
}

// Create default user object for newly registered user
export function createNewUser(username, password, email = '', firstName = '', lastName = '') {
  return {
    username: username.trim(),
    password,
    email: email.trim(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    dateOfBirth: '',
    gender: '',
    country: '',
    city: '',
    biography: '',
    avatar: 'assets/images/default-avatar.jpg',
    memberRank: 'Member',
    shippingAddress: {
      fullName: '',
      phone: '',
      street: '',
      city: '',
      zipCode: '',
      addressType: 'home'
    },
    recentPurchased: [],
    purchasedOrders: [],
    wishlist: [],
    bookedMovies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [...DEFAULT_USERS];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_USERS];
  } catch (err) {
    console.warn('User store corrupted:', err);
    localStorage.removeItem(USERS_KEY);
    return [...DEFAULT_USERS];
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function cacheSession(user) {
  const payload = {
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    country: user.country,
    city: user.city,
    biography: user.biography,
    memberRank: user.memberRank || 'Member',
    shippingAddress: user.shippingAddress || {
      fullName: '',
      phone: '',
      street: '',
      city: '',
      zipCode: '',
      addressType: 'home'
    },
    recentPurchased: user.recentPurchased || [],
    purchasedOrders: user.purchasedOrders || [],
    wishlist: user.wishlist || [],
    bookedMovies: user.bookedMovies || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    issuedAt: Date.now()
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
  return payload;
}

/**
 * Login with user/pass. Returns true if correct.
 */
export function login(username, password) {
  const users = loadUsers();
  const match = users.find((user) => user.username === username && user.password === password);

  if (!match) {
    logout();
    return false;
  }

  cacheSession(match);
  return true;
}

export function register(username, password, firstName = '', lastName = '', email = '') {
  const trimmedUsername = username?.trim();
  if (!trimmedUsername || !password) {
    return { success: false, reason: 'INVALID_CREDENTIALS' };
  }

  const users = loadUsers();
  const exists = users.some((user) => user.username === trimmedUsername);

  if (exists) {
    return { success: false, reason: 'USER_EXISTS' };
  }

  const newUser = createNewUser(trimmedUsername, password, email, firstName, lastName);
  users.push(newUser);
  saveUsers(users);

  const loggedIn = login(trimmedUsername, password);
  return { success: loggedIn, reason: loggedIn ? null : 'LOGIN_FAILED' };
}

/**
 * Check current login status.
 */
export function isAuthenticated() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return false;

    const session = JSON.parse(raw);
    return Boolean(session?.username);
  } catch (err) {
    console.warn('Auth session corrupted:', err);
    logout();
    return false;
  }
}
 
/**
 * Get current user information from session (if any).
 */
export function getCurrentUser() {
  if (!isAuthenticated()) return null;
  return JSON.parse(localStorage.getItem(AUTH_KEY));
}

/**
 * Logout and clear session stored in localStorage.
 */
export function logout() {
  localStorage.removeItem(AUTH_KEY);
}


document.addEventListener("DOMContentLoaded", async () => {
  // Load default users from JSON first
  await loadDefaultUsers();

  const vinylButton = document.querySelector(".vinyl");
  const audio = document.getElementById("vinyl-audio");

  const toggleFields = document.querySelectorAll(".field.has-toggle");

  toggleFields.forEach((field) => {
    const input = field.querySelector("input");
    const toggleButton = field.querySelector(".toggle-password");

    if (!input || !toggleButton) {
      return;
    }

    let isVisible = false;

    const updateVisibility = (visible) => {
      isVisible = visible;
      input.setAttribute("type", visible ? "text" : "password");
      toggleButton.setAttribute("aria-pressed", visible ? "true" : "false");
      toggleButton.setAttribute(
        "aria-label",
        visible ? "Ẩn mật khẩu" : "Show password"
      );
      toggleButton.classList.toggle("is-active", visible);
    };

    toggleButton.addEventListener("click", () => {
      updateVisibility(!isVisible);
    });

    toggleButton.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        updateVisibility(!isVisible);
      }
    });

    updateVisibility(false);
  });

  if (!vinylButton || !audio) {
    return;
  }

  let isPlaying = false;

  const setPlayingState = (shouldPlay) => {
    isPlaying = shouldPlay;
    vinylButton.classList.toggle("is-playing", shouldPlay);
    vinylButton.setAttribute("aria-pressed", shouldPlay ? "true" : "false");

    if (shouldPlay) {
      const playPromise = audio.play();
      if (playPromise instanceof Promise) {
        playPromise.catch(() => {
          vinylButton.classList.remove("is-playing");
          vinylButton.setAttribute("aria-pressed", "false");
          isPlaying = false;
        });
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const togglePlayback = () => {
    setPlayingState(!isPlaying);
  };

  setPlayingState(false);

  vinylButton.addEventListener("click", togglePlayback);

  vinylButton.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      togglePlayback();
    }
  });
});

/**
 * Add a booked movie to the user's bookedMovies list
 */
export function addBookedMovie(movieData) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.error('No user logged in');
    return false;
  }

  const users = loadUsers();
  const userIndex = users.findIndex(u => u.username === currentUser.username);

  if (userIndex === -1) {
    console.error('User not found in storage');
    return false;
  }

  // Initialize bookedMovies if it doesn't exist
  if (!users[userIndex].bookedMovies) {
    users[userIndex].bookedMovies = [];
  }

  // Add booking with timestamp
  const booking = {
    ...movieData,
    bookedAt: new Date().toISOString()
  };

  users[userIndex].bookedMovies.push(booking);
  users[userIndex].updatedAt = new Date().toISOString();

  // Save to storage
  saveUsers(users);

  // Update session
  cacheSession(users[userIndex]);

  return true;
}

/**
 * Get all booked movies for current user
 */
export function getBookedMovies() {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];

  return currentUser.bookedMovies || [];
}

/**
 * Cancel a booked movie by index
 */
export function cancelBookedMovie(index) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.error('No user logged in');
    return false;
  }

  const users = loadUsers();
  const userIndex = users.findIndex(u => u.username === currentUser.username);

  if (userIndex === -1) {
    console.error('User not found in storage');
    return false;
  }

  // Initialize bookedMovies if it doesn't exist
  if (!users[userIndex].bookedMovies) {
    users[userIndex].bookedMovies = [];
  }

  // Remove booking at index
  if (index >= 0 && index < users[userIndex].bookedMovies.length) {
    users[userIndex].bookedMovies.splice(index, 1);
    users[userIndex].updatedAt = new Date().toISOString();

    // Save to storage
    saveUsers(users);

    // Update session
    cacheSession(users[userIndex]);

    return true;
  }

  return false;
}

/**
 * Add a purchased order to the user's purchasedOrders list
 */
export function addPurchasedOrder(orderData) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.error('No user logged in');
    return false;
  }

  const users = loadUsers();
  const userIndex = users.findIndex(u => u.username === currentUser.username);

  if (userIndex === -1) {
    console.error('User not found in storage');
    return false;
  }

  // Initialize purchasedOrders if it doesn't exist
  if (!users[userIndex].purchasedOrders) {
    users[userIndex].purchasedOrders = [];
  }

  // Add order with timestamp
  const order = {
    ...orderData,
    orderDate: orderData.orderDate || new Date().toISOString()
  };

  users[userIndex].purchasedOrders.unshift(order); // Add to beginning of array
  users[userIndex].updatedAt = new Date().toISOString();

  // Save to storage
  saveUsers(users);

  // Update session
  cacheSession(users[userIndex]);

  return true;
}

/**
 * Get all purchased orders for current user
 */
export function getPurchasedOrders() {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];

  return currentUser.purchasedOrders || [];
}

/**
 * Get a specific purchased order by orderId
 */
export function getPurchasedOrderById(orderId) {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const orders = currentUser.purchasedOrders || [];
  return orders.find(order => order.orderId === orderId) || null;
}

/**
 * Update shipping address for current user
 */
export function updateShippingAddress(addressData) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.error('No user logged in');
    return false;
  }

  const users = loadUsers();
  const userIndex = users.findIndex(u => u.username === currentUser.username);

  if (userIndex === -1) {
    console.error('User not found in storage');
    return false;
  }

  // Update shipping address
  users[userIndex].shippingAddress = {
    fullName: addressData.fullName || '',
    phone: addressData.phone || '',
    street: addressData.street || '',
    city: addressData.city || '',
    zipCode: addressData.zipCode || '',
    addressType: addressData.addressType || 'home'
  };
  users[userIndex].updatedAt = new Date().toISOString();

  // Save to storage
  saveUsers(users);

  // Update session
  cacheSession(users[userIndex]);

  return true;
}

/**
 * Get shipping address for current user
 */
export function getShippingAddress() {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  return currentUser.shippingAddress || null;
}
