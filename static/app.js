// Budget Forecast Application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const form = document.getElementById('budget-form');
    const addSpendingBtn = document.getElementById('add-spending');
    const plannedSpendingsContainer = document.getElementById('planned-spendings-container');
    const resultsSection = document.getElementById('results-section');
    const clearSavedDataBtn = document.getElementById('clear-saved-data');
    
    let savingsChart = null;
    
    // Load saved data from cookies when page loads
    loadFormDataFromCookies();
    
    // Add planned spending entry
    addSpendingBtn.addEventListener('click', function() {
        addPlannedSpendingField();
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Save form data to cookies before generating forecast
        saveFormDataToCookies();
        generateForecast();
    });
    
    // Clear saved data
    clearSavedDataBtn.addEventListener('click', function() {
        clearSavedData();
    });
    
    // No initial planned spending field - it's now optional
    
    // Function to add a planned spending field
    function addPlannedSpendingField(savedData = null) {
        const spendingItem = document.createElement('div');
        spendingItem.className = 'planned-spending-item';
        
        // Get current date for default values
        const currentDate = new Date();
        const currentMonth = savedData ? savedData.month : currentDate.getMonth() + 1; // JavaScript months are 0-indexed
        const currentYear = savedData ? savedData.year : currentDate.getFullYear();
        const amount = savedData ? savedData.amount : '';
        const comment = savedData ? savedData.comment : '';
        
        spendingItem.innerHTML = `
            <div class="form-group month-field">
                <input type="number" class="spend-month" min="1" max="12" value="${currentMonth}" placeholder="Month" required>
            </div>
            <div class="form-group year-field">
                <input type="number" class="spend-year" min="${currentYear}" max="${currentYear + 50}" value="${currentYear}" placeholder="Year" required>
            </div>
            <div class="form-group amount-field">
                <input type="number" class="spend-amount" min="0" step="100" value="${amount}" placeholder="Amount (€)" required>
            </div>
            <div class="form-group comment-field">
                <input type="text" class="spend-comment" placeholder="Comment" value="${comment}">
            </div>
            <button type="button" class="remove-spending">×</button>
        `;
        
        // Add remove button functionality
        const removeBtn = spendingItem.querySelector('.remove-spending');
        removeBtn.addEventListener('click', function() {
            plannedSpendingsContainer.removeChild(spendingItem);
        });
        
        plannedSpendingsContainer.appendChild(spendingItem);
    }
    
    // Function to collect form data
    function collectFormData() {
        const savings = parseFloat(document.getElementById('savings').value);
        const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value);
        const monthlySpendings = parseFloat(document.getElementById('monthlySpendings').value);
        const targetSavings = parseFloat(document.getElementById('targetSavings').value);
        const minAcceptableSavings = parseFloat(document.getElementById('minAcceptableSavings').value);
        const yearsToForecast = parseInt(document.getElementById('yearsToForecast').value);
        
        // Collect planned spendings
        const plannedSpendings = [];
        const spendingItems = document.querySelectorAll('.planned-spending-item');
        
        spendingItems.forEach(item => {
            const month = parseInt(item.querySelector('.spend-month').value);
            const year = parseInt(item.querySelector('.spend-year').value);
            const amount = parseFloat(item.querySelector('.spend-amount').value);
            const comment = item.querySelector('.spend-comment').value;
            
            // Only add if amount is greater than 0
            if (amount > 0) {
                plannedSpendings.push({
                    month: month,
                    year: year,
                    amount: amount,
                    comment: comment
                });
            }
        });
        
        return {
            savings: savings,
            monthlyIncome: monthlyIncome,
            monthlySpendings: monthlySpendings,
            targetSavings: targetSavings,
            minAcceptableSavings: minAcceptableSavings,
            yearsToForecast: yearsToForecast,
            plannedSpendings: plannedSpendings
        };
    }
    
    // Function to save form data to cookies
    function saveFormDataToCookies() {
        const formData = collectFormData();
        
        // Set expiration date for cookies (1 year)
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        const cookieOptions = "; expires=" + expirationDate.toUTCString() + "; path=/";
        
        // Save main form fields
        document.cookie = "savings=" + formData.savings + cookieOptions;
        document.cookie = "monthlyIncome=" + formData.monthlyIncome + cookieOptions;
        document.cookie = "monthlySpendings=" + formData.monthlySpendings + cookieOptions;
        document.cookie = "targetSavings=" + formData.targetSavings + cookieOptions;
        document.cookie = "minAcceptableSavings=" + formData.minAcceptableSavings + cookieOptions;
        document.cookie = "yearsToForecast=" + formData.yearsToForecast + cookieOptions;
        
        // Save planned spendings as JSON string
        if (formData.plannedSpendings.length > 0) {
            document.cookie = "plannedSpendings=" + encodeURIComponent(JSON.stringify(formData.plannedSpendings)) + cookieOptions;
        } else {
            // Clear planned spendings cookie if no planned spendings
            document.cookie = "plannedSpendings=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    }
    
    // Function to get cookie value by name
    function getCookie(name) {
        const cookieName = name + "=";
        const cookies = document.cookie.split(';');
        
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        
        return null;
    }
    
    // Function to load form data from cookies
    function loadFormDataFromCookies() {
        // Load main form fields
        const savings = getCookie("savings");
        const monthlyIncome = getCookie("monthlyIncome");
        const monthlySpendings = getCookie("monthlySpendings");
        const targetSavings = getCookie("targetSavings");
        const minAcceptableSavings = getCookie("minAcceptableSavings");
        const yearsToForecast = getCookie("yearsToForecast");
        
        // Set form field values if cookies exist
        if (savings) document.getElementById('savings').value = savings;
        if (monthlyIncome) document.getElementById('monthlyIncome').value = monthlyIncome;
        if (monthlySpendings) document.getElementById('monthlySpendings').value = monthlySpendings;
        if (targetSavings) document.getElementById('targetSavings').value = targetSavings;
        if (minAcceptableSavings) document.getElementById('minAcceptableSavings').value = minAcceptableSavings;
        if (yearsToForecast) document.getElementById('yearsToForecast').value = yearsToForecast;
        
        // Load planned spendings
        const plannedSpendingsCookie = getCookie("plannedSpendings");
        if (plannedSpendingsCookie) {
            try {
                const plannedSpendings = JSON.parse(decodeURIComponent(plannedSpendingsCookie));
                
                // Add planned spending fields with saved data
                plannedSpendings.forEach(spending => {
                    addPlannedSpendingField(spending);
                });
            } catch (error) {
                console.error("Error parsing planned spendings from cookie:", error);
            }
        }
    }
    
    // Function to generate the forecast
    async function generateForecast() {
        const inputData = collectFormData();
        
        try {
            const response = await fetch('/forecast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputData)
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const result = await response.json();
            
            if (result.success) {
                displayResults(result, inputData);
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while generating the forecast. Please try again.');
        }
    }
    
    // Function to display the results
    function displayResults(result, inputData) {
        // Show results section
        resultsSection.style.display = 'block';
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Display chart
        displayChart(result.monthlyData, inputData);
        
        // Display table
        displayTable(result.monthlyData);
    }
    
    // Function to display the savings chart
    function displayChart(monthlyData, inputData) {
        const ctx = document.getElementById('savings-chart').getContext('2d');
        
        // Extract data for chart
        const labels = monthlyData.map(data => data.label);
        const savingsData = monthlyData.map(data => data.savings);
        
        // Create target and minimum savings line datasets
        const targetLine = Array(monthlyData.length).fill(inputData.targetSavings);
        const minLine = Array(monthlyData.length).fill(inputData.minAcceptableSavings);
        
        // Destroy previous chart if exists
        if (savingsChart) {
            savingsChart.destroy();
        }
        
        // Create new chart
        savingsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Savings',
                        data: savingsData,
                        borderColor: 'rgba(52, 152, 219, 1)',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Target Savings',
                        data: targetLine,
                        borderColor: 'rgba(46, 204, 113, 1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0
                    },
                    {
                        label: 'Minimum Acceptable Savings',
                        data: minLine,
                        borderColor: 'rgba(231, 76, 60, 1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Savings'
                        },
                        ticks: {
                            callback: function(value) {
                                return '€' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Month-Year'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += '€' + context.parsed.y.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    });
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Function to display the forecast table
    function displayTable(monthlyData) {
        const tableBody = document.getElementById('forecast-table-body');
        tableBody.innerHTML = '';
        
        monthlyData.forEach(data => {
            const row = document.createElement('tr');
            
            // Format month and year
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                                'July', 'August', 'September', 'October', 'November', 'December'];
            const monthName = monthNames[data.month - 1];
            
            // Format currency
            const formattedSavings = data.savings.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            
            const formattedSpending = data.spending > 0 ? 
                data.spending.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }) : '-';
            
            // Determine row class based on savings status
            let rowClass = '';
            let notes = '';
            
            if (data.label.includes('Target reached')) {
                rowClass = 'target-reached';
                notes += '🎯 Target reached! ';
            }
            
            if (data.label.includes('Below minimum')) {
                rowClass = 'minimum-breached';
                notes += '⚠️ Below minimum! ';
            }
            
            // Extract comment if present
            const commentMatch = data.label.match(/\((.*?)\)$/);
            if (commentMatch && !commentMatch[1].includes('Target') && !commentMatch[1].includes('Below')) {
                notes += commentMatch[1];
            }
            
            row.className = rowClass;
            row.innerHTML = `
                <td>${monthName} ${data.year}</td>
                <td>€${formattedSavings}</td>
                <td>${formattedSpending === '-' ? '-' : '€' + formattedSpending}</td>
                <td>${notes}</td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    // Function to clear saved data (cookies)
    function clearSavedData() {
        // List of all cookie names to clear
        const cookieNames = [
            "savings", 
            "monthlyIncome", 
            "monthlySpendings", 
            "targetSavings", 
            "minAcceptableSavings", 
            "yearsToForecast", 
            "plannedSpendings"
        ];
        
        // Clear each cookie
        cookieNames.forEach(name => {
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        });
        
        // Reset form
        form.reset();
        
        // Clear planned spendings container
        plannedSpendingsContainer.innerHTML = '';
        
        // Hide results section
        resultsSection.style.display = 'none';
        
        // Alert user
        alert('All saved data has been cleared.');
    }
});
