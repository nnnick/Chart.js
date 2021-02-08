/**
 * Top-level type definitions. These are processed by Rollup and rollup-plugin-dts
 * to make a combined .d.ts file under dist; that way, all of the type definitions
 * appear directly within the "chart.js" module; that matches the layout of the
 * distributed chart.esm.js bundle and means that users of Chart.js can easily use
 * module augmentation to extend Chart.js's types and plugins within their own
 * code, like so:
 *
 * @example
 * declare module "chart.js" {
 *	 // Add types here
 * }
 */

import { TimeUnit } from './adapters';
import { AnimationEvent } from './animation';
import { AnyObject, EmptyObject } from './basic';
import { Color } from './color';
import { Element } from './element';
import { ChartArea, Point } from './geometric';
import { LayoutItem, LayoutPosition } from './layout';
import {
	Scriptable,
	ScriptableOptions,
	ScriptableAndArrayOptions
} from './scriptable';

export { DateAdapter, TimeUnit, _adapters } from './adapters';
export { Animation, Animations, Animator, AnimationEvent } from './animation';
export { Color } from './color';
export { Element } from './element';
export { ChartArea, Point } from './geometric';
export { LayoutItem, LayoutPosition } from './layout';
export {
	Scriptable,
	ScriptableOptions,
	ScriptableAndArray,
	ScriptableAndArrayOptions
} from './scriptable';

export interface ScriptableContext {
	chart: Chart;
	parsed: unknown[];
	raw: unknown[];
	dataIndex: number;
	dataset: ChartDataset;
	datasetIndex: number;
	active: boolean;
}

export interface ParsingOptions {
	/**
	 * How to parse the dataset. The parsing can be disabled by specifying parsing: false at chart options or dataset. If parsing is disabled, data must be sorted and in the formats the associated chart type and scales use internally.
	 */
	parsing:
	{
		[key: string]: string;
	}
	| false;

	/**
	 * Chart.js is fastest if you provide data with indices that are unique, sorted, and consistent across datasets and provide the normalized: true option to let Chart.js know that you have done so.
	 */
	normalized: boolean;
}

export interface ControllerDatasetOptions extends ParsingOptions {
	/**
	 * The base axis of the chart. 'x' for vertical charts and 'y' for horizontal charts.
	 * @default 'x'
	 */
	indexAxis: 'x' | 'y';
	/**
	 * How to clip relative to chartArea. Positive value allows overflow, negative value clips that many pixels inside chartArea. 0 = clip at chartArea. Clipping can also be configured per side: clip: {left: 5, top: false, right: -2, bottom: 0}
	 */
	clip: number | ChartArea;
	/**
	 * The label for the dataset which appears in the legend and tooltips.
	 */
	label: string;
	/**
	 * The drawing order of dataset. Also affects order for stacking, tooltip and legend.
	 */
	order: number;

	/**
	 * The ID of the group to which this dataset belongs to (when stacked, each group will be a separate stack).
	 */
	stack: string;
}

export interface BarControllerDatasetOptions
	extends ControllerDatasetOptions,
		ScriptableAndArrayOptions<BarOptions, ScriptableContext>,
		ScriptableAndArrayOptions<CommonHoverOptions, ScriptableContext> {
	/**
	 * The ID of the x axis to plot this dataset on.
	 */
	xAxisID: string;
	/**
	 * The ID of the y axis to plot this dataset on.
	 */
	yAxisID: string;

	/**
	 * Percent (0-1) of the available width each bar should be within the category width. 1.0 will take the whole category width and put the bars right next to each other.
	 * @default 0.9
	 */
	barPercentage: number;
	/**
	 * Percent (0-1) of the available width each category should be within the sample width.
	 * @default 0.8
	 */
	categoryPercentage: number;

	/**
	 * Manually set width of each bar in pixels. If set to 'flex', it computes "optimal" sample widths that globally arrange bars side by side. If not set (default), bars are equally sized based on the smallest interval.
	 */
	barThickness: number | 'flex';

	/**
	 * Set this to ensure that bars are not sized thicker than this.
	 */
	maxBarThickness: number;

	/**
	 * Set this to ensure that bars have a minimum length in pixels.
	 */
	minBarLength: number;

	/**
	 * Point style for the legend
	 * @default 'circle;
	 */
	pointStyle: PointStyle;
}

export interface BarControllerChartOptions {
	/**
	 * Should null or undefined values be omitted from drawing
	 */
	skipNull?: boolean;
}

export type BarController = DatasetController
export const BarController: ChartComponent & {
	prototype: BarController;
	new (chart: Chart, datasetIndex: number): BarController;
};

export interface BubbleControllerDatasetOptions
	extends ControllerDatasetOptions,
		ScriptableAndArrayOptions<PointOptions, ScriptableContext>,
		ScriptableAndArrayOptions<PointHoverOptions, ScriptableContext> {}

export interface BubbleDataPoint {
	/**
	 * X Value
	 */
	x: number;

	/**
	 * Y Value
	 */
	y: number;

	/**
	 * Bubble radius in pixels (not scaled).
	 */
	r: number;
}

export type BubbleController = DatasetController
export const BubbleController: ChartComponent & {
	prototype: BubbleController;
	new (chart: Chart, datasetIndex: number): BubbleController;
};

export interface LineControllerDatasetOptions
	extends ControllerDatasetOptions,
		ScriptableAndArrayOptions<PointPrefixedOptions, ScriptableContext>,
		ScriptableAndArrayOptions<PointPrefixedHoverOptions, ScriptableContext>,
		ScriptableOptions<LineOptions, ScriptableContext>,
		ScriptableOptions<LineHoverOptions, ScriptableContext> {
	/**
	 * The ID of the x axis to plot this dataset on.
	 */
	xAxisID: string;
	/**
	 * The ID of the y axis to plot this dataset on.
	 */
	yAxisID: string;

	/**
	 * If true, lines will be drawn between points with no or null data. If false, points with NaN data will create a break in the line. Can also be a number specifying the maximum gap length to span. The unit of the value depends on the scale used.
	 * @default false
	 */
	spanGaps: boolean | number;

	showLine: boolean;
}

export interface LineControllerChartOptions {
	/**
	 * If true, lines will be drawn between points with no or null data. If false, points with NaN data will create a break in the line. Can also be a number specifying the maximum gap length to span. The unit of the value depends on the scale used.
	 * @default false
	 */
	spanGaps: boolean | number;
	/**
	 * If false, the lines between points are not drawn.
	 * @default true
	 */
	showLine: boolean;
}

export type LineController = DatasetController
export const LineController: ChartComponent & {
	prototype: LineController;
	new (chart: Chart, datasetIndex: number): LineController;
};

export type ScatterControllerDatasetOptions = LineControllerDatasetOptions;

export interface ScatterDataPoint {
	x: number;
	y: number;
}

export type ScatterControllerChartOptions = LineControllerChartOptions;

export type ScatterController = LineController
export const ScatterController: ChartComponent & {
	prototype: ScatterController;
	new (chart: Chart, datasetIndex: number): ScatterController;
};

export interface DoughnutControllerDatasetOptions
	extends ControllerDatasetOptions,
		ScriptableAndArrayOptions<ArcOptions, ScriptableContext>,
		ScriptableAndArrayOptions<ArcHoverOptions, ScriptableContext> {

	/**
	 * Sweep to allow arcs to cover.
	 * @default 360
	 */
	circumference: number;

	/**
	 * Starting angle to draw this dataset from.
	 * @default 0
	 */
	rotation: number;

	/**
	 * The relative thickness of the dataset. Providing a value for weight will cause the pie or doughnut dataset to be drawn with a thickness relative to the sum of all the dataset weight values.
	 * @default 1
	 */
	weight: number;
}

export interface DoughnutAnimationOptions {
	/**
	 * 	If true, the chart will animate in with a rotation animation. This property is in the options.animation object.
	 * @default true
	 */
	animateRotate: boolean;

	/**
	 * If true, will animate scaling the chart from the center outwards.
	 * @default false
	 */
	animateScale: boolean;
}

export interface DoughnutControllerChartOptions {
	/**
	 * The percentage of the chart that is cut out of the middle. (50 - for doughnut, 0 - for pie)
	 * @default 50
	 */
	cutoutPercentage: number;

	/**
	 * Starting angle to draw arcs from.
	 * @default 0
	 */
	rotation: number;

	/**
	 * Sweep to allow arcs to cover.
	 * @default 360
	 */
	circumference: number;

	animation: DoughnutAnimationOptions;
}

export type DoughnutDataPoint = number;

export interface DoughnutController extends DatasetController {
	readonly innerRadius: number;
	readonly outerRadius: number;
	readonly offsetX: number;
	readonly offsetY: number;

	getRingIndex(datasetIndex: number): number;
	calculateTotal(): number;
	calculateCircumference(value: number): number;
}

export const DoughnutController: ChartComponent & {
	prototype: DoughnutController;
	new (chart: Chart, datasetIndex: number): DoughnutController;
};

export type PieControllerDatasetOptions = DoughnutControllerDatasetOptions;
export type PieControllerChartOptions = DoughnutControllerChartOptions;
export type PieAnimationOptions = DoughnutAnimationOptions;

export type PieDataPoint = DoughnutDataPoint;

export type PieController = DoughnutController
export const PieController: ChartComponent & {
	prototype: PieController;
	new (chart: Chart, datasetIndex: number): PieController;
};

export interface PolarAreaControllerDatasetOptions extends DoughnutControllerDatasetOptions {
	/**
	 * Arc angle to cover. - for polar only
	 * @default circumference / (arc count)
	 */
	angle: number;
}

export type PolarAreaAnimationOptions = DoughnutAnimationOptions;

export interface PolarAreaControllerChartOptions {
	/**
	 * Starting angle to draw arcs for the first item in a dataset. In degrees, 0 is at top.
	 * @default 0
	 */
	startAngle: number;

	animation: PolarAreaAnimationOptions;
}

export interface PolarAreaController extends DoughnutController {
	countVisibleElements(): number;
}
export const PolarAreaController: ChartComponent & {
	prototype: PolarAreaController;
	new (chart: Chart, datasetIndex: number): PolarAreaController;
};

export interface RadarControllerDatasetOptions
	extends ControllerDatasetOptions,
		ScriptableOptions<PointPrefixedOptions, ScriptableContext>,
		ScriptableOptions<PointPrefixedHoverOptions, ScriptableContext>,
		ScriptableOptions<LineOptions, ScriptableContext>,
		ScriptableOptions<LineHoverOptions, ScriptableContext> {
	/**
	 * The ID of the x axis to plot this dataset on.
	 */
	xAxisID: string;
	/**
	 * The ID of the y axis to plot this dataset on.
	 */
	yAxisID: string;

	/**
	 * If true, lines will be drawn between points with no or null data. If false, points with NaN data will create a break in the line. Can also be a number specifying the maximum gap length to span. The unit of the value depends on the scale used.
	 */
	spanGaps: boolean | number;

	/**
	 * If false, the line is not drawn for this dataset.
	 */
	showLine: boolean;
}

export type RadarControllerChartOptions = LineControllerChartOptions;

export type RadarController = DatasetController
export const RadarController: ChartComponent & {
	prototype: RadarController;
	new (chart: Chart, datasetIndex: number): RadarController;
};
export interface ChartMeta<TElement extends Element = Element, TDatasetElement extends Element = Element> {
	type: string;
	controller: DatasetController;
	order: number;

	label: string;
	index: number;
	visible: boolean;

	stack: number;

	indexAxis: 'x' | 'y';

	data: TElement[];
	dataset?: TDatasetElement;

	hidden: boolean;

	xAxisID?: string;
	yAxisID?: string;
	rAxisID?: string;
	iAxisID: string;
	vAxisID: string;

	xScale?: Scale;
	yScale?: Scale;
	rScale?: Scale;
	iScale?: Scale;
	vScale?: Scale;

	_sorted: boolean;
	_stacked: boolean;
	_parsed: unknown[];
}

export interface ActiveDataPoint {
	datasetIndex: number;
	index: number;
}

export interface ActiveElement extends ActiveDataPoint {
	element: Element;
}

export declare class Chart<
	TType extends ChartType = ChartType,
	TData extends unknown[] = DefaultDataPoint<TType>,
	TLabel = unknown
	> {
	readonly platform: BasePlatform;
	readonly id: string;
	readonly canvas: HTMLCanvasElement;
	readonly ctx: CanvasRenderingContext2D;
	readonly config: ChartConfiguration<TType, TData, TLabel>
	readonly width: number;
	readonly height: number;
	readonly aspectRatio: number;
	readonly boxes: LayoutItem[];
	readonly currentDevicePixelRatio: number;
	readonly chartArea: ChartArea;
	readonly scales: { [key: string]: Scale };
	readonly attached: boolean;

	data: ChartData<TType, TData, TLabel>;
	options: ChartOptions<TType>;

	constructor(item: ChartItem, config: ChartConfiguration<TType, TData, TLabel>);

	clear(): this;
	stop(): this;

	resize(width?: number, height?: number): void;
	ensureScalesHaveIDs(): void;
	buildOrUpdateScales(): void;
	buildOrUpdateControllers(): void;
	reset(): void;
	update(mode?: UpdateMode): void;
	render(): void;
	draw(): void;

	getElementsAtEventForMode(e: Event, mode: string, options: InteractionOptions, useFinalPosition: boolean): InteractionItem[];

	getSortedVisibleDatasetMetas(): ChartMeta[];
	getDatasetMeta(datasetIndex: number): ChartMeta;
	getVisibleDatasetCount(): number;
	isDatasetVisible(datasetIndex: number): boolean;
	setDatasetVisibility(datasetIndex: number, visible: boolean): void;
	toggleDataVisibility(index: number): void;
	getDataVisibility(index: number): boolean;
	hide(datasetIndex: number): void;
	show(datasetIndex: number): void;

	getActiveElements(): ActiveElement[];
	setActiveElements(active: ActiveDataPoint[]): void;

	destroy(): void;
	toBase64Image(type?: string, quality?: unknown): string;
	bindEvents(): void;
	unbindEvents(): void;
	updateHoverStyle(items: Element, mode: 'dataset', enabled: boolean): void;

	notifyPlugins(hook: string, args?: AnyObject): boolean | void;

	static readonly defaults: Defaults;
	static readonly version: string;
	static readonly instances: { [key: string]: Chart };
	static readonly registry: Registry;
	static getChart(key: string | CanvasRenderingContext2D | HTMLCanvasElement): Chart | undefined;
	static register(...items: ChartComponentLike[]): void;
	static unregister(...items: ChartComponentLike[]): void;
}

export declare type ChartItem =
	| string
	| CanvasRenderingContext2D
	| OffscreenCanvasRenderingContext2D
	| HTMLCanvasElement
	| OffscreenCanvas
	| { canvas: HTMLCanvasElement | OffscreenCanvas }
	| ArrayLike<CanvasRenderingContext2D | HTMLCanvasElement | OffscreenCanvas>;

export declare enum UpdateModeEnum {
	resize = 'resize',
	reset = 'reset',
	none = 'none',
	hide = 'hide',
	show = 'show',
	normal = 'normal',
	active = 'active'
}

export type UpdateMode = keyof typeof UpdateModeEnum;

export class DatasetController<TElement extends Element = Element, TDatasetElement extends Element = Element> {
	constructor(chart: Chart, datasetIndex: number);

	readonly chart: Chart;
	readonly index: number;
	readonly _cachedMeta: ChartMeta<TElement, TDatasetElement>;
	enableOptionSharing: boolean;

	linkScales(): void;
	getAllParsedValues(scale: Scale): number[];
	protected getLabelAndValue(index: number): { label: string; value: string };
	updateElements(elements: TElement[], start: number, count: number, mode: UpdateMode): void;
	update(mode: UpdateMode): void;
	updateIndex(datasetIndex: number): void;
	protected getMaxOverflow(): boolean | number;
	draw(): void;
	reset(): void;
	getDataset(): ChartDataset;
	getMeta(): ChartMeta<TElement, TDatasetElement>;
	getScaleForId(scaleID: string): Scale | undefined;
	configure(): void;
	initialize(): void;
	addElements(): void;
	buildOrUpdateElements(resetNewElements?: boolean): void;

	getStyle(index: number, active: boolean): AnyObject;
	protected resolveDatasetElementOptions(active: boolean): AnyObject;
	protected resolveDataElementOptions(index: number, mode: UpdateMode): AnyObject;
	/**
	 * Utility for checking if the options are shared and should be animated separately.
	 * @protected
	 */
	protected getSharedOptions(options: AnyObject): undefined | AnyObject;
	/**
	 * Utility for determining if `options` should be included in the updated properties
	 * @protected
	 */
	protected includeOptions(mode: UpdateMode, sharedOptions: AnyObject): boolean;
	/**
	 * Utility for updating an element with new properties, using animations when appropriate.
	 * @protected
	 */

	protected updateElement(element: TElement | TDatasetElement, index: number | undefined, properties: AnyObject, mode: UpdateMode): void;
	/**
	 * Utility to animate the shared options, that are potentially affecting multiple elements.
	 * @protected
	 */

	protected updateSharedOptions(sharedOptions: AnyObject, mode: UpdateMode, newOptions: AnyObject): void;
	removeHoverStyle(element: TElement, datasetIndex: number, index: number): void;
	setHoverStyle(element: TElement, datasetIndex: number, index: number): void;

	parse(start: number, count: number): void;
	protected parsePrimitiveData(meta: ChartMeta<TElement, TDatasetElement>, data: AnyObject[], start: number, count: number): AnyObject[];
	protected parseArrayData(meta: ChartMeta<TElement, TDatasetElement>, data: AnyObject[], start: number, count: number): AnyObject[];
	protected parseObjectData(meta: ChartMeta<TElement, TDatasetElement>, data: AnyObject[], start: number, count: number): AnyObject[];
	protected getParsed(index: number): AnyObject;
	protected applyStack(scale: Scale, parsed: unknown[]): number;
	protected updateRangeFromParsed(
		range: { min: number; max: number },
		scale: Scale,
		parsed: unknown[],
		stack: boolean
	): void;
	protected getMinMax(scale: Scale, canStack?: boolean): { min: number; max: number };
}

export interface DatasetControllerChartComponent extends ChartComponent {
	defaults: {
		datasetElementType?: string | null | false;
		dataElementType?: string | null | false;
		dataElementOptions?: string[];
		datasetElementOptions?: string[] | { [key: string]: string };
	};
}

export interface Defaults extends CoreChartOptions, ElementChartOptions, PluginChartOptions {
	controllers: {
		[key in ChartType]: DeepPartial<
			CoreChartOptions &
			ElementChartOptions &
			PluginChartOptions &
			DatasetChartOptions<key>[key] &
			ScaleChartOptions<key> &
			ChartTypeRegistry[key]['chartOptions']
			>;
	};

	scale: ScaleOptionsByType;
	scales: {
		[key in ScaleType]: ScaleOptionsByType<key>;
	};

	set(values: AnyObject): AnyObject;
	set(scope: string, values: AnyObject): AnyObject;
	get(scope: string): AnyObject;

	/**
	 * Routes the named defaults to fallback to another scope/name.
	 * This routing is useful when those target values, like defaults.color, are changed runtime.
	 * If the values would be copied, the runtime change would not take effect. By routing, the
	 * fallback is evaluated at each access, so its always up to date.
	 *
	 * Example:
	 *
	 * 	defaults.route('elements.arc', 'backgroundColor', '', 'color')
	 *    - reads the backgroundColor from defaults.color when undefined locally
	 *
	 * @param scope Scope this route applies to.
	 * @param name Property name that should be routed to different namespace when not defined here.
	 * @param targetScope The namespace where those properties should be routed to.
	 * Empty string ('') is the root of defaults.
	 * @param targetName The target name in the target scope the property should be routed to.
	 */
	route(scope: string, name: string, targetScope: string, targetName: string): void;
}

export const defaults: Defaults;
export interface InteractionOptions {
	axis?: string;
	intersect?: boolean;
}

export interface InteractionItem {
	element: Element;
	datasetIndex: number;
	index: number;
}

export type InteractionModeFunction = (
	chart: Chart,
	e: ChartEvent,
	options: InteractionOptions,
	useFinalPosition?: boolean
) => InteractionItem[];

export interface InteractionModeMap {
	/**
	 * Returns items at the same index. If the options.intersect parameter is true, we only return items if we intersect something
	 * If the options.intersect mode is false, we find the nearest item and return the items at the same index as that item
	 */
	index: InteractionModeFunction;

	/**
	 * Returns items in the same dataset. If the options.intersect parameter is true, we only return items if we intersect something
	 * If the options.intersect is false, we find the nearest item and return the items in that dataset
	 */
	dataset: InteractionModeFunction;
	/**
	 * Point mode returns all elements that hit test based on the event position
	 * of the event
	 */
	point: InteractionModeFunction;
	/**
	 * nearest mode returns the element closest to the point
	 */
	nearest: InteractionModeFunction;
	/**
	 * x mode returns the elements that hit-test at the current x coordinate
	 */
	x: InteractionModeFunction;
	/**
	 * y mode returns the elements that hit-test at the current y coordinate
	 */
	y: InteractionModeFunction;
}

export type InteractionMode = keyof InteractionModeMap;

export const Interaction: {
	modes: InteractionModeMap;
};

export const layouts: {
	/**
	 * Register a box to a chart.
	 * A box is simply a reference to an object that requires layout. eg. Scales, Legend, Title.
	 * @param {Chart} chart - the chart to use
	 * @param {LayoutItem} item - the item to add to be laid out
	 */
	addBox(chart: Chart, item: LayoutItem): void;

	/**
	 * Remove a layoutItem from a chart
	 * @param {Chart} chart - the chart to remove the box from
	 * @param {LayoutItem} layoutItem - the item to remove from the layout
	 */
	removeBox(chart: Chart, layoutItem: LayoutItem): void;

	/**
	 * Sets (or updates) options on the given `item`.
	 * @param {Chart} chart - the chart in which the item lives (or will be added to)
	 * @param {LayoutItem} item - the item to configure with the given options
	 * @param options - the new item options.
	 */
	configure(
		chart: Chart,
		item: LayoutItem,
		options: { fullSize?: number; position?: LayoutPosition; weight?: number }
	): void;

	/**
	 * Fits boxes of the given chart into the given size by having each box measure itself
	 * then running a fitting algorithm
	 * @param {Chart} chart - the chart
	 * @param {number} width - the width to fit into
	 * @param {number} height - the height to fit into
	 */
	update(chart: Chart, width: number, height: number): void;
};

export interface Plugin<O = AnyObject> extends ExtendedPlugin {
	id: string;

	/**
	 * @desc Called when plugin is installed for this chart instance. This hook is also invoked for disabled plugins (options === false).
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 * @since 3.0.0
	 */
	install?(chart: Chart, args: EmptyObject, options: O): void;
	/**
	 * @desc Called when a plugin is starting. This happens when chart is created or plugin is enabled.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 * @since 3.0.0
	 */
	start?(chart: Chart, args: EmptyObject, options: O): void;
	/**
	 * @desc Called when a plugin stopping. This happens when chart is destroyed or plugin is disabled.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 * @since 3.0.0
	 */
	stop?(chart: Chart, args: EmptyObject, options: O): void;
	/**
	 * @desc Called before initializing `chart`.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 */
	beforeInit?(chart: Chart, args: EmptyObject, options: O): void;
	/**
	 * @desc Called after `chart` has been initialized and before the first update.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 */
	afterInit?(chart: Chart, args: EmptyObject, options: O): void;
	/**
	 * @desc Called before updating `chart`. If any plugin returns `false`, the update
	 * is cancelled (and thus subsequent render(s)) until another `update` is triggered.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {UpdateMode} args.mode - The update mode
	 * @param {object} options - The plugin options.
	 * @returns {boolean} `false` to cancel the chart update.
	 */
	beforeUpdate?(chart: Chart, args: { mode: UpdateMode, cancelable: true }, options: O): boolean | void;
	/**
	 * @desc Called after `chart` has been updated and before rendering. Note that this
	 * hook will not be called if the chart update has been previously cancelled.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {UpdateMode} args.mode - The update mode
	 * @param {object} options - The plugin options.
	 */
	afterUpdate?(chart: Chart, args: { mode: UpdateMode }, options: O): void;
	/**
	 * @desc Called during the update process, before any chart elements have been created.
	 * This can be used for data decimation by changing the data array inside a dataset.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 */
	beforeElementsUpdate?(chart: Chart, args: EmptyObject, options: O): void;
	/**
	 * @desc Called during chart reset
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 * @since version 3.0.0
	 */
	reset?(chart: Chart, args: EmptyObject, options: O): void;
	/**
	 * @desc Called before updating the `chart` datasets. If any plugin returns `false`,
	 * the datasets update is cancelled until another `update` is triggered.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {UpdateMode} args.mode - The update mode.
	 * @param {object} options - The plugin options.
	 * @returns {boolean} false to cancel the datasets update.
	 * @since version 2.1.5
	 */
	beforeDatasetsUpdate?(chart: Chart, args: { mode: UpdateMode }, options: O): boolean | void;
	/**
	 * @desc Called after the `chart` datasets have been updated. Note that this hook
	 * will not be called if the datasets update has been previously cancelled.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {UpdateMode} args.mode - The update mode.
	 * @param {object} options - The plugin options.
	 * @since version 2.1.5
	 */
	afterDatasetsUpdate?(chart: Chart, args: { mode: UpdateMode, cancelable: true }, options: O): void;
	/**
	 * @desc Called before updating the `chart` dataset at the given `args.index`. If any plugin
	 * returns `false`, the datasets update is cancelled until another `update` is triggered.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {number} args.index - The dataset index.
	 * @param {object} args.meta - The dataset metadata.
	 * @param {UpdateMode} args.mode - The update mode.
	 * @param {object} options - The plugin options.
	 * @returns {boolean} `false` to cancel the chart datasets drawing.
	 */
	beforeDatasetUpdate?(chart: Chart, args: { index: number; meta: ChartMeta, mode: UpdateMode, cancelable: true }, options: O): boolean | void;
	/**
	 * @desc Called after the `chart` datasets at the given `args.index` has been updated. Note
	 * that this hook will not be called if the datasets update has been previously cancelled.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {number} args.index - The dataset index.
	 * @param {object} args.meta - The dataset metadata.
	 * @param {UpdateMode} args.mode - The update mode.
	 * @param {object} options - The plugin options.
	 */
	afterDatasetUpdate?(chart: Chart, args: { index: number; meta: ChartMeta, mode: UpdateMode, cancelable: false }, options: O): void;
	/**
	 * @desc Called before laying out `chart`. If any plugin returns `false`,
	 * the layout update is cancelled until another `update` is triggered.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 * @returns {boolean} `false` to cancel the chart layout.
	 */
	beforeLayout?(chart: Chart, args: { cancelable: true }, options: O): boolean | void;
	/**
	 * @desc Called before scale data limits are calculated. This hook is called separately for each scale in the chart.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {Scale} args.scale - The scale.
	 * @param {object} options - The plugin options.
	 */
	beforeDataLimits?(chart: Chart, args: { scale: Scale }, options: O): void;
	/**
	 * @desc Called after scale data limits are calculated. This hook is called separately for each scale in the chart.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {Scale} args.scale - The scale.
	 * @param {object} options - The plugin options.
	 */
	afterDataLimits?(chart: Chart, args: { scale: Scale }, options: O): void;
	/**
	 * @desc Called before scale bulds its ticks. This hook is called separately for each scale in the chart.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {Scale} args.scale - The scale.
	 * @param {object} options - The plugin options.
	 */
	beforeBuildTicks?(chart: Chart, args: { scale: Scale }, options: O): void;
	/**
	 * @desc Called after scale has build its ticks. This hook is called separately for each scale in the chart.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {Scale} args.scale - The scale.
	 * @param {object} options - The plugin options.
	 */
	afterBuildTicks?(chart: Chart, args: { scale: Scale }, options: O): void;
	/**
	 * @desc Called after the `chart` has been laid out. Note that this hook will not
	 * be called if the layout update has been previously cancelled.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 */
	afterLayout?(chart: Chart, args: EmptyObject, options: O): void;
	/**
	 * @desc Called before rendering `chart`. If any plugin returns `false`,
	 * the rendering is cancelled until another `render` is triggered.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 * @returns {boolean} `false` to cancel the chart rendering.
	 */
	beforeRender?(chart: Chart, args: { cancelable: true }, options: O): boolean | void;
	/**
	 * @desc Called after the `chart` has been fully rendered (and animation completed). Note
	 * that this hook will not be called if the rendering has been previously cancelled.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 */
	afterRender?(chart: Chart, args: EmptyObject, options: O): void;
	/**
	 * @desc Called before drawing `chart` at every animation frame. If any plugin returns `false`,
	 * the frame drawing is cancelled untilanother `render` is triggered.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 * @returns {boolean} `false` to cancel the chart drawing.
	 */
	beforeDraw?(chart: Chart, args: { cancelable: true }, options: O): boolean | void;
	/**
	 * @desc Called after the `chart` has been drawn. Note that this hook will not be called
	 * if the drawing has been previously cancelled.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 */
	afterDraw?(chart: Chart, args: EmptyObject, options: O): void;
	/**
	 * @desc Called before drawing the `chart` datasets. If any plugin returns `false`,
	 * the datasets drawing is cancelled until another `render` is triggered.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 * @returns {boolean} `false` to cancel the chart datasets drawing.
	 */
	beforeDatasetsDraw?(chart: Chart, args: { cancelable: true }, options: O): boolean | void;
	/**
	 * @desc Called after the `chart` datasets have been drawn. Note that this hook
	 * will not be called if the datasets drawing has been previously cancelled.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 */
	afterDatasetsDraw?(chart: Chart, args: EmptyObject, options: O, cancelable: false): void;
	/**
	 * @desc Called before drawing the `chart` dataset at the given `args.index` (datasets
	 * are drawn in the reverse order). If any plugin returns `false`, the datasets drawing
	 * is cancelled until another `render` is triggered.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {number} args.index - The dataset index.
	 * @param {object} args.meta - The dataset metadata.
	 * @param {object} options - The plugin options.
	 * @returns {boolean} `false` to cancel the chart datasets drawing.
	 */
	beforeDatasetDraw?(chart: Chart, args: { index: number; meta: ChartMeta }, options: O): boolean | void;
	/**
	 * @desc Called after the `chart` datasets at the given `args.index` have been drawn
	 * (datasets are drawn in the reverse order). Note that this hook will not be called
	 * if the datasets drawing has been previously cancelled.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {number} args.index - The dataset index.
	 * @param {object} args.meta - The dataset metadata.
	 * @param {object} options - The plugin options.
	 */
	afterDatasetDraw?(chart: Chart, args: { index: number; meta: ChartMeta }, options: O): void;
	/**
	 * @desc Called before processing the specified `event`. If any plugin returns `false`,
	 * the event will be discarded.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {ChartEvent} args.event - The event object.
	 * @param {boolean} args.replay - True if this event is replayed from `Chart.update`
	 * @param {object} options - The plugin options.
	 */
	beforeEvent?(chart: Chart, args: { event: ChartEvent, replay: boolean, cancelable: true }, options: O): boolean | void;
	/**
	 * @desc Called after the `event` has been consumed. Note that this hook
	 * will not be called if the `event` has been previously discarded.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {ChartEvent} args.event - The event object.
	 * @param {boolean} args.replay - True if this event is replayed from `Chart.update`
	 * @param {boolean} [args.changed] - Set to true if the plugin needs a render. Should only be changed to true, because this args object is passed through all plugins.
	 * @param {object} options - The plugin options.
	 */
	afterEvent?(chart: Chart, args: { event: ChartEvent, replay: boolean, changed?: boolean, cancelable: false }, options: O): void;
	/**
	 * @desc Called after the chart as been resized.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {number} args.size - The new canvas display size (eq. canvas.style width & height).
	 * @param {object} options - The plugin options.
	 */
	resize?(chart: Chart, args: { size: { width: number, height: number } }, options: O): void;
	/**
	 * Called after the chart has been destroyed.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 */
	destroy?(chart: Chart, args: EmptyObject, options: O): void;
	/**
	 * Called after chart is destroyed on all plugins that were installed for that chart. This hook is also invoked for disabled plugins (options === false).
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {object} options - The plugin options.
	 * @since 3.0.0
	 */
	uninstall?(chart: Chart, args: EmptyObject, options: O): void;
}

export declare type ChartComponentLike = ChartComponent | ChartComponent[] | { [key: string]: ChartComponent };

/**
 * Please use the module's default export which provides a singleton instance
 * Note: class is exported for typedoc
 */
export interface Registry {
	readonly controllers: TypedRegistry<DatasetController>;
	readonly elements: TypedRegistry<Element>;
	readonly plugins: TypedRegistry<Plugin>;
	readonly scales: TypedRegistry<Scale>;

	add(...args: ChartComponentLike[]): void;
	remove(...args: ChartComponentLike[]): void;

	addControllers(...args: ChartComponentLike[]): void;
	addElements(...args: ChartComponentLike[]): void;
	addPlugins(...args: ChartComponentLike[]): void;
	addScales(...args: ChartComponentLike[]): void;

	getController(id: string): DatasetController | undefined;
	getElement(id: string): Element | undefined;
	getPlugin(id: string): Plugin | undefined;
	getScale(id: string): Scale | undefined;
}

export const registry: Registry;

export interface Tick {
	value: number;
	label?: string | string[];
	major?: boolean;
}

export interface CoreScaleOptions {
	/**
	 * Controls the axis global visibility (visible when true, hidden when false). When display: 'auto', the axis is visible only if at least one associated dataset is visible.
	 * @default true
	 */
	display: boolean | 'auto';
	/**
	 * Reverse the scale.
	 * @default false
	 */
	reverse: boolean;
	/**
	 * The weight used to sort the axis. Higher weights are further away from the chart area.
	 * @default true
	 */
	weight: number;
	/**
	 * Callback called before the update process starts.
	 */
	beforeUpdate(axis: Scale): void;
	/**
	 * Callback that runs before dimensions are set.
	 */
	beforeSetDimensions(axis: Scale): void;
	/**
	 * Callback that runs after dimensions are set.
	 */
	afterSetDimensions(axis: Scale): void;
	/**
	 * Callback that runs before data limits are determined.
	 */
	beforeDataLimits(axis: Scale): void;
	/**
	 * Callback that runs after data limits are determined.
	 */
	afterDataLimits(axis: Scale): void;
	/**
	 * Callback that runs before ticks are created.
	 */
	beforeBuildTicks(axis: Scale): void;
	/**
	 * Callback that runs after ticks are created. Useful for filtering ticks.
	 */
	afterBuildTicks(axis: Scale): void;
	/**
	 * Callback that runs before ticks are converted into strings.
	 */
	beforeTickToLabelConversion(axis: Scale): void;
	/**
	 * Callback that runs after ticks are converted into strings.
	 */
	afterTickToLabelConversion(axis: Scale): void;
	/**
	 * Callback that runs before tick rotation is determined.
	 */
	beforeCalculateTickRotation(axis: Scale): void;
	/**
	 * Callback that runs after tick rotation is determined.
	 */
	afterCalculateTickRotation(axis: Scale): void;
	/**
	 * Callback that runs before the scale fits to the canvas.
	 */
	beforeFit(axis: Scale): void;
	/**
	 * Callback that runs after the scale fits to the canvas.
	 */
	afterFit(axis: Scale): void;
	/**
	 * Callback that runs at the end of the update process.
	 */
	afterUpdate(axis: Scale): void;
}

export interface Scale<O extends CoreScaleOptions = CoreScaleOptions> extends Element<{}, O>, LayoutItem {
	readonly id: string;
	readonly type: string;
	readonly ctx: CanvasRenderingContext2D;
	readonly chart: Chart;

	maxWidth: number;
	maxHeight: number;

	paddingTop: number;
	paddingBottom: number;
	paddingLeft: number;
	paddingRight: number;

	axis: string;
	labelRotation: number;
	min: number;
	max: number;
	ticks: Tick[];
	getMatchingVisibleMetas(type?: string): ChartMeta[];

	drawTitle(chartArea: ChartArea): void;
	drawLabels(chartArea: ChartArea): void;
	drawGrid(chartArea: ChartArea): void;

	/**
	 * @param {number} pixel
	 * @return {number}
	 */
	getDecimalForPixel(pixel: number): number;
	/**
	 * Utility for getting the pixel location of a percentage of scale
	 * The coordinate (0, 0) is at the upper-left corner of the canvas
	 * @param {number} decimal
	 * @return {number}
	 */
	getPixelForDecimal(decimal: number): number;
	/**
	 * Returns the location of the tick at the given index
	 * The coordinate (0, 0) is at the upper-left corner of the canvas
	 * @param {number} index
	 * @return {number}
	 */
	getPixelForTick(index: number): number;
	/**
	 * Used to get the label to display in the tooltip for the given value
	 * @param {*} value
	 * @return {string}
	 */
	getLabelForValue(value: number): string;
	/**
	 * Returns the location of the given data point. Value can either be an index or a numerical value
	 * The coordinate (0, 0) is at the upper-left corner of the canvas
	 * @param {*} value
	 * @param {number} [index]
	 * @return {number}
	 */
	getPixelForValue(value: number, index: number): number;

	/**
	 * Used to get the data value from a given pixel. This is the inverse of getPixelForValue
	 * The coordinate (0, 0) is at the upper-left corner of the canvas
	 * @param {number} pixel
	 * @return {*}
	 */
	getValueForPixel(pixel: number): number | undefined;

	getBaseValue(): number;
	/**
	 * Returns the pixel for the minimum chart value
	 * The coordinate (0, 0) is at the upper-left corner of the canvas
	 * @return {number}
	 */
	getBasePixel(): number;

	init(options: O): void;
	parse(raw: unknown, index: number): unknown;
	getUserBounds(): { min: number; max: number; minDefined: boolean; maxDefined: boolean };
	getMinMax(canStack: boolean): { min: number; max: number };
	getTicks(): Tick[];
	getLabels(): string[];
	beforeUpdate(): void;
	configure(): void;
	afterUpdate(): void;
	beforeSetDimensions(): void;
	setDimensions(): void;
	afterSetDimensions(): void;
	beforeDataLimits(): void;
	determineDataLimits(): void;
	afterDataLimits(): void;
	beforeBuildTicks(): void;
	buildTicks(): Tick[];
	afterBuildTicks(): void;
	beforeTickToLabelConversion(): void;
	generateTickLabels(ticks: Tick[]): void;
	afterTickToLabelConversion(): void;
	beforeCalculateLabelRotation(): void;
	calculateLabelRotation(): void;
	afterCalculateLabelRotation(): void;
	beforeFit(): void;
	fit(): void;
	afterFit(): void;

	isFullSize(): boolean;
}
export const Scale: {
	prototype: Scale;
	new <O extends CoreScaleOptions = CoreScaleOptions>(cfg: AnyObject): Scale<O>;
};

export interface ScriptableScaleContext {
	chart: Chart;
	scale: Scale;
	index: number;
	tick: Tick;
}

export const Ticks: {
	formatters: {
		/**
		 * Formatter for value labels
		 * @param value the value to display
		 * @return {string|string[]} the label to display
		 */
		values(value: unknown): string | string[];
		/**
		 * Formatter for numeric ticks
		 * @param tickValue the value to be formatted
		 * @param index the position of the tickValue parameter in the ticks array
		 * @param ticks the list of ticks being converted
		 * @return string representation of the tickValue parameter
		 */
		numeric(tickValue: number, index: number, ticks: { value: number }[]): string;
		/**
		 * Formatter for logarithmic ticks
		 * @param tickValue the value to be formatted
		 * @param index the position of the tickValue parameter in the ticks array
		 * @param ticks the list of ticks being converted
		 * @return string representation of the tickValue parameter
		 */
		logarithmic(tickValue: number, index: number, ticks: { value: number }[]): string;
	};
};

export interface TypedRegistry<T> {
	/**
	 * @param {ChartComponent} item
	 * @returns {string} The scope where items defaults were registered to.
	 */
	register(item: ChartComponent): string;
	get(id: string): T | undefined;
	unregister(item: ChartComponent): void;
}

export interface ChartEvent {
	type:
		| 'contextmenu'
		| 'mouseenter'
		| 'mousedown'
		| 'mousemove'
		| 'mouseup'
		| 'mouseout'
		| 'click'
		| 'dblclick'
		| 'keydown'
		| 'keypress'
		| 'keyup'
		| 'resize';
	native: Event | null;
	x: number | null;
	y: number | null;
}
export interface ChartComponent {
	id: string;
	defaults?: AnyObject;
	defaultRoutes?: { [property: string]: string };

	beforeRegister?(): void;
	afterRegister?(): void;
	beforeUnregister?(): void;
	afterUnregister?(): void;
}

export interface CoreInteractionOptions {
	/**
	 * Sets which elements appear in the tooltip. See Interaction Modes for details.
	 * @default 'nearest'
	 */
	mode: InteractionMode;
	/**
	 * if true, the hover mode only applies when the mouse position intersects an item on the chart.
	 * @default true
	 */
	intersect: boolean;

	/**
	 * Can be set to 'x', 'y', or 'xy' to define which directions are used in calculating distances. Defaults to 'x' for 'index' mode and 'xy' in dataset and 'nearest' modes.
	 */
	axis: 'x' | 'y' | 'xy';
}

export interface HoverInteractionOptions extends CoreInteractionOptions {
	/**
	 * Called when any of the events fire. Passed the event, an array of active elements (bars, points, etc), and the chart.
	 */
	onHover(event: ChartEvent, elements: ActiveElement[], chart: Chart): void;
}

export interface CoreChartOptions extends ParsingOptions {
	animation: Scriptable<AnimationOptions | false, ScriptableContext>;

	datasets: {
		animation: Scriptable<AnimationOptions | false, ScriptableContext>;
	};

	/**
	 * The base axis of the chart. 'x' for vertical charts and 'y' for horizontal charts.
	 * @default 'x'
	 */
	indexAxis: 'x' | 'y';

	/**
	 * base color
	 * @see Defaults.color
	 */
	color: Color;
	/**
	 * base background color
	 * @see Defaults.backgroundColor
	 */
	backgroundColor: Color;
	/**
	 * base border color
	 * @see Defaults.borderColor
	 */
	borderColor: Color;
	/**
	 * base font
	 * @see Defaults.font
	 */
	font: FontSpec;
	/**
	 * Resizes the chart canvas when its container does (important note...).
	 * @default true
	 */
	responsive: boolean;
	/**
	 * Maintain the original canvas aspect ratio (width / height) when resizing.
	 * @default true
	 */
	maintainAspectRatio: boolean;

	/**
	 * Canvas aspect ratio (i.e. width / height, a value of 1 representing a square canvas). Note that this option is ignored if the height is explicitly defined either as attribute or via the style.
	 * @default 2
	 */
	aspectRatio: number;

	/**
	 * Locale used for number formatting (using `Intl.NumberFormat`).
	 * @default user's browser setting
	 */
	locale: string;

	/**
	 * Called when a resize occurs. Gets passed two arguments: the chart instance and the new size.
	 */
	onResize(chart: Chart, size: { width: number; height: number }): void;

	/**
	 * Override the window's default devicePixelRatio.
	 * @default window.devicePixelRatio
	 */
	devicePixelRatio: number;

	interaction: CoreInteractionOptions;

	hover: HoverInteractionOptions;

	/**
	 * The events option defines the browser events that the chart should listen to for tooltips and hovering.
	 * @default ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove']
	 */
	events: ('mousemove' | 'mouseout' | 'click' | 'touchstart' | 'touchmove')[];

	/**
	 * Called when any of the events fire. Passed the event, an array of active elements (bars, points, etc), and the chart.
	 */
	onHover(event: ChartEvent, elements: ActiveElement[], chart: Chart): void;

	/**
	 * Called if the event is of type 'mouseup' or 'click'. Passed the event, an array of active elements, and the chart.
	 */
	onClick(event: ChartEvent, elements: ActiveElement[], chart: Chart): void;

	layout: {
		padding: Scriptable<number | ChartArea, ScriptableContext>;
	};
}

export type EasingFunction =
	| 'linear'
	| 'easeInQuad'
	| 'easeOutQuad'
	| 'easeInOutQuad'
	| 'easeInCubic'
	| 'easeOutCubic'
	| 'easeInOutCubic'
	| 'easeInQuart'
	| 'easeOutQuart'
	| 'easeInOutQuart'
	| 'easeInQuint'
	| 'easeOutQuint'
	| 'easeInOutQuint'
	| 'easeInSine'
	| 'easeOutSine'
	| 'easeInOutSine'
	| 'easeInExpo'
	| 'easeOutExpo'
	| 'easeInOutExpo'
	| 'easeInCirc'
	| 'easeOutCirc'
	| 'easeInOutCirc'
	| 'easeInElastic'
	| 'easeOutElastic'
	| 'easeInOutElastic'
	| 'easeInBack'
	| 'easeOutBack'
	| 'easeInOutBack'
	| 'easeInBounce'
	| 'easeOutBounce'
	| 'easeInOutBounce';

export interface AnimationCommonSpec {
	/**
	 * The number of milliseconds an animation takes.
	 * @default 1000
	 */
	duration: number;
	/**
	 * Easing function to use
	 * @default 'easeOutQuart'
	 */
	easing: EasingFunction;

	/**
	 * Running animation count + FPS display in upper left corner of the chart.
	 * @default false
	 */
	debug: boolean;

	/**
	 * Delay before starting the animations.
	 * @default 0
	 */
	delay: number;

	/**
	 * 	If set to true, the animations loop endlessly.
	 * @default false
	 */
	loop: boolean;
}

export interface AnimationPropertySpec extends AnimationCommonSpec {
	properties: string[];

	/**
	 * Type of property, determines the interpolator used. Possible values: 'number', 'color' and 'boolean'. Only really needed for 'color', because typeof does not get that right.
	 */
	type: 'color' | 'number' | 'boolean';

	fn: <T>(from: T, to: T, factor: number) => T;

	/**
	 * Start value for the animation. Current value is used when undefined
	 */
	from: Color | number | boolean;
	/**
	 *
	 */
	to: Color | number | boolean;
}

export type AnimationSpecContainer = AnimationCommonSpec & {
	[prop: string]: AnimationPropertySpec | false;
};

export type AnimationOptions = AnimationSpecContainer & {
	/**
	 * Callback called on each step of an animation.
	 */
	onProgress: (this: Chart, event: AnimationEvent) => void;
	/**
	 * Callback called when all animations are completed.
	 */
	onComplete: (this: Chart, event: AnimationEvent) => void;

	active: AnimationSpecContainer | false;
	hide: AnimationSpecContainer | false;
	reset: AnimationSpecContainer | false;
	resize: AnimationSpecContainer | false;
	show: AnimationSpecContainer | false;
};

export interface FontSpec {
	/**
	 * Default font family for all text, follows CSS font-family options.
	 * @default "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
	 */
	family: string;
	/**
	 * Default font size (in px) for text. Does not apply to radialLinear scale point labels.
	 * @default 12
	 */
	size: number;
	/**
	 * Default font style. Does not apply to tooltip title or footer. Does not apply to chart title. Follows CSS font-style options (i.e. normal, italic, oblique, initial, inherit)
	 * @default 'normal'
	 */
	style: 'normal' | 'italic' | 'oblique' | 'initial' | 'inherit';
	/**
	 * Default font weight (boldness). (see MDN).
	 */
	weight: string | null;
	/**
	 * Height of an individual line of text (see MDN).
	 * @default 1.2
	 */
	lineHeight: number | string;
}

export type TextAlign = 'left' | 'center' | 'right';

export interface VisualElement {
	draw(ctx: CanvasRenderingContext2D): void;
	inRange(mouseX: number, mouseY: number, useFinalPosition?: boolean): boolean;
	inXRange(mouseX: number, useFinalPosition?: boolean): boolean;
	inYRange(mouseY: number, useFinalPosition?: boolean): boolean;
	getCenterPoint(useFinalPosition?: boolean): { x: number; y: number };
	getRange?(axis: 'x' | 'y'): number;
}

export interface CommonElementOptions {
	borderWidth: number;
	borderColor: Color;
	backgroundColor: Color;
}

export interface CommonHoverOptions {
	hoverBorderWidth: number;
	hoverBorderColor: Color;
	hoverBackgroundColor: Color;
}

export interface Segment {
	start: number;
	end: number;
	loop: boolean;
}

export interface ArcProps {
	x: number;
	y: number;
	startAngle: number;
	endAngle: number;
	innerRadius: number;
	outerRadius: number;
	circumference: number;
}

export interface ArcOptions extends CommonElementOptions {
	/**
	 * Arc stroke alignment.
	 */
	borderAlign: 'center' | 'inner';
	/**
	 * Arc offset (in pixels).
	 */
	offset: number;
}

export interface ArcHoverOptions extends CommonHoverOptions {
	hoverOffset: number;
}

export interface ArcElement<T extends ArcProps = ArcProps, O extends ArcOptions = ArcOptions>
	extends Element<T, O>,
		VisualElement {}

export const ArcElement: ChartComponent & {
	prototype: ArcElement;
	new (cfg: AnyObject): ArcElement;
};

export interface LineProps {}

export interface LineOptions extends CommonElementOptions {
	/**
	 * Line cap style. See MDN.
	 * @default 'butt'
	 */
	borderCapStyle: CanvasLineCap;
	/**
	 * Line dash. See MDN.
	 * @default []
	 */
	borderDash: number[];
	/**
	 * Line dash offset. See MDN.
	 * @default 0.0
	 */
	borderDashOffset: number;
	/**
	 * Line join style. See MDN.
	 * @default 'miter'
	 */
	borderJoinStyle: CanvasLineJoin;
	/**
	 * 	true to keep Bézier control inside the chart, false for no restriction.
	 * @default true
	 */
	capBezierPoints: boolean;
	/**
	 * Interpolation mode to apply.
	 * @default 'default'
	 */
	cubicInterpolationMode: 'default' | 'monotone';
	/**
	 * Bézier curve tension (0 for no Bézier curves).
	 * @default 0
	 */
	tension: number;
	/**
	 * true to show the line as a stepped line (tension will be ignored).
	 * @default false
	 */
	stepped: 'before' | 'after' | 'middle' | boolean;
}

export interface LineHoverOptions extends CommonHoverOptions {
	hoverBorderCapStyle: CanvasLineCap;
	hoverBorderDash: number[];
	hoverBorderDashOffset: number;
	hoverBorderJoinStyle: CanvasLineJoin;
}

export interface LineElement<T extends LineProps = LineProps, O extends LineOptions = LineOptions>
	extends Element<T, O>,
		VisualElement {
	updateControlPoints(chartArea: ChartArea): void;
	points: Point[];
	readonly segments: Segment[];
	first(): Point | false;
	last(): Point | false;
	interpolate(point: Point, property: 'x' | 'y'): undefined | Point | Point[];
	pathSegment(ctx: CanvasRenderingContext2D, segment: Segment, params: AnyObject): undefined | boolean;
	path(ctx: CanvasRenderingContext2D): boolean;
}

export const LineElement: ChartComponent & {
	prototype: LineElement;
	new (cfg: AnyObject): LineElement;
};

export interface PointProps {
	x: number;
	y: number;
}

export type PointStyle =
	| 'circle'
	| 'cross'
	| 'crossRot'
	| 'dash'
	| 'line'
	| 'rect'
	| 'rectRounded'
	| 'rectRot'
	| 'star'
	| 'triangle'
	| HTMLImageElement
	| HTMLCanvasElement;

export interface PointOptions extends CommonElementOptions {
	/**
	 * Point radius
	 * @default 3
	 */
	radius: number;
	/**
	 * Extra radius added to point radius for hit detection.
	 * @default 1
	 */
	hitRadius: number;
	/**
	 * Point style
	 * @default 'circle;
	 */
	pointStyle: PointStyle;
	/**
	 * Point rotation (in degrees).
	 * @default 0
	 */
	rotation: number;
}

export interface PointHoverOptions extends CommonHoverOptions {
	/**
	 * Point radius when hovered.
	 * @default 4
	 */
	hoverRadius: number;
}

export interface PointPrefixedOptions {
	/**
	 * The fill color for points.
	 */
	pointBackgroundColor: Color;
	/**
	 * The border color for points.
	 */
	pointBorderColor: Color;
	/**
	 * The width of the point border in pixels.
	 */
	pointBorderWidth: number;
	/**
	 * The pixel size of the non-displayed point that reacts to mouse events.
	 */
	pointHitRadius: number;
	/**
	 * The radius of the point shape. If set to 0, the point is not rendered.
	 */
	pointRadius: number;
	/**
	 * The rotation of the point in degrees.
	 */
	pointRotation: number;
	/**
	 * Style of the point.
	 */
	pointStyle: PointStyle;
}

export interface PointPrefixedHoverOptions {
	/**
	 * Point background color when hovered.
	 */
	pointHoverBackgroundColor: Color;
	/**
	 * Point border color when hovered.
	 */
	pointHoverBorderColor: Color;
	/**
	 * Border width of point when hovered.
	 */
	pointHoverBorderWidth: number;
	/**
	 * The radius of the point when hovered.
	 */
	pointHoverRadius: number;
}

export interface PointElement<T extends PointProps = PointProps, O extends PointOptions = PointOptions>
	extends Element<T, O>,
		VisualElement {
	readonly skip: boolean;
}

export const PointElement: ChartComponent & {
	prototype: PointElement;
	new (cfg: AnyObject): PointElement;
};

export interface BarProps {
	x: number;
	y: number;
	base: number;
	horizontal: boolean;
	width: number;
	height: number;
}

export interface BarOptions extends CommonElementOptions {
	/**
	 * The base value for the bar in data units along the value axis.
	 */
	base: number;

	/**
	 * 	Skipped (excluded) border: 'start', 'end', 'bottom', 'left', 'top' or 'right'.
	 * @default 'start'
	 */
	borderSkipped: 'start' | 'end' | 'left' | 'right' | 'bottom' | 'top';

	/**
	 * Border radius like css. use number/string to px, 5 => '5' => '5px' => 5px; use string to percentage, '50%' => 50%
	 * @default 0
	 */
	borderRadius: number| string | BorderRadius;
}

export interface BorderRadius {
	topLeft: number | string;
	topRight: number | string;
	bottomLeft: number | string;
	bottomRight: number | string;
}

export interface BarHoverOptions extends CommonHoverOptions {
	hoverBorderRadius: number | BorderRadius;
}

export interface BarElement<
	T extends BarProps = BarProps,
	O extends BarOptions = BarOptions
> extends Element<T, O>, VisualElement {}

export const BarElement: ChartComponent & {
	prototype: BarElement;
	new (cfg: AnyObject): BarElement;
};

export interface ElementOptionsByType {
	arc: ArcOptions & ArcHoverOptions;
	bar: BarOptions & BarHoverOptions;
	line: LineOptions & LineHoverOptions;
	point: PointOptions & PointHoverOptions;
}
export interface ElementChartOptions {
	elements: Partial<ElementOptionsByType>;
}

export class BasePlatform {
	/**
	 * Called at chart construction time, returns a context2d instance implementing
	 * the [W3C Canvas 2D Context API standard]{@link https://www.w3.org/TR/2dcontext/}.
	 * @param {HTMLCanvasElement} canvas - The canvas from which to acquire context (platform specific)
	 * @param options - The chart options
	 */
	acquireContext(
		canvas: HTMLCanvasElement,
		options?: CanvasRenderingContext2DSettings
	): CanvasRenderingContext2D | null;
	/**
	 * Called at chart destruction time, releases any resources associated to the context
	 * previously returned by the acquireContext() method.
	 * @param {CanvasRenderingContext2D} context - The context2d instance
	 * @returns {boolean} true if the method succeeded, else false
	 */
	releaseContext(context: CanvasRenderingContext2D): boolean;
	/**
	 * Registers the specified listener on the given chart.
	 * @param {Chart} chart - Chart from which to listen for event
	 * @param {string} type - The ({@link ChartEvent}) type to listen for
	 * @param listener - Receives a notification (an object that implements
	 * the {@link ChartEvent} interface) when an event of the specified type occurs.
	 */
	addEventListener(chart: Chart, type: string, listener: (e: ChartEvent) => void): void;
	/**
	 * Removes the specified listener previously registered with addEventListener.
	 * @param {Chart} chart - Chart from which to remove the listener
	 * @param {string} type - The ({@link ChartEvent}) type to remove
	 * @param listener - The listener function to remove from the event target.
	 */
	removeEventListener(chart: Chart, type: string, listener: (e: ChartEvent) => void): void;
	/**
	 * @returns {number} the current devicePixelRatio of the device this platform is connected to.
	 */
	getDevicePixelRatio(): number;
	/**
	 * @param {HTMLCanvasElement} canvas - The canvas for which to calculate the maximum size
	 * @param {number} [width] - Parent element's content width
	 * @param {number} [height] - Parent element's content height
	 * @param {number} [aspectRatio] - The aspect ratio to maintain
	 * @returns { width: number, height: number } the maximum size available.
	 */
	getMaximumSize(canvas: HTMLCanvasElement, width?: number, height?: number, aspectRatio?: number): { width: number, height: number };
	/**
	 * @param {HTMLCanvasElement} canvas
	 * @returns {boolean} true if the canvas is attached to the platform, false if not.
	 */
	isAttached(canvas: HTMLCanvasElement): boolean;
}

export class BasicPlatform extends BasePlatform {}
export class DomPlatform extends BasePlatform {}

export declare enum DecimationAlgorithm {
	minmax = 'min-max',
}

export interface DecimationOptions {
	enabled: boolean;
	algorithm: DecimationAlgorithm;
}

export const Filler: Plugin;
export interface FillerOptions {
	propagate: boolean;
}

export type FillTarget = number | string | { value: number } | 'start' | 'end' | 'origin' | 'stack' | false;

export interface ComplexFillTarget {
	/**
	 * The accepted values are the same as the filling mode values, so you may use absolute and relative dataset indexes and/or boundaries.
	 */
	target: FillTarget;
	/**
	 * If no color is set, the default color will be the background color of the chart.
	 */
	above: Color;
	/**
	 * Same as the above.
	 */
	below: Color;
}

export interface FillerControllerDatasetOptions {
	/**
	 * Both line and radar charts support a fill option on the dataset object which can be used to create area between two datasets or a dataset and a boundary, i.e. the scale origin, start or end
	 */
	fill: FillTarget | ComplexFillTarget;
}

export const Legend: Plugin;

export interface LegendItem {
	/**
	 * Label that will be displayed
	 */
	text: string;

	/**
	 * Index of the associated dataset
	 */
	datasetIndex: number;

	/**
	 * Fill style of the legend box
	 */
	fillStyle?: Color;

	/**
	 * If true, this item represents a hidden dataset. Label will be rendered with a strike-through effect
	 */
	hidden?: boolean;

	/**
	 * For box border.
	 * @see https://developer.mozilla.org/en/docs/Web/API/CanvasRenderingContext2D/lineCap
	 */
	lineCap?: CanvasLineCap;

	/**
	 * For box border.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
	 */
	lineDash?: number[];

	/**
	 * For box border.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineDashOffset
	 */
	lineDashOffset?: number;

	/**
	 * For box border.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin
	 */
	lineJoin?: CanvasLineJoin;

	/**
	 * Width of box border
	 */
	lineWidth?: number;

	/**
	 * Stroke style of the legend box
	 */
	strokeStyle?: Color;

	/**
	 * Point style of the legend box (only used if usePointStyle is true)
	 */
	pointStyle?: PointStyle;

	/**
	 * Rotation of the point in degrees (only used if usePointStyle is true)
	 */
	rotation?: number;
}

export interface LegendElement extends Element, LayoutItem {}

export interface LegendOptions {
	/**
	 * Is the legend shown?
	 * @default true
	 */
	display: boolean;
	/**
	 * Position of the legend.
	 * @default 'top'
	 */
	position: LayoutPosition;
	/**
	 * Alignment of the legend.
	 * @default 'center'
	 */
	align: TextAlign;
	/**
	 * Marks that this box should take the full width/height of the canvas (moving other boxes). This is unlikely to need to be changed in day-to-day use.
	 * @default true
	 */
	fullSize: boolean;
	/**
	 * Legend will show datasets in reverse order.
	 * @default false
	 */
	reverse: boolean;
	/**
	 * A callback that is called when a click event is registered on a label item.
	 */
	onClick(this: LegendElement, e: ChartEvent, legendItem: LegendItem, legend: LegendElement): void;
	/**
	 * A callback that is called when a 'mousemove' event is registered on top of a label item
	 */
	onHover(this: LegendElement, e: ChartEvent, legendItem: LegendItem, legend: LegendElement): void;
	/**
	 * A callback that is called when a 'mousemove' event is registered outside of a previously hovered label item.
	 */
	onLeave(this: LegendElement, e: ChartEvent, legendItem: LegendItem, legend: LegendElement): void;

	labels: {
		/**
		 * Width of colored box.
		 * @default 40
		 */
		boxWidth: number;
		/**
		 * Height of the coloured box.
		 * @default fontSize
		 */
		boxHeight: number;
		/**
		 * Color of label
		 * @see Defaults.color
		 */
		color: Color;
		/**
		 * Font of label
		 * @see Defaults.font
		 */
		font: FontSpec;
		/**
		 * Padding between rows of colored boxes.
		 * @default 10
		 */
		padding: number;
		/**
		 * Generates legend items for each thing in the legend. Default implementation returns the text + styling for the color box. See Legend Item for details.
		 */
		generateLabels(chart: Chart): LegendItem[];

		/**
		 * Filters legend items out of the legend. Receives 2 parameters, a Legend Item and the chart data
		 */
		filter(item: LegendItem, data: ChartData): boolean;

		/**
		 * Sorts the legend items
		 */
		sort(a: LegendItem, b: LegendItem, data: ChartData): number;

		/**
		 * Override point style for the legend. Only applies if usePointStyle is true
		 */
		pointStyle: PointStyle;

		/**
		 * Label style will match corresponding point style (size is based on the minimum value between boxWidth and font.size).
		 * @default false
		 */
		usePointStyle: boolean;
	};

	title: {
		/**
		 * Is the legend title displayed.
		 * @default false
		 */
		display: boolean;
		/**
		 * Color of title
		 * @see Defaults.color
		 */
		color: Color;
		/**
		 * see Fonts
		 */
		font: FontSpec;
		position: 'center' | 'start' | 'end';
		padding?: number | ChartArea;
		/**
		 * The string title.
		 */
		text: string;
	};
}

export const Title: Plugin;

export interface TitleOptions {
	/**
	 * Alignment of the title.
	 * @default 'center'
	 */
	align: 'start' | 'center' | 'end';
	/**
	 * Is the title shown?
	 * @default false
	 */
	display: boolean;
	/**
	 * Position of title
	 * @default 'top'
	 */
	position: 'top' | 'left' | 'bottom' | 'right';
	/**
	 * Color of text
	 * @see Defaults.color
	 */
	color: Color;
	font: FontSpec;
	// fullSize: boolean;
	/**
	 * 	Adds padding above and below the title text if a single number is specified. It is also possible to change top and bottom padding separately.
	 */
	padding: number | { top: number; bottom: number };
	/**
	 * 	Title text to display. If specified as an array, text is rendered on multiple lines.
	 */
	text: string | string[];
}

export type TooltipAlignment = 'start' | 'center' | 'end';

export interface TooltipModel {
	// The items that we are rendering in the tooltip. See Tooltip Item Interface section
	dataPoints: TooltipItem[];

	// Positioning
	xAlign: TooltipAlignment;
	yAlign: TooltipAlignment;

	// X and Y properties are the top left of the tooltip
	x: number;
	y: number;
	width: number;
	height: number;
	// Where the tooltip points to
	caretX: number;
	caretY: number;

	// Body
	// The body lines that need to be rendered
	// Each object contains 3 parameters
	// before: string[] // lines of text before the line with the color square
	// lines: string[]; // lines of text to render as the main item with color square
	// after: string[]; // lines of text to render after the main lines
	body: { before: string[]; lines: string[]; after: string[] }[];
	// lines of text that appear after the title but before the body
	beforeBody: string[];
	// line of text that appear after the body and before the footer
	afterBody: string[];

	// Title
	// lines of text that form the title
	title: string[];

	// Footer
	// lines of text that form the footer
	footer: string[];

	// colors to render for each item in body[]. This is the color of the squares in the tooltip
	labelColors: Color[];
	labelTextColors: Color[];
	labelPointStyles: { pointStyle: PointStyle; rotation: number }[];

	// 0 opacity is a hidden tooltip
	opacity: number;

	// tooltip options
	options: TooltipOptions;
}

export const Tooltip: Plugin & {
	readonly positioners: {
		[key: string]: (items: readonly Element[], eventPosition: { x: number; y: number }) => { x: number; y: number };
	};

	getActiveElements(): ActiveElement[];
	setActiveElements(active: ActiveDataPoint[], eventPosition: { x: number, y: number }): void;
};

export interface TooltipCallbacks {
	beforeTitle(this: TooltipModel, tooltipItems: TooltipItem[]): string | string[];
	title(this: TooltipModel, tooltipItems: TooltipItem[]): string | string[];
	afterTitle(this: TooltipModel, tooltipItems: TooltipItem[]): string | string[];

	beforeBody(this: TooltipModel, tooltipItems: TooltipItem[]): string | string[];
	afterBody(this: TooltipModel, tooltipItems: TooltipItem[]): string | string[];

	beforeLabel(this: TooltipModel, tooltipItem: TooltipItem): string | string[];
	label(this: TooltipModel, tooltipItem: TooltipItem): string | string[];
	afterLabel(this: TooltipModel, tooltipItem: TooltipItem): string | string[];

	labelColor(this: TooltipModel, tooltipItem: TooltipItem): { borderColor: Color; backgroundColor: Color };
	labelTextColor(this: TooltipModel, tooltipItem: TooltipItem): Color;
	labelPointStyle(this: TooltipModel, tooltipItem: TooltipItem): { pointStyle: PointStyle; rotation: number };

	beforeFooter(this: TooltipModel, tooltipItems: TooltipItem[]): string | string[];
	footer(this: TooltipModel, tooltipItems: TooltipItem[]): string | string[];
	afterFooter(this: TooltipModel, tooltipItems: TooltipItem[]): string | string[];
}

export interface ExtendedPlugin<O = {}> {
	/**
	 * @desc Called before drawing the `tooltip`. If any plugin returns `false`,
	 * the tooltip drawing is cancelled until another `render` is triggered.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {Tooltip} args.tooltip - The tooltip.
	 * @param {object} options - The plugin options.
	 * @returns {boolean} `false` to cancel the chart tooltip drawing.
	 */
	beforeTooltipDraw?(chart: Chart, args: { tooltip: TooltipModel }, options: O): boolean | void;
	/**
	 * @desc Called after drawing the `tooltip`. Note that this hook will not
	 * be called if the tooltip drawing has been previously cancelled.
	 * @param {Chart} chart - The chart instance.
	 * @param {object} args - The call arguments.
	 * @param {Tooltip} args.tooltip - The tooltip.
	 * @param {object} options - The plugin options.
	 */
	afterTooltipDraw?(chart: Chart, args: { tooltip: TooltipModel }, options: O): void;
}
export interface TooltipOptions extends CoreInteractionOptions {
	/**
	 * Are on-canvas tooltips enabled?
	 * @default true
	 */
	enabled: boolean;
	/**
	 * 	See custom tooltip section.
	 */
	custom(this: TooltipModel, args: { chart: Chart; tooltip: TooltipModel }): void;
	/**
	 * The mode for positioning the tooltip
	 */
	position: 'average' | 'nearest';

	/**
	 * Override the tooltip alignment calculations
	 */
	xAlign: TooltipAlignment;
	yAlign: TooltipAlignment;

	/**
	 * Sort tooltip items.
	 */
	itemSort: (a: TooltipItem, b: TooltipItem) => number;

	filter: (e: TooltipItem) => boolean;

	/**
	 * Background color of the tooltip.
	 * @default 'rgba(0, 0, 0, 0.8)'
	 */
	backgroundColor: Color;
	/**
	 * Color of title
	 * @default '#fff'
	 */
	titleColor: Color;
	/**
	 * See Fonts
	 * @default {style: 'bold'}
	 */
	titleFont: FontSpec;
	/**
	 * Spacing to add to top and bottom of each title line.
	 * @default 2
	 */
	titleSpacing: number;
	/**
	 * Margin to add on bottom of title section.
	 * @default 6
	 */
	titleMarginBottom: number;
	/**
	 * Horizontal alignment of the title text lines.
	 * @default 'left'
	 */
	titleAlign: TextAlign;
	/**
	 * Spacing to add to top and bottom of each tooltip item.
	 * @default 2
	 */
	bodySpacing: number;
	/**
	 * Color of body
	 * @default '#fff'
	 */
	bodyColor: Color;
	/**
	 * 	See Fonts.
	 * @default {}
	 */
	bodyFont: FontSpec;
	/**
	 * Horizontal alignment of the body text lines.
	 * @default 'left'
	 */
	bodyAlign: TextAlign;
	/**
	 * Spacing to add to top and bottom of each footer line.
	 * @default 2
	 */
	footerSpacing: number;
	/**
	 * Margin to add before drawing the footer.
	 * @default 6
	 */
	footerMarginTop: number;
	/**
	 * Color of footer
	 * @default '#fff'
	 */
	footerColor: Color;
	/**
	 * See Fonts
	 * @default {style: 'bold'}
	 */
	footerFont: FontSpec;
	/**
	 * Horizontal alignment of the footer text lines.
	 * @default 'left'
	 */
	footerAlign: TextAlign;
	/**
	 * Padding to add on left and right of tooltip.
	 * @default 6
	 */
	xPadding: number;
	/**
	 * Padding to add on top and bottom of tooltip.
	 * @default 6
	 */
	yPadding: number;
	/**
	 * 	Extra distance to move the end of the tooltip arrow away from the tooltip point.
	 * @default 2
	 */
	caretPadding: number;
	/**
	 * Size, in px, of the tooltip arrow.
	 * @default 5
	 */
	caretSize: number;
	/**
	 * Radius of tooltip corner curves.
	 * @default 6
	 */
	cornerRadius: number;
	/**
	 * Color to draw behind the colored boxes when multiple items are in the tooltip.
	 * @default '#fff'
	 */
	multiKeyBackground: Color;
	/**
	 * If true, color boxes are shown in the tooltip.
	 * @default true
	 */
	displayColors: boolean;
	/**
	 * Width of the color box if displayColors is true.
	 * @default bodyFont.size
	 */
	boxWidth: number;
	/**
	 * Height of the color box if displayColors is true.
	 * @default bodyFont.size
	 */
	boxHeight: number;
	/**
	 * Use the corresponding point style (from dataset options) instead of color boxes, ex: star, triangle etc. (size is based on the minimum value between boxWidth and boxHeight)
	 * @default false
	 */
	usePointStyle: boolean;
	/**
	 * Color of the border.
	 * @default 'rgba(0, 0, 0, 0)'
	 */
	borderColor: Color;
	/**
	 * Size of the border.
	 * @default 0
	 */
	borderWidth: number;
	/**
	 * true for rendering the legends from right to left.
	 */
	rtl: boolean;

	/**
	 * This will force the text direction 'rtl' or 'ltr on the canvas for rendering the tooltips, regardless of the css specified on the canvas
	 * @default canvas's default
	 */
	textDirection: string;

	animation: Scriptable<AnimationSpecContainer, ScriptableContext>;

	callbacks: TooltipCallbacks;
}

export interface TooltipItem {
	/**
	 * The chart the tooltip is being shown on
	 */
	chart: Chart;

	/**
	 * Label for the tooltip
	 */
	label: string;

	/**
	 * Parsed data values for the given `dataIndex` and `datasetIndex`
	 */
	parsed: unknown;

	/**
	 * Raw data values for the given `dataIndex` and `datasetIndex`
	 */
	raw: unknown;

	/**
	 * Formatted value for the tooltip
	 */
	formattedValue: string;

	/**
	 * The dataset the item comes from
	 */
	dataset: ChartDataset;

	/**
	 * Index of the dataset the item comes from
	 */
	datasetIndex: number;

	/**
	 * Index of this data item in the dataset
	 */
	dataIndex: number;

	/**
	 * The chart element (point, arc, bar, etc.) for this tooltip item
	 */
	element: Element;
}

export interface PluginOptionsByType {
	decimation: DecimationOptions;
	filler: FillerOptions;
	legend: LegendOptions;
	title: TitleOptions;
	tooltip: TooltipOptions;
}
export interface PluginChartOptions {
	plugins: Partial<PluginOptionsByType>;
}

export interface GridLineOptions {
	/**
	 * @default true
	 */
	display: boolean;
	borderColor: Color;
	borderWidth: number;
	/**
	 * @default false
	 */
	circular: boolean;
	/**
	 * @default 'rgba(0, 0, 0, 0.1)'
	 */
	color: Scriptable<Color, ScriptableScaleContext> | readonly Color[];
	/**
	 * @default []
	 */
	borderDash: number[];
	/**
	 * @default 0
	 */
	borderDashOffset: Scriptable<number, ScriptableScaleContext>;
	/**
	 * @default 1
	 */
	lineWidth: Scriptable<number, ScriptableScaleContext> | readonly number[];

	/**
	 * @default true
	 */
	drawBorder: boolean;
	/**
	 * @default true
	 */
	drawOnChartArea: boolean;
	/**
	 * @default true
	 */
	drawTicks: boolean;
	/**
	 * @default []
	 */
	tickBorderDash: number[];
	/**
	 * @default 0
	 */
	tickBorderDashOffset: Scriptable<number, ScriptableScaleContext>;
	/**
	 * @default 'rgba(0, 0, 0, 0.1)'
	 */
	tickColor: Scriptable<Color, ScriptableScaleContext> | readonly Color[];
	/**
	 * @default 10
	 */
	tickLength: number;
	/**
	 * @default 1
	 */
	tickWidth: number;
	/**
	 * @default false
	 */
	offsetGridLines: boolean;
}

export interface TickOptions {
	/**
	 * Returns the string representation of the tick value as it should be displayed on the chart. See callback.
	 */
	callback: (tickValue: unknown, index: number, ticks: Tick[]) => string;
	/**
	 * If true, show tick labels.
	 * @default true
	 */
	display: boolean;
	/**
	 * Color of tick
	 * @see Defaults.color
	 */
	color: Scriptable<Color, ScriptableScaleContext>;
	/**
	 * see Fonts
	 */
	font: Scriptable<FontSpec, ScriptableScaleContext>;
	/**
	 * Sets the offset of the tick labels from the axis
	 */
	padding: number;
	/**
	 * The color of the stroke around the text.
	 * @default undefined
	 */
	textStrokeColor: Scriptable<Color, ScriptableScaleContext>;
	/**
	 * Stroke width around the text.
	 * @default 0
	 */
	textStrokeWidth: Scriptable<number, ScriptableScaleContext>;
	/**
	 * z-index of tick layer. Useful when ticks are drawn on chart area. Values <= 0 are drawn under datasets, > 0 on top.
	 * @default 0
	 */
	z: number;

	major: {
		/**
		 * If true, major ticks are generated. A major tick will affect autoskipping and major will be defined on ticks in the scriptable options context.
		 * @default false
		 */
		enabled: boolean;
	};
}

export interface CartesianScaleOptions extends CoreScaleOptions {
	/**
	 * Position of the axis.
	 */
	position: 'left' | 'top' | 'right' | 'bottom' | 'center' | { [scale: string]: number };
	/**
	 * 	Which type of axis this is. Possible values are: 'x', 'y'. If not set, this is inferred from the first character of the ID which should be 'x' or 'y'.
	 */
	axis: 'x' | 'y';

	/**
	 * User defined minimum value for the scale, overrides minimum value from data.
	 */
	min: number;

	/**
	 * User defined maximum value for the scale, overrides maximum value from data.
	 */
	max: number;

	/**
	 * 	If true, extra space is added to the both edges and the axis is scaled to fit into the chart area. This is set to true for a bar chart by default.
	 * @default false
	 */
	offset: boolean;

	gridLines: GridLineOptions;

	scaleLabel: {
		display: boolean;
		labelString: string;
		color: Color;
		font: FontSpec;
		padding: {
			top: number;
			bottom: number;
		};
	};

	/**
	 * 	If true, data will be comprised between datasets of data
	 * @default false
	 */
	stacked?: boolean;

	ticks: TickOptions & {
		/**
		 * The number of ticks to examine when deciding how many labels will fit. Setting a smaller value will be faster, but may be less accurate when there is large variability in label length.
		 * @default ticks.length
		 */
		sampleSize: number;
		/**
		 * The label alignment
		 * @default 'center'
		 */
		align: 'start' | 'center' | 'end';
		/**
		 * 	If true, automatically calculates how many labels can be shown and hides labels accordingly. Labels will be rotated up to maxRotation before skipping any. Turn autoSkip off to show all labels no matter what.
		 * @default true
		 */
		autoSkip: boolean;
		/**
		 * Padding between the ticks on the horizontal axis when autoSkip is enabled.
		 * @default 0
		 */
		autoSkipPadding: number;

		/**
		 * How is the label positioned perpendicular to the axis direction.
		 * This only applies when the rotation is 0 and the axis position is one of "top", "left", "right", or "bottom"
		 * @default 'near'
		 */
		crossAlign: 'near' | 'center' | 'far';

		/**
		 * Distance in pixels to offset the label from the centre point of the tick (in the x direction for the x axis, and the y direction for the y axis). Note: this can cause labels at the edges to be cropped by the edge of the canvas
		 * @default 0
		 */
		labelOffset: number;

		/**
		 * Minimum rotation for tick labels. Note: Only applicable to horizontal scales.
		 * @default 0
		 */
		minRotation: number;
		/**
		 * Maximum rotation for tick labels when rotating to condense labels. Note: Rotation doesn't occur until necessary. Note: Only applicable to horizontal scales.
		 * @default 50
		 */
		maxRotation: number;
		/**
		 * Flips tick labels around axis, displaying the labels inside the chart instead of outside. Note: Only applicable to vertical scales.
		 * @default false
		 */
		mirror: boolean;
		/**
		 * 	Padding between the tick label and the axis. When set on a vertical axis, this applies in the horizontal (X) direction. When set on a horizontal axis, this applies in the vertical (Y) direction.
		 * @default 0
		 */
		padding: number;
	};
}

export type CategoryScaleOptions = CartesianScaleOptions & {
	min: string | number;
	max: string | number;
	labels: string[] | string[][];
};

export type CategoryScale<O extends CategoryScaleOptions = CategoryScaleOptions> = Scale<O>
export const CategoryScale: ChartComponent & {
	prototype: CategoryScale;
	new <O extends CategoryScaleOptions = CategoryScaleOptions>(cfg: AnyObject): CategoryScale<O>;
};

export type LinearScaleOptions = CartesianScaleOptions & {

	/**
	 *	if true, scale will include 0 if it is not already included.
	 * @default true
	 */
	beginAtZero: boolean;

	/**
	 * Adjustment used when calculating the maximum data value.
	 * @see https://www.chartjs.org/docs/next/axes/cartesian/linear#axis-range-settings
	 */
	suggestedMin?: number;
	/**
	 * Adjustment used when calculating the minimum data value.
	 * @see https://www.chartjs.org/docs/next/axes/cartesian/linear#axis-range-settings
	 */
	suggestedMax?: number;

	ticks: {
		/**
		 * The Intl.NumberFormat options used by the default label formatter
		 */
		format: Intl.NumberFormatOptions;

		/**
		 * Maximum number of ticks and gridlines to show.
		 * @default 11
		 */
		maxTicksLimit: number;
		/**
		 * if defined and stepSize is not specified, the step size will be rounded to this many decimal places.
		 */
		precision: number;

		/**
		 * User defined fixed step size for the scale
		 * @see https://www.chartjs.org/docs/next/axes/cartesian/linear#step-size
		 */
		stepSize: number;
	};
};

export type LinearScale<O extends LinearScaleOptions = LinearScaleOptions> = Scale<O>
export const LinearScale: ChartComponent & {
	prototype: LinearScale;
	new <O extends LinearScaleOptions = LinearScaleOptions>(cfg: AnyObject): LinearScale<O>;
};

export type LogarithmicScaleOptions = CartesianScaleOptions & {

	/**
	 * Adjustment used when calculating the maximum data value.
	 * @see https://www.chartjs.org/docs/next/axes/cartesian/linear#axis-range-settings
	 */
	suggestedMin?: number;
	/**
	 * Adjustment used when calculating the minimum data value.
	 * @see https://www.chartjs.org/docs/next/axes/cartesian/linear#axis-range-settings
	 */
	suggestedMax?: number;

	ticks: {
		/**
		 * The Intl.NumberFormat options used by the default label formatter
		 */
		format: Intl.NumberFormatOptions;
	};
};

export type LogarithmicScale<O extends LogarithmicScaleOptions = LogarithmicScaleOptions> = Scale<O>
export const LogarithmicScale: ChartComponent & {
	prototype: LogarithmicScale;
	new <O extends LogarithmicScaleOptions = LogarithmicScaleOptions>(cfg: AnyObject): LogarithmicScale<O>;
};

export type TimeScaleOptions = CartesianScaleOptions & {
	/**
	 * Scale boundary strategy (bypassed by min/max time options)
	 * - `data`: make sure data are fully visible, ticks outside are removed
	 * - `ticks`: make sure ticks are fully visible, data outside are truncated
	 * @see https://www.chartjs.org/docs/next/axes/cartesian/time#scale-bounds
	 * @since 2.7.0
	 * @default 'data'
	 */
	bounds: 'ticks' | 'data';

	/**
	 * options for creating a new adapter instance
	 */
	adapters: {
		date: unknown;
	};

	time: {
		/**
		 * Custom parser for dates.
		 * @see https://www.chartjs.org/docs/next/axes/cartesian/time#parser
		 */
		parser: string | ((v: unknown) => number);
		/**
		 * If defined, dates will be rounded to the start of this unit. See Time Units below for the allowed units.
		 */
		round: false | TimeUnit;
		/**
		 * If boolean and true and the unit is set to 'week', then the first day of the week will be Monday. Otherwise, it will be Sunday.
		 * If `number`, the index of the first day of the week (0 - Sunday, 6 - Saturday).
		 * @default false
		 */
		isoWeekday: false | number;
		/**
		 * Sets how different time units are displayed.
		 * @see https://www.chartjs.org/docs/next/axes/cartesian/time#display-formats
		 */
		displayFormats: {
			[key: string]: string;
		};
		/**
		 * The format string to use for the tooltip.
		 */
		tooltipFormat: string;
		/**
		 * If defined, will force the unit to be a certain type. See Time Units section below for details.
		 * @default false
		 */
		unit: false | TimeUnit;

		/**
		 * The number of units between grid lines.
		 * @default 1
		 */
		stepSize: number;
		/**
		 * The minimum display format to be used for a time unit.
		 * @default 'millisecond'
		 */
		minUnit: TimeUnit;
	};

	ticks: {
		/**
		 * Ticks generation input values:
		 * - 'auto': generates "optimal" ticks based on scale size and time options.
		 * - 'data': generates ticks from data (including labels from data {t|x|y} objects).
		 * - 'labels': generates ticks from user given `data.labels` values ONLY.
		 * @see https://github.com/chartjs/Chart.js/pull/4507
		 * @since 2.7.0
		 * @default 'auto'
		 * @see https://www.chartjs.org/docs/next/axes/cartesian/time#ticks-source
		 */
		source: 'labels' | 'auto' | 'data';
	};
};

export interface TimeScale<O extends TimeScaleOptions = TimeScaleOptions> extends Scale<O> {
	getDataTimestamps(): number[];
	getLabelTimestamps(): string[];
	normalize(values: number[]): number[];
}

export const TimeScale: ChartComponent & {
	prototype: TimeScale;
	new <O extends TimeScaleOptions = TimeScaleOptions>(cfg: AnyObject): TimeScale<O>;
};

export type TimeSeriesScale<O extends TimeScaleOptions = TimeScaleOptions> = TimeScale<O>
export const TimeSeriesScale: ChartComponent & {
	prototype: TimeSeriesScale;
	new <O extends TimeScaleOptions = TimeScaleOptions>(cfg: AnyObject): TimeSeriesScale<O>;
};

export type RadialLinearScaleOptions = CoreScaleOptions & {
	animate: boolean;

	angleLines: {
		/**
		 * if true, angle lines are shown.
		 * @default true
		 */
		display: boolean;
		/**
		 * Color of angled lines.
		 * @default 'rgba(0, 0, 0, 0.1)'
		 */
		color: Scriptable<Color, ScriptableScaleContext>;
		/**
		 * Width of angled lines.
		 * @default 1
		 */
		lineWidth: Scriptable<number, ScriptableScaleContext>;
		/**
		 * Length and spacing of dashes on angled lines. See MDN.
		 * @default []
		 */
		borderDash: Scriptable<number[], ScriptableScaleContext>;
		/**
		 * Offset for line dashes. See MDN.
		 * @default 0
		 */
		borderDashOffset: Scriptable<number, ScriptableScaleContext>;
	};

	/**
	 * if true, scale will include 0 if it is not already included.
	 * @default false
	 */
	beginAtZero: boolean;

	gridLines: GridLineOptions;

	/**
	 * User defined minimum number for the scale, overrides minimum value from data.
	 */
	min: number;
	/**
	 * User defined maximum number for the scale, overrides maximum value from data.
	 */
	max: number;

	pointLabels: {
		/**
		 * if true, point labels are shown.
		 * @default true
		 */
		display: boolean;
		/**
		 * Color of label
		 * @see Defaults.color
		 */
		color: Scriptable<Color, ScriptableScaleContext>;
		/**
		 * @see https://www.chartjs.org/docs/next/axes/general/fonts.md
		 */
		font: Scriptable<FontSpec, ScriptableScaleContext>;

		/**
		 * Callback function to transform data labels to point labels. The default implementation simply returns the current string.
		 * @default true
		 */
		callback: (label: string) => string;
	};

	/**
	 * Adjustment used when calculating the maximum data value.
	 */
	suggestedMax: number;
	/**
	 * Adjustment used when calculating the minimum data value.
	 */
	suggestedMin: number;

	ticks: TickOptions & {
		/**
		 * Color of label backdrops.
		 * @default 'rgba(255, 255, 255, 0.75)'
		 */
		backdropColor: Scriptable<Color, ScriptableScaleContext>;
		/**
		 * Horizontal padding of label backdrop.
		 * @default 2
		 */
		backdropPaddingX: number;
		/**
		 * Vertical padding of label backdrop.
		 * @default 2
		 */
		backdropPaddingY: number;

		/**
		 * The Intl.NumberFormat options used by the default label formatter
		 */
		format: Intl.NumberFormatOptions;

		/**
		 * Maximum number of ticks and gridlines to show.
		 * @default 11
		 */
		maxTicksLimit: number;

		/**
		 * if defined and stepSize is not specified, the step size will be rounded to this many decimal places.
		 */
		precision: number;

		/**
		 * User defined fixed step size for the scale.
		 */
		stepSize: number;

		/**
		 * If true, draw a background behind the tick labels.
		 * @default true
		 */
		showLabelBackdrop: Scriptable<boolean, ScriptableScaleContext>;
	};
};

export interface RadialLinearScale<O extends RadialLinearScaleOptions = RadialLinearScaleOptions> extends Scale<O> {
	setCenterPoint(leftMovement: number, rightMovement: number, topMovement: number, bottomMovement: number): void;
	getIndexAngle(index: number): number;
	getDistanceFromCenterForValue(value: number): number;
	getValueForDistanceFromCenter(distance: number): number;
	getPointPosition(index: number, distanceFromCenter: number): { x: number; y: number; angle: number };
	getPointPositionForValue(index: number, value: number): { x: number; y: number; angle: number };
	getBasePosition(index: number): { x: number; y: number; angle: number };
}
export const RadialLinearScale: ChartComponent & {
	prototype: RadialLinearScale;
	new <O extends RadialLinearScaleOptions = RadialLinearScaleOptions>(cfg: AnyObject): RadialLinearScale<O>;
};

// DeepPartial implementation taken from the utility-types NPM package, which is
// Copyright (c) 2016 Piotr Witek <piotrek.witek@gmail.com> (http://piotrwitek.github.io)
// and used under the terms of the MIT license
export type DeepPartial<T> = T extends Function
	? T
	: T extends Array<infer U>
	? _DeepPartialArray<U>
	: T extends object
	? _DeepPartialObject<T>
	: T | undefined;
	type _DeepPartialArray<T> = Array<DeepPartial<T>>
	type _DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export type DistributiveArray<T> = T extends unknown ? T[] : never

export interface CartesianScaleTypeRegistry {
	linear: {
		options: LinearScaleOptions;
	};
	logarithmic: {
		options: LogarithmicScaleOptions;
	};
	category: {
		options: CategoryScaleOptions;
	};
	time: {
		options: TimeScaleOptions;
	};
	timeseries: {
		options: TimeScaleOptions;
	};
}

export interface RadialScaleTypeRegistry {
	radialLinear: {
		options: RadialLinearScaleOptions;
	};
}

export interface ScaleTypeRegistry extends CartesianScaleTypeRegistry, RadialScaleTypeRegistry {
}

export type ScaleType = keyof ScaleTypeRegistry;

export interface ChartTypeRegistry {
	bar: {
		chartOptions: BarControllerChartOptions;
		datasetOptions: BarControllerDatasetOptions;
		defaultDataPoint: number;
		scales: keyof CartesianScaleTypeRegistry;
	};
	line: {
		chartOptions: LineControllerChartOptions;
		datasetOptions: LineControllerDatasetOptions & FillerControllerDatasetOptions;
		defaultDataPoint: ScatterDataPoint;
		scales: keyof CartesianScaleTypeRegistry;
	};
	scatter: {
		chartOptions: ScatterControllerChartOptions;
		datasetOptions: ScatterControllerDatasetOptions;
		defaultDataPoint: ScatterDataPoint;
		scales: keyof CartesianScaleTypeRegistry;
	};
	bubble: {
		chartOptions: EmptyObject;
		datasetOptions: BubbleControllerDatasetOptions;
		defaultDataPoint: BubbleDataPoint;
		scales: keyof CartesianScaleTypeRegistry;
	};
	pie: {
		chartOptions: PieControllerChartOptions;
		datasetOptions: PieControllerDatasetOptions;
		defaultDataPoint: PieDataPoint;
		scales: keyof CartesianScaleTypeRegistry;
	};
	doughnut: {
		chartOptions: DoughnutControllerChartOptions;
		datasetOptions: DoughnutControllerDatasetOptions;
		defaultDataPoint: DoughnutDataPoint;
		scales: keyof CartesianScaleTypeRegistry;
	};
	polarArea: {
		chartOptions: PolarAreaControllerChartOptions;
		datasetOptions: PolarAreaControllerDatasetOptions;
		defaultDataPoint: number;
		scales: keyof RadialScaleTypeRegistry;
	};
	radar: {
		chartOptions: RadarControllerChartOptions;
		datasetOptions: RadarControllerDatasetOptions;
		defaultDataPoint: number;
		scales: keyof RadialScaleTypeRegistry;
	};
}

export type ChartType = keyof ChartTypeRegistry;

export type ScaleOptionsByType<TScale extends ScaleType = ScaleType> = DeepPartial<
	{ [key in ScaleType]: { type: key } & ScaleTypeRegistry[key]['options'] }[TScale]
>;

export type DatasetChartOptions<TType extends ChartType = ChartType> = {
	[key in TType]: {
		datasets: ChartTypeRegistry[key]['datasetOptions'];
	};
};

export type ScaleChartOptions<TType extends ChartType = ChartType> = {
	scales: {
		[key: string]: ScaleOptionsByType<ChartTypeRegistry[TType]['scales']>;
	};
};

export type ChartOptions<TType extends ChartType = ChartType> = DeepPartial<
	CoreChartOptions &
	ElementChartOptions &
	PluginChartOptions &
	DatasetChartOptions<TType> &
	ScaleChartOptions<TType> &
	ChartTypeRegistry[TType]['chartOptions']
>;

export type DefaultDataPoint<TType extends ChartType> = ChartType extends TType ? unknown[] : DistributiveArray<
	ChartTypeRegistry[TType]['defaultDataPoint']
>;

export interface ChartDatasetProperties<TType extends ChartType, TData extends unknown[]> {
	type?: TType;
	data: TData;
}

export type ChartDataset<
	TType extends ChartType = ChartType,
	TData extends unknown[] = DefaultDataPoint<TType>
> = DeepPartial<
	{ [key in ChartType]: { type: key } & ChartTypeRegistry[key]['datasetOptions'] }[TType]
> & ChartDatasetProperties<TType, TData>;

export interface ChartData<
	TType extends ChartType = ChartType,
	TData extends unknown[] = DefaultDataPoint<TType>,
	TLabel = unknown
> {
	labels: TLabel[];
	datasets: ChartDataset<TType, TData>[];
}

export interface ChartConfiguration<
	TType extends ChartType = ChartType,
	TData extends unknown[] = DefaultDataPoint<TType>,
	TLabel = unknown
> {
	type: TType;
	data: ChartData<TType, TData, TLabel>;
	options?: ChartOptions<TType>;
	plugins?: Plugin[];
}
