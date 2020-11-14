import defaults from './core.defaults';
import Element from './core.element';
import {_alignPixel, _measureText} from '../helpers/helpers.canvas';
import {callback as call, each, isArray, isFinite, isNullOrUndef, isObject, valueOrDefault} from '../helpers/helpers.core';
import {_factorize, toDegrees, toRadians, _int16Range, HALF_PI} from '../helpers/helpers.math';
import {toFont, resolve, toPadding} from '../helpers/helpers.options';
import Ticks from './core.ticks';

/**
 * @typedef { import("./core.controller").default } Chart
 * @typedef {{value:any, label?:string, major?:boolean, $context?:any}} Tick
 */

defaults.set('scale', {
	display: true,
	offset: false,
	reverse: false,
	beginAtZero: false,

	// grid line settings
	gridLines: {
		display: true,
		color: 'rgba(0,0,0,0.1)',
		lineWidth: 1,
		drawBorder: true,
		drawOnChartArea: true,
		drawTicks: true,
		tickMarkLength: 10,
		offsetGridLines: false,
		borderDash: [],
		borderDashOffset: 0.0,
		linesBetweenTicks: 0,
		linesBetweenTicksWidth: 0.5,
	},

	// scale label
	scaleLabel: {
		// display property
		display: false,

		// actual label
		labelString: '',

		// top/bottom padding
		padding: {
			top: 4,
			bottom: 4
		}
	},

	// label settings
	ticks: {
		minRotation: 0,
		maxRotation: 50,
		mirror: false,
		lineWidth: 0,
		strokeStyle: '',
		padding: 0,
		display: true,
		autoSkip: true,
		autoSkipPadding: 0,
		labelOffset: 0,
		// We pass through arrays to be rendered as multiline labels, we convert Others to strings here.
		callback: Ticks.formatters.values,
		minor: {},
		major: {},
		align: 'center',
		crossAlign: 'near',
	}
});

/**
 * Returns a new array containing numItems from arr
 * @param {any[]} arr
 * @param {number} numItems
 */
function sample(arr, numItems) {
	const result = [];
	const increment = arr.length / numItems;
	const len = arr.length;
	let i = 0;

	for (; i < len; i += increment) {
		result.push(arr[Math.floor(i)]);
	}
	return result;
}

/**
 * @param {Scale} scale
 * @param {number} index
 * @param {boolean} offsetGridLines
 */
function getPixelForGridLine(scale, index, offsetGridLines) {
	const length = scale.ticks.length;
	const validIndex = Math.min(index, length - 1);
	const start = scale._startPixel;
	const end = scale._endPixel;
	const epsilon = 1e-6; // 1e-6 is margin in pixels for accumulated error.
	let lineValue = scale.getPixelForTick(validIndex);
	let offset;

	if (offsetGridLines) {
		if (length === 1) {
			offset = Math.max(lineValue - start, end - lineValue);
		} else if (index === 0) {
			offset = (scale.getPixelForTick(1) - lineValue) / 2;
		} else {
			offset = (lineValue - scale.getPixelForTick(validIndex - 1)) / 2;
		}
		lineValue += validIndex < index ? offset : -offset;

		// Return undefined if the pixel is out of the range
		if (lineValue < start - epsilon || lineValue > end + epsilon) {
			return;
		}
	}
	return lineValue;
}

/**
 * @param {object} caches
 * @param {number} length
 */
function garbageCollect(caches, length) {
	each(caches, (cache) => {
		const gc = cache.gc;
		const gcLen = gc.length / 2;
		let i;
		if (gcLen > length) {
			for (i = 0; i < gcLen; ++i) {
				delete cache.data[gc[i]];
			}
			gc.splice(0, gcLen);
		}
	});
}

/**
 * @param {object} options
 */
function getTickMarkLength(options) {
	return options.drawTicks ? options.tickMarkLength : 0;
}

/**
 * @param {object} options
 */
function getScaleLabelHeight(options, fallback) {
	if (!options.display) {
		return 0;
	}

	const font = toFont(options.font, fallback);
	const padding = toPadding(options.padding);

	return font.lineHeight + padding.height;
}

/**
 * @param {number[]} arr
 */
function getEvenSpacing(arr) {
	const len = arr.length;
	let i, diff;

	if (len < 2) {
		return false;
	}

	for (diff = arr[0], i = 1; i < len; ++i) {
		if (arr[i] - arr[i - 1] !== diff) {
			return false;
		}
	}
	return diff;
}

/**
 * @param {number[]} majorIndices
 * @param {Tick[]} ticks
 * @param {number} ticksLimit
 */
function calculateSpacing(majorIndices, ticks, ticksLimit) {
	const evenMajorSpacing = getEvenSpacing(majorIndices);
	const spacing = ticks.length / ticksLimit;

	// If the major ticks are evenly spaced apart, place the minor ticks
	// so that they divide the major ticks into even chunks
	if (!evenMajorSpacing) {
		return Math.max(spacing, 1);
	}

	const factors = _factorize(evenMajorSpacing);
	for (let i = 0, ilen = factors.length - 1; i < ilen; i++) {
		const factor = factors[i];
		if (factor > spacing) {
			return factor;
		}
	}
	return Math.max(spacing, 1);
}

/**
 * @param {Tick[]} ticks
 */
function getMajorIndices(ticks) {
	const result = [];
	let i, ilen;
	for (i = 0, ilen = ticks.length; i < ilen; i++) {
		if (ticks[i].major) {
			result.push(i);
		}
	}
	return result;
}

/**
 * @param {Tick[]} ticks
 * @param {Tick[]} newTicks
 * @param {number[]} majorIndices
 * @param {number} spacing
 */
function skipMajors(ticks, newTicks, majorIndices, spacing) {
	let count = 0;
	let next = majorIndices[0];
	let i;

	spacing = Math.ceil(spacing);
	for (i = 0; i < ticks.length; i++) {
		if (i === next) {
			newTicks.push(ticks[i]);
			count++;
			next = majorIndices[count * spacing];
		}
	}
}

/**
 * @param {Tick[]} ticks
 * @param {Tick[]} newTicks
 * @param {number} spacing
 * @param {number} [majorStart]
 * @param {number} [majorEnd]
 */
function skip(ticks, newTicks, spacing, majorStart, majorEnd) {
	const start = valueOrDefault(majorStart, 0);
	const end = Math.min(valueOrDefault(majorEnd, ticks.length), ticks.length);
	let count = 0;
	let length, i, next;

	spacing = Math.ceil(spacing);
	if (majorEnd) {
		length = majorEnd - majorStart;
		spacing = length / Math.floor(length / spacing);
	}

	next = start;

	while (next < 0) {
		count++;
		next = Math.round(start + count * spacing);
	}

	for (i = Math.max(start, 0); i < end; i++) {
		if (i === next) {
			newTicks.push(ticks[i]);
			count++;
			next = Math.round(start + count * spacing);
		}
	}
}

function createScaleContext(parent, scale) {
	return Object.create(parent, {
		scale: {
			value: scale
		},
		type: {
			value: 'scale'
		}
	});
}

function createTickContext(parent, index, tick) {
	return Object.create(parent, {
		tick: {
			value: tick
		},
		index: {
			value: index
		},
		type: {
			value: 'tick'
		}
	});
}

export default class Scale extends Element {

	// eslint-disable-next-line max-statements
	constructor(cfg) {
		super();

		/** @type {string} */
		this.id = cfg.id;
		/** @type {string} */
		this.type = cfg.type;
		/** @type {object} */
		this.options = undefined;
		/** @type {CanvasRenderingContext2D} */
		this.ctx = cfg.ctx;
		/** @type {Chart} */
		this.chart = cfg.chart;

		// implements box
		/** @type {number} */
		this.top = undefined;
		/** @type {number} */
		this.bottom = undefined;
		/** @type {number} */
		this.left = undefined;
		/** @type {number} */
		this.right = undefined;
		/** @type {number} */
		this.width = undefined;
		/** @type {number} */
		this.height = undefined;
		this._margins = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		};
		/** @type {number} */
		this.maxWidth = undefined;
		/** @type {number} */
		this.maxHeight = undefined;
		/** @type {number} */
		this.paddingTop = undefined;
		/** @type {number} */
		this.paddingBottom = undefined;
		/** @type {number} */
		this.paddingLeft = undefined;
		/** @type {number} */
		this.paddingRight = undefined;

		// scale-specific properties
		/** @type {string=} */
		this.axis = undefined;
		/** @type {number=} */
		this.labelRotation = undefined;
		this.min = undefined;
		this.max = undefined;
		/** @type {Tick[]} */
		this.ticks = [];
		/** @type {object[]|null} */
		this._gridLineItems = null;
		/** @type {object[]|null} */
		this._labelItems = null;
		/** @type {object|null} */
		this._labelSizes = null;
		this._length = 0;
		this._longestTextCache = {};
		/** @type {number} */
		this._startPixel = undefined;
		/** @type {number} */
		this._endPixel = undefined;
		this._reversePixels = false;
		this._userMax = undefined;
		this._userMin = undefined;
		this._ticksLength = 0;
		this._borderValue = 0;
		this._cache = {};
		this.$context = undefined;
	}

	/**
	 * @param {object} options
	 * @since 3.0
	 */
	init(options) {
		const me = this;
		me.options = options;

		me.axis = me.isHorizontal() ? 'x' : 'y';

		// parse min/max value, so we can properly determine min/max for other scales
		me._userMin = me.parse(options.min);
		me._userMax = me.parse(options.max);
	}

	/**
	 * Parse a supported input value to internal representation.
	 * @param {*} raw
	 * @param {number} [index]
	 * @since 3.0
	 */
	parse(raw, index) { // eslint-disable-line no-unused-vars
		return raw;
	}

	/**
	 * @return {{min: number, max: number, minDefined: boolean, maxDefined: boolean}}
	 * @protected
	 * @since 3.0
	 */
	getUserBounds() {
		let min = this._userMin;
		let max = this._userMax;
		if (isNullOrUndef(min) || isNaN(min)) {
			min = Number.POSITIVE_INFINITY;
		}
		if (isNullOrUndef(max) || isNaN(max)) {
			max = Number.NEGATIVE_INFINITY;
		}
		return {min, max, minDefined: isFinite(min), maxDefined: isFinite(max)};
	}

	/**
	 * @param {boolean} canStack
	 * @return {{min: number, max: number}}
	 * @protected
	 * @since 3.0
	 */
	getMinMax(canStack) {
		const me = this;
		// eslint-disable-next-line prefer-const
		let {min, max, minDefined, maxDefined} = me.getUserBounds();
		let range;

		if (minDefined && maxDefined) {
			return {min, max};
		}

		const metas = me.getMatchingVisibleMetas();
		for (let i = 0, ilen = metas.length; i < ilen; ++i) {
			range = metas[i].controller.getMinMax(me, canStack);
			if (!minDefined) {
				min = Math.min(min, range.min);
			}
			if (!maxDefined) {
				max = Math.max(max, range.max);
			}
		}

		return {min, max};
	}

	invalidateCaches() {
		this._cache = {};
	}

	/**
	 * Get the padding needed for the scale
	 * @return {{top: number, left: number, bottom: number, right: number}} the necessary padding
	 * @private
	 */
	getPadding() {
		const me = this;
		return {
			left: me.paddingLeft || 0,
			top: me.paddingTop || 0,
			right: me.paddingRight || 0,
			bottom: me.paddingBottom || 0
		};
	}

	/**
	 * Returns the scale tick objects
	 * @return {Tick[]}
	 * @since 2.7
	 */
	getTicks() {
		return this.ticks;
	}

	/**
	 * @return {string[]}
	 */
	getLabels() {
		const data = this.chart.data;
		return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels || [];
	}

	// These methods are ordered by lifecycle. Utilities then follow.
	// Any function defined here is inherited by all scale types.
	// Any function can be extended by the scale type

	beforeUpdate() {
		call(this.options.beforeUpdate, [this]);
	}

	/**
	 * @param {number} maxWidth - the max width in pixels
	 * @param {number} maxHeight - the max height in pixels
	 * @param {{top: number, left: number, bottom: number, right: number}} margins - the space between the edge of the other scales and edge of the chart
	 *   This space comes from two sources:
	 *     - padding - space that's required to show the labels at the edges of the scale
	 *     - thickness of scales or legends in another orientation
	 */
	update(maxWidth, maxHeight, margins) {
		const me = this;
		const tickOpts = me.options.ticks;
		const sampleSize = tickOpts.sampleSize;

		// Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)
		me.beforeUpdate();

		// Absorb the master measurements
		me.maxWidth = maxWidth;
		me.maxHeight = maxHeight;
		me._margins = Object.assign({
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		}, margins);

		me.ticks = null;
		me._labelSizes = null;
		me._gridLineItems = null;
		me._labelItems = null;

		// Dimensions
		me.beforeSetDimensions();
		me.setDimensions();
		me.afterSetDimensions();

		// Data min/max
		me.beforeDataLimits();
		me.determineDataLimits();
		me.afterDataLimits();

		me.beforeBuildTicks();

		me.ticks = me.buildTicks() || [];

		// Allow modification of ticks in callback.
		me.afterBuildTicks();

		// Compute tick rotation and fit using a sampled subset of labels
		// We generally don't need to compute the size of every single label for determining scale size
		const samplingEnabled = sampleSize < me.ticks.length;
		me._convertTicksToLabels(samplingEnabled ? sample(me.ticks, sampleSize) : me.ticks);

		// configure is called twice, once here, once from core.controller.updateLayout.
		// Here we haven't been positioned yet, but dimensions are correct.
		// Variables set in configure are needed for calculateLabelRotation, and
		// it's ok that coordinates are not correct there, only dimensions matter.
		me.configure();

		// Tick Rotation
		me.beforeCalculateLabelRotation();
		me.calculateLabelRotation(); // Preconditions: number of ticks and sizes of largest labels must be calculated beforehand
		me.afterCalculateLabelRotation();

		me.beforeFit();
		me.fit(); // Preconditions: label rotation and label sizes must be calculated beforehand
		me.afterFit();

		// Auto-skip
		me.ticks = tickOpts.display && (tickOpts.autoSkip || tickOpts.source === 'auto') ? me._autoSkip(me.ticks) : me.ticks;

		if (samplingEnabled) {
			// Generate labels using all non-skipped ticks
			me._convertTicksToLabels(me.ticks);
		}

		// IMPORTANT: after this point, we consider that `this.ticks` will NEVER change!

		me.afterUpdate();
	}

	/**
	 * @protected
	 */
	configure() {
		const me = this;
		let reversePixels = me.options.reverse;
		let startPixel, endPixel;

		if (me.isHorizontal()) {
			startPixel = me.left;
			endPixel = me.right;
		} else {
			startPixel = me.top;
			endPixel = me.bottom;
			// by default vertical scales are from bottom to top, so pixels are reversed
			reversePixels = !reversePixels;
		}
		me._startPixel = startPixel;
		me._endPixel = endPixel;
		me._reversePixels = reversePixels;
		me._length = endPixel - startPixel;
	}

	afterUpdate() {
		call(this.options.afterUpdate, [this]);
	}

	//

	beforeSetDimensions() {
		call(this.options.beforeSetDimensions, [this]);
	}
	setDimensions() {
		const me = this;
		// Set the unconstrained dimension before label rotation
		if (me.isHorizontal()) {
			// Reset position before calculating rotation
			me.width = me.maxWidth;
			me.left = 0;
			me.right = me.width;
		} else {
			me.height = me.maxHeight;

			// Reset position before calculating rotation
			me.top = 0;
			me.bottom = me.height;
		}

		// Reset padding
		me.paddingLeft = 0;
		me.paddingTop = 0;
		me.paddingRight = 0;
		me.paddingBottom = 0;
	}
	afterSetDimensions() {
		call(this.options.afterSetDimensions, [this]);
	}

	// Data limits
	beforeDataLimits() {
		call(this.options.beforeDataLimits, [this]);
	}
	determineDataLimits() {}
	afterDataLimits() {
		call(this.options.afterDataLimits, [this]);
	}

	//
	beforeBuildTicks() {
		call(this.options.beforeBuildTicks, [this]);
	}
	/**
	 * @return {object[]} the ticks
	 */
	buildTicks() {
		return [];
	}
	afterBuildTicks() {
		call(this.options.afterBuildTicks, [this]);
	}

	beforeTickToLabelConversion() {
		call(this.options.beforeTickToLabelConversion, [this]);
	}
	/**
	 * Convert ticks to label strings
	 * @param {Tick[]} ticks
	 */
	generateTickLabels(ticks) {
		const me = this;
		const tickOpts = me.options.ticks;
		let i, ilen, tick;
		for (i = 0, ilen = ticks.length; i < ilen; i++) {
			tick = ticks[i];
			tick.label = call(tickOpts.callback, [tick.value, i, ticks], me);
		}
	}
	afterTickToLabelConversion() {
		call(this.options.afterTickToLabelConversion, [this]);
	}

	//

	beforeCalculateLabelRotation() {
		call(this.options.beforeCalculateLabelRotation, [this]);
	}
	calculateLabelRotation() {
		const me = this;
		const options = me.options;
		const tickOpts = options.ticks;
		const numTicks = me.ticks.length;
		const minRotation = tickOpts.minRotation || 0;
		const maxRotation = tickOpts.maxRotation;
		let labelRotation = minRotation;
		let tickWidth, maxHeight, maxLabelDiagonal;

		if (!me._isVisible() || !tickOpts.display || minRotation >= maxRotation || numTicks <= 1 || !me.isHorizontal()) {
			me.labelRotation = minRotation;
			return;
		}

		const labelSizes = me._getLabelSizes();
		const maxLabelWidth = labelSizes.widest.width;
		const maxLabelHeight = labelSizes.highest.height - labelSizes.highest.offset;

		// Estimate the width of each grid based on the canvas width, the maximum
		// label width and the number of tick intervals
		const maxWidth = Math.min(me.maxWidth, me.chart.width - maxLabelWidth);
		tickWidth = options.offset ? me.maxWidth / numTicks : maxWidth / (numTicks - 1);

		// Allow 3 pixels x2 padding either side for label readability
		if (maxLabelWidth + 6 > tickWidth) {
			tickWidth = maxWidth / (numTicks - (options.offset ? 0.5 : 1));
			maxHeight = me.maxHeight - getTickMarkLength(options.gridLines)
				- tickOpts.padding - getScaleLabelHeight(options.scaleLabel, me.chart.options.font);
			maxLabelDiagonal = Math.sqrt(maxLabelWidth * maxLabelWidth + maxLabelHeight * maxLabelHeight);
			labelRotation = toDegrees(Math.min(
				Math.asin(Math.min((labelSizes.highest.height + 6) / tickWidth, 1)),
				Math.asin(Math.min(maxHeight / maxLabelDiagonal, 1)) - Math.asin(maxLabelHeight / maxLabelDiagonal)
			));
			labelRotation = Math.max(minRotation, Math.min(maxRotation, labelRotation));
		}

		me.labelRotation = labelRotation;
	}
	afterCalculateLabelRotation() {
		call(this.options.afterCalculateLabelRotation, [this]);
	}

	//

	beforeFit() {
		call(this.options.beforeFit, [this]);
	}
	fit() {
		const me = this;
		// Reset
		const minSize = {
			width: 0,
			height: 0
		};

		const chart = me.chart;
		const opts = me.options;
		const tickOpts = opts.ticks;
		const scaleLabelOpts = opts.scaleLabel;
		const gridLineOpts = opts.gridLines;
		const display = me._isVisible();
		const labelsBelowTicks = opts.position !== 'top' && me.axis === 'x';
		const isHorizontal = me.isHorizontal();
		const scaleLabelHeight = display && getScaleLabelHeight(scaleLabelOpts, chart.options.font);

		// Width
		if (isHorizontal) {
			minSize.width = me.maxWidth;
		} else if (display) {
			minSize.width = getTickMarkLength(gridLineOpts) + scaleLabelHeight;
		}

		// height
		if (!isHorizontal) {
			minSize.height = me.maxHeight; // fill all the height
		} else if (display) {
			minSize.height = getTickMarkLength(gridLineOpts) + scaleLabelHeight;
		}

		// Don't bother fitting the ticks if we are not showing the labels
		if (tickOpts.display && display && me.ticks.length) {
			const labelSizes = me._getLabelSizes();
			const firstLabelSize = labelSizes.first;
			const lastLabelSize = labelSizes.last;
			const widestLabelSize = labelSizes.widest;
			const highestLabelSize = labelSizes.highest;
			const lineSpace = highestLabelSize.offset * 0.8;
			const tickPadding = tickOpts.padding;

			if (isHorizontal) {
				// A horizontal axis is more constrained by the height.
				const isRotated = me.labelRotation !== 0;
				const angleRadians = toRadians(me.labelRotation);
				const cosRotation = Math.cos(angleRadians);
				const sinRotation = Math.sin(angleRadians);

				const labelHeight = sinRotation * widestLabelSize.width
					+ cosRotation * (highestLabelSize.height - (isRotated ? highestLabelSize.offset : 0))
					+ (isRotated ? 0 : lineSpace); // padding

				minSize.height = Math.min(me.maxHeight, minSize.height + labelHeight + tickPadding);

				const offsetLeft = me.getPixelForTick(0) - me.left;
				const offsetRight = me.right - me.getPixelForTick(me.ticks.length - 1);
				let paddingLeft, paddingRight;

				// Ensure that our ticks are always inside the canvas. When rotated, ticks are right aligned
				// which means that the right padding is dominated by the font height
				if (isRotated) {
					paddingLeft = labelsBelowTicks ?
						cosRotation * firstLabelSize.width + sinRotation * firstLabelSize.offset :
						sinRotation * (firstLabelSize.height - firstLabelSize.offset);
					paddingRight = labelsBelowTicks ?
						sinRotation * (lastLabelSize.height - lastLabelSize.offset) :
						cosRotation * lastLabelSize.width + sinRotation * lastLabelSize.offset;
				} else if (tickOpts.align === 'start') {
					paddingLeft = 0;
					paddingRight = lastLabelSize.width;
				} else if (tickOpts.align === 'end') {
					paddingLeft = firstLabelSize.width;
					paddingRight = 0;
				} else {
					paddingLeft = firstLabelSize.width / 2;
					paddingRight = lastLabelSize.width / 2;
				}

				// Adjust padding taking into account changes in offsets
				// and add 3 px to move away from canvas edges
				me.paddingLeft = Math.max((paddingLeft - offsetLeft) * me.width / (me.width - offsetLeft), 0) + 3;
				me.paddingRight = Math.max((paddingRight - offsetRight) * me.width / (me.width - offsetRight), 0) + 3;
			} else {
				// A vertical axis is more constrained by the width. Labels are the
				// dominant factor here, so get that length first and account for padding
				const labelWidth = tickOpts.mirror ? 0 :
					// use lineSpace for consistency with horizontal axis
					// tickPadding is not implemented for horizontal
					widestLabelSize.width + tickPadding + lineSpace;

				minSize.width = Math.min(me.maxWidth, minSize.width + labelWidth);

				let paddingTop = lastLabelSize.height / 2;
				let paddingBottom = firstLabelSize.height / 2;

				if (tickOpts.align === 'start') {
					paddingTop = 0;
					paddingBottom = firstLabelSize.height;
				} else if (tickOpts.align === 'end') {
					paddingTop = lastLabelSize.height;
					paddingBottom = 0;
				}

				me.paddingTop = paddingTop;
				me.paddingBottom = paddingBottom;
			}
		}

		me._handleMargins();

		if (isHorizontal) {
			me.width = me._length = chart.width - me._margins.left - me._margins.right;
			me.height = minSize.height;
		} else {
			me.width = minSize.width;
			me.height = me._length = chart.height - me._margins.top - me._margins.bottom;
		}
	}

	/**
	 * Handle margins and padding interactions
	 * @private
	 */
	_handleMargins() {
		const me = this;
		if (me._margins) {
			me._margins.left = Math.max(me.paddingLeft, me._margins.left);
			me._margins.top = Math.max(me.paddingTop, me._margins.top);
			me._margins.right = Math.max(me.paddingRight, me._margins.right);
			me._margins.bottom = Math.max(me.paddingBottom, me._margins.bottom);
		}
	}

	afterFit() {
		call(this.options.afterFit, [this]);
	}

	// Shared Methods
	/**
	 * @return {boolean}
	 */
	isHorizontal() {
		const {axis, position} = this.options;
		return position === 'top' || position === 'bottom' || axis === 'x';
	}
	/**
	 * @return {boolean}
	 */
	isFullWidth() {
		return this.options.fullWidth;
	}

	/**
	 * @param {Tick[]} ticks
	 * @private
	 */
	_convertTicksToLabels(ticks) {
		const me = this;

		me.beforeTickToLabelConversion();

		me.generateTickLabels(ticks);

		me.afterTickToLabelConversion();
	}

	/**
	 * @return {{ first: object, last: object, widest: object, highest: object }}
	 * @private
	 */
	_getLabelSizes() {
		const me = this;
		let labelSizes = me._labelSizes;

		if (!labelSizes) {
			me._labelSizes = labelSizes = me._computeLabelSizes();
		}

		return labelSizes;
	}

	/**
	 * Returns {width, height, offset} objects for the first, last, widest, highest tick
	 * labels where offset indicates the anchor point offset from the top in pixels.
	 * @return {{ first: object, last: object, widest: object, highest: object }}
	 * @private
	 */
	_computeLabelSizes() {
		const me = this;
		const ctx = me.ctx;
		const caches = me._longestTextCache;
		const sampleSize = me.options.ticks.sampleSize;
		const widths = [];
		const heights = [];
		const offsets = [];
		let widestLabelSize = 0;
		let highestLabelSize = 0;
		let ticks = me.ticks;
		if (sampleSize < ticks.length) {
			ticks = sample(ticks, sampleSize);
		}
		const length = ticks.length;
		let i, j, jlen, label, tickFont, fontString, cache, lineHeight, width, height, nestedLabel;

		for (i = 0; i < length; ++i) {
			label = ticks[i].label;
			tickFont = me._resolveTickFontOptions(i);
			ctx.font = fontString = tickFont.string;
			cache = caches[fontString] = caches[fontString] || {data: {}, gc: []};
			lineHeight = tickFont.lineHeight;
			width = height = 0;
			// Undefined labels and arrays should not be measured
			if (!isNullOrUndef(label) && !isArray(label)) {
				width = _measureText(ctx, cache.data, cache.gc, width, label);
				height = lineHeight;
			} else if (isArray(label)) {
				// if it is an array let's measure each element
				for (j = 0, jlen = label.length; j < jlen; ++j) {
					nestedLabel = label[j];
					// Undefined labels and arrays should not be measured
					if (!isNullOrUndef(nestedLabel) && !isArray(nestedLabel)) {
						width = _measureText(ctx, cache.data, cache.gc, width, nestedLabel);
						height += lineHeight;
					}
				}
			}
			widths.push(width);
			heights.push(height);
			offsets.push(lineHeight / 2);
			widestLabelSize = Math.max(width, widestLabelSize);
			highestLabelSize = Math.max(height, highestLabelSize);
		}
		garbageCollect(caches, length);

		const widest = widths.indexOf(widestLabelSize);
		const highest = heights.indexOf(highestLabelSize);

		function valueAt(idx) {
			return {
				width: widths[idx] || 0,
				height: heights[idx] || 0,
				offset: offsets[idx] || 0
			};
		}

		return {
			first: valueAt(0),
			last: valueAt(length - 1),
			widest: valueAt(widest),
			highest: valueAt(highest)
		};
	}

	/**
	 * Used to get the label to display in the tooltip for the given value
	 * @param {*} value
	 * @return {string}
	 */
	getLabelForValue(value) {
		return value;
	}

	/**
	 * Returns the location of the given data point. Value can either be an index or a numerical value
	 * The coordinate (0, 0) is at the upper-left corner of the canvas
	 * @param {*} value
	 * @param {number} [index]
	 * @return {number}
	 */
	getPixelForValue(value, index) { // eslint-disable-line no-unused-vars
		return NaN;
	}

	/**
	 * Used to get the data value from a given pixel. This is the inverse of getPixelForValue
	 * The coordinate (0, 0) is at the upper-left corner of the canvas
	 * @param {number} pixel
	 * @return {*}
	 */
	getValueForPixel(pixel) {} // eslint-disable-line no-unused-vars

	/**
	 * Returns the location of the tick at the given index
	 * The coordinate (0, 0) is at the upper-left corner of the canvas
	 * @param {number} index
	 * @return {number}
	 */
	getPixelForTick(index) {
		const ticks = this.ticks;
		if (index < 0 || index > ticks.length - 1) {
			return null;
		}
		return this.getPixelForValue(ticks[index].value);
	}

	/**
	 * Utility for getting the pixel location of a percentage of scale
	 * The coordinate (0, 0) is at the upper-left corner of the canvas
	 * @param {number} decimal
	 * @return {number}
	 */
	getPixelForDecimal(decimal) {
		const me = this;

		if (me._reversePixels) {
			decimal = 1 - decimal;
		}

		return _int16Range(me._startPixel + decimal * me._length);
	}

	/**
	 * @param {number} pixel
	 * @return {number}
	 */
	getDecimalForPixel(pixel) {
		const decimal = (pixel - this._startPixel) / this._length;
		return this._reversePixels ? 1 - decimal : decimal;
	}

	/**
	 * Returns the pixel for the minimum chart value
	 * The coordinate (0, 0) is at the upper-left corner of the canvas
	 * @return {number}
	 */
	getBasePixel() {
		return this.getPixelForValue(this.getBaseValue());
	}

	/**
	 * @return {number}
	 */
	getBaseValue() {
		const {min, max} = this;

		return min < 0 && max < 0 ? max :
			min > 0 && max > 0 ? min :
			0;
	}

	/**
	 * @protected
	 */
	getContext(index) {
		const me = this;
		const ticks = me.ticks || [];

		if (index >= 0 && index < ticks.length) {
			const tick = ticks[index];
			return tick.$context ||
				(tick.$context = createTickContext(me.getContext(), index, tick));
		}
		return me.$context ||
			(me.$context = createScaleContext(me.chart.getContext(), me));
	}

	/**
	 * Returns a subset of ticks to be plotted to avoid overlapping labels.
	 * @param {Tick[]} ticks
	 * @return {Tick[]}
	 * @private
	 */
	_autoSkip(ticks) {
		const me = this;
		const tickOpts = me.options.ticks;
		const ticksLimit = tickOpts.maxTicksLimit || me._length / me._tickSize();
		const majorIndices = tickOpts.major.enabled ? getMajorIndices(ticks) : [];
		const numMajorIndices = majorIndices.length;
		const first = majorIndices[0];
		const last = majorIndices[numMajorIndices - 1];
		const newTicks = [];

		// If there are too many major ticks to display them all
		if (numMajorIndices > ticksLimit) {
			skipMajors(ticks, newTicks, majorIndices, numMajorIndices / ticksLimit);
			return newTicks;
		}

		const spacing = calculateSpacing(majorIndices, ticks, ticksLimit);

		if (numMajorIndices > 0) {
			let i, ilen;
			const avgMajorSpacing = numMajorIndices > 1 ? Math.round((last - first) / (numMajorIndices - 1)) : null;
			skip(ticks, newTicks, spacing, isNullOrUndef(avgMajorSpacing) ? 0 : first - avgMajorSpacing, first);
			for (i = 0, ilen = numMajorIndices - 1; i < ilen; i++) {
				skip(ticks, newTicks, spacing, majorIndices[i], majorIndices[i + 1]);
			}
			skip(ticks, newTicks, spacing, last, isNullOrUndef(avgMajorSpacing) ? ticks.length : last + avgMajorSpacing);
			return newTicks;
		}
		skip(ticks, newTicks, spacing);
		return newTicks;
	}

	/**
	 * @return {number}
	 * @private
	 */
	_tickSize() {
		const me = this;
		const optionTicks = me.options.ticks;

		// Calculate space needed by label in axis direction.
		const rot = toRadians(me.labelRotation);
		const cos = Math.abs(Math.cos(rot));
		const sin = Math.abs(Math.sin(rot));

		const labelSizes = me._getLabelSizes();
		const padding = optionTicks.autoSkipPadding || 0;
		const w = labelSizes ? labelSizes.widest.width + padding : 0;
		const h = labelSizes ? labelSizes.highest.height + padding : 0;

		// Calculate space needed for 1 tick in axis direction.
		return me.isHorizontal()
			? h * cos > w * sin ? w / cos : h / sin
			: h * sin < w * cos ? h / cos : w / sin;
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_isVisible() {
		const display = this.options.display;

		if (display !== 'auto') {
			return !!display;
		}

		return this.getMatchingVisibleMetas().length > 0;
	}

	/**
	 * @private
	 */
	_computeGridLineItems(chartArea) {
		const me = this;
		const axis = me.axis;
		const chart = me.chart;
		const options = me.options;
		const {gridLines, position} = options;
		const offsetGridLines = gridLines.offsetGridLines;
		const isHorizontal = me.isHorizontal();
		const ticks = me.ticks;
		const ticksLength = ticks.length + (offsetGridLines ? 1 : 0);
		const tl = getTickMarkLength(gridLines);
		const items = [];

		let context = this.getContext(0);
		const axisWidth = gridLines.drawBorder ? resolve([gridLines.borderWidth, gridLines.lineWidth, 0], context, 0) : 0;
		const axisHalfWidth = axisWidth / 2;
		const alignBorderValue = function(pixel) {
			return _alignPixel(chart, pixel, axisWidth);
		};
		let borderValue, i, lineValue, alignedLineValue;
		let tx1, ty1, tx2, ty2, x1, y1, x2, y2;

		if (position === 'top') {
			borderValue = alignBorderValue(me.bottom);
			ty1 = me.bottom - tl;
			ty2 = borderValue - axisHalfWidth;
			y1 = alignBorderValue(chartArea.top) + axisHalfWidth;
			y2 = chartArea.bottom;
		} else if (position === 'bottom') {
			borderValue = alignBorderValue(me.top);
			y1 = chartArea.top;
			y2 = alignBorderValue(chartArea.bottom) - axisHalfWidth;
			ty1 = borderValue + axisHalfWidth;
			ty2 = me.top + tl;
		} else if (position === 'left') {
			borderValue = alignBorderValue(me.right);
			tx1 = me.right - tl;
			tx2 = borderValue - axisHalfWidth;
			x1 = alignBorderValue(chartArea.left) + axisHalfWidth;
			x2 = chartArea.right;
		} else if (position === 'right') {
			borderValue = alignBorderValue(me.left);
			x1 = chartArea.left;
			x2 = alignBorderValue(chartArea.right) - axisHalfWidth;
			tx1 = borderValue + axisHalfWidth;
			tx2 = me.left + tl;
		} else if (axis === 'x') {
			if (position === 'center') {
				borderValue = alignBorderValue((chartArea.top + chartArea.bottom) / 2);
			} else if (isObject(position)) {
				const positionAxisID = Object.keys(position)[0];
				const value = position[positionAxisID];
				borderValue = alignBorderValue(me.chart.scales[positionAxisID].getPixelForValue(value));
			}

			y1 = chartArea.top;
			y2 = chartArea.bottom;
			ty1 = borderValue + axisHalfWidth;
			ty2 = ty1 + tl;
		} else if (axis === 'y') {
			if (position === 'center') {
				borderValue = alignBorderValue((chartArea.left + chartArea.right) / 2);
			} else if (isObject(position)) {
				const positionAxisID = Object.keys(position)[0];
				const value = position[positionAxisID];
				borderValue = alignBorderValue(me.chart.scales[positionAxisID].getPixelForValue(value));
			}

			tx1 = borderValue - axisHalfWidth;
			tx2 = tx1 - tl;
			x1 = chartArea.left;
			x2 = chartArea.right;
		}

		let previousLineValue = -1;
		for (i = 0; i < ticksLength; ++i) {
			context = this.getContext(i);

			const lineWidth = resolve([gridLines.lineWidth], context, i);
			const lineColor = resolve([gridLines.color], context, i);
			const borderDash = gridLines.borderDash || [];
			const borderDashOffset = resolve([gridLines.borderDashOffset], context, i);

			lineValue = getPixelForGridLine(me, i, offsetGridLines);

			// Skip if the pixel is out of the range
			if (lineValue === undefined) {
				continue;
			}

			let lineDistance = 0;
			if (gridLines.linesBetweenTicks !== 0) {
				lineDistance = (lineValue - previousLineValue) / (gridLines.linesBetweenTicks + 1);
			}
			let j;
			// Store all gridlines in the items array
			for (j = 0; j <= gridLines.linesBetweenTicks; ++j) {
				const calculatedLineValue = lineValue - (j * lineDistance);
				const selectedLineWidth = (j >= 1 ? gridLines.linesBetweenTicksWidth : lineWidth);

				alignedLineValue = _alignPixel(chart, calculatedLineValue, selectedLineWidth);

				if (isHorizontal) {
					tx1 = tx2 = x1 = x2 = alignedLineValue;
				} else {
					ty1 = ty2 = y1 = y2 = alignedLineValue;
				}

				items.push({
					tx1,
					ty1,
					tx2,
					ty2,
					x1,
					y1,
					x2,
					y2,
					width: selectedLineWidth,
					color: lineColor,
					borderDash,
					borderDashOffset,
				});
				if (previousLineValue === -1) {
					break;
				}
			}
			previousLineValue = lineValue;
		}

		me._ticksLength = ticksLength;
		me._borderValue = borderValue;

		return items;
	}

	/**
	 * @private
	 */
	_computeLabelItems(chartArea) {
		const me = this;
		const axis = me.axis;
		const options = me.options;
		const {position, ticks: optionTicks} = options;
		const isHorizontal = me.isHorizontal();
		const ticks = me.ticks;
		const {align, crossAlign, padding} = optionTicks;
		const tl = getTickMarkLength(options.gridLines);
		const tickAndPadding = tl + padding;
		const rotation = -toRadians(me.labelRotation);
		const items = [];
		let i, ilen, tick, label, x, y, textAlign, pixel, font, lineHeight, lineCount, textOffset;
		let textBaseline = 'middle';

		if (position === 'top') {
			y = me.bottom - tickAndPadding;
			textAlign = me._getXAxisLabelAlignment();
		} else if (position === 'bottom') {
			y = me.top + tickAndPadding;
			textAlign = me._getXAxisLabelAlignment();
		} else if (position === 'left') {
			const ret = this._getYAxisLabelAlignment(tl);
			textAlign = ret.textAlign;
			x = ret.x;
		} else if (position === 'right') {
			const ret = this._getYAxisLabelAlignment(tl);
			textAlign = ret.textAlign;
			x = ret.x;
		} else if (axis === 'x') {
			if (position === 'center') {
				y = ((chartArea.top + chartArea.bottom) / 2) + tickAndPadding;
			} else if (isObject(position)) {
				const positionAxisID = Object.keys(position)[0];
				const value = position[positionAxisID];
				y = me.chart.scales[positionAxisID].getPixelForValue(value) + tickAndPadding;
			}
			textAlign = me._getXAxisLabelAlignment();
		} else if (axis === 'y') {
			if (position === 'center') {
				x = ((chartArea.left + chartArea.right) / 2) - tickAndPadding;
			} else if (isObject(position)) {
				const positionAxisID = Object.keys(position)[0];
				const value = position[positionAxisID];
				x = me.chart.scales[positionAxisID].getPixelForValue(value);
			}
			textAlign = this._getYAxisLabelAlignment(tl).textAlign;
		}

		if (axis === 'y') {
			if (align === 'start') {
				textBaseline = 'top';
			} else if (align === 'end') {
				textBaseline = 'bottom';
			}
		}

		const labelSizes = me._getLabelSizes();
		for (i = 0, ilen = ticks.length; i < ilen; ++i) {
			tick = ticks[i];
			label = tick.label;

			pixel = me.getPixelForTick(i) + optionTicks.labelOffset;
			font = me._resolveTickFontOptions(i);
			lineHeight = font.lineHeight;
			lineCount = isArray(label) ? label.length : 1;
			const halfCount = lineCount / 2;

			if (isHorizontal) {
				x = pixel;
				if (position === 'top') {
					if (crossAlign === 'near' || rotation !== 0) {
						textOffset = (Math.sin(rotation) * halfCount + 0.5) * lineHeight;
						textOffset -= (rotation === 0 ? (lineCount - 0.5) : Math.cos(rotation) * halfCount) * lineHeight;
					} else if (crossAlign === 'center') {
						textOffset = -1 * (labelSizes.highest.height / 2);
						textOffset -= halfCount * lineHeight;
					} else {
						textOffset = (-1 * labelSizes.highest.height) + (0.5 * lineHeight);
					}
				} else if (position === 'bottom') {
					if (crossAlign === 'near' || rotation !== 0) {
						textOffset = Math.sin(rotation) * halfCount * lineHeight;
						textOffset += (rotation === 0 ? 0.5 : Math.cos(rotation) * halfCount) * lineHeight;
					} else if (crossAlign === 'center') {
						textOffset = labelSizes.highest.height / 2;
						textOffset -= halfCount * lineHeight;
					} else {
						textOffset = labelSizes.highest.height - ((lineCount - 0.5) * lineHeight);
					}
				}
			} else {
				y = pixel;
				textOffset = (1 - lineCount) * lineHeight / 2;
			}

			items.push({
				x,
				y,
				rotation,
				label,
				font,
				textOffset,
				textAlign,
				textBaseline,
			});
		}

		return items;
	}

	_getXAxisLabelAlignment() {
		const me = this;
		const {position, ticks} = me.options;
		const rotation = -toRadians(me.labelRotation);

		if (rotation) {
			return position === 'top' ? 'left' : 'right';
		}

		let align = 'center';

		if (ticks.align === 'start') {
			align = 'left';
		} else if (ticks.align === 'end') {
			align = 'right';
		}

		return align;
	}

	_getYAxisLabelAlignment(tl) {
		const me = this;
		const {position, ticks} = me.options;
		const {crossAlign, mirror, padding} = ticks;
		const labelSizes = me._getLabelSizes();
		const tickAndPadding = tl + padding;
		const widest = labelSizes.widest.width;

		let textAlign;
		let x;

		if (position === 'left') {
			if (mirror) {
				textAlign = 'left';
				x = me.right - padding;
			} else {
				x = me.right - tickAndPadding;

				if (crossAlign === 'near') {
					textAlign = 'right';
				} else if (crossAlign === 'center') {
					textAlign = 'center';
					x -= (widest / 2);
				} else {
					textAlign = 'left';
					x -= widest;
				}
			}
		} else if (position === 'right') {
			if (mirror) {
				textAlign = 'right';
				x = me.left + padding;
			} else {
				x = me.left + tickAndPadding;

				if (crossAlign === 'near') {
					textAlign = 'left';
				} else if (crossAlign === 'center') {
					textAlign = 'center';
					x += widest / 2;
				} else {
					textAlign = 'right';
					x += widest;
				}
			}
		} else {
			textAlign = 'right';
		}

		return {textAlign, x};
	}

	/**
	 * @protected
	 */
	drawGrid(chartArea) {
		const me = this;
		const gridLines = me.options.gridLines;
		const ctx = me.ctx;
		const chart = me.chart;
		let context = me.getContext(0);
		const axisWidth = gridLines.drawBorder ? resolve([gridLines.borderWidth, gridLines.lineWidth, 0], context, 0) : 0;
		const items = me._gridLineItems || (me._gridLineItems = me._computeGridLineItems(chartArea));
		let i, ilen;

		if (gridLines.display) {
			for (i = 0, ilen = items.length; i < ilen; ++i) {
				const item = items[i];
				const width = item.width;
				const color = item.color;

				if (width && color) {
					ctx.save();
					ctx.lineWidth = width;
					ctx.strokeStyle = color;
					if (ctx.setLineDash) {
						ctx.setLineDash(item.borderDash);
						ctx.lineDashOffset = item.borderDashOffset;
					}

					ctx.beginPath();

					if (gridLines.drawTicks) {
						ctx.moveTo(item.tx1, item.ty1);
						ctx.lineTo(item.tx2, item.ty2);
					}

					if (gridLines.drawOnChartArea) {
						ctx.moveTo(item.x1, item.y1);
						ctx.lineTo(item.x2, item.y2);
					}

					ctx.stroke();
					ctx.restore();
				}
			}
		}

		if (axisWidth) {
			// Draw the line at the edge of the axis
			const firstLineWidth = axisWidth;
			context = me.getContext(me._ticksLength - 1);
			const lastLineWidth = resolve([gridLines.lineWidth, 1], context, me._ticksLength - 1);
			const borderValue = me._borderValue;
			let x1, x2, y1, y2;

			if (me.isHorizontal()) {
				x1 = _alignPixel(chart, me.left, firstLineWidth) - firstLineWidth / 2;
				x2 = _alignPixel(chart, me.right, lastLineWidth) + lastLineWidth / 2;
				y1 = y2 = borderValue;
			} else {
				y1 = _alignPixel(chart, me.top, firstLineWidth) - firstLineWidth / 2;
				y2 = _alignPixel(chart, me.bottom, lastLineWidth) + lastLineWidth / 2;
				x1 = x2 = borderValue;
			}

			ctx.lineWidth = axisWidth;
			ctx.strokeStyle = resolve([gridLines.borderColor, gridLines.color], context, 0);
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		}
	}

	/**
	 * @protected
	 */
	drawLabels(chartArea) {
		const me = this;
		const optionTicks = me.options.ticks;

		if (!optionTicks.display) {
			return;
		}

		const ctx = me.ctx;
		const items = me._labelItems || (me._labelItems = me._computeLabelItems(chartArea));
		let i, j, ilen, jlen;

		for (i = 0, ilen = items.length; i < ilen; ++i) {
			const item = items[i];
			const tickFont = item.font;
			const useStroke = tickFont.lineWidth > 0 && tickFont.strokeStyle !== '';

			// Make sure we draw text in the correct color and font
			ctx.save();
			ctx.translate(item.x, item.y);
			ctx.rotate(item.rotation);
			ctx.font = tickFont.string;
			ctx.fillStyle = tickFont.color;
			ctx.textAlign = item.textAlign;
			ctx.textBaseline = item.textBaseline;

			if (useStroke) {
				ctx.strokeStyle = tickFont.strokeStyle;
				ctx.lineWidth = tickFont.lineWidth;
			}

			const label = item.label;
			let y = item.textOffset;
			if (isArray(label)) {
				for (j = 0, jlen = label.length; j < jlen; ++j) {
					// We just make sure the multiline element is a string here..
					if (useStroke) {
						ctx.strokeText('' + label[j], 0, y);
					}
					ctx.fillText('' + label[j], 0, y);
					y += tickFont.lineHeight;
				}
			} else {
				if (useStroke) {
					ctx.strokeText(label, 0, y);
				}
				ctx.fillText(label, 0, y);
			}
			ctx.restore();
		}
	}

	/**
	 * @protected
	 */
	drawTitle(chartArea) { // eslint-disable-line no-unused-vars
		const me = this;
		const ctx = me.ctx;
		const options = me.options;
		const scaleLabel = options.scaleLabel;

		if (!scaleLabel.display) {
			return;
		}

		const scaleLabelFont = toFont(scaleLabel.font, me.chart.options.font);
		const scaleLabelPadding = toPadding(scaleLabel.padding);
		const halfLineHeight = scaleLabelFont.lineHeight / 2;
		const scaleLabelAlign = scaleLabel.align;
		const position = options.position;
		const isReverse = me.options.reverse;
		let rotation = 0;
		/** @type CanvasTextAlign */
		let textAlign;
		let scaleLabelX, scaleLabelY;

		if (me.isHorizontal()) {
			switch (scaleLabelAlign) {
			case 'start':
				scaleLabelX = me.left + (isReverse ? me.width : 0);
				textAlign = isReverse ? 'right' : 'left';
				break;
			case 'end':
				scaleLabelX = me.left + (isReverse ? 0 : me.width);
				textAlign = isReverse ? 'left' : 'right';
				break;
			default:
				scaleLabelX = me.left + me.width / 2;
				textAlign = 'center';
			}
			scaleLabelY = position === 'top'
				? me.top + halfLineHeight + scaleLabelPadding.top
				: me.bottom - halfLineHeight - scaleLabelPadding.bottom;
		} else {
			const isLeft = position === 'left';
			scaleLabelX = isLeft
				? me.left + halfLineHeight + scaleLabelPadding.top
				: me.right - halfLineHeight - scaleLabelPadding.top;
			switch (scaleLabelAlign) {
			case 'start':
				scaleLabelY = me.top + (isReverse ? 0 : me.height);
				textAlign = isReverse === isLeft ? 'right' : 'left';
				break;
			case 'end':
				scaleLabelY = me.top + (isReverse ? me.height : 0);
				textAlign = isReverse === isLeft ? 'left' : 'right';
				break;
			default:
				scaleLabelY = me.top + me.height / 2;
				textAlign = 'center';
			}
			rotation = isLeft ? -HALF_PI : HALF_PI;
		}

		ctx.save();
		ctx.translate(scaleLabelX, scaleLabelY);
		ctx.rotate(rotation);
		ctx.textAlign = textAlign;
		ctx.textBaseline = 'middle';
		ctx.fillStyle = scaleLabelFont.color;
		ctx.font = scaleLabelFont.string;
		ctx.fillText(scaleLabel.labelString, 0, 0);
		ctx.restore();
	}

	draw(chartArea) {
		const me = this;

		if (!me._isVisible()) {
			return;
		}

		me.drawGrid(chartArea);
		me.drawTitle();
		me.drawLabels(chartArea);
	}

	/**
	 * @return {object[]}
	 * @private
	 */
	_layers() {
		const me = this;
		const opts = me.options;
		const tz = opts.ticks && opts.ticks.z || 0;
		const gz = opts.gridLines && opts.gridLines.z || 0;

		if (!me._isVisible() || tz === gz || me.draw !== me._draw) {
			// backward compatibility: draw has been overridden by custom scale
			return [{
				z: tz,
				draw(chartArea) {
					me.draw(chartArea);
				}
			}];
		}

		return [{
			z: gz,
			draw(chartArea) {
				me.drawGrid(chartArea);
				me.drawTitle();
			}
		}, {
			z: tz,
			draw(chartArea) {
				me.drawLabels(chartArea);
			}
		}];
	}

	/**
	 * Returns visible dataset metas that are attached to this scale
	 * @param {string} [type] - if specified, also filter by dataset type
	 * @return {object[]}
	 */
	getMatchingVisibleMetas(type) {
		const me = this;
		const metas = me.chart.getSortedVisibleDatasetMetas();
		const axisID = me.axis + 'AxisID';
		const result = [];
		let i, ilen;

		for (i = 0, ilen = metas.length; i < ilen; ++i) {
			const meta = metas[i];
			if (meta[axisID] === me.id && (!type || meta.type === type)) {
				result.push(meta);
			}
		}
		return result;
	}

	/**
	 * @param {number} index
	 * @return {object}
	 * @protected
 	 */
	_resolveTickFontOptions(index) {
		const me = this;
		const chart = me.chart;
		const options = me.options.ticks;
		const context = me.getContext(index);
		return toFont(resolve([options.font], context), chart.options.font);
	}
}

Scale.prototype._draw = Scale.prototype.draw;
