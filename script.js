// Cart functionality - Complete Version
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartUI();
        this.bindEvents();
    }

    bindEvents() {
    // Cart button click
    const cartButton = document.getElementById('cartButton');
    if (cartButton) {
        cartButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleCart();
        });
    }
    
    // Cart close button
    const cartClose = document.getElementById('cartClose');
    if (cartClose) {
        cartClose.addEventListener('click', () => this.closeCart());
    }
    
    // Continue shopping button trong footer
    const continueShopping = document.getElementById('continueShopping');
    if (continueShopping) {
        continueShopping.addEventListener('click', () => this.closeCart());
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => this.checkout());
    }
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.addToCart(e.currentTarget);
        });
    });
    
    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        const cartModal = document.getElementById('cartModal');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartModal && cartOverlay && 
            cartModal.classList.contains('active') &&
            !e.target.closest('.cart-modal') && 
            !e.target.closest('.cart-btn')) {
            this.closeCart();
        }
    });

    // Prevent cart close when clicking inside cart
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Xử lý tất cả nút continue-shopping (cả trong empty message)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.continue-shopping')) {
            this.closeCart();
        }
    });
}

    addToCart(button) {
        if (!button) return;
        
        const productCard = button.closest('.product-card');
        if (!productCard) return;
        
        const productName = productCard.querySelector('h4').textContent;
        const productPriceText = productCard.querySelector('.current-price').textContent;
        const productImage = productCard.querySelector('.main-image').src;

        // Generate unique ID based on product name and image
        const productId = this.generateProductId(productName, productImage);
        const productPrice = this.parsePrice(productPriceText);

        console.log('Adding to cart:', { productId, productName, productPrice, productImage });

        // Check if product already exists in cart
        const existingItemIndex = this.items.findIndex(item => item.id === productId);
        
        if (existingItemIndex !== -1) {
            // Product exists, increase quantity
            this.items[existingItemIndex].quantity += 1;
        } else {
            // Add new product
            this.items.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }

        // Save to localStorage
        this.saveCart();
        
        // Update UI
        this.updateCartUI();
        
        // Show animation
        this.showAddToCartAnimation(button);
        
        // Auto open cart modal
        this.openCart();
    }

    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartUI();
        }
    }

    generateProductId(name, image) {
        // Create a unique ID based on name and image URL
        return btoa(name + image).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    }

    parsePrice(priceString) {
        // Remove dots and currency symbol, then parse to number
        const cleanPrice = priceString.replace(/\./g, '').replace('₫', '').trim();
        return parseInt(cleanPrice) || 0;
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '₫';
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartUI() {
    const cartBadge = document.getElementById('cartBadge');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartTotalAmount = document.getElementById('cartTotalAmount');

    if (!cartBadge || !cartItems) return;

    // Update badge
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    if (totalItems > 0) {
        cartBadge.classList.add('show');
    } else {
        cartBadge.classList.remove('show');
    }

    // Update cart items
    if (this.items.length === 0) {
        // Show empty message but keep footer visible
        if (cartEmpty) {
            cartEmpty.style.display = 'block';
            // Đảm bảo nút continue shopping trong empty message cũng đóng cart
            const emptyContinueBtn = cartEmpty.querySelector('.continue-shopping');
            if (emptyContinueBtn) {
                emptyContinueBtn.onclick = () => this.closeCart();
            }
        }
        if (cartFooter) cartFooter.style.display = 'block';
        if (cartTotalAmount) cartTotalAmount.textContent = '0₫';
        
        // Clear cart items and show empty message
        cartItems.innerHTML = '';
        cartItems.appendChild(cartEmpty);
        return;
    }

    // Hide empty message and show items
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';

    let cartHTML = '';
    let totalAmount = 0;

    this.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;

        cartHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/placeholder.jpg'">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${this.formatPrice(item.price)}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn minus" data-id="${item.id}" type="button">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="quantity-btn plus" data-id="${item.id}" type="button">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}" type="button" title="Xóa sản phẩm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    cartItems.innerHTML = cartHTML;
    if (cartTotalAmount) {
        cartTotalAmount.textContent = this.formatPrice(totalAmount);
    }

    // Bind events for dynamically created elements
    this.bindCartItemEvents();
}

    bindCartItemEvents() {
        // Quantity minus buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = e.target.closest('.quantity-btn').dataset.id;
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        // Quantity plus buttons
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = e.target.closest('.quantity-btn').dataset.id;
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });

        // Quantity inputs
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                e.stopPropagation();
                const productId = e.target.dataset.id;
                const newQuantity = parseInt(e.target.value);
                if (!isNaN(newQuantity) && newQuantity > 0) {
                    this.updateQuantity(productId, newQuantity);
                } else {
                    // Reset to previous value if invalid
                    const item = this.items.find(item => item.id === productId);
                    if (item) {
                        e.target.value = item.quantity;
                    }
                }
            });

            input.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = e.target.closest('.remove-item').dataset.id;
                this.removeFromCart(productId);
            });
        });
    }

    toggleCart() {
        const cartModal = document.getElementById('cartModal');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartModal && cartOverlay) {
            const isActive = cartModal.classList.contains('active');
            if (isActive) {
                this.closeCart();
            } else {
                this.openCart();
            }
        }
    }

    openCart() {
        const cartModal = document.getElementById('cartModal');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartModal && cartOverlay) {
            cartModal.classList.add('active');
            cartOverlay.classList.add('active');
            // Update cart UI when opening
            this.updateCartUI();
        }
    }

    closeCart() {
        const cartModal = document.getElementById('cartModal');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartModal && cartOverlay) {
            cartModal.classList.remove('active');
            cartOverlay.classList.remove('active');
        }
    }

    showAddToCartAnimation(button) {
        const originalHTML = button.innerHTML;
        const originalBackground = button.style.backgroundColor;
        
        button.classList.add('added');
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.backgroundColor = '#2ecc71';
        
        setTimeout(() => {
            button.classList.remove('added');
            button.innerHTML = originalHTML;
            button.style.backgroundColor = originalBackground;
        }, 1000);
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Giỏ hàng của bạn đang trống!');
            return;
        }

        const totalAmount = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Chuyển hướng đến trang thanh toán. Tổng tiền: ${this.formatPrice(totalAmount)}`);
        // Here you would typically redirect to checkout page
        // window.location.href = '/checkout';
        
        // Optional: Clear cart after checkout
        // this.items = [];
        // this.saveCart();
        // this.updateCartUI();
        // this.closeCart();
    }

    // Utility method to get cart summary
    getCartSummary() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return {
            totalItems,
            totalAmount,
            formattedTotal: this.formatPrice(totalAmount),
            items: this.items
        };
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing cart...');
    
    // Initialize cart
    window.cart = new Cart();
    
    // Video optimization
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroVideo) {
        // Preload video metadata
        heroVideo.addEventListener('loadedmetadata', function() {
            console.log('Video metadata loaded');
        });
        
        // Handle video loading errors
        heroVideo.addEventListener('error', function() {
            console.error('Video failed to load');
            // Fallback to background image
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.backgroundImage = 'url(assets/images/hero-fallback.jpg)';
            }
        });
        
        // Play video when user interacts (for some browser autoplay policies)
        document.addEventListener('click', function() {
            if (heroVideo.paused) {
                heroVideo.play().catch(e => console.log('Autoplay prevented:', e));
            }
        });
        
        // Mute/unmute toggle
        const muteButton = document.createElement('button');
        muteButton.innerHTML = '🔇';
        muteButton.style.position = 'absolute';
        muteButton.style.bottom = '20px';
        muteButton.style.right = '20px';
        muteButton.style.zIndex = '3';
        muteButton.style.background = 'rgba(0,0,0,0.5)';
        muteButton.style.color = 'white';
        muteButton.style.border = 'none';
        muteButton.style.borderRadius = '50%';
        muteButton.style.width = '40px';
        muteButton.style.height = '40px';
        muteButton.style.cursor = 'pointer';
        
        muteButton.addEventListener('click', function() {
            heroVideo.muted = !heroVideo.muted;
            muteButton.innerHTML = heroVideo.muted ? '🔇' : '🔊';
        });
        
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.appendChild(muteButton);
        }
    }

    // Debug: Log cart state
    console.log('Cart initialized:', window.cart.getCartSummary());
});
// User dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const userBtn = document.querySelector('.user-btn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
            userBtn.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            userDropdown.classList.remove('active');
            userBtn.classList.remove('active');
        });
        
        // Prevent dropdown from closing when clicking inside
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});