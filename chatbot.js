document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');

    // Toggle chatbot window
    chatbotToggle.addEventListener('click', function() {
        chatbotWindow.classList.toggle('active');
    });

    // Close chatbot window
    chatbotClose.addEventListener('click', function() {
        chatbotWindow.classList.remove('active');
    });

    // Send message
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            chatbotInput.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                addMessage('I received your message: ' + message, 'bot');
            }, 1000);
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});
function addMessage(text, sender) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message-container ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = `avatar ${sender}`;
    avatar.textContent = sender === 'user' ? 'U' : 'B';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    // Tự động thêm class theo độ dài tin nhắn
    if (text.length > 100) {
        messageDiv.classList.add('very-long');
    } else if (text.length > 50) {
        messageDiv.classList.add('long');
    }
    
    messageDiv.textContent = text;
    
    const timestamp = document.createElement('div');
    timestamp.className = 'timestamp';
    timestamp.textContent = getCurrentTime();
    
    messageDiv.appendChild(timestamp);
    messageContainer.appendChild(avatar);
    messageContainer.appendChild(messageDiv);
    
    chatbotMessages.appendChild(messageContainer);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0');
}