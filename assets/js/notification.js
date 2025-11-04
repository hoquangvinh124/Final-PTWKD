/**
 * Notification System
 * Tạo thông báo đẹp thay thế alert()
 */

function showNotification(message, type = 'success') {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll('.notification-toast');
  existingNotifications.forEach(notif => notif.remove());

  const notification = document.createElement('div');
  notification.className = `notification-toast notification-${type}`;
  
  const icon = type === 'success' 
    ? '<i class="fas fa-check-circle"></i>'
    : type === 'error'
    ? '<i class="fas fa-times-circle"></i>'
    : type === 'warning'
    ? '<i class="fas fa-exclamation-triangle"></i>'
    : '<i class="fas fa-info-circle"></i>';
  
  notification.innerHTML = `
    <div class="notification-content">
      ${icon}
      <span>${message}</span>
    </div>
  `;

  // Add styles if not already added
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1a0005 0%, #2d0008 100%);
        border: 1px solid rgba(255, 100, 104, 0.3);
        border-radius: 12px;
        padding: 16px 24px;
        color: #fff;
        z-index: 100000;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55), 
                   fadeOut 0.3s ease 2.5s forwards;
        min-width: 300px;
        max-width: 500px;
        font-family: 'Barlow', sans-serif;
      }
      
      .notification-toast.notification-success {
        border-color: rgba(34, 197, 94, 0.5);
      }
      
      .notification-toast.notification-error {
        border-color: rgba(239, 68, 68, 0.5);
      }
      
      .notification-toast.notification-warning {
        border-color: rgba(251, 191, 36, 0.5);
      }
      
      .notification-toast.notification-info {
        border-color: rgba(59, 130, 246, 0.5);
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 15px;
        font-weight: 500;
      }
      
      .notification-content i {
        font-size: 1.4rem;
        flex-shrink: 0;
      }
      
      .notification-success .notification-content i {
        color: #4ade80;
      }
      
      .notification-error .notification-content i {
        color: #f87171;
      }
      
      .notification-warning .notification-content i {
        color: #fbbf24;
      }
      
      .notification-info .notification-content i {
        color: #3b82f6;
      }
      
      @keyframes slideInRight {
        from { 
          transform: translateX(120%); 
          opacity: 0; 
        }
        to { 
          transform: translateX(0); 
          opacity: 1; 
        }
      }
      
      @keyframes fadeOut {
        to { 
          opacity: 0; 
          transform: translateX(20px);
        }
      }

      @media (max-width: 768px) {
        .notification-toast {
          top: 10px;
          right: 10px;
          left: 10px;
          min-width: auto;
          max-width: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Remove notification after animation
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { showNotification };
}
