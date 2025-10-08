// Popup survey for new users
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
    const isNewUser = localStorage.getItem('isNewUser_' + currentUser);
    const surveyPopup = document.getElementById('survey-popup');
    
    // Show popup for new users
    if (isNewUser === 'true' && surveyPopup) {
        setTimeout(() => {
            surveyPopup.style.display = 'flex';
        }, 1500);
    }
    
    // Handle form submission
    const popupForm = document.getElementById('popup-survey-form');
    if (popupForm) {
        popupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const surveyData = {
                age: formData.get('age'),
                job: formData.get('job'),
                income: formData.get('income'),
                hobbies: formData.getAll('hobbies'),
                timestamp: new Date().toISOString()
            };
            
            // Save survey data
            localStorage.setItem('survey_' + currentUser, JSON.stringify(surveyData));
            localStorage.removeItem('isNewUser_' + currentUser);
            
            // Hide survey popup
            surveyPopup.style.display = 'none';
            
            // Show suggestions
            showSuggestions(surveyData);
        });
    }
    
    // Skip survey
    const skipBtn = document.getElementById('skip-survey');
    if (skipBtn) {
        skipBtn.addEventListener('click', function() {
            localStorage.removeItem('isNewUser_' + currentUser);
            surveyPopup.style.display = 'none';
        });
    }
    
    // Close suggestions popup
    const closeSuggestionsBtn = document.getElementById('close-suggestions');
    if (closeSuggestionsBtn) {
        closeSuggestionsBtn.addEventListener('click', function() {
            document.getElementById('suggestions-popup').style.display = 'none';
        });
    }
    
    // Format income input
    const incomeInput = document.getElementById('income-input');
    if (incomeInput) {
        incomeInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value) {
                this.value = parseInt(value).toLocaleString('vi-VN');
            }
        });
        
        // Block non-numeric keys
        incomeInput.addEventListener('keydown', function(e) {
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'];
            if (allowedKeys.includes(e.key)) return;
            if (e.key >= '0' && e.key <= '9') return;
            e.preventDefault();
        });
    }
});

function showSuggestions(data) {
    const suggestions = generateSuggestions(data);
    const suggestionsPopup = document.getElementById('suggestions-popup');
    const suggestionsList = document.getElementById('suggestions-list');
    
    let html = '<div class="row">';
    suggestions.forEach((suggestion, index) => {
        html += `
            <div class="col-md-6 mb-3">
                <div class="card" style="background: rgba(50, 0, 80, 0.8); border: 1px solid #8A2BE2; color: #E6E6FA;">
                    <div class="card-body">
                        <h6>${suggestion.category}</h6>
                        <p class="text-muted">${suggestion.amount}</p>
                        <small>${suggestion.reason}</small>
                        <br>
                        <button class="btn btn-sm btn-outline-light mt-2" onclick="addSuggestedExpense('${suggestion.category}', '${suggestion.amount}')">
                            Thêm vào chi tiêu
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    suggestionsList.innerHTML = html;
    suggestionsPopup.style.display = 'flex';
}

function generateSuggestions(data) {
    const suggestions = [];
    
    // Get actual income from user input (remove dots and non-digits)
    const monthlyIncome = parseInt(data.income.replace(/\D/g, '')) || 10000000;
    
    // Financial management rules by job type
    let budgetRules = {};
    
    if (data.job === 'student') {
        // Student budget: focus on essentials + small entertainment
        budgetRules = {
            food: 0.4,        // 40% for food
            transport: 0.15,  // 15% transport
            study: 0.2,       // 20% study materials
            entertainment: 0.15, // 15% entertainment
            savings: 0.1      // 10% savings
        };
    } else if (data.job === 'worker') {
        // 50/30/20 rule for new workers
        budgetRules = {
            essentials: 0.5,  // 50% needs (food, transport, utilities)
            wants: 0.3,       // 30% wants
            savings: 0.2      // 20% savings/investment
        };
    } else if (data.job === 'family') {
        // Family budget with children focus
        budgetRules = {
            essentials: 0.6,  // 60% family essentials
            children: 0.2,    // 20% children expenses
            healthcare: 0.1,  // 10% healthcare fund
            savings: 0.1      // 10% savings
        };
    } else if (data.job === 'business') {
        // Business owner budget
        budgetRules = {
            business: 0.3,    // 30% business expenses
            personal: 0.4,    // 40% personal expenses
            emergency: 0.2,   // 20% emergency fund
            investment: 0.1   // 10% investment
        };
    }
    
    // Generate suggestions based on job type
    if (data.job === 'student') {
        suggestions.push({
            category: '🍜 Ăn uống',
            amount: Math.round(monthlyIncome * budgetRules.food).toLocaleString('vi-VN') + ' VND',
            reason: `40% thu nhập cho ăn uống (quy tắc sinh viên)`
        });
        suggestions.push({
            category: '📚 Học tập',
            amount: Math.round(monthlyIncome * budgetRules.study).toLocaleString('vi-VN') + ' VND',
            reason: `20% thu nhập cho học tập`
        });
        suggestions.push({
            category: '💰 Tiết kiệm',
            amount: Math.round(monthlyIncome * budgetRules.savings).toLocaleString('vi-VN') + ' VND',
            reason: `10% thu nhập tiết kiệm`
        });
    } else if (data.job === 'worker') {
        suggestions.push({
            category: '🏠 Nhu cầu thiết yếu',
            amount: Math.round(monthlyIncome * budgetRules.essentials).toLocaleString('vi-VN') + ' VND',
            reason: `50% thu nhập cho nhu cầu cơ bản (quy tắc 50/30/20)`
        });
        suggestions.push({
            category: '🎆 Mong muốn cá nhân',
            amount: Math.round(monthlyIncome * budgetRules.wants).toLocaleString('vi-VN') + ' VND',
            reason: `30% thu nhập cho mong muốn`
        });
        suggestions.push({
            category: '💰 Tiết kiệm/Đầu tư',
            amount: Math.round(monthlyIncome * budgetRules.savings).toLocaleString('vi-VN') + ' VND',
            reason: `20% thu nhập cho tiết kiệm và đầu tư`
        });
    } else if (data.job === 'family') {
        suggestions.push({
            category: '🏠 Chi phí gia đình',
            amount: Math.round(monthlyIncome * budgetRules.essentials).toLocaleString('vi-VN') + ' VND',
            reason: `60% thu nhập cho chi phí sinh hoạt gia đình`
        });
        suggestions.push({
            category: '👶 Con cái',
            amount: Math.round(monthlyIncome * budgetRules.children).toLocaleString('vi-VN') + ' VND',
            reason: `20% thu nhập cho con cái`
        });
        suggestions.push({
            category: '🏥 Y tế gia đình',
            amount: Math.round(monthlyIncome * budgetRules.healthcare).toLocaleString('vi-VN') + ' VND',
            reason: `10% thu nhập cho quỹ y tế`
        });
    } else if (data.job === 'business') {
        suggestions.push({
            category: '💼 Kinh doanh',
            amount: Math.round(monthlyIncome * budgetRules.business).toLocaleString('vi-VN') + ' VND',
            reason: `30% thu nhập cho hoạt động kinh doanh`
        });
        suggestions.push({
            category: '🔄 Quỹ khẩn cấp',
            amount: Math.round(monthlyIncome * budgetRules.emergency).toLocaleString('vi-VN') + ' VND',
            reason: `20% thu nhập cho quỹ dự phòng`
        });
        suggestions.push({
            category: '📈 Đầu tư',
            amount: Math.round(monthlyIncome * budgetRules.investment).toLocaleString('vi-VN') + ' VND',
            reason: `10% thu nhập cho đầu tư tương lai`
        });
    }
    
    // Essential expenses for all
    suggestions.push({
        category: '🚕 Đi lại',
        amount: Math.round(monthlyIncome * 0.1).toLocaleString('vi-VN') + ' VND',
        reason: `10% thu nhập cho đi lại`
    });
    
    
    return suggestions.slice(0, 4);
}

window.addSuggestedExpense = function(category, amount) {
    const currentUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
    const numAmount = parseInt(amount.replace(/[^0-9]/g, ''));
    
    const expenses = JSON.parse(localStorage.getItem('expenses_' + currentUser) || '[]');
    expenses.push({
        amount: numAmount,
        category: category,
        note: 'Từ gợi ý khảo sát',
        date: new Date().toISOString().split('T')[0]
    });
    localStorage.setItem('expenses_' + currentUser, JSON.stringify(expenses));
    
    alert('Đã thêm vào danh sách chi tiêu!');
    
    // Refresh data without reloading page
    if (typeof renderExpenses === 'function') renderExpenses();
    if (typeof updateFinanceOverview === 'function') updateFinanceOverview();
};