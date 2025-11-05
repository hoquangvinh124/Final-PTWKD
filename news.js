// RSS Feed URLs
const RSS_FEEDS = {
    albums: 'https://pitchfork.com/feed/feed-album-reviews/rss',
    tracks: 'https://pitchfork.com/feed/feed-track-reviews/rss'
};

// RSS to JSON API (free CORS proxy for RSS feeds)
const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';

// State management
let currentTab = 'albums';
let albumsData = [];
let tracksData = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadRSSFeeds();
});

// Initialize tab switching
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

// Switch between tabs
function switchTab(tabName) {
    currentTab = tabName;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-content`).classList.add('active');

    // Load data if not already loaded
    if (tabName === 'albums' && albumsData.length === 0) {
        loadAlbumsData();
    } else if (tabName === 'tracks' && tracksData.length === 0) {
        loadTracksData();
    }
}

// Load all RSS feeds
async function loadRSSFeeds() {
    showLoading();

    try {
        // Load albums by default
        await loadAlbumsData();
        hideLoading();
    } catch (error) {
        console.error('Error loading RSS feeds:', error);
        showError();
        hideLoading();
    }
}

// Load albums data
async function loadAlbumsData() {
    if (albumsData.length > 0) {
        displayNews(albumsData, 'albumsGrid');
        return;
    }

    showLoading();

    try {
        const data = await fetchRSS(RSS_FEEDS.albums);
        albumsData = data;
        displayNews(albumsData, 'albumsGrid');
        hideLoading();
    } catch (error) {
        console.error('Error loading albums:', error);
        showError();
        hideLoading();
    }
}

// Load tracks data
async function loadTracksData() {
    if (tracksData.length > 0) {
        displayNews(tracksData, 'tracksGrid');
        return;
    }

    showLoading();

    try {
        const data = await fetchRSS(RSS_FEEDS.tracks);
        tracksData = data;
        displayNews(tracksData, 'tracksGrid');
        hideLoading();
    } catch (error) {
        console.error('Error loading tracks:', error);
        showError();
        hideLoading();
    }
}

// Fetch RSS feed using RSS2JSON API
async function fetchRSS(feedUrl) {
    try {
        const response = await fetch(`${RSS_TO_JSON_API}${encodeURIComponent(feedUrl)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error('RSS feed fetch failed');
        }

        return data.items || [];
    } catch (error) {
        console.error('Error fetching RSS:', error);
        throw error;
    }
}

// Display news items
function displayNews(items, gridId) {
    const grid = document.getElementById(gridId);

    if (!items || items.length === 0) {
        grid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-newspaper"></i>
                <h3>No articles found</h3>
                <p>There are currently no articles to display.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = items.map(item => createNewsCard(item)).join('');

    // Add click handlers to news cards
    addNewsCardClickHandlers();
}

// Create a news card HTML
function createNewsCard(item) {
    const title = item.title || 'Untitled';
    const description = item.description ? stripHTML(item.description) : 'No description available';
    const link = item.link || '#';
    const pubDate = item.pubDate ? formatDate(item.pubDate) : 'Unknown date';
    const author = item.author || 'Pitchfork';

    // Extract image from content or use thumbnail
    let imageUrl = item.thumbnail || item.enclosure?.link || extractImageFromContent(item.content || item.description);

    // Fallback image if no image found
    if (!imageUrl) {
        imageUrl = 'assets/images/cd.gif'; // Using your existing image as fallback
    }

    const badgeType = currentTab === 'albums' ? 'Album Review' : 'Track Review';

    return `
        <article class="news-card" data-url="${link}">
            <div class="news-card-image">
                <img src="${imageUrl}" alt="${escapeHTML(title)}" loading="lazy" onerror="this.src='assets/images/cd.gif'">
                <span class="news-badge">${badgeType}</span>
            </div>
            <div class="news-card-content">
                <h3 class="news-card-title">${escapeHTML(title)}</h3>
                <div class="news-card-meta">
                    <span><i class="fas fa-newspaper"></i> Pitchfork</span>
                    <span><i class="fas fa-calendar"></i> ${pubDate}</span>
                </div>
                <p class="news-card-description">${escapeHTML(description)}</p>
                <div class="news-card-footer">
                    <span class="news-card-author">By ${escapeHTML(author)}</span>
                    <a href="${link}" target="_blank" rel="noopener noreferrer" class="read-more-btn">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </article>
    `;
}

// Add click handlers to news cards
function addNewsCardClickHandlers() {
    document.querySelectorAll('.news-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on the read more button or link
            if (e.target.closest('.read-more-btn') || e.target.closest('a')) {
                return;
            }

            const url = this.getAttribute('data-url');
            if (url && url !== '#') {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        });
    });
}

// Utility functions

// Strip HTML tags from string
function stripHTML(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// Extract image URL from HTML content
function extractImageFromContent(content) {
    if (!content) return null;

    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);

    return match ? match[1] : null;
}

// Format date to readable string
function formatDate(dateString) {
    try {
        const date = new Date(dateString);

        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };

        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return dateString;
    }
}

// Escape HTML to prevent XSS
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show loading indicator
function showLoading() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');

    loadingIndicator.classList.add('active');
    errorMessage.style.display = 'none';
}

// Hide loading indicator
function hideLoading() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.classList.remove('active');
}

// Show error message
function showError() {
    const errorMessage = document.getElementById('errorMessage');
    const albumsGrid = document.getElementById('albumsGrid');
    const tracksGrid = document.getElementById('tracksGrid');

    errorMessage.style.display = 'block';
    albumsGrid.innerHTML = '';
    tracksGrid.innerHTML = '';
}

// Newsletter form submission
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.email-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('.email-input');
            const email = emailInput.value.trim();

            if (email) {
                // Show success message (you can integrate with your backend here)
                alert('Thank you for subscribing! You will receive the latest music news and reviews.');
                emailInput.value = '';
            }
        });
    }
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy loading for images (optional enhancement)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Auto-refresh feeds every 5 minutes (optional)
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

setInterval(() => {
    console.log('Auto-refreshing news feeds...');
    albumsData = [];
    tracksData = [];
    loadRSSFeeds();
}, AUTO_REFRESH_INTERVAL);
