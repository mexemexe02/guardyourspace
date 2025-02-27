// Enhanced form fix - create as a separate file
document.addEventListener('DOMContentLoaded', function() {
    // Set a flag to avoid duplicate handlers
    window.enhancedFormFixActive = true;
    
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    console.log('Enhanced form fix applied');
    
    // Remove action attribute
    contactForm.removeAttribute('action');
    contactForm.removeAttribute('method');
    
    // Replace the form element with a clone to remove all event listeners
    const newForm = contactForm.cloneNode(true);
    contactForm.parentNode.replaceChild(newForm, contactForm);
    
    // Add our own submit handler
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submission intercepted by enhanced-form-fix.js');
        
        // Get form data
        const formData = new FormData(newForm);
        
        // Ensure access key is present
        if (!formData.has('access_key')) {
            formData.append('access_key', 'f115e690-e290-47ea-9449-c63fa95720b1');
        }
        
        // Show loading state
        const submitButton = newForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton ? submitButton.innerHTML : 'Send';
        if (submitButton) {
            submitButton.innerHTML = 'Sending...';
            submitButton.disabled = true;
        }
        
        // Submit the form using fetch
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Form submission failed: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Form submitted successfully:', data);
            alert('Thank you for your message! We will get back to you soon.');
            newForm.reset();
        })
        .catch(error => {
            console.error('Form submission error:', error);
            alert('There was a problem submitting the form. Please try again later.');
        })
        .finally(() => {
            if (submitButton) {
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
        
        return false;
    });
}); 