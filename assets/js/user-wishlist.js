// User Wishlist Management for Profile Page
import { isAuthenticated, getCurrentUser, loadUsers } from './auth.js';
import { getWishlist, removeFromWishlist } from './user.js';

// Pagination state
let currentWishlistPage = 0;
const ITEMS_PER_PAGE = 3; // 3 items per page

/**
 * Load and render wishlist products in user profile
 */
export function loadUserWishlist(page = 0) {
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
            <div class="wishlist-empty">
                <i class="fas fa-heart"></i>
                <p>Your wishlist is empty</p>
                <a href="homepage.html" class="btn-browse">BROWSE PRODUCTS</a>
            </div>
        `;

        // Hide pagination when empty
        const nav = document.querySelector('[data-nav="wishlist"]');
        if (nav && nav.parentElement) {
            nav.parentElement.style.display = 'none';
        }

        return;
    }

    // Update current page
    currentWishlistPage = page;

    // Calculate pagination
    const totalPages = Math.ceil(wishlist.length / ITEMS_PER_PAGE);
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, wishlist.length);
    const itemsToShow = wishlist.slice(startIndex, endIndex);

    // Render only items for current page (max 3 items)
    itemsToShow.forEach(item => {
        const card = createWishlistCard(item);
        wishlistGrid.appendChild(card);
    });

    // Update pagination
    updateWishlistPagination(totalPages, page);

    // Bind remove buttons
    bindWishlistRemoveButtons();
}

/**
 * Update pagination controls for wishlist
 */
function updateWishlistPagination(totalPages, currentPage) {
    const nav = document.querySelector('[data-nav="wishlist"]');
    
    if (!nav || !nav.parentElement) return;

    // Show/hide pagination based on total pages
    if (totalPages <= 1) {
        nav.parentElement.style.display = 'none';
        return;
    }

    nav.parentElement.style.display = 'flex';

    // Clear existing page buttons (keep prev/next)
    const prevBtn = nav.querySelector('[data-action="prev"]');
    const nextBtn = nav.querySelector('[data-action="next"]');
    const existingPageButtons = nav.querySelectorAll('.step-button:not(.step-button--control)');
    existingPageButtons.forEach(btn => btn.remove());

    // Calculate which pages to show (show up to 3 page numbers)
    let startPage = Math.max(0, currentPage - 1);
    let endPage = Math.min(totalPages - 1, startPage + 2);
    
    // Adjust if we're near the end
    if (endPage - startPage < 2) {
        startPage = Math.max(0, endPage - 2);
    }

    // Create page number buttons
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.type = 'button';
        pageBtn.className = 'step-button';
        pageBtn.textContent = i + 1;
        pageBtn.setAttribute('data-index-slot', i);
        
        if (i === currentPage) {
            pageBtn.classList.add('is-active');
        }
        
        pageBtn.onclick = () => loadUserWishlist(i);
        
        // Insert before the next button
        nav.insertBefore(pageBtn, nextBtn);
    }

    // Update prev/next buttons
    if (prevBtn) {
        prevBtn.disabled = currentPage === 0;
        prevBtn.onclick = () => {
            if (currentPage > 0) loadUserWishlist(currentPage - 1);
        };
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages - 1;
        nextBtn.onclick = () => {
            if (currentPage < totalPages - 1) loadUserWishlist(currentPage + 1);
        };
    }
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
                                    loadUserWishlist(0); // Reload to show empty state
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
        loadUserWishlist(0); // Start from page 0
        updateWishlistCount();
    }
});
