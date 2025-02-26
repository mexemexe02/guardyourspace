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

// Enhanced chatbot system
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatToggle = document.getElementById('chat-toggle');
    const chatClose = document.getElementById('chat-close');
    const chatContainer = document.querySelector('.chat-container');

    // Chat state management
    let chatContext = {
        lastTopic: null,
        conversationHistory: [],
        suggestedFollowUps: []
    };

    // Question categories for better organization
    const categories = {
        PRODUCT: 'product',
        TECHNICAL: 'technical',
        EMF: 'emf',
        USAGE: 'usage',
        SAFETY: 'safety',
        PURCHASE: 'purchase',
        SHIPPING: 'shipping',
        WARRANTY: 'warranty',
        HEALTH: 'health',
        COMPARISON: 'comparison',
        LOCATION: 'location'
    };

    // Knowledge base with categorized responses
    const knowledgeBase = [
        {
            category: categories.PRODUCT,
            patterns: ['what is', 'tell me about', 'describe', 'explain what', 'what does it do'],
            keywords: ['emguarde', 'device', 'product', 'this thing'],
            response: "emGuarde is a state-of-the-art EMF protection device designed to shield you from harmful electromagnetic radiation. It uses advanced technology to create a protective field that helps reduce EMF exposure in your living or working space.",
            followUps: ["How does it work?", "What area does it cover?", "Is it safe?"]
        },
        {
            category: categories.TECHNICAL,
            patterns: ['how does', 'how it works', 'technology', 'mechanism', 'function'],
            keywords: ['work', 'technology', 'function', 'operate'],
            response: "emGuarde works through a proprietary technology that helps neutralize and reduce electromagnetic fields (EMF). It creates a protective field that helps minimize the effects of EMF radiation from various sources like Wi-Fi routers, cell phones, smart meters, and other electronic devices.",
            followUps: ["What area does it cover?", "Is it scientifically proven?", "Technical specifications?"]
        },
        {
            category: categories.TECHNICAL,
            patterns: ['specs', 'specifications', 'technical details', 'dimensions'],
            keywords: ['specifications', 'specs', 'technical', 'dimensions', 'size', 'weight'],
            response: "emGuarde operates on standard 110-240V power supply, consumes less than 5 watts of power, and creates a protective field covering up to 400 square feet. The device measures 6x4x2 inches and weighs approximately 1.2 pounds.",
            followUps: ["How do I install it?", "What's the power consumption?", "Is it portable?"]
        },
        {
            category: categories.EMF,
            patterns: ['what is emf', 'explain emf', 'define emf'],
            keywords: ['emf', 'electromagnetic', 'radiation', 'fields'],
            response: "EMF (Electromagnetic Field) radiation is energy that's emitted by both natural and man-made sources. Common sources include power lines, Wi-Fi routers, cell phones, microwave ovens, and other electronic devices. While some EMF exposure is normal, excessive exposure may cause health concerns.",
            followUps: ["What are EMF dangers?", "Common EMF sources?", "How does emGuarde help?"]
        },
        {
            category: categories.EMF,
            patterns: ['dangers', 'harmful', 'health risks', 'problems with'],
            keywords: ['dangers', 'harmful', 'risks', 'problems', 'issues', 'health concerns'],
            response: "Studies suggest that prolonged exposure to high levels of EMF radiation may be associated with various health issues including headaches, fatigue, sleep disturbances, and other concerns. emGuarde helps reduce your exposure to these potentially harmful fields.",
            followUps: ["What are common EMF sources?", "Scientific evidence?", "Health benefits?"]
        },
        {
            category: categories.USAGE,
            patterns: ['install', 'setup', 'how to use', 'how do i'],
            keywords: ['install', 'setup', 'use', 'start', 'begin'],
            response: "Installation is simple: 1. Choose a central location in the area you want to protect. 2. Plug the emGuarde device into any standard electrical outlet. 3. The device will automatically begin working, indicated by the power LED. No additional setup required.",
            followUps: ["What area does it cover?", "Do I need multiple devices?", "Maintenance required?"]
        },
        {
            category: categories.USAGE,
            patterns: ['coverage', 'area', 'how much space', 'square feet', 'range'],
            keywords: ['coverage', 'area', 'space', 'range', 'square feet', 'sq ft'],
            response: "One emGuarde device effectively covers up to 400 square feet (approximately 37 square meters). For larger spaces, multiple units may be recommended. The protective field works in a roughly circular pattern from the device's location.",
            followUps: ["Do I need multiple devices?", "Where should I place it?", "Does it work through walls?"]
        },
        {
            category: categories.PURCHASE,
            patterns: ['cost', 'price', 'how much', 'pricing'],
            keywords: ['cost', 'price', 'pricing', 'expensive', 'cheap', 'afford'],
            response: "The emGuarde device is priced at $2,499.99. This includes free shipping within the continental US.",
            followUps: ["Payment options?", "Financing available?", "Return policy?"]
        },
        {
            category: categories.PURCHASE,
            patterns: ['payment', 'pay', 'methods', 'options for paying'],
            keywords: ['payment', 'pay', 'credit card', 'paypal', 'financing'],
            response: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and offer financing options through Affirm for qualified customers. We also accept bank transfers for business purchases.",
            followUps: ["Financing details?", "Bulk discounts?", "How to order?"]
        },
        {
            category: categories.SHIPPING,
            patterns: ['shipping', 'delivery', 'when will i get', 'how long'],
            keywords: ['shipping', 'delivery', 'ship', 'receive', 'mail'],
            response: "We offer free priority shipping within the continental United States. International shipping is available at additional cost. Typical delivery time is 3-5 business days domestically, 7-14 days internationally.",
            followUps: ["International shipping?", "Track my order?", "Return policy?"]
        },
        {
            category: categories.WARRANTY,
            patterns: ['warranty', 'guarantee', 'if it breaks', 'support'],
            keywords: ['warranty', 'guarantee', 'breaks', 'support', 'help', 'service'],
            response: "Your emGuarde device comes with a comprehensive warranty. Please contact our support team for detailed warranty information.",
            followUps: ["Technical support?", "How to claim warranty?", "Expected lifespan?"]
        },
        {
            category: categories.HEALTH,
            patterns: ['benefits', 'health improvements', 'how will it help', 'better health'],
            keywords: ['benefits', 'health', 'improvements', 'better', 'help', 'improve'],
            response: "Users report various benefits including better sleep, reduced headaches, improved focus, and decreased fatigue. While individual results may vary, many customers notice improvements within the first few weeks of use.",
            followUps: ["Scientific evidence?", "How long until results?", "Customer testimonials?"]
        },
        {
            category: categories.LOCATION,
            patterns: ['where', 'which places', 'locations', 'can i use'],
            keywords: ['where', 'places', 'locations', 'use', 'home', 'office'],
            response: "emGuarde can be used in any indoor space including:\n- Homes (bedrooms, living rooms, home offices)\n- Office buildings\n- Medical facilities\n- Schools and universities\n- Hotels and hospitality venues\n- Retail spaces\nNote: The device needs to be plugged into a standard power outlet.",
            followUps: ["Outdoor use?", "Multiple devices?", "Best placement?"]
        }
    ];

    // Add missing safety responses and ensure all follow-up questions have answers
    const safetyResponses = [
        {
            category: categories.SAFETY,
            patterns: ['is it safe', 'safety concerns', 'safe to use', 'any dangers'],
            keywords: ['safe', 'safety', 'dangerous', 'harmful', 'risk'],
            response: "Yes, emGuarde is completely safe for humans, pets, and plants. It doesn't emit any harmful radiation itself and is certified to meet all relevant safety standards. It's designed to reduce existing EMF radiation rather than adding new fields.",
            followUps: ["Is it safe for children?", "Is it safe for pets?", "Any side effects?"]
        },
        {
            category: categories.SAFETY,
            patterns: ['safe for children', 'kids', 'babies', 'pregnancy'],
            keywords: ['children', 'kids', 'babies', 'baby', 'pregnant', 'pregnancy'],
            response: "emGuarde is completely safe for children of all ages, including infants. In fact, many parents specifically purchase emGuarde to reduce EMF exposure for their children, as some research suggests children may be more sensitive to EMF radiation.",
            followUps: ["Is it safe for pets?", "Where should I place it in a child's room?", "How many do I need for a family home?"]
        },
        {
            category: categories.SAFETY,
            patterns: ['safe for pets', 'animals', 'dogs', 'cats'],
            keywords: ['pets', 'animals', 'dogs', 'cats', 'dog', 'cat'],
            response: "emGuarde is completely safe for all pets. Animals may actually be more sensitive to EMF radiation than humans, so many pet owners report their animals seem more relaxed and comfortable after installing emGuarde devices.",
            followUps: ["Any maintenance required?", "How long does it last?", "Is it noisy?"]
        },
        {
            category: categories.SAFETY,
            patterns: ['side effects', 'negative effects', 'problems', 'issues'],
            keywords: ['side effects', 'negative', 'problems', 'issues', 'concerns'],
            response: "emGuarde has no known side effects. It doesn't emit any harmful radiation or fields. Most users report only positive effects such as better sleep, reduced headaches, and improved concentration after reducing their EMF exposure.",
            followUps: ["How do I know it's working?", "Scientific evidence?", "Certification standards?"]
        },
        {
            category: categories.SAFETY,
            patterns: ['certification', 'standards', 'testing', 'approved'],
            keywords: ['certification', 'certified', 'standards', 'testing', 'approved', 'fcc', 'ce'],
            response: "emGuarde meets all FCC safety standards and is CE certified. It's been tested by independent laboratories for both safety and effectiveness in EMF reduction.",
            followUps: ["Scientific evidence?", "How to verify it's working?", "Who should use it?"]
        },
        {
            category: categories.TECHNICAL,
            patterns: ['scientific evidence', 'proof', 'studies', 'research'],
            keywords: ['evidence', 'proof', 'studies', 'research', 'scientific', 'proven'],
            response: "emGuarde's effectiveness has been demonstrated through various field measurements and testing. Independent EMF measurements show significant reduction in electromagnetic field strength within the protected area. While we don't make specific health claims, many users report improved wellbeing after installation.",
            followUps: ["How to measure EMF?", "Customer testimonials?", "How long until results?"]
        },
        {
            category: categories.USAGE,
            patterns: ['how do i know', 'verify', 'working', 'effective'],
            keywords: ['know', 'verify', 'working', 'effective', 'measure', 'test'],
            response: "You can verify emGuarde is working by using an EMF meter to measure radiation levels before and after installation. Many users also report subjective improvements in sleep quality, reduced headaches, and better concentration. The device has a status light indicating it's functioning properly.",
            followUps: ["Where can I get an EMF meter?", "How long until I notice effects?", "What results can I expect?"]
        },
        {
            category: categories.USAGE,
            patterns: ['maintenance', 'upkeep', 'clean', 'service'],
            keywords: ['maintenance', 'upkeep', 'clean', 'service', 'maintain'],
            response: "emGuarde requires minimal maintenance. Simply ensure it remains plugged in and check the indicator light periodically. The device is designed for continuous operation and has no parts that need regular replacement.",
            followUps: ["How long does it last?", "Power consumption?", "What if it breaks?"]
        },
        {
            category: categories.USAGE,
            patterns: ['how long', 'lifespan', 'lifetime', 'replace'],
            keywords: ['long', 'lifespan', 'lifetime', 'replace', 'last', 'years'],
            response: "emGuarde devices are built to last with high-quality components. The expected lifespan is 10+ years with normal use. There are no parts that wear out or need replacement under normal operating conditions.",
            followUps: ["Warranty coverage?", "Power consumption?", "Can I move it to different locations?"]
        },
        {
            category: categories.USAGE,
            patterns: ['power consumption', 'electricity', 'energy use', 'watts'],
            keywords: ['power', 'electricity', 'energy', 'watts', 'consumption', 'bill'],
            response: "emGuarde consumes less than 5 watts of electricity, which is less than a typical LED light bulb. The annual electricity cost is minimal, typically less than $5 per year depending on your local electricity rates.",
            followUps: ["Can I unplug it sometimes?", "Does it need to be on 24/7?", "Any maintenance required?"]
        },
        {
            category: categories.USAGE,
            patterns: ['multiple devices', 'more than one', 'several units'],
            keywords: ['multiple', 'more', 'several', 'many', 'units', 'devices'],
            response: "Yes, you can use multiple emGuarde devices for larger spaces. We recommend one device per 400 square feet. The devices work harmoniously together without interference. For optimal protection in a typical home, many customers place one in the bedroom and one in the main living area.",
            followUps: ["Bulk discounts?", "Best placement?", "Do they interfere with each other?"]
        },
        {
            category: categories.USAGE,
            patterns: ['best placement', 'where to put', 'location', 'position'],
            keywords: ['placement', 'put', 'location', 'position', 'where', 'place'],
            response: "For optimal protection, place your emGuarde in a central location in the room you want to protect. Ideally, position it near the main sources of EMF (like Wi-Fi routers, smart meters, or areas with multiple electronic devices). The device should be plugged directly into a wall outlet for best results.",
            followUps: ["Does it work through walls?", "Multiple devices needed?", "Bedroom placement?"]
        }
    ];

    // Add these new responses to the knowledgeBase array
    knowledgeBase.push(...safetyResponses);

    // Add a specific response for EMF meter question
    const emfMeterResponse = {
        category: categories.USAGE,
        patterns: ['where can i get an emf meter', 'emf meter', 'measure emf', 'testing device'],
        keywords: ['emf meter', 'meter', 'measure', 'measuring', 'detector', 'tester'],
        response: "You can purchase EMF meters from several reliable sources:\n\n1. Electronics retailers like Amazon, Best Buy, or Home Depot\n2. Specialized environmental testing suppliers like LessEMF.com or EMFields-Solutions\n3. Professional testing equipment providers like Gigahertz Solutions or Cornet\n\nFor basic home testing, we recommend affordable options like the Trifield TF2 ($168), Meterk EMF Meter ($40), or GQ EMF-390 ($180). These devices can measure different types of EMF radiation including magnetic fields, electric fields, and RF/microwave radiation.",
        followUps: ["How do I use an EMF meter?", "What readings indicate high EMF?", "Do I need a professional assessment?"]
    };

    // Add the EMF meter response to the knowledgeBase
    knowledgeBase.push(emfMeterResponse);

    // Also add a response for how to use an EMF meter
    const usingEmfMeterResponse = {
        category: categories.USAGE,
        patterns: ['how to use emf meter', 'using emf meter', 'how to measure', 'take readings'],
        keywords: ['use meter', 'using meter', 'measure', 'readings', 'testing', 'how to test'],
        response: "To use an EMF meter effectively:\n\n1. First, take baseline readings in different areas of your home before installing emGuarde\n2. Hold the meter at arm's length and move slowly through each room\n3. Pay special attention to areas near electronics, appliances, and Wi-Fi routers\n4. Record readings in different locations for comparison\n5. After installing emGuarde, wait 24 hours and take new measurements in the same locations\n6. Compare before and after readings to see the reduction in EMF levels\n\nMost meters display readings in milliGauss (mG) for magnetic fields, Volts per meter (V/m) for electric fields, or microwatts per square meter (μW/m²) for RF radiation.",
        followUps: ["What are safe EMF levels?", "Do I need different meters for different EMFs?", "Professional vs DIY testing?"]
    };

    // Add the using EMF meter response to the knowledgeBase
    knowledgeBase.push(usingEmfMeterResponse);

    // Add information about safe EMF levels
    const safeLevelsResponse = {
        category: categories.EMF,
        patterns: ['safe levels', 'normal readings', 'acceptable levels', 'dangerous levels'],
        keywords: ['safe levels', 'normal', 'acceptable', 'dangerous', 'high', 'low', 'readings'],
        response: "Generally accepted safety guidelines for EMF exposure:\n\n• Magnetic fields: Below 1 mG (milliGauss) is ideal; 1-3 mG is acceptable; above 3 mG may warrant attention\n• Electric fields: Below 10 V/m (Volts per meter) is ideal; 10-50 V/m is common; above 50 V/m may warrant attention\n• RF radiation: Below 100 μW/m² (microwatts per square meter) is ideal; 100-1000 μW/m² is common in urban areas; above 1000 μW/m² may warrant attention\n\nAfter installing emGuarde, customers typically see reductions of 40-70% in these readings within the device's coverage area.",
        followUps: ["Health effects of high EMF?", "Which areas typically have highest EMF?", "How quickly does emGuarde reduce levels?"]
    };

    // Add the safe levels response to the knowledgeBase
    knowledgeBase.push(safeLevelsResponse);

    // Add a response for "Where can I get one?"
    const whereToGetResponse = {
        category: categories.PURCHASE,
        patterns: ['where can i get one', 'where to buy', 'how to purchase', 'where to purchase', 'buy emguarde'],
        keywords: ['where', 'get', 'buy', 'purchase', 'order', 'acquire'],
        response: "You can purchase emGuarde directly from our website. Simply click the 'Buy Now' button in the pricing section or navigate to the 'Buy Now' section from the menu. We are the exclusive retailer of emGuarde devices to ensure quality control and proper customer support. All purchases include free shipping within the continental US and our 30-day satisfaction guarantee.",
        followUps: ["What payment methods do you accept?", "How long is shipping?", "Is there a warranty?"]
    };

    // Add the response to the knowledgeBase
    knowledgeBase.push(whereToGetResponse);

    // Add a response for outdoor use question
    const outdoorUseResponse = {
        category: categories.USAGE,
        patterns: ['outdoor use', 'outside', 'outdoors', 'exterior', 'patio', 'garden'],
        keywords: ['outdoor', 'outside', 'outdoors', 'exterior', 'patio', 'garden', 'yard'],
        response: "emGuarde is primarily designed for indoor use as it requires a standard power outlet. While the device itself is not weatherproof, you can use it near windows or doors to provide some protection to adjacent outdoor areas like patios or balconies. For outdoor spaces, we recommend placing the device inside, as close as possible to the outdoor area you want to protect, keeping in mind the 400 square foot coverage radius.",
        followUps: ["Is there a battery-powered version?", "What's the effective range?", "Can I use an extension cord?"]
    };

    // Add the outdoor use response to the knowledgeBase
    knowledgeBase.push(outdoorUseResponse);

    // Add response for battery-powered version question
    const batteryVersionResponse = {
        category: categories.PRODUCT,
        patterns: ['battery', 'portable', 'cordless', 'wireless', 'no outlet'],
        keywords: ['battery', 'portable', 'cordless', 'wireless', 'outlet', 'power cord'],
        response: "Currently, emGuarde is only available as a plug-in device that requires a standard power outlet. This ensures consistent, uninterrupted protection. We are researching a battery-powered version for future release, but it's important to note that EMF protection is most effective with continuous operation, which is challenging with battery power.",
        followUps: ["Can I use an extension cord?", "Power consumption?", "Can I unplug it sometimes?"]
    };

    // Add the battery version response to the knowledgeBase
    knowledgeBase.push(batteryVersionResponse);

    // Add response for extension cord question
    const extensionCordResponse = {
        category: categories.USAGE,
        patterns: ['extension cord', 'power strip', 'longer cord', 'reach outlet'],
        keywords: ['extension', 'cord', 'power strip', 'outlet', 'reach', 'distance'],
        response: "Yes, you can use emGuarde with a high-quality extension cord or power strip if needed. However, for optimal performance, we recommend plugging directly into a wall outlet whenever possible. If using an extension cord is necessary, choose a grounded (three-prong), heavy-duty cord with appropriate amperage rating.",
        followUps: ["Best placement?", "Does it need to be visible?", "Can I hide it behind furniture?"]
    };

    // Add the extension cord response to the knowledgeBase
    knowledgeBase.push(extensionCordResponse);

    // Add information about form submissions to the knowledge base
    const formSubmissionsResponse = {
        category: categories.USAGE,
        patterns: ['form submissions', 'contact form', 'see messages', 'check messages'],
        keywords: ['form', 'submissions', 'messages', 'contact', 'email', 'receive'],
        response: "Form submissions from the contact form are sent directly to the email address associated with your Web3Forms account. To access these submissions:\n\n1. Check the email inbox of the address you used when setting up Web3Forms\n2. Look for emails with the subject line 'New emGuarde Website Inquiry'\n3. Each submission will include the sender's name, email, and message\n\nYou can also log in to your Web3Forms dashboard at https://web3forms.com/dashboard to view all submissions in one place.",
        followUps: ["How to set up email forwarding?", "Can I export submissions?", "How to filter spam?"]
    };

    // Add the form submissions response to the knowledgeBase
    knowledgeBase.push(formSubmissionsResponse);

    // Toggle chat visibility
    if (chatToggle) {
        console.log("Chat toggle button found");
        chatToggle.addEventListener('click', function() {
            console.log("Chat toggle clicked");
            chatContainer.classList.toggle('active');
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
    
    // Send message function
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
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
            
            // Add bot response
            const botMessageElement = document.createElement('div');
            botMessageElement.className = 'message bot';
            botMessageElement.textContent = getBotResponse(message);
            chatMessages.appendChild(botMessageElement);
            
            // Scroll to bottom again
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
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
    
    // Bot response logic
    function getBotResponse(message) {
        message = message.toLowerCase();
        
        // Simple response logic based on keywords
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! How can I help you with EMF protection today?";
        } else if (message.includes('what') && (message.includes('do') || message.includes('does')) && (message.includes('this') || message.includes('device') || message.includes('emguarde'))) {
            return "The emGuarde device is an advanced EMF protection system that helps shield you from harmful electromagnetic radiation emitted by electronics like Wi-Fi routers, cell phones, and computers. It uses proprietary frequency modulation technology to create a protective field covering up to 400 square feet, helping to reduce potential health impacts of EMF exposure.";
        } else if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
            return "The emGuarde device is priced at $2,499.99. This includes free shipping within the US, a 30-day money-back guarantee, and a 1-year manufacturer's warranty. We also offer financing options if you're interested.";
        } else if (message.includes('shipping') || message.includes('delivery')) {
            return "We offer free priority shipping within the United States, with delivery typically taking 3-5 business days. International shipping is available at an additional cost depending on your location. All devices are carefully packaged to ensure they arrive in perfect condition.";
        } else if (message.includes('warranty') || message.includes('guarantee')) {
            return "The emGuarde device comes with a 30-day money-back guarantee - if you're not completely satisfied, simply return it for a full refund. It also includes a 1-year manufacturer's warranty against defects. Extended warranty options are available at checkout.";
        } else if ((message.includes('how') && message.includes('work')) || message.includes('technology')) {
            return "The emGuarde device uses advanced frequency modulation technology to help neutralize harmful EMF radiation in your environment. Our proprietary system creates a protective field that helps harmonize the electromagnetic frequencies around you without interfering with your devices' functionality. Simply plug it into any standard outlet, and it creates a protective field covering up to 400 square feet.";
        } else if (message.includes('safe') || message.includes('safety')) {
            return "Yes, the emGuarde device is completely safe for humans, pets, and plants. It doesn't emit any harmful radiation itself - instead, it works to harmonize existing electromagnetic fields. It doesn't interfere with the normal operation of your electronic devices, and many users report feeling better almost immediately after installation.";
        } else if (message.includes('coverage') || message.includes('range') || message.includes('area')) {
            return "Each emGuarde device provides coverage for approximately 400 square feet. For larger spaces like open-concept homes or offices, multiple units can be installed. The protective field extends in all directions from the device, so central placement is ideal for maximum coverage.";
        } else if (message.includes('install') || message.includes('setup')) {
            return "Installation is very simple! Just plug the emGuarde device into any standard electrical outlet. No additional setup or configuration is required. For optimal protection, we recommend placing it in a central location in the room you spend the most time in, or near your Wi-Fi router and other electronics.";
        } else if (message.includes('emf') || message.includes('radiation') || message.includes('electromagnetic')) {
            return "EMF (Electromagnetic Field) radiation is emitted by electronic devices like cell phones, Wi-Fi routers, computers, and smart meters. While these devices make our lives more convenient, long-term exposure to their radiation may have health implications including fatigue, headaches, sleep disturbances, and more. The emGuarde device helps reduce this exposure in your living or working space without affecting device functionality.";
        } else if (message.includes('benefits') || message.includes('advantage') || message.includes('help')) {
            return "Many users report significant benefits after installing the emGuarde device, including improved sleep quality, reduced headaches and fatigue, better concentration, increased energy levels, and an overall sense of wellbeing. The device is especially helpful for those who are sensitive to EMF or who spend long hours around electronic devices.";
        } else if (message.includes('scientific') || message.includes('studies') || message.includes('research') || message.includes('proof')) {
            return "Our technology is based on decades of research into electromagnetic fields and their effects on biological systems. While individual results may vary, numerous studies have documented the potential health effects of prolonged EMF exposure. Our own internal testing shows significant harmonization of chaotic electromagnetic fields in spaces where the emGuarde device is installed.";
        } else if (message.includes('compare') || message.includes('difference') || message.includes('better') || message.includes('other products')) {
            return "Unlike simple EMF blockers that only work on a specific device or have very limited range, the emGuarde creates a comprehensive protective field covering up to 400 square feet. Our proprietary technology is more advanced than basic Faraday-type shields, addressing a wider spectrum of electromagnetic frequencies while allowing your devices to function normally.";
        } else if (message.includes('payment') || message.includes('financing') || message.includes('installments')) {
            return "We accept all major credit cards and PayPal. We also offer financing options through our payment partners, allowing you to pay in monthly installments. All transactions are securely processed and your payment information is never stored on our servers.";
        } else if (message.includes('return') || message.includes('refund') || message.includes('money back')) {
            return "We offer a 30-day money-back guarantee. If you're not completely satisfied with your emGuarde device, simply contact our customer service team and return the device in its original packaging. We'll issue a full refund once we receive the returned item.";
        } else if (message.includes('contact') || message.includes('support') || message.includes('customer service')) {
            return "You can contact our support team through the contact form on this website, or email us directly at support@emguarde.com. Our customer service team is available Monday through Friday, 9am to 5pm EST, and typically responds within 24 hours.";
        } else if (message.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with about the emGuarde device or EMF protection?";
        } else if (message.includes('discount') || message.includes('coupon') || message.includes('promo')) {
            return "We occasionally offer special promotions to new customers. Sign up for our newsletter at the bottom of the page to be notified of upcoming discounts. For bulk orders of multiple units, please contact our sales team for special pricing.";
        } else if (message.includes('battery') || message.includes('power')) {
            return "The emGuarde device plugs directly into a standard electrical outlet and uses minimal electricity (less than a typical LED light bulb). There are no batteries to replace, and it's designed to operate continuously 24/7 for years of reliable protection.";
        } else if (message.includes('maintenance') || message.includes('clean')) {
            return "The emGuarde requires no maintenance or cleaning. Once plugged in, it will continue to work effectively for years. There are no filters to replace or components that wear out under normal use.";
        } else {
            return "I'm not sure I understand your question about EMF protection or the emGuarde device. Could you rephrase it? You can ask about how it works, pricing, installation, benefits, or any other aspects of our product.";
        }
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