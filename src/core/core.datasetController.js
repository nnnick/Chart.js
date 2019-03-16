'use strict';

var helpers = require('../helpers/index');

var resolve = helpers.options.resolve;

var arrayEvents = ['push', 'pop', 'shift', 'splice', 'unshift'];

/**
 * Hooks the array methods that add or remove values ('push', pop', 'shift', 'splice',
 * 'unshift') and notify the listener AFTER the array has been altered. Listeners are
 * called on the 'onData*' callbacks (e.g. onDataPush, etc.) with same arguments.
 */
function listenArrayEvents(array, listener) {
	if (array._chartjs) {
		array._chartjs.listeners.push(listener);
		return;
	}

	Object.defineProperty(array, '_chartjs', {
		configurable: true,
		enumerable: false,
		value: {
			listeners: [listener]
		}
	});

	arrayEvents.forEach(function(key) {
		var method = 'onData' + key.charAt(0).toUpperCase() + key.slice(1);
		var base = array[key];

		Object.defineProperty(array, key, {
			configurable: true,
			enumerable: false,
			value: function() {
				var args = Array.prototype.slice.call(arguments);
				var res = base.apply(this, args);

				helpers.each(array._chartjs.listeners, function(object) {
					if (typeof object[method] === 'function') {
						object[method].apply(object, args);
					}
				});

				return res;
			}
		});
	});
}

/**
 * Removes the given array event listener and cleanup extra attached properties (such as
 * the _chartjs stub and overridden methods) if array doesn't have any more listeners.
 */
function unlistenArrayEvents(array, listener) {
	var stub = array._chartjs;
	if (!stub) {
		return;
	}

	var listeners = stub.listeners;
	var index = listeners.indexOf(listener);
	if (index !== -1) {
		listeners.splice(index, 1);
	}

	if (listeners.length > 0) {
		return;
	}

	arrayEvents.forEach(function(key) {
		delete array[key];
	});

	delete array._chartjs;
}

function storeParsedData(meta, index, xid, yid, xvalue, yvalue, custom) {
	var metaData = meta.data[index];
	var datasetIndex = metaData._datasetIndex;
	var parsed = metaData._parsed || (metaData._parsed = {});
	var crossRef = meta._xref || (meta._xref = {});
	var xref = crossRef[xid] || (crossRef[xid] = {});
	var yref = crossRef[yid] || (crossRef[yid] = {});
	var xvref = xref[xvalue] || (xref[xvalue] = []);
	var yvref = yref[yvalue] || (yref[yvalue] = []);

	parsed[xid] = xvalue;
	parsed[yid] = yvalue;
	parsed._custom = custom;

	xvref[datasetIndex] = yvalue;
	yvref[datasetIndex] = xvalue;
}

function loadParsedData(meta, index, scaleId) {
	var metaData = meta && meta.data || [];
	return index >= 0
		&& index < metaData.length
		&& metaData[index]._parsed
		&& metaData[index]._parsed[scaleId];
}

function loadParsedDataByScaleValue(meta, value, scaleId, datasetIndex) {
	return meta
		&& meta._xref
		&& meta._xref[scaleId]
		&& meta._xref[scaleId][value]
		&& meta._xref[scaleId][value][datasetIndex];
}

function loadCustomData(meta, index) {
	var metaData = meta && meta.data || [];
	return index >= 0
		&& index < metaData.length
		&& metaData[index]._parsed
		&& metaData[index]._parsed._custom;
}

function convertObjectDataToArray(data) {
	var keys = Object.keys(data);
	var adata = [];
	var i, ilen, key;
	for (i = 0, ilen = keys.length; i < ilen; ++i) {
		key = keys[i];
		adata.push({
			x: key,
			y: data[key]
		});
	}
	return adata;
}


// Base class for all dataset controllers (line, bar, etc)
var DatasetController = function(chart, datasetIndex) {
	this.initialize(chart, datasetIndex);
};

helpers.extend(DatasetController.prototype, {

	/**
	 * Element type used to generate a meta dataset (e.g. Chart.element.Line).
	 * @type {Chart.core.element}
	 */
	datasetElementType: null,

	/**
	 * Element type used to generate a meta data (e.g. Chart.element.Point).
	 * @type {Chart.core.element}
	 */
	dataElementType: null,

	initialize: function(chart, datasetIndex) {
		var me = this;
		me.chart = chart;
		me.index = datasetIndex;
		me.linkScales();
		me.addElements();
	},

	updateIndex: function(datasetIndex) {
		this.index = datasetIndex;
	},

	linkScales: function() {
		var me = this;
		var meta = me.getMeta();
		var dataset = me.getDataset();

		if (meta.xAxisID === null || !(meta.xAxisID in me.chart.scales)) {
			meta.xAxisID = dataset.xAxisID || me.chart.options.scales.xAxes[0].id;
		}
		if (meta.yAxisID === null || !(meta.yAxisID in me.chart.scales)) {
			meta.yAxisID = dataset.yAxisID || me.chart.options.scales.yAxes[0].id;
		}
	},

	getDataset: function() {
		return this.chart.data.datasets[this.index];
	},

	getMeta: function() {
		return this.chart.getDatasetMeta(this.index);
	},

	getScaleForId: function(scaleID) {
		return this.chart.scales[scaleID];
	},

	/**
	 * @private
	 */
	_getValueScaleId: function() {
		return this.getMeta().yAxisID;
	},

	/**
	 * @private
	 */
	_getIndexScaleId: function() {
		return this.getMeta().xAxisID;
	},

	/**
	 * @private
	 */
	_getValueScale: function() {
		return this.getScaleForId(this._getValueScaleId());
	},

	/**
	 * @private
	 */
	_getIndexScale: function() {
		return this.getScaleForId(this._getIndexScaleId());
	},

	reset: function() {
		this.update(true);
	},

	/**
	 * @private
	 */
	destroy: function() {
		if (this._data) {
			unlistenArrayEvents(this._data, this);
		}
	},

	createMetaDataset: function() {
		var me = this;
		var type = me.datasetElementType;
		return type && new type({
			_chart: me.chart,
			_datasetIndex: me.index
		});
	},

	createMetaData: function(index) {
		var me = this;
		var type = me.dataElementType;
		return type && new type({
			_chart: me.chart,
			_datasetIndex: me.index,
			_index: index,
			_parsed: {}
		});
	},

	_dataCheck: function() {
		var me = this;
		var dataset = me.getDataset();
		var data = dataset.data || (dataset.data = []);

		// In order to correctly handle data addition/deletion animation (an thus simulate
		// real-time charts), we need to monitor these data modifications and synchronize
		// the internal meta data accordingly.
		if (me._data !== data) {
			if (helpers.isObject(data)) {
				// Object data is currently monitored for replacement only
				if (me._objectData !== data) {
					me._data = convertObjectDataToArray(data);
					me._objectData = data;
				}
			} else {
				if (me._data) {
					// This case happens when the user replaced the data array instance.
					unlistenArrayEvents(me._data, me);
				}

				if (data && Object.isExtensible(data)) {
					listenArrayEvents(data, me);
				}
				me._data = data;
			}
		}
	},

	addElements: function() {
		var me = this;
		var meta = me.getMeta();
		var metaData = meta.data;
		var i, ilen, data;

		me._dataCheck();
		data = me._data;

		for (i = 0, ilen = data.length; i < ilen; ++i) {
			metaData[i] = metaData[i] || me.createMetaData(i);
		}

		meta.dataset = meta.dataset || me.createMetaDataset();
		me._parse(0, ilen);
	},

	addElementAndReset: function(index) {
		var element = this.createMetaData(index);
		this.getMeta().data.splice(index, 0, element);
		this.updateElement(element, index, true);
	},

	buildOrUpdateElements: function() {
		this._dataCheck();

		// Re-sync meta data in case the user replaced the data array or if we missed
		// any updates and so make sure that we handle number of datapoints changing.
		this.resyncElements();
	},

	update: helpers.noop,

	transition: function(easingValue) {
		var meta = this.getMeta();
		var elements = meta.data || [];
		var ilen = elements.length;
		var i = 0;

		for (; i < ilen; ++i) {
			elements[i].transition(easingValue);
		}

		if (meta.dataset) {
			meta.dataset.transition(easingValue);
		}
	},

	draw: function() {
		var meta = this.getMeta();
		var elements = meta.data || [];
		var ilen = elements.length;
		var i = 0;

		if (meta.dataset) {
			meta.dataset.draw();
		}

		for (; i < ilen; ++i) {
			elements[i].draw();
		}
	},

	removeHoverStyle: function(element) {
		helpers.merge(element._model, element.$previousStyle || {});
		delete element.$previousStyle;
	},

	setHoverStyle: function(element) {
		var dataset = this.chart.data.datasets[element._datasetIndex];
		var index = element._index;
		var custom = element.custom || {};
		var model = element._model;
		var getHoverColor = helpers.getHoverColor;

		element.$previousStyle = {
			backgroundColor: model.backgroundColor,
			borderColor: model.borderColor,
			borderWidth: model.borderWidth
		};

		model.backgroundColor = resolve([custom.hoverBackgroundColor, dataset.hoverBackgroundColor, getHoverColor(model.backgroundColor)], undefined, index);
		model.borderColor = resolve([custom.hoverBorderColor, dataset.hoverBorderColor, getHoverColor(model.borderColor)], undefined, index);
		model.borderWidth = resolve([custom.hoverBorderWidth, dataset.hoverBorderWidth, model.borderWidth], undefined, index);
	},

	/**
	 * @private
	 */
	resyncElements: function() {
		var me = this;
		var meta = me.getMeta();
		var numData = me._data.length;
		var numMeta = meta.data.length;

		if (numData < numMeta) {
			meta.data.splice(numData, numMeta - numData);
			me._parse(0, numData);
		} else if (numData > numMeta) {
			me.insertElements(numMeta, numData - numMeta);
		} else {
			me._parse(0, numData);
		}
	},

	/**
	 * @private
	 */
	insertElements: function(start, count) {
		for (var i = 0; i < count; ++i) {
			this.addElementAndReset(start + i);
		}
		this._parse(start, count);
	},

	/**
	 * @private
	 */
	_parse: function(start, count) {
		var me = this;
		var meta = me.getMeta();
		var data = me._data;

		if (data && data.length) {
			if (helpers.isArray(data[0])) {
				me._parseArrayData(data, meta, start, count);
			} else if (helpers.isObject(data[0])) {
				me._parseObjectData(data, meta, start, count);
			} else {
				me._parsePlainData(data, meta, start, count);
			}
		}
	},

	/**
	 * @private
	 */
	_parseArrayData: function(data, meta, start, count) {
		var me = this;
		var xID = meta.xAxisID;
		var yID = meta.yAxisID;
		var xScale = me.getScaleForId(xID);
		var yScale = me.getScaleForId(yID);
		var i, ilen, x, y;
		for (i = start, ilen = start + count; i < ilen; ++i) {
			x = xScale._parse(data[i][0]);
			y = yScale._parse(data[i][1]);
			storeParsedData(meta, i, xID, yID, x, y);
		}
	},

	_parseCustomObjectData: helpers.noop,

	/**
	 * @private
	 */
	_parseObjectData: function(data, meta, start, count) {
		var me = this;
		var xID = meta.xAxisID;
		var yID = meta.yAxisID;
		var xScale = me.getScaleForId(xID);
		var yScale = me.getScaleForId(yID);
		var i, ilen, x, y, c;
		for (i = start, ilen = start + count; i < ilen; ++i) {
			x = xScale._parseObject(data[i], 'x', i);
			y = yScale._parseObject(data[i], 'y', i);
			c = me._parseCustomObjectData(data[i]);
			storeParsedData(meta, i, xID, yID, x, y, c);
		}
	},

	/**
	 * @private
	 */
	_parsePlainData: function(data, meta, start, count) {
		var me = this;
		var iScale = me._getIndexScale();
		var vScale = me._getValueScale();
		var iID = iScale.id;
		var vID = vScale.id;

		var labels = iScale._getLabels() || [];
		var i, ilen, iv, v;

		for (i = start, ilen = start + count; i < ilen; ++i) {
			v = vScale._parse(data[i]);
			iv = iScale !== vScale && i < labels.length
				? iScale._parse(labels[i])
				: i;
			storeParsedData(meta, i, iID, vID, iv, v);
		}
	},

	/**
	 * @private
	 */
	_getParsedValue: function(index, scale) {
		return loadParsedData(this.getMeta(), index, scale.id);
	},

	/**
	 * @private
	 */
	_getParsedCustom: function(index) {
		return loadCustomData(this.getMeta(), index);
	},

	/**
	 * @private
	 */
	_getParsedValueByScaleValue: function(value, scale) {
		return loadParsedDataByScaleValue(this.getMeta(), value, scale.id, this.index);
	},

	/**
	 * @private
	 */
	onDataPush: function() {
		var count = arguments.length;
		this.insertElements(this.getDataset().data.length - count, count);
	},

	/**
	 * @private
	 */
	onDataPop: function() {
		this.getMeta().data.pop();
	},

	/**
	 * @private
	 */
	onDataShift: function() {
		this.getMeta().data.shift();
	},

	/**
	 * @private
	 */
	onDataSplice: function(start, count) {
		this.getMeta().data.splice(start, count);
		this.insertElements(start, arguments.length - 2);
	},

	/**
	 * @private
	 */
	onDataUnshift: function() {
		this.insertElements(0, arguments.length);
	}
});

DatasetController.extend = helpers.inherits;

module.exports = DatasetController;
