// Wishlist functionality
import { isAuthenticated, getCurrentUser } from './auth.js';
import { addToWishlist, removeFromWishlist, isInWishlist } from './user.js';

class Wishlist {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateWishlistUI();
    }

    // Create floating hearts animation
    createFloatingHearts(button) {
        const rect = button.getBoundingClientRect();
        // Add scroll offset to get absolute position
        const centerX = rect.left + rect.width / 2 + window.scrollX;
        const centerY = rect.top + rect.height / 2 + window.scrollY;

        // Create 5-8 floating hearts
        const numHearts = 5 + Math.floor(Math.random() * 4);

        for (let i = 0; i < numHearts; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';

            // Random horizontal offset
            const randomX = (Math.random() - 0.5) * 80; // -40px to 40px
            heart.style.setProperty('--float-x', `${randomX}px`);

            // Position at button center
            heart.style.left = `${centerX}px`;
            heart.style.top = `${centerY}px`;

            // Random delay for staggered effect
            heart.style.animationDelay = `${i * 0.1}s`;

            document.body.appendChild(heart);

            // Remove heart after animation completes
            setTimeout(() => {
                heart.remove();
            }, 1500 + (i * 100));
        }
    }

    bindEvents() {
        // Delegate event for heart icon buttons
        document.addEventListener('click', (e) => {
            const heartBtn = e.target.closest('.heart-btn, .icon-btn');
            if (heartBtn && heartBtn.querySelector('.heart-icon')) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleWishlist(heartBtn);
            }
        });
    }

    toggleWishlist(button) {
        // Check login
        if (!isAuthenticated()) {
            showNotification('Please login to use wishlist feature!', 'info');
            return;
        }

        // Get product info from data attributes or DOM
        const product = this.getProductInfo(button);
        
        if (!product) {
            console.error('Product information not found');
            return;
        }

        const heartIcon = button.querySelector('.heart-icon');
        const isUserProfilePage = window.location.pathname.includes('user-profile.html');
        
        // Check if product is already in wishlist
        if (isInWishlist(product.id)) {
            // Remove from wishlist
            // Only show modal if on user-profile page
            if (isUserProfilePage) {
                showConfirmModal({
                    title: 'Remove from Wishlist',
                    message: `Are you sure you want to remove "${product.name}" from your wishlist?`,
                    confirmText: 'Remove',
                    cancelText: 'Cancel',
                    type: 'danger',
                    onConfirm: () => {
                        const result = removeFromWishlist(product.id);
                        if (result.success) {
                            heartIcon.classList.remove('active');
                            showNotification(`Removed "${product.name}" from wishlist`, 'success');
                            setTimeout(() => window.location.reload(), 1000);
                        }
                    }
                });
            } else {
                // Remove directly without modal on other pages
                const result = removeFromWishlist(product.id);
                if (result.success) {
                    heartIcon.classList.remove('active');
                    showNotification(`Removed "${product.name}" from wishlist`, 'success');
                    
                    // Animation
                    heartIcon.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        heartIcon.style.transform = 'scale(1)';
                    }, 300);
                }
            }
        } else {
            // Add to wishlist
            const result = addToWishlist(product);
            if (result.success) {
                heartIcon.classList.add('active');
                showNotification(`Added "${product.name}" to wishlist`, 'success');

                // Create floating hearts animation
                this.createFloatingHearts(button);

                // Animation for the icon itself
                heartIcon.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    heartIcon.style.transform = 'scale(1)';
                }, 300);
            } else if (result.reason === 'ALREADY_IN_WISHLIST') {
                showNotification('Product already in wishlist', 'info');
            }
        }

        this.updateWishlistUI();
    }

    getProductInfo(button) {
        // Try getting from data attributes first
        const productCard = button.closest('.product-card, .item, .product');
        
        if (button.dataset.productId) {
            return {
                id: button.dataset.productId,
                name: button.dataset.productName,
                price: button.dataset.productPrice,
                image: button.dataset.productImage
            };
        }
        
        // Fallback: parse from DOM structure
        if (productCard) {
            const nameElement = productCard.querySelector('h4, .product-title, .cart-item-name');
            const priceElement = productCard.querySelector('.current-price, .cart-item-price, .price');
            const imageElement = productCard.querySelector('img.main-image, img');
            
            // Get ID from detail link or data attribute
            const linkElement = productCard.querySelector('a[href*="single-product.html"]');
            let productId = null;
            if (linkElement) {
                const url = new URL(linkElement.href);
                productId = url.searchParams.get('id');
            }
            
            return {
                id: productId,
                name: nameElement ? nameElement.textContent.trim() : 'Unknown',
                price: priceElement ? priceElement.textContent.trim() : '0₫',
                image: imageElement ? imageElement.src : ''
            };
        }

        return null;
    }

    updateWishlistUI() {
        if (!isAuthenticated()) return;

        // Update active status for heart icons
        document.querySelectorAll('.heart-icon').forEach(icon => {
            const button = icon.closest('.heart-btn, .icon-btn, a');
            if (!button) return;

            const product = this.getProductInfo(button);
            if (product && isInWishlist(product.id)) {
                icon.classList.add('active');
            } else {
                icon.classList.remove('active');
            }
        });
    }
}

// Export instance
export default new Wishlist();
