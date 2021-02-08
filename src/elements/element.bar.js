import Element from '../core/core.element';
import {toTRBL, toTRBLCorners} from '../helpers/helpers.options';
import {PI, HALF_PI} from '../helpers/helpers.math';

/**
 * Helper function to get the bounds of the bar regardless of the orientation
 * @param {BarElement} bar the bar
 * @param {boolean} [useFinalPosition]
 * @return {object} bounds of the bar
 * @private
 */
function getBarBounds(bar, useFinalPosition) {
	const {x, y, base, width, height} = bar.getProps(['x', 'y', 'base', 'width', 'height'], useFinalPosition);

	let left, right, top, bottom, half;

	if (bar.horizontal) {
		half = height / 2;
		left = Math.min(x, base);
		right = Math.max(x, base);
		top = y - half;
		bottom = y + half;
	} else {
		half = width / 2;
		left = x - half;
		right = x + half;
		top = Math.min(y, base);
		bottom = Math.max(y, base);
	}

	return {left, top, right, bottom};
}

function parseBorderSkipped(bar) {
	let edge = bar.options.borderSkipped;
	const res = {};

	if (!edge) {
		return res;
	}

	edge = bar.horizontal
		? parseEdge(edge, 'left', 'right', bar.base > bar.x)
		: parseEdge(edge, 'bottom', 'top', bar.base < bar.y);

	res[edge] = true;
	return res;
}

function parseEdge(edge, a, b, reverse) {
	if (reverse) {
		edge = swap(edge, a, b);
		edge = startEnd(edge, b, a);
	} else {
		edge = startEnd(edge, a, b);
	}
	return edge;
}

function swap(orig, v1, v2) {
	return orig === v1 ? v2 : orig === v2 ? v1 : orig;
}

function startEnd(v, start, end) {
	return v === 'start' ? start : v === 'end' ? end : v;
}

function skipOrLimit(skip, value, min, max) {
	return skip ? 0 : Math.max(Math.min(value, max), min);
}

function parseBorderWidth(bar, maxW, maxH) {
	const value = bar.options.borderWidth;
	const skip = parseBorderSkipped(bar);
	const o = toTRBL(value);

	return {
		t: skipOrLimit(skip.top, o.top, 0, maxH),
		r: skipOrLimit(skip.right, o.right, 0, maxW),
		b: skipOrLimit(skip.bottom, o.bottom, 0, maxH),
		l: skipOrLimit(skip.left, o.left, 0, maxW)
	};
}

function parseBorderRadius(bar, maxW, maxH) {
	const value = bar.options.borderRadius;
	const maxR = Math.min(maxW, maxH);
	const o = toTRBLCorners(value, maxR * 2);
	const skip = parseBorderSkipped(bar);

	return {
		topLeft: skipOrLimit(skip.top || skip.left, o.topLeft, 0, maxR),
		topRight: skipOrLimit(skip.top || skip.right, o.topRight, 0, maxR),
		bottomLeft: skipOrLimit(skip.bottom || skip.left, o.bottomLeft, 0, maxR),
		bottomRight: skipOrLimit(skip.bottom || skip.right, o.bottomRight, 0, maxR)
	};
}

function boundingRects(bar) {
	const bounds = getBarBounds(bar);
	const width = bounds.right - bounds.left;
	const height = bounds.bottom - bounds.top;
	const border = parseBorderWidth(bar, width / 2, height / 2);
	const radius = parseBorderRadius(bar, width / 2, height / 2);

	return {
		outer: {
			x: bounds.left,
			y: bounds.top,
			w: width,
			h: height,
			radius
		},
		inner: {
			x: bounds.left + border.l,
			y: bounds.top + border.t,
			w: width - border.l - border.r,
			h: height - border.t - border.b,
			radius: {
				topLeft: Math.max(0, radius.topLeft - Math.max(border.t, border.l)),
				topRight: Math.max(0, radius.topRight - Math.max(border.t, border.r)),
				bottomLeft: Math.max(0, radius.bottomLeft - Math.max(border.b, border.l)),
				bottomRight: Math.max(0, radius.bottomRight - Math.max(border.b, border.r)),
			}
		}
	};
}

function inRange(bar, x, y, useFinalPosition) {
	const skipX = x === null;
	const skipY = y === null;
	const skipBoth = skipX && skipY;
	const bounds = bar && !skipBoth && getBarBounds(bar, useFinalPosition);

	return bounds
		&& (skipX || x >= bounds.left && x <= bounds.right)
		&& (skipY || y >= bounds.top && y <= bounds.bottom);
}

function hasRadius(radius) {
	return radius.topLeft || radius.topRight || radius.bottomLeft || radius.bottomRight;
}

/**
 * Add a path of a rectangle with rounded corners to the current sub-path
 * @param {CanvasRenderingContext2D} ctx Context
 * @param {*} rect Bounding rect
 */
function addRoundedRectPath(ctx, rect) {
	const {x, y, w, h, radius} = rect;

	// top left arc
	ctx.arc(x + radius.topLeft, y + radius.topLeft, radius.topLeft, -HALF_PI, PI, true);

	// line from top left to bottom left
	ctx.lineTo(x, y + h - radius.bottomLeft);

	// bottom left arc
	ctx.arc(x + radius.bottomLeft, y + h - radius.bottomLeft, radius.bottomLeft, PI, HALF_PI, true);

	// line from bottom left to bottom right
	ctx.lineTo(x + w - radius.bottomRight, y + h);

	// bottom right arc
	ctx.arc(x + w - radius.bottomRight, y + h - radius.bottomRight, radius.bottomRight, HALF_PI, 0, true);

	// line from bottom right to top right
	ctx.lineTo(x + w, y + radius.topRight);

	// top right arc
	ctx.arc(x + w - radius.topRight, y + radius.topRight, radius.topRight, 0, -HALF_PI, true);

	// line from top right to top left
	ctx.lineTo(x + radius.topLeft, y);
}

/**
 * Add a path of a rectangle to the current sub-path
 * @param {CanvasRenderingContext2D} ctx Context
 * @param {*} rect Bounding rect
 */
function addNormalRectPath(ctx, rect) {
	ctx.rect(rect.x, rect.y, rect.w, rect.h);
}

export default class BarElement extends Element {

	constructor(cfg) {
		super();

		this.options = undefined;
		this.horizontal = undefined;
		this.base = undefined;
		this.width = undefined;
		this.height = undefined;

		if (cfg) {
			Object.assign(this, cfg);
		}
	}

	draw(ctx) {
		const options = this.options;
		const {inner, outer} = boundingRects(this);
		const addRectPath = hasRadius(outer.radius) ? addRoundedRectPath : addNormalRectPath;

		ctx.save();

		if (outer.w !== inner.w || outer.h !== inner.h) {
			ctx.beginPath();
			addRectPath(ctx, outer);
			ctx.clip();
			addRectPath(ctx, inner);
			ctx.fillStyle = options.borderColor;
			ctx.fill('evenodd');
		}

		ctx.beginPath();
		addRectPath(ctx, inner);
		ctx.fillStyle = options.backgroundColor;
		ctx.fill();

		ctx.restore();
	}

	inRange(mouseX, mouseY, useFinalPosition) {
		return inRange(this, mouseX, mouseY, useFinalPosition);
	}

	inXRange(mouseX, useFinalPosition) {
		return inRange(this, mouseX, null, useFinalPosition);
	}

	inYRange(mouseY, useFinalPosition) {
		return inRange(this, null, mouseY, useFinalPosition);
	}

	getCenterPoint(useFinalPosition) {
		const {x, y, base, horizontal} = this.getProps(['x', 'y', 'base', 'horizontal'], useFinalPosition);
		return {
			x: horizontal ? (x + base) / 2 : x,
			y: horizontal ? y : (y + base) / 2
		};
	}

	getRange(axis) {
		return axis === 'x' ? this.width / 2 : this.height / 2;
	}
}

BarElement.id = 'bar';

/**
 * @type {any}
 */
BarElement.defaults = {
	borderSkipped: 'start',
	borderWidth: 0,
	borderRadius: 0
};

/**
 * @type {any}
 */
BarElement.defaultRoutes = {
	backgroundColor: 'backgroundColor',
	borderColor: 'borderColor'
};
