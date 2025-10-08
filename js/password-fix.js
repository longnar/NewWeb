// Password change and account deletion functionality
setTimeout(function() {
    console.log('Password fix loaded');
    
    const currentUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
    const changePasswordForm = document.getElementById('change-password-form');
    const deleteAccountBtn = document.getElementById('delete-account');
    const passwordError = document.getElementById('password-error');
    
    // Change password
    if (changePasswordForm) {
        changePasswordForm.onsubmit = function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Clear previous errors
            passwordError.textContent = '';
            
            // Validate current password
            const savedPassword = localStorage.getItem('password_' + currentUser) || localStorage.getItem(currentUser);
            console.log('Current user:', currentUser);
            console.log('Saved password:', savedPassword);
            console.log('Input password:', currentPassword);
            
            if (currentPassword !== savedPassword) {
                passwordError.textContent = 'Mật khẩu hiện tại không đúng!';
                return;
            }
            
            // Validate new password
            if (newPassword.length < 6) {
                passwordError.textContent = 'Mật khẩu mới phải có ít nhất 6 ký tự!';
                return;
            }
            
            // Validate confirm password
            if (newPassword !== confirmPassword) {
                passwordError.textContent = 'Xác nhận mật khẩu không khớp!';
                return;
            }
            
            // Save new password
            localStorage.setItem('password_' + currentUser, newPassword);
            
            // Clear form
            changePasswordForm.reset();
            
            alert('Đổi mật khẩu thành công!');
            console.log('Password changed for user:', currentUser);
        };
    }
    
    // Delete account
    if (deleteAccountBtn) {
        deleteAccountBtn.onclick = function() {
            const confirmDelete = confirm('Bạn có chắc chắn muốn xóa tài khoản? Tất cả dữ liệu sẽ bị mất vĩnh viễn!');
            
            if (confirmDelete) {
                const doubleConfirm = confirm('Xác nhận lần cuối: Xóa tài khoản "' + currentUser + '"?');
                
                if (doubleConfirm) {
                    // Remove all user data
                    localStorage.removeItem('password_' + currentUser);
                    localStorage.removeItem('avatar_' + currentUser);
                    localStorage.removeItem('darkMode_' + currentUser);
                    localStorage.removeItem('language_' + currentUser);
                    localStorage.removeItem('income_' + currentUser);
                    localStorage.removeItem('expenses_' + currentUser);
                    localStorage.removeItem('funds_' + currentUser);
                    
                    // Remove login session
                    localStorage.removeItem('loggedIn');
                    localStorage.removeItem('currentUser');
                    
                    alert('Tài khoản đã được xóa!');
                    console.log('Account deleted:', currentUser);
                    
                    // Redirect to login
                    window.location.href = 'login.html';
                }
            }
        };
    }
}, 100);