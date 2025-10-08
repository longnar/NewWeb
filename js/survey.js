// Survey functionality
document.addEventListener('DOMContentLoaded', function() {
    const surveyForm = document.getElementById('survey-form');
    const surveyResult = document.getElementById('survey-result');
    const suggestions = document.getElementById('suggestions');
    
    // Load existing survey if available
    const currentUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
    const existingSurvey = localStorage.getItem('survey_' + currentUser);
    
    if (existingSurvey) {
        const data = JSON.parse(existingSurvey);
        showSuggestions(data);
    }
    
    surveyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const surveyData = {
            age: formData.get('age'),
            job: formData.get('job'),
            income: formData.get('income'),
            hobbies: formData.getAll('hobbies'),
            goal: formData.get('goal'),
            timestamp: new Date().toISOString()
        };
        
        // Save survey data
        localStorage.setItem('survey_' + currentUser, JSON.stringify(surveyData));
        
        // Mark user as no longer new (completed survey)
        localStorage.removeItem('isNewUser_' + currentUser);
        
        // Show suggestions
        showSuggestions(surveyData);
        
        alert('Khảo sát hoàn thành! Xem gợi ý bên dưới.');
    });
    
    function showSuggestions(data) {
        const expenseSuggestions = generateSuggestions(data);
        
        let html = '<div class="row">';
        expenseSuggestions.forEach(suggestion => {
            html += `
                <div class="col-md-6 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h6>${suggestion.category}</h6>
                            <p class="text-muted">${suggestion.amount}</p>
                            <small>${suggestion.reason}</small>
                            <br>
                            <button class="btn btn-sm btn-outline-primary mt-2" onclick="addSuggestedExpense('${suggestion.category}', '${suggestion.amount}')">
                                Thêm vào chi tiêu
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        suggestions.innerHTML = html;
        surveyResult.style.display = 'block';
    }
    
    function generateSuggestions(data) {
        const suggestions = [];
        
        // Base suggestions based on income
        const incomeMultiplier = {
            'low': { base: 50000, max: 200000 },
            'medium': { base: 100000, max: 500000 },
            'high': { base: 200000, max: 1000000 }
        };
        
        const multiplier = incomeMultiplier[data.income] || incomeMultiplier['medium'];
        
        // Age-based suggestions
        if (data.age === '18-25') {
            suggestions.push({
                category: '🍜 Ăn uống',
                amount: (multiplier.base * 2).toLocaleString('vi-VN') + ' VND',
                reason: 'Sinh viên/người trẻ thường ăn ngoài nhiều'
            });
            suggestions.push({
                category: '🎬 Giải trí',
                amount: (multiplier.base * 1.5).toLocaleString('vi-VN') + ' VND',
                reason: 'Tuổi trẻ cần thư giãn và giải trí'
            });
        }
        
        if (data.age === '26-35' || data.age === '36-50') {
            suggestions.push({
                category: '🏠 Sinh hoạt',
                amount: (multiplier.base * 3).toLocaleString('vi-VN') + ' VND',
                reason: 'Chi phí sinh hoạt gia đình'
            });
            suggestions.push({
                category: '👶 Con cái',
                amount: (multiplier.base * 2).toLocaleString('vi-VN') + ' VND',
                reason: 'Chi phí nuôi dạy con'
            });
        }
        
        // Job-based suggestions
        if (data.job === 'student') {
            suggestions.push({
                category: '📚 Học tập',
                amount: (multiplier.base * 1).toLocaleString('vi-VN') + ' VND',
                reason: 'Sách vở, khóa học'
            });
        }
        
        if (data.job === 'office') {
            suggestions.push({
                category: '🚌 Đi lại',
                amount: (multiplier.base * 1.5).toLocaleString('vi-VN') + ' VND',
                reason: 'Chi phí đi làm hàng ngày'
            });
        }
        
        // Hobby-based suggestions
        if (data.hobbies.includes('food')) {
            suggestions.push({
                category: '🍽️ Nhà hàng',
                amount: (multiplier.base * 2.5).toLocaleString('vi-VN') + ' VND',
                reason: 'Thích ăn uống, khám phá món mới'
            });
        }
        
        if (data.hobbies.includes('travel')) {
            suggestions.push({
                category: '✈️ Du lịch',
                amount: (multiplier.max * 0.5).toLocaleString('vi-VN') + ' VND',
                reason: 'Quỹ cho các chuyến du lịch'
            });
        }
        
        if (data.hobbies.includes('shopping')) {
            suggestions.push({
                category: '🛍️ Mua sắm',
                amount: (multiplier.base * 2).toLocaleString('vi-VN') + ' VND',
                reason: 'Quần áo, phụ kiện cá nhân'
            });
        }
        
        if (data.hobbies.includes('fitness')) {
            suggestions.push({
                category: '💪 Thể thao',
                amount: (multiplier.base * 1.5).toLocaleString('vi-VN') + ' VND',
                reason: 'Gym, thiết bị thể thao'
            });
        }
        
        // Goal-based suggestions
        if (data.goal === 'save') {
            suggestions.push({
                category: '💰 Tiết kiệm',
                amount: (multiplier.max * 0.3).toLocaleString('vi-VN') + ' VND',
                reason: 'Quỹ tiết kiệm hàng tháng'
            });
        }
        
        if (data.goal === 'invest') {
            suggestions.push({
                category: '📈 Đầu tư',
                amount: (multiplier.max * 0.4).toLocaleString('vi-VN') + ' VND',
                reason: 'Quỹ đầu tư chứng khoán/crypto'
            });
        }
        
        return suggestions.slice(0, 6); // Limit to 6 suggestions
    }
    
    // Global function to add suggested expense
    window.addSuggestedExpense = function(category, amount) {
        const numAmount = parseInt(amount.replace(/[^0-9]/g, ''));
        
        // Save to expenses
        const expenses = JSON.parse(localStorage.getItem('expenses_' + currentUser) || '[]');
        expenses.push({
            amount: numAmount,
            category: category,
            note: 'Từ gợi ý khảo sát',
            date: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('expenses_' + currentUser, JSON.stringify(expenses));
        
        alert('Đã thêm vào danh sách chi tiêu!');
    };
});