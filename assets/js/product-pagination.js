/**
 * Product Pagination System
 * Handles pagination for product listing pages
 * Display: 4 columns × 4 rows = 16 products per page
 */

class ProductPagination {
  constructor() {
    this.currentPage = 0;
    this.itemsPerPage = 16; // 4 columns × 4 rows
    this.totalItems = 0;
    this.paginationContainer = null;
    this.productContainer = null;
    this.allProductElements = [];
  }

  /**
   * Initialize pagination
   * @param {string} containerSelector - Selector for product container
   */
  init(containerSelector = '.col-xl-8 .row.gx-5') {
    this.productContainer = document.querySelector(containerSelector);
    
    if (!this.productContainer) {
      console.warn('Product container not found');
      return;
    }

    // Create pagination controls if not exists
    this.createPaginationControls();
    
    // Wait a bit for products to load
    setTimeout(() => {
      this.refresh();
    }, 500);
  }

  /**
   * Create pagination HTML structure
   */
  createPaginationControls() {
    // Check if pagination already exists
    let existingContainer = document.querySelector('.product-pagination-container');
    
    if (!existingContainer) {
      // Create new pagination container
      const paginationHTML = `
        <div class="product-pagination-container">
          <div class="product-pagination" id="productPagination">
            <button type="button" class="page-btn page-control" data-action="prev" aria-label="Previous page">‹</button>
            <!-- Page numbers will be inserted here -->
            <button type="button" class="page-btn page-control" data-action="next" aria-label="Next page">›</button>
          </div>
        </div>
      `;
      
      // Insert after product grid
      const productSection = document.querySelector('#products .col-xl-8');
      if (productSection) {
        productSection.insertAdjacentHTML('beforeend', paginationHTML);
      }
    }
    
    this.paginationContainer = document.getElementById('productPagination');
    this.bindPaginationEvents();
  }

  /**
   * Refresh pagination based on current products
   */
  refresh() {
    if (!this.productContainer) return;
    
    // Get all product items
    this.allProductElements = Array.from(
      this.productContainer.querySelectorAll('.product-grid-item, .col-xl-3, .col-lg-3')
    ).filter(el => !el.classList.contains('product-empty-state'));
    
    this.totalItems = this.allProductElements.length;
    
    // Show/hide pagination based on item count
    if (this.totalItems <= this.itemsPerPage) {
      this.hidePagination();
      // Show all products
      this.allProductElements.forEach(el => el.style.display = '');
    } else {
      this.showPagination();
      this.updatePagination();
      this.showPage(0);
    }
  }

  /**
   * Show specific page
   */
  showPage(pageIndex) {
    this.currentPage = pageIndex;
    
    const startIndex = pageIndex * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    // Hide all products first
    this.allProductElements.forEach((el, index) => {
      if (index >= startIndex && index < endIndex) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });
    
    // Update pagination UI
    this.updatePaginationUI();
    
    // Scroll to top of products
    const productsSection = document.querySelector('#products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Update pagination controls
   */
  updatePagination() {
    if (!this.paginationContainer) return;
    
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    // Clear existing page buttons (keep prev/next)
    const prevBtn = this.paginationContainer.querySelector('[data-action="prev"]');
    const nextBtn = this.paginationContainer.querySelector('[data-action="next"]');
    const existingPageBtns = this.paginationContainer.querySelectorAll('.page-btn:not(.page-control)');
    existingPageBtns.forEach(btn => btn.remove());
    
    // Calculate which pages to show (show up to 3 page numbers)
    let startPage = Math.max(0, this.currentPage - 1);
    let endPage = Math.min(totalPages - 1, startPage + 2);
    
    // Adjust if we're near the end
    if (endPage - startPage < 2) {
      startPage = Math.max(0, endPage - 2);
    }
    
    // Create page number buttons
    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.type = 'button';
      pageBtn.className = 'page-btn';
      pageBtn.textContent = i + 1;
      pageBtn.setAttribute('data-page', i);
      
      if (i === this.currentPage) {
        pageBtn.classList.add('is-active');
      }
      
      pageBtn.addEventListener('click', () => {
        this.showPage(i);
      });
      
      // Insert before next button
      this.paginationContainer.insertBefore(pageBtn, nextBtn);
    }
  }

  /**
   * Update pagination UI state
   */
  updatePaginationUI() {
    if (!this.paginationContainer) return;
    
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const prevBtn = this.paginationContainer.querySelector('[data-action="prev"]');
    const nextBtn = this.paginationContainer.querySelector('[data-action="next"]');
    const pageButtons = this.paginationContainer.querySelectorAll('.page-btn:not(.page-control)');
    
    // Update prev/next buttons
    if (prevBtn) {
      prevBtn.disabled = this.currentPage === 0;
    }
    
    if (nextBtn) {
      nextBtn.disabled = this.currentPage >= totalPages - 1;
    }
    
    // Update page number buttons
    pageButtons.forEach(btn => {
      const pageIndex = parseInt(btn.getAttribute('data-page'));
      btn.classList.toggle('is-active', pageIndex === this.currentPage);
    });
  }

  /**
   * Bind pagination button events
   */
  bindPaginationEvents() {
    if (!this.paginationContainer) return;
    
    // Prev button
    const prevBtn = this.paginationContainer.querySelector('[data-action="prev"]');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentPage > 0) {
          this.showPage(this.currentPage - 1);
          this.updatePagination();
        }
      });
    }
    
    // Next button
    const nextBtn = this.paginationContainer.querySelector('[data-action="next"]');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        if (this.currentPage < totalPages - 1) {
          this.showPage(this.currentPage + 1);
          this.updatePagination();
        }
      });
    }
  }

  /**
   * Show pagination controls
   */
  showPagination() {
    if (this.paginationContainer) {
      this.paginationContainer.classList.add('show');
    }
  }

  /**
   * Hide pagination controls
   */
  hidePagination() {
    if (this.paginationContainer) {
      this.paginationContainer.classList.remove('show');
    }
  }
}

// Create global instance
window.productPagination = new ProductPagination();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for products to load first
  setTimeout(() => {
    if (window.productPagination) {
      window.productPagination.init();
    }
  }, 1000);
});

// Re-initialize when products are filtered
document.addEventListener('productsFiltered', () => {
  if (window.productPagination) {
    window.productPagination.refresh();
  }
});
