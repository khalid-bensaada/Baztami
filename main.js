
const btnShowForm = document.getElementById("newTransaction");
const formSection = document.getElementById("add");
const btnAddTransaction = document.getElementById("adding");

const btnIncome = document.getElementById("inc");
const btnExpense = document.getElementById("exp");

const netDisplay = document.getElementById("net");
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("depenses");

const inputDesc = document.getElementById("text-T");
const inputAmount = document.getElementById("amount-T");
const inputDate = document.getElementById("date-T");

const historyContainer = document.getElementById("historyList");




let transactions = [];       
let editIndex = null;       
let isIncome = true;        



btnShowForm.addEventListener("click", () => {
  formSection.classList.toggle("hidden");
  clearForm();
});




btnIncome.addEventListener("click", () => {
  isIncome = true;
  btnIncome.classList.add("bg-green-300");
  btnExpense.classList.remove("bg-red-300");
});

btnExpense.addEventListener("click", () => {
  isIncome = false;
  btnExpense.classList.add("bg-red-300");
  btnIncome.classList.remove("bg-green-300");
});


btnAddTransaction.addEventListener("click", () => {
  const desc = inputDesc.value.trim();
  const amount = parseFloat(inputAmount.value);
  const date = inputDate.value || new Date().toLocaleDateString();

  if (!desc || isNaN(amount) || amount <= 0) {
    alert("Please fill all fields correctly.");
    return;
  }

  const transaction = { desc, amount, date, isIncome };

  if (editIndex !== null) {
   
    transactions[editIndex] = transaction;
    editIndex = null;
  } else {
    
    transactions.push(transaction);
  }

  updateTotals();
  renderHistory();
  saveTransactions();
  clearForm();
  formSection.classList.add("hidden");
});




function updateTotals() {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(t => {
    if (t.isIncome) totalIncome += t.amount;
    else totalExpense += t.amount;
  });

  const net = totalIncome - totalExpense;

  incomeDisplay.textContent = totalIncome.toFixed(2);
  expenseDisplay.textContent = totalExpense.toFixed(2);
  netDisplay.textContent = net.toFixed(2);
}

function renderHistory() {
  historyContainer.innerHTML = "";

  transactions.slice().reverse().forEach((t, i) => {
    const index = transactions.length - 1 - i;

    const item = document.createElement("div");
    item.className = "flex justify-between items-center border p-2 bg-white rounded shadow-sm";

    item.innerHTML = `
      <div>
        <div>${t.desc}</div>
        <small>${t.date}</small>
      </div>
      <div class="${t.isIncome ? "text-green-600" : "text-red-600"}">
        ${t.isIncome ? "+" : "-"}$${t.amount.toFixed(2)}
      </div>
      <div>
        <button onclick="editTransaction(${index})">Edit</button>
        <button onclick="deleteTransaction(${index})">Delete</button>
      </div>
    `;

    historyContainer.appendChild(item);
  });
}

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions() {
  const data = localStorage.getItem("transactions");
  if (data) {
    transactions = JSON.parse(data);
    updateTotals();
    renderHistory();
  }
}

window.addEventListener("DOMContentLoaded", loadTransactions);



window.deleteTransaction = function(index) {
  transactions.splice(index, 1);
  updateTotals();
  renderHistory();
  saveTransactions();
};



window.editTransaction = function(index) {
  const t = transactions[index];

  inputDesc.value = t.desc;
  inputAmount.value = t.amount;
  inputDate.value = t.date;
  isIncome = t.isIncome;

  if (isIncome) {
    btnIncome.classList.add("bg-green-300");
    btnExpense.classList.remove("bg-red-300");
  } else {
    btnExpense.classList.add("bg-red-300");
    btnIncome.classList.remove("bg-green-300");
  }

  formSection.classList.remove("hidden");
  editIndex = index;
};



function clearForm() {
  inputDesc.value = "";
  inputAmount.value = "";
  inputDate.value = "";
  editIndex = null;
  isIncome = true;

  btnIncome.classList.remove("bg-green-300");
  btnExpense.classList.remove("bg-red-300");
}
