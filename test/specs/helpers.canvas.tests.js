'use strict';

describe('Chart.helpers.canvas', function() {
	describe('auto', jasmine.fixture.specs('helpers'));

	var helpers = Chart.helpers;

	describe('clear', function() {
		it('should clear the chart canvas', function() {
			var chart = acquireChart({}, {
				canvas: {
					style: 'width: 150px; height: 245px'
				}
			});

			spyOn(chart.ctx, 'clearRect');

			helpers.clear(chart);

			expect(chart.ctx.clearRect.calls.count()).toBe(1);
			expect(chart.ctx.clearRect.calls.first().object).toBe(chart.ctx);
			expect(chart.ctx.clearRect.calls.first().args).toEqual([0, 0, 150, 245]);
		});
	});

	describe('isPointInArea', function() {
		it('should determine if a point is in the area', function() {
			var isPointInArea = helpers._isPointInArea;
			var area = {left: 0, top: 0, right: 512, bottom: 256};

			expect(isPointInArea({x: 0, y: 0}, area)).toBe(true);
			expect(isPointInArea({x: -1e-12, y: -1e-12}, area)).toBe(true);
			expect(isPointInArea({x: 512, y: 256}, area)).toBe(true);
			expect(isPointInArea({x: 512 + 1e-12, y: 256 + 1e-12}, area)).toBe(true);
			expect(isPointInArea({x: -0.5, y: 0}, area)).toBe(false);
			expect(isPointInArea({x: 0, y: 256.5}, area)).toBe(false);
		});
	});

	it('should return the width of the longest text in an Array and 2D Array', function() {
		var context = window.createMockContext();
		var font = "normal 12px 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
		var arrayOfThings1D = ['FooBar', 'Bar'];
		var arrayOfThings2D = [['FooBar_1', 'Bar_2'], 'Foo_1'];


		// Regardless 'FooBar' is the longest label it should return (characters * 10)
		expect(helpers._longestText(context, font, arrayOfThings1D, {})).toEqual(60);
		expect(helpers._longestText(context, font, arrayOfThings2D, {})).toEqual(80);
		// We check to make sure we made the right calls to the canvas.
		expect(context.getCalls()).toEqual([{
			name: 'save',
			args: []
		}, {
			name: 'measureText',
			args: ['FooBar']
		}, {
			name: 'measureText',
			args: ['Bar']
		}, {
			name: 'restore',
			args: []
		}, {
			name: 'save',
			args: []
		}, {
			name: 'measureText',
			args: ['FooBar_1']
		}, {
			name: 'measureText',
			args: ['Bar_2']
		}, {
			name: 'measureText',
			args: ['Foo_1']
		}, {
			name: 'restore',
			args: []
		}]);
	});

	it('compare text with current longest and update', function() {
		var context = window.createMockContext();
		var data = {};
		var gc = [];
		var longest = 70;

		expect(helpers._measureText(context, data, gc, longest, 'foobar')).toEqual(70);
		expect(helpers._measureText(context, data, gc, longest, 'foobar_')).toEqual(70);
		expect(helpers._measureText(context, data, gc, longest, 'foobar_1')).toEqual(80);
		// We check to make sure we made the right calls to the canvas.
		expect(context.getCalls()).toEqual([{
			name: 'measureText',
			args: ['foobar']
		}, {
			name: 'measureText',
			args: ['foobar_']
		}, {
			name: 'measureText',
			args: ['foobar_1']
		}]);
	});

	describe('renderText', function() {
		it('should render multiple lines of text', function() {
			var context = window.createMockContext();
			helpers.renderText(context, ['foo', 'foo2'], 0, 0, 20);

			expect(context.getCalls()).toEqual([{
				name: 'fillText',
				args: ['foo', 0, 0, undefined],
			}, {
				name: 'fillText',
				args: ['foo2', 0, 20, undefined],
			}]);
		});

		it('should accept the text maxWidth', function() {
			var context = window.createMockContext();
			helpers.renderText(context, 'foo', 0, 0, 20, {maxWidth: 30});
			expect(context.getCalls()).toEqual([{
				name: 'fillText',
				args: ['foo', 0, 0, 30],
			}]);
		});

		it('should stroke the text', function() {
			var context = window.createMockContext();
			helpers.renderText(context, 'foo', 0, 0, 20, {stroke: true});
			expect(context.getCalls()).toEqual([{
				name: 'strokeText',
				args: ['foo', 0, 0, undefined],
			}, {
				name: 'fillText',
				args: ['foo', 0, 0, undefined],
			}]);
		});

		it('should underline the text', function() {
			var context = window.createMockContext();
			helpers.renderText(context, 'foo', 0, 0, 20, {decorationWidth: 3, underline: true});

			expect(context.getCalls()).toEqual([{
				name: 'fillText',
				args: ['foo', 0, 0, undefined],
			}, {
				name: 'measureText',
				args: ['foo'],
			}, {
				name: 'beginPath',
				args: [],
			}, {
				name: 'setLineWidth',
				args: [3],
			}, {
				name: 'moveTo',
				args: [-15, 8],
			}, {
				name: 'lineTo',
				args: [25, 8],
			}, {
				name: 'stroke',
				args: [],
			}]);
		});

		it('should strikethrough the text', function() {
			var context = window.createMockContext();
			helpers.renderText(context, 'foo', 0, 0, 20, {strikethrough: true});

			expect(context.getCalls()).toEqual([{
				name: 'fillText',
				args: ['foo', 0, 0, undefined],
			}, {
				name: 'measureText',
				args: ['foo'],
			}, {
				name: 'beginPath',
				args: [],
			}, {
				name: 'setLineWidth',
				args: [2],
			}, {
				name: 'moveTo',
				args: [-15, 2],
			}, {
				name: 'lineTo',
				args: [25, 2],
			}, {
				name: 'stroke',
				args: [],
			}]);
		});
	});
});
