function getLabels(scale) {
  return scale.ticks.map(t => t.label);
}

describe('Logarithmic Scale tests', function() {
  describe('auto', jasmine.fixture.specs('scale.logarithmic'));

  it('should register', function() {
    var Constructor = Chart.registry.getScale('logarithmic');
    expect(Constructor).not.toBe(undefined);
    expect(typeof Constructor).toBe('function');
  });

  it('should have the correct default config', function() {
    var defaultConfig = Chart.defaults.scales.logarithmic;
    expect(defaultConfig).toEqual({
      ticks: {
        callback: Chart.Ticks.formatters.logarithmic,
        major: {
          enabled: true
        }
      }
    });

    // Is this actually a function
    expect(defaultConfig.ticks.callback).toEqual(jasmine.any(Function));
  });

  it('should correctly determine the max & min data values', function() {
    var chart = window.acquireChart({
      type: 'bar',
      data: {
        datasets: [{
          yAxisID: 'y',
          data: [42, 1000, 64, 100],
        }, {
          yAxisID: 'y1',
          data: [10, 5, 5000, 78, 450]
        }, {
          yAxisID: 'y1',
          data: [150]
        }, {
          yAxisID: 'y2',
          data: [20, 0, 150, 1800, 3040]
        }, {
          yAxisID: 'y3',
          data: [67, 0.0004, 0, 820, 0.001]
        }],
        labels: ['a', 'b', 'c', 'd', 'e']
      },
      options: {
        scales: {
          y: {
            id: 'y',
            type: 'logarithmic'
          },
          y1: {
            type: 'logarithmic',
            position: 'right'
          },
          y2: {
            type: 'logarithmic',
            position: 'right'
          },
          y3: {
            position: 'right',
            type: 'logarithmic'
          }
        }
      }
    });

    expect(chart.scales.y).not.toEqual(undefined); // must construct
    expect(chart.scales.y.min).toBe(10);
    expect(chart.scales.y.max).toBe(1000);

    expect(chart.scales.y1).not.toEqual(undefined); // must construct
    expect(chart.scales.y1.min).toBe(1);
    expect(chart.scales.y1.max).toBe(5000);

    expect(chart.scales.y2).not.toEqual(undefined); // must construct
    expect(chart.scales.y2.min).toBe(10);
    expect(chart.scales.y2.max).toBe(4000);

    expect(chart.scales.y3).not.toEqual(undefined); // must construct
    expect(chart.scales.y3.min).toBeCloseTo(0.0001, 4);
    expect(chart.scales.y3.max).toBe(900);
  });

  it('should correctly determine the max & min of string data values', function() {
    var chart = window.acquireChart({
      type: 'line',
      data: {
        datasets: [{
          yAxisID: 'y',
          data: ['42', '1000', '64', '100'],
        }, {
          yAxisID: 'y1',
          data: ['10', '5', '5000', '78', '450']
        }, {
          yAxisID: 'y1',
          data: ['150']
        }, {
          yAxisID: 'y2',
          data: ['20', '0', '150', '1800', '3040']
        }, {
          yAxisID: 'y3',
          data: ['67', '0.0004', '0', '820', '0.001']
        }],
        labels: ['a', 'b', 'c', 'd', 'e']
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic'
          },
          y1: {
            position: 'right',
            type: 'logarithmic'
          },
          y2: {
            position: 'right',
            type: 'logarithmic'
          },
          y3: {
            position: 'right',
            type: 'logarithmic'
          }
        }
      }
    });

    expect(chart.scales.y).not.toEqual(undefined); // must construct
    expect(chart.scales.y.min).toBe(40);
    expect(chart.scales.y.max).toBe(1000);

    expect(chart.scales.y1).not.toEqual(undefined); // must construct
    expect(chart.scales.y1.min).toBe(5);
    expect(chart.scales.y1.max).toBe(5000);

    expect(chart.scales.y2).not.toEqual(undefined); // must construct
    expect(chart.scales.y2.min).toBe(10);
    expect(chart.scales.y2.max).toBe(4000);

    expect(chart.scales.y3).not.toEqual(undefined); // must construct
    expect(chart.scales.y3.min).toBeCloseTo(0.0001, 4);
    expect(chart.scales.y3.max).toBe(900);
  });

  it('should correctly determine the max & min data values when there are hidden datasets', function() {
    var chart = window.acquireChart({
      type: 'line',
      data: {
        datasets: [{
          yAxisID: 'y1',
          data: [10, 5, 5000, 78, 450]
        }, {
          yAxisID: 'y',
          data: [42, 1000, 64, 100],
        }, {
          yAxisID: 'y1',
          data: [50000],
          hidden: true
        }, {
          yAxisID: 'y2',
          data: [20, 0, 7400, 14, 291]
        }, {
          yAxisID: 'y2',
          data: [6, 0.0007, 9, 890, 60000],
          hidden: true
        }],
        labels: ['a', 'b', 'c', 'd', 'e']
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic'
          },
          y1: {
            position: 'right',
            type: 'logarithmic'
          },
          y2: {
            position: 'right',
            type: 'logarithmic'
          }
        }
      }
    });

    expect(chart.scales.y1).not.toEqual(undefined); // must construct
    expect(chart.scales.y1.min).toBe(5);
    expect(chart.scales.y1.max).toBe(5000);

    expect(chart.scales.y2).not.toEqual(undefined); // must construct
    expect(chart.scales.y2.min).toBe(10);
    expect(chart.scales.y2.max).toBe(8000);
  });

  it('should correctly determine the max & min data values when there is NaN data', function() {
    var chart = window.acquireChart({
      type: 'bar',
      data: {
        datasets: [{
          yAxisID: 'y',
          data: [undefined, 10, null, 5, 5000, NaN, 78, 450]
        }, {
          yAxisID: 'y',
          data: [undefined, 28, null, 1000, 500, NaN, 50, 42, Infinity, -Infinity]
        }, {
          yAxisID: 'y1',
          data: [undefined, 30, null, 9400, 0, NaN, 54, 836]
        }, {
          yAxisID: 'y1',
          data: [undefined, 0, null, 800, 9, NaN, 894, 21]
        }],
        labels: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic'
          },
          y1: {
            position: 'right',
            type: 'logarithmic'
          }
        }
      }
    });

    expect(chart.scales.y).not.toEqual(undefined); // must construct
    expect(chart.scales.y.min).toBe(1);
    expect(chart.scales.y.max).toBe(5000);

    // Turn on stacked mode since it uses it's own
    chart.options.scales.y.stacked = true;
    chart.update();

    expect(chart.scales.y.min).toBe(1);
    expect(chart.scales.y.max).toBe(6000);

    expect(chart.scales.y1).not.toEqual(undefined); // must construct
    expect(chart.scales.y1.min).toBe(1);
    expect(chart.scales.y1.max).toBe(10000);
  });

  it('should correctly determine the max & min for scatter data', function() {
    var chart = window.acquireChart({
      type: 'line',
      data: {
        datasets: [{
          data: [
            {x: 10, y: 100},
            {x: 2, y: 6},
            {x: 65, y: 121},
            {x: 99, y: 7}
          ]
        }]
      },
      options: {
        scales: {
          x: {
            type: 'logarithmic',
            position: 'bottom'
          },
          y: {
            type: 'logarithmic'
          }
        }
      }
    });

    expect(chart.scales.x.min).toBe(2);
    expect(chart.scales.x.max).toBe(100);

    expect(chart.scales.y.min).toBe(6);
    expect(chart.scales.y.max).toBe(150);
  });

  it('should correctly determine the max & min for scatter data when 0 values are present', function() {
    var chart = window.acquireChart({
      type: 'line',
      data: {
        datasets: [{
          data: [
            {x: 7, y: 950},
            {x: 289, y: 0},
            {x: 0, y: 8},
            {x: 23, y: 0.04}
          ]
        }]
      },
      options: {
        scales: {
          x: {
            type: 'logarithmic',
            position: 'bottom'
          },
          y: {
            type: 'logarithmic'
          }
        }
      }
    });

    expect(chart.scales.x.min).toBe(1);
    expect(chart.scales.x.max).toBe(30);

    expect(chart.scales.y.min).toBe(0.01);
    expect(chart.scales.y.max).toBe(1000);
  });

  it('should correctly determine the min and max data values when stacked mode is turned on', function() {
    var chart = window.acquireChart({
      type: 'bar',
      data: {
        datasets: [{
          type: 'bar',
          yAxisID: 'y',
          data: [10, 5, 1, 5, 78, 100]
        }, {
          yAxisID: 'y1',
          data: [0, 1000],
        }, {
          type: 'bar',
          yAxisID: 'y',
          data: [150, 10, 10, 100, 10, 9]
        }, {
          type: 'line',
          yAxisID: 'y',
          data: [100, 100, 100, 100, 100, 100]
        }],
        labels: ['a', 'b', 'c', 'd', 'e', 'f']
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            stacked: true
          },
          y1: {
            position: 'right',
            type: 'logarithmic'
          }
        }
      }
    });

    expect(chart.scales.y.min).toBe(0.1);
    expect(chart.scales.y.max).toBe(200);
  });

  it('should correctly determine the min and max data values when stacked mode is turned on ignoring hidden datasets', function() {
    var chart = window.acquireChart({
      type: 'bar',
      data: {
        datasets: [{
          yAxisID: 'y',
          data: [10, 5, 1, 5, 78, 100],
          type: 'bar'
        }, {
          yAxisID: 'y1',
          data: [0, 1000],
          type: 'bar'
        }, {
          yAxisID: 'y',
          data: [150, 10, 10, 100, 10, 9],
          type: 'bar'
        }, {
          yAxisID: 'y',
          data: [10000, 10000, 10000, 10000, 10000, 10000],
          hidden: true,
          type: 'bar'
        }],
        labels: ['a', 'b', 'c', 'd', 'e', 'f']
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            stacked: true
          },
          y1: {
            position: 'right',
            type: 'logarithmic'
          }
        }
      }
    });

    expect(chart.scales.y.min).toBe(0.1);
    expect(chart.scales.y.max).toBe(200);
  });

  it('should ensure that the scale has a max and min that are not equal', function() {
    var chart = window.acquireChart({
      type: 'bar',
      data: {
        datasets: [{
          data: []
        }],
        labels: []
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic'
          }
        }
      }
    });

    expect(chart.scales.y.min).toBe(1);
    expect(chart.scales.y.max).toBe(10);

    chart.data.datasets[0].data = [0.15, 0.15];
    chart.update();

    expect(chart.scales.y.min).toBe(0.1);
    expect(chart.scales.y.max).toBe(0.15);
  });

  it('should use the min and max options', function() {
    var chart = window.acquireChart({
      type: 'bar',
      data: {
        datasets: [{
          data: [1, 1, 1, 2, 1, 0]
        }],
        labels: []
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            min: 10,
            max: 1010,
            ticks: {
              callback: function(value) {
                return value;
              }
            }
          }
        }
      }
    });

    var yScale = chart.scales.y;
    var tickCount = yScale.ticks.length;
    expect(yScale.min).toBe(10);
    expect(yScale.max).toBe(1010);
    expect(yScale.ticks[0].value).toBe(10);
    expect(yScale.ticks[tickCount - 1].value).toBe(1010);
  });

  it('should ignore negative min and max options', function() {
    var chart = window.acquireChart({
      type: 'bar',
      data: {
        datasets: [{
          data: [1, 1, 1, 2, 1, 0]
        }],
        labels: []
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            min: -10,
            max: -1010,
            ticks: {
              callback: function(value) {
                return value;
              }
            }
          }
        }
      }
    });

    var y = chart.scales.y;
    expect(y.min).toBe(0.1);
    expect(y.max).toBe(2);
  });

  it('should ignore invalid min and max options', function() {
    var chart = window.acquireChart({
      type: 'bar',
      data: {
        datasets: [{
          data: [1, 1, 1, 2, 1, 0]
        }],
        labels: ['a', 'b', 'c', 'd', 'e', 'f']
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            min: 'zero',
            max: null,
            ticks: {
              callback: function(value) {
                return value;
              }
            }
          }
        }
      }
    });

    var y = chart.scales.y;
    expect(y.min).toBe(0.1);
    expect(y.max).toBe(2);
  });

  it('should generate tick marks', function() {
    var chart = window.acquireChart({
      type: 'bar',
      data: {
        datasets: [{
          data: [10, 5, 2, 25, 78]
        }],
        labels: []
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            ticks: {
              autoSkip: false,
              callback: function(value) {
                return value;
              }
            }
          }
        }
      }
    });

    var scale = chart.scales.y;
    expect(getLabels(scale)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30, 40, 50, 60, 70, 80]);
    expect(scale.start).toEqual(1);
    expect(scale.end).toEqual(80);
  });

  it('should generate tick marks when 0 values are present', function() {
    var chart = window.acquireChart({
      type: 'bar',
      data: {
        datasets: [{
          data: [11, 0.8, 0, 28, 7]
        }],
        labels: []
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            ticks: {
              callback: function(value) {
                return value;
              }
            }
          }
        }
      }
    });

    var scale = chart.scales.y;
    // Counts down because the lines are drawn top to bottom
    expect(getLabels(scale)).toEqual([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30]);
    expect(scale.start).toEqual(0.1);
    expect(scale.end).toEqual(30);
  });


  it('should generate tick marks in the correct order in reversed mode', function() {
    var chart = window.acquireChart({
      type: 'line',
      data: {
        datasets: [{
          data: [10, 5, 1, 25, 78]
        }],
        labels: []
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            reverse: true,
            ticks: {
              autoSkip: false,
              callback: function(value) {
                return value;
              }
            }
          }
        }
      }
    });

    var scale = chart.scales.y;
    expect(getLabels(scale)).toEqual([80, 70, 60, 50, 40, 30, 20, 15, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    expect(scale.start).toEqual(80);
    expect(scale.end).toEqual(1);
  });

  it('should generate tick marks in the correct order in reversed mode when 0 values are present', function() {
    var chart = window.acquireChart({
      type: 'line',
      data: {
        datasets: [{
          data: [21, 9, 0, 10, 25]
        }],
        labels: []
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            reverse: true,
            ticks: {
              callback: function(value) {
                return value;
              }
            }
          }
        }
      }
    });

    var scale = chart.scales.y;
    expect(getLabels(scale)).toEqual([30, 20, 15, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    expect(scale.start).toEqual(30);
    expect(scale.end).toEqual(1);
  });

  it('should build labels using the default template', function() {
    var chart = window.acquireChart({
      type: 'line',
      data: {
        datasets: [{
          data: [10, 5, 1.1, 25, 0, 78]
        }],
        labels: []
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            ticks: {
              autoSkip: false
            }
          }
        }
      }
    });

    expect(getLabels(chart.scales.y)).toEqual(['1', '2', '3', '', '5', '', '', '', '', '10', '15', '20', '30', '', '50', '60', '70', '80']);
  });

  it('should build labels using the user supplied callback', function() {
    var chart = window.acquireChart({
      type: 'bar',
      data: {
        datasets: [{
          data: [10, 5, 2, 25, 78]
        }],
        labels: []
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            ticks: {
              callback: function(value, index) {
                return index.toString();
              }
            }
          }
        }
      }
    });

    // Just the index
    expect(getLabels(chart.scales.y)).toEqual(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17']);
  });

  it('should correctly get the correct label for a data item', function() {
    var chart = window.acquireChart({
      type: 'bar',
      data: {
        datasets: [{
          yAxisID: 'y',
          data: [10, 5, 5000, 78, 450]
        }, {
          yAxisID: 'y1',
          data: [1, 1000, 10, 100],
        }, {
          yAxisID: 'y',
          data: [150]
        }],
        labels: []
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic'
          },
          y1: {
            position: 'right',
            type: 'logarithmic'
          }
        }
      }
    });

    expect(chart.scales.y.getLabelForValue(150)).toBe('150');
  });

  it('should correctly use the locale when generating the label', function() {
    var chart = window.acquireChart({
      type: 'bar',
      data: {
        datasets: [{
          yAxisID: 'y',
          data: [10, 5, 5000, 78, 450]
        }, {
          yAxisID: 'y1',
          data: [1, 1000, 10, 100],
        }, {
          yAxisID: 'y',
          data: [150]
        }],
        labels: []
      },
      options: {
        locale: 'de-DE',
        scales: {
          y: {
            type: 'logarithmic'
          },
          y1: {
            position: 'right',
            type: 'logarithmic'
          }
        }
      }
    });

    expect(chart.scales.y.getLabelForValue(10.25)).toBe('10,25');
  });

  describe('when', function() {
    var data = [
      {
        data: [1, 39],
        stack: 'stack'
      },
      {
        data: [1, 39],
        stack: 'stack'
      },
    ];
    var dataWithEmptyStacks = [
      {
        data: []
      },
      {
        data: []
      }
    ].concat(data);
    var config = [
      {
        axis: 'y',
        firstTick: 1, // start of the axis (minimum)
        describe: 'all stacks are defined'
      },
      {
        axis: 'y',
        data: dataWithEmptyStacks,
        firstTick: 1,
        describe: 'not all stacks are defined'
      },
      {
        axis: 'y',
        scale: {
          y: {
            min: 0
          }
        },
        firstTick: 0.1,
        describe: 'all stacks are defined and min: 0'
      },
      {
        axis: 'y',
        data: dataWithEmptyStacks,
        scale: {
          y: {
            min: 0
          }
        },
        firstTick: 0.1,
        describe: 'not stacks are defined and min: 0'
      },
      {
        axis: 'x',
        firstTick: 1,
        describe: 'all stacks are defined'
      },
      {
        axis: 'x',
        data: dataWithEmptyStacks,
        firstTick: 1,
        describe: 'not all stacks are defined'
      },
      {
        axis: 'x',
        scale: {
          x: {
            min: 0
          }
        },
        firstTick: 0.1,
        describe: 'all stacks are defined and min: 0'
      },
      {
        axis: 'x',
        data: dataWithEmptyStacks,
        scale: {
          x: {
            min: 0
          }
        },
        firstTick: 0.1,
        describe: 'not all stacks are defined and min: 0'
      },
    ];
    config.forEach(function(setup) {
      var scaleConfig = {};
      var indexAxis, chartStart, chartEnd;

      if (setup.axis === 'x') {
        indexAxis = 'y';
        chartStart = 'left';
        chartEnd = 'right';
      } else {
        indexAxis = 'x';
        chartStart = 'bottom';
        chartEnd = 'top';
      }
      scaleConfig[setup.axis] = {
        type: 'logarithmic',
        beginAtZero: false
      };
      Object.assign(scaleConfig, setup.scale);
      scaleConfig[setup.axis].type = 'logarithmic';

      var description = 'dataset has stack option and ' + setup.describe
				+ ' and axis is "' + setup.axis + '";';
      describe(description, function() {
        it('should define the correct axis limits', function() {
          var chart = window.acquireChart({
            type: 'bar',
            data: {
              labels: ['category 1', 'category 2'],
              datasets: setup.data || data,
            },
            options: {
              indexAxis,
              scales: scaleConfig
            }
          });

          var axisID = setup.axis;
          var scale = chart.scales[axisID];
          var firstTick = setup.firstTick;
          var lastTick = 80; // last tick (should be first available tick after: 2 * 39)
          var start = chart.chartArea[chartStart];
          var end = chart.chartArea[chartEnd];

          expect(scale.getPixelForValue(firstTick)).toBeCloseToPixel(start);
          expect(scale.getPixelForValue(lastTick)).toBeCloseToPixel(end);

          expect(scale.getValueForPixel(start)).toBeCloseTo(firstTick, 4);
          expect(scale.getValueForPixel(end)).toBeCloseTo(lastTick, 4);

          chart.scales[axisID].options.reverse = true; // Reverse mode
          chart.update();

          // chartArea might have been resized in update
          start = chart.chartArea[chartEnd];
          end = chart.chartArea[chartStart];

          expect(scale.getPixelForValue(firstTick)).toBeCloseToPixel(start);
          expect(scale.getPixelForValue(lastTick)).toBeCloseToPixel(end);

          expect(scale.getValueForPixel(start)).toBeCloseTo(firstTick, 4);
          expect(scale.getValueForPixel(end)).toBeCloseTo(lastTick, 4);
        });
      });
    });
  });

  describe('when', function() {
    var config = [
      {
        dataset: [],
        firstTick: 1, // value of the first tick
        lastTick: 10, // value of the last tick
        describe: 'empty dataset, without min/max'
      },
      {
        dataset: [],
        scale: {stacked: true},
        firstTick: 1,
        lastTick: 10,
        describe: 'empty dataset, without min/max, with stacked: true'
      },
      {
        data: {
          datasets: [
            {data: [], stack: 'stack'},
            {data: [], stack: 'stack'},
          ],
        },
        type: 'bar',
        firstTick: 1,
        lastTick: 10,
        describe: 'empty dataset with stack option, without min/max'
      },
      {
        dataset: [],
        scale: {min: 1},
        firstTick: 1,
        lastTick: 10,
        describe: 'empty dataset, min: 1, without max'
      },
      {
        dataset: [],
        scale: {max: 80},
        firstTick: 1,
        lastTick: 80,
        describe: 'empty dataset, max: 80, without min'
      },
      {
        dataset: [],
        scale: {max: 0.8},
        firstTick: 0.01,
        lastTick: 0.8,
        describe: 'empty dataset, max: 0.8, without min'
      },
      {
        dataset: [{x: 10, y: 10}, {x: 5, y: 5}, {x: 1, y: 1}, {x: 25, y: 25}, {x: 78, y: 78}],
        firstTick: 1,
        lastTick: 80,
        describe: 'dataset min point {x: 1, y: 1}, max point {x:78, y:78}'
      },
    ];
    config.forEach(function(setup) {
      var axes = [
        {
          id: 'x', // horizontal scale
          start: 'left',
          end: 'right'
        },
        {
          id: 'y', // vertical scale
          start: 'bottom',
          end: 'top'
        }
      ];
      axes.forEach(function(axis) {
        var expectation = 'min = ' + setup.firstTick + ', max = ' + setup.lastTick;
        describe(setup.describe + ' and axis is "' + axis.id + '"; expect: ' + expectation + ';', function() {
          beforeEach(function() {
            var xConfig = {
              type: 'logarithmic',
              position: 'bottom'
            };
            var yConfig = {
              type: 'logarithmic',
              position: 'left'
            };
            var data = setup.data || {
              datasets: [{
                data: setup.dataset
              }],
            };
            Object.assign(xConfig, setup.scale);
            Object.assign(yConfig, setup.scale);
            Object.assign(data, setup.data || {});
            this.chart = window.acquireChart({
              type: 'line',
              data: data,
              options: {
                scales: {
                  x: xConfig,
                  y: yConfig
                }
              }
            });
          });

          it('should get the correct pixel value for a point', function() {
            var chart = this.chart;
            var axisID = axis.id;
            var scale = chart.scales[axisID];
            var firstTick = setup.firstTick;
            var lastTick = setup.lastTick;
            var start = chart.chartArea[axis.start];
            var end = chart.chartArea[axis.end];

            expect(scale.getPixelForValue(firstTick)).toBeCloseToPixel(start);
            expect(scale.getPixelForValue(lastTick)).toBeCloseToPixel(end);
            expect(scale.getPixelForValue(0)).toBeCloseToPixel(start); // 0 is invalid, put it at the start.

            expect(scale.getValueForPixel(start)).toBeCloseTo(firstTick, 4);
            expect(scale.getValueForPixel(end)).toBeCloseTo(lastTick, 4);

            chart.scales[axisID].options.reverse = true; // Reverse mode
            chart.update();

            // chartArea might have been resized in update
            start = chart.chartArea[axis.end];
            end = chart.chartArea[axis.start];

            expect(scale.getPixelForValue(firstTick)).toBeCloseToPixel(start);
            expect(scale.getPixelForValue(lastTick)).toBeCloseToPixel(end);

            expect(scale.getValueForPixel(start)).toBeCloseTo(firstTick, 4);
            expect(scale.getValueForPixel(end)).toBeCloseTo(lastTick, 4);
          });
        });
      });
    });
  });

  describe('when', function() {
    var config = [
      {
        dataset: [],
        scale: {min: 0},
        lastTick: 10, // value of the last tick
        describe: 'empty dataset, min: 0, without max'
      },
      {
        dataset: [],
        scale: {min: 0, max: 80},
        lastTick: 80,
        describe: 'empty dataset, min: 0, max: 80'
      },
      {
        dataset: [],
        scale: {min: 0, max: 0.8},
        lastTick: 0.8,
        describe: 'empty dataset, min: 0, max: 0.8'
      },
      {
        dataset: [{x: 0, y: 0}, {x: 10, y: 10}, {x: 1.2, y: 1.2}, {x: 25, y: 25}, {x: 78, y: 78}],
        lastTick: 80,
        describe: 'dataset min point {x: 0, y: 0}, max point {x:78, y:78}'
      },
      {
        dataset: [{x: 0, y: 0}, {x: 10, y: 10}, {x: 6.3, y: 6.3}, {x: 25, y: 25}, {x: 78, y: 78}],
        lastTick: 80,
        describe: 'dataset min point {x: 0, y: 0}, max point {x:78, y:78}'
      },
      {
        dataset: [{x: 10, y: 10}, {x: 1.2, y: 1.2}, {x: 25, y: 25}, {x: 78, y: 78}],
        scale: {min: 0},
        lastTick: 80,
        describe: 'dataset min point {x: 1.2, y: 1.2}, max point {x:78, y:78}, min: 0'
      },
      {
        dataset: [{x: 10, y: 10}, {x: 6.3, y: 6.3}, {x: 25, y: 25}, {x: 78, y: 78}],
        scale: {min: 0},
        lastTick: 80,
        describe: 'dataset min point {x: 6.3, y: 6.3}, max point {x:78, y:78}, min: 0'
      },
    ];
    config.forEach(function(setup) {
      var axes = [
        {
          id: 'x', // horizontal scale
          start: 'left',
          end: 'right'
        },
        {
          id: 'y', // vertical scale
          start: 'bottom',
          end: 'top'
        }
      ];
      axes.forEach(function(axis) {
        var expectation = 'min = 0, max = ' + setup.lastTick;
        describe(setup.describe + ' and axis is "' + axis.id + '"; expect: ' + expectation + ';', function() {
          beforeEach(function() {
            var xConfig = {
              type: 'logarithmic',
              position: 'bottom'
            };
            var yConfig = {
              type: 'logarithmic',
              position: 'left'
            };
            var data = setup.data || {
              datasets: [{
                data: setup.dataset
              }],
            };
            Object.assign(xConfig, setup.scale);
            Object.assign(yConfig, setup.scale);
            Object.assign(data, setup.data || {});
            this.chart = window.acquireChart({
              type: 'line',
              data: data,
              options: {
                scales: {
                  x: xConfig,
                  y: yConfig
                }
              }
            });
          });

          it('should get the correct pixel value for a point', function() {
            var chart = this.chart;
            var axisID = axis.id;
            var scale = chart.scales[axisID];
            var lastTick = setup.lastTick;
            var start = chart.chartArea[axis.start];
            var end = chart.chartArea[axis.end];

            expect(scale.getPixelForValue(0)).toBeCloseToPixel(start);
            expect(scale.getPixelForValue(lastTick)).toBeCloseToPixel(end);

            expect(scale.getValueForPixel(start)).toBeCloseTo(scale.min, 4);
            expect(scale.getValueForPixel(end)).toBeCloseTo(lastTick, 4);

            chart.scales[axisID].options.reverse = true; // Reverse mode
            chart.update();

            // chartArea might have been resized in update
            start = chart.chartArea[axis.end];
            end = chart.chartArea[axis.start];

            expect(scale.getPixelForValue(0)).toBeCloseToPixel(start);
            expect(scale.getPixelForValue(lastTick)).toBeCloseToPixel(end);

            expect(scale.getValueForPixel(start)).toBeCloseTo(scale.min, 4);
            expect(scale.getValueForPixel(end)).toBeCloseTo(lastTick, 4);
          });
        });
      });
    });
  });

  it('Should correctly determine the max & min when no values provided and suggested minimum and maximum are set', function() {
    var chart = window.acquireChart({
      type: 'bar',
      data: {
        datasets: [{
          yAxisID: 'y',
          data: []
        }],
        labels: ['a', 'b', 'c', 'd', 'e', 'f']
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            suggestedMin: 10,
            suggestedMax: 100
          }
        }
      }
    });

    expect(chart.scales.y).not.toEqual(undefined); // must construct
    expect(chart.scales.y.min).toBe(10);
    expect(chart.scales.y.max).toBe(100);
  });

  it('Should bound to data', function() {
    var chart = window.acquireChart({
      type: 'line',
      data: {
        labels: ['a', 'b'],
        datasets: [{
          data: [1.1, 99]
        }]
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            bounds: 'data'
          }
        }
      }
    });

    expect(chart.scales.y.min).toEqual(1.1);
    expect(chart.scales.y.max).toEqual(99);
  });
});
