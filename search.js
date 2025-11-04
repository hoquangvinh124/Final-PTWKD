// Search functionality - wrapped in DOMContentLoaded to ensure elements exist
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.querySelector('.search-btn');
    const searchBar = document.getElementById('searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    const searchDropdown = document.getElementById('searchDropdown');

    let allProducts = [];
    let searchTimeout;

    // Load products from JSON
    async function loadProducts() {
        try {
            const response = await fetch('product.json');
            allProducts = await response.json();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    // Initialize
    loadProducts();

function openSearch() {
    if (searchBar && searchInput) {
        searchBar.classList.add('active');
        setTimeout(() => searchInput.focus(), 300);
    }
}

function closeSearch() {
    if (searchBar && searchInput) {
        searchBar.classList.remove('active');
        searchInput.value = '';
        hideDropdown();
    }
}

function showDropdown() {
    if (searchDropdown) {
        searchDropdown.classList.add('active');
    }
}

function hideDropdown() {
    if (searchDropdown) {
        searchDropdown.classList.remove('active');
    }
}

function searchProducts(query) {
    if (!query || query.trim().length < 2) {
        return [];
    }

    const searchTerm = query.toLowerCase().trim();
    return allProducts.filter(product => {
        const name = product.name.toLowerCase();
        const category = product.category.toLowerCase();
        const subcategory = product.subcategory ? product.subcategory.toLowerCase() : '';

        return name.includes(searchTerm) ||
               category.includes(searchTerm) ||
               subcategory.includes(searchTerm);
    }).slice(0, 5); // Limit to 5 results
}

function displayDropdownResults(results) {
    if (!searchDropdown) return;

    if (results.length === 0) {
        searchDropdown.innerHTML = '<div class="search-dropdown-item" style="cursor: default;"><p style="color: #999; margin: 0;">Không tìm thấy sản phẩm</p></div>';
        showDropdown();
        return;
    }

    searchDropdown.innerHTML = results.map(product => `
        <div class="search-dropdown-item" data-product-id="${product.id}">
            <img src="${product.image_front}" alt="${product.name}">
            <div class="search-dropdown-info">
                <div class="search-dropdown-name">${product.name}</div>
                <div class="search-dropdown-category">${product.category} ${product.subcategory ? '> ' + product.subcategory : ''}</div>
                <div class="search-dropdown-price">${product.price}</div>
            </div>
        </div>
    `).join('');

    showDropdown();

    // Add click events to dropdown items
    document.querySelectorAll('.search-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const productId = item.getAttribute('data-product-id');
            if (productId) {
                window.location.href = `single-product.html?id=${productId}`;
            }
        });
    });
}

function handleSearch() {
    const query = searchInput.value;

    if (!query || query.trim().length < 2) {
        hideDropdown();
        return;
    }

    const results = searchProducts(query);
    displayDropdownResults(results);
}

// Event listeners
if (searchBtn) {
    searchBtn.addEventListener('click', openSearch);
}

if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
}

if (searchInput) {
    // Real-time search as user types
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(handleSearch, 300);
    });

    // Handle Enter key - navigate to search results page
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
            }
        }
    });

    // Hide dropdown when input loses focus (with delay for click)
    searchInput.addEventListener('blur', () => {
        setTimeout(() => hideDropdown(), 200);
    });

    // Show dropdown when input gains focus and has value
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) {
            handleSearch();
        }
    });
}

// Close search when pressing Escape
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && searchBar && searchBar.classList.contains('active')) {
        closeSearch();
    }
});

// Close search when clicking outside
if (searchBar) {
    searchBar.addEventListener('click', (event) => {
        if (event.target === searchBar) {
            closeSearch();
        }
    });
}

}); // End of DOMContentLoaded