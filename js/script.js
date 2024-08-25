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
                    </div>`
        totalAmount.innerText = income;
        netAmount = income - exAmt;
        balance.innerText = netAmount;
        netBalance.innerText = `Net Balance : ${netAmount}`;

    }                  
})


// Function to Modify List Elements
const modifyElement = (element, edit = false) => {
    let parentDiv = element.parentElement;
    let currentBlance = balance.innerText;
    let currentExpense = totalexpAmount.innerText;
    let parentAmount = parentDiv.querySelector(".amount").innerText;
    if(edit)
    {
        let parentText = parentDiv.querySelector(".category").innerText;
        expCategory.value = parentText;
        expAmount.value = parentAmount;
    }
    balance.innerText = parseInt(currentBlance) + parseInt(parentAmount);
    totalexpAmount.innerText = parseInt(currentExpense) - parseInt(parentAmount);
    parentDiv.remove();
}


// Manage Expense
const list = document.getElementById("manage")

// Function to create list
const ExpensesList = (expenseName, expenseValue) => {
    // create list structure
    let listContent = document.createElement("div");
    listContent.classList.add("listContent");
    list.appendChild(listContent);
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
    list.appendChild(listContent);

    deleteButton.addEventListener("click", () => {
        localStorage.removeItem("Total Income", income)
        localStorage.removeItem("Total expenses", totalexpAmount.innerText)
        localStorage.removeItem("Catagory", expCategory.value)
        localStorage.removeItem("Net Balance", netAmount)
    })
}


// Function to add expense
addexp.addEventListener("click", () => {
    // Expense Amount
    exAmt = parseInt(expAmount.value);
    
    if (isNaN(exAmt) || exAmt < 0 || exAmt === "" || !expCategory.value) {
        exError.textContent = "Please enter the positive value and category"
        exError.classList.add("error")
    } 
    else
    {
        // Total expense + new expense
    let sum = parseInt(totalexpAmount.innerText) + exAmt;
    totalexpAmount.innerText = sum;

    netAmount = income - totalexpAmount.innerText;
    balance.innerText = netAmount;

    netBalance.innerText = `Net Balance : ${netAmount}`;


    // save in Local Storage
    localStorage.setItem("Total Income", income)
    localStorage.setItem("Total expenses", totalexpAmount.innerText)
    localStorage.setItem("Catagory", expCategory.value)
    localStorage.setItem("Net Balance", netAmount) 

    // create list
    ExpensesList(expCategory.value, exAmt);

    // Empty input 
    expCategory.value = ""
    expAmount.value = ""
    }
    
})





