// simple-chat.js - Ultra simple chatbot implementation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple Chat: Initializing');
    
    // Find chat elements
    const chatButton = document.querySelector('.chat-button, .chat-toggle');
    const chatContainer = document.querySelector('.chat-container');
    
    // Log what we find
    console.log('Chat elements found:', {
        button: chatButton,
        container: chatContainer
    });
    
    // If chat elements found, set up toggle functionality
    if (chatButton && chatContainer) {
        // Remove any existing click handlers
        const newButton = chatButton.cloneNode(true);
        chatButton.parentNode.replaceChild(newButton, chatButton);
        
        // Make the button more visible
        newButton.style.boxShadow = '0 0 15px red';
        
        // Add new click handler
        newButton.addEventListener('click', function() {
            console.log('Chat button clicked');
            chatContainer.classList.toggle('open');
            chatContainer.style.display = chatContainer.classList.contains('open') ? 'block' : 'none';
        });
        
        // Add close button handler if it exists
        const closeButton = document.querySelector('.chat-close');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                chatContainer.classList.remove('open');
                chatContainer.style.display = 'none';
            });
        }
        
        // Add input handler
        const chatInput = document.querySelector('.chat-input input');
        const sendButton = document.querySelector('.chat-send-button');
        
        function sendMessage() {
            if (!chatInput) return;
            
            const message = chatInput.value.trim();
            if (message === '') return;
            
            const chatMessages = document.querySelector('.chat-messages');
            if (!chatMessages) return;
            
            // Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'message user-message';
            userMsg.textContent = message;
            chatMessages.appendChild(userMsg);
            
            // Clear input
            chatInput.value = '';
            
            // Add bot message
            setTimeout(function() {
                const botMsg = document.createElement('div');
                botMsg.className = 'message bot-message';
                
                // Simple responses
                if (message.toLowerCase().includes('dan')) {
                    botMsg.textContent = "Dan is our founder and expert on EMF protection.";
                } else if (message.toLowerCase().includes('demo') || message.toLowerCase().includes('location')) {
                    botMsg.textContent = "If you are near Barrie Ontario, just walk into our Kangen store on Dunlop and Hwy 400, or call us at 416-918-0473.";
                } else {
                    botMsg.textContent = "Thank you for your message. How else can I help you with emGuarde?";
                }
                
                chatMessages.appendChild(botMsg);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 500);
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Add enter key handler
        if (chatInput) {
            chatInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }
        
        // Add send button handler
        if (sendButton) {
            sendButton.addEventListener('click', sendMessage);
        }
    } else {
        console.error('Simple Chat: Critical elements not found!');
        
        // Create a backup chat button
        const backupButton = document.createElement('button');
        backupButton.textContent = 'Chat with Us';
        backupButton.style.position = 'fixed';
        backupButton.style.bottom = '20px';
        backupButton.style.right = '20px';
        backupButton.style.zIndex = '10000';
        backupButton.style.padding = '10px 20px';
        backupButton.style.backgroundColor = '#4CAF50';
        backupButton.style.color = 'white';
        backupButton.style.border = 'none';
        backupButton.style.borderRadius = '5px';
        backupButton.style.cursor = 'pointer';
        
        // Add to page
        document.body.appendChild(backupButton);
        
        // Add click handler
        backupButton.addEventListener('click', function() {
            alert('Chat functionality is currently unavailable. Please contact us at 416-918-0473.');
        });
    }
}); 