// clean-chatbot.js - A brand new implementation of the chatbot
(function() {
    // Self-contained module to avoid variable conflicts
    console.log('Clean Chatbot: Initializing');
    
    // Store chatbot data
    let qaData = {
        "fallback": "I don't have an answer for that right now. Please try again later or contact our support team.",
        "who is dan": "Dan is the owner and founder of our company. He has extensive experience in EMF protection and is passionate about helping people live healthier lives.",
        "where can i see a demo": "If you are near Barrie Ontario, just walk into our Kangen store on Dunlop and Hwy 400, or call us at 416-918-0473."
    };
    
    // Function to load chatbot data
    function loadData() {
        console.log('Clean Chatbot: Loading data');
        
        const url = 'chatbot-qa.json?v=' + new Date().getTime();
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load data: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Clean Chatbot: Data loaded successfully');
                qaData = Object.assign(qaData, data);
            })
            .catch(error => {
                console.error('Clean Chatbot: Error loading data', error);
                // Continue with fallback data
            });
    }
    
    // Function to find best answer
    function findAnswer(question) {
        const normalizedQuestion = question.toLowerCase().replace(/[^\w\s]/g, '').trim();
        
        // Special case handling
        if (normalizedQuestion.includes('dan')) {
            return qaData["who is dan"];
        }
        
        if (normalizedQuestion.includes('demo') || 
            normalizedQuestion.includes('store') || 
            normalizedQuestion.includes('location')) {
            return qaData["where can i see a demo"];
        }
        
        // Direct match
        if (qaData[normalizedQuestion]) {
            return qaData[normalizedQuestion];
        }
        
        // Fall back
        return qaData.fallback;
    }
    
    // Function to send a message
    function sendMessage() {
        const input = document.querySelector('.chat-input input');
        const messages = document.querySelector('.chat-messages');
        
        if (!input || !messages) {
            console.error('Clean Chatbot: Cannot find chat elements');
            return;
        }
        
        const message = input.value.trim();
        if (message === '') return;
        
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.textContent = message;
        messages.appendChild(userMessage);
        
        // Clear input
        input.value = '';
        
        // Get bot response
        const response = findAnswer(message);
        
        // Add bot response
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.textContent = response;
            messages.appendChild(botMessage);
            
            // Scroll to bottom
            messages.scrollTop = messages.scrollHeight;
        }, 500);
        
        // Scroll to bottom
        messages.scrollTop = messages.scrollHeight;
    }
    
    // Function to set up chat interface
    function setupInterface() {
        console.log('Clean Chatbot: Setting up interface');
        
        // Debug all possible chat elements
        console.log('All possible chat toggles:', document.querySelectorAll('.chat-toggle, .chat-button, [class*="chat"]'));
        console.log('All containers:', document.querySelectorAll('.chat-container, .chat-panel, [class*="chat"]'));
        
        const chatToggle = document.querySelector('.chat-toggle');
        const chatContainer = document.querySelector('.chat-container');
        const chatInput = document.querySelector('.chat-input input');
        const sendButton = document.querySelector('.chat-send-button');
        
        console.log('Clean Chatbot Elements:', {
            toggle: !!chatToggle,
            container: !!chatContainer,
            input: !!chatInput,
            sendButton: !!sendButton
        });
        
        // Try to force chat container to be visible
        if (chatContainer) {
            // Remove all classes and then set to open
            chatContainer.className = 'chat-container';
            chatContainer.style.display = 'block';
            chatContainer.style.opacity = '1';
            chatContainer.style.visibility = 'visible';
            chatContainer.style.zIndex = '9999';
            
            // Add after a delay to override any conflicting code
            setTimeout(() => {
                chatContainer.classList.add('open');
                console.log('Forced chat container to open state');
            }, 500);
        }
        
        // Set up toggle
        if (chatToggle && chatContainer) {
            // Remove all existing event listeners by cloning the element
            const newToggle = chatToggle.cloneNode(true);
            chatToggle.parentNode.replaceChild(newToggle, chatToggle);
            
            // Add our own handler to the new element
            newToggle.onclick = function() {
                console.log('Clean Chatbot: Toggle clicked');
                // Force visibility
                chatContainer.style.display = 'block';
                chatContainer.style.visibility = 'visible';
                chatContainer.classList.toggle('open');
            };
            
            // Add a highly visible style to the toggle button
            newToggle.style.boxShadow = '0 0 10px red';
            newToggle.style.transform = 'scale(1.1)';
            console.log('Enhanced chat toggle button for visibility');
        }
        
        // Set up input handler
        if (chatInput) {
            chatInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }
        
        // Set up send button
        if (sendButton) {
            sendButton.onclick = sendMessage;
        }
    }
    
    // Initialize chatbot
    function init() {
        console.log('Clean Chatbot: Initializing');
        loadData();
        setupInterface();
        
        // Create a backup button if needed
        setTimeout(createBackupChatButton, 3000);
    }
    
    // Create a backup chat button in case the original one is not working
    function createBackupChatButton() {
        const existingToggle = document.querySelector('.chat-toggle, .chat-button');
        const chatContainer = document.querySelector('.chat-container');
        
        if (!existingToggle || !chatContainer) {
            console.log('Creating backup chat button');
            
            // Create a new button
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
            backupButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
            
            // Add click handler
            backupButton.onclick = function() {
                if (chatContainer) {
                    chatContainer.style.display = 'block';
                    chatContainer.style.visibility = 'visible';
                    chatContainer.classList.toggle('open');
                } else {
                    alert('Chat is not available right now. Please try again later.');
                }
            };
            
            // Add to document
            document.body.appendChild(backupButton);
        }
    }
    
    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Backup initialization
    window.addEventListener('load', init);
    setTimeout(init, 2000);
})(); 