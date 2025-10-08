// Simple toolbar fix
setTimeout(function() {
    const avatar = document.getElementById('user-avatar');
    const dropdown = document.getElementById('user-dropdown');
    const usernameDisplay = document.getElementById('username-display');
    const currentUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
    
    // Set username display
    if (usernameDisplay && currentUser) {
        const displayName = localStorage.getItem('fullname_' + currentUser) || currentUser;
        usernameDisplay.textContent = displayName;
        console.log('Username set to:', displayName);
    }
    
    if (avatar && dropdown) {
        avatar.onclick = function() {
            console.log('Clicked!');
            dropdown.style.cssText = 'display: flex !important; position: absolute; top: 50px; right: 0; background: white; border: 1px solid #ccc; padding: 10px; z-index: 9999; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.3);';
        };
        
        document.onclick = function(e) {
            if (!avatar.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        };
        
        // Logout
        const logout = document.getElementById('logout-menu');
        if (logout) {
            logout.onclick = function(e) {
                e.preventDefault();
                if (confirm('Đăng xuất?')) {
                    localStorage.removeItem('loggedIn');
                    localStorage.removeItem('currentUser');
                    location.href = 'login.html';
                }
            };
        }
    }
}, 500);