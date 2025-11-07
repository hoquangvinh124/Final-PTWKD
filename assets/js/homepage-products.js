/**
 * Homepage Product Loader
 * Loads random products from product.json into Best Sellers and New Arrivals sections
 */

class HomepageProducts {
  constructor() {
    this.products = [];
    this.bestSellersContainer = null;
    this.newArrivalsContainers = [];
  }

  /**
   * Initialize homepage product loading
   */
  async init() {
    try {
      // Load product data
      await this.loadProducts();

      // Load Best Sellers
      this.bestSellersContainer = document.querySelector('.featured-products .products-grid');
      if (this.bestSellersContainer) {
        this.loadBestSellers();
      }

      // Load New Arrivals (two slider rows)
      const slider1 = document.querySelector('.slider:not(.slider-offset) .list');
      const slider2 = document.querySelector('.slider.slider-offset .list');

      if (slider1 && slider2) {
        this.newArrivalsContainers = [slider1, slider2];
        this.loadNewArrivals();
      }

    } catch (error) {
      console.error('Failed to load homepage products:', error);
    }
  }

  /**
   * Load products from product.json
   */
  async loadProducts() {
    try {
      const response = await fetch('product.json');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      this.products = await response.json();
      console.log(`Loaded ${this.products.length} products`);
    } catch (error) {
      console.error('Error loading products:', error);
      throw error;
    }
  }

  /**
   * Get random products from the collection
   * @param {number} count - Number of random products to get
   * @returns {Array} Array of random products
   */
  getRandomProducts(count) {
    const shuffled = [...this.products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Load 10 random products into Best Sellers section
   */
  loadBestSellers() {
    const randomProducts = this.getRandomProducts(10);
    const tags = ['Sale', 'Vintage', 'Limited', 'New', 'Hot'];

    const productsHTML = randomProducts.map((product, index) => {
      // Assign tag cyclically, last card gets 'Hot' tag
      const tag = index < 9 ? tags[index % tags.length] : 'Hot';

      return this.createBestSellerCard(product, tag);
    }).join('');

    this.bestSellersContainer.innerHTML = productsHTML;

    // Bind cart and wishlist functionality
    this.bindProductActions();
  }

  /**
   * Create Best Seller product card HTML with PRODUCT PAGE structure
   * @param {Object} product - Product data
   * @param {string|null} tag - Tag label (Sale, Vintage, etc.) or null
   * @returns {string} HTML string
   */
  createBestSellerCard(product, tag) {
    const tagHTML = tag ? `<div class="sale-tag ${tag.toLowerCase()}">${tag}</div>` : '';

    return `
      <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 product-grid-item">
        <div class="item product-card">
          ${tagHTML}
          <div class="thumb">
            <div class="hover-content">
              <ul>
                <li>
                  <button class="heart-btn"
                    data-product-id="${product.id}"
                    data-product-name="${product.name}"
                    data-product-price="${product.price}"
                    data-product-image="${product.image_front}">
                    <i class="heart-icon"></i>
                  </button>
                </li>
                <li>
                  <button class="action-btn add-to-cart"
                    data-product-id="${product.id}"
                    data-product-name="${product.name}"
                    data-product-price="${product.price}"
                    data-product-image="${product.image_front}">
                    <i class="shopping-bag-icon"></i>
                  </button>
                </li>
              </ul>
            </div>
            <a href="single-product.html?id=${product.id}">
              <img src="${product.image_front}" alt="${product.name}" class="main-image">
              <img src="${product.image_back}" alt="${product.name}" class="hover-image">
            </a>
          </div>
          <div class="down-content">
            <a href="single-product.html?id=${product.id}">
              <h4>${product.name}</h4>
            </a>
            <div class="product-price">
              <span class="current current-price">${product.price}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Load 20 random products into New Arrivals sliders (10 per row)
   */
  loadNewArrivals() {
    const randomProducts = this.getRandomProducts(20);

    // First slider: products 0-9
    const slider1HTML = randomProducts.slice(0, 10).map((product, index) => {
      return this.createNewArrivalItem(product, index + 1);
    }).join('');

    // Second slider: products 10-19
    const slider2HTML = randomProducts.slice(10, 20).map((product, index) => {
      return this.createNewArrivalItem(product, index + 1);
    }).join('');

    this.newArrivalsContainers[0].innerHTML = slider1HTML;
    this.newArrivalsContainers[1].innerHTML = slider2HTML;
  }

  /**
   * Create New Arrival slider item HTML
   * @param {Object} product - Product data
   * @param {number} position - Position in slider (1-10)
   * @returns {string} HTML string
   */
  createNewArrivalItem(product, position) {
    return `
      <div class="item" style="--position: ${position}">
        <a href="single-product.html?id=${product.id}">
          <img src="${product.image_front}" alt="${product.name}">
        </a>
      </div>
    `;
  }

  /**
   * Bind Add to Cart and Wishlist functionality
   */
  bindProductActions() {
    console.log('Binding homepage product actions...');
    
    // Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.products-grid .add-to-cart');
    console.log('Found cart buttons:', addToCartButtons.length);
    
    addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('Cart button clicked');
        // Use existing cart functionality from script.js - pass button element
        if (window.cart) {
          window.cart.addToCart(button);
        } else {
          console.error('window.cart not found!');
        }
      });
    });

    // Wishlist buttons - NO binding here, let wishlist.js event delegation handle it
    const heartButtons = document.querySelectorAll('.products-grid .heart-btn');
    console.log('Found heart buttons (will be handled by wishlist.js):', heartButtons.length);
    
    console.log('Homepage product actions bound successfully');
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const homepageProducts = new HomepageProducts();
  homepageProducts.init();
});
