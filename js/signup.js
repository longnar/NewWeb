const form = document.getElementById("signup-form");
const errorEl = document.getElementById("signup-error");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("new-username").value.trim();
  const password = document.getElementById("new-password").value.trim();
  const fullname = document.getElementById("fullname").value.trim();

  // Clear previous errors
  errorEl.textContent = "";

  // Validate fullname
  if (fullname.length < 2) {
    errorEl.textContent = "❌ Họ và tên phải có ít nhất 2 ký tự!";
    return;
  }

  // Validate username format: 3-20 characters, only letters and numbers
  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
  if (!usernameRegex.test(username)) {
    errorEl.textContent = "❌ Tên đăng nhập không hợp lệ! Chỉ được dùng chữ cái và số (3-20 ký tự)";
    return;
  }

  // Validate password format: minimum 6 characters with letter and number
  if (password.length < 6) {
    errorEl.textContent = "❌ Mật khẩu phải có ít nhất 6 ký tự!";
    return;
  }

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
  if (!passwordRegex.test(password)) {
    errorEl.textContent = "❌ Mật khẩu phải có ít nhất 1 chữ cái và 1 số!";
    return;
  }

  // Check if username already exists
  if (localStorage.getItem(username) || localStorage.getItem('password_' + username)) {
    errorEl.textContent = "❌ Tài khoản đã tồn tại!";
  } else {
    // Save with new format
    localStorage.setItem('password_' + username, password);
    localStorage.setItem('fullname_' + username, fullname);
    localStorage.setItem('isNewUser_' + username, 'true');
    alert("✅ Đăng ký thành công! Mời bạn đăng nhập.");
    window.location.href = "login.html";
  }
});
