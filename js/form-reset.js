// Reset forms when switching accounts
setTimeout(function() {
    console.log('Form reset loaded');
    
    let lastUser = localStorage.getItem('lastActiveUser');
    const currentUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
    
    console.log('Last user:', lastUser, 'Current user:', currentUser);
    
    // Reset forms immediately if different user
    if (lastUser && lastUser !== currentUser) {
        console.log('Different user detected, resetting forms');
        resetAllForms();
    }
    
    // Save current user as last active
    localStorage.setItem('lastActiveUser', currentUser);
    
    // Check for user change every 1 second
    setInterval(function() {
        const currentUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
        
        const newCurrentUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
        
        if (newCurrentUser !== lastUser) {
            console.log('User changed from', lastUser, 'to', newCurrentUser);
            resetAllForms();
            localStorage.setItem('lastActiveUser', newCurrentUser);
            lastUser = newCurrentUser;
        }
    }, 1000);
    
    function resetAllForms() {
        console.log('Resetting all forms aggressively');
        
        // Reset all forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (form.id !== 'login-form' && form.id !== 'signup-form') {
                form.reset();
            }
        });
        
        // Clear ALL inputs on page (aggressive approach)
        const allInputs = document.querySelectorAll('input, textarea, select');
        allInputs.forEach(input => {
            if (input.type !== 'submit' && input.type !== 'button' && input.type !== 'checkbox' && input.type !== 'radio') {
                input.value = '';
                input.defaultValue = '';
                
                // Force clear by dispatching events
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        
        // Reset category buttons
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        
        // Hide custom category input
        const customCategory = document.getElementById('custom-category');
        if (customCategory) {
            customCategory.style.display = 'none';
        }
        
        // Clear hidden category input
        const categoryInput = document.getElementById('category');
        if (categoryInput) {
            categoryInput.value = '';
        }
        
        // Force refresh input values after a short delay
        setTimeout(() => {
            allInputs.forEach(input => {
                if (input.type !== 'submit' && input.type !== 'button' && input.type !== 'checkbox' && input.type !== 'radio') {
                    input.value = '';
                }
            });
        }, 100);
        
        console.log('Aggressive forms reset completed');
    }
    
}, 500);