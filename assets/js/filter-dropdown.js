// Simple Filter Accordion Script
// Global state for filters
let currentFilters = {
    type: null,
    sortBy: null
};

let allProducts = [];

// Toggle accordion visibility
function toggleFilterDropdown(button) {
    const dropdown = button.parentElement;
    const content = dropdown.querySelector('.filter-dropdown-content');
    const isActive = button.classList.contains('active');
    
    // Toggle current accordion
    if (isActive) {
        content.classList.remove('show');
        button.classList.remove('active');
    } else {
        content.classList.add('show');
        button.classList.add('active');
    }
}

// Select filter option
function selectFilter(item, filterType) {
    const dropdown = item.closest('.filter-dropdown');
    const allItems = dropdown.querySelectorAll('.filter-dropdown-item');
    
    // Remove selected class from all items in this dropdown
    allItems.forEach(i => i.classList.remove('selected'));
    
    // Add selected class to clicked item
    item.classList.add('selected');
    
    // Get selected text
    const selectedText = item.textContent.trim();
    
    // Update filter state
    if (filterType === 'type') {
        currentFilters.type = selectedText === 'All' ? null : selectedText;
    } else if (filterType === 'sortby') {
        currentFilters.sortBy = selectedText;
    }
    
    console.log(`Filter ${filterType}: ${selectedText}`, currentFilters);
    
    // Apply filters
    applyFiltersAndSort();
}

// Apply filters and sorting
function applyFiltersAndSort() {
    if (allProducts.length === 0) {
        console.warn('No products loaded yet');
        return;
    }
    
    let filtered = [...allProducts];
    
    console.log('Starting with products:', filtered.length);
    
    // Apply type filter (category/subcategory)
    if (currentFilters.type) {
        filtered = filtered.filter(product => {
            const type = currentFilters.type;
            // Check if it matches category or subcategory
            return product.category === type || product.subcategory === type;
        });
        console.log('After TYPE filter:', filtered.length);
    }
    
    // Apply sorting
    if (currentFilters.sortBy) {
        switch (currentFilters.sortBy) {
            case 'Alphabetically, A-Z':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'Alphabetically, Z-A':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'Price, low to high':
                filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
                break;
            case 'Price, high to low':
                filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
                break;
            case 'Date, old to new':
                filtered.sort((a, b) => parseInt(a.id) - parseInt(b.id));
                break;
            case 'Date, new to old':
                filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
                break;
            case 'Default':
            default:
                // Keep original order
                break;
        }
        console.log('After SORT BY:', currentFilters.sortBy);
    }
    
    // Re-render products
    renderProducts(filtered);
}

// Parse price string to number
function parsePrice(priceStr) {
    if (!priceStr) return 0;
    // Remove "From", "₫", and convert to number
    const cleaned = priceStr.replace(/From\s*/i, '').replace(/[₫,.]/g, '');
    return parseInt(cleaned) || 0;
}

// Render products to DOM
function renderProducts(products) {
    const container = document.querySelector('.col-xl-8 .row.gx-5');
    if (!container) return;
    
    // Remove existing product cards
    const existingProducts = container.querySelectorAll('.product-grid-item');
    existingProducts.forEach(item => item.remove());
    
    const emptyState = container.querySelector('.product-empty-state');
    
    if (products.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        
        // Create product cards using the global createProductCard function
        const productsHTML = products.map(product => {
            if (typeof createProductCard === 'function') {
                return createProductCard(product);
            }
            return '';
        }).join('');
        
        if (emptyState) {
            emptyState.insertAdjacentHTML('beforebegin', productsHTML);
        } else {
            container.insertAdjacentHTML('afterbegin', productsHTML);
        }
    }
    
    console.log(`Rendered ${products.length} products`);
}
