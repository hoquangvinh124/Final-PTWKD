// Search Results Page
let allProducts = [];
let filteredProducts = [];
let selectedTypes = new Set();
let currentSort = 'default';

// Get search query from URL
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('q') || '';

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('=== SEARCH RESULTS PAGE LOADED ===');
    console.log('Search query from URL:', searchQuery);

    // Load products
    console.log('Starting to load products...');
    await loadProducts();
    console.log('Products loaded:', allProducts.length);

    // Perform initial search
    console.log('Performing search...');
    performSearch();
    console.log('=== SEARCH COMPLETE ===');
});

// Load products from JSON
async function loadProducts() {
    try {
        console.log('Fetching product.json...');
        const response = await fetch('product.json');
        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        allProducts = await response.json();
        console.log('Products fetched successfully:', allProducts.length);
    } catch (error) {
        console.error('Error loading products:', error);
        const searchCount = document.getElementById('searchCount');
        if (searchCount) {
            searchCount.textContent = 'Lỗi khi tải dữ liệu';
        }
    }
}

// Perform search based on query
function performSearch() {
    console.log('performSearch called with query:', searchQuery);
    console.log('Total products:', allProducts.length);

    if (!searchQuery) {
        filteredProducts = [...allProducts];
    } else {
        const searchTerm = searchQuery.toLowerCase().trim();
        console.log('Search term (trimmed/lowercased):', searchTerm);

        // Same logic as search.js dropdown - only search name, category, subcategory
        filteredProducts = allProducts.filter(product => {
            const name = product.name.toLowerCase();
            const category = product.category.toLowerCase();
            const subcategory = product.subcategory ? product.subcategory.toLowerCase() : '';

            const matches = name.includes(searchTerm) ||
                   category.includes(searchTerm) ||
                   subcategory.includes(searchTerm);

            if (matches) {
                console.log('Match found:', product.name, {name, category, subcategory});
            }

            return matches;
        });
    }

    console.log('Filtered products count:', filteredProducts.length);

    // Build filters based on results
    buildTypeFilter();

    // Apply filters and sort
    applyFiltersAndSort();
}

// Build type filter options from search results
function buildTypeFilter() {
    const types = {};

    console.log('buildTypeFilter called, filteredProducts:', filteredProducts.length);

    filteredProducts.forEach(product => {
        // Count categories and subcategories
        const type = product.subcategory || product.category;
        if (type) {
            types[type] = (types[type] || 0) + 1;
        }
    });

    console.log('Types found:', Object.keys(types).length, types);

    // Build type filter dropdown
    const typeFilterDropdown = document.getElementById('typeFilterDropdown');
    if (typeFilterDropdown) {
        if (Object.keys(types).length === 0) {
            typeFilterDropdown.innerHTML = '<div class="filter-dropdown-item disabled">No types available</div>';
        } else {
            typeFilterDropdown.innerHTML = Object.entries(types)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([type, count]) => `
                    <div class="filter-dropdown-item" onclick="selectTypeFilter(this, '${type}')">
                        ${type}
                    </div>
                `).join('');
        }
        console.log('Type filter dropdown updated');
    } else {
        console.error('typeFilterDropdown element not found!');
    }
}

// Select type filter
window.selectTypeFilter = function(element, type) {
    console.log('Type filter clicked:', type);
    console.log('Current selected types:', selectedTypes);
    
    // Toggle selection
    if (selectedTypes.has(type)) {
        selectedTypes.delete(type);
        element.classList.remove('selected');
        console.log('Removed type:', type);
    } else {
        selectedTypes.add(type);
        element.classList.add('selected');
        console.log('Added type:', type);
    }

    console.log('Updated selected types:', selectedTypes);
    applyFiltersAndSort();
};

// Select sort filter
window.selectSortFilter = function(element, sortValue) {
    currentSort = sortValue;

    // Update UI
    const parent = element.parentElement;
    parent.querySelectorAll('.filter-dropdown-item').forEach(item => {
        item.classList.remove('selected');
    });
    element.classList.add('selected');

    applyFiltersAndSort();
};

// Apply filters and sorting
function applyFiltersAndSort() {
    console.log('=== Applying Filters ===');
    console.log('Selected types:', selectedTypes);
    console.log('Filtered products before type filter:', filteredProducts.length);
    
    let results = [...filteredProducts];

    // Apply type filter
    if (selectedTypes.size > 0) {
        results = results.filter(product => {
            const type = product.subcategory || product.category;
            return selectedTypes.has(type);
        });
        console.log('Results after type filter:', results.length);
    }

    // Apply sorting
    results = sortProducts(results);

    // Update display
    updateResultsDisplay(results);
}

// Sort products
function sortProducts(products) {
    const sorted = [...products];

    switch (currentSort) {
        case 'price-asc':
            return sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        case 'price-desc':
            return sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        default:
            return sorted;
    }
}

// Parse price string to number
function parsePrice(priceString) {
    if (!priceString) return 0;
    return parseInt(priceString.replace(/[^\d]/g, '')) || 0;
}

// Update results display
function updateResultsDisplay(products) {
    const productsGrid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    const searchCount = document.getElementById('searchCount');

    // Update count - simple format like "SHOWING X RESULTS FOR "query""
    if (searchCount) {
        if (searchQuery) {
            searchCount.textContent = `SHOWING ${products.length} RESULTS FOR "${searchQuery}"`;
        } else {
            searchCount.textContent = `SHOWING ${products.length} PRODUCTS`;
        }
    }

    if (products.length === 0) {
        if (productsGrid) productsGrid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';

    // Render products in Bootstrap grid - using same format as product pages
    if (productsGrid) {
        productsGrid.innerHTML = products.map(product => `
            <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 product-grid-item">
                <div class="item product-card">
                    <div class="thumb">
                        <div class="hover-content">
                            <ul>
                                <li><button class="heart-btn" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}" data-product-image="${product.image_front}"><i class="heart-icon"></i></button></li>
                                <li><button class="action-btn add-to-cart" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}" data-product-image="${product.image_front}"><i class="shopping-bag-icon"></i></button></li>
                            </ul>
                        </div>
                        <a href="single-product.html?id=${product.id}">
                            <img src="${product.image_front}" alt="${product.name}" loading="lazy" class="main-image">
                            <img src="${product.image_back}" alt="${product.name}" loading="lazy" class="hover-image">
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
        `).join('');

        // Bind cart functionality after rendering
        bindProductActions();
        
        // Initialize or refresh pagination
        if (window.productPagination) {
            window.productPagination.refresh();
        } else {
            window.productPagination = new ProductPagination();
            window.productPagination.init('.col-xl-8 .row.gx-5');
        }
    }
}

// Bind cart and wishlist actions to product cards
function bindProductActions() {
    // Add to cart buttons - same as product-loader.js
    document.querySelectorAll('.add-to-cart').forEach(button => {
        if (button.hasAttribute('data-cart-bound')) return; // Skip if already bound

        button.setAttribute('data-cart-bound', 'true');
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Call cart's addToCart method directly
            if (typeof window.cart !== 'undefined') {
                window.cart.addToCart(this);
            }
        });
    });

    // Heart/Wishlist buttons
    document.querySelectorAll('.heart-btn').forEach(button => {
        if (button.hasAttribute('data-wishlist-bound')) return; // Skip if already bound

        button.setAttribute('data-wishlist-bound', 'true');
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Trigger wishlist toggle (handled by wishlist.js)
            if (window.toggleWishlist) {
                window.toggleWishlist(this.dataset.productId);
            }
        });
    });

    console.log('Product action buttons bound successfully');
}

// Reset filters
window.resetFilters = function() {
    selectedTypes.clear();
    currentSort = 'default';

    // Clear UI selections
    document.querySelectorAll('.filter-dropdown-item.selected').forEach(item => {
        item.classList.remove('selected');
    });

    applyFiltersAndSort();
};

// Filter dropdown toggle (same as product pages)
window.toggleFilterDropdown = function(button) {
    const dropdown = button.nextElementSibling;
    const allDropdowns = document.querySelectorAll('.filter-dropdown-content');

    // Close all other dropdowns
    allDropdowns.forEach(d => {
        if (d !== dropdown) {
            d.classList.remove('show');
            d.previousElementSibling.classList.remove('active');
        }
    });

    // Toggle current dropdown
    dropdown.classList.toggle('show');
    button.classList.toggle('active');
};

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter-dropdown')) {
        document.querySelectorAll('.filter-dropdown-content').forEach(dropdown => {
            dropdown.classList.remove('show');
            dropdown.previousElementSibling.classList.remove('active');
        });
    }
});
