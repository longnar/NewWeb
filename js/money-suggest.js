// Money suggestion system
document.addEventListener('DOMContentLoaded', function() {
    console.log('Money suggest loaded');
    
    const moneyInputs = [
        'income-amount',
        'amount', 
        'fund-target',
        'fund-amount'
    ];
    
    moneyInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            setupMoneySuggest(input);
        }
    });
    
    function setupMoneySuggest(input) {
        let suggestionDiv = null;
        
        input.addEventListener('input', function() {
            const value = this.value.replace(/[^0-9]/g, '');
            
            // Remove existing suggestions
            if (suggestionDiv) {
                suggestionDiv.remove();
                suggestionDiv = null;
            }
            
            // Suggest for 1-3 digits
            if (value.length >= 1 && value.length <= 3 && value !== '0') {
                const baseNum = parseInt(value);
                const suggestions = [];
                
                // Add thousands
                if (baseNum * 1000 <= 999000) {
                    suggestions.push(baseNum * 1000);
                }
                
                // Add ten thousands  
                if (baseNum * 10000 <= 9990000) {
                    suggestions.push(baseNum * 10000);
                }
                
                // Add hundred thousands
                if (baseNum * 100000 <= 99900000) {
                    suggestions.push(baseNum * 100000);
                }
                
                // Add millions (max 999 million)
                if (baseNum * 1000000 <= 999000000) {
                    suggestions.push(baseNum * 1000000);
                }
                
                if (suggestions.length > 0) {
                    showSuggestions(input, suggestions);
                }
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!input.contains(e.target) && suggestionDiv && !suggestionDiv.contains(e.target)) {
                suggestionDiv.remove();
                suggestionDiv = null;
            }
        });
        
        function showSuggestions(inputElement, amounts) {
            suggestionDiv = document.createElement('div');
            suggestionDiv.className = 'money-suggestions';
            suggestionDiv.style.cssText = `
                position: absolute;
                background: white;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                z-index: 1000;
                max-width: 200px;
            `;
            
            amounts.forEach(amount => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = amount.toLocaleString('vi-VN') + ' VND';
                div.style.cssText = `
                    padding: 8px 12px;
                    cursor: pointer;
                    border-bottom: 1px solid #eee;
                    font-size: 14px;
                `;
                
                div.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = '#f0f0f0';
                });
                
                div.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = 'white';
                });
                
                div.addEventListener('click', function() {
                    inputElement.value = amount.toLocaleString('vi-VN');
                    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                    suggestionDiv.remove();
                    suggestionDiv = null;
                });
                
                suggestionDiv.appendChild(div);
            });
            
            // Position suggestions below input
            const rect = inputElement.getBoundingClientRect();
            suggestionDiv.style.left = rect.left + 'px';
            suggestionDiv.style.top = (rect.bottom + window.scrollY) + 'px';
            
            document.body.appendChild(suggestionDiv);
        }
    }
});