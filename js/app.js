const weeklyCtx = document.getElementById("weeklyChart").getContext("2d");
const monthlyCostCtx = document
  .getElementById("monthlyCostChart")
  .getContext("2d");

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
        backgroundColor: '#ffffff'
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
});

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
    onResize: function(chart, size) {
        chart.resize();
    }
  },
});

window.addEventListener('resize', () => {
    weeklyChart.resize();
    monthlyCostChart.resize();
});