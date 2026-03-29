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

// initialize storage function
function initStorage() {
  if (!localStorage.getItem("assets")) {
    localStorage.setItem("assets", JSON.stringify([]));
  }
  if (!localStorage.getItem("inventory")) {
    localStorage.setItem("inventory", JSON.stringify([]));
  }
  if (!localStorage.getItem("expense")) {
    localStorage.setItem("expense", JSON.stringify([]));
  }
  if (!localStorage.getItem("sales")) {
    localStorage.setItem("sales", JSON.stringify([]));
  }
}

initStorage();

// helper function
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

// SALES FUNCTION
function populateSalesForm() {
  const itemSelect = document.getElementById("itemSelect");
  const assetSelect = document.getElementById("assetSelect");
  if (!itemSelect || !assetSelect) {
    return;
  }
  const inventory = getData("inventory");
  const assets = getData("assets");

  inventory.forEach((item) => {
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
    option.textContent = `${asset.bank_name} - $${asset.current_balance}`;
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
        const transaction = {
          id: id,
          date: time,
          item_id: itemId,
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
// END OF SALES FUNCTION

// INVENTORY FUNCTION
function populateInventoryForm(){
  const assetSelect = document.getElementById('assetSelect');
  if(!assetSelect){return}

  const inventory = getData("inventory");
  inventory.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = `${item.item_name} Stock: ${item.qty}`;
    itemSelect.appendChild(option);
  });
}

function calculateInventoryTotal() {
  const qty = document.getElementById("qtyInput").value;
  const buyPrice = document.getElementById("buyPriceInput").value;
  const admFee = document.getElementById("admFeeInput").value;
  const total = document.getElementById("totalInput");
  const qtyValue = Math.max(1, parseInt(qty) || 1);
  const totalValue = qtyValue * buyPrice - admFee;
  total.value = totalValue;
}

document.addEventListener('DOMContentLoaded', function () {
  populateInventoryForm();
  const itemName = document.getElementById('itemNameInput');
  if (!itemName){return}
  const qty = document.getElementById('qtyInput');
  const buyPrice = document.getElementById('buyPriceInput');
  const admFee = document.getElementById('admFeeInput');
  const total = document.getElementById('totalInput');
  const asset = document.getElementById('assetSelect');
  const description = document.getElementById('descriptionInput');
  const id = document.getElementById('idInput');
  const date = document.getElementById('dateTimeInput');
  const submitBtn = document.getElementById('submitBtn');
  qty.addEventListener('input', function(){
    calculateInventoryTotal()
  });
  buyPrice.addEventListener('input', function(){
    calculateInventoryTotal()
  });
  admFee.addEventListener('input', function(){
    calculateInventoryTotal()
  });


});


