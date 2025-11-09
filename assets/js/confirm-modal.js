/**
 * Confirm Modal System
 * Confirmation modal to replace confirm() and alert()
 */

function showConfirmModal(options = {}) {
  const {
    title = 'Confirm',
    message = 'Are you sure?',
    confirmText = 'OK',
    cancelText = 'Cancel',
    onConfirm = () => {},
    onCancel = () => {},
    type = 'warning' // 'warning', 'danger', 'info'
  } = options;

  // Remove existing modal
  const existingModal = document.querySelector('.confirm-modal-overlay');
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal HTML
  const modalHTML = `
    <div class="confirm-modal-overlay">
      <div class="confirm-modal-container">
        <div class="confirm-modal-content ${type}">
          <div class="confirm-modal-header">
            <h3>${title}</h3>
          </div>
          <div class="confirm-modal-body">
            <p>${message}</p>
          </div>
          <div class="confirm-modal-footer">
            <button class="confirm-modal-btn confirm-btn">${confirmText}</button>
            <button class="confirm-modal-btn cancel-btn">${cancelText}</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add styles if not already added
  if (!document.getElementById('confirm-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'confirm-modal-styles';
    style.textContent = `
      .confirm-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200000;
        animation: fadeIn 0.2s ease;
      }

      .confirm-modal-container {
        animation: modalSlideUp 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      .confirm-modal-content {
        background: rgba(6, 0, 4, .9);
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        min-width: 400px;
        max-width: 500px;
        overflow: hidden;
        font-family: 'Barlow', sans-serif;
      }

      .confirm-modal-content.warning {
        border: 2px solid rgb(255, 179, 71, 0.65);
      }

      .confirm-modal-content.danger {
        border: 2px solid rgb(255, 179, 71, 0.65);
      }

      .confirm-modal-content.info {
        border: 2px solid rgb(255, 179, 71, 0.65);
      }

      .confirm-modal-header {
        padding: 24px 24px 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .confirm-modal-header h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: rgb(255, 179, 71);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .confirm-modal-body {
        padding: 24px;
      }

      .confirm-modal-body p {
        margin: 0;
        font-size: 15px;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.9);
      }

      .confirm-modal-footer {
        padding: 16px 24px 24px;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .confirm-modal-btn {
        padding: 12px 28px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        font-family: 'Barlow', sans-serif;
      }

      .confirm-modal-btn.confirm-btn {
        background: linear-gradient(135deg, rgb(255, 179, 71), rgb(255, 140, 66));
        border: 1px solid rgb(255, 179, 71);
        color: #2b050b;
      }

      .confirm-modal-btn.confirm-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(255, 179, 71, 0.4);
      }

      .confirm-modal-btn.cancel-btn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
      }

      .confirm-modal-btn.cancel-btn:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.3);
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes modalSlideUp {
        from {
          transform: translateY(50px) scale(0.9);
          opacity: 0;
        }
        to {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }

      @media (max-width: 768px) {
        .confirm-modal-content {
          min-width: 90%;
          max-width: 90%;
        }

        .confirm-modal-footer {
          flex-direction: column-reverse;
        }

        .confirm-modal-btn {
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Append modal to body
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = modalHTML;
  const modal = tempDiv.firstElementChild;
  document.body.appendChild(modal);

  // Get buttons
  const confirmBtn = modal.querySelector('.confirm-btn');
  const cancelBtn = modal.querySelector('.cancel-btn');
  const overlay = modal;

  // Close modal function
  const closeModal = () => {
    modal.style.animation = 'fadeIn 0.2s ease reverse';
    setTimeout(() => {
      modal.remove();
    }, 200);
  };

  // Event listeners
  confirmBtn.addEventListener('click', () => {
    onConfirm();
    closeModal();
  });

  cancelBtn.addEventListener('click', () => {
    onCancel();
    closeModal();
  });

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      onCancel();
      closeModal();
    }
  });

  // Close on ESC key
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      onCancel();
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { showConfirmModal };
}
