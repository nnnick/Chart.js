module.exports = {
  config: {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        backgroundColor: 'red',
        borderColor: 'red',
        fill: false,
        data: [5000.002, 5000.012, 5000.01, 5000.03, 5000.04, 5000.004, 5000.032]
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: false,
        },
        y: {
          type: 'logarithmic',
          ticks: {
            autoSkip: false
          }
        }
      }
    }
  },
  options: {
    spriteText: true
  }
};
