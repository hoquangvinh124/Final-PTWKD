// User Wishlist Management for Profile Page
import { isAuthenticated, getCurrentUser, loadUsers } from './auth.js';
import { getWishlist, removeFromWishlist } from './user.js';

/**
 * Load and render wishlist products in user profile
 */
export function loadUserWishlist() {
    if (!isAuthenticated()) {
        console.warn('User not authenticated');
        return;
    }

    const wishlist = getWishlist();
    const wishlistGrid = document.querySelector('.wishlist-grid');
    
    if (!wishlistGrid) {
        console.warn('Wishlist grid not found');
        return;
    }

    // Clear existing static content
    wishlistGrid.innerHTML = '';

    if (!wishlist || wishlist.length === 0) {
        wishlistGrid.innerHTML = `
            <div class="wishlist-empty" style="text-align: center; padding: 60px 20px; color: #999; grid-column: 1 / -1;">
                <i class="fas fa-heart" style="font-size: 48px; color: rgba(246, 210, 138, 0.3); margin-bottom: 20px; display: block;"></i>
                <p style="font-size: 16px; margin-bottom: 20px;">Your wishlist is empty</p>
                <a href="homepage.html" class="btn-cine" style="display: inline-block; padding: 10px 24px; background: #f6d28a; color: #3b141c; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; transition: all 0.3s ease;">BROWSE PRODUCTS</a>
            </div>
        `;

        // Hide pagination when empty
        const nav = document.querySelector('[data-nav="wishlist"]');
        if (nav && nav.parentElement) {
            nav.parentElement.style.display = 'none';
        }

        return;
    }

    // Render wishlist items
    wishlist.forEach(item => {
        const card = createWishlistCard(item);
        wishlistGrid.appendChild(card);
    });

    // Show pagination if needed (more than 8 items)
    const nav = document.querySelector('[data-nav="wishlist"]');
    if (nav && nav.parentElement) {
        if (wishlist.length > 8) {
            nav.parentElement.style.display = 'flex';
        } else {
            nav.parentElement.style.display = 'none';
        }
    }

    // Bind remove buttons
    bindWishlistRemoveButtons();
}

/**
 * Create wishlist card element
 */
function createWishlistCard(item) {
    const card = document.createElement('a');
    card.href = item.id ? `single-product.html?id=${item.id}` : '#';
    card.className = 'wishlist-card';
    card.setAttribute('data-product-id', item.id);

    const addedDate = item.addedAt ? new Date(item.addedAt) : new Date();
    const dateString = addedDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });

    const priceFormatted = typeof item.price === 'number' 
        ? item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '₫'
        : item.price;

    // Xử lý ảnh - nếu không có hoặc là ảnh default thì dùng placeholder
    let imageUrl = item.image || '';
    const isDefaultImage = imageUrl.includes('default-product.jpg') || !imageUrl;
    
    if (isDefaultImage) {
        // Sử dụng placeholder với màu nền thay vì ảnh default
        imageUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E`;
    }

    card.innerHTML = `
        <img src="${imageUrl}" 
             alt="${item.name}"
             ${!isDefaultImage ? "onerror=\"this.style.display='none'; this.nextElementSibling.style.display='flex';\"" : ""}>
        <div class="wishlist-card-placeholder" style="display: ${isDefaultImage ? 'flex' : 'none'}; width: 100%; height: 200px; background: #f0f0f0; align-items: center; justify-content: center; color: #999; font-size: 14px;">
            No Image Available
        </div>
        <div class="wishlist-card-body">
            <div class="wishlist-card-header">
                <h3>${item.name}</h3>
                <button class="wishlist-like active remove-wishlist-btn" 
                        data-product-id="${item.id}"
                        aria-label="Remove from wishlist"
                        type="button">
                    ❤
                </button>
            </div>
            <div class="wishlist-card-details">
                <span class="wishlist-price">${priceFormatted}</span>
                <span class="wishlist-note">Saved ${dateString}</span>
            </div>
        </div>
    `;

    return card;
}

/**
 * Bind remove buttons for wishlist items
 */
function bindWishlistRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-wishlist-btn');
    
    removeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = btn.getAttribute('data-product-id');
            if (!productId) return;

            // Get product name for better UX
            const card = btn.closest('.wishlist-card');
            const productName = card ? card.querySelector('h3')?.textContent : 'this item';

            // Show confirmation modal
            showConfirmModal({
                title: 'Remove from Wishlist',
                message: `Are you sure you want to remove "${productName}" from your wishlist?`,
                confirmText: 'Remove',
                cancelText: 'Cancel',
                type: 'danger',
                onConfirm: () => {
                    const result = removeFromWishlist(productId);
                    
                    if (result.success) {
                        // Animate card removal
                        if (card) {
                            card.style.animation = 'fadeOutScale 0.3s ease';
                            setTimeout(() => {
                                card.remove();
                                
                                // Check if wishlist is empty
                                const wishlistGrid = document.querySelector('.wishlist-grid');
                                if (wishlistGrid && wishlistGrid.children.length === 0) {
                                    loadUserWishlist(); // Reload to show empty state
                                }
                            }, 300);
                        }
                        
                        showNotification('Removed from wishlist', 'success');
                    } else {
                        showNotification('Failed to remove item', 'error');
                    }
                }
            });
        });
    });
}

/**
 * Update wishlist count badge
 */
export function updateWishlistCount() {
    const wishlist = getWishlist();
    const countElements = document.querySelectorAll('.wishlist-count, .wishlist-badge');
    
    countElements.forEach(el => {
        el.textContent = wishlist.length;
        if (wishlist.length > 0) {
            el.classList.add('show');
        } else {
            el.classList.remove('show');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('user-profile.html')) {
        loadUserWishlist();
        updateWishlistCount();
    }
});
