import operative from 'operative';

export default class FractalRenderer {
	getRenderer() {
		return window.operative((parameters) => {

			let { viewport, width, height, iterations } = parameters;
			console.log('t', viewport);

			let getPointForPixel = (n, width, height, viewport) => {
				let { minX, minY, maxX, maxY } = viewport;
				let ax = Math.ceil(n % width);
				let ay = Math.ceil(n / width);
				return {
					x: minX + ax * ((maxX - minX) / width),
					y: maxY - ay * ((maxY - minY) / height),
				};
			};

			let getColorForPoint = (x, y, iterations) => {

				let iterate = (zr, zi, cr, ci) => {
					const z2r = zr * zr - zi * zi;
					const z2i = 2 * zr * zi;
					let r =  {
						zr: z2r + cr,
						zi: z2i + ci,
					};
					return r;
				};

				let testEscape = (r, i) => {
					return r * r + i * i >= 4;
				};

				let i = -1;
				let zrc = 0;
				let zic = 0;
				do {
					i++;
					let { zr, zi } = iterate(zrc, zic, x, y);
					zrc = zr;
					zic = zi;
				} while (!testEscape(zrc, zic) && i < iterations);

				let factor = 255 / iterations;
				return [
					Math.trunc(i * factor),
					Math.trunc(i * factor),
					Math.trunc(i * factor),
					255,
				];
			};

			let data = new Array(width * height * 4);

			for (let row = 0; row < height; row++) {
				for (let column = 0; column < width; column++) {
					let n = row * width + column;
					let { x, y } = getPointForPixel(n, width, height, viewport);
					let color = getColorForPoint(x, y, iterations);
					let byteOffset = n * 4;
					data[byteOffset + 0] = color[0];
					data[byteOffset + 1] = color[1];
					data[byteOffset + 2] = color[2];
					data[byteOffset + 3] = color[3];
				}
			}

			return data;
		});
	}
}
