// Simple fund management - no conflicts
document.addEventListener('DOMContentLoaded', function() {
    console.log('Fund simple loaded');
    
    const currentUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
    const fundForm = document.getElementById('fund-form');
    const fundList = document.getElementById('fund-list');
    
    // Simple form handler
    if (fundForm) {
        fundForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            const nameInput = document.getElementById('fund-name');
            const targetInput = document.getElementById('fund-target');
            const amountInput = document.getElementById('fund-amount');
            
            const name = nameInput.value.trim();
            const targetStr = targetInput.value.trim();
            const amountStr = amountInput.value.trim();
            
            console.log('Raw values:', { name, targetStr, amountStr });
            
            // Simple validation
            if (!name) {
                alert('Nhập tên quỹ!');
                return;
            }
            if (!targetStr) {
                alert('Nhập số tiền mục tiêu!');
                return;
            }
            if (!amountStr) {
                alert('Nhập số tiền ban đầu!');
                return;
            }
            
            // Parse numbers - handle empty strings
            const target = targetStr ? parseInt(targetStr.replace(/[^0-9]/g, '')) || 0 : 0;
            const amount = amountStr ? parseInt(amountStr.replace(/[^0-9]/g, '')) || 0 : 0;
            
            console.log('Parsed numbers:', { target, amount });
            
            if (target <= 0) {
                alert('Số tiền mục tiêu phải lớn hơn 0!');
                return;
            }
            
            if (amount < 0) {
                alert('Số tiền ban đầu không thể âm!');
                return;
            }
            
            console.log('Validation passed, creating fund...');
            
            if (amount > target) {
                alert('Số tiền ban đầu không thể lớn hơn mục tiêu!');
                return;
            }
            
            // Create fund
            const fund = {
                id: Date.now(),
                name: name,
                target: target,
                current: amount,
                created: new Date().toLocaleDateString('vi-VN')
            };
            
            // Save
            const funds = JSON.parse(localStorage.getItem('funds_' + currentUser) || '[]');
            funds.push(fund);
            localStorage.setItem('funds_' + currentUser, JSON.stringify(funds));
            
            // Reset and reload
            fundForm.reset();
            loadFunds();
            alert('Tạo quỹ thành công!');
        });
    }
    
    // Load funds
    function loadFunds() {
        if (!fundList) return;
        
        const funds = JSON.parse(localStorage.getItem('funds_' + currentUser) || '[]');
        fundList.innerHTML = '';
        
        if (funds.length === 0) {
            fundList.innerHTML = '<div class="text-muted">Chưa có quỹ nào</div>';
            return;
        }
        
        funds.forEach(fund => {
            const percentage = Math.round((fund.current / fund.target) * 100);
            
            const div = document.createElement('div');
            div.className = 'card mb-3';
            div.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-2">
                        <h6>${fund.name}</h6>
                        <small class="text-muted">${fund.created}</small>
                    </div>
                    <div class="progress mb-2" style="height: 25px;">
                        <div class="progress-bar" style="width: ${Math.min(percentage, 100)}%; background-color: ${percentage >= 100 ? '#28a745' : percentage >= 50 ? '#ffc107' : '#17a2b8'};">
                            <span style="color: white; font-weight: bold; line-height: 25px;">${percentage}%</span>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span>${fund.current.toLocaleString()} / ${fund.target.toLocaleString()} VND</span>
                        <div>
                            <button class="btn btn-sm btn-primary" onclick="addMoney(${fund.id})">Thêm</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteFund(${fund.id})">Xóa</button>
                        </div>
                    </div>
                </div>
            `;
            fundList.appendChild(div);
        });
    }
    
    // Global functions
    window.addMoney = function(fundId) {
        const amount = prompt('Nhập số tiền (VND):');
        if (!amount) return;
        
        const num = parseInt(amount.replace(/[^0-9]/g, ''));
        if (num <= 0) return;
        
        const funds = JSON.parse(localStorage.getItem('funds_' + currentUser) || '[]');
        const fund = funds.find(f => f.id === fundId);
        
        if (fund) {
            fund.current += num;
            localStorage.setItem('funds_' + currentUser, JSON.stringify(funds));
            loadFunds();
            
            if (fund.current >= fund.target) {
                alert('🎉 Đã đạt mục tiêu!');
            }
        }
    };
    
    window.deleteFund = function(fundId) {
        if (!confirm('Xóa quỹ này?')) return;
        
        const funds = JSON.parse(localStorage.getItem('funds_' + currentUser) || '[]');
        const newFunds = funds.filter(f => f.id !== fundId);
        localStorage.setItem('funds_' + currentUser, JSON.stringify(newFunds));
        loadFunds();
    };
    
    // Initial load
    loadFunds();
});