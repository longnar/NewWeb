// Force clear inputs on focus for different users
document.addEventListener('DOMContentLoaded', function() {
    console.log('Input clear loaded');
    
    let currentUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
    
    // Clear input on focus if user changed
    document.addEventListener('focusin', function(e) {
        const input = e.target;
        
        if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
            const newUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
            
            if (newUser !== currentUser) {
                console.log('User changed, clearing input:', input.id);
                input.value = '';
                currentUser = newUser;
            }
        }
    });
    
    // Also clear on page visibility change
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            const newUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
            
            if (newUser !== currentUser) {
                console.log('Page visible, user changed, clearing all inputs');
                
                document.querySelectorAll('input, textarea').forEach(input => {
                    if (input.type !== 'submit' && input.type !== 'button') {
                        input.value = '';
                    }
                });
                
                currentUser = newUser;
            }
        }
    });
});