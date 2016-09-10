import operative from 'operative';

export default class FractalRenderer {

	static CreateRenderer(logic) {
		const { getColorForPoint } = logic;
		return operative({
			getColorForPoint,
			render: (parameters) => {
				const getPointForPixel = (n, width, height, viewport) => {
					const { minX, minY, maxX, maxY } = viewport;
					const ax = Math.ceil(n % width);
					const ay = Math.ceil(n / width);
					return {
						x: minX + (ax * ((maxX - minX) / width)),
						y: maxY - (ay * ((maxY - minY) / height)),
					};
				};

				const { viewport, width, height, iterations } = parameters;

				const data = new Array(width * height * 4);
				for (let row = 0; row < height; row++) {
					for (let column = 0; column < width; column++) {
						const n = (row * width) + column;
						const { x, y } = getPointForPixel(n, width, height, viewport);
						const color = getColorForPoint(x, y, iterations);
						const byteOffset = n * 4;
						data[byteOffset + 0] = color[0];
						data[byteOffset + 1] = color[1];
						data[byteOffset + 2] = color[2];
						data[byteOffset + 3] = color[3];
					}
				}

				return data;
			},
		}).render;
	}
}
