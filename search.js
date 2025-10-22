// Search functionality
const searchBtn = document.querySelector('.search-btn');
const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');
const searchClose = document.getElementById('searchClose');

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
    }
}

// Event listeners
if (searchBtn) {
    searchBtn.addEventListener('click', openSearch);
}

if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
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