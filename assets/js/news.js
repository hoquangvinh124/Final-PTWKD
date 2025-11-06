// RSS Feed URLs Configuration
const RSS_FEEDS = {
    // Rhythm Feed - Music
    'pitchfork-albums': {
        url: 'https://pitchfork.com/feed/feed-album-reviews/rss',
        category: 'Rhythm Feed',
        type: 'Album Review',
        icon: 'fa-compact-disc'
    },
    'pitchfork-tracks': {
        url: 'https://pitchfork.com/feed/feed-track-reviews/rss',
        category: 'Rhythm Feed',
        type: 'Track Review',
        icon: 'fa-headphones'
    },

    // Life through the Lens - Photography
    'emulsive': {
        url: 'https://emulsive.org/feed',
        category: 'Life through the Lens',
        type: 'Photography',
        icon: 'fa-film'
    },
    'analog-cafe': {
        url: 'https://analog.cafe/rss',
        category: 'Life through the Lens',
        type: 'Analog Story',
        icon: 'fa-coffee'
    },

    // Movie Time
    'denofgeek': {
        url: 'https://www.denofgeek.com/feed/',
        category: 'Movie Time',
        type: 'Entertainment',
        icon: 'fa-glasses'
    }
};

// RSS to JSON API (free CORS proxy for RSS feeds)
const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';

// State management
let currentFeed = 'pitchfork-albums';
let feedsCache = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    loadCurrentFeed();
});

// Initialize sidebar navigation
function initializeSidebar() {
    const feedButtons = document.querySelectorAll('.feed-btn');

    feedButtons.forEach(button => {
        button.addEventListener('click', function() {
            const feedId = this.getAttribute('data-feed');
            switchFeed(feedId);
        });
    });
}

// Switch between feeds
function switchFeed(feedId) {
    if (feedId === currentFeed) return;

    currentFeed = feedId;

    // Update active button
    document.querySelectorAll('.feed-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-feed="${feedId}"]`).classList.add('active');

    // Load feed
    loadCurrentFeed();
}

// Load current feed
async function loadCurrentFeed() {
    const feedConfig = RSS_FEEDS[currentFeed];

    if (!feedConfig) {
        console.error('Feed configuration not found:', currentFeed);
        showError();
        return;
    }

    // Check cache first
    if (feedsCache[currentFeed]) {
        displayNews(feedsCache[currentFeed], feedConfig);
        return;
    }

    showLoading();

    try {
        const data = await fetchRSS(feedConfig.url);
        feedsCache[currentFeed] = data;
        displayNews(data, feedConfig);
        hideLoading();
    } catch (error) {
        console.error('Error loading feed:', error);
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
async function displayNews(items, feedConfig) {
    const grid = document.getElementById('newsGrid');
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.style.display = 'none';

    if (!items || items.length === 0) {
        grid.innerHTML = `
            <div class="error-message" style="display: block; margin: 40px auto;">
                <i class="fas fa-newspaper"></i>
                <h3>No stories found</h3>
                <p>There are currently no stories to display for this feed.</p>
            </div>
        `;
        return;
    }

    // Create HTML content but keep it hidden
    grid.innerHTML = items.map(item => createNewsCard(item, feedConfig)).join('');
    grid.style.opacity = '0';

    // Pre-load all images before showing content
    await preloadAllImages(grid);

    // Show grid with smooth fade-in after all images loaded
    grid.style.transition = 'opacity 0.5s ease';
    grid.style.opacity = '1';

    // Add click handlers to news cards
    addNewsCardClickHandlers();
}

// Pre-load all images in the grid
function preloadAllImages(container) {
    const images = container.querySelectorAll('img');

    const imagePromises = Array.from(images).map(img => {
        return new Promise((resolve, reject) => {
            // If image is already loaded
            if (img.complete) {
                resolve();
                return;
            }

            // Wait for image to load
            img.onload = () => resolve();
            img.onerror = () => {
                // Even if image fails, resolve to not block everything
                console.warn('Failed to load image:', img.src);
                resolve();
            };

            // Timeout after 10 seconds
            setTimeout(() => {
                console.warn('Image load timeout:', img.src);
                resolve();
            }, 10000);
        });
    });

    return Promise.all(imagePromises);
}

// Create a news card HTML
function createNewsCard(item, feedConfig) {
    const title = item.title || 'Untitled';
    const description = item.description ? stripHTML(item.description) : 'No description available';
    const link = item.link || '#';
    const pubDate = item.pubDate ? formatDate(item.pubDate) : 'Unknown date';
    const author = item.author || getSourceName(currentFeed);

    // Extract image from content or use thumbnail
    let imageUrl = item.thumbnail ||
                   item.enclosure?.link ||
                   extractImageFromContent(item.content || item.description);

    // Fallback image if no image found
    if (!imageUrl) {
        imageUrl = getFallbackImage(currentFeed);
    }

    const badgeType = feedConfig.type;
    const sourceName = getSourceName(currentFeed);

    return `
        <article class="news-card" data-url="${link}">
            <div class="news-card-image">
                <img src="${imageUrl}"
                     alt="${escapeHTML(title)}"
                     decoding="async"
                     onerror="this.src='${getFallbackImage(currentFeed)}'">
                <span class="news-badge">${badgeType}</span>
            </div>
            <div class="news-card-content">
                <h3 class="news-card-title">${escapeHTML(title)}</h3>
                <div class="news-card-meta">
                    <span><i class="fas fa-newspaper"></i> ${sourceName}</span>
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

// Get source name based on feed ID
function getSourceName(feedId) {
    const sourceNames = {
        'pitchfork-albums': 'Pitchfork',
        'pitchfork-tracks': 'Pitchfork',
        'emulsive': 'Emulsive',
        'analog-cafe': 'Analog Cafe',
        'denofgeek': 'Den of Geek'
    };
    return sourceNames[feedId] || 'Unknown Source';
}

// Get fallback image based on feed category
function getFallbackImage(feedId) {
    const fallbackImages = {
        'pitchfork-albums': 'assets/images/cd.gif',
        'pitchfork-tracks': 'assets/images/cassette-home.gif',
        'emulsive': 'assets/images/pola.png',
        'analog-cafe': 'assets/images/polaroid.png',
        'denofgeek': 'assets/images/VHS-NOISE.jpg'
    };
    return fallbackImages[feedId] || 'assets/images/cd.gif';
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
    const text = tmp.textContent || tmp.innerText || '';
    // Limit to 200 characters for description
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
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
    const newsGrid = document.getElementById('newsGrid');

    loadingIndicator.style.display = 'block';
    errorMessage.style.display = 'none';
    newsGrid.innerHTML = '';
}

// Hide loading indicator
function hideLoading() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'none';
}

// Show error message
function showError() {
    const errorMessage = document.getElementById('errorMessage');
    const newsGrid = document.getElementById('newsGrid');

    errorMessage.style.display = 'block';
    newsGrid.innerHTML = '';
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
                alert('Thank you for subscribing! You will receive the latest news and stories.');
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
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Auto-refresh feeds every 10 minutes (optional)
const AUTO_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

setInterval(() => {
    console.log('Auto-refreshing news feeds...');
    // Clear cache for current feed
    delete feedsCache[currentFeed];
    loadCurrentFeed();
}, AUTO_REFRESH_INTERVAL);

// Keyboard navigation for sidebar
document.addEventListener('keydown', function(e) {
    const feedButtons = Array.from(document.querySelectorAll('.feed-btn'));
    const currentIndex = feedButtons.findIndex(btn => btn.classList.contains('active'));

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();

        let newIndex;
        if (e.key === 'ArrowDown') {
            newIndex = (currentIndex + 1) % feedButtons.length;
        } else {
            newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = feedButtons.length - 1;
        }

        feedButtons[newIndex].click();
        feedButtons[newIndex].focus();
    }
});
