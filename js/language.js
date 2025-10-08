// Language functionality
const translations = {
    vi: {
        // Dashboard
        'dashboard-title': '📊 Dashboard Quản lý Tài chính',
        'overview': '📊 Tổng quan',
        'income': '💵 Thu nhập',
        'expenses': '🧾 Chi tiêu',
        'funds': '🤝 Quỹ chung',
        'settings': '⚙️ Settings',
        'logout': '🚪 Logout',
        
        // Overview
        'financial-overview': 'Tổng quan tài chính',
        'income-label': 'Thu nhập:',
        'expenses-label': 'Chi tiêu:',
        'funds-label': 'Đóng góp quỹ:',
        'balance-label': 'Số dư còn lại:',
        
        // Forms
        'enter-income': 'Nhập thu nhập (VND)',
        'update': 'Cập nhật',
        'amount': 'Số tiền (VND)',
        'note': 'Ghi chú',
        'add-expense': 'Thêm chi tiêu',
        
        // Settings
        'change-avatar': 'Thay đổi Avatar',
        'choose-image': 'Chọn ảnh từ máy',
        'update-avatar': 'Cập nhật Avatar',
        'general-settings': 'Cài đặt chung',
        'dark-mode': 'Chế độ tối',
        'language': 'Ngôn ngữ',
        'change-password': 'Đổi mật khẩu',
        'contact': 'Liên hệ',
        'personal-income': 'Thu nhập cá nhân',
        'personal-expenses': 'Chi tiêu cá nhân',
        'common-fund': 'Quỹ chung',
        'eating': '🍜 Ăn uống',
        'movie': '🎬 Xem phim',
        'shopping': '🛍️ Mua sắm',
        'transport': '🚌 Đi lại',
        'other': '➕ Khác',
        'fund-name': 'Tên quỹ (VD: Quỹ Du Lịch)',
        'initial-amount': 'Số tiền ban đầu (VND)',
        'target-amount': 'Số tiền mục tiêu (VND)',
        'create-fund': 'Tạo quỹ',
        'system-settings': 'Cài đặt hệ thống',
        'overview-link': 'Tổng quan',
        'logout-link': 'Đăng xuất',
        'current-password': 'Mật khẩu hiện tại',
        'new-password': 'Mật khẩu mới',
        'confirm-password': 'Xác nhận mật khẩu mới',
        'your-email': 'Email của bạn',
        'detailed-description': 'Mô tả chi tiết...',
        'support-info': 'Hỗ trợ: JPG, PNG, GIF. Kích thước tối đa 2MB',
        'select-issue': 'Chọn loại vấn đề',
        'bug-report': 'Báo lỗi',
        'feature-request': 'Đề xuất tính năng',
        'support': 'Hỗ trợ',
        'other-issue': 'Khác',
        'send': 'Gửi',
        'change-password-btn': 'Đổi mật khẩu',
        'delete-account': 'Xóa tài khoản',
        'cannot-undo': 'Hành động này không thể hoàn tác',
        'choose-file': 'Chọn tệp',
        'no-file-selected': 'Chưa chọn tệp nào'
    },
    en: {
        // Dashboard
        'dashboard-title': '📊 Financial Management Dashboard',
        'overview': '📊 Overview',
        'income': '💵 Income',
        'expenses': '🧾 Expenses',
        'funds': '🤝 Funds',
        'settings': '⚙️ Settings',
        'logout': '🚪 Logout',
        
        // Overview
        'financial-overview': 'Financial Overview',
        'income-label': 'Income:',
        'expenses-label': 'Expenses:',
        'funds-label': 'Fund Contributions:',
        'balance-label': 'Remaining Balance:',
        
        // Forms
        'enter-income': 'Enter income (VND)',
        'update': 'Update',
        'amount': 'Amount (VND)',
        'note': 'Note',
        'add-expense': 'Add Expense',
        
        // Settings
        'change-avatar': 'Change Avatar',
        'choose-image': 'Choose image from computer',
        'update-avatar': 'Update Avatar',
        'general-settings': 'General Settings',
        'dark-mode': 'Dark Mode',
        'language': 'Language',
        'change-password': 'Change Password',
        'contact': 'Contact',
        'personal-income': 'Personal Income',
        'personal-expenses': 'Personal Expenses',
        'common-fund': 'Common Fund',
        'eating': '🍜 Food & Drink',
        'movie': '🎬 Movies',
        'shopping': '🛍️ Shopping',
        'transport': '🚌 Transport',
        'other': '➕ Other',
        'fund-name': 'Fund name (e.g: Travel Fund)',
        'initial-amount': 'Initial amount (VND)',
        'target-amount': 'Target amount (VND)',
        'create-fund': 'Create Fund',
        'system-settings': 'System Settings',
        'overview-link': 'Overview',
        'logout-link': 'Logout',
        'current-password': 'Current password',
        'new-password': 'New password',
        'confirm-password': 'Confirm new password',
        'your-email': 'Your email',
        'detailed-description': 'Detailed description...',
        'support-info': 'Support: JPG, PNG, GIF. Max size 2MB',
        'select-issue': 'Select issue type',
        'bug-report': 'Bug Report',
        'feature-request': 'Feature Request',
        'support': 'Support',
        'other-issue': 'Other',
        'send': 'Send',
        'change-password-btn': 'Change Password',
        'delete-account': 'Delete Account',
        'cannot-undo': 'This action cannot be undone',
        'choose-file': 'Choose File',
        'no-file-selected': 'No file selected'
    }
};

setTimeout(function() {
    console.log('Language system loaded');
    
    const languageSelect = document.getElementById('language');
    const currentUser = localStorage.getItem('currentUser') || localStorage.getItem('loggedIn');
    
    // Load saved language
    const savedLang = localStorage.getItem('language_' + currentUser) || 'vi';
    if (languageSelect) {
        languageSelect.value = savedLang;
    }
    
    // Apply language on page load
    applyLanguage(savedLang);
    
    // Language change handler
    if (languageSelect) {
        languageSelect.onchange = function() {
            const selectedLang = this.value;
            console.log('Language changed to:', selectedLang);
            
            localStorage.setItem('language_' + currentUser, selectedLang);
            applyLanguage(selectedLang);
        };
    }
}, 100);

function applyLanguage(lang) {
    console.log('Applying language:', lang);
    
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
}