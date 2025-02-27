// config.js - This file will NOT be committed to GitHub
window.PAYPAL_CONFIG = {
    CLIENT_ID: window.location.hostname.includes('mexemexe02.github.io') 
        ? 'AWjhgw8o149iP-AtwrcjtThKPuHcs5MzrrzALxtw2--JrLJ9Iv0-AjT2A7XEhjrOH0mspjyldVL8iO6G' // Sandbox client ID
        : 'ARS0c4s7qfFkHhF-aeCdkx40HxH6lRVCG7m-xl6Yhl7auv0IHqc42KAsUxxB30949Xh2DR89kSwYtL9h'  // Live client ID
};

// Debug output
console.log("PAYPAL_CONFIG initialized with CLIENT_ID:", window.PAYPAL_CONFIG.CLIENT_ID);
console.log("Current hostname:", window.location.hostname);
console.log("Is correct GitHub Pages domain?", window.location.hostname.includes('mexemexe02.github.io')); 