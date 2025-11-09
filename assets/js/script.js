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

    // Handle all continue-shopping buttons (including in empty message)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.continue-shopping')) {
            this.closeCart();
        }
    });
}

    addToCart(button) {
        if (!button) return;
        
        // Check if button has data attributes (from product pages)
        const hasDataAttributes = button.hasAttribute('data-product-id');
        
        let productName, productPriceText, productImage, productId, productPrice;
        
        if (hasDataAttributes) {
            // Get data from button attributes - use ID directly from JSON
            productId = button.getAttribute('data-product-id');
            productName = button.getAttribute('data-product-name');
            productPriceText = button.getAttribute('data-product-price');
            productImage = button.getAttribute('data-product-image');
            productPrice = this.parsePrice(productPriceText);
        } else {
            // Get data from product card (homepage)
            const productCard = button.closest('.product-card');
            if (!productCard) return;
            
            productName = productCard.querySelector('h4').textContent;
            productPriceText = productCard.querySelector('.current-price').textContent;
            productImage = productCard.querySelector('.main-image').src;
            productId = this.generateProductId(productName, productImage);
            productPrice = this.parsePrice(productPriceText);
        }

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
        
        // Don't auto open cart modal - let user open it manually
        // this.openCart();
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
            // Ensure continue shopping button in empty message also closes cart
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
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" data-id="${item.id}">
                            <button class="quantity-btn plus" data-id="${item.id}" type="button">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}" type="button" title="Remove product">
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
        // Prevent multiple clicks
        if (button.classList.contains('added')) {
            return;
        }
        
        const originalHTML = button.innerHTML;
        
        button.classList.add('added');
        button.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            button.classList.remove('added');
            button.innerHTML = originalHTML;
        }, 1500);
    }

    checkout() {
        if (this.items.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }

        // Redirect to checkout page
        window.location.href = 'checkout.html';
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

// Initialize cart immediately or when DOM is ready
function initializeCart() {
    if (!window.cart) {
        console.log('Initializing cart...');
        window.cart = new Cart();
    }
}

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCart);
} else {
    // DOM already loaded
    initializeCart();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Ensure cart is initialized
    initializeCart();
    
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

// Newsletter functionality
document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.querySelector('.email-form');
    
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('.email-input');
            const email = emailInput.value.trim();
            
            if (email) {
                // Loading effect
                const submitBtn = this.querySelector('.subscribe-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate email submission
                setTimeout(() => {
                    alert('Thank you for subscribing! We will send updates to: ' + email);
                    emailInput.value = '';
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }
});const products = {
            vinyl: {
                title: "Vinyl Limited Edition",
                price: "1.250.000₫",
                image: "assets/images/Audio/Vinyl/1.png",
                reviews: [
                    {
                        reviewer: "Shayne M.",
                        date: "24/10/2025",
                        rating: "★★★★★",
                        text: "ILOVEMFFY!!"
                    },
                    {
                        reviewer: "Minh Anh",
                        date: "15/03/2023",
                        rating: "★★★★★",
                        text: "Great sound! I've been looking for this vinyl for a long time."
                    }
                ]
            },
            cassette: {
                title: "Cassette Player Pro", 
                price: "3.200.000₫",
                image: "https://images.unsplash.com/photo-1589001704894-9575e0f6e0bb?w=300&h=300&fit=crop",
                reviews: [
                    {
                        reviewer: "Tuấn Nguyễn",
                        date: "22/04/2023",
                        rating: "★★★★☆",
                        text: "Beautiful design, warm sound with true retro quality."
                    }
                ]
            },
            boxset: {
                title: "Box Set Limited Collection",
                price: "2.000.000₫", 
                image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
                reviews: [
                    {
                        reviewer: "Hương Giang",
                        date: "10/05/2023",
                        rating: "★★★★★",
                        text: "Wonderful collection! Print quality and materials are very high-end."
                    }
                ]
            },
            turntable: {
                title: "Turntable Classic Pro",
                price: "7.500.000₫",
                image: "https://images.unsplash.com/photo-1587502536575-6dfba0a6e017?w=300&h=300&fit=crop",
                reviews: [
                    {
                        reviewer: "Đức Anh",
                        date: "05/02/2023",
                        rating: "★★★★★",
                        text: "Worth the investment! Detailed and authentic sound."
                    },
                    {
                        reviewer: "Joshua B.",
                        date: "24/10/2025",
                        rating: "★★★★★",
                        text: "I'm very happy with my new skins. The overall look and feel of the camera is dramatically improved and is more enjoyable to handle."
                    }
                ]
            },
            merch: {
                title: "Vintage Merch Collection",
                price: "450.000₫",
                image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&h=300&fit=crop",
                reviews: [
                    {
                        reviewer: "Lan Phương",
                        date: "18/06/2023",
                        rating: "★★★★☆",
                        text: "Good shirt quality, beautiful fit. Unique design that stands out."
                    },
                    {
                        reviewer: "Michelle C.",
                        date: "25/10/2025",
                        rating: "★★★★★",
                        text: "The camera is so cute and the packaging was really wonderful. Arrived fast."
                    }
                ]
            }
        };

        // Handle event when card is clicked
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', function() {
                const productType = this.getAttribute('data-product');
                const product = products[productType];
                
                if (product) {
                    // Hide default, show active
                    document.getElementById('defaultDisplay').style.display = 'none';
                    const activeDisplay = document.getElementById('activeDisplay');
                    activeDisplay.style.display = 'block';
                    
                    // Cập nhật nội dung
                    document.getElementById('displayTitle').textContent = product.title;
                    document.getElementById('displayPrice').textContent = product.price;
                    document.getElementById('displayImg').src = product.image;
                    document.getElementById('displayImg').alt = product.title;
                    
                    // Cập nhật reviews
                    const reviewList = document.getElementById('reviewList');
                    reviewList.innerHTML = '';
                    
                    product.reviews.forEach(review => {
                        const reviewItem = document.createElement('div');
                        reviewItem.className = 'review-item';
                        reviewItem.innerHTML = `
                            <div class="review-header">
                                <span class="reviewer-name">${review.reviewer}</span>
                                <span class="review-date">${review.date}</span>
                            </div>
                            <div class="review-rating">${review.rating}</div>
                            <div class="review-text">${review.text}</div>
                        `;
                        reviewList.appendChild(reviewItem);
                    });
                    
                    // Add effects
                    activeDisplay.style.animation = 'none';
                    setTimeout(() => {
                        activeDisplay.style.animation = 'fadeInUp 0.6s ease';
                    }, 10);
                }
            });
        });

        // Initialize - display first product
        document.addEventListener('DOMContentLoaded', function() {
            const firstCard = document.querySelector('.card');
            if (firstCard) {
                firstCard.click();
            }
        });

        // Handle action buttons
        function addToCart() {
            const productTitle = document.getElementById('displayTitle').textContent;
            alert(`✅ Đã thêm "${productTitle}" vào giỏ hàng!`);
        }

        function buyNow() {
            const productTitle = document.getElementById('displayTitle').textContent;
            alert(`🚀 Chuyển hướng đến trang thanh toán cho "${productTitle}"`);
        }