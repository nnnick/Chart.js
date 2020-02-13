import {inherits} from '../helpers/helpers.core';
import {isNumber} from '../helpers/helpers.math';

class Element {

	constructor(cfg) {
		this.x = undefined;
		this.y = undefined;
		this.hidden = false;
		this.active = false;
		this.options = undefined;
		this.$animations = undefined;

		if (cfg) {
			Object.assign(this, cfg);
		}
	}

	tooltipPosition() {
		return {
			x: this.x,
			y: this.y
		};
	}

	hasValue() {
		return isNumber(this.x) && isNumber(this.y);
	}

	/**
	 * Gets the current or final value of each prop. Can return extra properties (whole object).
	 * @param {string[]} props - properties to get
	 * @param {boolean} [final] - get the final value (animation target)
	 * @return {object}
	 */
	getProps(props, final) {
		const me = this;
		const anims = this.$animations;
		if (!final || !anims) {
			// let's not create an object, if not needed
			return me;
		}
		const ret = {};
		props.forEach(prop => {
			ret[prop] = anims[prop] && anims[prop].active ? anims[prop]._to : me[prop];
		});
		return ret;
	}
}

Element.extend = inherits;
export default Element;
