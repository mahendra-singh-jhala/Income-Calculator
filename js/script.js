// income script
const income1 = document.getElementById("salary")
const income2 = document.getElementById("business")
const income3 = document.getElementById("Other-income")
const btn = document.getElementById("submit")
const error = document.getElementById("Error")
const incomeContent = document.getElementById("income-content")
const netBalance = document.getElementById("netblance")

// Dsahbord script
const totalAmount = document.getElementById("Tamount");
const totalexpAmount = document.getElementById("Texpense");
const balance = document.getElementById("balance");

//  Add expensse
const expCategory = document.getElementById("expenseCategory");
const expAmount = document.getElementById("expenseamount");
const addexp = document.getElementById("add");
const listexp = document.getElementById("manage");
const exError = document.getElementById("exError")

let exAmt = 0;
let income = 0;
let netAmount = 0;

// Load data from localStorage when the page loads
window.onload = () => {
    loadIncome();
    loadExpenses();
    updateDashboard();
};

// Function to save income to localstroage
const saveIncome = () => {
    const data = {
        income: income,
        netAmount: netAmount
    }
    localStorage.setItem("incomeData", JSON.stringify(data));
}

// Function to save expences to localstroage
const saveExpenses = (expenses) => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Function to update the dashboard
const updateDashboard = () => {
    netAmount = income - parseInt(totalexpAmount.innerText, 10);
    balance.innerText = netAmount;
    netBalance.innerText = `Net Balance : ${netAmount}`;

    // Save the updated netAmount to localStorage
    saveIncome();
}


// Function to load income from localstorage
const loadIncome = () => {
    const storedData = localStorage.getItem("incomeData");
    if (storedData) {
        const data = JSON.parse(storedData);
        income = data.income;
        netAmount = data.netAmount;
        totalAmount.innerText = income;
        balance.innerText = netAmount;
        netBalance.innerText = `Net Balance: ${netAmount}`;
        
    }
}

// Function to load expenses from localstorage
const loadExpenses = () => {
    const stroedExpenses = localStorage.getItem("expenses");
    if (stroedExpenses) {
        const expenses = JSON.parse(stroedExpenses);
        expenses.forEach(expense => {
            ExpensesList(expense.category, expense.amount);
            totalexpAmount.innerText = parseInt(totalexpAmount.innerText, 10) + parseInt(expense.amount, 10);
        });

        // After loading expenses, recalculate the net amount
        updateDashboard();
    }
}

btn.addEventListener("click", () => {
    income = parseInt(income1.value, 10) + parseInt(income2.value, 10) + parseInt(income3.value, 10);

    if (isNaN(income) || income < 0 || income === "") {
        error.textContent = "Please enter the positive value."
        error.classList.add("error")
    }
    else {
        incomeContent.innerHTML = `<div>
                        <label for="Other-income">Total Income : </label>
                        <input type="number" name="total-income" id="total-income" value="${income}" readonly>
                        <button class="reset" onclick = "location.reload()">Reset</button>
                        <button class="delete-income" onclick="deleteIncome()">Delete</button>
                    </div>`
        totalAmount.innerText = income;
        saveIncome();
        updateDashboard();
    }
})

// Function to delete income
const deleteIncome = () => {
    // Clear income and netAmount
    income = 0;
    netAmount = 0;
    totalAmount.innerText = income;
    balance.innerText = netAmount;
    netBalance.innerText = `Net Balance: ${netAmount}`;
    
    // Remove income and netAmount from localStorage
    localStorage.removeItem("incomeData");
    
    // Update dashboard
    updateDashboard();
};


// Function to Modify List Elements
const modifyElement = (element, edit = false) => {
    let parentDiv = element.parentElement;
    let currentBlance = parseInt(balance.innerText, 10);
    let currentExpense = parseInt(totalexpAmount.innerText, 10);
    let parentAmount = parseInt(parentDiv.querySelector(".amount").innerText, 10);
    if (edit) {
        let parentText = parentDiv.querySelector(".category").innerText;
        expCategory.value = parentText;
        expAmount.value = parentAmount;
    }
    balance.innerText = parseInt(currentBlance) + parseInt(parentAmount);
    totalexpAmount.innerText = parseInt(currentExpense) - parseInt(parentAmount);
    parentDiv.remove();

    // update localstroage
    saveExpenses(getCurrentExpenses());
    updateDashboard();
}


// Manage Expense
const list = document.getElementById("manage")

// Function to create list
const ExpensesList = (expenseName, expenseValue) => {
    // create list structure
    let listContent = document.createElement("div");
    listContent.classList.add("listContent");
    listContent.innerHTML = `<p class="category">${expenseName}</p> 
    <p class="amount">${expenseValue}</p>`;

    // Create Edit Button
    let editButton = document.createElement("button");
    editButton.innerText = "Edit"
    editButton.classList.add("edit");
    editButton.addEventListener("click", () => {
        modifyElement(editButton, true);
    });

    // Create Delelte Button
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("delete");
    deleteButton.addEventListener("click", () => {
        modifyElement(deleteButton);
    });

    listContent.appendChild(editButton);
    listContent.appendChild(deleteButton);

    //Append list content to the list
    list.appendChild(listContent);

}

// Function to get current expenses from the list
const getCurrentExpenses = () => {
    let expenses = [];
    document.querySelectorAll(".listContent").forEach(item => {
        let category = item.querySelector(".category").innerText;
        let amount = item.querySelector(".amount").innerText;
        expenses.push({category, amount})
    });
    return expenses;
}


// Function to add expense
addexp.addEventListener("click", () => {
    // Expense Amount
    exAmt = parseInt(expAmount.value, 10);

    if (isNaN(exAmt) || exAmt < 0 || exAmt === "" || !expCategory.value) {
        exError.textContent = "Please enter the positive value and category"
        exError.classList.add("error")
    }
    else {
        // Total expense + new expense
        let sum = parseInt(totalexpAmount.innerText) + exAmt;
        totalexpAmount.innerText = sum;

        // update dashborad and localstroage
        updateDashboard();
        ExpensesList(expCategory.value, exAmt);
        saveExpenses(getCurrentExpenses());

        // Empty input 
        expCategory.value = ""
        expAmount.value = ""
    }

})





