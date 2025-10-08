// Simple tab fix for settings
setTimeout(function() {
    console.log('Tab fix loaded');
    
    // Get all tab links and contents
    const tabLinks = document.querySelectorAll('.tab-link[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('Found tab links:', tabLinks.length);
    console.log('Found tab contents:', tabContents.length);
    
    // Add click handlers
    tabLinks.forEach(function(link) {
        link.onclick = function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');
            console.log('Clicked tab:', targetTab);
            
            // Hide all contents
            tabContents.forEach(function(content) {
                content.style.display = 'none';
                content.classList.remove('active');
            });
            
            // Remove active from all links
            tabLinks.forEach(function(l) {
                l.classList.remove('active');
            });
            
            // Show target content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.style.display = 'block';
                targetContent.classList.add('active');
                this.classList.add('active');
                console.log('Switched to:', targetTab);
            }
        };
    });
}, 1000);