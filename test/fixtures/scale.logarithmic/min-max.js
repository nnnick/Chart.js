module.exports = {
  config: {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        backgroundColor: 'red',
        borderColor: 'red',
        fill: false,
        data: [250, 240, 270, 320, 450, 300, 280]
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
          min: 233,
          max: 471,
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
