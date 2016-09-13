export default class Utility {

	static AdjustViewportForResolution(viewport, resolution) {
		const { width, height } = resolution;
		const vpWidth = viewport.maxX - viewport.minX;
		const vpHeight = viewport.maxY - viewport.minY;

		const resolutionRatio = width / height;
		const vpRatio = vpWidth / vpHeight;

		const scaleFactor = resolutionRatio / vpRatio;

		const newWidth = vpWidth * scaleFactor;
		const xCenter = viewport.minX + (vpWidth / 2);

		const newHeight = vpHeight;
		const yCenter = viewport.minY + (vpHeight / 2);

		const adjusted = {
			minX: xCenter - (newWidth / 2),
			maxX: xCenter + (newWidth / 2),
			minY: yCenter - (newHeight / 2),
			maxY: yCenter + (newHeight / 2),
		};

		return adjusted;
	}

	static DefaultViewport() {
		return {
			minX: -2.0,
			maxX: 2.0,
			minY: -2.0,
			maxY: 2.0,
		};
	}
}
