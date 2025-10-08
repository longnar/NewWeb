document.addEventListener("DOMContentLoaded", () => {
  // ===== LẤY USER ĐANG ĐĂNG NHẬP =====
  const currentUser = localStorage.getItem("loggedIn") || localStorage.getItem("currentUser");
  if (!currentUser) window.location.href = "login.html";
  
  // Set currentUser if only loggedIn exists
  if (!localStorage.getItem("currentUser") && localStorage.getItem("loggedIn")) {
    localStorage.setItem("currentUser", localStorage.getItem("loggedIn"));
  }

  // ===== HỖ TRỢ FORMAT TIỀN =====
  function formatCurrencyInput(input) {
    input.addEventListener("input", function() {
      let value = this.value.replace(/\D/g, "");
      this.value = value ? parseInt(value).toLocaleString("vi-VN") : "";
    });
    
    // Block non-numeric keys
    input.addEventListener('keydown', function(e) {
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'];
      if (allowedKeys.includes(e.key)) return;
      if (e.key >= '0' && e.key <= '9') return;
      e.preventDefault();
    });
  }
  function getNumericValue(inputId) {
    return parseFloat(document.getElementById(inputId).value.replace(/\D/g, "")) || 0;
  }

  // ===== TAB CHUYỂN ĐỔI =====
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".tab-content");
  tabLinks.forEach(link => {
    link.addEventListener("click", e => {
      // Allow external links (like settings.html) to work normally
      if (link.getAttribute('href') && link.getAttribute('href') !== '#') {
        return; // Don't prevent default for external links
      }
      
      e.preventDefault();
      tabLinks.forEach(l => l.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      link.classList.add("active");
      document.getElementById(link.dataset.tab).classList.add("active");
    });
  });

  // ===== CHI TIÊU =====
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");
  let expenses = JSON.parse(localStorage.getItem("expenses_" + currentUser)) || [];

  const categoryInput = document.getElementById("category");
  const customCategoryInput = document.getElementById("custom-category");
  const categoryButtons = document.querySelectorAll(".category-btn");

  categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      categoryButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (btn.dataset.category === "Khác") {
        customCategoryInput.style.display = "block";
        customCategoryInput.focus();
        categoryInput.value = "";
      } else {
        customCategoryInput.style.display = "none";
        categoryInput.value = btn.dataset.category;
      }
    });
  });

  expenseForm.addEventListener("submit", e => {
    e.preventDefault();
    
    // Check if user has income first
    if (income <= 0) {
      alert('❌ Bạn cần nhập thu nhập trước khi thêm chi tiêu!');
      return;
    }
    
    let category = categoryInput.value || (customCategoryInput.style.display === "block" ? customCategoryInput.value.trim() : "");
    if (!category) return alert("❌ Vui lòng chọn hoặc nhập danh mục!");
    
    const expense = {
      id: Date.now(),
      amount: getNumericValue("amount"),
      category,
      note: document.getElementById("note").value,
      date: document.getElementById("date").value
    };
    expenses.push(expense);
    localStorage.setItem("expenses_" + currentUser, JSON.stringify(expenses));
    renderExpenses();
    updateFinanceOverview();
    expenseForm.reset();
    categoryButtons.forEach(b => b.classList.remove("active"));
    customCategoryInput.style.display = "none";
  });

  function renderExpenses() {
    expenseList.innerHTML = "";
    expenses.forEach(e => {
      const li = document.createElement("li");
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.innerHTML = `
        <span>${e.date} | ${e.category} | ${e.amount.toLocaleString("vi-VN")} VND (${e.note})</span>
        <button class="btn btn-sm btn-danger" onclick="deleteExpense(${e.id || Date.now()})">Xóa</button>
      `;
      expenseList.appendChild(li);
    });
  }

  // ===== QUỸ CHUNG =====
  const fundForm = document.getElementById("fund-form");
  const fundList = document.getElementById("fund-list");
  let funds = JSON.parse(localStorage.getItem("funds_" + currentUser)) || [];

  function saveFunds() { localStorage.setItem("funds_" + currentUser, JSON.stringify(funds)); }

  // Disabled old fund form - using fund-simple.js instead
  /*
  fundForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("fund-name").value.trim();
    const amount = getNumericValue("fund-amount");
    const existing = funds.find(f => f.name === name);
    if (existing) existing.total += amount;
    else funds.push({ name, total: amount, members: [] });
    saveFunds();
    renderFunds();
    updateFinanceOverview();
    fundForm.reset();
  });
  */

  // Disabled old renderFunds - using fund-simple.js instead
  /*
  function renderFunds() {
    fundList.innerHTML = "";
    funds.forEach((fund, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${fund.name}</strong> | Số dư: ${fund.total.toLocaleString("vi-VN")} VND
        <button onclick="addMember(${i})">+ Thành viên</button>
        <button onclick="addExpense(${i})">- Chi tiêu</button>
        <ul>${fund.members.map(m => `<li>${m.name}: ${m.amount.toLocaleString("vi-VN")} VND</li>`).join("")}</ul>
        <div style="width:250px; height:250px;"><canvas id="chart-${i}"></canvas></div>
      `;
      fundList.appendChild(li);
      drawChart(fund.members, `chart-${i}`);
    });
  }
  */

  window.addMember = function(i) {
    const name = prompt("Tên thành viên:");
    let amount = prompt("Số tiền đóng góp:");
    if (name && amount) {
      amount = parseFloat(amount.replace(/\D/g, ""));
      if (!isNaN(amount)) {
        funds[i].members.push({ name, amount });
        funds[i].total += amount;
        saveFunds(); renderFunds(); updateFinanceOverview();
      } else alert("❌ Số tiền không hợp lệ");
    }
  };

  window.addExpense = function(i) {
    const note = prompt("Ghi chú chi tiêu:");
    let amount = prompt("Số tiền chi:");
    if (amount) {
      amount = parseFloat(amount.replace(/\D/g, ""));
      if (!isNaN(amount) && amount > 0 && amount <= funds[i].total) {
        funds[i].total -= amount;
        alert(`Đã chi ${amount.toLocaleString("vi-VN")} VND từ quỹ "${funds[i].name}" (${note})`);
        saveFunds(); renderFunds(); updateFinanceOverview();
      } else alert("❌ Số tiền không hợp lệ hoặc vượt quá số dư quỹ");
    }
  };

  function drawChart(members, canvasId) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    if (!members.length) { ctx.font = "14px Arial"; ctx.fillText("Chưa có thành viên đóng góp", 20, 50); return; }
    new Chart(ctx, {
      type: "pie",
      data: { labels: members.map(m => m.name), datasets: [{ data: members.map(m => m.amount), backgroundColor: ["#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF","#FF9F40"] }] },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:"bottom" } } }
    });
  }

  // ===== THU NHẬP & TỔNG QUAN =====
  const incomeForm = document.getElementById("income-form");
  const incomeDisplay = document.getElementById("show-income");
  const expenseDisplay = document.getElementById("show-expenses");
  const fundsDisplay = document.getElementById("show-funds");
  const balanceDisplay = document.getElementById("show-balance");
  let income = parseFloat(localStorage.getItem("income_" + currentUser)) || 0;

  incomeForm.addEventListener("submit", e => {
    e.preventDefault();
    income += getNumericValue("income-amount");
    localStorage.setItem("income_" + currentUser, income);
    updateFinanceOverview(); incomeForm.reset();
  });

  function getTotalFundContribution() { return funds.reduce((sum, f) => sum + (f.current || 0), 0); }

  let financeChart = null;
  function updateFinanceOverview() {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalFunds = getTotalFundContribution();
    const balance = income - totalExpenses - totalFunds;

    incomeDisplay.textContent = income.toLocaleString("vi-VN");
    expenseDisplay.textContent = totalExpenses.toLocaleString("vi-VN");
    fundsDisplay.textContent = totalFunds.toLocaleString("vi-VN");
    balanceDisplay.textContent = balance.toLocaleString("vi-VN");

    drawFinanceChart();
  }

  function drawFinanceChart() {
    const ctx = document.getElementById("financeChart").getContext("2d");
    if (financeChart) financeChart.destroy();
    const categoryTotals = {};
    expenses.forEach(e => categoryTotals[e.category] = (categoryTotals[e.category]||0) + e.amount);

    financeChart = new Chart(ctx, {
      type: "pie",
      data: { labels:Object.keys(categoryTotals), datasets:[{ data:Object.values(categoryTotals), backgroundColor:["#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF","#FF9F40"] }] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:"bottom" } } }
    });
  }

  // ===== APPLY FORMAT TIỀN =====
  ["income-amount","amount","fund-amount"].forEach(id => formatCurrencyInput(document.getElementById(id)));



  // ===== XÓA CHI TIÊu =====
  window.deleteExpense = function(expenseId) {
    if (confirm('Bạn có chắc chắn muốn xóa khoản chi tiêu này?')) {
      expenses = expenses.filter(e => e.id !== expenseId);
      localStorage.setItem("expenses_" + currentUser, JSON.stringify(expenses));
      renderExpenses();
      updateFinanceOverview();
      alert('Xóa chi tiêu thành công!');
    }
  };

  // ===== RENDER FUNDS =====
  window.renderFunds = function() {
    // This function is handled by fund-fix.js
    // Just reload data to sync
    funds = JSON.parse(localStorage.getItem("funds_" + currentUser)) || [];
  };

  // ===== RENDER LẦN ĐẦU =====
  expenses = JSON.parse(localStorage.getItem("expenses_" + currentUser)) || [];
  funds = JSON.parse(localStorage.getItem("funds_" + currentUser)) || [];
  renderExpenses(); renderFunds(); updateFinanceOverview();
  


  // ===== USER MENU =====
  setTimeout(function() {
    const userAvatar = document.getElementById('user-avatar');
    const userDropdown = document.getElementById('user-dropdown');
    const usernameDisplay = document.getElementById('username-display');
    const avatarImg = document.getElementById('avatar-img');
    const logoutMenu = document.getElementById('logout-menu');
    
    console.log('Elements found:', {
      userAvatar: !!userAvatar,
      userDropdown: !!userDropdown,
      usernameDisplay: !!usernameDisplay,
      avatarImg: !!avatarImg
    });
    
    if (usernameDisplay) {
      const displayName = localStorage.getItem('fullname_' + currentUser) || currentUser || 'User';
      usernameDisplay.textContent = displayName;
      console.log('Username display set to:', displayName);
    }
    
    // Load avatar
    if (avatarImg) {
      const savedAvatar = localStorage.getItem('avatar_' + currentUser);
      if (savedAvatar) {
        avatarImg.src = savedAvatar;
      } else {
        avatarImg.src = 'images/tải xuống.jfif';
      }
    }
    
    // Toolbar toggle
    if (userAvatar && userDropdown) {
      userAvatar.onclick = function() {
        console.log('Avatar clicked!');
        if (userDropdown.style.display === 'flex') {
          userDropdown.style.display = 'none';
        } else {
          userDropdown.style.display = 'flex';
        }
      };
    }
    
    // Logout
    if (logoutMenu) {
      logoutMenu.onclick = function(e) {
        e.preventDefault();
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
          localStorage.clear();
          window.location.href = 'login.html';
        }
      };
    }
    
    // Close on outside click
    document.onclick = function(e) {
      if (userDropdown && !userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.style.display = 'none';
      }
    };
  }, 100);
  

});
