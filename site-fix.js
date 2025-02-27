// site-fix.js - Complete fixes for chatbot and webform
(function() {
    console.log('Site Fixes: Initializing');
    
    // ===== CONTACT FORM FIX =====
    function fixContactForm() {
        console.log('Fixing contact form');
        
        // Skip if enhanced-form-fix.js is active
        if (window.enhancedFormFixActive) {
            console.log('Skipping form fix - enhanced fix is active');
            return;
        }
        
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) {
            console.warn('Contact form not found');
            return;
        }
        
        // CRITICAL: Remove the form's action attribute to prevent navigation
        contactForm.removeAttribute('action');
        contactForm.removeAttribute('method');
        
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
    
    // ===== NEWSLETTER FIX =====
    function fixNewsletterForm() {
        console.log('Fixing newsletter form');
        
        const newsletterForm = document.getElementById('newsletter-form');
        if (!newsletterForm) {
            console.warn('Newsletter form not found');
            return;
        }
        
        // Add submission handler
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (!emailInput || !emailInput.value.trim()) {
                alert('Please enter a valid email address');
                return;
            }
            
            const email = emailInput.value.trim();
            console.log('Newsletter signup:', email);
            
            // Create formData with the email
            const formData = new FormData();
            formData.append('email', email);
            formData.append('access_key', 'f115e690-e290-47ea-9449-c63fa95720b1');
            formData.append('subject', 'New Newsletter Signup');
            formData.append('message', 'New signup for the newsletter: ' + email);
            
            // Show loading state
            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            const originalButtonHTML = submitButton ? submitButton.innerHTML : '<i class="fas fa-paper-plane"></i>';
            if (submitButton) {
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                submitButton.disabled = true;
            }
            
            // Submit using Web3Forms
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Newsletter submission failed: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Newsletter submitted successfully:', data);
                
                // Show success message
                const successMsg = document.querySelector('.newsletter-success');
                if (successMsg) {
                    successMsg.style.display = 'block';
                    setTimeout(() => {
                        successMsg.style.display = 'none';
                    }, 5000);
                } else {
                    alert('Thank you for subscribing to our newsletter!');
                }
                
                // Reset form
                newsletterForm.reset();
            })
            .catch(error => {
                console.error('Newsletter submission error:', error);
                alert('There was a problem subscribing to the newsletter. Please try again later.');
            })
            .finally(() => {
                if (submitButton) {
                    submitButton.innerHTML = originalButtonHTML;
                    submitButton.disabled = false;
                }
            });
        });
        
        console.log('Newsletter form fixed');
    }
    
    // ===== CHATBOT FIX =====
    function fixChatbot() {
        console.log('Fixing chatbot');
        
        // Load chatbot QA data
        loadChatbotData();
        
        // Find the chat elements using multiple selectors
        const chatToggle = document.querySelector('.chat-toggle, .chat-button, [class*="chat-button"], [class*="chat-toggle"]');
        const chatContainer = document.querySelector('.chat-container, .chat-panel, [class*="chat-container"]');
        const chatClose = document.querySelector('.chat-close, .close-chat, [class*="chat-close"]');
        
        console.log('Chat elements:', {
            toggle: chatToggle,
            container: chatContainer,
            closeButton: chatClose
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
            
            // Force visibility - MORE AGGRESSIVE APPROACH
            if(chatContainer.style.display === 'block') {
                chatContainer.style.display = 'none';
                chatContainer.classList.remove('open');
            } else {
                chatContainer.style.display = 'block';
                chatContainer.style.visibility = 'visible';
                chatContainer.style.opacity = '1';
                chatContainer.style.zIndex = '10000';
                chatContainer.classList.add('open');
            }
            
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
                    
                    // Get answer from QA data
                    botMsg.textContent = findChatAnswer(message);
                    
                    chatMessages.appendChild(botMsg);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 500);
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            // Function to find the best answer
            function findChatAnswer(question) {
                const normalizedQuestion = question.toLowerCase().trim();
                
                // Check if chatQA data is available
                if (!window.chatQA || !window.chatQA.questions) {
                    return "I'm sorry, I don't have answer data available right now. Please try again later.";
                }
                
                // Special cases
                if (normalizedQuestion.includes('dan')) {
                    return window.chatQA.questions["who is dan"] || "Dan is the man!";
                }
                
                if (normalizedQuestion.includes('humberto')) {
                    return window.chatQA.questions["who is humberto"];
                }
                
                if (normalizedQuestion.includes('john')) {
                    return window.chatQA.questions["who is john"];
                }
                
                if (normalizedQuestion.includes('demo') || normalizedQuestion.includes('location') || normalizedQuestion.includes('store')) {
                    return window.chatQA.questions["where can i see a demo"] || "If you are near Barrie Ontario, just walk into our Kangen store on Dunlop and Hwy 400, or call us at 416-918-0473.";
                }
                
                // Safety-related questions
                if (normalizedQuestion.includes('safe for kid') || normalizedQuestion.includes('safe for children') || 
                    normalizedQuestion.includes('kid safe') || normalizedQuestion.includes('child safe')) {
                    return window.chatQA.questions["safe for kids"];
                }
                
                if (normalizedQuestion.includes('safe') && !normalizedQuestion.includes('kid') && !normalizedQuestion.includes('child') && !normalizedQuestion.includes('pet')) {
                    return window.chatQA.questions["is it safe"];
                }
                
                if (normalizedQuestion.includes('warranty') || normalizedQuestion.includes('guarantee')) {
                    return window.chatQA.questions["warranty"];
                }
                
                // Look for direct matches
                for (const key in window.chatQA.questions) {
                    if (normalizedQuestion.includes(key)) {
                        return window.chatQA.questions[key];
                    }
                }
                
                // Try to find partial keyword matches
                if (normalizedQuestion.includes('contact') || normalizedQuestion.includes('call') || normalizedQuestion.includes('phone')) {
                    return window.chatQA.questions["contact information"];
                }
                
                if (normalizedQuestion.includes('payment') || normalizedQuestion.includes('credit card')) {
                    return window.chatQA.questions["payment options"];
                }
                
                if (normalizedQuestion.includes('international') || normalizedQuestion.includes('shipping') || normalizedQuestion.includes('deliver')) {
                    return window.chatQA.questions["international orders"];
                }
                
                // Fallback
                return "Thank you for your question. How else can I help you with emGuarde?";
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
        
        // Fix the close button
        if (chatClose && chatContainer) {
            // Clone to remove all existing handlers
            const newCloseButton = chatClose.cloneNode(true);
            chatClose.parentNode.replaceChild(newCloseButton, chatClose);
            
            // Add click handler
            newCloseButton.addEventListener('click', function() {
                console.log('Chat close clicked');
                chatContainer.style.display = 'none';
                chatContainer.classList.remove('open');
            });
        }
        
        console.log('Chatbot fixed');
    }
    
    // Function to load chatbot question data
    function loadChatbotData() {
        console.log('Loading chatbot QA data');
        
        // Create comprehensive chatQA object with all questions and answers
        window.chatQA = { 
            questions: {
                "who is dan": "Dan is the man!",
                "who is humberto": "Humberto is the master of desaster.",
                "who is john": "John is the Kangen superstar.",
                "contact information": "You can reach our team at 416-918-0473 or visit our store in Barrie, Ontario at Dunlop and Hwy 400. We're happy to answer any questions you might have about emGuarde products.",
                "payment options": "We accept all major credit cards, PayPal, and e-transfers. For large orders or corporate purchases, we also offer invoice payment options.",
                "emf dangers": "Many people are concerned about potential health effects from prolonged exposure to electromagnetic fields from devices like cell phones, Wi-Fi routers, and smart meters. While research is ongoing, some individuals prefer to take a precautionary approach.",
                "international orders": "Yes, we ship internationally. Shipping costs and delivery times vary by location. Please contact our customer service team for specific information about shipping to your country.",
                "bulk orders": "We offer special pricing for bulk orders for businesses, healthcare practitioners, and resellers. Please contact our sales team to discuss your specific requirements.",
                "financing": "For larger purchases, we do offer financing options through select partners. Terms and conditions apply. Please inquire with our sales team for current financing programs.",
                "lifespan": "emGuarde devices are built to last for many years with proper care. There are no parts that need regular replacement.",
                "where can i see a demo": "If you are near Barrie Ontario, just walk into our Kangen store on Dunlop and Hwy 400, or call us at 416-918-0473.",
                "what is emguarde": "emGuarde is a device designed to help reduce exposure to electromagnetic fields in your home or office environment.",
                "how does it work": "emGuarde is designed to help mitigate electromagnetic fields in your surroundings. For detailed technical information, please contact our support team who can provide you with the documentation and research behind our technology.",
                "is it safe": "emGuarde is designed with safety as a priority and doesn't emit additional electromagnetic fields. Many customers have used our products for years without reporting adverse effects.",
                "safe for kids": "emGuarde is designed to be used in any room of your home, including children's rooms. It doesn't emit any harmful substances or radiation. Many parents choose to place EMF protection devices in children's bedrooms.",
                "safe for pets": "emGuarde doesn't produce any sounds, odors, or emissions that would disturb pets. Many customers use our products in homes with pets without any reported issues.",
                "how long does it last": "emGuarde devices are built for durability. The exact lifespan depends on usage conditions, but they're designed for long-term operation. Please check your product documentation for specific details about your model.",
                "warranty": "Please check your purchase documentation for specific warranty information. We stand behind our products and have customer support available to address any issues you may experience.",
                "side effects": "emGuarde is designed to reduce EMF exposure without creating additional electromagnetic fields. We haven't received reports of side effects from our customers. If you have specific health concerns, please consult with a healthcare professional.",
                "price": "emGuarde products are available at different price points depending on the model and coverage area. For current pricing, please visit our website's product section or contact our sales team.",
                "shipping": "For current shipping options and costs, please check our website's shipping information page or contact our customer service team.",
                "installation": "Most emGuarde models are designed for simple installation. Specific instructions are included with your purchase, and our support team is available if you need assistance.",
                "difference": "emGuarde is designed to help reduce EMF exposure while allowing you to continue using your electronic devices normally. For specific comparisons with other products, please contact our support team.",
                "scientific evidence": "Research on EMF protection is ongoing. For information about testing and research related to our specific products, please contact our support team who can provide you with the appropriate documentation.",
                "discount": "We may offer special promotions or volume discounts from time to time. For current offers, please check our website or contact our sales team.",
                "returns": "Please refer to our return policy on the website or in your purchase documentation for specific information about returns and refunds.",
                "vs competitors": "emGuarde is designed to provide area protection rather than device-specific protection. For detailed comparisons with specific competitors, please contact our support team.",
                "do i need this": "If you're concerned about electromagnetic field exposure in your home or office, you might consider EMF protection. People particularly interested include those with multiple electronic devices, those living near cell towers, or those who simply prefer to take a precautionary approach to EMF exposure.",
                "proven": "For information about testing and verification of our products, please contact our support team who can provide appropriate documentation based on your specific interests.",
                "skeptical": "We understand that people have different perspectives on EMF protection. We encourage you to research the topic from various sources and make the decision that's best for your situation.",
                "pregnant": "If you have concerns about EMF exposure during pregnancy, we recommend discussing this with your healthcare provider. They can provide guidance specific to your situation.",
                "cell phone": "emGuarde is designed to help reduce overall EMF exposure in an area, including fields from devices like cell phones. It doesn't interfere with the functionality of your devices.",
                "5g": "EMF protection products like emGuarde are designed to work with various electromagnetic frequencies in your environment. For specific information about 5G and our products, please contact our support team.",
                "range": "The coverage area varies by model. Please check your specific product's documentation or contact our support team for details about your emGuarde unit's recommended coverage area.",
                "maintenance": "Most emGuarde models are designed to be low-maintenance. For specific care instructions, please refer to your product's manual.",
                "not working": "If you have concerns about your emGuarde device, please check that it's properly connected according to the instructions and that any indicator lights are functioning normally. Our support team is available to help with troubleshooting if needed.",
                "alternative": "There are various approaches to EMF protection, including area protection devices like emGuarde, shielding materials, and device-specific solutions. The best approach depends on your specific concerns and environment.",
                "made": "For information about where and how emGuarde products are manufactured, please check the product packaging or contact our customer service team.",
                "how many": "The number of units needed depends on the size of your space and the specific model you choose. Our customer service team can help you determine the appropriate number of units for your needs.",
                "sleep": "Some customers choose to place EMF protection devices in their bedrooms based on concerns about the potential effects of electromagnetic fields on sleep. Everyone's experience is different.",
                "emf meter": "If you're interested in measuring electromagnetic fields in your environment, EMF meters are available from various sources. The specific readings and changes you might observe can vary based on many factors.",
                "testimonials": "Customer experiences are available on our website. We believe in letting our customers share their own experiences rather than making specific claims.",
                "office": "emGuarde products can be used in office environments where there are typically multiple electronic devices. Many customers choose to use EMF protection in both their homes and workplaces."
            } 
        };
        
        console.log('Chatbot data initialized with ' + Object.keys(window.chatQA.questions).length + ' questions');
    }
    
    // Create a backup chat button if needed
    function createBackupChatButton() {
        console.log('Creating backup chat button');
        
        const backupButton = document.createElement('button');
        backupButton.textContent = 'Chat with Us';
        
        // Also add a debug button
        const debugButton = document.createElement('button');
        debugButton.textContent = 'Debug Site';
        debugButton.style.position = 'fixed';
        debugButton.style.bottom = '20px';
        debugButton.style.left = '20px';
        debugButton.style.zIndex = '10000';
        debugButton.style.padding = '10px 20px';
        debugButton.style.backgroundColor = '#ff5722';
        debugButton.style.color = 'white';
        debugButton.style.border = 'none';
        debugButton.style.borderRadius = '5px';
        debugButton.style.cursor = 'pointer';
        
        // Add debug click handler
        debugButton.addEventListener('click', function() {
            const debugInfo = {
                chatElements: {
                    toggle: document.querySelector('.chat-toggle, .chat-button'),
                    container: document.querySelector('.chat-container'),
                    input: document.querySelector('.chat-input input'),
                    messages: document.querySelector('.chat-messages')
                },
                formElements: {
                    form: document.getElementById('contact-form'),
                    submitButton: document.querySelector('#contact-form button[type="submit"]')
                },
                paypalElements: document.querySelectorAll('[id^="paypal-"]')
            };
            
            console.log('DEBUG INFO:', debugInfo);
            alert('Debug info logged to console. Press F12 to view.');
        });
        
        // Add to page
        document.body.appendChild(backupButton);
        document.body.appendChild(debugButton);
        
        // Add click handler
        backupButton.addEventListener('click', function() {
            alert('Chat functionality is currently unavailable. Please contact us at 416-918-0473.');
        });
    }
    
    // Run the fixes when the page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Don't interfere with PayPal buttons
            console.log('Preserving PayPal functionality');
            const paypalButtons = document.querySelectorAll('[id^="paypal-"], .paypal-button');
            paypalButtons.forEach(button => {
                button.setAttribute('data-preserved', 'true');
            });
            
            // Fix PayPal visibility
            function fixPayPal() {
                const paypalContainers = document.querySelectorAll('[id^="paypal-"], #paypal-button-container, .paypal-button-container');
                
                if (paypalContainers.length === 0) {
                    console.log('No PayPal containers found, will try to render');
                    
                    // Trigger PayPal rendering if the function is available
                    if (window.renderPayPalButtons) {
                        window.renderPayPalButtons();
                    }
                    
                    // Check if PayPal script needs to be reloaded
                    const paypalScript = document.querySelector('script[src*="paypal.com"]');
                    if (!paypalScript) {
                        console.log('PayPal script not found, attempting to load it');
                        loadPayPalScript();
                    }
                } else {
                    console.log('PayPal containers found, ensuring visibility');
                    
                    paypalContainers.forEach(container => {
                        container.style.display = 'block';
                        container.style.visibility = 'visible';
                        container.style.height = 'auto';
                        container.style.minHeight = '40px';
                        container.style.opacity = '1';
                        container.style.zIndex = '1000';
                        container.style.position = 'relative';
                        container.style.overflow = 'visible';
                        
                        // Attempt to re-render if empty
                        if (container.children.length === 0 && window.renderPayPalButtons) {
                            window.renderPayPalButtons();
                        }
                    });
                }
                
                // Also look for any hidden PayPal iframes
                const paypalIframes = document.querySelectorAll('iframe[name*="paypal"], iframe[src*="paypal"]');
                paypalIframes.forEach(iframe => {
                    iframe.style.display = 'block';
                    iframe.style.visibility = 'visible';
                    iframe.style.height = '45px';
                    iframe.style.minHeight = '45px';
                    iframe.style.opacity = '1';
                });
            }
            
            // Function to load PayPal script
            function loadPayPalScript() {
                // Get client ID from config
                const clientId = (window.CONFIG && CONFIG.PAYPAL && CONFIG.PAYPAL.LIVE) ? 
                                  CONFIG.PAYPAL.LIVE : 
                                  'ARS0c4s7qfFkHhF-aeCdkx40HxH6lRVCG7m-xl6Yhl7auv0IHqc42KAsUxxB30949Xh2DR89kSwYtL9h';
                
                const script = document.createElement('script');
                script.src = 'https://www.paypal.com/sdk/js?client-id=' + clientId + '&currency=CAD';
                script.setAttribute('data-namespace', 'paypalSDK');
                
                script.onload = function() {
                    console.log('PayPal SDK loaded successfully');
                    
                    // Wait for PayPal to initialize
                    if (window.paypalSDK) {
                        renderPayPalButtons();
                    }
                };
                
                document.body.appendChild(script);
            }
            
            // Function to render PayPal buttons
            function renderPayPalButtons() {
                console.log('Attempting to render PayPal buttons');
                
                // Find all containers where PayPal buttons should go
                const containers = document.querySelectorAll('.paypal-button-container, [id^="paypal-button"]');
                
                if (containers.length === 0) {
                    console.log('No PayPal containers found to render buttons');
                    return;
                }
                
                // Check if PayPal SDK is available
                if (!window.paypalSDK && !window.paypal) {
                    console.warn('PayPal SDK not found, cannot render buttons');
                    return;
                }
                
                const paypalSDK = window.paypalSDK || window.paypal;
                
                containers.forEach(container => {
                    // Only render if container is empty
                    if (container.children.length === 0) {
                        try {
                            console.log('Rendering PayPal button in container:', container);
                            
                            paypalSDK.Buttons({
                                style: {
                                    layout: 'horizontal',
                                    color: 'blue',
                                    shape: 'rect',
                                    label: 'pay'
                                },
                                createOrder: function(data, actions) {
                                    // Get amount from data attribute or fallback to 299.00
                                    const amount = container.getAttribute('data-amount') || '299.00';
                                    return actions.order.create({
                                        purchase_units: [{
                                            amount: {
                                                value: amount
                                            }
                                        }]
                                    });
                                },
                                onApprove: function(data, actions) {
                                    return actions.order.capture().then(function(details) {
                                        alert('Transaction completed by ' + details.payer.name.given_name);
                                    });
                                }
                            }).render(container);
                        } catch (error) {
                            console.error('Error rendering PayPal button:', error);
                        }
                    }
                });
            }
            
            fixContactForm();
            fixChatbot();
            fixNewsletterForm();
            // Try fixing PayPal with increasing delays
            fixPayPal();
            setTimeout(fixPayPal, 1000);
            setTimeout(fixPayPal, 2500);
            setTimeout(fixPayPal, 5000);
        });
    } else {
        fixContactForm();
        fixChatbot();
        fixNewsletterForm();
    }
    
    // Add fallback
    window.addEventListener('load', function() {
        setTimeout(function() {
            fixContactForm();
            fixChatbot();
            fixNewsletterForm();
        }, 1000);
    });
})(); 