import LineController from './controller.line';

const defaults = {
	scales: {
		x: {
			type: 'linear'
		},
		y: {
			type: 'linear'
		}
	},

	datasets: {
		showLine: false
	},

	tooltips: {
		callbacks: {
			title() {
				return '';     // doesn't make sense for scatter since data are formatted as a point
			},
			label(item) {
				return '(' + item.label + ', ' + item.value + ')';
			}
		}
	}
};

export default class ScatterController extends LineController {

}
ScatterController.id = 'scatter';
ScatterController.defaults = defaults;
ScatterController.preRegister = () => {
	LineController.preRegister();
}
