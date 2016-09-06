export default class RenderPool {

	constructor(threads, width, height, createRenderer, onRenderStateChanged) {
		const units = Math.sqrt(threads);

		let w = Math.trunc(width / units);
		let h = Math.trunc(height / units);
		let pool = [];

		for(let row = 0; row < units; row++) {
			for (let col = 0; col < units; col++) {
				pool.push({
					bounds: {
						x: row * w,
						y: col * h,
						width: w,
						height: h,
					},
					render: createRenderer(),
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

	render(parameters, onPartialRender) {
		const updateRendering = this.updateRenderingState.bind(this);
		this.pool.forEach((x) => {
			updateRendering(1);
			let { bounds, render } = x;
			let params = {
				...parameters,
				width: bounds.width,
				height: bounds.height,
				viewport: this.getViewportSlice(parameters.viewport, bounds),
			};
			render(params)
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
		let { width, height, units, unitWidth, unitHeight } = this.size;
		let { minX, maxX, minY, maxY } = viewport;
		let { x, y } = bounds;
		let vpWidth = maxX - minX;
		let vpHeight = maxY - minY;
		let sliceX = minX + (vpWidth / units) * (x / unitWidth);
		let sliceY = maxY - (vpHeight / units) * (y / unitHeight);
		return {
			minX: sliceX,
			maxX: sliceX + vpWidth / units,
			minY: sliceY - vpHeight / units,
			maxY: sliceY,
		};
	}

	dispose() {
		// Once I figure out why .terminate() isn't working on operatives.
	}
}