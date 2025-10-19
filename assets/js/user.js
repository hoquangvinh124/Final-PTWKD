import { getCurrentUser, isAuthenticated, loadUsers, saveUsers } from './auth.js';

/**
 * Lấy thông tin đầy đủ của user hiện tại từ users store.
 */
export function getCurrentUserProfile() {
  const session = getCurrentUser();
  if (!session) return null;

  const users = loadUsers();
  return users.find(user => user.username === session.username) || null;
}

/**
 * Lấy thông tin user theo username.
 */
export function getUserByUsername(username) {
  const users = loadUsers();
  return users.find(user => user.username === username) || null;
}

/**
 * Cập nhật thông tin profile của user hiện tại.
 */
export function updateUserProfile(updates) {
  if (!isAuthenticated()) {
    return { success: false, reason: 'NOT_AUTHENTICATED' };
  }

  const session = getCurrentUser();
  const users = loadUsers();
  const userIndex = users.findIndex(user => user.username === session.username);

  if (userIndex === -1) {
    return { success: false, reason: 'USER_NOT_FOUND' };
  }

  // Cập nhật thông tin user
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    username: users[userIndex].username, // Không cho phép thay đổi username
    password: users[userIndex].password, // Không cho phép thay đổi password qua hàm này
    updatedAt: new Date().toISOString()
  };

  saveUsers(users);

  return { success: true, user: users[userIndex] };
}

/**
 * Thay đổi mật khẩu của user hiện tại.
 */
export function changePassword(oldPassword, newPassword) {
  if (!isAuthenticated()) {
    return { success: false, reason: 'NOT_AUTHENTICATED' };
  }

  const session = getCurrentUser();
  const users = loadUsers();
  const userIndex = users.findIndex(user => user.username === session.username);

  if (userIndex === -1) {
    return { success: false, reason: 'USER_NOT_FOUND' };
  }

  if (users[userIndex].password !== oldPassword) {
    return { success: false, reason: 'WRONG_PASSWORD' };
  }

  users[userIndex].password = newPassword;
  users[userIndex].updatedAt = new Date().toISOString();
  saveUsers(users);

  return { success: true };
}

/**
 * Lấy danh sách wishlist của user hiện tại.
 */
export function getWishlist() {
  const profile = getCurrentUserProfile();
  return profile ? profile.wishlist : [];
}

/**
 * Thêm sản phẩm vào wishlist.
 */
export function addToWishlist(product) {
  if (!isAuthenticated()) {
    return { success: false, reason: 'NOT_AUTHENTICATED' };
  }

  const session = getCurrentUser();
  const users = loadUsers();
  const userIndex = users.findIndex(user => user.username === session.username);

  if (userIndex === -1) {
    return { success: false, reason: 'USER_NOT_FOUND' };
  }

  // Kiểm tra xem sản phẩm đã có trong wishlist chưa
  const exists = users[userIndex].wishlist.some(item => item.id === product.id);
  if (exists) {
    return { success: false, reason: 'ALREADY_IN_WISHLIST' };
  }

  users[userIndex].wishlist.push({
    ...product,
    addedAt: new Date().toISOString()
  });
  users[userIndex].updatedAt = new Date().toISOString();
  saveUsers(users);

  return { success: true, wishlist: users[userIndex].wishlist };
}

/**
 * Xóa sản phẩm khỏi wishlist.
 */
export function removeFromWishlist(productId) {
  if (!isAuthenticated()) {
    return { success: false, reason: 'NOT_AUTHENTICATED' };
  }

  const session = getCurrentUser();
  const users = loadUsers();
  const userIndex = users.findIndex(user => user.username === session.username);

  if (userIndex === -1) {
    return { success: false, reason: 'USER_NOT_FOUND' };
  }

  users[userIndex].wishlist = users[userIndex].wishlist.filter(item => item.id !== productId);
  users[userIndex].updatedAt = new Date().toISOString();
  saveUsers(users);

  return { success: true, wishlist: users[userIndex].wishlist };
}

/**
 * Kiểm tra xem sản phẩm có trong wishlist không.
 */
export function isInWishlist(productId) {
  const profile = getCurrentUserProfile();
  if (!profile) return false;

  return profile.wishlist.some(item => item.id === productId);
}

/**
 * Lấy lịch sử mua hàng của user hiện tại.
 */
export function getRecentPurchased() {
  const profile = getCurrentUserProfile();
  return profile ? profile.recentPurchased : [];
}

/**
 * Thêm sản phẩm vào lịch sử mua hàng.
 */
export function addToRecentPurchased(product) {
  if (!isAuthenticated()) {
    return { success: false, reason: 'NOT_AUTHENTICATED' };
  }

  const session = getCurrentUser();
  const users = loadUsers();
  const userIndex = users.findIndex(user => user.username === session.username);

  if (userIndex === -1) {
    return { success: false, reason: 'USER_NOT_FOUND' };
  }

  const purchase = {
    ...product,
    purchasedAt: new Date().toISOString()
  };

  users[userIndex].recentPurchased.unshift(purchase);
  users[userIndex].updatedAt = new Date().toISOString();
  saveUsers(users);

  // Xóa sản phẩm khỏi wishlist nếu có
  users[userIndex].wishlist = users[userIndex].wishlist.filter(item => item.id !== product.id);
  saveUsers(users);

  return { success: true, recentPurchased: users[userIndex].recentPurchased };
}

/**
 * Cập nhật avatar của user.
 */
export function updateAvatar(avatarUrl) {
  return updateUserProfile({ avatar: avatarUrl });
}

/**
 * Lấy thống kê user (tổng số sản phẩm đã mua, wishlist, etc).
 */
export function getUserStats() {
  const profile = getCurrentUserProfile();
  if (!profile) return null;

  return {
    totalPurchased: profile.recentPurchased.length,
    totalWishlist: profile.wishlist.length,
    totalSpent: profile.recentPurchased.reduce((sum, item) => sum + (item.price || 0), 0),
    memberSince: profile.createdAt,
    lastUpdated: profile.updatedAt
  };
}
