document.getElementById("sidebar").innerHTML = `
    <aside class="sidebar">
  <a href="/index.html" id="company-logo">COMPANY LOGO</a>
  <a href="/index.html">HOME</a>
  <a href="/pages/assets.html">ASSETS</a>
  <div class="nav-item">
    <a href="#" onclick="toggleMenu('sales-menu')">SALES</a>
    <ul id="sales-menu">

      <li><a href="/pages/sales/add.html">Add Sales</a></li>
      <li><a href="/pages/sales/history.html">Sales History</a></li>
    </ul>
  </div>
  <div class="nav-item">
    <a href="#" onclick="toggleMenu('expense-menu')">EXPENSE</a>
    <ul id="expense-menu">

      <li><a href="/pages/expense/add.html">Add Expense</a></li>
      <li><a href="/pages/expense/history.html">Expense History</a></li>
    </ul>
  </div>
  <div class="nav-item">
    <a href="#" onclick="toggleMenu('inventory-menu')">INVENTORY</a>
    <ul id="inventory-menu">

      <li><a href="/pages/inventory/add.html">Add Inventory</a></li>
      <li><a href="/pages/inventory/history.html">Inventory History</a></li>
    </ul>
  </div>
  <a href="/pages/history.html">HISTORY</a>
  <a href="/pages/adjustment.html">ADJUSTMENT</a>
  <a href="/index.html" id="logout">LOGOUT</a>
</aside>

`;
