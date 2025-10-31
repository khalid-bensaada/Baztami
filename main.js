// Select elements
const addBtn = document.getElementById("newTransaction");
const addSection = document.getElementById("add");
const addTransactionBtn = document.getElementById("adding");
const incomeBtn = document.getElementById("inc");
const expenseBtn = document.getElementById("exp");

const netEl = document.getElementById("net");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("depenses");

const descInput = document.getElementById("text-T");
const amountInput = document.getElementById("amount-T");
const dateInput = document.getElementById("date-T");

const historyList = document.getElementById("historyList");

let isIncome = true;
let totalIncome = 0;
let totalExpense = 0;

let transactions = [];
let editIndex = null;

// ✅ Load from localStorage when page loads
window.addEventListener("DOMContentLoaded", loadTransactions);

// Show/Hide form
addBtn.addEventListener("click", () => {
  addSection.classList.toggle("hidden");
  resetForm();
});

// Type of transaction
incomeBtn.addEventListener("click", () => {
  isIncome = true;
  incomeBtn.classList.add("bg-green-300");
  expenseBtn.classList.remove("bg-red-300");
});

expenseBtn.addEventListener("click", () => {
  isIncome = false;
  expenseBtn.classList.add("bg-red-300");
  incomeBtn.classList.remove("bg-green-300");
});

// Add or Update transaction
addTransactionBtn.addEventListener("click", () => {
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value || new Date().toLocaleDateString();

  if (!desc || isNaN(amount) || amount <= 0) {
    alert("Please fill all fields correctly.");
    return;
  }

  const transaction = { desc, amount, date, isIncome };

  if (editIndex !== null) {
    const old = transactions[editIndex];
    if (old.isIncome) totalIncome -= old.amount;
    else totalExpense -= old.amount;

    transactions[editIndex] = transaction;
    editIndex = null;
  } else {
    transactions.push(transaction);
  }

  calculateTotals();
  renderHistory();
  saveTransactions(); // ✅ Save changes

  resetForm();
  addSection.classList.add("hidden");
});

// Calculate totals
function calculateTotals() {
  totalIncome = 0;
  totalExpense = 0;
  transactions.forEach((t) => {
    if (t.isIncome) totalIncome += t.amount;
    else totalExpense += t.amount;
  });

  const net = totalIncome - totalExpense;
  incomeEl.textContent = totalIncome.toFixed(2);
  expenseEl.textContent = totalExpense.toFixed(2);
  netEl.textContent = net.toFixed(2);
}

// Render list
function renderHistory() {
  historyList.innerHTML = "";
  transactions
    .slice()
    .reverse()
    .forEach((t, i) => {
      const index = transactions.length - 1 - i;
      const item = document.createElement("div");
      item.className =
        "flex justify-between items-center border border-gray-300 rounded-[10px] p-2 shadow-sm bg-white";
      item.innerHTML = `
        <div class="flex flex-col">
          <span class="font-semibold text-gray-700">${t.desc}</span>
          <span class="text-gray-500 text-sm">${t.date}</span>
        </div>
        <span class="${t.isIncome ? "text-green-600" : "text-red-600"} font-bold">
          ${t.isIncome ? "+" : "-"}$${t.amount.toFixed(2)}
        </span>
        <div class="flex gap-2">
          <button class="text-blue-500 hover:text-blue-700 font-semibold" onclick="editTransaction(${index})">Edit</button>
          <button class="text-red-500 hover:text-red-700 font-semibold" onclick="deleteTransaction(${index})">Delete</button>
        </div>
      `;
      historyList.appendChild(item);
    });
}

// ✅ Save to localStorage
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ✅ Load from localStorage
function loadTransactions() {
  const data = localStorage.getItem("transactions");
  if (data) {
    transactions = JSON.parse(data);
    calculateTotals();
    renderHistory();
  }
}

// Delete
window.deleteTransaction = function (index) {
  transactions.splice(index, 1);
  calculateTotals();
  renderHistory();
  saveTransactions(); // ✅ Save after delete
};

// Edit
window.editTransaction = function (index) {
  const t = transactions[index];
  descInput.value = t.desc;
  amountInput.value = t.amount;
  dateInput.value = t.date;
  isIncome = t.isIncome;

  if (t.isIncome) {
    incomeBtn.classList.add("bg-green-300");
    expenseBtn.classList.remove("bg-red-300");
  } else {
    expenseBtn.classList.add("bg-red-300");
    incomeBtn.classList.remove("bg-green-300");
  }

  addSection.classList.remove("hidden");
  editIndex = index;
};

// Reset
function resetForm() {
  descInput.value = "";
  amountInput.value = "";
  dateInput.value = "";
  editIndex = null;
  incomeBtn.classList.remove("bg-green-300");
  expenseBtn.classList.remove("bg-red-300");
  isIncome = true;
}
