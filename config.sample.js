// config.sample.js - Template configuration file (rename to config.js and add your keys)
const CONFIG = {
    // Web3Forms access key for contact form
    WEB3FORMS_KEY: "YOUR_WEB3FORMS_ACCESS_KEY_HERE",
    
    // reCAPTCHA site key for form protection
    RECAPTCHA_SITE_KEY: "YOUR_RECAPTCHA_SITE_KEY_HERE",
    
    // PayPal client IDs
    PAYPAL: {
        LIVE: 'YOUR_LIVE_PAYPAL_CLIENT_ID_HERE',
        SANDBOX: 'YOUR_SANDBOX_PAYPAL_CLIENT_ID_HERE'
    }
};

// Debug output
console.log("CONFIG initialized successfully");
console.log("Current hostname:", window.location.hostname);
console.log("Is GitHub Pages domain?", window.location.hostname.includes('github.io')); 