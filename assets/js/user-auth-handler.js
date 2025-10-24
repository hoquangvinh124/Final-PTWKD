/**
 * user-auth-handler.js
 * Xử lý click vào user profile icon trong header
 * - Nếu chưa đăng nhập: chuyển đến trang login
 * - Nếu đã đăng nhập: chuyển đến trang user-profile
 */

import { isAuthenticated } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // Tìm tất cả các user button trong header
  const userButtons = document.querySelectorAll('.user-btn, .header-icon.user-btn, button[aria-label*="Tài khoản"], button[aria-label*="User profile"]');
  
  userButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      
      if (isAuthenticated()) {
        // Đã đăng nhập -> đi đến user profile
        window.location.href = 'user-profile.html';
      } else {
        // Chưa đăng nhập -> đi đến trang login
        window.location.href = 'login.html';
      }
    });
  });

  // Xử lý cho các link user profile (nếu có)
  const userLinks = document.querySelectorAll('a[href*="user-profile"]');
  userLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      
      if (isAuthenticated()) {
        window.location.href = 'user-profile.html';
      } else {
        window.location.href = 'login.html';
      }
    });
  });
});
