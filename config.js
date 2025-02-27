// config.js - This file will NOT be committed to GitHub
// Use try-catch to avoid redeclaration errors
try {
    // Clear any existing CONFIG
    delete window.CONFIG;
} catch (e) {
    console.error("Error cleaning up CONFIG:", e);
}

window.CONFIG = {
    // Check if we're on GitHub Pages using full domain check
    RECAPTCHA_SITE_KEY: window.location.hostname.endsWith('github.io') 
        ? '6LfgqeMqAAAAAHE-UM1rD-sGBsjBFnyX-Ey3c0Sh' 
        : '6LfgqeMqAAAAAHE-UM1rD-sGBsjBFnyX-Ey3c0Sh',
    
    WEB3FORMS_KEY: 'f115e690-e290-47ea-9449-c63fa95720b1',
    
    PAYPAL_CLIENT_ID: window.location.hostname.endsWith('github.io')
        ? 'AWjhgw8o149iP-AtwrcjtThKPuHcs5MzrrzALxtw2--JrLJ9Iv0-AjT2A7XEhjrOH0mspjyldVL8iO6G' // Sandbox client ID
        : 'ARS0c4s7qfFkHhF-aeCdkx40HxH6lRVCG7m-xl6Yhl7auv0IHqc42KAsUxxB30949Xh2DR89kSwYtL9h' // Live client ID
};

// Debug output to see what's happening
console.log("CONFIG initialized with PAYPAL_CLIENT_ID:", window.CONFIG.PAYPAL_CLIENT_ID);
console.log("Current hostname:", window.location.hostname);
console.log("Is GitHub Pages?", window.location.hostname.endsWith('github.io')); 