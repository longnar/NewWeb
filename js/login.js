const form = document.getElementById("login-form");
const errorEl = document.getElementById("error");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Check both old and new password formats
  const storedPassword = localStorage.getItem(username) || localStorage.getItem('password_' + username);
  
  console.log('Login attempt:', { username, password });
  console.log('Stored password:', storedPassword);
  console.log('Password match:', storedPassword === password);

  if (storedPassword && storedPassword === password) {
    localStorage.setItem("loggedIn", username);
    localStorage.setItem("currentUser", username);
    console.log('Login successful for:', username);

    if (!localStorage.getItem("income_" + username)) {
      localStorage.setItem("income_" + username, 0);
      localStorage.setItem("expenses_" + username, JSON.stringify([]));
      localStorage.setItem("funds_" + username, JSON.stringify([]));
    }

    // Show welcome popup for new users
    const isNewUser = localStorage.getItem('isNewUser_' + username);
    if (isNewUser === 'true') {
      setTimeout(() => {
        alert('🎉 Chào mừng bạn đến với Finance Dashboard!\n\n📋 Hãy hoàn thành khảo sát để nhận gợi ý chi tiêu phù hợp với bạn!');
      }, 500);
    }

    window.location.href = "index.html";
  } else {
    errorEl.textContent = "❌ Sai tên đăng nhập hoặc mật khẩu!";
  }
});

// Forgot password functionality
document.getElementById('forgot-password').addEventListener('click', function(e) {
  e.preventDefault();
  
  const username = prompt('Nhập tên đăng nhập của bạn:');
  if (!username) return;
  
  // Check if user exists
  const storedPassword = localStorage.getItem(username) || localStorage.getItem('password_' + username);
  const fullname = localStorage.getItem('fullname_' + username);
  
  if (storedPassword) {
    const confirmReset = confirm(`Tài khoản: ${username}\nTên: ${fullname || 'Không có'}\n\nBạn có muốn đặt lại mật khẩu?`);
    
    if (confirmReset) {
      const newPassword = prompt('Nhập mật khẩu mới (ít nhất 6 ký tự):');
      
      if (newPassword && newPassword.length >= 6) {
        // Save new password in both formats for compatibility
        localStorage.setItem('password_' + username, newPassword);
        localStorage.setItem(username, newPassword);
        
        alert('✅ Đặt lại mật khẩu thành công!');
        
        // Auto fill username
        document.getElementById('username').value = username;
        document.getElementById('password').focus();
      } else {
        alert('❌ Mật khẩu phải có ít nhất 6 ký tự!');
      }
    }
  } else {
    alert('❌ Tài khoản không tồn tại!');
  }
});
