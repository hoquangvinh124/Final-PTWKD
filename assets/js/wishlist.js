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

    bindEvents() {
        // Delegate event cho các nút heart icon
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
        // Kiểm tra đăng nhập
        if (!isAuthenticated()) {
            showNotification('Please login to use wishlist feature!', 'info');
            return;
        }

        // Lấy thông tin sản phẩm từ data attributes hoặc DOM
        const product = this.getProductInfo(button);
        
        if (!product) {
            console.error('Không tìm thấy thông tin sản phẩm');
            return;
        }

        const heartIcon = button.querySelector('.heart-icon');
        const isUserProfilePage = window.location.pathname.includes('user-profile.html');
        
        // Kiểm tra sản phẩm đã trong wishlist chưa
        if (isInWishlist(product.id)) {
            // Xóa khỏi wishlist
            // Chỉ show modal nếu đang ở trang user-profile
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
                // Xóa trực tiếp không cần modal ở các trang khác
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
            // Thêm vào wishlist
            const result = addToWishlist(product);
            if (result.success) {
                heartIcon.classList.add('active');
                showNotification(`Added "${product.name}" to wishlist`, 'success');
                
                // Animation
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
        // Thử lấy từ data attributes trước
        const productCard = button.closest('.product-card, .item, .product');
        
        if (button.dataset.productId) {
            return {
                id: button.dataset.productId,
                name: button.dataset.productName,
                price: button.dataset.productPrice,
                image: button.dataset.productImage
            };
        }
        
        // Fallback: parse từ DOM structure
        if (productCard) {
            const nameElement = productCard.querySelector('h4, .product-title, .cart-item-name');
            const priceElement = productCard.querySelector('.current-price, .cart-item-price, .price');
            const imageElement = productCard.querySelector('img.main-image, img');
            
            // Lấy ID từ link detail hoặc data attribute
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

        // Cập nhật trạng thái active cho các heart icon
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
