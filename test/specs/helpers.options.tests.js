const {toLineHeight, toPadding, toFont, resolve, toTRBLCorners} = Chart.helpers;

describe('Chart.helpers.options', function() {
	describe('toLineHeight', function() {
		it ('should support keyword values', function() {
			expect(toLineHeight('normal', 16)).toBe(16 * 1.2);
		});
		it ('should support unitless values', function() {
			expect(toLineHeight(1.4, 16)).toBe(16 * 1.4);
			expect(toLineHeight('1.4', 16)).toBe(16 * 1.4);
		});
		it ('should support length values', function() {
			expect(toLineHeight('42px', 16)).toBe(42);
			expect(toLineHeight('1.4em', 16)).toBe(16 * 1.4);
		});
		it ('should support percentage values', function() {
			expect(toLineHeight('140%', 16)).toBe(16 * 1.4);
		});
		it ('should fallback to default (1.2) for invalid values', function() {
			expect(toLineHeight(null, 16)).toBe(16 * 1.2);
			expect(toLineHeight(undefined, 16)).toBe(16 * 1.2);
			expect(toLineHeight('foobar', 16)).toBe(16 * 1.2);
		});
	});

	describe('toTRBLCorners', function() {
		it('should support number values', function() {
			expect(toTRBLCorners(4)).toEqual(
				{topLeft: 4, topRight: 4, bottomLeft: 4, bottomRight: 4});
			expect(toTRBLCorners(4.5), 100).toEqual(
				{topLeft: 4.5, topRight: 4.5, bottomLeft: 4.5, bottomRight: 4.5});
		});
		it('should support string values', function() {
			expect(toTRBLCorners('4', 100)).toEqual(
				{topLeft: 4, topRight: 4, bottomLeft: 4, bottomRight: 4});
			expect(toTRBLCorners('4.5', 100)).toEqual(
				{topLeft: 4.5, topRight: 4.5, bottomLeft: 4.5, bottomRight: 4.5});
			expect(toTRBLCorners('4.5px', 100)).toEqual(
				{topLeft: 4.5, topRight: 4.5, bottomLeft: 4.5, bottomRight: 4.5});
			expect(toTRBLCorners('4.5%', 100)).toEqual(
				{topLeft: 4.5, topRight: 4.5, bottomLeft: 4.5, bottomRight: 4.5});
			expect(toTRBLCorners('4.666%', 50)).toEqual(
				{topLeft: 2.333, topRight: 2.333, bottomLeft: 2.333, bottomRight: 2.333});
		});
		it('should support object values', function() {
			expect(toTRBLCorners({topLeft: 1, topRight: 2, bottomLeft: 3, bottomRight: 4})).toEqual(
				{topLeft: 1, topRight: 2, bottomLeft: 3, bottomRight: 4});
			expect(toTRBLCorners({topLeft: 1.5, topRight: 2.5, bottomLeft: 3.5, bottomRight: 4.5}, 100)).toEqual(
				{topLeft: 1.5, topRight: 2.5, bottomLeft: 3.5, bottomRight: 4.5});
			expect(toTRBLCorners({topLeft: 1.5, topRight: 2.5, bottomLeft: '3.5', bottomRight: '4.5'}, 100)).toEqual(
				{topLeft: 1.5, topRight: 2.5, bottomLeft: 3.5, bottomRight: 4.5});
			expect(toTRBLCorners({topLeft: '1', topRight: '2', bottomLeft: '3', bottomRight: '4'}, 100)).toEqual(
				{topLeft: 1, topRight: 2, bottomLeft: 3, bottomRight: 4});
		});
		it('should fallback to 0 for invalid values', function() {
			expect(toTRBLCorners({topLeft: 'foo', topRight: 'foo', bottomLeft: 'foo', bottomRight: 'foo'})).toEqual(
				{topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0});
			expect(toTRBLCorners({topLeft: null, topRight: null, bottomLeft: null, bottomRight: null})).toEqual(
				{topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0});
			expect(toTRBLCorners({})).toEqual(
				{topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0});
			expect(toTRBLCorners('foo')).toEqual(
				{topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0});
			expect(toTRBLCorners(null)).toEqual(
				{topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0});
			expect(toTRBLCorners(undefined)).toEqual(
				{topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0});
		});
	});

	describe('toPadding', function() {
		it ('should support number values', function() {
			expect(toPadding(4)).toEqual(
				{top: 4, right: 4, bottom: 4, left: 4, height: 8, width: 8});
			expect(toPadding(4.5)).toEqual(
				{top: 4.5, right: 4.5, bottom: 4.5, left: 4.5, height: 9, width: 9});
		});
		it ('should support string values', function() {
			expect(toPadding('4')).toEqual(
				{top: 4, right: 4, bottom: 4, left: 4, height: 8, width: 8});
			expect(toPadding('4.5')).toEqual(
				{top: 4.5, right: 4.5, bottom: 4.5, left: 4.5, height: 9, width: 9});
		});
		it ('should support object values', function() {
			expect(toPadding({top: 1, right: 2, bottom: 3, left: 4})).toEqual(
				{top: 1, right: 2, bottom: 3, left: 4, height: 4, width: 6});
			expect(toPadding({top: 1.5, right: 2.5, bottom: 3.5, left: 4.5})).toEqual(
				{top: 1.5, right: 2.5, bottom: 3.5, left: 4.5, height: 5, width: 7});
			expect(toPadding({top: '1', right: '2', bottom: '3', left: '4'})).toEqual(
				{top: 1, right: 2, bottom: 3, left: 4, height: 4, width: 6});
		});
		it ('should fallback to 0 for invalid values', function() {
			expect(toPadding({top: 'foo', right: 'foo', bottom: 'foo', left: 'foo'})).toEqual(
				{top: 0, right: 0, bottom: 0, left: 0, height: 0, width: 0});
			expect(toPadding({top: null, right: null, bottom: null, left: null})).toEqual(
				{top: 0, right: 0, bottom: 0, left: 0, height: 0, width: 0});
			expect(toPadding({})).toEqual(
				{top: 0, right: 0, bottom: 0, left: 0, height: 0, width: 0});
			expect(toPadding('foo')).toEqual(
				{top: 0, right: 0, bottom: 0, left: 0, height: 0, width: 0});
			expect(toPadding(null)).toEqual(
				{top: 0, right: 0, bottom: 0, left: 0, height: 0, width: 0});
			expect(toPadding(undefined)).toEqual(
				{top: 0, right: 0, bottom: 0, left: 0, height: 0, width: 0});
		});
	});

	describe('toFont', function() {
		it('should return a font with default values', function() {
			const defaultFont = Object.assign({}, Chart.defaults.font);

			Object.assign(Chart.defaults.font, {
				family: 'foobar',
				size: 42,
				style: 'xxxyyy',
				lineHeight: 1.5
			});

			expect(toFont({})).toEqual({
				family: 'foobar',
				lineHeight: 63,
				size: 42,
				string: 'xxxyyy 42px foobar',
				style: 'xxxyyy',
				weight: null
			});

			Object.assign(Chart.defaults.font, defaultFont);
		});
		it ('should return a font with given values', function() {
			expect(toFont({
				family: 'bla',
				lineHeight: 8,
				size: 21,
				style: 'zzz'
			})).toEqual({
				family: 'bla',
				lineHeight: 8 * 21,
				size: 21,
				string: 'zzz 21px bla',
				style: 'zzz',
				weight: null
			});
		});
		it ('should handle a string font size', function() {
			expect(toFont({
				family: 'bla',
				lineHeight: 8,
				size: '21',
				style: 'zzz'
			})).toEqual({
				family: 'bla',
				lineHeight: 8 * 21,
				size: 21,
				string: 'zzz 21px bla',
				style: 'zzz',
				weight: null
			});
		});
		it('should return null as a font string if size or family are missing', function() {
			const fontFamily = Chart.defaults.font.family;
			const fontSize = Chart.defaults.font.size;
			delete Chart.defaults.font.family;
			delete Chart.defaults.font.size;

			expect(toFont({
				style: 'italic',
				size: 12
			}).string).toBeNull();
			expect(toFont({
				style: 'italic',
				family: 'serif'
			}).string).toBeNull();

			Chart.defaults.font.family = fontFamily;
			Chart.defaults.font.size = fontSize;
		});
		it('font.style should be optional for font strings', function() {
			const fontStyle = Chart.defaults.font.style;
			delete Chart.defaults.font.style;

			expect(toFont({
				size: 12,
				family: 'serif'
			}).string).toBe('12px serif');

			Chart.defaults.font.style = fontStyle;
		});
	});

	describe('resolve', function() {
		it ('should fallback to the first defined input', function() {
			expect(resolve([42])).toBe(42);
			expect(resolve([42, 'foo'])).toBe(42);
			expect(resolve([undefined, 42, 'foo'])).toBe(42);
			expect(resolve([42, 'foo', undefined])).toBe(42);
			expect(resolve([undefined])).toBe(undefined);
		});
		it ('should correctly handle empty values (null, 0, "")', function() {
			expect(resolve([0, 'foo'])).toBe(0);
			expect(resolve(['', 'foo'])).toBe('');
			expect(resolve([null, 'foo'])).toBe(null);
		});
		it ('should support indexable options if index is provided', function() {
			var input = [42, 'foo', 'bar'];
			expect(resolve([input], undefined, 0)).toBe(42);
			expect(resolve([input], undefined, 1)).toBe('foo');
			expect(resolve([input], undefined, 2)).toBe('bar');
		});
		it ('should fallback if an indexable option value is undefined', function() {
			var input = [42, undefined, 'bar'];
			expect(resolve([input], undefined, 1)).toBe(undefined);
			expect(resolve([input, 'foo'], undefined, 1)).toBe('foo');
		});
		it ('should loop if an indexable option index is out of bounds', function() {
			var input = [42, undefined, 'bar'];
			expect(resolve([input], undefined, 3)).toBe(42);
			expect(resolve([input, 'foo'], undefined, 4)).toBe('foo');
			expect(resolve([input, 'foo'], undefined, 5)).toBe('bar');
		});
		it ('should not handle indexable options if index is undefined', function() {
			var array = [42, 'foo', 'bar'];
			expect(resolve([array])).toBe(array);
			expect(resolve([array], undefined, undefined)).toBe(array);
		});
		it ('should support scriptable options if context is provided', function() {
			var input = function(context) {
				return context.v * 2;
			};
			expect(resolve([42], {v: 42})).toBe(42);
			expect(resolve([input], {v: 42})).toBe(84);
		});
		it ('should fallback if a scriptable option returns undefined', function() {
			var input = function() {};
			expect(resolve([input], {v: 42})).toBe(undefined);
			expect(resolve([input, 'foo'], {v: 42})).toBe('foo');
			expect(resolve([input, undefined, 'foo'], {v: 42})).toBe('foo');
		});
		it ('should not handle scriptable options if context is undefined', function() {
			var input = function(context) {
				return context.v * 2;
			};
			expect(resolve([input])).toBe(input);
			expect(resolve([input], undefined)).toBe(input);
		});
		it ('should handle scriptable and indexable option', function() {
			var input = function(context) {
				return [context.v, undefined, 'bar'];
			};
			expect(resolve([input, 'foo'], {v: 42}, 0)).toBe(42);
			expect(resolve([input, 'foo'], {v: 42}, 1)).toBe('foo');
			expect(resolve([input, 'foo'], {v: 42}, 5)).toBe('bar');
			expect(resolve([input, ['foo', 'bar']], {v: 42}, 1)).toBe('bar');
		});
	});
});
