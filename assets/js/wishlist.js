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
            alert('Vui lòng đăng nhập để sử dụng wishlist!');
            window.location.href = 'login.html';
            return;
        }

        // Lấy thông tin sản phẩm từ data attributes hoặc DOM
        const product = this.getProductInfo(button);
        
        if (!product) {
            console.error('Không tìm thấy thông tin sản phẩm');
            return;
        }

        const heartIcon = button.querySelector('.heart-icon');
        
        // Kiểm tra sản phẩm đã trong wishlist chưa
        if (isInWishlist(product.id)) {
            // Xóa khỏi wishlist
            const result = removeFromWishlist(product.id);
            if (result.success) {
                heartIcon.classList.remove('active');
                this.showNotification('Đã xóa khỏi wishlist', 'success');
            }
        } else {
            // Thêm vào wishlist
            const result = addToWishlist(product);
            if (result.success) {
                heartIcon.classList.add('active');
                this.showNotification('Đã thêm vào wishlist', 'success');
                
                // Animation
                heartIcon.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    heartIcon.style.transform = 'scale(1)';
                }, 300);
            } else if (result.reason === 'ALREADY_IN_WISHLIST') {
                this.showNotification('Sản phẩm đã có trong wishlist', 'info');
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

    showNotification(message, type = 'info') {
        // Tạo notification element
        const notification = document.createElement('div');
        notification.className = `wishlist-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide và remove sau 2s
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}

// Export instance
export default new Wishlist();
