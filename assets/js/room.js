import { isAuthenticated, getCurrentUser } from './auth.js';

const expandBtn = document.getElementById('expandBtn');
const video = document.getElementById('movie');
const chatToggle = document.getElementById('chatToggle');
const chatBox = document.getElementById('chatBox');
const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const backBtn = document.getElementById('backBtn');

// Initialize HLS.js for video streaming
const videoSrc = 'https://d38fd6uu3uo59n.cloudfront.net/NSFW/titanic/master.m3u8';

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
