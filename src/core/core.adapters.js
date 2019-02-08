/**
 * @namespace Chart._adapters
 * @since 2.8.0
 * @private
 */

'use strict';

function abstract() {
	throw new Error(
		'This method is not implemented: either no adapter can ' +
		'be found or an incomplete integration was provided.'
	);
}

/**
 * Date adapter (current used by the time scale)
 * @namespace Chart._adapters._date
 * @memberof Chart._adapters
 * @private
 */

/**
 * Currently supported unit string values.
 * @typedef {('millisecond'|'second'|'minute'|'hour'|'day'|'week'|'month'|'quarter'|'year')}
 * @memberof Chart._adapters._date
 * @name Unit
 */

/** @lends Chart._adapters._date */
module.exports._date = {
	/**
	 * Returns a map of time formats for the supported units.
	 * @param {object} args - argumets
	 * @param {object} [options] - adapter options
	 * @returns {{string: string}}
	 */
	formats: abstract,

	/**
	 * Returns a map of date/time formats for the following presets:
	 * 'full': date + time + millisecond
	 * 'time': date + time
	 * 'date': date
	 * @param {object} args - argumets
	 * @param {object} [options] - adapter options
	 * @returns {{string: string}}
	 */
	presets: abstract,

	/**
	 * Parses the given `value` and return the associated timestamp.
	 * @param {object} args - argumets
	 * @param {*} args.value - the value to parse (usually comes from the data)
	 * @param {string} [args.format] - the expected data format
	 * @param {object} [options] - adapter options
	 * @returns {(number|null)}
	 * @function
	 */
	parse: abstract,

	/**
	 * Returns the formatted date in the specified `format` for a given `timestamp`.
	 * @param {object} args - argumets
	 * @param {number} args.timestamp - the timestamp to format
	 * @param {string} args.format - the date/time token
	 * @param {object} [options] - adapter options
	 * @return {string}
	 * @function
	 */
	format: abstract,

	/**
	 * Adds the specified `amount` of `unit` to the given `timestamp`.
	 * @param {object} args - argumets
	 * @param {number} args.timestamp - the input timestamp
	 * @param {number} args.amount - the amount to add
	 * @param {Unit} args.unit - the unit as string
	 * @param {object} [options] - adapter options
	 * @return {number}
	 * @function
	 */
	add: abstract,

	/**
	 * Returns the number of `unit` between the given timestamps.
	 * @param {object} args - argumets
	 * @param {number} args.max - the input timestamp (reference)
	 * @param {number} args.min - the timestamp to substract
	 * @param {Unit} args.unit - the unit as string
	 * @param {object} [options] - adapter options
	 * @return {number}
	 * @function
	 */
	diff: abstract,

	/**
	 * Returns start of `unit` for the given `timestamp`.
	 * @param {object} args - argumets
	 * @param {number} args.timestamp - the input timestamp
	 * @param {Unit} ags.unit - the unit as string
	 * @param {number} [args.weekday] - the ISO day of the week with 1 being Monday
	 * and 7 being Sunday (only needed if param *unit* is `isoWeek`).
	 * @param {object} [options] - adapter options
	 * @function
	 */
	startOf: abstract,

	/**
	 * Returns end of `unit` for the given `timestamp`.
	 * @param {object} args - argumets
	 * @param {number} args.timestamp - the input timestamp
	 * @param {Unit} args.unit - the unit as string
	 * @param {object} [options] - adapter options
	 * @function
	 */
	endOf: abstract,

	// DEPRECATIONS

	/**
	 * Provided for backward compatibility for scale.getValueForPixel(),
	 * this method should be overridden only by the moment adapter.
	 * @deprecated since version 2.8.0
	 * @todo remove at version 3
	 * @private
	 */
	_create: function(value) {
		return value;
	}
};
