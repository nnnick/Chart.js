/* eslint no-unused-vars: 1 */
(function() {
	// Code from http://stackoverflow.com/questions/4406864/html-canvas-unit-testing
	var Context = function() {
		this._calls = []; // names/args of recorded calls
		this._initMethods();

		this._fillStyle = null;
		this._lineCap = null;
		this._lineDashOffset = null;
		this._lineJoin = null;
		this._lineWidth = null;
		this._strokeStyle = null;

		// Define properties here so that we can record each time they are set
		Object.defineProperties(this, {
			fillStyle: {
				get: function() {
					return this._fillStyle;
				},
				set: function(style) {
					this._fillStyle = style;
					this.record('setFillStyle', [style]);
				}
			},
			lineCap: {
				get: function() {
					return this._lineCap;
				},
				set: function(cap) {
					this._lineCap = cap;
					this.record('setLineCap', [cap]);
				}
			},
			lineDashOffset: {
				get: function() {
					return this._lineDashOffset;
				},
				set: function(offset) {
					this._lineDashOffset = offset;
					this.record('setLineDashOffset', [offset]);
				}
			},
			lineJoin: {
				get: function() {
					return this._lineJoin;
				},
				set: function(join) {
					this._lineJoin = join;
					this.record('setLineJoin', [join]);
				}
			},
			lineWidth: {
				get: function() {
					return this._lineWidth;
				},
				set: function(width) {
					this._lineWidth = width;
					this.record('setLineWidth', [width]);
				}
			},
			strokeStyle: {
				get: function() {
					return this._strokeStyle;
				},
				set: function(style) {
					this._strokeStyle = style;
					this.record('setStrokeStyle', [style]);
				}
			},
		});
	};

	Context.prototype._initMethods = function() {
		// define methods to test here
		// no way to introspect so we have to do some extra work :(
		var methods = {
			arc: function() {},
			beginPath: function() {},
			bezierCurveTo: function() {},
			clearRect: function() {},
			closePath: function() {},
			fill: function() {},
			fillRect: function() {},
			fillText: function() {},
			lineTo: function(x, y) {},
			measureText: function(text) {
				// return the number of characters * fixed size
				return text ? {width: text.length * 10} : {width: 0};
			},
			moveTo: function(x, y) {},
			quadraticCurveTo: function() {},
			restore: function() {},
			rotate: function() {},
			save: function() {},
			setLineDash: function() {},
			stroke: function() {},
			strokeRect: function(x, y, w, h) {},
			setTransform: function(a, b, c, d, e, f) {},
			translate: function(x, y) {},
		};

		// attach methods to the class itself
		var me = this;
		var methodName;

		var addMethod = function(name, method) {
			me[methodName] = function() {
				me.record(name, arguments);
				return method.apply(me, arguments);
			};
		};

		for (methodName in methods) {
			if ({}.hasOwnProperty.call(methods, methodName)) {
				var method = methods[methodName];

				addMethod(methodName, method);
			}
		}
	};

	Context.prototype.record = function(methodName, args) {
		this._calls.push({
			name: methodName,
			args: Array.prototype.slice.call(args)
		});
	};

	Context.prototype.getCalls = function() {
		return this._calls;
	};

	Context.prototype.resetCalls = function() {
		this._calls = [];
	};

	window.createMockContext = function() {
		return new Context();
	};

	// Custom matcher
	function toBeCloseToPixel() {
		return {
			compare: function(actual, expected) {
				var result = false;

				if (!isNaN(actual) && !isNaN(expected)) {
					var diff = Math.abs(actual - expected);
					var A = Math.abs(actual);
					var B = Math.abs(expected);
					var percentDiff = 0.005; // 0.5% diff
					result = (diff <= (A > B ? A : B) * percentDiff) || diff < 2; // 2 pixels is fine
				}

				return {pass: result};
			}
		};
	}

	function toEqualOneOf() {
		return {
			compare: function(actual, expecteds) {
				var result = false;
				for (var i = 0, l = expecteds.length; i < l; i++) {
					if (actual === expecteds[i]) {
						result = true;
						break;
					}
				}
				return {
					pass: result
				};
			}
		};
	}

	function toBeChartOfSize() {
		return {
			compare: function(actual, expected) {
				var message = null;
				var chart, canvas, style, dh, dw, rh, rw;

				if (!actual || !(actual instanceof Chart.Controller)) {
					message = 'Expected ' + actual + ' to be an instance of Chart.Controller.';
				} else {
					chart = actual.chart;
					canvas = chart.ctx.canvas;
					style = getComputedStyle(canvas);
					dh = parseInt(style.height, 10);
					dw = parseInt(style.width, 10);
					rh = canvas.height;
					rw = canvas.width;

					// sanity checks
					if (chart.height !== rh) {
						message = 'Expected chart height ' + chart.height + ' to be equal to render height ' + rh;
					} else if (chart.width !== rw) {
						message = 'Expected chart width ' + chart.width + ' to be equal to render width ' + rw;
					}

					// validity checks
					if (dh !== expected.dh) {
						message = 'Expected display height ' + dh + ' to be equal to ' + expected.dh;
					} else if (dw !== expected.dw) {
						message = 'Expected display width ' + dw + ' to be equal to ' + expected.dw;
					} else if (rh !== expected.rh) {
						message = 'Expected render height ' + rh + ' to be equal to ' + expected.rh;
					} else if (rw !== expected.rw) {
						message = 'Expected render width ' + rw + ' to be equal to ' + expected.rw;
					}
				}

				return {
					message: message? message : 'Expected ' + actual + ' to be a chart of size ' + expected,
					pass: !message
				};
			}
		};
	}

	beforeEach(function() {
		jasmine.addMatchers({
			toBeCloseToPixel: toBeCloseToPixel,
			toEqualOneOf: toEqualOneOf,
			toBeChartOfSize: toBeChartOfSize
		});
	});

	// Canvas injection helpers
	var charts = {};

	/**
	 * Injects a new canvas (and div wrapper) and creates teh associated Chart instance
	 * using the given config. Additional options allow tweaking elements generation.
	 * @param {object} config - Chart config.
	 * @param {object} options - Chart acquisition options.
	 * @param {object} options.canvas - Canvas attributes.
	 * @param {object} options.wrapper - Canvas wrapper attributes.
	 * @param {boolean} options.persistent - If true, the chart will not be released after the spec.
	 */
	function acquireChart(config, options) {
		var wrapper = document.createElement('div');
		var canvas = document.createElement('canvas');
		var chart, key;

		options = options || {};
		options.canvas = options.canvas || {height: 512, width: 512};
		options.wrapper = options.wrapper || {class: 'chartjs-wrapper'};

		for (key in options.canvas) {
			if (options.canvas.hasOwnProperty(key)) {
				canvas.setAttribute(key, options.canvas[key]);
			}
		}

		for (key in options.wrapper) {
			if (options.wrapper.hasOwnProperty(key)) {
				wrapper.setAttribute(key, options.wrapper[key]);
			}
		}

		// by default, remove chart animation and auto resize
		config.options = config.options || {};
		config.options.animation = config.options.animation === undefined? false : config.options.animation;
		config.options.responsive = config.options.responsive === undefined? false : config.options.responsive;
		config.options.defaultFontFamily = config.options.defaultFontFamily || 'Arial';

		wrapper.appendChild(canvas);
		window.document.body.appendChild(wrapper);

		chart = new Chart(canvas.getContext('2d'), config);
		chart.testPersistent = options.persistent;
		chart.testWrapper = wrapper;
		charts[chart.id] = chart;
		return chart;
	}

	function releaseChart(chart) {
		chart.destroy();
		chart._test_wrapper.remove();
		delete charts[chart.id];
	}

	afterEach(function() {
		// Auto releasing acquired charts
		for (var id in charts) {
			if ({}.hasOwnProperty.call(charts, id)) {
				var chart = charts[id];
				if (!chart._test_persistent) {
					releaseChart(chart);
				}
			}
		}
	});

	function injectCSS(css) {
		// http://stackoverflow.com/q/3922139
		var head = document.getElementsByTagName('head')[0];
		var style = document.createElement('style');
		style.setAttribute('type', 'text/css');
		if (style.styleSheet) {   // IE
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}
		head.appendChild(style);
	}

	window.acquireChart = acquireChart;
	window.releaseChart = releaseChart;

	// some style initialization to limit differences between browsers across different plateforms.
	injectCSS(
		'.chartjs-wrapper, .chartjs-wrapper canvas {' +
			'border: 0;' +
			'margin: 0;' +
			'padding: 0;' +
		'}' +
		'.chartjs-wrapper {' +
			'position: absolute' +
		'}');
}());
