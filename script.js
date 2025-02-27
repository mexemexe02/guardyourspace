// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Debug CONFIG object
    console.log("CONFIG object available:", typeof CONFIG !== 'undefined');
    if (typeof CONFIG !== 'undefined') {
        console.log("CONFIG keys:", Object.keys(CONFIG));
        console.log("Web3Forms key exists:", !!CONFIG.WEB3FORMS_KEY);
        console.log("reCAPTCHA key exists:", !!CONFIG.RECAPTCHA_SITE_KEY);
    } else {
        console.error("CONFIG object not found! This will cause form submission to fail.");
    }
    
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

    // === CHATBOT INITIALIZATION - Consolidating initialization code ===
    console.log('Initializing chatbot system');
    
    // Reference to chatbot elements
    const chatButton = document.querySelector('.chat-button');
    const chatInput = document.querySelector('.chat-input input');
    const chatMessages = document.querySelector('.chat-messages');
    
    // Initialize the chatbot data
    const chatQA = { questions: {} };
    
    // Load chatbot data with caching prevention and better error handling
    loadChatbotData();
    
    // Set up chatbot event listeners if elements exist
    if (chatButton && chatInput && chatMessages) {
        console.log('Setting up chatbot event listeners');
        
        // Add event listener for button
        chatButton.addEventListener('click', sendChatMessage);
        
        // Add event listener for Enter key
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendChatMessage();
            }
        });
    } else {
        console.warn('Chat elements not found on page load');
    }
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
        console.log('Initializing contact form functionality');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Add a timeout to reset the button if the submission takes too long
            const buttonResetTimeout = setTimeout(() => {
                console.log('Form submission timeout - resetting button');
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }, 15000); // 15 seconds timeout
            
            // Try to get reCAPTCHA token, with fallback for when it's not available
            try {
                if (typeof grecaptcha !== 'undefined' && grecaptcha.ready) {
                    console.log("Using reCAPTCHA for form submission");
                    
                    grecaptcha.ready(function() {
                        grecaptcha.execute('6LfgqeMqAAAAAHE-UM1rD-sGBsjBFnyX-Ey3c0Sh', {action: 'submit'})
                            .then(function(token) {
                                console.log("reCAPTCHA token obtained");
                                submitFormWithToken(token);
                            })
                            .catch(function(error) {
                                console.error("reCAPTCHA error:", error);
                                console.log("Falling back to submission without reCAPTCHA");
                                submitFormWithToken('');
                            });
                    });
                } else {
                    console.warn("reCAPTCHA not available, submitting without verification");
                    submitFormWithToken('');
                }
            } catch (error) {
                console.error("Error in reCAPTCHA setup:", error);
                submitFormWithToken('');
            }
            
            // Function to submit the form with a token
            function submitFormWithToken(token) {
                // Create form data
                const formData = new FormData(contactForm);
                
                // Add the reCAPTCHA token if available
                if (token) {
                    formData.append('g-recaptcha-response', token);
                }
                
                // Ensure the access key is set
                const accessKey = "f115e690-e290-47ea-9449-c63fa95720b1";
                formData.append('access_key', accessKey);
                console.log("Using Web3Forms access key:", accessKey.substring(0, 5) + "..." + accessKey.substring(accessKey.length - 5));
                
                // Log the form data for debugging (exclude sensitive info)
                console.log("Form submission fields:", Array.from(formData.keys()));
                
                // Use traditional form submission approach
                const originalAction = contactForm.getAttribute('action');
                const originalMethod = contactForm.getAttribute('method');
                
                // Add a hidden iframe for submission without page reload
                const iframe = document.createElement('iframe');
                iframe.name = 'hidden_iframe';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                
                // Set form target to the iframe
                contactForm.setAttribute('target', 'hidden_iframe');
                
                // Create success handler
                iframe.onload = function() {
                    clearTimeout(buttonResetTimeout);
                    
                    // Create and show success message
                    const formContainer = contactForm.parentElement;
                    
                    // Hide the form
                    contactForm.style.display = 'none';
                    
                    // Create success message element
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = `
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>Thank You!</h3>
                        <p>Your message has been sent successfully.</p>
                        <p>We'll get back to you as soon as possible.</p>
                        <button class="send-another-btn">Send Another Message</button>
                    `;
                    
                    // Add success message to the page
                    formContainer.appendChild(successMessage);
                    
                    // Add event listener to "Send Another Message" button
                    const sendAnotherBtn = successMessage.querySelector('.send-another-btn');
                    sendAnotherBtn.addEventListener('click', function() {
                        // Reset form
                        contactForm.reset();
                        
                        // Remove success message
                        formContainer.removeChild(successMessage);
                        
                        // Show form again
                        contactForm.style.display = 'block';
                        
                        // Reset button
                        submitButton.innerHTML = originalButtonText;
                        submitButton.disabled = false;
                    });
                };
                
                // Submit the form directly
                contactForm.submit();
            }
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
        
        // Add minimize button
        const minimizeButton = document.createElement('button');
        minimizeButton.id = 'chat-minimize';
        minimizeButton.innerHTML = '−';
        minimizeButton.title = 'Minimize chat';
        
        // Insert it between the title and close button
        const chatHeader = chatContainer.querySelector('.chat-header');
        if (chatHeader) {
            chatHeader.appendChild(minimizeButton);
            
            // Style the button
            minimizeButton.style.background = 'transparent';
            minimizeButton.style.border = 'none';
            minimizeButton.style.color = 'white';
            minimizeButton.style.fontSize = '18px';
            minimizeButton.style.cursor = 'pointer';
            minimizeButton.style.marginLeft = 'auto';
            minimizeButton.style.marginRight = '10px';
            
            // Add click handler
            minimizeButton.addEventListener('click', function() {
                const chatBody = chatContainer.querySelector('.chat-body');
                const chatInput = chatContainer.querySelector('.chat-input-container');
                
                if (chatBody && chatInput) {
                    // Toggle minimized state
                    if (chatBody.style.display === 'none') {
                        // Expand
                        chatBody.style.display = 'block';
                        chatInput.style.display = 'flex';
                        minimizeButton.innerHTML = '−';
                        minimizeButton.title = 'Minimize chat';
                        chatContainer.style.height = '';  // Reset to CSS value
                    } else {
                        // Minimize
                        chatBody.style.display = 'none';
                        chatInput.style.display = 'none';
                        minimizeButton.innerHTML = '+';
                        minimizeButton.title = 'Expand chat';
                        chatContainer.style.height = '40px';
                    }
                }
            });
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

// Fix PayPal and chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing site functionality...');
    
    // 1. Fix PayPal functionality
    const paypalContainer = document.getElementById('paypal-button-container');
    if (paypalContainer) {
        console.log('PayPal container found, initializing PayPal...');
        
        // Clear any existing content
        paypalContainer.innerHTML = '<div class="loading">Loading payment options...</div>';
        
        // COMPLETELY NEW APPROACH - DIRECT HTML EMBEDDING
        // This is much more reliable across different environments
        
        // Always use sandbox for local development, live for production
        const isLocal = window.location.hostname === '127.0.0.1' || 
                       window.location.hostname === 'localhost';
        
        const clientId = isLocal 
            ? 'AWjhgw8o149iP-AtwrcjtThKPuHcs5MzrrzALxtw2--JrLJ9Iv0-AjT2A7XEhjrOH0mspjyldVL8iO6G' // Sandbox
            : 'ARS0c4s7qfFkHhF-aeCdkx40HxH6lRVCG7m-xl6Yhl7auv0IHqc42KAsUxxB30949Xh2DR89kSwYtL9h'; // Live
        
        console.log('Using PayPal client ID:', clientId, 'on', window.location.hostname);
        
        // Create the PayPal button container
        paypalContainer.innerHTML = `
          <div id="smart-button-container">
            <div style="text-align: center;">
              <div id="paypal-button-container-inner"></div>
            </div>
          </div>
        `;
        
        // Add the PayPal script directly to the page
        const paypalScript = document.createElement('script');
        // Make sure clientId is not empty
        if (!clientId) {
            console.error('PayPal client ID is empty or undefined');
            clientId = isLocal 
                ? 'AWjhgw8o149iP-AtwrcjtThKPuHcs5MzrrzALxtw2--JrLJ9Iv0-AjT2A7XEhjrOH0mspjyldVL8iO6G'
                : 'ARS0c4s7qfFkHhF-aeCdkx40HxH6lRVCG7m-xl6Yhl7auv0IHqc42KAsUxxB30949Xh2DR89kSwYtL9h';
        }
        paypalScript.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&enable-funding=venmo&currency=CAD`;
        console.log('PayPal SDK URL:', paypalScript.src);
        document.body.appendChild(paypalScript);
        
        // Initialize PayPal buttons once the script is loaded
        paypalScript.onload = function() {
          if (window.paypal) {
            paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'paypal'
                },
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
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        console.log('Transaction completed by ' + details.payer.name.given_name, details);
                        
                        paypalContainer.innerHTML = `
                            <div class="success-message">
                                <h3>Thank you for your purchase, ${details.payer.name.given_name}!</h3>
                                <p>Transaction ID: ${details.id}</p>
                                <p>We'll process your order right away.</p>
                            </div>
                        `;
                    });
                },
                onError: function(err) {
                    console.error('PayPal Error:', err);
                    paypalContainer.innerHTML = `
                        <div class="error-message">
                            <p>There was an error processing your payment. Please try again or contact support.</p>
                            <button onclick="window.location.reload()">Try Again</button>
                        </div>
                    `;
                }
            }).render('#paypal-button-container-inner');
          } else {
            console.error('PayPal SDK loaded but window.paypal is not defined');
            paypalContainer.innerHTML = `
              <div class="error-message">
                <p>Payment system temporarily unavailable.</p>
                <button onclick="window.location.reload()" class="retry-button">Retry</button>
              </div>
            `;
          }
        };
        
        // Add error handling for script loading
        paypalScript.onerror = function() {
            console.error('Failed to load PayPal SDK');
            paypalContainer.innerHTML = `
              <div class="error-message">
                <p>Payment system temporarily unavailable.</p>
                <button onclick="window.location.reload()" class="retry-button">Retry</button>
              </div>
            `;
        };
    }
    
    // ... Rest of your script.js code for chat functionality ...
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

// Fix for the null error at line 829
document.addEventListener('DOMContentLoaded', function() {
    // Force scroll to top on page load to ensure video is visible
    window.scrollTo(0, 0);
    
    // Check if element exists before manipulating it (general fix for line 829 error)
    const safeSetAttribute = function(element, attribute, value) {
        if (element) {
            element.setAttribute(attribute, value);
            return true;
        }
        return false;
    };
    
    // Make this function available globally
    window.safeSetAttribute = safeSetAttribute;
    
    // Fix for video visibility
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.paddingTop = '80px';
        heroSection.style.display = 'flex';
        heroSection.style.alignItems = 'flex-start';
    }
    
    // Ensure buy button is working by adding a fresh event listener
    const buyButton = document.getElementById('hero-buy-button');
    if (buyButton) {
        console.log('Reattaching buy button event listener');
        
        // Clone the button to remove any existing listeners
        const newButton = buyButton.cloneNode(true);
        if (buyButton.parentNode) {
            buyButton.parentNode.replaceChild(newButton, buyButton);
            
            // Add a fresh listener
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Buy button clicked - direct handler');
                
                const buySection = document.getElementById('buy');
                if (buySection) {
                    // Scroll with a proper offset
                    const offset = 80;
                    const elementPosition = buySection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Highlight the pricing
                    setTimeout(function() {
                        const pricingBox = document.querySelector('.pricing-box');
                        if (pricingBox) {
                            pricingBox.style.boxShadow = '0 0 30px rgba(231, 76, 60, 0.8)';
                            setTimeout(function() {
                                pricingBox.style.boxShadow = '';
                            }, 2000);
                        }
                    }, 500);
                }
            });
        }
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

// Simplified video controls - replace your current video control code
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const youtubeIframe = document.getElementById('youtube-video');
    const volumeToggleButton = document.getElementById('video-volume-toggle');
    const mobileUnmuteButton = document.getElementById('mobile-unmute-button');
    
    // Log what we found
    console.log("YouTube iframe found:", youtubeIframe ? "Yes" : "No");
    console.log("Volume toggle button found:", volumeToggleButton ? "Yes" : "No");
    console.log("Mobile unmute button found:", mobileUnmuteButton ? "Yes" : "No");
    
    // Function to unmute video
    function unmuteVideo() {
        if (!youtubeIframe) return;
        
        console.log("Attempting to unmute video");
        
        // Method 1: Direct postMessage
        try {
            youtubeIframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'unMute',
                args: []
            }), '*');
            console.log("Sent unmute command via postMessage");
        } catch (e) {
            console.error("Method 1 failed:", e);
        }
        
        // Method 2: Reload with updated URL
        try {
            let src = youtubeIframe.getAttribute('src');
            if (src) {
                // Remove mute parameter if present
                src = src.replace('&mute=1', '').replace('?mute=1&', '?');
                
                // Make sure we have API enabled
                if (!src.includes('enablejsapi=1')) {
                    src = src.includes('?') ? 
                        src + '&enablejsapi=1' : 
                        src + '?enablejsapi=1';
                }
                
                // Add origin if not present
                if (!src.includes('origin=')) {
                    src = src + '&origin=' + encodeURIComponent(window.location.origin);
                }
                
                console.log("Updated video src:", src);
                youtubeIframe.setAttribute('src', src);
            }
        } catch (e) {
            console.error("Method 2 failed:", e);
        }
    }
    
    // Set up desktop volume toggle button
    if (volumeToggleButton) {
        let isMuted = true; // Start muted
        
        volumeToggleButton.addEventListener('click', function() {
            console.log("Volume toggle button clicked");
            isMuted = !isMuted;
            
            if (isMuted) {
                // Mute video
                try {
                    youtubeIframe.contentWindow.postMessage(JSON.stringify({
                        event: 'command',
                        func: 'mute',
                        args: []
                    }), '*');
                    volumeToggleButton.classList.remove('unmuted');
                } catch (e) {
                    console.error("Mute failed:", e);
                }
            } else {
                // Unmute video
                unmuteVideo();
                volumeToggleButton.classList.add('unmuted');
            }
        });
    }
    
    // Set up mobile unmute button
    if (mobileUnmuteButton) {
        mobileUnmuteButton.addEventListener('click', function() {
            console.log("Mobile unmute button clicked");
            unmuteVideo();
            mobileUnmuteButton.textContent = "AUDIO ENABLED";
            
            // Optional: Hide button after a delay
            setTimeout(function() {
                mobileUnmuteButton.style.opacity = '0.5';
            }, 3000);
        });
    }
    
    // Listen for messages from the iframe
    window.addEventListener('message', function(event) {
        try {
            if (typeof event.data === 'string') {
                console.log("Message received from iframe:", event.data);
            }
        } catch (e) {
            console.error("Error processing iframe message:", e);
        }
    });
});

// Improved chatbot minimize function
document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.querySelector('.chat-container');
    const chatMinimize = document.getElementById('chat-minimize');
    const chatHeader = document.querySelector('.chat-header');
    
    // Create chat header controls div if it doesn't exist
    if (chatHeader && !document.querySelector('.chat-controls')) {
        const chatControls = document.createElement('div');
        chatControls.className = 'chat-controls';
        
        // Move buttons into controls
        if (chatMinimize) chatControls.appendChild(chatMinimize);
        if (document.getElementById('chat-close')) {
            chatControls.appendChild(document.getElementById('chat-close'));
        }
        
        chatHeader.appendChild(chatControls);
    }
    
    // Toggle minimize on header click
    if (chatHeader) {
        chatHeader.addEventListener('click', function(e) {
            // Don't minimize if clicking on buttons
            if (e.target.id === 'chat-minimize' || e.target.id === 'chat-close') {
                return;
            }
            
            if (chatContainer) {
                chatContainer.classList.toggle('minimized');
                console.log("Chat minimized: ", chatContainer.classList.contains('minimized'));
            }
        });
    }
    
    // Fix Buy button click event
    const heroBuyButton = document.getElementById('hero-buy-button');
    if (heroBuyButton) {
        heroBuyButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Buy button clicked");
            
            const buySection = document.getElementById('buy');
            if (buySection) {
                const headerOffset = 100;
                const elementPosition = buySection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Flash the pricing box
                setTimeout(function() {
                    const pricingBox = document.querySelector('.pricing-box');
                    if (pricingBox) {
                        pricingBox.style.boxShadow = '0 0 20px rgba(231, 76, 60, 0.7)';
                        
                        setTimeout(function() {
                            pricingBox.style.boxShadow = '';
                        }, 2000);
                    }
                }, 1000);
            }
        });
    }
});

// Updated gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing image gallery');
    
    // Get all thumbnail elements
    const thumbnails = document.querySelectorAll('.thumbnail');
    const featuredImage = document.getElementById('featured-image');
    
    if (thumbnails.length > 0 && featuredImage) {
        console.log(`Found ${thumbnails.length} thumbnails and featured image`);
        
        // Set first thumbnail as active initially
        thumbnails[0].classList.add('active');
        
        // Make sure the featured image is set on page load
        const firstThumbImg = thumbnails[0].querySelector('img');
        if (firstThumbImg) {
            // Get source from data attribute or from src directly
            const imgSrc = firstThumbImg.getAttribute('data-full') || firstThumbImg.src;
            featuredImage.src = imgSrc;
            featuredImage.alt = firstThumbImg.alt || 'Product image';
            console.log(`Set initial featured image to: ${imgSrc}`);
        }
        
        // Add click handlers to all thumbnails
        thumbnails.forEach(function(thumb) {
            thumb.addEventListener('click', function() {
                console.log('Thumbnail clicked');
                
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Get image from this thumbnail
                const thumbImg = this.querySelector('img');
                if (thumbImg && featuredImage) {
                    // Get source from data attribute or from src directly
                    const imgSrc = thumbImg.getAttribute('data-full') || thumbImg.src;
                    featuredImage.src = imgSrc;
                    featuredImage.alt = thumbImg.alt || 'Product image';
                    console.log(`Changed featured image to: ${imgSrc}`);
                }
            });
        });
    } else {
        console.warn('Image gallery elements not found');
    }
});

// Simple direct image changing function that will work with the onclick attribute
function changeImage(src, alt) {
    console.log(`changeImage called with src: ${src}`);
    const featuredImage = document.getElementById('featured-image');
    if (featuredImage) {
        featuredImage.src = src;
        featuredImage.alt = alt || '';
        
        // Update active state of thumbnails
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            // Check if this thumbnail contains the selected image
            const thumbImg = thumb.querySelector('img');
            if (thumbImg) {
                const thumbSrc = thumbImg.getAttribute('data-full') || thumbImg.src;
                // Check if the image source matches or contains the filename
                if (thumbSrc === src || thumbSrc.includes(src.split('/').pop())) {
                    thumb.classList.add('active');
                } else {
                    thumb.classList.remove('active');
                }
            }
        });
    } else {
        console.error('Featured image element not found');
    }
}

// Add navbar scroll effect and mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
        
        // Close menu when clicking a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navLinks.classList.remove('show');
            });
        });
    }
    
    // Add FontAwesome if not already present
    if (!document.querySelector('link[href*="fontawesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(link);
    }
});

// Improve chatbot to read from Q&A file
document.addEventListener('DOMContentLoaded', function() {
    console.log('Setting up improved chatbot with Q&A database');
    
    // Chatbot elements
    const chatButton = document.querySelector('.chat-button');
    const chatInput = document.querySelector('.chat-input input');
    const chatMessages = document.querySelector('.chat-messages');
    const chatQA = {}; // Will store our Q&A data
    
    // Function to load the Q&A data
    function loadChatQA() {
        console.log('Loading chatbot Q&A database');
        
        // Fetch the Q&A file
        fetch('chatbot-qa.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Could not load chatbot Q&A file');
                }
                return response.json();
            })
            .then(data => {
                console.log('Chatbot Q&A loaded successfully', data);
                Object.assign(chatQA, data);
            })
            .catch(error => {
                console.error('Error loading chatbot Q&A:', error);
                // Add fallback questions in case file doesn't load
                chatQA.fallback = "I don't have an answer for that. Please contact our support team.";
                chatQA.questions = {
                    "what is emguarde": "emGuarde is an EMF protection device designed to shield you from harmful electromagnetic radiation.",
                    "how does it work": "emGuarde works by creating a protective field that neutralizes harmful EMF radiation.",
                    "price": "emGuarde is available for $2,499.99 CAD.",
                    "shipping": "We offer worldwide shipping. Standard delivery takes 5-7 business days.",
                    "warranty": "emGuarde comes with a 1-year manufacturer warranty."
                };
            });
    }
    
    // Function to find best matching answer
    function findBestAnswer(message) {
        // Use our improved function to find answers
        console.log("Looking for answer to:", message);
        
        if (!window.chatbotData) {
            // Try to use the original chatQA data if available
            if (chatQA && chatQA.questions) {
                console.log("Using original chatQA data");
                
                // Original search logic
                const normalizedQuestion = message.toLowerCase().replace(/[^\w\s]/g, '');
                
                // Look for exact matches in questions object
                if (chatQA.questions[normalizedQuestion]) {
                    console.log("Found exact match in original data");
                    return chatQA.questions[normalizedQuestion];
                }
                
                // Look for exact matches in root-level additions
                if (chatQA[normalizedQuestion]) {
                    console.log("Found exact match in root data");
                    return chatQA[normalizedQuestion];
                }
                
                // Then look for partial matches in questions
                for (const key in chatQA.questions) {
                    if (key.includes(normalizedQuestion) || normalizedQuestion.includes(key)) {
                        console.log("Found partial match in questions:", key);
                        return chatQA.questions[key];
                    }
                }
                
                // Then look for partial matches in root additions
                for (const key in chatQA) {
                    if (typeof chatQA[key] === 'string' && key !== 'fallback' && 
                        (key.includes(normalizedQuestion) || normalizedQuestion.includes(key))) {
                        console.log("Found partial match in root data:", key);
                        return chatQA[key];
                    }
                }
                
                return chatQA.fallback || "I don't have an answer for that yet.";
            }
            console.warn("No chatbot data loaded yet");
            return "I'm still loading my knowledge base. Please try again in a moment.";
        }
        
        // Normalize the question (lowercase, remove punctuation)
        const normalizedQuestion = message.toLowerCase().replace(/[^\w\s]/g, '');
        
        // If we have window.chatbotData, check all locations
        
        // 1. Check for direct matches in root
        if (window.chatbotData[normalizedQuestion]) {
            console.log("Found direct match in reloaded data root");
            return window.chatbotData[normalizedQuestion];
        }
        
        // 2. Check for direct matches in questions object
        if (window.chatbotData.questions && window.chatbotData.questions[normalizedQuestion]) {
            console.log("Found direct match in reloaded questions data");
            return window.chatbotData.questions[normalizedQuestion];
        }
        
        // 3. Check for partial matches in root
        for (const key in window.chatbotData) {
            if (typeof window.chatbotData[key] === 'string' && key !== 'fallback' &&
                (key.includes(normalizedQuestion) || normalizedQuestion.includes(key))) {
                console.log("Found partial match in reloaded data root:", key);
                return window.chatbotData[key];
            }
        }
        
        // 4. Check for partial matches in questions object
        if (window.chatbotData.questions) {
            for (const key in window.chatbotData.questions) {
                if (key.includes(normalizedQuestion) || normalizedQuestion.includes(key)) {
                    console.log("Found partial match in reloaded questions data:", key);
                    return window.chatbotData.questions[key];
                }
            }
        }
        
        // Use fallback message from either source
        return (window.chatbotData.fallback || chatQA.fallback || 
               "I don't have specific information about that. Can I help you with something else about emGuarde?");
    }
    
    // Function to send a message
    function sendChatMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;
        
        // Create user message element
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'message user-message';
        userMessageElement.textContent = message;
        chatMessages.appendChild(userMessageElement);
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Find the best answer from our Q&A database
        const answer = findBestAnswer(message);
        
        // Simulate thinking with a delay
        setTimeout(function() {
            const botMessageElement = document.createElement('div');
            botMessageElement.className = 'message bot-message';
            botMessageElement.textContent = answer;
            chatMessages.appendChild(botMessageElement);
            
            // Scroll to bottom again
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 800);
    }
    
    // Set up event listeners if chat elements exist
    if (chatButton && chatInput && chatMessages) {
        console.log('Setting up chatbot event listeners');
        
        // Load the Q&A database
        loadChatQA();
        
        // Add event listener for button
        chatButton.addEventListener('click', sendChatMessage);
        
        // Add event listener for Enter key
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendChatMessage();
            }
        });
    } else {
        console.warn('Chat elements not found');
    }
});

// This is the part where the chat input is created
function createChatInterface() {
    // ... existing code ...
    
    // Find where the chat input area is created
    const chatInputArea = document.createElement('div');
    chatInputArea.className = 'chat-input';
    chatInputArea.innerHTML = `
        <div class="input-with-button">
            <input type="text" placeholder="Type your message here...">
            <button class="chat-send-button" title="Send message">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    `;
    
    // ... rest of the function ...
    
    // Add the send button event listener where you set up chat events
    const sendButton = chatContainer.querySelector('.chat-send-button');
    if (sendButton) {
        sendButton.addEventListener('click', function() {
            sendChatMessage();
        });
    }
}

// Improved function to load chatbot data with cache-busting and better error handling
function loadChatbotData() {
    console.log('Loading chatbot Q&A database');
    
    // Cache-busting query parameter
    const url = 'chatbot-qa.json?v=' + new Date().getTime();
    
    // Fetch with timeout
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
    );
    
    Promise.race([
        fetch(url),
        timeoutPromise
    ])
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to load chatbot data: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Chatbot data loaded successfully:', Object.keys(data).length, 'entries');
        
        // Store data in both original location and window property for compatibility
        Object.assign(chatQA, data);
        window.chatbotData = data;
    })
    .catch(error => {
        console.error('Error loading chatbot data:', error);
        
        // Add fallback questions in case file doesn't load
        const fallbackData = {
            fallback: "I don't have an answer for that right now. Please try again later or contact our support team.",
            questions: {
                "what is emguarde": "emGuarde is an EMF protection device designed to shield you from harmful electromagnetic radiation.",
                "how does it work": "emGuarde works by creating a protective field that neutralizes harmful EMF radiation.",
                "price": "emGuarde is available for $2,499.99 CAD.",
                "shipping": "We offer worldwide shipping. Standard delivery takes 5-7 business days.",
                "warranty": "emGuarde comes with a 1-year manufacturer warranty."
            }
        };
        
        // Apply fallback data to both locations
        Object.assign(chatQA, fallbackData);
        window.chatbotData = fallbackData;
    });
}

// Function to send a message
function sendChatMessage() {
    const message = chatInput.value.trim();
    if (message === '') return;
    
    // Create user message element
    const userMessageElement = document.createElement('div');
    userMessageElement.className = 'message user-message';
    userMessageElement.textContent = message;
    chatMessages.appendChild(userMessageElement);
    
    // Clear input
    chatInput.value = '';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Find the best answer from our Q&A database
    const answer = findBestAnswer(message);
    
    // Simulate thinking with a delay
    setTimeout(function() {
        const botMessageElement = document.createElement('div');
        botMessageElement.className = 'message bot-message';
        botMessageElement.textContent = answer;
        chatMessages.appendChild(botMessageElement);
        
        // Scroll to bottom again
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
}

// Function to find best matching answer
function findBestAnswer(message) {
    // Use our improved function to find answers
    console.log("Looking for answer to:", message);
    
    if (!window.chatbotData) {
        // Try to use the original chatQA data if available
        if (chatQA && chatQA.questions) {
            console.log("Using original chatQA data");
            
            // Original search logic
            const normalizedQuestion = message.toLowerCase().replace(/[^\w\s]/g, '');
            
            // Look for exact matches in questions object
            if (chatQA.questions[normalizedQuestion]) {
                console.log("Found exact match in original data");
                return chatQA.questions[normalizedQuestion];
            }
            
            // Look for exact matches in root-level additions
            if (chatQA[normalizedQuestion]) {
                console.log("Found exact match in root data");
                return chatQA[normalizedQuestion];
            }
            
            // Then look for partial matches in questions
            for (const key in chatQA.questions) {
                if (key.includes(normalizedQuestion) || normalizedQuestion.includes(key)) {
                    console.log("Found partial match in questions:", key);
                    return chatQA.questions[key];
                }
            }
            
            // Then look for partial matches in root additions
            for (const key in chatQA) {
                if (typeof chatQA[key] === 'string' && key !== 'fallback' && 
                    (key.includes(normalizedQuestion) || normalizedQuestion.includes(key))) {
                    console.log("Found partial match in root data:", key);
                    return chatQA[key];
                }
            }
            
            return chatQA.fallback || "I don't have an answer for that yet.";
        }
        console.warn("No chatbot data loaded yet");
        return "I'm still loading my knowledge base. Please try again in a moment.";
    }
    
    // Normalize the question (lowercase, remove punctuation)
    const normalizedQuestion = message.toLowerCase().replace(/[^\w\s]/g, '');
    
    // If we have window.chatbotData, check all locations
    
    // 1. Check for direct matches in root
    if (window.chatbotData[normalizedQuestion]) {
        console.log("Found direct match in reloaded data root");
        return window.chatbotData[normalizedQuestion];
    }
    
    // 2. Check for direct matches in questions object
    if (window.chatbotData.questions && window.chatbotData.questions[normalizedQuestion]) {
        console.log("Found direct match in reloaded questions data");
        return window.chatbotData.questions[normalizedQuestion];
    }
    
    // 3. Check for partial matches in root
    for (const key in window.chatbotData) {
        if (typeof window.chatbotData[key] === 'string' && key !== 'fallback' &&
            (key.includes(normalizedQuestion) || normalizedQuestion.includes(key))) {
            console.log("Found partial match in reloaded data root:", key);
            return window.chatbotData[key];
        }
    }
    
    // 4. Check for partial matches in questions object
    if (window.chatbotData.questions) {
        for (const key in window.chatbotData.questions) {
            if (key.includes(normalizedQuestion) || normalizedQuestion.includes(key)) {
                console.log("Found partial match in reloaded questions data:", key);
                return window.chatbotData.questions[key];
            }
        }
    }
    
    // Use fallback message from either source
    return (window.chatbotData.fallback || chatQA.fallback || 
           "I don't have specific information about that. Can I help you with something else about emGuarde?");
}

// Use this function when processing user input