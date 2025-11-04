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
    // Display search query
    const searchQueryEl = document.getElementById('searchQuery');
    if (searchQueryEl) {
        searchQueryEl.textContent = searchQuery ? `"${searchQuery}"` : 'All Products';
    }

    // Load products
    await loadProducts();

    // Perform initial search
    performSearch();
});

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('product.json');
        allProducts = await response.json();
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
    if (!searchQuery) {
        filteredProducts = [...allProducts];
    } else {
        const searchTerm = searchQuery.toLowerCase().trim();
        filteredProducts = allProducts.filter(product => {
            const name = product.name.toLowerCase();
            const category = product.category.toLowerCase();
            const subcategory = product.subcategory ? product.subcategory.toLowerCase() : '';
            const description = product.description ? product.description.toLowerCase() : '';

            return name.includes(searchTerm) ||
                   category.includes(searchTerm) ||
                   subcategory.includes(searchTerm) ||
                   description.includes(searchTerm);
        });
    }

    // Build filters based on results
    buildTypeFilter();

    // Apply filters and sort
    applyFiltersAndSort();
}

// Build type filter options from search results
function buildTypeFilter() {
    const types = {};

    filteredProducts.forEach(product => {
        // Count categories and subcategories
        const type = product.subcategory || product.category;
        if (type) {
            types[type] = (types[type] || 0) + 1;
        }
    });

    // Build type filter dropdown
    const typeFilterDropdown = document.getElementById('typeFilterDropdown');
    if (typeFilterDropdown) {
        typeFilterDropdown.innerHTML = Object.entries(types)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([type, count]) => `
                <div class="filter-dropdown-item" onclick="selectTypeFilter(this, '${type}')">
                    ${type} (${count})
                </div>
            `).join('');
    }
}

// Select type filter
window.selectTypeFilter = function(element, type) {
    // Toggle selection
    if (selectedTypes.has(type)) {
        selectedTypes.delete(type);
        element.classList.remove('selected');
    } else {
        selectedTypes.add(type);
        element.classList.add('selected');
    }

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
    let results = [...filteredProducts];

    // Apply type filter
    if (selectedTypes.size > 0) {
        results = results.filter(product => {
            const type = product.subcategory || product.category;
            return selectedTypes.has(type);
        });
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

    // Update count
    if (searchCount) {
        searchCount.textContent = `Found ${products.length} product${products.length !== 1 ? 's' : ''}`;
    }

    if (products.length === 0) {
        if (productsGrid) productsGrid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';

    // Render products in Bootstrap grid
    if (productsGrid) {
        productsGrid.innerHTML = products.map(product => `
            <div class="col-lg-4 col-md-6">
                <div class="item">
                    <div class="thumb" onclick="window.location.href='single-product.html?id=${product.id}'">
                        <div class="hover-content">
                            <ul>
                                <li><a href="single-product.html?id=${product.id}"><i class="fa fa-eye"></i></a></li>
                                <li><a href="single-product.html?id=${product.id}"><i class="fa fa-star"></i></a></li>
                                <li><a href="single-product.html?id=${product.id}"><i class="fa fa-shopping-cart"></i></a></li>
                            </ul>
                        </div>
                        <img src="${product.image_front}" alt="${product.name}">
                    </div>
                    <div class="down-content">
                        <h4>${product.name}</h4>
                        <span>${product.price}</span>
                        <ul class="stars">
                            <li><i class="fa fa-star"></i></li>
                            <li><i class="fa fa-star"></i></li>
                            <li><i class="fa fa-star"></i></li>
                            <li><i class="fa fa-star"></i></li>
                            <li><i class="fa fa-star"></i></li>
                        </ul>
                    </div>
                </div>
            </div>
        `).join('');
    }
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
            d.classList.remove('active');
            d.previousElementSibling.classList.remove('active');
        }
    });

    // Toggle current dropdown
    dropdown.classList.toggle('active');
    button.classList.toggle('active');
};

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter-dropdown')) {
        document.querySelectorAll('.filter-dropdown-content').forEach(dropdown => {
            dropdown.classList.remove('active');
            dropdown.previousElementSibling.classList.remove('active');
        });
    }
});
