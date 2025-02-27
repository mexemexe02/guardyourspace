// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Get all anchor links that point to sections on the page
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    // Add click event listener to each anchor link with passive option
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
        }, { passive: false }); // Can't be passive because we're using preventDefault
    });
    
    // Add passive event listeners for scroll events
    window.addEventListener('scroll', function() {
        // Any scroll handling code
    }, { passive: true });
    
    // Add passive event listeners for touchstart/touchmove events
    document.addEventListener('touchstart', function(e) {
        // Touch handling code
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        // Touch move handling code
    }, { passive: true });
    
    console.log('Event listeners optimized with passive option where possible');
});

// Fix contact form submission
document.addEventListener('DOMContentLoaded', function() {
    // Set up the Web3Forms key using our safe getter
    const web3FormsKeyInput = document.getElementById('web3forms-key');
    if (web3FormsKeyInput) {
        web3FormsKeyInput.value = getConfigValue('WEB3FORMS_KEY', 'f115e690-e290-47ea-9449-c63fa95720b1');
    }
    
    // Set up the success redirect URL
    const successRedirect = document.getElementById('success-redirect');
    if (successRedirect) {
        successRedirect.value = window.location.origin + window.location.pathname + '?formsubmitted=true';
    }
    
    // Initialize email field for reply-to
    const emailField = document.getElementById('email-field');
    const replyToField = document.getElementById('email-replyto');
    
    if (emailField && replyToField) {
        // Set initial value
        replyToField.value = emailField.value;
        
        // Update on change
        emailField.addEventListener('input', function() {
            replyToField.value = this.value;
        });
    }
    
    // Check for form submission success parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('formsubmitted') === 'true') {
        alert('Thank you for your message! We will get back to you soon.');
        // Remove the parameter from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
    
    // Set up the contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Remove any existing event listeners to avoid duplicates
        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);
        
        // Add the event listener to the new form
        newForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Contact form submitted");
            
            // Show loading state
            const submitButton = newForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Get reCAPTCHA token
            grecaptcha.ready(function() {
                grecaptcha.execute(getConfigValue('RECAPTCHA_SITE_KEY', '6LfgqeMqAAAAAHE-UM1rD-sGBsjBFnyX-Ey3c0Sh'), {action: 'submit'})
                    .then(function(token) {
                        console.log("reCAPTCHA token obtained");
                        
                        // Create form data
                        const formData = new FormData(newForm);
                        formData.append('g-recaptcha-response', token);
                        
                        // Submit the form using fetch
                        fetch(newForm.action, {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => {
                            console.log("Response status:", response.status);
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log("Form submission response:", data);
                            
                            if (data.success) {
                                // Show success message
                                alert('Thank you for your message! We will get back to you soon.');
                                newForm.reset();
                            } else {
                                console.error("Form submission error:", data);
                                alert('There was an error sending your message. Please try again.');
                            }
                        })
                        .catch(error => {
                            console.error('Form submission error:', error);
                            alert('There was an error sending your message. Please try again or contact us directly at support@emguarde.com');
                        })
                        .finally(() => {
                            submitButton.textContent = originalText;
                            submitButton.disabled = false;
                        });
                    })
                    .catch(function(error) {
                        console.error("reCAPTCHA error:", error);
                        alert("There was an error verifying your submission. Please try again.");
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                    });
            });
        });
    }
});

// Global variables for chat functionality
let chatToggle, chatClose, chatContainer, userInput, sendButton, chatMessages;

// Enhanced bot response function with more specific questions
function getBotResponse(message) {
    if (!message) return "I didn't catch that. Could you please try again?";
    
    message = message.toLowerCase().trim();
    console.log("Processing message:", message);
    
    // Specific questions about the device
    if (message === "what is emguarde" || message === "what's emguarde") {
        return "emGuarde is our advanced EMF protection device that creates a protective field to shield you from harmful electromagnetic radiation emitted by everyday electronics.";
    }
    
    if (message === "does it really work" || message === "is it effective" || message === "does this actually work") {
        return "Yes, the emGuarde device is effective at harmonizing electromagnetic fields. Many users report noticeable improvements in sleep quality, energy levels, and overall wellbeing after installation. Our technology is based on decades of research into EMF effects on biological systems.";
    }
    
    if (message === "how big is it" || message === "what are the dimensions" || message === "what size is it") {
        return "The emGuarde device is compact and unobtrusive, measuring approximately 12cm x 8cm x 4cm (4.7\" x 3.1\" x 1.6\"). It's designed to plug directly into a standard wall outlet without taking up much space.";
    }
    
    if (message === "what color is it" || message === "what does it look like") {
        return "The emGuarde device features a sleek, modern design with a white casing and subtle blue LED indicator. Its minimalist appearance blends well with most home and office decor.";
    }
    
    if (message === "where is it made" || message === "country of origin" || message === "where do you manufacture it") {
        return "The emGuarde device is designed in Canada and manufactured in our ISO-certified facilities using high-quality components. Each unit undergoes rigorous quality control testing before shipment.";
    }
    
    // Health-related questions
    if (message.includes("pregnant") || message.includes("pregnancy") || message.includes("baby")) {
        return "The emGuarde device is safe for use during pregnancy. It doesn't emit any harmful radiation itself but rather helps harmonize existing electromagnetic fields. Many expectant mothers report feeling more comfortable with reduced EMF exposure in their homes.";
    }
    
    if (message.includes("children") || message.includes("kids") || message.includes("child")) {
        return "emGuarde is completely safe for children of all ages. In fact, children may be more sensitive to EMF radiation, so many parents choose to install emGuarde devices in children's bedrooms and play areas for added protection.";
    }
    
    if (message.includes("pets") || message.includes("animals") || message.includes("dog") || message.includes("cat")) {
        return "The emGuarde device is completely safe for pets. Animals can be sensitive to electromagnetic fields, and many pet owners report their animals seem more relaxed and comfortable after installing an emGuarde device.";
    }
    
    if (message.includes("headache") || message.includes("migraine")) {
        return "Many users report a reduction in headache frequency and intensity after installing the emGuarde device. While individual results vary, the harmonization of electromagnetic fields may help reduce EMF-related headaches.";
    }
    
    if (message.includes("sleep") || message.includes("insomnia")) {
        return "Improved sleep quality is one of the most commonly reported benefits of the emGuarde device. Many users notice they fall asleep faster, experience fewer nighttime disturbances, and wake feeling more refreshed. This may be due to the reduction of EMF-related stress on the body during sleep.";
    }
    
    // Technical questions
    if (message.includes("wifi") || message.includes("wi-fi") || message.includes("internet")) {
        return "The emGuarde device doesn't interfere with your Wi-Fi or internet connection. It works by harmonizing electromagnetic fields rather than blocking them, so all your devices will continue to function normally while you benefit from reduced EMF exposure.";
    }
    
    if (message.includes("phone") || message.includes("cell") || message.includes("mobile")) {
        return "The emGuarde device helps reduce the impact of EMF radiation from cell phones within its coverage area. Your phone will continue to work normally, but the harmful effects of its electromagnetic emissions may be reduced. For maximum protection, we recommend placing the emGuarde device near where you typically use or charge your phone.";
    }
    
    if (message.includes("5g") || message.includes("5-g")) {
        return "The emGuarde device helps harmonize electromagnetic fields from various sources, including 5G networks. As 5G technology becomes more widespread, many users find added peace of mind knowing their emGuarde device is helping to mitigate potential EMF exposure.";
    }
    
    if (message.includes("smart meter")) {
        return "The emGuarde device can help reduce the impact of EMF radiation from smart meters. If you're concerned about your smart meter, we recommend placing an emGuarde device on the interior wall closest to where the smart meter is mounted outside your home.";
    }
    
    if (message.includes("computer") || message.includes("laptop")) {
        return "The emGuarde device helps reduce EMF exposure from computers and laptops within its coverage area. For those who work long hours at a computer, placing an emGuarde device near your workstation may help reduce potential EMF-related fatigue and discomfort.";
    }
    
    // Purchase-related questions
    if (message.includes("discount") || message.includes("coupon") || message.includes("promo") || message.includes("sale")) {
        return "We occasionally offer special promotions to new customers. Sign up for our newsletter at the bottom of the page to be notified of upcoming discounts. For bulk orders of multiple units, please contact our sales team for special pricing.";
    }
    
    if (message.includes("bulk") || message.includes("wholesale") || message.includes("multiple")) {
        return "We offer special pricing for bulk orders of multiple emGuarde devices. This is popular for businesses, clinics, and families protecting multiple rooms. Please contact our sales team at sales@emguarde.com for a customized quote based on your needs.";
    }
    
    if (message.includes("refund") || message.includes("return") || message.includes("money back")) {
        return "We offer a 30-day money-back guarantee. If you're not completely satisfied with your emGuarde device, simply contact our customer service team and return the device in its original packaging. We'll issue a full refund once we receive the returned item.";
    }
    
    if (message.includes("warranty") || message.includes("guarantee")) {
        return "The emGuarde device comes with a 30-day money-back guarantee and a 1-year manufacturer's warranty against defects.";
    }
    
    if (message.includes("shipping") || message.includes("delivery") || message.includes("ship")) {
        return "We offer free priority shipping within Canada, with delivery typically taking 3-5 business days. International shipping is available at an additional cost depending on your location. All devices are carefully packaged to ensure they arrive in perfect condition.";
    }
    
    // Comparison questions
    if (message.includes("better than") || message === "compare to" || message.includes("difference between")) {
        return "Unlike simple EMF blockers that only work on a specific device or have very limited range, the emGuarde creates a comprehensive protective field covering up to 400 square feet. Our proprietary technology is more advanced than basic Faraday-type shields, addressing a wider spectrum of electromagnetic frequencies while allowing your devices to function normally.";
    }
    
    if (message.includes("other product") || message.includes("competitor") || message.includes("alternative")) {
        return "The emGuarde device stands out from alternatives with its comprehensive 400 sq ft coverage area, proprietary frequency modulation technology, and elegant plug-and-play design. Many competing products either have very limited range, require complex installation, or interfere with the normal operation of your devices.";
    }
    
    // Usage questions
    if (message.includes("how many") || message.includes("how much") || message.includes("coverage")) {
        return "Each emGuarde device provides coverage for approximately 400 square feet. For larger spaces like open-concept homes or offices, multiple units can be installed. The protective field extends in all directions from the device, so central placement is ideal for maximum coverage.";
    }
    
    if (message.includes("where") && message.includes("place") || message.includes("position") || message.includes("install")) {
        return "For optimal protection, place your emGuarde device in the center of the area you want to protect, ideally in a location where you spend the most time. Common placements include living rooms, bedrooms, home offices, or near your Wi-Fi router. The device plugs into any standard electrical outlet.";
    }
    
    if (message.includes("multiple") && message.includes("room")) {
        return "For multi-room protection, we recommend one emGuarde device for every 400 square feet of living space. Many customers place one in their bedroom for protected sleep and another in their main living area or home office. For whole-home protection, strategic placement of multiple units provides comprehensive coverage.";
    }
    
    if (message.includes("travel") || message.includes("portable") || message.includes("hotel")) {
        return "The emGuarde device is portable and can be used while traveling. Many customers take their device to hotel rooms, vacation rentals, or when staying with family. It simply plugs into any standard electrical outlet, making it easy to maintain your EMF protection wherever you go.";
    }
    
    if (message.includes("office") || message.includes("work") || message.includes("business")) {
        return "The emGuarde device is perfect for office environments where multiple electronic devices create significant EMF exposure. Many professionals report improved focus, reduced fatigue, and greater comfort when working in an emGuarde-protected space. For larger offices, multiple units can provide comprehensive coverage.";
    }
    
    // Scientific questions
    if (message.includes("how") && message.includes("work")) {
        return "The emGuarde device uses advanced frequency modulation technology to help neutralize harmful EMF radiation in your environment. Our proprietary system creates a protective field that helps harmonize the electromagnetic frequencies around you without interfering with your devices' functionality. Simply plug it into any standard outlet, and it creates a protective field covering up to 400 square feet.";
    }
    
    if (message.includes("proof") || message.includes("evidence") || message.includes("study") || message.includes("research")) {
        return "Our technology is based on decades of research into electromagnetic fields and their effects on biological systems. While individual results vary, numerous studies have documented the potential health effects of prolonged EMF exposure. Our own internal testing shows significant harmonization of chaotic electromagnetic fields in spaces where the emGuarde device is installed.";
    }
    
    if (message.includes("test") || message.includes("measure") || message.includes("detect")) {
        return "The effectiveness of the emGuarde device can be measured using specialized EMF meters that detect changes in electromagnetic field characteristics. Our internal testing shows significant improvements in field harmonization within the device's coverage area. Many users also report noticeable subjective improvements in how they feel in protected spaces.";
    }
    
    // Existing categories with expanded keywords
    if (message.includes('price') || message.includes('cost') || message.includes('how much') || message.includes('pricing') || message.includes('expensive') || message.includes('cheap')) {
        return "The emGuarde device is priced at $2,499.99 CAD. This includes free shipping within Canada, a 30-day money-back guarantee, and a 1-year manufacturer's warranty.";
    }
    
    if ((message.includes('how') && message.includes('work')) || message.includes('technology') || message.includes('tech') || message.includes('function')) {
        return "The emGuarde device uses advanced frequency modulation technology to help neutralize harmful EMF radiation in your environment. Our proprietary system creates a protective field that helps harmonize the electromagnetic frequencies around you without interfering with your devices' functionality. Simply plug it into any standard outlet, and it creates a protective field covering up to 400 square feet.";
    }
    
    if (message.includes('safe') || message.includes('safety') || message.includes('harmful') || message.includes('danger')) {
        return "Yes, the emGuarde device is completely safe for humans, pets, and plants. It doesn't emit any harmful radiation itself - instead, it works to harmonize existing electromagnetic fields. It doesn't interfere with the normal operation of your electronic devices, and many users report feeling better almost immediately after installation.";
    }
    
    if (message.includes('coverage') || message.includes('range') || message.includes('area') || message.includes('square') || message.includes('protect')) {
        return "Each emGuarde device provides coverage for approximately 400 square feet. For larger spaces like open-concept homes or offices, multiple units can be installed. The protective field extends in all directions from the device, so central placement is ideal for maximum coverage.";
    }
    
    if (message.includes('install') || message.includes('setup') || message.includes('plug') || message.includes('use')) {
        return "Installation is very simple! Just plug the emGuarde device into any standard electrical outlet. No additional setup or configuration is required. For optimal protection, we recommend placing it in a central location in the room you spend the most time in, or near your Wi-Fi router and other electronics.";
    }
    
    if (message.includes('emf') || message.includes('radiation') || message.includes('electromagnetic') || message.includes('waves') || message.includes('exposure')) {
        return "EMF (Electromagnetic Field) radiation is emitted by electronic devices like cell phones, Wi-Fi routers, computers, and smart meters. While these devices make our lives more convenient, long-term exposure to their radiation may have health implications including fatigue, headaches, sleep disturbances, and more. The emGuarde device helps reduce this exposure in your living or working space without affecting device functionality.";
    }
    
    if (message.includes('benefits') || message.includes('advantage') || message.includes('help') || message.includes('good') || message.includes('improve')) {
        return "Many users report significant benefits after installing the emGuarde device, including improved sleep quality, reduced headaches and fatigue, better concentration, increased energy levels, and an overall sense of wellbeing. The device is especially helpful for those who are sensitive to EMF or who spend long hours around electronic devices.";
    }
    
    if (message.includes('payment') || message.includes('financing') || message.includes('installments') || message.includes('pay') || message.includes('buy')) {
        return "We accept all major credit cards and PayPal. All transactions are securely processed and your payment information is never stored on our servers.";
    }
    
    if (message.includes('contact') || message.includes('support') || message.includes('customer service') || message.includes('help') || message.includes('question')) {
        return "You can contact our support team through the contact form on this website, or email us directly at support@emguarde.com. Our customer service team is available Monday through Friday, 9am to 5pm EST, and typically responds within 24 hours.";
    }
    
    if (message.includes('battery') || message.includes('power') || message.includes('electricity') || message.includes('energy') || message.includes('consumption')) {
        return "The emGuarde device plugs directly into a standard electrical outlet and uses minimal electricity (less than a typical LED light bulb). There are no batteries to replace, and it's designed to operate continuously 24/7 for years of reliable protection.";
    }
    
    if (message.includes('maintenance') || message.includes('clean') || message.includes('care') || message.includes('replace')) {
        return "The emGuarde requires no maintenance or cleaning. Once plugged in, it will continue to work effectively for years. There are no filters to replace or components that wear out under normal use.";
    }
    
    // General purpose questions
    if (message.includes('what') && (message.includes('do') || message.includes('does') || message.includes('is'))) {
        return "The emGuarde device is an advanced EMF protection system that shields you from harmful electromagnetic radiation emitted by electronics like Wi-Fi routers, cell phones, and computers. It uses proprietary frequency modulation technology to create a protective field covering up to 400 square feet, helping to reduce potential health impacts of EMF exposure.";
    }
    
    // Greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('greetings')) {
        return "Hello! How can I help you with EMF protection today?";
    }
    
    // Thanks
    if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate')) {
        return "You're welcome! Is there anything else I can help you with about the emGuarde device or EMF protection?";
    }
    
    // Add these additional question patterns to the getBotResponse function
    if (message.includes("radiation") || message.includes("harmful") || message.includes("dangerous")) {
        return "EMF radiation from everyday electronics like Wi-Fi routers, cell phones, and smart meters has been linked to various health concerns including headaches, fatigue, sleep disturbances, and more serious long-term issues. The emGuarde device helps harmonize these electromagnetic fields to reduce their potential negative impact on your health.";
    }

    if (message.includes("scientific") || message.includes("proven") || message.includes("evidence") || message.includes("studies")) {
        return "There is a growing body of scientific research examining the effects of electromagnetic fields on biological systems. While research is ongoing, many studies have documented potential health effects from prolonged EMF exposure. Our technology is based on decades of research into frequency harmonization and its effects on chaotic electromagnetic fields.";
    }

    if (message.includes("installation") || message.includes("setup") || message.includes("install")) {
        return "Installing the emGuarde device is extremely simple. Just plug it into any standard wall outlet in the area you want to protect. For optimal coverage, place it centrally in the room where you spend the most time. No additional setup or configuration is required - it begins working immediately upon being plugged in.";
    }

    if (message.includes("battery") || message.includes("power") || message.includes("electricity")) {
        return "The emGuarde device plugs directly into a standard wall outlet and uses minimal electricity - less than a typical LED light bulb. It does not contain batteries and needs to remain plugged in to provide continuous protection. The device is designed to be energy-efficient and will not significantly impact your electricity bill.";
    }

    if (message.includes("maintenance") || message.includes("clean") || message.includes("care")) {
        return "The emGuarde device requires no maintenance or special care. Once plugged in, it will continue to function effectively for years. Occasionally wiping it with a dry cloth to remove dust is all that's needed. There are no filters to replace or components that wear out under normal use.";
    }

    if (message.includes("lifetime") || message.includes("how long") || message.includes("last")) {
        return "The emGuarde device is built to last with high-quality components. Under normal conditions, it should provide effective protection for many years. The device comes with a 1-year manufacturer's warranty, but its expected operational lifetime is 5-7 years or more with proper care.";
    }

    if (message.includes("international") || message.includes("worldwide") || message.includes("global")) {
        return "Yes, we ship the emGuarde device internationally. Shipping costs and delivery times vary by location. The device works with electrical systems worldwide, though you may need a simple plug adapter (not included) for countries with different outlet configurations. Please note that international orders may be subject to customs fees or import duties.";
    }

    if (message.includes("business") || message.includes("corporate") || message.includes("office")) {
        return "The emGuarde device is perfect for business environments. Many companies install them in offices, conference rooms, and other workspaces to create a healthier environment for employees. For business or bulk orders, please contact our sales team at sales@emguarde.com for special corporate pricing and deployment recommendations.";
    }

    if (message.includes("doctor") || message.includes("medical") || message.includes("health professional")) {
        return "Many health professionals recommend the emGuarde device to their patients concerned about EMF exposure. We offer special programs for medical practitioners who wish to provide emGuarde devices to their patients. Please contact our professional services team for more information about our healthcare provider program.";
    }
    
    if (message.includes("compare") || message.includes("better than") || message.includes("difference")) {
        return "Unlike basic EMF blockers with limited range or functionality, the emGuarde device creates a comprehensive protective field covering up to 400 square feet. Our proprietary technology harmonizes a wide spectrum of electromagnetic frequencies while allowing your devices to function normally. Many competing products either have very limited range, require complex installation, or interfere with device operation.";
    }
    
    // Default response
    return "I'm not sure I understand your question about EMF protection or the emGuarde device. You can ask about how it works, pricing, installation, benefits, or any other aspects of our product.";
}

// Global send message function - completely standalone
function sendMessage() {
    console.log("sendMessage function called");
    
    // Get elements directly each time to avoid stale references
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    
    if (!userInput || !chatMessages) {
        console.error("Chat elements not found:", { userInput, chatMessages });
        return;
    }
    
    const message = userInput.value.trim();
    if (message === '') {
        console.log("Empty message, not sending");
        return;
    }
    
    console.log("Processing user message:", message);
    
    try {
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
        
        // Get bot response
        const botResponse = getBotResponse(message);
        console.log("Bot response generated:", botResponse);
        
        // Process the message and get response after a delay
        setTimeout(function() {
            try {
                // Remove typing indicator if it still exists
                if (chatMessages.contains(typingIndicator)) {
                    chatMessages.removeChild(typingIndicator);
                }
                
                // Add bot response
                const botMessageElement = document.createElement('div');
                botMessageElement.className = 'message bot';
                botMessageElement.textContent = botResponse;
                chatMessages.appendChild(botMessageElement);
                
                // Scroll to bottom again
                chatMessages.scrollTop = chatMessages.scrollHeight;
                console.log("Bot response displayed successfully");
            } catch (error) {
                console.error("Error displaying bot response:", error);
            }
        }, 1000);
    } catch (error) {
        console.error("Error in sendMessage function:", error);
    }
}

// Make sure window.sendMessage is available globally
window.sendMessage = sendMessage;

// Chat functionality - completely rewritten
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing chat functionality on DOMContentLoaded");
    initChat();
});

// Also initialize on window load for redundancy
window.addEventListener('load', function() {
    console.log("Initializing chat functionality on window load");
    initChat();
});

// Separate function to initialize chat
function initChat() {
    try {
        console.log("Setting up chat functionality");
        
        // Get chat elements
        const chatToggle = document.getElementById('chat-toggle');
        const chatClose = document.getElementById('chat-close');
        const chatContainer = document.querySelector('.chat-container');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');
        
        console.log("Chat elements found:", {
            chatToggle: !!chatToggle,
            chatClose: !!chatClose,
            chatContainer: !!chatContainer,
            userInput: !!userInput,
            sendButton: !!sendButton
        });
        
        if (!chatToggle || !chatContainer) {
            console.error("Critical chat elements missing");
            return;
        }
        
        // Toggle chat visibility
        chatToggle.onclick = function() {
            console.log("Chat toggle clicked");
            chatContainer.classList.toggle('active');
            this.classList.add('notification-read');
        };
        
        // Close chat
        if (chatClose) {
            chatClose.onclick = function() {
                console.log("Chat close clicked");
                chatContainer.classList.remove('active');
            };
        }
        
        // Send message on button click
        if (sendButton) {
            sendButton.onclick = function() {
                console.log("Send button clicked");
                handleChatMessage();
            };
        }
        
        // Send message on Enter key
        if (userInput) {
            userInput.onkeypress = function(e) {
                if (e.key === 'Enter') {
                    console.log("Enter key pressed in chat input");
                    e.preventDefault();
                    handleChatMessage();
                }
            };
        }
        
        console.log("Chat initialization complete");
    } catch (error) {
        console.error("Error initializing chat:", error);
    }
}

// Function to handle chat messages
function handleChatMessage() {
    try {
        console.log("Handling chat message");
        
        // Get elements directly
        const userInput = document.getElementById('user-input');
        const chatMessages = document.getElementById('chat-messages');
        
        if (!userInput || !chatMessages) {
            console.error("Chat message elements not found");
            return;
        }
        
        const message = userInput.value.trim();
        if (!message) {
            console.log("Empty message, not sending");
            return;
        }
        
        console.log("Processing message:", message);
        
        // Add user message
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'message user';
        userMessageElement.textContent = message;
        chatMessages.appendChild(userMessageElement);
        
        // Clear input
        userInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot typing';
        typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Get bot response after delay
        setTimeout(function() {
            // Remove typing indicator
            chatMessages.removeChild(typingIndicator);
            
            // Get and display bot response
            const botResponse = getBotResponse(message);
            console.log("Bot response:", botResponse);
            
            const botMessageElement = document.createElement('div');
            botMessageElement.className = 'message bot';
            botMessageElement.textContent = botResponse;
            chatMessages.appendChild(botMessageElement);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    } catch (error) {
        console.error("Error handling chat message:", error);
    }
}

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

// Add this code for a more robust PayPal button implementation
document.addEventListener('DOMContentLoaded', function() {
    // Get PayPal container element
    const paypalContainer = document.getElementById('paypal-button-container');
    
    // Check if container exists
    if (!paypalContainer) {
        console.error("PayPal container not found");
        return;
    }
    
    // Hard-code client ID directly to avoid any config issues
    let clientId = 'ARS0c4s7qfFkHhF-aeCdkx40HxH6lRVCG7m-xl6Yhl7auv0IHqc42KAsUxxB30949Xh2DR89kSwYtL9h'; // Live
    
    // Check for GitHub Pages
    if (window.location.hostname.includes('github.io') || 
        window.location.hostname.includes('mexemexe02')) {
        clientId = 'AWjhgw8o149iP-AtwrcjtThKPuHcs5MzrrzALxtw2--JrLJ9Iv0-AjT2A7XEhjrOH0mspjyldVL8iO6G'; // Sandbox
    }
    
    console.log("PayPal initialization with client ID:", clientId);
    console.log("Current hostname:", window.location.hostname);
    
    // Clear any existing content and add a loading indicator
    paypalContainer.innerHTML = '<div class="loading">Loading payment options...</div>';
    
    // Create and append the PayPal script
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=CAD`;
    
    script.onload = function() {
        console.log("PayPal SDK loaded successfully");
        
        // Clear the loading indicator
        paypalContainer.innerHTML = '';
        
        // Render the PayPal buttons
        paypal.Buttons({
            // Configure the button style
            style: {
                layout: 'vertical',  // vertical | horizontal
                color:  'blue',      // gold | blue | silver | black
                shape:  'rect',      // pill | rect
                label:  'paypal'     // paypal | checkout | buynow
            },
            
            // Set up the transaction
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: '2499.99',
                            currency_code: 'CAD'
                        },
                        description: 'emGuarde EMF Protection Device'
                    }]
                });
            },
            
            // Handle approved transactions
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    // Show a success message
                    console.log('Transaction completed by ' + details.payer.name.given_name, details);
                    
                    // Display success message to user
                    paypalContainer.innerHTML = `
                        <div class="success-message">
                            <h3>Thank you for your purchase, ${details.payer.name.given_name}!</h3>
                            <p>Transaction ID: ${details.id}</p>
                            <p>We'll process your order right away.</p>
                        </div>
                    `;
                });
            },
            
            // Handle errors
            onError: function(err) {
                console.error('PayPal Error:', err);
                paypalContainer.innerHTML = `
                    <div class="error-message">
                        <p>There was an error processing your payment. Please try again or contact support.</p>
                        <button onclick="window.location.reload()">Try Again</button>
                    </div>
                `;
            }
        }).render('#paypal-button-container');
    };
    
    script.onerror = function(e) {
        console.error("Failed to load PayPal SDK", e);
        paypalContainer.innerHTML = `
            <div class="error-message">
                <p>Unable to load payment system. Please refresh the page or try another browser.</p>
                <button onclick="window.location.reload()">Refresh Page</button>
            </div>
        `;
    };
    
    document.body.appendChild(script);
});

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
    // Find the hero buy button
    const heroBuyButton = document.getElementById('hero-buy-button');
    
    if (heroBuyButton) {
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

// Direct test for chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log("Testing chatbot functionality...");
    
    // Log all chat elements to verify they're found
    console.log("Chat toggle:", document.getElementById('chat-toggle'));
    console.log("Chat close:", document.getElementById('chat-close'));
    console.log("Chat container:", document.querySelector('.chat-container'));
    console.log("User input:", document.getElementById('user-input'));
    console.log("Send button:", document.getElementById('send-button'));
    console.log("Chat messages:", document.getElementById('chat-messages'));
    
    // Test getBotResponse function directly
    console.log("Test response for 'hello':", getBotResponse('hello'));
    console.log("Test response for 'what does this do':", getBotResponse('what does this do'));
    console.log("Test response for 'how much':", getBotResponse('how much'));
});

// Update the reCAPTCHA execution
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    grecaptcha.ready(function() {
        grecaptcha.execute('6LfgqeMqAAAAAHE-UM1rD-sGBsjBFnyX-Ey3c0Sh', {action: 'submit'}).then(function(token) {
            // Add the token to your form
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'g-recaptcha-response';
            input.value = token;
            document.getElementById('contact-form').appendChild(input);
            
            // Submit the form
            submitContactForm(document.getElementById('contact-form'));
        });
    });
});

// Initialize email field for reply-to
document.addEventListener('DOMContentLoaded', function() {
    const emailField = document.getElementById('email-field');
    const replyToField = document.getElementById('email-replyto');
    
    if (emailField && replyToField) {
        // Set initial value
        replyToField.value = emailField.value;
        
        // Update on change
        emailField.addEventListener('input', function() {
            replyToField.value = this.value;
        });
    }
    
    // Check for form submission success parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('formsubmitted') === 'true') {
        alert('Thank you for your message! We will get back to you soon.');
        // Remove the parameter from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
});

// Safely get config values with fallbacks
function getConfigValue(key, fallback = '') {
    return (window.CONFIG && window.CONFIG[key]) ? window.CONFIG[key] : fallback;
}

// Use this function when accessing keys
const recaptchaSiteKey = getConfigValue('RECAPTCHA_SITE_KEY');
const web3FormsKey = getConfigValue('WEB3FORMS_KEY');

// CONSOLIDATED VIDEO CONTROL - replace both existing video control sections
document.addEventListener('DOMContentLoaded', function() {
    // Find all YouTube video iframes - more careful selection
    const videoElements = document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtu.be"]');
    const volumeToggleButton = document.getElementById('video-volume-toggle');
    
    console.log("Found video elements:", videoElements.length);
    console.log("Found volume toggle button:", volumeToggleButton ? true : false);
    
    // If there are no videos or no toggle button, exit early
    if (videoElements.length === 0 || !volumeToggleButton) {
        console.log("Video feature not fully available on this page");
        // Hide the button if it exists but there are no videos
        if (volumeToggleButton && videoElements.length === 0) {
            volumeToggleButton.style.display = 'none';
        }
        return;
    }
    
    // Ensure all videos have the YouTube API enabled
    videoElements.forEach(video => {
        try {
            // Safety check for src attribute
            if (!video || !video.getAttribute || !video.getAttribute('src')) {
                console.log("Skipping invalid video element");
                return;
            }
            
            let src = video.getAttribute('src');
            
            try {
                // Create a URL object to handle parameters properly
                let videoUrl = new URL(src, window.location.origin);
                
                // Add required parameters
                videoUrl.searchParams.set('enablejsapi', '1');
                videoUrl.searchParams.set('origin', window.location.origin);
                
                // Keep autoplay if it was there
                if (src.includes('autoplay=1')) {
                    videoUrl.searchParams.set('autoplay', '1');
                }
                
                // Set the updated src
                video.setAttribute('src', videoUrl.href);
                console.log('Updated YouTube iframe with API enabled:', videoUrl.href);
            } catch (urlError) {
                // Fallback for invalid URLs
                console.error("Error parsing video URL:", urlError);
                
                // Manual URL parameter handling as fallback
                if (!src.includes('enablejsapi=1')) {
                    src = src.includes('?') ? 
                        src + '&enablejsapi=1&origin=' + encodeURIComponent(window.location.origin) : 
                        src + '?enablejsapi=1&origin=' + encodeURIComponent(window.location.origin);
                    video.setAttribute('src', src);
                }
            }
        } catch (e) {
            console.error("Error updating video:", e);
        }
    });
    
    // Set up the volume toggle button
    let isMuted = false;
    
    // Set initial appearance
    volumeToggleButton.classList.add('unmuted');
    volumeToggleButton.style.display = 'flex';
    
    volumeToggleButton.addEventListener('click', function() {
        console.log("Volume toggle button clicked");
        
        // Toggle mute state
        isMuted = !isMuted;
        
        // Update button appearance
        if (isMuted) {
            volumeToggleButton.classList.remove('unmuted');
            console.log("Setting videos to muted");
        } else {
            volumeToggleButton.classList.add('unmuted');
            console.log("Setting videos to unmuted");
        }
        
        // Send message to all videos
        videoElements.forEach(video => {
            try {
                const command = {
                    event: 'command',
                    func: isMuted ? 'mute' : 'unMute',
                    args: []
                };
                
                console.log("Sending to video:", JSON.stringify(command));
                video.contentWindow.postMessage(JSON.stringify(command), '*');
            } catch (e) {
                console.error("Error sending command to video:", e);
            }
        });
    });
    
    console.log("Volume toggle button setup complete");
    
    // Add listener for messages from iframes
    window.addEventListener('message', function(event) {
        if (event.data && typeof event.data === 'string' && event.data.includes('YouTube')) {
            console.log("YouTube API message:", event.data);
        }
    });
}); 