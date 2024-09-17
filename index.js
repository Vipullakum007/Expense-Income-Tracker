let total_income;
let total_expense;
const checkStatus = document.getElementById("checkstatus");
// Function to save the data to localStorage
function saveDataToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expensesData));
    localStorage.setItem('incomes', JSON.stringify(incomesData));
}

// Function to load the data from localStorage
function loadDataFromLocalStorage() {
    const expenses = localStorage.getItem('expenses');
    const incomes = localStorage.getItem('incomes');

    expensesData = expenses ? JSON.parse(expenses) : [];
    incomesData = incomes ? JSON.parse(incomes) : [];
}

// Function to update the total expense and income
function updateTotals() {
    const totalExpense = expensesData.reduce((total, expense) => total + parseFloat(expense.price), 0);
    const totalIncome = incomesData.reduce((total, income) => total + parseFloat(income.amount), 0);
    total_income = totalIncome;
    total_expense = totalExpense;
    document.getElementById('totalexpense').textContent = `Total Spent: ₹${totalExpense.toFixed(2)}`;
    document.getElementById('totalincome').textContent = `Total Earned: ₹${totalIncome.toFixed(2)}`;

    calculateProfitLoss();
}

// Function to update the expense and income tables
function updateTables() {
    const expenseTable = document.querySelector('.expensedata');
    const incomeTable = document.querySelector('.incomedata');

    // Clear existing rows
    expenseTable.innerHTML = '';
    incomeTable.innerHTML = '';

    // Populate expense table
    expensesData.forEach((expense, index) => {
        const row = expenseTable.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>Expense</td>
            <td>${expense.detail}</td>
            <td>${expense.price}</td>
            <td>${expense.date}</td>
            <td><button class="deletebtn" onclick="updateTotals()">Delete</button></td>
        `;
    });

    // Populate income table
    incomesData.forEach((income, index) => {
        const row = incomeTable.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>Income</td>
            <td>${income.source}</td>
            <td>${income.amount}</td>
            <td>${income.date}</td>
            <td><button class="deletebtn" onclick="updateTotals()">Delete</button></td>
        `;
    });

    updateTotals();
}

// Event listener for expense form submission
document.getElementById('form1').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log("add expense");
    const date = document.getElementById("doe").value;
    const detail = (document.getElementById('name')).value;
    const price = document.getElementById("price").value;
    console.log(date);
    console.log(detail);
    console.log(price);
    if (!date  || !detail || isNaN(price)) {
        alert('Please fill in all fields correctly.');
        return;
    }
    if (price < 0) {
        alert('Please add sensible Price.');
        return;
    }
    const cd1 = new Date();
    let expdate = new Date(date);
    if (expdate > cd1) {
        alert('Future Date is not possible.');
        return;
    }
    if (date && detail && price) {
        expensesData.push({ date, detail, price });
        saveDataToLocalStorage();
        updateTables();
        event.target.reset();
    }
    calculateProfitLoss();
});

// Event listener for income form submission
document.getElementById('form2').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const date = event.target.doi.value;
    const source = event.target.source.value;
    const amount = event.target.amount.value;
    
    if (!date  || !source || isNaN(amount)) {
        alert('Please fill in all fields correctly.');
        return;
    }
    if (amount < 0) {
        alert('Please add sensible Price.');
        return;
    }
    const cd2 = new Date();
    let incdate = new Date(date);
    if (incdate > cd2) {
        alert('Future Date is not possible.');
        return;
    }
    
    if (date && source && amount) {
        incomesData.push({ date, source, amount });
        saveDataToLocalStorage();
        updateTables();
        event.target.reset();
    }
    calculateProfitLoss();
});

// Event delegation for deleting entries
document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('deletebtn')) {
        const row = event.target.closest('tr');
        const type = row.cells[1].textContent;
        const index = row.cells[0].textContent - 1;

        if (type === 'Expense') {
            expensesData.splice(index, 1);
        } else if (type === 'Income') {
            incomesData.splice(index, 1);
        }

        saveDataToLocalStorage();
        updateTables();
    }
});

// Initialize data and tables
let expensesData = [];
let incomesData = [];
loadDataFromLocalStorage();
updateTables();


// check profit or loss
function calculateProfitLoss() {
    let p = total_income - total_expense;
    if (p > 0) {
        // profit
        checkStatus.innerHTML = `Profit : ${p} &#128526 `;
    }
    else if (p < 0) {
        // Loss
        checkStatus.innerHTML = `Loss : ${p} &#128530`;
    }
    else {
        // Neutral
        checkStatus.innerHTML = "Nuetral &#128512";
    }
    console.log(total_income - total_expense);
}

