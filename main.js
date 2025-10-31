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

// Show/Hide form
addBtn.addEventListener("click", () => {
  addSection.classList.toggle("hidden");
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

// Add new transaction
addTransactionBtn.addEventListener("click", () => {
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value;

  if (!desc || isNaN(amount) || amount <= 0 || !date) {
    alert("Please fill all fields correctly.");
    return;
  }

  // Update totals
  if (isIncome) {
    totalIncome += amount;
  } else {
    totalExpense += amount;
  }

  const net = totalIncome - totalExpense;

  // Update UI totals
  incomeEl.textContent = totalIncome.toFixed(2);
  expenseEl.textContent = totalExpense.toFixed(2);
  netEl.textContent = net.toFixed(2);

  // Add transaction to history
  const item = document.createElement("div");
  item.className =
    "flex justify-between items-center border border-gray-300 rounded-[10px] p-2 shadow-sm";
  item.innerHTML = `
      <span class="font-semibold text-gray-700">${desc}</span>
      <span class="${isIncome ? "text-green-600" : "text-red-600"} font-bold">
          ${isIncome ? "+" : "-"}$${amount.toFixed(2)}
      </span>
      <span class="text-gray-500 text-sm">${date}</span>
  `;
  historyList.prepend(item); // newest first

  // Clear inputs
  descInput.value = "";
  amountInput.value = "";
  dateInput.value = "";

  // Hide form
  addSection.classList.add("hidden");
});
