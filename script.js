// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Get all anchor links that point to sections on the page
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    // Add click event listener to each anchor link
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section ID from the href attribute
            const targetId = this.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            // If target element exists, scroll to it
            if (targetElement) {
                // Adjust offset based on navbar height
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                // Smooth scroll to the target section
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Log that the smooth scrolling has been initialized
    console.log('Smooth scrolling initialized for all anchor links');
});

// Fix contact form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        console.log("Contact form found, setting up submission handler");
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Form submission initiated");
            
            // Check if we're on localhost (development environment)
            const isLocalhost = window.location.hostname === 'localhost' || 
                                window.location.hostname === '127.0.0.1' ||
                                window.location.hostname === '';
            
            // Skip reCAPTCHA check on localhost for testing
            if (isLocalhost) {
                console.log('Localhost detected, bypassing reCAPTCHA');
                submitContactForm(this);
                return;
            }
            
            // Check reCAPTCHA response for production
            if (typeof grecaptcha !== 'undefined') {
                const recaptchaResponse = grecaptcha.getResponse();
                if (!recaptchaResponse) {
                    alert('Please complete the reCAPTCHA verification.');
                    return;
                }
            } else {
                console.warn("reCAPTCHA not loaded, proceeding anyway");
            }
            
            // If reCAPTCHA is verified or not available, submit the form
            submitContactForm(this);
        });
    } else {
        console.error("Contact form not found in the document");
    }
});

// Function to handle contact form submission
function submitContactForm(form) {
    console.log("Submitting form to:", form.action);
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Create form data
    const formData = new FormData(form);
    
    // Log form data for debugging
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    // Submit the form using fetch
    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log("Response status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Form submission response:", data);
        
        if (data.success) {
            alert('Thank you for your message! We will get back to you soon.');
            form.reset();
            
            // Reset reCAPTCHA if it exists
            if (typeof grecaptcha !== 'undefined' && grecaptcha.reset) {
                grecaptcha.reset();
            }
        } else {
            console.error("Form submission error:", data);
            alert('There was an error sending your message. Please try again.');
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        alert('There was an error sending your message. Please try again.');
    })
    .finally(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
}

// Global variables for chat functionality
let chatToggle, chatClose, chatContainer, userInput, sendButton, chatMessages;

// Global bot response function
function getBotResponse(message) {
    message = message.toLowerCase();
    
    // Simple response logic based on keywords
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hello! How can I help you with EMF protection today?";
    } else if (message.includes('what') && message.includes('do') && message.includes('thing')) {
        return "The emGuarde device is an advanced EMF protection system that shields you from harmful electromagnetic radiation emitted by electronics like Wi-Fi routers, cell phones, and computers. It uses proprietary frequency modulation technology to create a protective field covering up to 400 square feet.";
    } else if (message.includes('what') && (message.includes('do') || message.includes('does')) && (message.includes('this') || message.includes('device') || message.includes('emguarde'))) {
        return "The emGuarde device is an advanced EMF protection system that shields you from harmful electromagnetic radiation emitted by electronics like Wi-Fi routers, cell phones, and computers. It uses proprietary frequency modulation technology to create a protective field covering up to 400 square feet.";
    } else if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
        return "The emGuarde device is priced at $2,499.99. This includes free shipping within the US, a 30-day money-back guarantee, and a 1-year manufacturer's warranty.";
    } else if (message.includes('shipping') || message.includes('delivery')) {
        return "We offer free priority shipping within the United States, with delivery typically taking 3-5 business days. International shipping is available at an additional cost.";
    } else if (message.includes('warranty') || message.includes('guarantee')) {
        return "The emGuarde device comes with a 30-day money-back guarantee and a 1-year manufacturer's warranty against defects.";
    } else if ((message.includes('how') && message.includes('work')) || message.includes('technology')) {
        return "The emGuarde device uses advanced frequency modulation technology to neutralize harmful EMF radiation in your environment. Simply plug it into any standard outlet, and it creates a protective field covering up to 400 square feet.";
    } else if (message.includes('safe') || message.includes('safety')) {
        return "Yes, the emGuarde device is completely safe for humans, pets, and plants. It doesn't interfere with the normal operation of your electronic devices.";
    } else if (message.includes('coverage') || message.includes('range') || message.includes('area')) {
        return "Each emGuarde device provides coverage for approximately 400 square feet. For larger spaces, multiple units can be installed.";
    } else if (message.includes('install') || message.includes('setup')) {
        return "Installation is very simple! Just plug the emGuarde device into any standard electrical outlet. No additional setup is required.";
    } else if (message.includes('emf') || message.includes('radiation') || message.includes('electromagnetic')) {
        return "EMF radiation is emitted by electronic devices like cell phones, Wi-Fi routers, and computers. Long-term exposure may have health implications. The emGuarde device helps reduce this exposure in your living or working space.";
    } else if (message.includes('benefits') || message.includes('advantage')) {
        return "Many users report improved sleep, reduced headaches, better concentration, and an overall sense of wellbeing after installing the emGuarde device.";
    } else if (message.includes('contact') || message.includes('support') || message.includes('help')) {
        return "You can contact our support team through the contact form on this website, or email us directly at support@emguarde.com.";
    } else if (message.includes('thank')) {
        return "You're welcome! Is there anything else I can help you with?";
    } else {
        return "I'm not sure I understand. Could you rephrase your question about EMF protection or the emGuarde device?";
    }
}

// Global send message function
function sendMessage() {
    if (!userInput || !chatMessages) return;
    
    const message = userInput.value.trim();
    if (message === '') return;
    
    console.log("User message:", message);
    
    // Add user message to chat
    const userMessageElement = document.createElement('div');
    userMessageElement.className = 'message user';
    userMessageElement.textContent = message;
    chatMessages.appendChild(userMessageElement);
    
    // Clear input
    userInput.value = '';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate bot response (with typing indicator)
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot typing';
    typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    chatMessages.appendChild(typingIndicator);
    
    // Scroll to show typing indicator
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Process the message and get response
    setTimeout(function() {
        // Remove typing indicator
        chatMessages.removeChild(typingIndicator);
        
        // Get bot response
        const botResponse = getBotResponse(message);
        console.log("Bot response:", botResponse);
        
        // Add bot response
        const botMessageElement = document.createElement('div');
        botMessageElement.className = 'message bot';
        botMessageElement.textContent = botResponse;
        chatMessages.appendChild(botMessageElement);
        
        // Scroll to bottom again
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// Initialize chat functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat elements
    chatToggle = document.getElementById('chat-toggle');
    chatClose = document.getElementById('chat-close');
    chatContainer = document.querySelector('.chat-container');
    userInput = document.getElementById('user-input');
    sendButton = document.getElementById('send-button');
    chatMessages = document.getElementById('chat-messages');
    
    // Toggle chat visibility
    if (chatToggle) {
        console.log("Chat toggle button found");
        chatToggle.addEventListener('click', function() {
            console.log("Chat toggle clicked");
            chatContainer.classList.toggle('active');
            // Remove notification dot
            this.classList.add('notification-read');
        });
    } else {
        console.error("Chat toggle button not found");
    }
    
    // Close chat
    if (chatClose) {
        chatClose.addEventListener('click', function() {
            chatContainer.classList.remove('active');
        });
    }
    
    // Handle send button click
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    // Handle enter key press
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// Newsletter form handling
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterSuccess = document.querySelector('.newsletter-success');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get email input
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Simple validation
            if (email === '') return;
            
            // In a real implementation, you would send this to your server or email service
            console.log("Newsletter signup:", email);
            
            // Clear input and show success message
            emailInput.value = '';
            newsletterSuccess.style.display = 'block';
            
            // Hide success message after 3 seconds
            setTimeout(function() {
                newsletterSuccess.style.display = 'none';
            }, 3000);
        });
    }
});

// Fix PayPal button loading
document.addEventListener('DOMContentLoaded', function() {
    // Load PayPal script dynamically
    const paypalScript = document.createElement('script');
    paypalScript.src = `https://www.paypal.com/sdk/js?client-id=${CONFIG.PAYPAL_CLIENT_ID}&currency=USD`;
    paypalScript.async = true;
    paypalScript.onload = initPayPalButton;
    paypalScript.onerror = function() {
        console.error("Failed to load PayPal SDK");
        document.getElementById('paypal-button-container').innerHTML = 
            '<p style="color: red;">Payment system is temporarily unavailable. Please try again later or contact support.</p>';
    };
    document.body.appendChild(paypalScript);
});

// Add the missing initPayPalButton function
function initPayPalButton() {
    if (window.paypal) {
        console.log("PayPal SDK loaded successfully");
        
        paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'pay'
            },
            createOrder: function(data, actions) {
                console.log("Creating PayPal order");
                return actions.order.create({
                    purchase_units: [{
                        description: 'emGuarde EMF Protection Device',
                        amount: {
                            value: '2499.99'
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                console.log("Payment approved", data);
                return actions.order.capture().then(function(details) {
                    console.log("Payment completed", details);
                    
                    // Show success page
                    document.getElementById('order-id').textContent = details.id;
                    document.getElementById('order-date').textContent = new Date().toLocaleDateString();
                    document.getElementById('order-amount').textContent = '2,499.99';
                    document.getElementById('order-status').textContent = 'Completed';
                    
                    // Hide main content and show success page
                    document.querySelectorAll('section:not(#order-success)').forEach(section => {
                        section.style.display = 'none';
                    });
                    document.getElementById('order-success').style.display = 'block';
                    window.scrollTo(0, 0);
                });
            },
            onError: function(err) {
                console.error("PayPal error:", err);
                alert("There was an error processing your payment. Please try again or contact support.");
            }
        }).render('#paypal-button-container');
    } else {
        console.error("PayPal SDK failed to load properly");
        document.getElementById('paypal-button-container').innerHTML = 
            '<p style="color: red;">Payment system is temporarily unavailable. Please try again later or contact support.</p>';
    }
}

// Add chat notification removal
document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chat-toggle');
    
    if (chatToggle) {
        chatToggle.addEventListener('click', function() {
            // Remove the notification dot after first click
            this.classList.add('notification-read');
        });
    }
});

// Add this function to handle the hero button click
function scrollToBuy(event) {
    event.preventDefault();
    const buySection = document.getElementById('buy');
    if (buySection) {
        const headerOffset = 80;
        const elementPosition = buySection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Make sure the function is available globally
window.scrollToBuy = scrollToBuy;

// Update form access key
document.querySelector('input[name="access_key"]').value = CONFIG.WEB3FORMS_KEY;

// Update reCAPTCHA
document.querySelector('.g-recaptcha').setAttribute('data-sitekey', CONFIG.RECAPTCHA_SITE_KEY);

// Add testimonials view more functionality
document.addEventListener('DOMContentLoaded', function() {
    const viewMoreButton = document.getElementById('view-more-testimonials');
    if (viewMoreButton) {
        viewMoreButton.addEventListener('click', function() {
            const hiddenTestimonials = document.querySelectorAll('.testimonial-card.hidden');
            hiddenTestimonials.forEach(card => {
                card.classList.remove('hidden');
                // Add a fade-in effect
                card.style.opacity = 0;
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = 1;
                }, 10);
            });
            this.style.display = 'none'; // Hide the button after showing all testimonials
        });
    }
});

// Add reCAPTCHA callback
function enableSubmit() {
    document.querySelector('#contact-form button[type="submit"]').disabled = false;
}

// Disable submit button until reCAPTCHA is completed
document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
    }
});

// Add a new function to scroll to buy section and highlight it
function scrollAndHighlightBuy(event) {
    event.preventDefault();
    console.log("Buy button clicked, scrolling to buy section");
    
    const buySection = document.getElementById('buy');
    if (buySection) {
        // Calculate position
        const headerOffset = 100;
        const elementPosition = buySection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        // Scroll to the buy section
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Highlight the pricing box with a pulsing effect
        setTimeout(() => {
            const pricingBox = document.querySelector('.pricing-box');
            if (pricingBox) {
                // Add highlight class
                pricingBox.classList.add('highlight-pulse');
                
                // Remove highlight after animation completes
                setTimeout(() => {
                    pricingBox.classList.remove('highlight-pulse');
                }, 2000);
            }
        }, 1000); // Wait for scroll to complete
    }
}

// Make the function available globally
window.scrollAndHighlightBuy = scrollAndHighlightBuy;

// Add a direct event listener to the hero buy button
document.addEventListener('DOMContentLoaded', function() {
    const heroBuyButton = document.getElementById('hero-buy-button');
    
    if (heroBuyButton) {
        console.log("Hero buy button found, adding click handler");
        
        heroBuyButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Hero buy button clicked");
            
            // Get the buy section
            const buySection = document.getElementById('buy');
            
            if (buySection) {
                // Calculate position with offset for navbar
                const headerOffset = 100;
                const elementPosition = buySection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                console.log(`Scrolling to position: ${offsetPosition}`);
                
                // Scroll to the buy section
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Flash the pricing box
                setTimeout(function() {
                    const pricingBox = document.querySelector('.pricing-box');
                    if (pricingBox) {
                        console.log("Highlighting pricing box");
                        pricingBox.style.boxShadow = '0 0 20px rgba(52, 152, 219, 0.7)';
                        
                        setTimeout(function() {
                            pricingBox.style.boxShadow = '';
                        }, 2000);
                    }
                }, 1000);
            }
        });
    } else {
        console.error("Hero buy button not found");
    }
}); 