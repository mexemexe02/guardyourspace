// paypal-fix.js - Dedicated fix for PayPal button issues
(function() {
    console.log('PayPal Fix: Initializing');

    // Configuration - Get from CONFIG or use fallback
    const config = {
        clientId: (window.CONFIG && CONFIG.PAYPAL && CONFIG.PAYPAL.LIVE) ? 
                  CONFIG.PAYPAL.LIVE : 
                  'ARS0c4s7qfFkHhF-aeCdkx40HxH6lRVCG7m-xl6Yhl7auv0IHqc42KAsUxxB30949Xh2DR89kSwYtL9h',
        currency: 'CAD',
        defaultAmount: '299.00'
    };

    // IMMEDIATELY hide any duplicate PayPal containers to prevent flashing
    function cleanupDuplicatePayPalContainers() {
        console.log('Aggressively cleaning up duplicate PayPal containers');
        
        // Find all PayPal containers
        const allContainers = document.querySelectorAll('[id^="paypal-button"], .paypal-button-container, .paypal-buttons, [data-paypal-button]');
        
        if (allContainers.length > 1) {
            console.log('Found ' + allContainers.length + ' PayPal containers - keeping only the first one');
            
            // Keep the first one, hide all others
            const keepContainer = allContainers[0];
            console.log('Keeping container:', keepContainer.id || 'unnamed container');
            
            // Force this one to be visible
            keepContainer.style.display = 'block';
            keepContainer.style.visibility = 'visible';
            keepContainer.style.opacity = '1';
            
            // Hide all others with !important 
            allContainers.forEach((container, index) => {
                if (index > 0) {
                    console.log('Hiding container:', container.id || 'unnamed container');
                    container.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; height: 0 !important; overflow: hidden !important;';
                    
                    // Try removing it from DOM if possible
                    try {
                        container.remove();
                    } catch(e) {
                        console.log('Could not remove container, it will remain hidden');
                    }
                }
            });
        }
    }
    
    // Run cleanup immediately
    cleanupDuplicatePayPalContainers();
    
    // And again after a short delay to catch any that appear later
    setTimeout(cleanupDuplicatePayPalContainers, 500);
    setTimeout(cleanupDuplicatePayPalContainers, 1500);

    // Create PayPal button containers if they don't exist
    function createPayPalContainers() {
        console.log('Checking for PayPal button locations');
        
        // First check if there are any existing PayPal containers
        const existingPayPalContainers = document.querySelectorAll('[id^="paypal-button"], .paypal-button-container, [data-paypal-button]');
        if (existingPayPalContainers.length > 0) {
            console.log('Found existing PayPal containers, will use those instead of creating new ones');
            return;
        }
        
        // Look for designated areas where PayPal buttons should be placed
        // More specific targeting - look specifically in the buy section first
        const buySection = document.querySelector('#buy');
        
        if (buySection) {
            console.log('Found #buy section, adding PayPal container there');
            createSinglePayPalContainer(buySection);
            return;
        }
        
        // If no buy section, try other selectors in priority order
        const paypalSections = document.querySelectorAll('.paypal-section, .buy-now-section, .payment-section, .product-purchase, .product-buy, .product-cta');
        
        // Use all found sections, or create a fallback if none found
        if (paypalSections.length > 0) {
            console.log('Using first found payment section:', paypalSections[0]);
            createSinglePayPalContainer(paypalSections[0]);
            return;
        }
        
        console.log('Found ' + paypalSections.length + ' potential PayPal button locations');
        
        // If no sections were found, create a fallback container
        {
            console.log('No PayPal sections found - creating fallback container');
            
            // Find a good place to insert the PayPal button
            const productSection = document.querySelector('.product, #product, section:has(h2), main > div');
            
            if (productSection) {
                console.log('Found product section for fallback button');
                
                // Create a container for the PayPal button
                const fallbackContainer = document.createElement('div');
                fallbackContainer.className = 'paypal-section';
                fallbackContainer.style.margin = '30px auto';
                fallbackContainer.style.maxWidth = '800px';
                fallbackContainer.style.textAlign = 'center';
                
                // Add a heading
                const heading = document.createElement('h3');
                heading.textContent = 'Buy Now';
                fallbackContainer.appendChild(heading);
                
                // Add to page
                productSection.appendChild(fallbackContainer);
                
                // Create PayPal container
                createSinglePayPalContainer(fallbackContainer);
            }
        }
    }

    // Helper function to create a single PayPal container
    function createSinglePayPalContainer(section) {
        // Check if this section already has a PayPal container
        const existingContainer = section.querySelector('[id^="paypal-"], .paypal-button-container');
        
        if (!existingContainer) {
            console.log('Creating new PayPal container in section:', section);
            
            // Create container
            const container = document.createElement('div');
            container.id = 'paypal-button-container-0';
            container.className = 'paypal-button-container';
            container.style.width = '100%';
            container.style.maxWidth = '400px';
            container.style.margin = '20px auto';
            container.style.minHeight = '45px';
            
            // Try to find the price
            const priceElement = section.querySelector('.price, .product-price, [class*="price"]');
            if (priceElement) {
                let priceText = priceElement.textContent.trim();
                let priceMatch = priceText.match(/\$?(\d+(\.\d{1,2})?)/);
                if (priceMatch) {
                    container.setAttribute('data-amount', priceMatch[1]);
                    console.log('Set price for PayPal button:', priceMatch[1]);
                }
            }
            
            // Add container to the section
            section.appendChild(container);
        }
    }

    // Load PayPal SDK properly
    function loadPayPalSDK() {
        console.log('Loading PayPal SDK with client ID:', config.clientId);
        
        // Remove any existing PayPal scripts to prevent conflicts
        const existingScripts = document.querySelectorAll('script[src*="paypal.com"]');
        existingScripts.forEach(script => script.remove());
        
        // Create new script element
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${config.clientId}&currency=${config.currency}&intent=capture`;
        script.async = true;
        script.id = 'paypal-js';
        
        script.onload = function() {
            console.log('PayPal SDK loaded successfully!');
            renderAllPayPalButtons();
        };
        
        script.onerror = function() {
            console.error('Failed to load PayPal SDK!');
            // Fallback to direct purchase link
            createFallbackButtons();
        };
        
        document.head.appendChild(script);
    }
    
    // Create fallback buttons if PayPal script fails
    function createFallbackButtons() {
        const containers = document.querySelectorAll('.paypal-button-container, [id^="paypal-button"]');
        
        containers.forEach(container => {
            if (container.children.length === 0) {
                const fallbackButton = document.createElement('a');
                fallbackButton.href = 'https://buy.emguarde.com';
                fallbackButton.className = 'paypal-fallback-button';
                fallbackButton.innerHTML = 'Buy Now';
                fallbackButton.style.display = 'block';
                fallbackButton.style.padding = '10px 20px';
                fallbackButton.style.backgroundColor = '#0070ba';
                fallbackButton.style.color = 'white';
                fallbackButton.style.textAlign = 'center';
                fallbackButton.style.borderRadius = '4px';
                fallbackButton.style.textDecoration = 'none';
                fallbackButton.style.fontWeight = 'bold';
                fallbackButton.style.fontSize = '16px';
                
                container.appendChild(fallbackButton);
            }
        });
    }

    // Render PayPal buttons in all containers
    function renderAllPayPalButtons() {
        console.log('Rendering PayPal buttons');
        
        // Run cleanup again before rendering
        cleanupDuplicatePayPalContainers();
        
        // Just find the first container since we only want one button
        const container = document.querySelector('#paypal-button-container-0') || 
                          document.querySelector('.paypal-button-container') || 
                          document.querySelector('[id^="paypal-button"]');
        
        // Clean up any extra PayPal buttons to avoid duplicates
        const allContainers = document.querySelectorAll('.paypal-button-container:not(:first-of-type), [id^="paypal-button"]:not(:first-of-type)');
        allContainers.forEach(extraContainer => {
            if (extraContainer !== container) {
                console.log('Removing extra PayPal container:', extraContainer.id);
                extraContainer.style.display = 'none';
            }
        });
        
        if (!container) {
            console.warn('No PayPal containers found!');
            
            // Create one as a last resort
            const lastResortContainer = document.createElement('div');
            lastResortContainer.id = 'paypal-last-resort';
            lastResortContainer.className = 'paypal-button-container';
            lastResortContainer.style.width = '100%';
            lastResortContainer.style.maxWidth = '400px';
            lastResortContainer.style.margin = '30px auto';
            lastResortContainer.style.minHeight = '45px';
            
            // Find a place to add it
            const target = document.querySelector('main, .main-content, .content, body');
            if (target) {
                target.appendChild(lastResortContainer);
                renderSinglePayPalButton(lastResortContainer);
            } else {
                document.body.appendChild(lastResortContainer);
                renderSinglePayPalButton(lastResortContainer);
            }
            return;
        }
        
        console.log('Found PayPal container:', container.id || 'unnamed container');
        
        // Make sure PayPal SDK is available
        if (!window.paypal) {
            console.error('PayPal SDK not available!');
            return;
        }
        
        // Render single button
        renderSinglePayPalButton(container);
    }

    // Helper function to render a single PayPal button
    function renderSinglePayPalButton(container) {
        // Skip if already rendered
        if (container.querySelector('.paypal-button')) {
            console.log('Container already has PayPal button, skipping:', container.id);
            return;
        }
        
        try {
            console.log('Rendering PayPal button in:', container.id || 'unnamed container');
            
            // Get amount from data attribute or use default
            const amount = container.getAttribute('data-amount') || config.defaultAmount;
            
            // Render the button
            window.paypal.Buttons({
                style: {
                    layout: 'horizontal',
                    color: 'blue',
                    shape: 'rect',
                    label: 'pay'
                },
                createOrder: function(data, actions) {
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
                        const name = details.payer.name.given_name || 'Customer';
                        alert('Thank you, ' + name + '! Your purchase is complete.');
                        
                        // You can redirect to a thank you page here
                        // window.location.href = '/thank-you.html';
                    });
                },
                onError: function(err) {
                    console.error('PayPal button error:', err);
                    alert('There was a problem processing your payment. Please try again or contact support.');
                }
            }).render(container);
            
        } catch (error) {
            console.error('Error rendering PayPal button:', error);
            // Add fallback button
            if (container.children.length === 0) {
                createFallbackButtons();
            }
        }
    }

    // Initialize with multiple attempts
    function initialize() {
        // First clean up duplicates
        cleanupDuplicatePayPalContainers();
        
        createPayPalContainers();
        loadPayPalSDK();
    }

    // Start on DOM content loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    setTimeout(function() {
        const buttons = document.querySelectorAll('.paypal-button');
        if (buttons.length === 0) {
            console.log('No PayPal buttons found after delay, trying again');
            renderAllPayPalButtons();
        } else {
            console.log('PayPal buttons already exist:', buttons.length);
            
            // If we have multiple PayPal buttons, clean them up
            if (buttons.length > 1) {
                console.log('Found ' + buttons.length + ' PayPal buttons - cleaning up');
                cleanupDuplicatePayPalContainers();
            }
        }
    }, 3000);
})(); 