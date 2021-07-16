import {finiteOrDefault, isFinite} from '../helpers/helpers.core';
import {formatNumber} from '../helpers/helpers.intl';
import {_setMinAndMaxByKey, log10} from '../helpers/helpers.math';
import Scale from '../core/core.scale';
import LinearScaleBase from './scale.linearbase';
import Ticks from '../core/core.ticks';

const log10Floor = v => Math.floor(log10(v));
const changeExponent = (v, m) => Math.pow(10, log10Floor(v) + m);

function isMajor(tickVal) {
  const remain = tickVal / (Math.pow(10, log10Floor(tickVal)));
  return remain === 1;
}

function steps(min, max, rangeExp) {
  const rangeStep = Math.pow(10, rangeExp);
  const start = Math.floor(min / rangeStep);
  const end = Math.ceil(max / rangeStep);
  return end - start;
}

function startExp(min, max) {
  const range = max - min;
  let rangeExp = log10Floor(range);
  while (steps(min, max, rangeExp) > 10) {
    rangeExp++;
  }
  while (steps(min, max, rangeExp) < 10) {
    rangeExp--;
  }
  return Math.min(rangeExp, log10Floor(min));
}


/**
 * Generate a set of logarithmic ticks
 * @param generationOptions the options used to generate the ticks
 * @param dataRange the range of the data
 * @returns {object[]} array of tick objects
 */
function generateTicks(generationOptions, {min, max}) {
  min = finiteOrDefault(generationOptions.min, min);
  const ticks = [];
  const minExp = log10Floor(min);
  let exp = startExp(min, max);
  let precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;
  const stepSize = Math.pow(10, exp);
  const base = minExp > exp ? Math.pow(10, minExp) : 0;
  const start = Math.round((min - base) * precision) / precision;
  const offset = Math.floor((min - base) / stepSize / 10) * stepSize * 10;
  let significand = Math.floor((start - offset) / Math.pow(10, exp));
  let value = finiteOrDefault(generationOptions.min, Math.round((base + offset + significand * Math.pow(10, exp)) * precision) / precision);
  while (value < max) {
    ticks.push({value, major: isMajor(value), significand});
    if (significand >= 10) {
      significand = significand < 15 ? 15 : 20;
    } else {
      significand++;
    }
    if (significand >= 20) {
      exp++;
      significand = 2;
      precision = exp >= 0 ? 1 : precision;
    }
    value = Math.round((base + offset + significand * Math.pow(10, exp)) * precision) / precision;
  }
  const lastTick = finiteOrDefault(generationOptions.max, value);
  ticks.push({value: lastTick, major: isMajor(lastTick), significand});

  return ticks;
}

export default class LogarithmicScale extends Scale {

  constructor(cfg) {
    super(cfg);

    /** @type {number} */
    this.start = undefined;
    /** @type {number} */
    this.end = undefined;
    /** @type {number} */
    this._startValue = undefined;
    this._valueRange = 0;
  }

  parse(raw, index) {
    const value = LinearScaleBase.prototype.parse.apply(this, [raw, index]);
    if (value === 0) {
      this._zero = true;
      return undefined;
    }
    return isFinite(value) && value > 0 ? value : null;
  }

  determineDataLimits() {
    const me = this;
    const {min, max} = me.getMinMax(true);

    me.min = isFinite(min) ? Math.max(0, min) : null;
    me.max = isFinite(max) ? Math.max(0, max) : null;

    if (me.options.beginAtZero) {
      me._zero = true;
    }

    // if data has `0` in it or `beginAtZero` is true, min (non zero) value is at bottom
    // of scale, and it does not equal suggestedMin, lower the min bound by one exp.
    if (me._zero && me.min !== me._suggestedMin && !isFinite(me._userMin)) {
      me.min = min === changeExponent(me.min, 0) ? changeExponent(me.min, -1) : changeExponent(me.min, 0);
    }

    me.handleTickRangeOptions();
  }

  handleTickRangeOptions() {
    const me = this;
    const {minDefined, maxDefined} = me.getUserBounds();
    let min = me.min;
    let max = me.max;

    const setMin = v => (min = minDefined ? min : v);
    const setMax = v => (max = maxDefined ? max : v);

    if (min === max) {
      if (min <= 0) { // includes null
        setMin(1);
        setMax(10);
      } else {
        setMin(changeExponent(min, -1));
        setMax(changeExponent(max, +1));
      }
    }
    if (min <= 0) {
      setMin(changeExponent(max, -1));
    }
    if (max <= 0) {
      setMax(changeExponent(min, +1));
    }

    me.min = min;
    me.max = max;
  }

  buildTicks() {
    const me = this;
    const opts = me.options;

    const generationOptions = {
      min: me._userMin,
      max: me._userMax
    };
    const ticks = generateTicks(generationOptions, me);

    // At this point, we need to update our max and min given the tick values,
    // since we probably have expanded the range of the scale
    if (opts.bounds === 'ticks') {
      _setMinAndMaxByKey(ticks, me, 'value');
    }

    if (opts.reverse) {
      ticks.reverse();

      me.start = me.max;
      me.end = me.min;
    } else {
      me.start = me.min;
      me.end = me.max;
    }

    return ticks;
  }

  /**
	 * @param {number} value
	 * @return {string}
	 */
  getLabelForValue(value) {
    return value === undefined ? '0' : formatNumber(value, this.chart.options.locale);
  }

  /**
	 * @protected
	 */
  configure() {
    const me = this;
    const start = me.min;

    super.configure();

    me._startValue = log10(start);
    me._valueRange = log10(me.max) - log10(start);
  }

  getPixelForValue(value) {
    const me = this;
    if (value === undefined || value === 0) {
      value = me.min;
    }
    if (value === null || isNaN(value)) {
      return NaN;
    }
    return me.getPixelForDecimal(value === me.min
      ? 0
      : (log10(value) - me._startValue) / me._valueRange);
  }

  getValueForPixel(pixel) {
    const me = this;
    const decimal = me.getDecimalForPixel(pixel);
    return Math.pow(10, me._startValue + decimal * me._valueRange);
  }
}

LogarithmicScale.id = 'logarithmic';

/**
 * @type {any}
 */
LogarithmicScale.defaults = {
  ticks: {
    callback: Ticks.formatters.logarithmic,
    major: {
      enabled: true
    }
  }
};
