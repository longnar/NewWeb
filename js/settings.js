// Load user data and settings
document.addEventListener('DOMContentLoaded', function() {
    loadUserSettings();
    loadUserInfo();
    initTabNavigation();
    initAvatarFunctionality();
});

// Avatar functionality
function initAvatarFunctionality() {
    const currentUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
    const avatarPreview = document.getElementById('avatar-preview');
    const avatarFileInput = document.getElementById('avatar-file');
    const updateAvatarBtn = document.getElementById('update-avatar');
    
    console.log('Avatar init for user:', currentUser);
    
    // Load saved avatar
    if (avatarPreview) {
        const savedAvatar = localStorage.getItem('avatar_' + currentUser);
        avatarPreview.src = savedAvatar || 'https://via.placeholder.com/120x120/8A2BE2/FFFFFF?text=U';
    }
    
    // File preview
    if (avatarFileInput) {
        avatarFileInput.onchange = function() {
            const file = this.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
    }
    
    // Update avatar
    if (updateAvatarBtn) {
        updateAvatarBtn.onclick = function() {
            const file = avatarFileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    localStorage.setItem('avatar_' + currentUser, e.target.result);
                    alert('Avatar đã cập nhật!');
                };
                reader.readAsDataURL(file);
            } else {
                alert('Chọn ảnh trước!');
            }
        };
    }
}

// Tab navigation
function initTabNavigation() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabLinks.forEach(link => {
        link.onclick = function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');
            console.log('Tab clicked:', targetTab);
            
            if (targetTab) {
                // Remove active from all
                tabLinks.forEach(l => l.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active to clicked
                this.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                    console.log('Switched to tab:', targetTab);
                }
            }
        };
    });
}

// Load user settings
function loadUserSettings() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const language = localStorage.getItem('language') || 'vi';
    
    document.getElementById('darkMode').checked = darkMode;
    document.getElementById('language').value = language;
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
}

// Load user info
function loadUserInfo() {
    const username = localStorage.getItem('currentUser');
    const accountCreated = localStorage.getItem('accountCreated_' + username) || 'Không xác định';
    
    document.getElementById('display-username').value = username || 'Chưa đăng nhập';
    document.getElementById('account-created').value = accountCreated;
}

// Dark mode toggle
document.getElementById('darkMode').addEventListener('change', function() {
    const isDark = this.checked;
    localStorage.setItem('darkMode', isDark);
    
    if (isDark) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

// Language change
document.getElementById('language').addEventListener('change', function() {
    localStorage.setItem('language', this.value);
    alert('Ngôn ngữ sẽ được áp dụng sau khi tải lại trang');
});

// Change password
document.getElementById('change-password-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorElement = document.getElementById('password-error');
    
    const currentUser = localStorage.getItem('currentUser');
    const storedPassword = localStorage.getItem('password_' + currentUser);
    
    if (currentPassword !== storedPassword) {
        errorElement.textContent = 'Mật khẩu hiện tại không đúng';
        return;
    }
    
    if (newPassword !== confirmPassword) {
        errorElement.textContent = 'Mật khẩu mới không khớp';
        return;
    }
    
    if (newPassword.length < 6) {
        errorElement.textContent = 'Mật khẩu mới phải có ít nhất 6 ký tự';
        return;
    }
    
    localStorage.setItem('password_' + currentUser, newPassword);
    errorElement.textContent = '';
    alert('Đổi mật khẩu thành công!');
    this.reset();
});

// Contact form
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const issueType = document.getElementById('issue-type').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('message').value;
    
    // Simulate sending message
    const contactData = {
        type: issueType,
        email: email,
        message: message,
        timestamp: new Date().toISOString(),
        user: localStorage.getItem('currentUser')
    };
    
    // Store in localStorage (in real app, send to server)
    const contacts = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    contacts.push(contactData);
    localStorage.setItem('contactMessages', JSON.stringify(contacts));
    
    alert('Tin nhắn đã được gửi! Chúng tôi sẽ phản hồi sớm nhất có thể.');
    this.reset();
});

// Reset data
document.getElementById('reset-data').addEventListener('click', function() {
    if (confirm('Bạn có chắc chắn muốn reset tất cả dữ liệu? Tài khoản và mật khẩu sẽ được giữ lại.')) {
        const currentUser = localStorage.getItem('currentUser');
        
        if (currentUser) {
            // Keep account info, reset everything else
            localStorage.removeItem('avatar_' + currentUser);
            localStorage.removeItem('income_' + currentUser);
            localStorage.removeItem('expenses_' + currentUser);
            localStorage.removeItem('funds_' + currentUser);
            localStorage.removeItem('survey_' + currentUser);
            localStorage.removeItem('isNewUser_' + currentUser);
            localStorage.removeItem('accountCreated_' + currentUser);
            
            // Reset to default values
            localStorage.setItem('income_' + currentUser, '0');
            localStorage.setItem('expenses_' + currentUser, '[]');
            localStorage.setItem('funds_' + currentUser, '[]');
            localStorage.setItem('isNewUser_' + currentUser, 'true');
            
            alert('Dữ liệu đã được reset! Tài khoản và mật khẩu vẫn được giữ lại.');
            window.location.href = 'index.html';
        } else {
            alert('Không tìm thấy thông tin tài khoản!');
        }
    }
});

// Delete account
document.getElementById('delete-account').addEventListener('click', function() {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!')) {
        const currentUser = localStorage.getItem('currentUser');
        
        if (currentUser) {
            // Remove all user data
            localStorage.removeItem('password_' + currentUser);
            localStorage.removeItem('fullname_' + currentUser);
            localStorage.removeItem('avatar_' + currentUser);
            localStorage.removeItem('income_' + currentUser);
            localStorage.removeItem('expenses_' + currentUser);
            localStorage.removeItem('funds_' + currentUser);
            localStorage.removeItem('survey_' + currentUser);
            localStorage.removeItem('isNewUser_' + currentUser);
            localStorage.removeItem('accountCreated_' + currentUser);
            localStorage.removeItem(currentUser); // old format
            localStorage.removeItem('currentUser');
            localStorage.removeItem('loggedIn');
            
            alert('Tài khoản đã được xóa hoàn toàn!');
            window.location.href = 'login.html';
        } else {
            alert('Không tìm thấy thông tin tài khoản!');
        }
    }
});

// Logout functionality
const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    });
}