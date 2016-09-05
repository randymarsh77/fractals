import FractalRenderer from './fractalrenderer';
import RenderCache from './rendercache';
import RenderPool from './renderpool';

export default class Fractal {

	constructor(params, onRenderStateChanged) {
		const { resolution, workers } = params;
		const { width, height } = resolution;
		this.observers = [];
		this.createRenderPool = (workers, width, height) => (new RenderPool(workers, width, height, (w, h) => new FractalRenderer().getRenderer(), onRenderStateChanged)),
		this.updateParameters(params);
	}

	updateParameters(params) {
		const { resolution: oldResolution, viewport: oldViewport, iterations: oldIterations, workers: oldWorkers } = (this.parameters || {});
		const { width: oldWidth, height: oldHeight } = (oldResolution || {});
		const newParams = Object.assign((this.parameters || {}), params);
		let { resolution, viewport, iterations, workers } = newParams;
		let { width, height } = resolution;

		let paramsChanged = false;
		if (oldWidth != width || oldHeight != height || oldWorkers != workers) {
			paramsChanged = true;
			this.renderpool = this.createRenderPool(workers, width, height);
		}

		paramsChanged = paramsChanged || oldViewport != viewport || oldIterations != iterations;
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
				let i = obj.observers.indexOf(callback);
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
		const { width, height, viewport, iterations } = parameters;
		let ctx = canvas.getContext('2d');

		const cacheKey = cache.createKey(viewport);
		let cachedData = cache.getAvailableData(cacheKey);
		if (cachedData) {
			for (data in cachedData) {
				const { x, y, imageData } = data;
				ctx.putImageData(imageData, x, y);
			};
		} else {
			renderpool.render({ viewport, iterations }, (data, bounds) => {
				let { x, y, width: bWidth, height: bHeight } = bounds;
				let imageData = ctx.createImageData(bWidth, bHeight);
				for (let i = 0; i < bWidth * bHeight * 4; i++) {
					imageData.data[i] = data[i];
				}
				cache.putData(cacheKey, { x, y, imageData });
				ctx.putImageData(imageData, x, y);
			});
		}
	}
}
