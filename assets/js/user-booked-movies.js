import { getCurrentUser, getBookedMovies, cancelBookedMovie } from './auth.js';

let currentPage = 0;
const ITEMS_PER_PAGE = 3;

// Load and display booked movies
function loadBookedMovies() {
    const container = document.getElementById('bookedMoviesGrid');
    if (!container) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
        container.innerHTML = `
            <div class="booked-movies-empty">
                <i class="fas fa-user-slash"></i>
                <p>Please login to view your booked movies</p>
                <a href="login.html" class="btn-cine">LOGIN</a>
            </div>
        `;
        return;
    }

    const bookedMovies = getBookedMovies();

    if (!bookedMovies || bookedMovies.length === 0) {
        container.innerHTML = `
            <div class="booked-movies-empty" style="text-align: center; padding: 60px 20px; color: #999; grid-column: 1 / -1;">
                <i class="fas fa-film" style="font-size: 48px; color: rgba(246, 210, 138, 0.3); margin-bottom: 20px; display: block;"></i>
                <p style="font-size: 16px; margin-bottom: 20px;">You haven't booked any movies yet</p>
                <a href="retro-cine.html" class="btn-cine" style="display: inline-block; padding: 10px 24px; background: #f6d28a; color: #3b141c; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; transition: all 0.3s ease;">BROWSE MOVIES</a>
            </div>
        `;
        hideNavigation();
        return;
    }

    // Calculate pagination
    const totalPages = Math.ceil(bookedMovies.length / ITEMS_PER_PAGE);
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentMovies = bookedMovies.slice(startIndex, endIndex);

    // Display current page movies
    container.innerHTML = currentMovies.map((movie, index) => {
        const absoluteIndex = startIndex + index;
        const bookedDate = new Date(movie.bookedAt);
        const formattedDate = bookedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="booked-movie-card">
                <img src="${movie.poster}" alt="${movie.title}" class="booked-movie-poster">
                <div class="booked-movie-body">
                    <div class="booked-movie-header">
                        <h3 class="booked-movie-title">${movie.title}</h3>
                    </div>
                    <div class="booked-movie-showtime">
                        <i class="fas fa-clock"></i> ${movie.showtime}
                    </div>
                    <div class="booked-movie-meta">
                        Booked on ${formattedDate}
                    </div>
                    <button class="booked-movie-cancel" onclick="window.cancelBooking(${absoluteIndex})">
                        Cancel Booking
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Update navigation
    if (bookedMovies.length > ITEMS_PER_PAGE) {
        updateNavigation(totalPages);
    } else {
        hideNavigation();
    }
}

// Update navigation buttons
function updateNavigation(totalPages) {
    const navBar = document.querySelector('[data-nav="booked-movies"]');
    if (!navBar) return;

    navBar.parentElement.style.display = 'flex';

    const prevBtn = navBar.querySelector('[data-action="prev"]');
    const nextBtn = navBar.querySelector('[data-action="next"]');
    const slotButtons = Array.from(navBar.querySelectorAll('[data-index-slot]'));

    // Update prev/next buttons
    if (prevBtn) {
        prevBtn.disabled = currentPage === 0;
        prevBtn.classList.toggle('is-disabled', currentPage === 0);
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages - 1;
        nextBtn.classList.toggle('is-disabled', currentPage >= totalPages - 1);
    }

    // Update page number buttons
    const slotCount = slotButtons.length;
    const blockStart = Math.floor(currentPage / slotCount) * slotCount;

    slotButtons.forEach((btn, idx) => {
        const pageIndex = blockStart + idx;
        if (pageIndex < totalPages) {
            btn.disabled = false;
            btn.classList.remove('is-hidden');
            btn.dataset.pageIndex = String(pageIndex);
            btn.textContent = String(pageIndex + 1);
            btn.classList.toggle('is-active', pageIndex === currentPage);

            if (pageIndex === currentPage) {
                btn.setAttribute('aria-current', 'true');
            } else {
                btn.removeAttribute('aria-current');
            }
        } else {
            btn.disabled = true;
            btn.classList.add('is-hidden');
            btn.textContent = '';
        }
    });
}

// Hide navigation
function hideNavigation() {
    const navBar = document.querySelector('[data-nav="booked-movies"]');
    if (navBar) {
        navBar.parentElement.style.display = 'none';
    }
}

// Cancel booking function
window.cancelBooking = function(index) {
    const bookedMovies = getBookedMovies();
    const movie = bookedMovies[index];
    
    showConfirmModal({
        title: 'Cancel Booking',
        message: `Are you sure you want to cancel your booking for "${movie.title}"?`,
        confirmText: 'Yes, Cancel',
        cancelText: 'No, Keep It',
        type: 'danger',
        onConfirm: () => {
            const success = cancelBookedMovie(index);
            if (success) {
                // Adjust current page if needed
                const remainingMovies = getBookedMovies();
                const totalPages = Math.ceil(remainingMovies.length / ITEMS_PER_PAGE);
                if (currentPage >= totalPages && currentPage > 0) {
                    currentPage--;
                }
                loadBookedMovies();
                
                // Show success notification
                if (typeof showNotification === 'function') {
                    showNotification(`Cancelled booking for "${movie.title}"`, 'success');
                }
            } else {
                if (typeof showNotification === 'function') {
                    showNotification('Failed to cancel booking. Please try again.', 'error');
                }
            }
        }
    });
};

// Setup navigation
function setupNavigation() {
    const navBar = document.querySelector('[data-nav="booked-movies"]');
    if (!navBar) return;

    const prevBtn = navBar.querySelector('[data-action="prev"]');
    const nextBtn = navBar.querySelector('[data-action="next"]');
    const slotButtons = Array.from(navBar.querySelectorAll('[data-index-slot]'));

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                loadBookedMovies();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const bookedMovies = getBookedMovies();
            const totalPages = Math.ceil(bookedMovies.length / ITEMS_PER_PAGE);
            if (currentPage < totalPages - 1) {
                currentPage++;
                loadBookedMovies();
            }
        });
    }

    slotButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pageIndex = parseInt(btn.dataset.pageIndex);
            if (!isNaN(pageIndex)) {
                currentPage = pageIndex;
                loadBookedMovies();
            }
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadBookedMovies();
    setupNavigation();
});
