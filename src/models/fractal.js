import FractalRenderer from './fractalrenderer';
import RenderCache from './rendercache';
import RenderPool from './renderpool';

export default class Fractal {

	constructor(type, params, onRenderStateChanged) {
		const { logic } = type;
		this.observers = [];
		this.createRenderPool = (workers, width, height) =>
			(new RenderPool(workers, width, height,
				() => FractalRenderer.CreateRenderer(logic), onRenderStateChanged));
		this.updateParameters(params);
	}

	updateParameters(params) {
		const {
			resolution: oldResolution,
			viewport: oldViewport,
			iterations: oldIterations,
			workers: oldWorkers,
		} = (this.parameters || {});
		const { width: oldWidth, height: oldHeight } = (oldResolution || {});
		const newParams = Object.assign((this.parameters || {}), params);
		const { resolution, viewport, iterations, workers } = newParams;
		const { width, height } = resolution;

		let paramsChanged = false;
		if (oldWidth !== width || oldHeight !== height || oldWorkers !== workers) {
			paramsChanged = true;
			this.renderpool = this.createRenderPool(workers, width, height);
		}

		paramsChanged = paramsChanged || oldViewport !== viewport || oldIterations !== iterations;
		this.parameters = newParams;

		if (paramsChanged) {
			this.cache = new RenderCache();
			this.raiseChanged();
		}
	}

	observeParametersChanged(callback) {
		const obj = this;
		obj.observers.push(callback);
		return {
			dispose: () => {
				const i = obj.observers.indexOf(callback);
				obj.observers.splice(i, 1);
			},
		};
	}

	raiseChanged() {
		const { observers } = this;
		for (let i = 0; i < observers.length; i++) {
			const callback = observers[i];
			callback();
		}
	}

	render(canvas) {
		const { cache, renderpool, parameters } = this;
		const { viewport, iterations } = parameters;
		const ctx = canvas.getContext('2d');

		const cacheKey = RenderCache.CreateKey(viewport);
		const cachedData = cache.getAvailableData(cacheKey);
		if (cachedData) {
			for (let i = 0; i < cachedData.length; i++) {
				const data = cachedData[i];
				const { x, y, imageData } = data;
				ctx.putImageData(imageData, x, y);
			}
		} else {
			renderpool.render({ viewport, iterations }, (data, bounds) => {
				const { x, y, width: bWidth, height: bHeight } = bounds;
				const imageData = ctx.createImageData(bWidth, bHeight);
				for (let i = 0; i < bWidth * bHeight * 4; i++) {
					imageData.data[i] = data[i];
				}
				cache.putData(cacheKey, { x, y, imageData });
				ctx.putImageData(imageData, x, y);
			});
		}
	}
}
