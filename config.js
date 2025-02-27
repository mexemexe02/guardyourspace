// config.js - Configuration file with API keys
const CONFIG = {
    // Web3Forms access key for contact form
    WEB3FORMS_KEY: "f115e690-e290-47ea-9449-c63fa95720b1",
    
    // reCAPTCHA site key for form protection
    RECAPTCHA_SITE_KEY: "6LfgqeMqAAAAAHE-UM1rD-sGBsjBFnyX-Ey3c0Sh",
    
    // PayPal client IDs
    PAYPAL: {
        // These are the client IDs you already have configured
        LIVE: 'ARS0c4s7qfFkHhF-aeCdkx40HxH6lRVCG7m-xl6Yhl7auv0IHqc42KAsUxxB30949Xh2DR89kSwYtL9h',
        SANDBOX: 'AWjhgw8o149iP-AtwrcjtThKPuHcs5MzrrzALxtw2--JrLJ9Iv0-AjT2A7XEhjrOH0mspjyldVL8iO6G'
    }
};

// Debug output
console.log("CONFIG initialized successfully");
console.log("Current hostname:", window.location.hostname);
console.log("Is GitHub Pages domain?", window.location.hostname.includes('github.io')); 