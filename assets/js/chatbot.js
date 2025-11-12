document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');

    let products = [];
    let conversationContext = {
        lastTopic: null,
        userName: null,
        recommendedProducts: []
    };

    // Load products
    async function loadProducts() {
        try {
            const response = await fetch('product.json');
            products = await response.json();
            console.log('✅ Loaded', products.length, 'products for chatbot');
        } catch (error) {
            console.error('❌ Error loading products:', error);
            products = [];
        }
    }

    loadProducts();

    // Toggle chatbot window
    chatbotToggle.addEventListener('click', function() {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active') && chatbotMessages.children.length === 0) {
            // Welcome message
            setTimeout(() => {
                addMessage('👋 Hello! I\'m OLDIE Assistant. How can I help you today?\n\n💡 You can ask me about:\n• Product recommendations\n• VHS tapes, CDs, Vinyl records\n• Cameras and accessories\n• Prices and availability\n• Movie screenings', 'bot');
            }, 300);
        }
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
            addMessage(message, 'user');
            chatbotInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Process message and get bot response
            setTimeout(() => {
                hideTypingIndicator();
                const response = getBotResponse(message);
                addMessage(response, 'bot');
            }, 1000 + Math.random() * 1000);
        }
    }

    function getBotResponse(userMessage) {
        const msg = userMessage.toLowerCase();

        // Greeting
        if (msg.match(/^(hi|hello|hey|chào|xin chào)/i)) {
            conversationContext.userName = extractName(userMessage);
            return `Hello${conversationContext.userName ? ' ' + conversationContext.userName : ''}! 👋 Welcome to OLDIE Zone!\n\nI can help you find:\n🎬 VHS tapes & movies\n🎵 Vinyl records & CDs\n📷 Retro cameras\n🎧 Audio accessories\n\nWhat are you looking for today?`;
        }

        // VHS/Movie related
        if (msg.includes('vhs') || msg.includes('tape') || msg.includes('movie') || msg.includes('film')) {
            conversationContext.lastTopic = 'vhs';
            const vhsProducts = products.filter(p => p.category === 'VHS' || p.subcategory === 'VHS');
            if (vhsProducts.length > 0) {
                const samples = vhsProducts.slice(0, 3);
                conversationContext.recommendedProducts = samples;
                return `🎬 Great choice! We have ${vhsProducts.length}+ VHS tapes!\n\nHere are some popular ones:\n\n${samples.map((p, i) => `${i + 1}. ${p.name}\n   💰 ${p.price}\n   ${p.is_available ? '✅ In stock' : '❌ Out of stock'}`).join('\n\n')}\n\n🔗 Check all VHS tapes at: vhs-products.html\n\nWant to know more about any of these?`;
            }
            return '🎬 We have an amazing collection of VHS tapes! Visit our VHS section to explore classic movies from the 80s and 90s!';
        }

        // CD related
        if (msg.includes('cd') || msg.includes('album') || (msg.includes('music') && !msg.includes('vinyl'))) {
            conversationContext.lastTopic = 'cd';
            const cdProducts = products.filter(p => p.subcategory === 'CD');
            if (cdProducts.length > 0) {
                const samples = cdProducts.slice(0, 3);
                conversationContext.recommendedProducts = samples;
                return `🎵 Awesome! We have ${cdProducts.length}+ CDs in stock!\n\nFeatured albums:\n\n${samples.map((p, i) => `${i + 1}. ${p.name}\n   💰 ${p.price}\n   ${p.is_available ? '✅ Available' : '❌ Sold out'}`).join('\n\n')}\n\n🔗 Browse all CDs: audio-cd-products.html\n\nInterested in any of these?`;
            }
            return '🎵 We have amazing CD collections! Check out our Audio section for classic albums!';
        }

        // Vinyl related
        if (msg.includes('vinyl') || msg.includes('record') || msg.includes('lp')) {
            conversationContext.lastTopic = 'vinyl';
            const vinylProducts = products.filter(p => p.subcategory === 'Vinyl');
            if (vinylProducts.length > 0) {
                const samples = vinylProducts.slice(0, 3);
                conversationContext.recommendedProducts = samples;
                return `📀 Excellent taste! We have ${vinylProducts.length}+ vinyl records!\n\nTop picks:\n\n${samples.map((p, i) => `${i + 1}. ${p.name}\n   💰 ${p.price}\n   ${p.is_available ? '✅ In stock' : '❌ Out of stock'}`).join('\n\n')}\n\n🔗 See all vinyl: audio-vinyl-products.html\n\nWant details on any of these?`;
            }
            return '📀 We have premium vinyl records! Visit our Vinyl collection for authentic retro sound!';
        }

        // Camera related
        if (msg.includes('camera') || msg.includes('polaroid') || msg.includes('photo')) {
            conversationContext.lastTopic = 'camera';
            const cameraProducts = products.filter(p => p.category === 'Camera');
            if (cameraProducts.length > 0) {
                const samples = cameraProducts.slice(0, 3);
                conversationContext.recommendedProducts = samples;
                return `📷 Perfect! We have ${cameraProducts.length}+ retro cameras!\n\nBest sellers:\n\n${samples.map((p, i) => `${i + 1}. ${p.name}\n   💰 ${p.price}\n   ${p.is_available ? '✅ Available' : '❌ Sold out'}`).join('\n\n')}\n\n🔗 View all cameras: camera-products.html\n\nNeed help choosing?`;
            }
            return '📷 We have vintage cameras and Polaroids! Check our Camera section!';
        }

        // Accessories
        if (msg.includes('accessory') || msg.includes('accessories') || msg.includes('player') || msg.includes('ipod')) {
            conversationContext.lastTopic = 'accessories';
            const accessoryProducts = products.filter(p => p.category === 'Accessories');
            if (accessoryProducts.length > 0) {
                const samples = accessoryProducts.slice(0, 3);
                return `🎧 We have great accessories!\n\n${samples.map((p, i) => `${i + 1}. ${p.name}\n   💰 ${p.price}`).join('\n\n')}\n\n🔗 See more: accessory-products.html`;
            }
            return '🎧 We have CD players, cassette players, and iPods! Visit our Accessories section!';
        }

        // Price inquiry
        if (msg.includes('price') || msg.includes('cost') || msg.includes('how much') || msg.includes('giá')) {
            if (conversationContext.recommendedProducts.length > 0) {
                const p = conversationContext.recommendedProducts[0];
                return `💰 The ${p.name} costs ${p.price}\n\n${p.is_available ? '✅ Currently in stock!' : '❌ Out of stock currently'}\n\nWant to see similar products?`;
            }
            return '💰 Our prices range from 100,000₫ to 2,500,000₫ depending on the product. What type of product are you interested in?';
        }

        // Availability check
        if (msg.includes('available') || msg.includes('in stock') || msg.includes('còn hàng')) {
            return '📦 Most of our products are in stock! Specific items may vary. Would you like to check a particular product category?\n\n• VHS Tapes\n• CDs & Vinyl\n• Cameras\n• Accessories';
        }

        // Recommendation request
        if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('best') || msg.includes('popular') || msg.includes('tư vấn')) {
            const randomCategory = ['VHS', 'CD', 'Vinyl', 'Camera'][Math.floor(Math.random() * 4)];
            return `🌟 Based on our bestsellers, I recommend checking out our ${randomCategory} collection!\n\n${randomCategory === 'VHS' ? '🎬 VHS tapes are perfect for collectors and nostalgic movie lovers!' : randomCategory === 'CD' ? '🎵 CDs offer great audio quality and are affordable!' : randomCategory === 'Vinyl' ? '📀 Vinyl records provide authentic retro sound experience!' : '📷 Retro cameras are trending and perfect for unique photography!'}\n\nWant to see specific ${randomCategory} products?`;
        }

        // Movies/Screenings
        if (msg.includes('movie') || msg.includes('screening') || msg.includes('watch') || msg.includes('cinema')) {
            return '🎬 Check our Retro Cinema page for movie screenings!\n\n🔗 Visit: retro-cine.html\n\nWe screen classic movies daily. Book your seat now! 🍿';
        }

        // Help/Info
        if (msg.includes('help') || msg.includes('info') || msg.includes('about')) {
            return `ℹ️ OLDIE Zone - Your Retro Entertainment Shop!\n\nWe offer:\n🎬 VHS Tapes & Movies\n🎵 CDs & Vinyl Records\n📷 Vintage Cameras\n🎧 Audio Accessories\n🎪 Movie Screenings\n\n📍 Visit us online or check our store locations!\n\nWhat would you like to explore?`;
        }

        // Thank you
        if (msg.includes('thank') || msg.includes('thanks') || msg.includes('cảm ơn')) {
            return '😊 You\'re welcome! Happy shopping at OLDIE Zone! Feel free to ask if you need anything else! 🎉';
        }

        // Goodbye
        if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('tạm biệt')) {
            return '👋 Goodbye! Come back anytime! Have a nostalgic day! 🎬🎵📷';
        }

        // Default response
        return `🤔 I'm not sure about that, but I can help you with:\n\n• Finding VHS tapes, CDs, or Vinyl records\n• Checking retro cameras\n• Product recommendations\n• Prices and availability\n• Movie screenings\n\nWhat would you like to know?`;
    }

    function extractName(message) {
        const nameMatch = message.match(/(?:i'm|i am|my name is)\s+([a-zA-Z]+)/i);
        return nameMatch ? nameMatch[1] : null;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
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