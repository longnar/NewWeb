// Dark mode functionality
setTimeout(function() {
    console.log('Dark mode loaded');
    
    const darkModeToggle = document.getElementById('darkMode');
    const currentUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
    
    // Load saved dark mode setting
    const isDarkMode = localStorage.getItem('darkMode_' + currentUser) === 'true';
    if (darkModeToggle) {
        darkModeToggle.checked = isDarkMode;
    }
    
    // Apply dark mode on page load
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    
    // Toggle dark mode
    if (darkModeToggle) {
        darkModeToggle.onchange = function() {
            console.log('Dark mode toggled:', this.checked);
            
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode_' + currentUser, 'true');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode_' + currentUser, 'false');
            }
        };
    }
}, 100);