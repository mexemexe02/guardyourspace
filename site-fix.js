// site-fix.js - Complete fixes for chatbot and webform
(function() {
    console.log('Site Fixes: Initializing');
    
    // ===== CONTACT FORM FIX =====
    function fixContactForm() {
        console.log('Fixing contact form');
        
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) {
            console.warn('Contact form not found');
            return;
        }
        
        // Make sure the access key is present
        let accessKeyInput = contactForm.querySelector('input[name="access_key"]');
        if (!accessKeyInput) {
            console.log('Creating access key input');
            accessKeyInput = document.createElement('input');
            accessKeyInput.type = 'hidden';
            accessKeyInput.name = 'access_key';
            contactForm.appendChild(accessKeyInput);
        }
        
        // Set the access key value (using default if CONFIG is unavailable)
        const accessKey = (window.CONFIG && CONFIG.WEB3FORMS_KEY) ? 
                          CONFIG.WEB3FORMS_KEY : 
                          'f115e690-e290-47ea-9449-c63fa95720b1';
        accessKeyInput.value = accessKey;
        
        // Add proper form submission handler
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submission intercepted');
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (!submitButton) return;
            
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = 'Sending...';
            submitButton.disabled = true;
            
            // Create FormData object
            const formData = new FormData(contactForm);
            
            // Debug the form data being sent
            console.log('Form data being submitted:');
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            
            // Submit the form using fetch API
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Form submission failed: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Form submitted successfully:', data);
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Form submission error:', error);
                alert('There was a problem submitting the form. Please try again later.');
            })
            .finally(() => {
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            });
        });
        
        console.log('Contact form fixed');
    }
    
    // ===== CHATBOT FIX =====
    function fixChatbot() {
        console.log('Fixing chatbot');
        
        // Find the chat elements using multiple selectors
        const chatToggle = document.querySelector('.chat-toggle, .chat-button, [class*="chat-button"], [class*="chat-toggle"]');
        const chatContainer = document.querySelector('.chat-container, .chat-panel, [class*="chat-container"]');
        
        console.log('Chat elements:', {
            toggle: chatToggle,
            container: chatContainer
        });
        
        if (!chatToggle || !chatContainer) {
            console.error('Critical chat elements not found');
            createBackupChatButton();
            return;
        }
        
        // Remove all existing handlers by cloning
        const newToggle = chatToggle.cloneNode(true);
        chatToggle.parentNode.replaceChild(newToggle, chatToggle);
        
        // Make the button more visible
        newToggle.style.boxShadow = '0 0 10px red';
        newToggle.style.cursor = 'pointer';
        
        // Add click handler
        newToggle.addEventListener('click', function() {
            console.log('Chat toggle clicked');
            
            // Force visibility and toggle class
            chatContainer.style.display = 'block';
            chatContainer.style.visibility = 'visible';
            chatContainer.classList.toggle('open');
            
            // Log the state
            console.log('Chat container state:', {
                classes: chatContainer.className,
                display: chatContainer.style.display,
                visibility: chatContainer.style.visibility
            });
        });
        
        // Find chat input and send button
        const chatInput = document.querySelector('.chat-input input');
        const sendButton = document.querySelector('.chat-send-button');
        const chatMessages = document.querySelector('.chat-messages');
        
        if (chatInput && chatMessages) {
            // Function to send a message
            function sendMessage() {
                const message = chatInput.value.trim();
                if (message === '') return;
                
                // Add user message
                const userMsg = document.createElement('div');
                userMsg.className = 'message user-message';
                userMsg.textContent = message;
                chatMessages.appendChild(userMsg);
                
                // Clear input
                chatInput.value = '';
                
                // Add bot response
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
            
            // Add Enter key handler
            chatInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                }
            });
            
            // Add send button handler
            if (sendButton) {
                sendButton.addEventListener('click', sendMessage);
            }
        }
        
        console.log('Chatbot fixed');
    }
    
    // Create a backup chat button if needed
    function createBackupChatButton() {
        console.log('Creating backup chat button');
        
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
        backupButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        
        // Add to page
        document.body.appendChild(backupButton);
        
        // Add click handler
        backupButton.addEventListener('click', function() {
            alert('Chat functionality is currently unavailable. Please contact us at 416-918-0473.');
        });
    }
    
    // Run the fixes when the page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            fixContactForm();
            fixChatbot();
        });
    } else {
        fixContactForm();
        fixChatbot();
    }
    
    // Add fallback
    window.addEventListener('load', function() {
        setTimeout(function() {
            fixContactForm();
            fixChatbot();
        }, 1000);
    });
})(); 