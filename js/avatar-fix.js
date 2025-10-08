// Simple avatar upload fix
setTimeout(function() {
    console.log('Avatar fix loaded');
    
    const fileInput = document.getElementById('avatar-file');
    const preview = document.getElementById('avatar-preview');
    const updateBtn = document.getElementById('update-avatar');
    const currentUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
    
    console.log('Current user:', currentUser);
    
    // Load saved avatar
    if (preview) {
        const saved = localStorage.getItem('avatar_' + currentUser);
        if (saved) {
            preview.src = saved;
        }
    }
    
    // Custom file button
    const fileButton = document.getElementById('file-button');
    const fileName = document.getElementById('file-name');
    
    if (fileButton && fileInput) {
        fileButton.onclick = function() {
            fileInput.click();
        };
    }
    
    // File preview
    if (fileInput) {
        fileInput.onchange = function() {
            const file = this.files[0];
            console.log('File selected:', file ? file.name : 'none');
            
            if (fileName) {
                fileName.textContent = file ? file.name : 'Chưa chọn tệp nào';
            }
            
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    console.log('Preview updated');
                };
                reader.readAsDataURL(file);
            }
        };
    }
    
    // Update avatar
    if (updateBtn) {
        updateBtn.onclick = function() {
            const file = fileInput.files[0];
            console.log('Update clicked, file:', file ? file.name : 'none');
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const avatarData = e.target.result;
                    localStorage.setItem('avatar_' + currentUser, avatarData);
                    console.log('Avatar saved to localStorage');
                    alert('Avatar đã cập nhật!');
                };
                reader.readAsDataURL(file);
            } else {
                alert('Chọn ảnh trước!');
            }
        };
    }
}, 1000);