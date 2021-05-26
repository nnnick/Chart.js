function getLabels(scale) {
  return scale.ticks.map(t => t.label);
}

describe('Test tick generators', function() {
  // formatters are used as default config values so users want to be able to reference them
  it('Should expose formatters api', function() {
    expect(typeof Chart.Ticks).toBeDefined();
    expect(typeof Chart.Ticks.formatters).toBeDefined();
    expect(typeof Chart.Ticks.formatters.values).toBe('function');
    expect(typeof Chart.Ticks.formatters.numeric).toBe('function');
  });

  it('Should generate linear spaced ticks with correct precision', function() {
    var chart = window.acquireChart({
      type: 'line',
      data: {
        datasets: [{
          data: []
        }],
      },
      options: {
        plugins: {
          legend: false
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            ticks: {
              callback: function(value) {
                return value.toString();
              }
            }
          },
          y: {
            type: 'linear',
            ticks: {
              callback: function(value) {
                return value.toString();
              }
            }
          }
        }
      }
    });

    var xLabels = getLabels(chart.scales.x);
    var yLabels = getLabels(chart.scales.y);

    expect(xLabels).toEqual(['0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1']);
    expect(yLabels).toEqual(['0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1']);
  });

  it('Should generate logarithmic spaced ticks with correct precision', function() {
    var chart = window.acquireChart({
      type: 'line',
      data: {
        datasets: [{
          data: []
        }],
      },
      options: {
        plugins: {
          legend: false
        },
        scales: {
          x: {
            type: 'logarithmic',
            position: 'bottom',
            min: 0.1,
            max: 1,
            ticks: {
              autoSkip: false,
              callback: function(value) {
                return value.toString();
              }
            }
          },
          y: {
            type: 'logarithmic',
            min: 0.1,
            max: 1,
            ticks: {
              autoSkip: false,
              callback: function(value) {
                return value.toString();
              }
            }
          }
        }
      }
    });

    var xLabels = getLabels(chart.scales.x);
    var yLabels = getLabels(chart.scales.y);

    expect(xLabels).toEqual(['0.1', '0.11', '0.12', '0.13', '0.14', '0.15', '0.16', '0.17', '0.18', '0.19', '0.2', '0.25', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1']);
    expect(yLabels).toEqual(['0.1', '0.11', '0.12', '0.13', '0.14', '0.15', '0.16', '0.17', '0.18', '0.19', '0.2', '0.25', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1']);
  });

  describe('formatters.numeric', function() {
    it('should not fail on empty or 1 item array', function() {
      const scale = {chart: {options: {locale: 'en'}}, options: {ticks: {format: {}}}};
      expect(Chart.Ticks.formatters.numeric.apply(scale, [1, 0, []])).toEqual('1');
      expect(Chart.Ticks.formatters.numeric.apply(scale, [1, 0, [{value: 1}]])).toEqual('1');
      expect(Chart.Ticks.formatters.numeric.apply(scale, [1, 0, [{value: 1}, {value: 1.01}]])).toEqual('1.00');
    });
  });
});
