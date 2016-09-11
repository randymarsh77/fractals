export default class RenderPool {

	constructor(threads, width, height, createRenderer, onRenderStateChanged) {
		const units = Math.sqrt(threads);

		const w = Math.trunc(width / units);
		const h = Math.trunc(height / units);
		const pool = [];

		for (let row = 0; row < units; row++) {
			for (let col = 0; col < units; col++) {
				pool.push({
					bounds: {
						x: row * w,
						y: col * h,
						width: w,
						height: h,
					},
					renderer: createRenderer(),
				});
			}
		}

		this.renderTasks = 0;
		this.onRenderStateChanged = onRenderStateChanged;
		this.pool = pool;
		this.size = {
			width,
			height,
			units,
			unitWidth: w,
			unitHeight: h,
		};
	}

	render(settings, onPartialRender) {
		const updateRendering = this.updateRenderingState.bind(this);
		this.pool.forEach((x) => {
			updateRendering(1);
			const { bounds, renderer } = x;
			const partialSettings = {
				...settings,
				width: bounds.width,
				height: bounds.height,
				viewport: this.getViewportSlice(settings.viewport, bounds),
			};
			renderer.render(partialSettings)
				.then((data) => {
					onPartialRender(data, bounds);
					updateRendering(-1);
				});
		});
	}

	updateRenderingState(modifier) {
		if (this.renderTasks === 0) {
			this.onRenderStateChanged({
				rendering: true,
			});
		}

		this.renderTasks += modifier;

		if (this.renderTasks === 0) {
			this.onRenderStateChanged({
				rendering: false,
			});
		}
	}

	getViewportSlice(viewport, bounds) {
		const { units, unitWidth, unitHeight } = this.size;
		const { minX, maxX, minY, maxY } = viewport;
		const { x, y } = bounds;
		const vpWidth = maxX - minX;
		const vpHeight = maxY - minY;
		const sliceX = minX + ((vpWidth / units) * (x / unitWidth));
		const sliceY = maxY - ((vpHeight / units) * (y / unitHeight));
		return {
			minX: sliceX,
			maxX: sliceX + (vpWidth / units),
			minY: sliceY - (vpHeight / units),
			maxY: sliceY,
		};
	}
}
