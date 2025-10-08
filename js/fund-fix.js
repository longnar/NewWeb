// Simple fund fix
console.log('Fund fix loaded');

const currentUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
console.log('Current user:', currentUser);

// Wait for DOM
setTimeout(function() {
    const fundForm = document.getElementById('fund-form');
    const fundList = document.getElementById('fund-list');
    
    console.log('Fund form found:', !!fundForm);
    console.log('Fund list found:', !!fundList);
    
    if (fundForm) {
        // Remove any existing listeners
        fundForm.onsubmit = null;
        
        fundForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('=== FORM SUBMIT ===');
            
            const name = document.getElementById('fund-name').value;
            const target = document.getElementById('fund-target').value;
            const amount = document.getElementById('fund-amount').value;
            
            console.log('Form values:', {name, target, amount});
            
            if (!name.trim()) {
                alert('Nhập tên quỹ!');
                return;
            }
            
            if (!target.trim()) {
                alert('Nhập mục tiêu!');
                return;
            }
            
            const targetNum = parseInt(target.replace(/[^0-9]/g, '')) || 0;
            const amountNum = amount.trim() ? parseInt(amount.replace(/[^0-9]/g, '')) || 0 : 0;
            
            console.log('Numbers:', {targetNum, amountNum});
            
            if (targetNum <= 0) {
                alert('Mục tiêu phải > 0!');
                return;
            }
            
            if (amountNum > targetNum) {
                alert('Số tiền ban đầu không được lớn hơn mục tiêu!');
                return;
            }
            
            const fund = {
                id: Date.now(),
                name: name.trim(),
                target: targetNum,
                current: amountNum,
                created: new Date().toLocaleDateString()
            };
            
            console.log('Creating fund:', fund);
            
            const funds = JSON.parse(localStorage.getItem('funds_' + currentUser) || '[]');
            funds.push(fund);
            localStorage.setItem('funds_' + currentUser, JSON.stringify(funds));
            
            console.log('Fund saved, total funds:', funds.length);
            
            // Reset form
            fundForm.reset();
            
            // Reload funds
            loadFunds();
            
            alert('Tạo quỹ thành công!');
        });
    }
    
    function loadFunds() {
        if (!fundList) return;
        
        const funds = JSON.parse(localStorage.getItem('funds_' + currentUser) || '[]');
        console.log('Loading funds:', funds.length);
        
        fundList.innerHTML = '';
        
        if (funds.length === 0) {
            fundList.innerHTML = '<div class="text-muted">Chưa có quỹ nào</div>';
            return;
        }
        
        funds.forEach(fund => {
            // Handle old fund format
            const target = fund.target || fund.total || 0;
            const current = fund.current || 0;
            const name = fund.name || 'Quỹ không tên';
            
            console.log('Processing fund:', {name, target, current});
            console.log('Formatted numbers:', {
                current: current.toLocaleString('vi-VN'),
                target: target.toLocaleString('vi-VN')
            });
            
            const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
            
            const div = document.createElement('div');
            div.className = 'card mb-3';
            div.innerHTML = `
                <div class="card-body">
                    <h6>${name}</h6>
                    <div class="progress mb-2" style="height: 25px;">
                        <div class="progress-bar bg-primary" style="width: ${Math.min(percentage, 100)}%;">
                            ${percentage}%
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span>${current.toLocaleString('vi-VN')} / ${target.toLocaleString('vi-VN')} VND</span>
                        <div>
                            <button class="btn btn-sm btn-success me-1" onclick="addMoney(${fund.id || Date.now()})">Thêm tiền</button>
                            <button class="btn btn-sm btn-info me-1" onclick="addMember(${fund.id || Date.now()})">Thành viên</button>
                            <button class="btn btn-sm btn-warning me-1" onclick="spendFromFund(${fund.id || Date.now()})">Chi tiêu</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteFund(${fund.id || Date.now()})">Xóa</button>
                        </div>
                    </div>
                    ${(fund.members && fund.members.length > 0) ? `
                        <div class="mt-2">
                            <small class="text-muted">Thành viên:</small>
                            <ul class="list-unstyled mt-1">
                                ${fund.members.map(m => `<li class="small">• ${m.name}: ${m.amount.toLocaleString('vi-VN')} VND (${m.date})</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    </div>
                </div>
            `;
            fundList.appendChild(div);
        });
    }
    
    // Global functions
    window.addMoney = function(fundId) {
        console.log('Adding money to fund:', fundId);
        
        // Check current balance first
        const income = parseFloat(localStorage.getItem('income_' + currentUser)) || 0;
        const expenses = JSON.parse(localStorage.getItem('expenses_' + currentUser) || '[]');
        const funds = JSON.parse(localStorage.getItem('funds_' + currentUser) || '[]');
        
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const totalFunds = funds.reduce((sum, f) => sum + (f.current || 0), 0);
        const availableBalance = income - totalExpenses - totalFunds;
        
        if (availableBalance <= 0) {
            alert('Không đủ số dư! Số dư hiện tại: ' + availableBalance.toLocaleString('vi-VN') + ' VND');
            return;
        }
        
        const amount = prompt('Nhập số tiền muốn thêm (VND):\nSố dư khả dụng: ' + availableBalance.toLocaleString('vi-VN') + ' VND');
        if (!amount) return;
        
        const num = parseInt(amount.replace(/[^0-9]/g, '')) || 0;
        if (num <= 0) {
            alert('Số tiền phải lớn hơn 0!');
            return;
        }
        
        if (num > availableBalance) {
            alert('Số tiền vượt quá số dư khả dụng!');
            return;
        }
        
        const fund = funds.find(f => f.id === fundId);
        
        if (fund) {
            fund.current = (fund.current || 0) + num;
            localStorage.setItem('funds_' + currentUser, JSON.stringify(funds));
            loadFunds();
            
            if (fund.current >= fund.target) {
                alert('🎉 Chúc mừng! Quỹ "' + fund.name + '" đã đạt mục tiêu!');
            } else {
                alert('Thêm tiền thành công!');
            }
        }
    };
    
    window.addMember = function(fundId) {
        console.log('Adding member to fund:', fundId);
        
        // Create form HTML
        const formHtml = `
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); max-width: 400px; margin: 20px auto;">
                <h5 style="text-align: center; margin-bottom: 20px; color: #333;">Thêm thành viên vào quỹ</h5>
                <form id="member-form">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Tên thành viên:</label>
                        <input type="text" id="member-name" placeholder="Nhập tên thành viên" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Số tiền đóng góp (VND):</label>
                        <input type="text" id="member-amount" placeholder="VD: 1.000.000" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Ngày đóng góp:</label>
                        <input type="date" id="member-date" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button type="submit" style="flex: 1; padding: 10px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Thêm</button>
                        <button type="button" id="cancel-member" style="flex: 1; padding: 10px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Đóng</button>
                    </div>
                </form>
            </div>
        `;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'member-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; align-items: center; justify-content: center;';
        overlay.innerHTML = formHtml;
        document.body.appendChild(overlay);
        
        // Set today's date as default
        document.getElementById('member-date').value = new Date().toISOString().split('T')[0];
        
        // Add currency formatting
        const amountInput = document.getElementById('member-amount');
        amountInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value) {
                this.value = parseInt(value).toLocaleString('vi-VN');
            }
        });
        
        // Handle form submission
        document.getElementById('member-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('member-name').value.trim();
            const amountStr = document.getElementById('member-amount').value;
            const date = document.getElementById('member-date').value;
            
            if (!name || !amountStr || !date) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }
            
            const amount = parseInt(amountStr.replace(/\D/g, '')) || 0;
            if (amount <= 0) {
                alert('Số tiền phải lớn hơn 0!');
                return;
            }
            
            // Add member to fund
            const funds = JSON.parse(localStorage.getItem('funds_' + currentUser) || '[]');
            const fund = funds.find(f => f.id === fundId);
            
            if (fund) {
                if (!fund.members) fund.members = [];
                
                fund.members.push({
                    name: name,
                    amount: amount,
                    date: date
                });
                
                fund.current = (fund.current || 0) + amount;
                
                localStorage.setItem('funds_' + currentUser, JSON.stringify(funds));
                
                // Close overlay
                document.body.removeChild(overlay);
                
                // Reload funds display
                loadFunds();
                
                alert('Thêm thành viên thành công!');
            }
        });
        
        // Handle cancel
        document.getElementById('cancel-member').addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
        
        // Close on overlay click
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    };
    
    window.spendFromFund = function(fundId) {
        console.log('Spending from fund:', fundId);
        
        const amount = prompt('Nhập số tiền muốn chi (VND):');
        if (!amount) return;
        
        const num = parseInt(amount.replace(/[^0-9]/g, '')) || 0;
        if (num <= 0) {
            alert('Số tiền phải lớn hơn 0!');
            return;
        }
        
        const funds = JSON.parse(localStorage.getItem('funds_' + currentUser) || '[]');
        const fund = funds.find(f => f.id === fundId);
        
        if (fund) {
            if (num > fund.current) {
                alert('Số tiền chi vượt quá số dư quỹ!');
                return;
            }
            
            const note = prompt('Ghi chú cho khoản chi tiêu:') || 'Chi từ quỹ ' + fund.name;
            
            // Subtract from fund
            fund.current -= num;
            localStorage.setItem('funds_' + currentUser, JSON.stringify(funds));
            
            // Add to expenses
            const expenses = JSON.parse(localStorage.getItem('expenses_' + currentUser) || '[]');
            expenses.push({
                id: Date.now(),
                amount: num,
                category: '🏦 Quỹ ' + fund.name,
                note: note,
                date: new Date().toISOString().split('T')[0]
            });
            localStorage.setItem('expenses_' + currentUser, JSON.stringify(expenses));
            
            alert('Chi tiêu từ quỹ thành công!');
            
            // Reload page to sync all data
            window.location.reload();
        }
    };
    
    window.deleteFund = function(fundId) {
        console.log('Deleting fund:', fundId);
        
        if (!confirm('Bạn có chắc muốn xóa quỹ này?')) return;
        
        const funds = JSON.parse(localStorage.getItem('funds_' + currentUser) || '[]');
        const newFunds = funds.filter(f => f.id !== fundId);
        
        localStorage.setItem('funds_' + currentUser, JSON.stringify(newFunds));
        loadFunds();
        
        alert('Xóa quỹ thành công!');
    };
    
    // Add formatting to fund inputs
    const fundTarget = document.getElementById('fund-target');
    const fundAmount = document.getElementById('fund-amount');
    
    function addNumberFormat(input) {
        if (!input) return;
        
        input.addEventListener('input', function() {
            let value = this.value.replace(/[^0-9]/g, '');
            if (value) {
                this.value = parseInt(value).toLocaleString('vi-VN');
            }
        });
        
        // Block non-numeric keys
        input.addEventListener('keydown', function(e) {
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'];
            if (allowedKeys.includes(e.key)) return;
            if (e.key >= '0' && e.key <= '9') return;
            e.preventDefault();
        });
    }
    
    addNumberFormat(fundTarget);
    addNumberFormat(fundAmount);
    
    // Initial load
    loadFunds();
    
}, 500);