const AUTH_KEY = 'demo.auth';
export const USERS_KEY = 'demo.users';

const DEFAULT_USERS = [
  {
    username: 'test',
    password: 'test123',
    email: 'test@example.com',
    firstName: 'Long',
    lastName: 'Huynh',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    country: 'Vietnam',
    city: 'Ho Chi Minh City',
    biography: 'Music enthusiast and vintage collector. Love old school vibes!',
    avatar: 'assets/images/default-avatar.jpg',
    memberRank: 'Gold Member',
    recentPurchased: [],
    wishlist: [],
    bookedMovies: [],
    createdAt: '2024-01-01',
    updatedAt: '2025-01-20'
  }
];

// Tạo user object mặc định cho user mới đăng ký
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
    recentPurchased: [],
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
    recentPurchased: user.recentPurchased || [],
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
 * Đăng nhập với user/pass. Trả về true nếu đúng.
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
 * Kiểm tra trạng thái đăng nhập hiện tại.
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
 * Lấy thông tin user hiện tại từ session (nếu có).
 */
export function getCurrentUser() {
  if (!isAuthenticated()) return null;
  return JSON.parse(localStorage.getItem(AUTH_KEY));
}

/**
 * Đăng xuất và xóa phiên lưu trong localStorage.
 */
export function logout() {
  localStorage.removeItem(AUTH_KEY);
}


document.addEventListener("DOMContentLoaded", () => {
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
        visible ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
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
