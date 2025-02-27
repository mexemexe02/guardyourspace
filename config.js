// config.js - This file will NOT be committed to GitHub
const CONFIG = {
    // Check if we're on GitHub Pages
    RECAPTCHA_SITE_KEY: window.location.hostname.includes('github.io') 
        ? '6LfgqeMqAAAAAHE-UM1rD-sGBsjBFnyX-Ey3c0Sh' 
        : '6LfgqeMqAAAAAHE-UM1rD-sGBsjBFnyX-Ey3c0Sh',
    
    WEB3FORMS_KEY: 'f115e690-e290-47ea-9449-c63fa95720b1',
    
    PAYPAL_CLIENT_ID: window.location.hostname.includes('github.io')
        ? 'ARS0c4s7qfFkHhF-aeCdkx40HxH6lRVCG7m-xl6Yhl7auv0IHqc42KAsUxxB30949Xh2DR89kSwYtL9h' 
        : 'ARS0c4s7qfFkHhF-aeCdkx40HxH6lRVCG7m-xl6Yhl7auv0IHqc42KAsUxxB30949Xh2DR89kSwYtL9h'
}; 