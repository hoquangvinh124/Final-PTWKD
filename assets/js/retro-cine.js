import { isAuthenticated, addBookedMovie, getCurrentUser } from './auth.js';

document.querySelectorAll('.poster-row').forEach(row => {
  const cloneContent = row.innerHTML;
  row.innerHTML += cloneContent;
});

// Movie list - Load from JSON
let movies = [];

// Fetch movies from JSON file
async function loadMovies() {
  try {
    const response = await fetch('movies.json');
    const data = await response.json();
    movies = data;
    // Initialize the page after movies are loaded
    initializePage();
  } catch (error) {
    console.error('Error loading movies:', error);
    // Fallback to empty array if loading fails
    movies = [];
  }
}

// Initialize page after movies are loaded
function initializePage() {
  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7;
  weekButtons[todayIndex].classList.add("active");
  displaySchedule(todayIndex);
  renderNowNext();
  scheduleAutoUpdate();
}

const scheduleDiv = document.getElementById("schedule");
const weekButtons = document.querySelectorAll("#weekBar button");
const datePicker = document.getElementById("datePicker");

// Movie screening time slots
const showtimes = [];
for (let hour = 0; hour < 24; hour += 2) {
  const h = String(hour).padStart(2, "0");
  showtimes.push(`${h}:00`);
}

// Daily screening schedule
function displaySchedule(dayIndex) {
  scheduleDiv.innerHTML = "";
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  showtimes.forEach((time, i) => {
    const movie = movies[i % movies.length];
    const startMinutes = toMinutes(time);
    const endMinutes = (startMinutes + 120) % (24 * 60);
    const endTime = getEndTime(time);

    // Check if current movie is playing
    let isNowPlaying = false;
    if (startMinutes < endMinutes) {
      isNowPlaying = currentMinutes >= startMinutes && currentMinutes < endMinutes;
    } else {
      // Case crossing midnight (e.g. 22:00 - 00:00)
      isNowPlaying = currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }

    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>${time} - ${endTime}</p>
      <button class="book-btn ${isNowPlaying ? 'watch-now' : ''}">
        ${isNowPlaying ? "WATCH NOW" : "BOOK NOW"}
      </button>
    `;
    scheduleDiv.appendChild(card);

    const button = card.querySelector(".book-btn");
    if (button.textContent.trim() === "WATCH NOW") {
      button.addEventListener("click", () => {
        if (!isAuthenticated()) {
          showNotification('Please login to watch movies!', 'info');
          return;
        }
        window.location.href = "room.html";
      });
    } else {
      button.addEventListener("click", () => {
        showBookingModal(movie, `${time} - ${endTime}`);
      });
    }
  });
}

setInterval(() => {
  const activeBtn = document.querySelector(".week-bar button.active");
  if (activeBtn) displaySchedule(activeBtn.dataset.day);
}, 60 * 1000); // update every minute


function getEndTime(start) {
  const [h, m] = start.split(":").map(Number);
  const endH = (h + 2) % 24;
  return `${String(endH).padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

weekButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    weekButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    displaySchedule(btn.dataset.day);
  });
});

datePicker.addEventListener("change", () => {
  const date = new Date(datePicker.value);
  const day = (date.getDay() + 6) % 7;
  weekButtons[day].click();
});

// Removed - now handled in initializePage() after movies are loaded

// Now & Next movie section
function toMinutes(hm) {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + (m || 0);
}

function renderNowNext() {
  const now = new Date();
  const curMin = now.getHours() * 60 + now.getMinutes();

  const scheduleList = showtimes.map((t, i) => ({
    index: i,
    start: toMinutes(t),
    end: (toMinutes(t) + 120) % (24 * 60),
    movie: movies[i % movies.length],
    timeLabel: `${t} - ${getEndTime(t)}`
  }));

  let currentSlot = null;
  for (let i = 0; i < scheduleList.length; i++) 
    {
        const s = scheduleList[i];
        if (s.start <= s.start + 120) 
            {
                if (s.start <= curMin && curMin < s.start + 120) 
                    {
                        currentSlot = s; break;
                }
        }
  }

  if (!currentSlot) 
    {
        const idx = Math.floor(now.getHours() / 2) % scheduleList.length;
        currentSlot = scheduleList[idx];
  }

  const nextSlot = scheduleList[(currentSlot.index + 1) % scheduleList.length];
  const currentBox = document.getElementById('currentBox');
  const nextBox = document.getElementById('nextBox');

  function renderBox(container, slot, overlayText) 
  {
    const m = slot.movie;
    container.innerHTML = `
      <div class="poster-wrap" role="button" tabindex="0">
        <img src="${m.poster}" alt="${m.title} poster">
        <div class="overlay">${overlayText}</div>
      </div>
      <div class="info">
        <h3>${m.title}</h3>
        <div class="time">${slot.timeLabel}</div>
        <div class="detail">
            <span class="label">Year:</span> <span>${m.year}</span>
        </div>
        <div class="detail">
            <span class="label">Director:</span> <span>${m.director}</span>
        </div>

        <p class="description">${m.description}</p>
      </div>
    `;

    const posterWrap = container.querySelector('.poster-wrap');
    posterWrap.addEventListener('click', () => {
      if (overlayText === 'WATCH NOW') {
        if (!isAuthenticated()) {
          showNotification('Please login to watch movies!', 'info');
          return;
        }
        window.location.href = 'room.html';
      } else if (overlayText === 'BOOK NOW') {
        showBookingModal(slot.movie, slot.timeLabel);
      }
    });
    posterWrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ')
        {
            e.preventDefault();
            if (overlayText === 'WATCH NOW') {
              if (!isAuthenticated()) {
                showNotification('Please login to watch movies!', 'info');
                return;
              }
              window.location.href = 'room.html';
            } else if (overlayText === 'BOOK NOW') {
              showBookingModal(slot.movie, slot.timeLabel);
            }
      }
    });
  }

  renderBox(currentBox, currentSlot, 'WATCH NOW');
  renderBox(nextBox, nextSlot, 'BOOK NOW');
}

// Booking Modal Functions
let currentBookingData = null;

function showBookingModal(movie, showtime) {
  if (!isAuthenticated()) {
    showNotification('Please login to book movie tickets!', 'info');
    return;
  }

  const modal = document.getElementById('bookingModal');
  const movieTitleSpan = document.getElementById('movieTitle');
  const movieShowtimeSpan = document.getElementById('movieShowtime');

  movieTitleSpan.textContent = movie.title;
  movieShowtimeSpan.textContent = showtime;

  currentBookingData = {
    title: movie.title,
    poster: movie.poster,
    year: movie.year,
    director: movie.director,
    description: movie.description,
    showtime: showtime
  };

  modal.classList.add('active');
}

function hideBookingModal() {
  const modal = document.getElementById('bookingModal');
  modal.classList.remove('active');
  currentBookingData = null;
}

/**
 * Send booking confirmation email to customer
 */
async function sendBookingConfirmationEmail(customerEmail, screeningData) {
  try {
    const response = await fetch(' https://b3ct0lx849.execute-api.ap-southeast-2.amazonaws.com/default/Booking-Confirmation', {
      method: 'POST',
      headers: {
        'x-api-key': 'oldiezone',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer_email: customerEmail,
        screening_data: screeningData
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Booking confirmation email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    return false;
  }
}

async function confirmBooking() {
  if (!currentBookingData) return;

  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.email) {
    showNotification('Unable to get user email. Please ensure you are logged in.', 'error');
    return;
  }

  // Add booking to user's booked movies
  const success = addBookedMovie(currentBookingData);

  if (success) {
    // Show success notification immediately
    showNotification(`Successfully booked "${currentBookingData.title}"! Showtime: ${currentBookingData.showtime}`, 'success');
    
    // Prepare screening data for email (send silently in background)
    const screeningData = {
      customer_name: currentUser.firstName || currentUser.username || 'Valued Customer',
      poster_url: currentBookingData.poster,
      movie_title: currentBookingData.title,
      screening_time_range: currentBookingData.showtime
    };

    // Send booking confirmation email in background (no notification)
    sendBookingConfirmationEmail(currentUser.email, screeningData).catch(error => {
      console.error('Email sending failed:', error);
      // Silently fail - user already got success notification
    });

    hideBookingModal();
  } else {
    showNotification('Failed to book movie. Please try again.', 'error');
  }
}

// Modal event listeners
document.getElementById('confirmBooking').addEventListener('click', confirmBooking);
document.getElementById('cancelBooking').addEventListener('click', hideBookingModal);

// Close modal when clicking outside
document.getElementById('bookingModal').addEventListener('click', (e) => {
  if (e.target.id === 'bookingModal') {
    hideBookingModal();
  }
});

// Schedule auto update function
function scheduleAutoUpdate() {
  const now = new Date();
  const nextCheck = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 2);
  const delay = nextCheck - now;
  setTimeout(() => {
    renderNowNext();
    setInterval(renderNowNext, 60 * 1000);
  }, delay);
}

// Load movies and initialize the page
loadMovies();
