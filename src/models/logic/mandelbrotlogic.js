export default class MandelbrotLogic {

	getColorForPoint(x, y, iterations) {

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
	}
}
