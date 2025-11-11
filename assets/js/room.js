import { isAuthenticated, getCurrentUser } from './auth.js';

const expandBtn = document.getElementById('expandBtn');
const video = document.getElementById('movie');
const chatToggle = document.getElementById('chatToggle');
const chatBox = document.getElementById('chatBox');
const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const backBtn = document.getElementById('backBtn');

// Load movies and get current playing movie
let movies = [];
let currentMovie = null;

// Function to determine which movie is currently playing
function getCurrentPlayingMovie() {
  const now = new Date();
  const currentHour = now.getHours();
  const timeSlotIndex = Math.floor(currentHour / 2); // Every 2 hours

  if (movies.length === 0) {
    return null;
  }

  // Get movie based on time slot (cycles through all movies)
  const movieIndex = timeSlotIndex % movies.length;
  return movies[movieIndex];
}

// Load movies from JSON and initialize video
async function loadMoviesAndInitializeVideo() {
  try {
    const response = await fetch('movies.json');
    movies = await response.json();

    currentMovie = getCurrentPlayingMovie();

    if (!currentMovie || !currentMovie.streamUrl) {
      console.error('No movie stream available');
      return;
    }

    const videoSrc = currentMovie.streamUrl;
    console.log(`Now playing: ${currentMovie.title}`);
    console.log(`Stream URL: ${videoSrc}`);

    // Initialize HLS.js for video streaming
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(videoSrc);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        console.log('Video loaded successfully');
        // Video will autoplay due to autoplay attribute in HTML
      });

      hls.on(Hls.Events.ERROR, function(event, data) {
        if (data.fatal) {
          switch(data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Network error, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Media error, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              console.error('Fatal error, cannot recover');
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari which has native HLS support
      video.src = videoSrc;
    }

  } catch (error) {
    console.error('Error loading movies:', error);
  }
}

// Initialize video when page loads
loadMoviesAndInitializeVideo();

// Open/close chat
chatToggle.addEventListener('click', () => {
  if (!isAuthenticated()) {
    showNotification('Please login to use chat feature!', 'info');
    return;
  }
  chatBox.classList.toggle('hidden');
});

// Send message function
function sendMessage() {
  if (!isAuthenticated()) {
    showNotification('Please login to send messages!', 'info');
    return;
  }

  const message = chatInput.value.trim();
  if (message) {
    const user = getCurrentUser();
    const displayName = user?.firstName || user?.username || 'Anonymous';
    
    const p = document.createElement('p');
    p.innerHTML = `<strong>${displayName}:</strong> ${message}`;
    chatMessages.appendChild(p);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// Send message when clicking Send button
sendBtn.addEventListener('click', sendMessage);

// Send message when pressing Enter
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Back button - go to previous page
backBtn.addEventListener('click', () => {
  window.history.back();
});
