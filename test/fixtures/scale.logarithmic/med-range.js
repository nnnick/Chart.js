module.exports = {
  config: {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        backgroundColor: 'red',
        borderColor: 'red',
        fill: false,
        data: [25, 24, 27, 32, 45, 30, 28]
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
