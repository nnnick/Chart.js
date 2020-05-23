import BarController from './controller.bar';

/**
 * @type {any}
 */
const defaults = {
	hover: {
		mode: 'index',
		axis: 'y'
	},

	scales: {
		x: {
			type: 'linear',
			beginAtZero: true
		},
		y: {
			type: 'category',
			offset: true,
			gridLines: {
				offsetGridLines: true
			}
		}
	},

	datasets: {
		categoryPercentage: 0.8,
		barPercentage: 0.9
	},

	elements: {
		rectangle: {
			borderSkipped: 'left'
		}
	},

	tooltips: {
		mode: 'index',
		axis: 'y'
	}
};

export default class HorizontalBarController extends BarController {

	/**
	 * @protected
	 */
	getValueScaleId() {
		return this._cachedMeta.xAxisID;
	}

	/**
	 * @protected
	 */
	getIndexScaleId() {
		return this._cachedMeta.yAxisID;
	}
}

HorizontalBarController.id = 'horizontalBar';
HorizontalBarController.defaults = defaults;
