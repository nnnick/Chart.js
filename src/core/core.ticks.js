import {isArray} from '../helpers/helpers.core';
import {formatNumber} from '../helpers/helpers.intl';
import {log10} from '../helpers/helpers.math';

/**
 * Namespace to hold formatters for different types of ticks
 * @namespace Chart.Ticks.formatters
 */
const formatters = {
  /**
   * Formatter for value labels
   * @method Chart.Ticks.formatters.values
   * @param value the value to display
   * @return {string|string[]} the label to display
   */
  values(value) {
    return isArray(value) ? value : '' + value;
  },

  /**
   * Formatter for numeric ticks
   * @method Chart.Ticks.formatters.numeric
   * @param tickValue {number} the value to be formatted
   * @param index {number} the position of the tickValue parameter in the ticks array
   * @param ticks {object[]} the list of ticks being converted
   * @return {string} string representation of the tickValue parameter
   */
  numeric(tickValue, index, ticks) {
    if (tickValue === 0) {
      return '0'; // never show decimal places for 0
    }

    const locale = this.chart.options.locale;
    let notation;
    let delta = tickValue; // This is used when there are less than 2 ticks as the tick interval.

    if (ticks.length > 1) {
      // all ticks are small or there huge numbers; use scientific notation
      const maxTick = Math.max(Math.abs(ticks[0].value), Math.abs(ticks[ticks.length - 1].value));
      if (maxTick < 1e-4 || maxTick > 1e+15) {
        notation = 'scientific';
      }

      delta = calculateDelta(tickValue, ticks);
    }

    const logDelta = log10(Math.abs(delta));
    const numDecimal = Math.max(Math.min(-1 * Math.floor(logDelta), 20), 0); // toFixed has a max of 20 decimal places

    const options = {notation, minimumFractionDigits: numDecimal, maximumFractionDigits: numDecimal};
    Object.assign(options, this.options.ticks.format);

    return formatNumber(tickValue, locale, options);
  },


  /**
   * Formatter for logarithmic ticks
   * @method Chart.Ticks.formatters.logarithmic
   * @param tickValue {number} the value to be formatted
   * @param index {number} the position of the tickValue parameter in the ticks array
   * @param ticks {object[]} the list of ticks being converted
   * @return {string} string representation of the tickValue parameter
   */
  logarithmic(tickValue, index, ticks) {
    if (tickValue === 0) {
      return '0';
    }
    const remain = ticks[index].significand || (tickValue / (Math.pow(10, Math.floor(log10(tickValue)))));
    if ([1, 2, 5, 10, 15].includes(remain) || index > 0.8 * ticks.length) {
      return formatters.numeric.call(this, tickValue, index, ticks);
    }
    return '';
  }

};


function calculateDelta(tickValue, ticks) {
  // Figure out how many digits to show
  // The space between the first two ticks might be smaller than normal spacing
  let delta = ticks.length > 3 ? ticks[2].value - ticks[1].value : ticks[1].value - ticks[0].value;

  // If we have a number like 2.5 as the delta, figure out how many decimal places we need
  if (Math.abs(delta) >= 1 && tickValue !== Math.floor(tickValue)) {
    // not an integer
    delta = tickValue - Math.floor(tickValue);
  }
  return delta;
}

/**
 * Namespace to hold static tick generation functions
 * @namespace Chart.Ticks
 */
export default {formatters};
