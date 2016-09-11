import FractalRenderer from './fractalrenderer';
import RenderCache from './rendercache';
import RenderPool from './renderpool';

export default class Fractal {

	constructor(fractalSettings, renderSettings, onRenderStateChanged) {
		const { type, coloring } = fractalSettings;
		const { logic } = type;
		this.observers = [];
		this.createRenderPool = (workers, width, height) =>
			(new RenderPool(workers, width, height,
				() => FractalRenderer.CreateRenderer(
					logic.create({ coloringKey: coloring.key })),
					onRenderStateChanged));
		this.updateRenderSettings(renderSettings);
	}

	updateRenderSettings(settings) {
		const {
			resolution: oldResolution,
			viewport: oldViewport,
			iterations: oldIterations,
			workers: oldWorkers,
		} = (this.renderSettings || {});
		const { width: oldWidth, height: oldHeight } = (oldResolution || {});
		const newSettings = Object.assign((this.renderSettings || {}), settings);
		const { resolution, viewport, iterations, workers } = newSettings;
		const { width, height } = resolution;

		let settingsChanged = false;
		if (oldWidth !== width || oldHeight !== height || oldWorkers !== workers) {
			settingsChanged = true;
			this.renderpool = this.createRenderPool(workers, width, height);
		}

		settingsChanged = settingsChanged || oldViewport !== viewport || oldIterations !== iterations;
		this.renderSettings = newSettings;

		if (settingsChanged) {
			this.cache = new RenderCache();
			this.raiseChanged();
		}
	}

	observeRenderSettingsChanged(callback) {
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
		const { cache, renderpool, renderSettings } = this;
		const { viewport, iterations } = renderSettings;
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
