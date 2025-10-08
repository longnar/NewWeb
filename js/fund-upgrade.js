// Enhanced fund management with progress tracking
setTimeout(function() {
    console.log('Fund upgrade loaded');
    
    const currentUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
    const fundForm = document.getElementById('fund-form');
    const fundList = document.getElementById('fund-list');
    
    // Load existing funds
    loadFunds();
    
    // Create fund with progress tracking
    if (fundForm) {
        fundForm.onsubmit = function(e) {
            e.preventDefault();
            
            const name = document.getElementById('fund-name').value.trim();
            const targetValue = document.getElementById('fund-target').value.trim();
            const initialValue = document.getElementById('fund-amount').value.trim();
            
            console.log('Form values:', { name, targetValue, initialValue });
            
            if (!name || !targetValue || !initialValue) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }
            
            const target = parseVND(targetValue);
            const initial = parseVND(initialValue);
            
            if (target <= 0 || initial <= 0) {
                alert('Số tiền phải lớn hơn 0!');
                return;
            }
            
            if (initial > target) {
                alert('Số tiền ban đầu không thể lớn hơn mục tiêu!');
                return;
            }
            
            // Create fund object
            const fund = {
                id: Date.now(),
                name: name,
                target: target,
                current: initial,
                created: new Date().toLocaleDateString('vi-VN')
            };
            
            // Save to localStorage
            const funds = JSON.parse(localStorage.getItem('funds_' + currentUser) || '[]');
            funds.push(fund);
            localStorage.setItem('funds_' + currentUser, JSON.stringify(funds));
            
            // Reset form and reload
            fundForm.reset();
            loadFunds();
            
            alert('Tạo quỹ thành công!');
        };
    }
    
    function loadFunds() {
        if (!fundList) return;
        
        const funds = JSON.parse(localStorage.getItem('funds_' + currentUser) || '[]');
        fundList.innerHTML = '';
        
        if (funds.length === 0) {
            fundList.innerHTML = '<li class="text-muted" style="list-style: none;">Chưa có quỹ nào</li>';
            return;
        }
        
        console.log('Loading funds:', funds.length, 'funds found');
        
        funds.forEach(fund => {
            const percentage = Math.round((fund.current / fund.target) * 100);
            const progressColor = percentage >= 100 ? 'success' : percentage >= 50 ? 'warning' : 'info';
            
            const li = document.createElement('li');
            li.className = 'fund-item mb-3 p-3 border rounded';
            li.style.listStyle = 'none';
            li.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0 fund-name">${fund.name}</h6>
                    <small class="text-muted fund-date">Tạo: ${fund.created}</small>
                </div>
                <div class="progress mb-2 fund-progress">
                    <div class="progress-bar bg-${progressColor} fund-bar" role="progressbar" style="width: ${Math.min(percentage, 100)}%" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100">
                        ${percentage}%
                    </div>
                </div>
                <div class="d-flex justify-content-between fund-info">
                    <span class="fund-amount">${formatVND(fund.current)} / ${formatVND(fund.target)}</span>
                    <div class="fund-actions">
                        <button class="btn btn-sm btn-primary me-1" onclick="addToFund(${fund.id})">Thêm tiền</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteFund(${fund.id})">Xóa</button>
                    </div>
                </div>
            `;
            fundList.appendChild(li);
        });
    }
    
    // Format number with VND
    function formatVND(number) {
        return new Intl.NumberFormat('vi-VN').format(number) + ' VND';
    }
    
    function parseVND(str) {
        return parseInt(str.replace(/[^0-9]/g, '')) || 0;
    }
    
    // Add VND formatting to inputs
    const fundTarget = document.getElementById('fund-target');
    const fundAmount = document.getElementById('fund-amount');
    
    function formatInput(input) {
        if (!input) return;
        
        input.addEventListener('input', function() {
            let value = this.value.replace(/[^0-9]/g, '');
            let cursorPos = this.selectionStart;
            let oldLength = this.value.length;
            
            if (value) {
                this.value = new Intl.NumberFormat('vi-VN').format(parseInt(value));
            } else {
                this.value = '';
            }
            
            // Maintain cursor position
            let newLength = this.value.length;
            let newPos = cursorPos + (newLength - oldLength);
            this.setSelectionRange(newPos, newPos);
        });
        
        // Allow only numbers and commas
        input.addEventListener('keypress', function(e) {
            if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                e.preventDefault();
            }
        });
    }
    
    formatInput(fundTarget);
    formatInput(fundAmount);
    
    // Global functions for fund management
    window.addToFund = function(fundId) {
        const amount = prompt('Nhập số tiền muốn thêm:\n(VD: 100000 hoặc 100,000)');
        if (!amount) return;
        
        const parsedAmount = parseVND(amount);
        if (parsedAmount <= 0) {
            alert('Số tiền không hợp lệ!');
            return;
        }
        
        const funds = JSON.parse(localStorage.getItem('funds_' + currentUser) || '[]');
        const fund = funds.find(f => f.id === fundId);
        
        if (fund) {
            fund.current += parsedAmount;
            localStorage.setItem('funds_' + currentUser, JSON.stringify(funds));
            loadFunds();
            
            if (fund.current >= fund.target) {
                alert(`🎉 Chúc mừng! Quỹ "${fund.name}" đã đạt mục tiêu!`);
            }
        }
    };
    
    window.deleteFund = function(fundId) {
        if (!confirm('Bạn có chắc muốn xóa quỹ này?')) return;
        
        const funds = JSON.parse(localStorage.getItem('funds_' + currentUser) || '[]');
        const newFunds = funds.filter(f => f.id !== fundId);
        localStorage.setItem('funds_' + currentUser, JSON.stringify(newFunds));
        loadFunds();
    };
    
}, 100);