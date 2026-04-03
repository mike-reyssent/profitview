//==========================CHART FUNCTION===============================
const weeklyChartEl = document.getElementById("weeklyChart");
if (weeklyChartEl) {
  const weeklyCtx = weeklyChartEl.getContext("2d");
  const weeklyChart = new Chart(weeklyCtx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Sales",
          data: [120, 190, 80, 150, 200, 170, 220],
          borderColor: "#2196F3",
          tension: 0.4,
          fill: false,
          backgroundColor: "#ffffff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}
const monthlyCostEl = document.getElementById("monthlyCostChart");
if (monthlyCostEl) {
  const monthlyCostCtx = monthlyCostEl.getContext("2d");
  const monthlyCostChart = new Chart(monthlyCostCtx, {
    type: "pie",
    data: {
      labels: ["Purchasing", "Shipping", "Packaging", "Marketing", "Other"],
      datasets: [
        {
          label: "Costs",
          data: [2100, 880, 340, 1400, 400],
          backgroundColor: [
            "#4CAF50",
            "#2196F3",
            "#FF9800",
            "#E91E63",
            "#9C27B0",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}
window.addEventListener("resize", () => {
  weeklyChart.resize();
  monthlyCostChart.resize();
});
//==========================END OF CHART FUNCTION===============================

// initialize storage function
function initStorage() {
  if (!localStorage.getItem("assets")) {
    localStorage.setItem("assets", JSON.stringify([]));
  }
  if (!localStorage.getItem("stocks")) {
    localStorage.setItem("stocks", JSON.stringify([]));
  }
  if (!localStorage.getItem("expenses")) {
    localStorage.setItem("expenses", JSON.stringify([]));
  }
  if (!localStorage.getItem("sales")) {
    localStorage.setItem("sales", JSON.stringify([]));
  }
}
initStorage();

//==========================HELPER FUNCTION===============================
function getData(key) {
  return JSON.parse(localStorage.getItem(key));
}
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function generateId(prefix) {
  const unique = String(Date.now()).slice(-6);
  return prefix + "-" + unique;
}
function toggleMenu(id) {
  const menu = document.getElementById(id);
  menu.classList.toggle("open");
}
function clearAsset() {
  localStorage.removeItem("assets");
  console.log("asset has been cleared!");
}
//==========================END OF HELPER FUNCTION===============================

//==========================ASSETS FUNCTION===============================
document.addEventListener("DOMContentLoaded", function () {
  const bankInput = document.getElementById("bankInput");
  if (!bankInput) return;

  const assetForm = document.getElementById("assetForm");
  if (assetForm) {
    assetForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const id = generateId("AST");
      const time = new Date().toLocaleString("en-GB");
      const bank = document.getElementById("bankInput").value;
      const accountName = document.getElementById("accountNameInput").value;
      const initialBalance = document.getElementById(
        "initialBalanceInput",
      ).value;
      const description = document.getElementById(
        "assetDescriptionInput",
      ).value;

      const asset = {
        id: id,
        date: time,
        bank: bank,
        account_name: accountName,
        initial_balance: initialBalance,
        current_balance: initialBalance,
        description: description,
      };

      const assets = getData("assets");
      assets.push(asset);
      saveData("assets", assets);

      // Ganti bagian modal dengan ini
      const addAssetModalEl = document.getElementById("addAssetModal");
      const addAssetModalInstance =
        bootstrap.Modal.getInstance(addAssetModalEl);
      if (addAssetModalInstance) addAssetModalInstance.hide();

      addAssetModalEl.addEventListener(
        "hidden.bs.modal",
        function () {
          alert("Asset saved successfully!");
          document.getElementById("assetForm").reset();
          window.location.reload();
        },
        { once: true },
      );
    });
  }
});
function displayAssets() {
  const assets = getData("assets");
  const tableHead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const idHead = document.createElement("th");
  const bankHead = document.createElement("th");
  const accountNameHead = document.createElement("th");
  const balanceHead = document.createElement("th");
  idHead.textContent = "ID";
  bankHead.textContent = "BANK";
  accountNameHead.textContent = "ACCOUNT NAME";
  balanceHead.textContent = "CURRENT BALANCE";
  headerRow.appendChild(idHead);
  headerRow.appendChild(bankHead);
  headerRow.appendChild(accountNameHead);
  headerRow.appendChild(balanceHead);
  tableHead.appendChild(headerRow);
  const modalBody = document.getElementById("assetList");
  const wrapper = document.createElement("table");
  const tbody = document.createElement("tbody");

  tbody.appendChild(tableHead);
  wrapper.classList.add("table", "table-striped");
  assets.forEach((asset) => {
    const tr = document.createElement("tr");
    const id = document.createElement("td");
    const bank = document.createElement("td");
    const account_name = document.createElement("td");
    const current_balance = document.createElement("td");

    id.textContent = asset.id;
    bank.textContent = asset.bank;
    account_name.textContent = asset.account_name;
    current_balance.textContent = asset.current_balance;
    tr.appendChild(id);
    tr.appendChild(bank);
    tr.appendChild(account_name);
    tr.appendChild(current_balance);
    tbody.appendChild(tr);
  });
  wrapper.appendChild(tableHead);
  wrapper.appendChild(tbody);
  modalBody.appendChild(wrapper);
}
if (document.getElementById("assetList")) {
  displayAssets();
}
//==========================END OF ASSETS FUNCTION===============================

//==========================SALES FUNCTION===============================
function populateSalesForm() {
  const itemSelect = document.getElementById("itemSelect");
  const assetSelect = document.getElementById("assetSelect");
  if (!itemSelect || !assetSelect) {
    return;
  }
  const stock = getData("stocks");
  const assets = getData("assets");

  stock.forEach((item) => {
    if (item.qty > 0) {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.item_name} (Stock: ${item.qty})`;
      itemSelect.appendChild(option);
    }
  });

  assets.forEach((asset) => {
    const option = document.createElement("option");
    option.value = asset.id;
    option.textContent = `(${asset.bank}) ${asset.account_name} - $${asset.current_balance}`;
    assetSelect.appendChild(option);
  });
}
function calculateSalesTotal() {
  const qty = document.getElementById("qtyInput").value;
  const sellPrice = document.getElementById("sellPriceInput").value;
  const admFee = document.getElementById("adminFeeInput").value;
  const total = document.getElementById("totalInput");
  const qtyValue = Math.max(1, parseInt(qty) || 1);
  const totalValue = qtyValue * sellPrice - admFee;
  total.value = totalValue;
}
function displaySalesHistory() {
  const sales = getData("sales");
  const tableHead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const timeHead = document.createElement("th");
  const itemHead = document.createElement("th");
  const assetHead = document.createElement("th");
  const buyerHead = document.createElement("th");
  const qtyHead = document.createElement("th");
  const sellPriceHead = document.createElement("th");
  const admFeeHead = document.createElement("th");
  const totalHead = document.createElement("th");
  const descriptionHead = document.createElement("th");
  timeHead.textContent = "TIME";
  itemHead.textContent = "ITEM";
  assetHead.textContent = "ASSET";
  buyerHead.textContent = "CUSTOMER NAME";
  qtyHead.textContent = "QUANTITY";
  sellPriceHead.textContent = "PRICE PER UNIT";
  admFeeHead.textContent = "ADM FEE";
  totalHead.textContent = "TOTAL PRICE";
  descriptionHead.textContent = "DESCRIPTION";
  headerRow.appendChild(timeHead);
  headerRow.appendChild(itemHead);
  headerRow.appendChild(assetHead);
  headerRow.appendChild(buyerHead);
  headerRow.appendChild(qtyHead);
  headerRow.appendChild(sellPriceHead);
  headerRow.appendChild(admFeeHead);
  headerRow.appendChild(totalHead);
  headerRow.appendChild(descriptionHead);
  tableHead.appendChild(headerRow);
  const modalBody = document.getElementById("salesHistory");
  const wrapper = document.createElement("table");
  const tbody = document.createElement("tbody");

  tbody.appendChild(tableHead);
  wrapper.classList.add("table", "table-striped");
  sales.forEach((sale) => {
    const tr = document.createElement("tr");
    const time = document.createElement("td");
    const item = document.createElement("td");
    const asset = document.createElement("td");
    const buyer = document.createElement("td");
    const qty = document.createElement("td");
    const sellPrice = document.createElement("td");
    const admFee = document.createElement("td");
    const total = document.createElement("td");
    const description = document.createElement("td");
    const timeValue = sale.date.slice(length - 8);
    time.classList.add("text-start");
    qty.classList.add("text-end");
    sellPrice.classList.add("text-end");
    admFee.classList.add("text-end");
    total.classList.add("text-end");
    time.textContent = timeValue;
    item.textContent = sale.item_name;
    asset.textContent = sale.bank_name;
    buyer.textContent = sale.buyer_name;
    qty.textContent = sale.qty;
    sellPrice.textContent = sale.sell_price;
    admFee.textContent = sale.admin_fee;
    total.textContent = sale.total;
    description.textContent = sale.description;
    tr.appendChild(time);
    tr.appendChild(item);
    tr.appendChild(asset);
    tr.appendChild(buyer);
    tr.appendChild(qty);
    tr.appendChild(sellPrice);
    tr.appendChild(admFee);
    tr.appendChild(total);
    tr.appendChild(description);
    tbody.appendChild(tr);
  });
  timeHead.classList.add("text-start");
  qtyHead.classList.add("text-end");
  sellPriceHead.classList.add("text-end");
  admFeeHead.classList.add("text-end");
  totalHead.classList.add("text-end");
  wrapper.appendChild(tableHead);
  wrapper.appendChild(tbody);
  modalBody.appendChild(wrapper);
}

document.addEventListener("DOMContentLoaded", function () {
  populateSalesForm();
  const qty = document.getElementById("qtyInput");
  if (!qty) return;
  const sellPrice = document.getElementById("sellPriceInput");
  const admFee = document.getElementById("adminFeeInput");
  const total = document.getElementById("totalInput");
  const buyerName = document.getElementById("buyerNameInput");
  const description = document.getElementById("descriptionInput");
  sellPrice.addEventListener("input", function () {
    calculateSalesTotal();
  });
  qty.addEventListener("input", function () {
    calculateSalesTotal();
  });
  admFee.addEventListener("input", function () {
    calculateSalesTotal();
  });
  function handleSalesSubmit() {
    const salesForm = document.getElementById("salesForm");
    if (salesForm) {
      salesForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const id = generateId("SLS");
        const time = new Date().toLocaleString("en-GB");
        document.getElementById("idInput").value = id;
        document.getElementById("dateTimeInput").value = time;
        const itemId = document.getElementById("itemSelect").value;
        const assetId = document.getElementById("assetSelect").value;
        const items = getData("stocks");
        const assets = getData("assets");

        const selectedItem = items.find((item) => item.id === itemId);
        const selectedAsset = assets.find((asset) => asset.id === assetId);

        const transaction = {
          id: id,
          date: time,
          item_id: itemId,
          item_name: selectedItem ? selectedItem.item_name : "",
          bank_name: selectedAsset
            ? `(${selectedAsset.bank}) ${selectedAsset.account_name}`
            : "",

          qty: qty.value,
          sell_price: sellPrice.value,
          admin_fee: admFee.value,
          total: total.value,
          buyer_name: buyerName.value,
          asset_id: assetId,
          description: description.value,
        };
        const sales = getData("sales");
        sales.push(transaction);
        saveData("sales", sales);
        const modal = new bootstrap.Modal(
          document.getElementById("successModal"),
        );
        modal.show();

        // Reset form setelah OK diklik
        document
          .getElementById("successModal")
          .addEventListener("hidden.bs.modal", function () {
            document.getElementById("salesForm").reset();
            document.getElementById("idInput").value = "";
            document.getElementById("dateTimeInput").value = "";
          });
      });
    }
  }
  handleSalesSubmit();
});
if (document.getElementById("salesHistory")) {
  displaySalesHistory();
}
//==========================END OF SALES FUNCTION===============================

//==========================STOCK FUNCTION===============================
function populateStockForm() {
  const assetSelect = document.getElementById("assetSelect");
  const itemNameInput = document.getElementById("itemNameInput");
  if (!assetSelect || !itemNameInput) {
    return;
  }

  const assets = getData("assets");
  assets.forEach((asset) => {
    const option = document.createElement("option");
    option.value = asset.id;
    option.textContent = `(${asset.bank}) ${asset.account_name} - $${asset.current_balance}`;
    assetSelect.appendChild(option);
  });
}
function calculateStockTotal() {
  const qty = document.getElementById("qtyInput").value;
  const buyPrice = document.getElementById("buyPriceInput").value;
  const admFee = document.getElementById("admFeeInput").value;
  const total = document.getElementById("totalInput");
  const qtyValue = Math.max(1, parseInt(qty) || 1);
  const totalValue = qtyValue * buyPrice - admFee;
  total.value = totalValue;
}
function displayStockHistory() {
  const stock = getData("stocks");
  console.log(stock);
  const tableHead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const timeHead = document.createElement("th");
  const itemHead = document.createElement("th");
  const assetHead = document.createElement("th");
  const qtyHead = document.createElement("th");
  const buyPriceHead = document.createElement("th");
  const admFeeHead = document.createElement("th");
  const totalHead = document.createElement("th");
  const descriptionHead = document.createElement("th");

  timeHead.textContent = "TIME";
  itemHead.textContent = "ITEM NAME";
  assetHead.textContent = "ASSET";
  qtyHead.textContent = "QUANTITY";
  buyPriceHead.textContent = "BUY PRICE";
  admFeeHead.textContent = "ADM FEE";
  totalHead.textContent = "TOTAL PRICE";
  descriptionHead.textContent = "DESCRIPTION";

  headerRow.appendChild(timeHead);
  headerRow.appendChild(itemHead);
  headerRow.appendChild(assetHead);
  headerRow.appendChild(qtyHead);
  headerRow.appendChild(buyPriceHead);
  headerRow.appendChild(admFeeHead);
  headerRow.appendChild(totalHead);
  headerRow.appendChild(descriptionHead);
  tableHead.appendChild(headerRow);
  const modalBody = document.getElementById("stockHistory");
  const wrapper = document.createElement("table");
  const tbody = document.createElement("tbody");

  tbody.appendChild(tableHead);
  wrapper.classList.add("table", "table-striped");
  stock.forEach((stk) => {
    const tr = document.createElement("tr");
    const time = document.createElement("td");
    const item = document.createElement("td");
    const asset = document.createElement("td");
    const qty = document.createElement("td");
    const buyPrice = document.createElement("td");
    const admFee = document.createElement("td");
    const total = document.createElement("td");
    const description = document.createElement("td");

    const timeValue = stk.date?.slice(-8) || "";
    time.classList.add("text-start");
    qty.classList.add("text-end");
    buyPrice.classList.add("text-end");
    admFee.classList.add("text-end");
    total.classList.add("text-end");

    time.textContent = timeValue;
    item.textContent = stk.item_name;
    asset.textContent = stk.asset_name;
    qty.textContent = stk.qty;
    buyPrice.textContent = stk.buy_price;
    admFee.textContent = stk.admin_fee;
    total.textContent = stk.total;
    description.textContent = stk.description;
    tr.appendChild(time);
    tr.appendChild(item);
    tr.appendChild(asset);
    tr.appendChild(qty);
    tr.appendChild(buyPrice);
    tr.appendChild(admFee);
    tr.appendChild(total);
    tr.appendChild(description);
    tbody.appendChild(tr);
  });
  timeHead.classList.add("text-start");
  qtyHead.classList.add("text-end");
  buyPriceHead.classList.add("text-end");
  admFeeHead.classList.add("text-end");
  totalHead.classList.add("text-end");
  wrapper.appendChild(tableHead);
  wrapper.appendChild(tbody);
  modalBody.appendChild(wrapper);
}
function displayStockList() {
  const stock = getData("stocks");
  console.log(stock);

  //HEADING
  const tableHead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const itemNameHead = document.createElement("th");
  const qtyHead = document.createElement("th");
  const buyPriceHead = document.createElement("th");
  const totalHead = document.createElement("th");
    itemNameHead.classList.add("text-center");
    qtyHead.classList.add("text-end");
    buyPriceHead.classList.add("text-end");
    totalHead.classList.add("text-end");

  itemNameHead.textContent = "ITEM NAME";
  qtyHead.textContent = "QUANTITY";
  buyPriceHead.textContent = "BUY PRICE";
  totalHead.textContent = "TOTAL";

  headerRow.appendChild(itemNameHead);
  headerRow.appendChild(qtyHead);
  headerRow.appendChild(buyPriceHead);
  headerRow.appendChild(totalHead);
  tableHead.appendChild(headerRow);

  //BODY

  const tbody = document.createElement("tbody");
  stock.forEach((stk) => {
    const tr = document.createElement("tr");
    const itemName = document.createElement("td");
    const quantity = document.createElement("td");
    const buyPrice = document.createElement("td");
    const total = document.createElement("td");
    itemName.classList.add("text-center");
    quantity.classList.add("text-end");
    buyPrice.classList.add("text-end");
    total.classList.add("text-end");

    itemName.textContent = stk.item_name;
    quantity.textContent = stk.qty;
    buyPrice.textContent = stk.buy_price;
    total.textContent = stk.total;

    tr.appendChild(itemName);
    tr.appendChild(quantity);
    tr.appendChild(buyPrice);
    tr.appendChild(total);
    tbody.appendChild(tr);
  });
  //END OF BODY

  const modalBody = document.getElementById("stockList");
  const wrapper = document.createElement("table");

  wrapper.appendChild(tableHead);

  wrapper.appendChild(tbody);
  wrapper.classList.add("table", "table-striped");
  modalBody.appendChild(wrapper);
}
document.addEventListener("DOMContentLoaded", function () {
  populateStockForm();
  const itemName = document.getElementById("itemNameInput");
  if (!itemName) {
    return;
  }
  const qty = document.getElementById("qtyInput");
  const buyPrice = document.getElementById("buyPriceInput");
  const admFee = document.getElementById("admFeeInput");
  const total = document.getElementById("totalInput");
  const description = document.getElementById("descriptionInput");
  qty.addEventListener("input", function () {
    calculateStockTotal();
  });
  buyPrice.addEventListener("input", function () {
    calculateStockTotal();
  });
  admFee.addEventListener("input", function () {
    calculateStockTotal();
  });
  function handleStockSubmit() {
    const stockForm = document.getElementById("stockForm");
    if (stockForm) {
      stockForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const id = generateId("STK");
        const time = new Date().toLocaleString("en-GB");
        document.getElementById("idInput").value = id;
        document.getElementById("dateTimeInput").value = time;
        const itemName = document.getElementById("itemNameInput").value;
        const assetId = document.getElementById("assetSelect").value;

        const assets = getData("assets");
        const selectedAsset = assets.find((a) => a.id === assetId);
        const transaction = {
          id: id,
          date: time,
          item_name: itemName,
          qty: qty.value,
          buy_price: buyPrice.value,
          admin_fee: admFee.value,
          total: total.value,
          asset_id: assetId,
          asset_name: selectedAsset
            ? `(${selectedAsset.bank}) ${selectedAsset.account_name}`
            : "",
          description: description.value,
        };
        const stock = getData("stocks");
        stock.push(transaction);
        saveData("stocks", stock);
        const modal = new bootstrap.Modal(
          document.getElementById("successModal"),
        );
        modal.show();

        // Reset form setelah OK diklik
        document
          .getElementById("successModal")
          .addEventListener("hidden.bs.modal", function () {
            document.getElementById("stockForm").reset();
            document.getElementById("idInput").value = "";
            document.getElementById("dateTimeInput").value = "";
          });
      });
    }
  }
  handleStockSubmit();
});
if (document.getElementById("stockHistory")) {
  displayStockHistory();
}
if (document.getElementById("stockList")) {
  displayStockList();
}
//==========================END OF STOCK FUNCTION===============================

//==========================EXPENSES FUNCTION===============================
function populateExpensesForm() {
  const expensesForm = document.getElementById("expensesForm");
  if (!expensesForm) {
    return;
  }
  const assetSelect = document.getElementById("assetSelect");
  const assets = getData("assets");
  assets.forEach((asset) => {
    const option = document.createElement("option");
    option.value = asset.id;
    option.textContent = `(${asset.bank}) ${asset.account_name} - $${asset.current_balance}`;
    assetSelect.appendChild(option);
  });
}
function calculateExpensesTotal() {
  const amount = document.getElementById("amountInput").value;
  const admFee = document.getElementById("adminFeeInput").value;
  const total = document.getElementById("totalInput");
  const amountNum = Number(amount);
  const admFeeNum = Number(admFee);
  const totalValue = amountNum + admFeeNum;
  total.value = totalValue;
}
function displayExpensesHistory() {
  const expenses = getData("expenses");
  console.log(expenses);
  const tableHead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const timeHead = document.createElement("th");
  const categoryHead = document.createElement("th");
  const assetHead = document.createElement("th");
  const descriptionHead = document.createElement("th");
  const amountHead = document.createElement("th");
  const admFeeHead = document.createElement("th");
  const totalHead = document.createElement("th");

  timeHead.textContent = "TIME";
  categoryHead.textContent = "CATEGORY";
  assetHead.textContent = "ASSET";
  descriptionHead.textContent = "DESCRIPTION";
  amountHead.textContent = "QUANTITY";
  admFeeHead.textContent = "ADM FEE";
  totalHead.textContent = "TOTAL PRICE";

  headerRow.appendChild(timeHead);
  headerRow.appendChild(categoryHead);
  headerRow.appendChild(assetHead);
  headerRow.appendChild(descriptionHead);
  headerRow.appendChild(amountHead);
  headerRow.appendChild(admFeeHead);
  headerRow.appendChild(totalHead);
  tableHead.appendChild(headerRow);
  const modalBody = document.getElementById("expensesHistory");
  const wrapper = document.createElement("table");
  const tbody = document.createElement("tbody");

  tbody.appendChild(tableHead);
  wrapper.classList.add("table", "table-striped");
  expenses.forEach((expense) => {
    const tr = document.createElement("tr");
    const time = document.createElement("td");
    const category = document.createElement("td");
    const asset = document.createElement("td");
    const description = document.createElement("td");
    const amount = document.createElement("td");
    const admFee = document.createElement("td");
    const total = document.createElement("td");

    const timeValue = expense.date.slice(-8);
    time.classList.add("text-start");
    amount.classList.add("text-end");
    admFee.classList.add("text-end");
    total.classList.add("text-end");

    time.textContent = timeValue;
    category.textContent = expense.category;
    asset.textContent = expense.asset_name;
    description.textContent = expense.description;
    amount.textContent = expense.amount;
    admFee.textContent = expense.admin_fee;
    total.textContent = expense.total;
    tr.appendChild(time);
    tr.appendChild(category);
    tr.appendChild(asset);
    tr.appendChild(description);
    tr.appendChild(amount);
    tr.appendChild(admFee);
    tr.appendChild(total);
    tbody.appendChild(tr);
  });
  timeHead.classList.add("text-start");
  amountHead.classList.add("text-end");
  admFeeHead.classList.add("text-end");
  totalHead.classList.add("text-end");
  wrapper.appendChild(tableHead);
  wrapper.appendChild(tbody);
  modalBody.appendChild(wrapper);
}
document.addEventListener("DOMContentLoaded", function () {
  populateExpensesForm();

  const amountInput = document.getElementById("amountInput");
  if (!amountInput) {
    return;
  }
  amountInput.addEventListener("input", calculateExpensesTotal);

  const admFeeInput = document.getElementById("adminFeeInput");
  if (!admFeeInput) {
    return;
  }
  admFeeInput.addEventListener("input", calculateExpensesTotal);

  const expensesForm = document.getElementById("expensesForm");
  if (!expensesForm) {
    return;
  }
  expensesForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = generateId("EXP");
    const date = new Date().toLocaleString("en-GB");
    const assets = getData("assets");
    const assetSelect = document.getElementById("assetSelect");
    const selectedAsset = assets.find((a) => a.id === assetSelect.value);

    const transaction = {
      id: id,
      date: date,
      category: document.getElementById("categorySelect").value,
      description: document.getElementById("descriptionInput").value,
      amount: document.getElementById("amountInput").value,
      adm_fee: document.getElementById("adminFeeInput").value,
      total: document.getElementById("totalInput").value,
      asset_name: selectedAsset
        ? `(${selectedAsset.bank}) ${selectedAsset.account_name}`
        : "",
      asset_id: document.getElementById("assetSelect").value,
    };

    const expenses = getData("expenses");
    expenses.push(transaction);
    saveData("expenses", expenses);

    const modal = new bootstrap.Modal(document.getElementById("successModal"));
    modal.show();

    document.getElementById("successModal").addEventListener(
      "hidden.bs.modal",
      function () {
        document.getElementById("expensesForm").reset();
      },
      { once: true },
    );
  });
});
if (document.getElementById("expensesHistory")) {
  displayExpensesHistory();
}
//==========================END OF expenses FUNCTION===============================
