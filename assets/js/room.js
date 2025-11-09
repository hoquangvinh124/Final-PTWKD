import { isAuthenticated, getCurrentUser } from './auth.js';

const expandBtn = document.getElementById('expandBtn');
const video = document.getElementById('movie');
const chatToggle = document.getElementById('chatToggle');
const chatBox = document.getElementById('chatBox');
const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

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
