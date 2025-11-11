/**
 * user-auth-handler.js
 * Xử lý user dropdown dựa trên trạng thái đăng nhập
 * - Chưa đăng nhập: Hiển thị "Oldiezone Member" + Sign In / Register
 * - Đã đăng nhập: Hiển thị thông tin user từ DB + View Profile / Sign Out
 */

import { isAuthenticated, getCurrentUser, logout, initializeUsers } from './auth.js';

// Initialize users from users.json on app load
initializeUsers().then(() => {
  console.log('Users initialized from users.json');
});

function renderUserDropdown() {
  const userDropdown = document.getElementById('userDropdown');
  if (!userDropdown) {
    console.error('userDropdown element not found');
    return;
  }

  const userInfo = userDropdown.querySelector('.user-info');
  const dropdownMenu = userDropdown.querySelector('.dropdown-menu');

  if (!userInfo || !dropdownMenu) {
    console.error('user-info or dropdown-menu not found');
    return;
  }

  console.log('isAuthenticated:', isAuthenticated());
  console.log('currentUser:', getCurrentUser());

  if (isAuthenticated()) {
    // User đã đăng nhập - Lấy dữ liệu từ auth.js
    const currentUser = getCurrentUser();
    const userData = currentUser || {};

    // Sử dụng memberRank từ userData, nếu không có thì tính dựa trên số lần mua hàng
    let rank = userData.memberRank || 'Member';
    if (!userData.memberRank) {
      // Fallback: Tính toán rank dựa trên số lần mua hàng nếu không có memberRank
      if (userData.recentPurchased && userData.recentPurchased.length > 5) {
        rank = 'Gold Member';
      }
    }

    // Extract rank value for data-rank attribute (e.g., "VIP Member" -> "vip")
    const rankValue = rank.toLowerCase().split(' ')[0];

    // Cập nhật user info
    userInfo.innerHTML = `
      <div class="user-avatar">
        <img src="${userData.avatar || 'assets/images/default-avatar.jpg'}" alt="User Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
      </div>
      <div class="user-details">
        <div class="user-name">${userData.firstName} ${userData.lastName}</div>
        <div class="user-rank" data-rank="${rankValue}">${rank}</div>
      </div>
    `;

    // Cập nhật menu
    dropdownMenu.innerHTML = `
      <li><a href="user-profile.html" class="dropdown-link"><i class="fas fa-user"></i>View Profile</a></li>
      <li><a href="#" class="dropdown-link logout-link"><i class="fas fa-sign-out-alt"></i>Sign Out</a></li>
    `;
  } else {
    // User chưa đăng nhập
    userInfo.innerHTML = `
      <div class="user-avatar">
        <i class="fas fa-user-circle"></i>
      </div>
      <div class="user-details">
        <div class="user-name">Oldiezone Member</div>
        <div class="user-rank">Guest</div>
      </div>
    `;

    // Cập nhật menu
    dropdownMenu.innerHTML = `
      <li><a href="login.html" class="dropdown-link"><i class="fas fa-sign-in-alt"></i>Sign In</a></li>
      <li><a href="signup.html" class="dropdown-link"><i class="fas fa-user-plus"></i>Register</a></li>
    `;
  }

  // Gắn event listener cho logout
  const logoutLink = dropdownMenu.querySelector('.logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (event) => {
      event.preventDefault();
      logout();
      localStorage.removeItem('userData');
      window.location.href = 'login.html';
    });
  }

  // Attach event listeners to all dropdown links
  const dropdownLinks = dropdownMenu.querySelectorAll('.dropdown-link');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const userDropdown = document.getElementById('userDropdown');
      const userButton = document.querySelector('.user-btn');
      if (userDropdown) userDropdown.classList.remove('active');
      if (userButton) userButton.classList.remove('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Render dropdown ngay khi DOM load
  setTimeout(() => {
    renderUserDropdown();
  }, 100);

  // Tìm user button
  const userButton = document.querySelector('.user-btn');
  const userDropdown = document.getElementById('userDropdown');

  if (userButton) {
    userButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (userDropdown) {
        userDropdown.classList.toggle('active');
        userButton.classList.toggle('active');
      }
    });
  }

  // Đóng dropdown khi click bên ngoài
  document.addEventListener('click', function(event) {
    const userDropdown = document.getElementById('userDropdown');
    const userButton = document.querySelector('.user-btn');

    // Check nếu click không phải trên dropdown hoặc user button
    if (userDropdown && userButton) {
      if (!userDropdown.contains(event.target) && !userButton.contains(event.target)) {
        userDropdown.classList.remove('active');
        userButton.classList.remove('active');
      }
    }
  });

  // Prevent dropdown closing khi click bên trong dropdown
  if (userDropdown) {
    userDropdown.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // Xử lý dropdown links
  const dropdownLinks = document.querySelectorAll('.dropdown-link');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      // Cho phép navigation để xảy ra
      const userDropdown = document.getElementById('userDropdown');
      const userButton = document.querySelector('.user-btn');
      if (userDropdown) userDropdown.classList.remove('active');
      if (userButton) userButton.classList.remove('active');
    });
  });
});
