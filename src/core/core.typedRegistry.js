import defaults from './core.defaults';

/**
 * @typedef {{id: string, defaults: any, defaultRoutes: any}} IChartComponent
 */

export default class TypedRegistry {
  constructor(type, scope, relocate) {
    this.type = type;
    this.relocate = relocate;
    this.scope = scope;
    this.items = Object.create(null);
  }

  isForType(type) {
    return Object.prototype.isPrototypeOf.call(this.type.prototype, type.prototype);
  }

  /**
	 * @param {IChartComponent} item
	 * @returns {string} The scope where items defaults were registered to.
	 */
  register(item) {
    const proto = Object.getPrototypeOf(item);
    let parentScope;

    if (isIChartComponent(proto)) {
      // Make sure the parent is registered and note the scope where its defaults are.
      parentScope = this.register(proto);
    }

    const items = this.items;
    const id = item.id;
    const baseScope = this.scope;
    const scope = baseScope ? baseScope + '.' + id : id;

    if (!id) {
      throw new Error('class does not have id: ' + item);
    }

    if (id in items) {
      // already registered
      return scope;
    }

    items[id] = item;
    registerDefaults(item, scope, parentScope, this.relocate);

    return scope;
  }

  /**
	 * @param {string} id
	 * @returns {object?}
	 */
  get(id) {
    return this.items[id];
  }

  /**
	 * @param {IChartComponent} item
	 */
  unregister(item) {
    const items = this.items;
    const id = item.id;
    const scope = this.scope;

    if (id in items) {
      delete items[id];
    }

    if (scope && id in defaults[scope]) {
      delete defaults[scope][id];
    }
  }
}

function registerDefaults(item, scope, parentScope, relocate) {
  let defs = item.defaults;
  if (relocate) {
    defs = Object.assign({}, defs);
    const keys = Object.keys(relocate);
    for (const key of keys) {
      if (defs[key]) {
        const dest = relocate[key].replace('{id}', item.id);
        defaults.set(dest, defs[key]);
        delete defs[key];
      }
    }
  }

  // Inherit the parent's defaults and keep existing defaults
  const itemDefaults = Object.assign(
    Object.create(null),
    parentScope && defaults.get(parentScope),
    defs,
    defaults.get(scope)
  );

  defaults.set(scope, itemDefaults);

  if (item.defaultRoutes) {
    routeDefaults(scope, item.defaultRoutes);
  }

  if (item.descriptors) {
    defaults.describe(scope, item.descriptors);
  }
}

function routeDefaults(scope, routes) {
  Object.keys(routes).forEach(property => {
    const propertyParts = property.split('.');
    const sourceName = propertyParts.pop();
    const sourceScope = [scope].concat(propertyParts).join('.');
    const parts = routes[property].split('.');
    const targetName = parts.pop();
    const targetScope = parts.join('.');
    defaults.route(sourceScope, sourceName, targetScope, targetName);
  });
}

function isIChartComponent(proto) {
  return 'id' in proto && 'defaults' in proto;
}
