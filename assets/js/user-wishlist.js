// User Wishlist Management for Profile Page
import { isAuthenticated, getCurrentUser, loadUsers } from './auth.js';
import { getWishlist, removeFromWishlist } from './user.js';

// Cache for product data
let productsCache = null;

// Pagination state
let currentPage = 1;
const ITEMS_PER_PAGE = 8; // 2 rows × 4 columns
let totalPages = 1;
let allWishlistItems = [];

/**
 * Load products from product.json
 */
async function loadProducts() {
    if (productsCache) {
        return productsCache;
    }

    try {
        const response = await fetch('product.json');
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        productsCache = await response.json();
        return productsCache;
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

/**
 * Get product details by ID
 */
async function getProductById(productId) {
    const products = await loadProducts();
    return products.find(p => p.id === productId || p.id === String(productId));
}

/**
 * Clean up invalid wishlist items (products not in product.json)
 */
async function cleanupInvalidWishlistItems() {
    if (!isAuthenticated()) {
        return;
    }

    const wishlist = getWishlist();
    if (!wishlist || wishlist.length === 0) {
        return;
    }

    const allProducts = await loadProducts();
    const validWishlist = [];

    for (const item of wishlist) {
        const searchId = item.productId || item.id;
        const productExists = allProducts.find(p => p.id === searchId || p.id === String(searchId));
        
        if (productExists) {
            validWishlist.push(item);
        } else {
            console.log(`Removing invalid product from wishlist: ${item.name || searchId}`);
        }
    }

    // Update wishlist if there were invalid items
    if (validWishlist.length !== wishlist.length) {
        const session = getCurrentUser();
        const users = loadUsers();
        const userIndex = users.findIndex(user => user.username === session.username);
        
        if (userIndex !== -1) {
            users[userIndex].wishlist = validWishlist;
            users[userIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('users', JSON.stringify(users));
            console.log(`Cleaned up wishlist: ${wishlist.length - validWishlist.length} invalid items removed`);
        }
    }
}

/**
 * Load and render wishlist products in user profile
 */
export async function loadUserWishlist() {
    if (!isAuthenticated()) {
        console.warn('User not authenticated');
        return;
    }

    // Clean up invalid items first
    await cleanupInvalidWishlistItems();

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
            <div class="wishlist-empty" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="heart-icon" style="font-size: 48px; opacity: 0.3;">❤</i>
                <p style="margin-top: 20px; color: rgba(255, 255, 255, 0.6);">Your wishlist is empty</p>
                <a href="homepage.html" class="btn-browse" style="margin-top: 15px; display: inline-block; padding: 12px 24px; background: #ff6468; color: white; text-decoration: none; border-radius: 999px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; font-size: 13px;">Browse Products</a>
            </div>
        `;
        return;
    }

    // Load all products from JSON
    const allProducts = await loadProducts();
    
    // Match wishlist items with product data
    const wishlistWithDetails = [];
    for (const wishlistItem of wishlist) {
        // Try to find product by productId or id
        const searchId = wishlistItem.productId || wishlistItem.id;
        const productDetails = allProducts.find(p => p.id === searchId || p.id === String(searchId));
        
        if (productDetails) {
            // Only add products that exist in product.json
            wishlistWithDetails.push({
                ...productDetails,
                id: productDetails.id,
                productId: productDetails.id,
                addedAt: wishlistItem.addedAt
            });
        }
        // Skip products not found in product.json (old/invalid data)
    }

    // If no matching products found, show empty state
    if (wishlistWithDetails.length === 0) {
        wishlistGrid.innerHTML = `
            <div class="wishlist-empty" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="heart-icon" style="font-size: 48px; opacity: 0.3;">❤</i>
                <p style="margin-top: 20px; color: rgba(255, 255, 255, 0.6);">Your wishlist is empty</p>
                <a href="homepage.html" class="btn-browse" style="margin-top: 15px; display: inline-block; padding: 12px 24px; background: #ff6468; color: white; text-decoration: none; border-radius: 999px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; font-size: 13px;">Browse Products</a>
            </div>
        `;
        hidePagination();
        return;
    }

    // Store all items for pagination
    allWishlistItems = wishlistWithDetails;
    
    // Calculate total pages
    totalPages = Math.ceil(allWishlistItems.length / ITEMS_PER_PAGE);
    
    // Render current page
    renderWishlistPage(currentPage);
    
    // Setup pagination
    setupPagination();

    // Bind remove buttons
    bindWishlistRemoveButtons();
}

/**
 * Render wishlist items for a specific page
 */
function renderWishlistPage(page) {
    const wishlistGrid = document.querySelector('.wishlist-grid');
    if (!wishlistGrid) return;
    
    // Clear grid
    wishlistGrid.innerHTML = '';
    
    // Calculate start and end indices
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, allWishlistItems.length);
    
    // Render items for current page
    const pageItems = allWishlistItems.slice(startIndex, endIndex);
    pageItems.forEach(item => {
        const card = createWishlistCard(item);
        wishlistGrid.appendChild(card);
    });
}

/**
 * Setup pagination controls
 */
function setupPagination() {
    const paginationNav = document.querySelector('.step-nav[data-nav="wishlist"]');
    if (!paginationNav) return;
    
    const prevBtn = paginationNav.querySelector('[data-action="prev"]');
    const nextBtn = paginationNav.querySelector('[data-action="next"]');
    const indexButtons = paginationNav.querySelectorAll('[data-index-slot]');
    
    // Show/hide pagination based on total pages
    const navBar = document.querySelector('.step-nav-bar');
    if (totalPages <= 1) {
        if (navBar) navBar.style.display = 'none';
        return;
    } else {
        if (navBar) navBar.style.display = 'flex';
    }
    
    // Update page number buttons
    updatePaginationButtons(indexButtons);
    
    // Previous button
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderWishlistPage(currentPage);
                updatePaginationButtons(indexButtons);
                updateNavigationButtons(prevBtn, nextBtn);
            }
        };
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderWishlistPage(currentPage);
                updatePaginationButtons(indexButtons);
                updateNavigationButtons(prevBtn, nextBtn);
            }
        };
    }
    
    // Update navigation button states
    updateNavigationButtons(prevBtn, nextBtn);
}

/**
 * Update pagination number buttons
 */
function updatePaginationButtons(buttons) {
    buttons.forEach((btn, index) => {
        const pageNum = index + 1;
        if (pageNum <= totalPages) {
            btn.textContent = pageNum;
            btn.style.display = 'block';
            btn.classList.toggle('active', pageNum === currentPage);
            btn.onclick = () => {
                currentPage = pageNum;
                renderWishlistPage(currentPage);
                updatePaginationButtons(buttons);
                const paginationNav = document.querySelector('.step-nav[data-nav="wishlist"]');
                const prevBtn = paginationNav?.querySelector('[data-action="prev"]');
                const nextBtn = paginationNav?.querySelector('[data-action="next"]');
                updateNavigationButtons(prevBtn, nextBtn);
            };
        } else {
            btn.style.display = 'none';
        }
    });
}

/**
 * Update prev/next button states
 */
function updateNavigationButtons(prevBtn, nextBtn) {
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
        prevBtn.style.opacity = currentPage === 1 ? '0.3' : '1';
    }
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.style.opacity = currentPage === totalPages ? '0.3' : '1';
    }
}

/**
 * Hide pagination when not needed
 */
function hidePagination() {
    const navBar = document.querySelector('.step-nav-bar');
    if (navBar) navBar.style.display = 'none';
}

/**
 * Create wishlist card element
 */
function createWishlistCard(item) {
    const card = document.createElement('a');
    
    // Link to single-product.html with product ID (same as learn.js behavior)
    card.href = item.id ? `single-product.html?id=${item.id}` : '#';
    card.className = 'wishlist-card';
    card.setAttribute('data-product-id', item.id);

    const addedDate = item.addedAt ? new Date(item.addedAt) : new Date();
    const dateString = addedDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });

    // Format price
    const priceFormatted = typeof item.price === 'string' 
        ? item.price
        : (typeof item.price === 'number' 
            ? item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '₫'
            : 'Price N/A');

    // Get image - prefer image_front, fallback to image
    let imageUrl = item.image_front || item.image || '';
    const isDefaultImage = imageUrl.includes('default-product.jpg') || !imageUrl;
    
    if (isDefaultImage || !imageUrl) {
        // Use a placeholder SVG
        imageUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E`;
    }

    // Category badge with better display
    let categoryBadge = '';
    if (item.category || item.subcategory) {
        const categoryText = item.subcategory 
            ? `${item.category} - ${item.subcategory}` 
            : item.category;
        categoryBadge = `<span class="product-category" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255, 244, 245, 0.6); display: block; margin-bottom: 4px;">${categoryText}</span>`;
    }

    card.innerHTML = `
        <img src="${imageUrl}" 
             alt="${item.name}"
             style="width: 100%; max-height: 260px; object-fit: contain; display: block; background: radial-gradient(circle at center, rgba(255,255,255,.08), rgba(0,0,0,.7)); padding: 12px;"
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'300\\' height=\\'300\\'%3E%3Crect fill=\\'%23f0f0f0\\' width=\\'300\\' height=\\'300\\'/%3E%3Ctext fill=\\'%23999\\' font-family=\\'Arial\\' font-size=\\'18\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3ENo Image%3C/text%3E%3C/svg%3E'">
        <div class="wishlist-card-body">
            <div class="wishlist-card-header">
                <h3 style="font-size: 16px; margin: 0; line-height: 1.3;">${item.name}</h3>
                <button class="wishlist-like active remove-wishlist-btn" 
                        data-product-id="${item.id}"
                        aria-label="Remove from wishlist"
                        type="button"
                        style="font-size: 18px; color: #ff6468; border: none; background: transparent; cursor: pointer; padding: 4px; transition: transform 0.2s ease; flex-shrink: 0;">
                    ❤
                </button>
            </div>
            <div class="wishlist-card-details">
                ${categoryBadge}
                <span class="wishlist-price" style="color: #ffcf6c; font-weight: 700; font-size: 16px; display: block; margin-top: 4px;">${priceFormatted}</span>
                <span class="wishlist-note" style="font-size: 13px; color: rgba(255, 255, 255, 0.72); letter-spacing: 0.06em; text-transform: uppercase; display: block; margin-top: 4px;">Saved ${dateString}</span>
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

            // Show confirmation
            if (confirm('Remove this item from your wishlist?')) {
                const result = removeFromWishlist(productId);
                
                if (result.success) {
                    // Animate card removal
                    const card = btn.closest('.wishlist-card');
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
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.wishlist-notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `wishlist-notification wishlist-notification--${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2500);
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

/**
 * Add sample products to wishlist for testing (can be removed in production)
 */
export async function addSampleProductsToWishlist() {
    const products = await loadProducts();
    
    // Get sample products from different categories
    const sampleIds = ['1', '13', '25', '45', '65']; // CD, Vinyl, VHS, Cassette, Camera
    
    const { addToWishlist } = await import('./user.js');
    
    sampleIds.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product) {
            addToWishlist({
                id: id,
                productId: id,
                name: product.name,
                price: product.price,
                image: product.image_front || product.image,
                category: product.category,
                subcategory: product.subcategory
            });
        }
    });
    
    loadUserWishlist();
}

// Export for console testing
window.addSampleProductsToWishlist = addSampleProductsToWishlist;
