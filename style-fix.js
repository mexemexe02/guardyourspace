// style-fix.js - Enhance visual appearance of key elements
(function() {
    console.log('Style Fix: Initializing');

    // Apply enhanced styling to logo and brand text
    function enhanceBrandStyling() {
        // Find the brand/logo text elements
        const brandElements = document.querySelectorAll('h1, h2, h3, .logo, header h3, footer h3');
        
        brandElements.forEach(element => {
            if (element.textContent.includes('Guard Your Space') && !element.textContent.includes('emGuarde')) {
                console.log('Found brand text, enhancing style');
                
                // Save the original text and replace with new version including emGuarde
                const originalHTML = element.innerHTML;
                
                // Replace the text with the new version
                element.innerHTML = originalHTML.replace(
                    'Guard Your Space', 
                    'Guard Your Space with <span class="brand-highlight">em<span class="cap-g">G</span>uarde</span>'
                );
                
                // Apply enhanced styling
                element.style.fontFamily = "'Montserrat', 'Segoe UI', Arial, sans-serif";
                element.style.fontWeight = "700";
                element.style.letterSpacing = "0.05em";
                if (!element.querySelector('.brand-highlight')) {
                    element.style.textTransform = "uppercase";
                }
                element.style.color = "#005073"; // Darker teal for better contrast
                element.style.textShadow = "1px 1px 1px rgba(0,0,0,0.1)";
                element.style.margin = "0.5em 0";
                
                // Style the emGuarde part
                const highlightSpan = element.querySelector('.brand-highlight');
                if (highlightSpan) {
                    highlightSpan.style.color = "#d00000"; // Strong red that stands out well
                    highlightSpan.style.fontWeight = "800";
                    highlightSpan.style.fontStyle = "italic";
                    highlightSpan.style.textShadow = "0.5px 0.5px 0px #fff, -0.5px -0.5px 0px #fff, 0.5px -0.5px 0px #fff, -0.5px 0.5px 0px #fff";
                    highlightSpan.style.fontSize = "1.1em"; // Even larger for better visibility
                    highlightSpan.style.textTransform = "none"; // Override uppercase
                    highlightSpan.style.margin = "0 2px";
                    
                    // Style the capital G
                    const capG = highlightSpan.querySelector('.cap-g');
                    if (capG) {
                        capG.style.fontSize = "1.2em";
                        capG.style.fontWeight = "900";
                        capG.style.color = "#b00000"; // Slightly darker red for the G
                    }
                }
                
                // If it's in the header/navigation, make it stand out more
                if (element.closest('header, nav')) {
                    element.style.fontSize = "1.6em";
                }
                
                // If it's in the footer, make it more subtle
                if (element.closest('footer')) {
                    element.style.fontSize = "1.2em";
                    element.style.opacity = "0.9";
                }
            }
        });
    }
    
    // Apply general style improvements
    function enhanceGeneralStyling() {
        // Add custom font if not already present
        if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap';
            document.head.appendChild(fontLink);
        }
        
        // Fix chatbot icon transparency
        function fixChatbotIcon() {
            console.log('Creating professional chatbot icon');
            
            // First, try to hide the original chat icon if it exists
            const originalIcons = document.querySelectorAll('.chat-icon, .chatbot-icon, .chat-toggle, #chat-toggle, .chat-button');
            originalIcons.forEach(icon => {
                if (icon) {
                    icon.style.display = 'none';
                    icon.style.visibility = 'hidden';
                    icon.style.opacity = '0';
                }
            });
            
            // Fallback - create a new chat button if the icon is missing
            const chatButton = document.createElement('div'); 
            chatButton.classList.add('chat-button');
            chatButton.style.position = 'fixed';
            chatButton.style.bottom = '20px';
            chatButton.style.right = '20px';
            chatButton.style.zIndex = '1000';
            chatButton.style.backgroundColor = '#0078d4'; // Microsoft blue - more professional
            chatButton.style.width = '50px';
            chatButton.style.height = '50px';
            chatButton.style.borderRadius = '50%';
            chatButton.style.display = 'flex';
            chatButton.style.alignItems = 'center';
            chatButton.style.justifyContent = 'center';
            chatButton.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            chatButton.style.cursor = 'pointer';
            chatButton.style.border = 'none';
            chatButton.style.outline = 'none';
            chatButton.style.transition = 'all 0.3s ease';
            
            chatButton.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                <path d="M20,2H4C2.9,2,2,2.9,2,4v18l4-4h14c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M20,16H6l-2,2V4h16V16z"/>
                <path d="M7,9h10v2H7V9z M7,12h7v2H7V12z"/>
            </svg>`;
            
            // Add hover effect
            chatButton.addEventListener('mouseover', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            });
            
            chatButton.addEventListener('mouseout', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            });
            
            document.body.appendChild(chatButton);
            
            // Connect the chat button to any existing chat toggle functionality
            chatButton.addEventListener('click', function() {
                const chatToggle = document.querySelector('.chat-toggle, #chat-toggle');
                if (chatToggle && typeof chatToggle.click === 'function') {
                    chatToggle.click();
                } else {
                    console.log('Creating new chat instance');
                    // Try to trigger chat initialization
                    if (typeof initChatSystem === 'function') {
                        initChatSystem();
                    }
                }
            });
        }
        
        // Run the icon fix now and after a delay
        fixChatbotIcon();
        setTimeout(fixChatbotIcon, 1500);
        
        // Create a style element for global CSS improvements
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            body {
                font-family: 'Open Sans', Arial, sans-serif;
                line-height: 1.6;
                color: #111;
            }
            
            .brand-highlight {
                color: #d00000 !important; /* Strong red for visibility without being harsh */
                font-weight: 800 !important;
                display: inline-block;
                position: relative;
                transform: skewX(-5deg);
                margin: 0 3px;
                font-size: 115% !important;
                letter-spacing: 0.5px;
                text-transform: none !important;
                text-shadow: 0.5px 0.5px 0px #fff, -0.5px -0.5px 0px #fff, 0.5px -0.5px 0px #fff, -0.5px 0.5px 0px #fff !important;
            }
            
            .brand-highlight .cap-g {
                font-size: 125% !important;
                font-weight: 900 !important;
                color: #b00000 !important;
            }
            
            /* Custom chat button */
            .chat-button {
                background-color: #0078d4 !important;
                border-radius: 50% !important;
                width: 50px !important;
                height: 50px !important;
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                z-index: 10000 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
                cursor: pointer !important;
                border: none !important;
                transition: all 0.3s ease !important;
            }
            
            /* Hide original chat icons */
            .chat-icon, .chatbot-icon, .chat-toggle, #chat-toggle {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
            }
            
            h1, h2, h3, h4, h5, h6 {
                font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
                font-weight: 600;
                line-height: 1.3;
                margin-top: 1.5em;
                margin-bottom: 0.8em;
                color: #003050; /* Darker for better contrast */
                text-shadow: 0 1px 0 rgba(255,255,255,0.5);
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
            }
            
            .footer-content {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                gap: 2rem;
            }
            
            .footer-info, .footer-newsletter, .footer-links {
                flex: 1;
                min-width: 250px;
            }
            
            @media (max-width: 768px) {
                .footer-content {
                    flex-direction: column;
                }
            }
            
            /* Improve buttons */
            button, .button, [class*="btn"] {
                transition: all 0.3s ease;
            }
            
            button:hover, .button:hover, [class*="btn"]:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            
            p, li, label, input, textarea {
                color: #111;
                font-size: 17px;
                line-height: 1.7;
                margin-bottom: 1em;
            }
            
            footer p, footer a {
                color: #222;
                font-size: 15px;
            }
            
            /* Improve text legibility */
            .section, section {
                color: #111;
                padding: 2rem 0;
            }
            
            /* Ensure links are visible */
            a {
                color: #0055bb;
                text-decoration: none;
                transition: color 0.2s;
                font-weight: 600;
                position: relative;
            }
            
            a:hover {
                color: #003399;
                text-decoration: underline;
            }
            
            /* Professional styling touches */
            .header-content, header {
                padding: 1rem 0;
                border-bottom: 1px solid rgba(0,0,0,0.1);
            }
            
            section:nth-child(odd) {
                background-color: #f9f9f9;
            }
            
            section:nth-child(even) {
                background-color: #ffffff;
            }
            
            footer {
                background-color: #f2f2f2;
                border-top: 1px solid rgba(0,0,0,0.1);
                padding-top: 2rem;
            }
        `;
        
        document.head.appendChild(styleElement);
    }
    
    // Initialize improvements
    function initialize() {
        enhanceBrandStyling();
        enhanceGeneralStyling();
    }
    
    // Run on page load and after a delay to catch dynamically loaded content
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Run again after a delay in case elements load dynamically
    setTimeout(initialize, 1000);
})(); 