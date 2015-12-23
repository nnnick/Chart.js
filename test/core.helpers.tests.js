describe('Core helper tests', function() {

	var helpers;

	beforeAll(function() {
		helpers = window.Chart.helpers;
	});

	it('Should iterate over an array and pass the extra data to that function', function() {
		var testData = [0, 9, "abc"];
		var scope = {}; // fake out the scope and ensure that 'this' is the correct thing

		helpers.each(testData, function(item, index) {
			expect(item).not.toBe(undefined);
			expect(index).not.toBe(undefined);

			expect(testData[index]).toBe(item);
			expect(this).toBe(scope);
		}, scope);

		// Reverse iteration
		var iterated = [];
		helpers.each(testData, function(item, index) {
			expect(item).not.toBe(undefined);
			expect(index).not.toBe(undefined);

			expect(testData[index]).toBe(item);
			expect(this).toBe(scope);

			iterated.push(item);
		}, scope, true);

		expect(iterated.slice().reverse()).toEqual(testData);
	});

	it('Should iterate over properties in an object', function() {
		var testData = {
			myProp1: 'abc',
			myProp2: 276,
			myProp3: ['a', 'b']
		};

		helpers.each(testData, function(value, key) {
			if (key === 'myProp1') {
				expect(value).toBe('abc');
			} else if (key === 'myProp2') {
				expect(value).toBe(276);
			} else if (key === 'myProp3') {
				expect(value).toEqual(['a', 'b']);
			} else {
				expect(false).toBe(true);
			}
		});
	});

	it('should not error when iterating over a null object', function() {
		expect(function() {
			helpers.each(undefined);
		}).not.toThrow();
	});

	it('Should clone an object', function() {
		var testData = {
			myProp1: 'abc',
			myProp2: ['a', 'b'],
			myProp3: {
				myProp4: 5,
				myProp5: [1, 2]
			}
		};

		var clone = helpers.clone(testData);
		expect(clone).toEqual(testData);
		expect(clone).not.toBe(testData);

		expect(clone.myProp2).not.toBe(testData.myProp2);
		expect(clone.myProp3).not.toBe(testData.myProp3);
		expect(clone.myProp3.myProp5).not.toBe(testData.myProp3.myProp5);
	});

	it('should extend an object', function() {
		var original = {
			myProp1: 'abc',
			myProp2: 56
		};

		var extension = {
			myProp3: [2, 5, 6],
			myProp2: 0
		};

		helpers.extend(original, extension);

		expect(original).toEqual({
			myProp1: 'abc',
			myProp2: 0,
			myProp3: [2, 5, 6],
		});
	});

	it('Should merge a normal config without scales', function() {
		var baseConfig = {
			valueProp: 5,
			arrayProp: [1, 2, 3, 4, 5, 6],
			objectProp: {
				prop1: 'abc',
				prop2: 56
			}
		};

		var toMerge = {
			valueProp2: null,
			arrayProp: ['a', 'c'],
			objectProp: {
				prop1: 'c',
				prop3: 'prop3'
			}
		};

		var merged = helpers.configMerge(baseConfig, toMerge);
		expect(merged).toEqual({
			valueProp: 5,
			valueProp2: null,
			arrayProp: ['a', 'c', 3, 4, 5, 6],
			objectProp: {
				prop1: 'c',
				prop2: 56,
				prop3: 'prop3'
			}
		});
	});

	it('should merge arrays containing objects', function() {
		var baseConfig = {
			arrayProp: [{
				prop1: 'abc',
				prop2: 56
			}],
		};

		var toMerge = {
			arrayProp: [{
				prop1: 'myProp1',
				prop3: 'prop3'
			}, 2, {
				prop1: 'myProp1'
			}],
		};

		var merged = helpers.configMerge(baseConfig, toMerge);
		expect(merged).toEqual({
			arrayProp: [{
					prop1: 'myProp1',
					prop2: 56,
					prop3: 'prop3'
				},
				2, {
					prop1: 'myProp1'
				}
			],
		});
	});

	it('Should merge scale configs', function() {
		var baseConfig = {
			scales: {
				prop1: {
					abc: 123,
					def: '456'
				},
				prop2: 777,
				yAxes: [{
					type: 'linear',
				}, {
					type: 'log'
				}]
			}
		};

		var toMerge = {
			scales: {
				prop1: {
					def: 'bbb',
					ghi: 78
				},
				prop2: null,
				yAxes: [{
					type: 'linear',
					axisProp: 456
				}, {
					// pulls in linear default config since axis type changes
					type: 'linear',
					position: 'right'
				}, {
					// Pulls in linear default config since axis not in base
					type: 'linear'
				}]
			}
		};

		var merged = helpers.configMerge(baseConfig, toMerge);
		expect(merged).toEqual({
			scales: {
				prop1: {
					abc: 123,
					def: 'bbb',
					ghi: 78
				},
				prop2: null,
				yAxes: [{
					type: 'linear',
					axisProp: 456
				}, {
					display: true,

					gridLines: {
						color: "rgba(0, 0, 0, 0.1)",
						drawOnChartArea: true,
						drawTicks: true, // draw ticks extending towards the label
						lineWidth: 1,
						offsetGridLines: false,
						display: true,
						zeroLineColor: "rgba(0,0,0,0.25)",
						zeroLineWidth: 1,
					},
					position: "right",
					scaleLabel: {
						fontColor: '#666',
						fontFamily: 'Helvetica Neue',
						fontSize: 12,
						fontStyle: 'normal',
						labelString: '',
						display: false,
					},
					ticks: {
						beginAtZero: false,
						fontColor: "#666",
						fontFamily: "Helvetica Neue",
						fontSize: 12,
						fontStyle: "normal",
						maxRotation: 90,
						mirror: false,
						padding: 10,
						reverse: false,
						display: true,
						callback: merged.scales.yAxes[1].ticks.callback, // make it nicer, then check explicitly below
						autoSkip: true,
						autoSkipPadding: 20
					},
					type: 'linear'
				}, {
					display: true,

					gridLines: {
						color: "rgba(0, 0, 0, 0.1)",
						drawOnChartArea: true,
						drawTicks: true, // draw ticks extending towards the label
						lineWidth: 1,
						offsetGridLines: false,
						display: true,
						zeroLineColor: "rgba(0,0,0,0.25)",
						zeroLineWidth: 1,
					},
					position: "left",
					scaleLabel: {
						fontColor: '#666',
						fontFamily: 'Helvetica Neue',
						fontSize: 12,
						fontStyle: 'normal',
						labelString: '',
						display: false,
					},
					ticks: {
						beginAtZero: false,
						fontColor: "#666",
						fontFamily: "Helvetica Neue",
						fontSize: 12,
						fontStyle: "normal",
						maxRotation: 90,
						mirror: false,
						padding: 10,
						reverse: false,
						display: true,
						callback: merged.scales.yAxes[2].ticks.callback, // make it nicer, then check explicitly below
						autoSkip: true,
						autoSkipPadding: 20
					},
					type: 'linear'
				}]
			}
		});

		// Are these actually functions
		expect(merged.scales.yAxes[1].ticks.callback).toEqual(jasmine.any(Function));
		expect(merged.scales.yAxes[2].ticks.callback).toEqual(jasmine.any(Function));
	});

	it('should get value or default', function() {
		expect(helpers.getValueAtIndexOrDefault(98, 0, 56)).toBe(98);
		expect(helpers.getValueAtIndexOrDefault(0, 0, 56)).toBe(0);
		expect(helpers.getValueAtIndexOrDefault(undefined, undefined, 56)).toBe(56);
		expect(helpers.getValueAtIndexOrDefault([1, 2, 3], 1, 100)).toBe(2);
		expect(helpers.getValueAtIndexOrDefault([1, 2, 3], 3, 100)).toBe(100);
	});

	it('should filter an array', function() {
		var data = [-10, 0, 6, 0, 7];
		var callback = function(item) {
			return item > 2
		};
		expect(helpers.where(data, callback)).toEqual([6, 7]);
		expect(helpers.findNextWhere(data, callback)).toEqual(6);
		expect(helpers.findNextWhere(data, callback, 2)).toBe(7);
		expect(helpers.findNextWhere(data, callback, 4)).toBe(undefined);
		expect(helpers.findPreviousWhere(data, callback)).toBe(7);
		expect(helpers.findPreviousWhere(data, callback, 3)).toBe(6);
		expect(helpers.findPreviousWhere(data, callback, 0)).toBe(undefined);
	});

	it('Should get the correct sign', function() {
		expect(helpers.sign(0)).toBe(0);
		expect(helpers.sign(10)).toBe(1);
		expect(helpers.sign(-5)).toBe(-1);
	});

	it('should do a log10 operation', function() {
		expect(helpers.log10(0)).toBe(-Infinity);
		expect(helpers.log10(1)).toBe(0);
		expect(helpers.log10(1000)).toBeCloseTo(3, 1e-9);
	});

	it('Should generate ids', function() {
		expect(helpers.uid()).toBe('chart-0');
		expect(helpers.uid()).toBe('chart-1');
		expect(helpers.uid()).toBe('chart-2');
		expect(helpers.uid()).toBe('chart-3');
	});

	it('should detect a number', function() {
		expect(helpers.isNumber(123)).toBe(true);
		expect(helpers.isNumber('123')).toBe(true);
		expect(helpers.isNumber(null)).toBe(false);
		expect(helpers.isNumber(NaN)).toBe(false);
		expect(helpers.isNumber(undefined)).toBe(false);
		expect(helpers.isNumber('cbc')).toBe(false);
	});

	it('should convert between radians and degrees', function() {
		expect(helpers.toRadians(180)).toBe(Math.PI);
		expect(helpers.toRadians(90)).toBe(0.5 * Math.PI);
		expect(helpers.toDegrees(Math.PI)).toBe(180);
		expect(helpers.toDegrees(Math.PI * 3 / 2)).toBe(270);
	});

	it('should get an angle from a point', function() {
		var center = {
			x: 0,
			y: 0
		};

		expect(helpers.getAngleFromPoint(center, {
			x: 0,
			y: 10
		})).toEqual({
			angle: Math.PI / 2,
			distance: 10,
		});

		expect(helpers.getAngleFromPoint(center, {
			x: Math.sqrt(2),
			y: Math.sqrt(2)
		})).toEqual({
			angle: Math.PI / 4,
			distance: 2
		});

		expect(helpers.getAngleFromPoint(center, {
			x: -1.0 * Math.sqrt(2),
			y: -1.0 * Math.sqrt(2)
		})).toEqual({
			angle: Math.PI * 1.25,
			distance: 2
		});
	});

	it('should spline curves', function() {
		expect(helpers.splineCurve({
			x: 0,
			y: 0
		}, {
			x: 1,
			y: 1
		}, {
			x: 2,
			y: 0
		}, 0)).toEqual({
			previous: {
				x: 1,
				y: 1,
			},
			next: {
				x: 1,
				y: 1,
			}
		});

		expect(helpers.splineCurve({
			x: 0,
			y: 0
		}, {
			x: 1,
			y: 1
		}, {
			x: 2,
			y: 0
		}, 1)).toEqual({
			previous: {
				x: 0,
				y: 1,
			},
			next: {
				x: 2,
				y: 1,
			}
		});
	});

	it('should get the next or previous item in an array', function() {
		var testData = [0, 1, 2];

		expect(helpers.nextItem(testData, 0, false)).toEqual(1);
		expect(helpers.nextItem(testData, 2, false)).toEqual(2);
		expect(helpers.nextItem(testData, 2, true)).toEqual(0);
		expect(helpers.nextItem(testData, 1, true)).toEqual(2);
		expect(helpers.nextItem(testData, -1, false)).toEqual(0);

		expect(helpers.previousItem(testData, 0, false)).toEqual(0);
		expect(helpers.previousItem(testData, 0, true)).toEqual(2);
		expect(helpers.previousItem(testData, 2, false)).toEqual(1);
		expect(helpers.previousItem(testData, 1, true)).toEqual(0);
	});

	it('should clear a canvas', function() {
		var context = window.createMockContext();
		helpers.clear({
			width: 100,
			height: 150,
			ctx: context
		});

		expect(context.getCalls()).toEqual([{
			name: 'clearRect',
			args: [0, 0, 100, 150]
		}]);
	});

	it('should draw a rounded rectangle', function() {
		var context = window.createMockContext();
		helpers.drawRoundedRectangle(context, 10, 20, 30, 40, 5);

		expect(context.getCalls()).toEqual([{
			name: 'beginPath',
			args: []
		}, {
			name: 'moveTo',
			args: [15, 20]
		}, {
			name: 'lineTo',
			args: [35, 20]
		}, {
			name: 'quadraticCurveTo',
			args: [40, 20, 40, 25]
		}, {
			name: 'lineTo',
			args: [40, 55]
		}, {
			name: 'quadraticCurveTo',
			args: [40, 60, 35, 60]
		}, {
			name: 'lineTo',
			args: [15, 60]
		}, {
			name: 'quadraticCurveTo',
			args: [10, 60, 10, 55]
		}, {
			name: 'lineTo',
			args: [10, 25]
		}, {
			name: 'quadraticCurveTo',
			args: [10, 20, 15, 20]
		}, {
			name: 'closePath',
			args: []
		}])
	});
	
	it('should be able to decide if point is inside an area or not', function () {		
		var area = { left: 0, right: 100, top: 0, bottom: 100 };
		var point = { x: 20, y: 20 };
		
		expect(helpers.isInArea(area, point)).toBe(true);
		// Move it too far to the right 
		point.x = 110;
		expect(helpers.isInArea(area, point)).toBe(false);
		// Move it back inside
		point.x = 20;
		expect(helpers.isInArea(area, point)).toBe(true);
		
		// Move it out to the left
		point.x = -10;
		expect(helpers.isInArea(area, point)).toBe(false);
		// Move it back inside
		point.x = 20;
		expect(helpers.isInArea(area, point)).toBe(true);
		
		// Move it below the area
		point.y = 110;
		expect(helpers.isInArea(area, point)).toBe(false);
		// Move it back
		point.y = 20;
		expect(helpers.isInArea(area, point)).toBe(true);
		
		// Move it below the area
		point.y = -10;
		expect(helpers.isInArea(area, point)).toBe(false);
		// Move it back
		point.y = 20;
		expect(helpers.isInArea(area, point)).toBe(true);
		
		// Move area down, making the point be over the area
		area.top = 30;
		expect(helpers.isInArea(area, point)).toBe(false);

		// Move it back
		area.top = 0;
		expect(helpers.isInArea(area, point)).toBe(true);

	});

});
