// Standalone contact form handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing standalone contact form handler');
    
    // Find the contact form
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
        console.warn('Contact form not found on page');
        return;
    }
    
    // Make sure the form has the correct action
    contactForm.action = 'https://api.web3forms.com/submit';
    contactForm.method = 'POST';
    
    // Check for access key input field
    let accessKeyInput = contactForm.querySelector('input[name="access_key"]');
    if (!accessKeyInput) {
        // Create and add access key field if it doesn't exist
        accessKeyInput = document.createElement('input');
        accessKeyInput.type = 'hidden';
        accessKeyInput.name = 'access_key';
        contactForm.appendChild(accessKeyInput);
    }
    
    // Set the access key
    accessKeyInput.value = 'f115e690-e290-47ea-9449-c63fa95720b1';
    
    // Handle form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submission started');
        
        // Find submit button
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (!submitButton) {
            console.error('Submit button not found');
            return;
        }
        
        // Save original button text and show loading state
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Safety timeout
        const resetTimeout = setTimeout(() => {
            console.log('Safety timeout triggered - resetting button');
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }, 15000);
        
        // Create and send FormData
        const formData = new FormData(contactForm);
        console.log('Form data fields:', Array.from(formData.keys()));
        
        // Submit using fetch API
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('Response received:', response.status);
            clearTimeout(resetTimeout);
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Form submission successful:', data);
            
            // Handle success
            if (data.success) {
                showSuccessMessage(contactForm, function() {
                    // This function is called when "Send Another" is clicked
                    contactForm.reset();
                    contactForm.style.display = 'block';
                });
            } else {
                throw new Error('Submission failed: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            clearTimeout(resetTimeout);
            
            // Reset the button
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            
            // Show error message
            alert('Sorry, there was a problem sending your message. Please try again or email us directly at support@emguarde.com');
        });
    });
    
    // Function to show success message
    function showSuccessMessage(form, onSendAnother) {
        // Hide the form
        form.style.display = 'none';
        
        // Create success message container
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Thank You!</h3>
            <p>Your message has been sent successfully.</p>
            <p>We'll get back to you as soon as possible.</p>
            <button class="send-another-btn">Send Another Message</button>
        `;
        
        // Insert success message
        form.parentNode.insertBefore(successMsg, form.nextSibling);
        
        // Add click handler for "Send Another" button
        const sendAnotherBtn = successMsg.querySelector('.send-another-btn');
        sendAnotherBtn.addEventListener('click', function() {
            // Remove success message
            successMsg.parentNode.removeChild(successMsg);
            
            // Call the callback function
            if (typeof onSendAnother === 'function') {
                onSendAnother();
            }
        });
    }
}); 