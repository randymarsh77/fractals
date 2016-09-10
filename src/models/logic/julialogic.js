export default class JuliaLogic {

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
		let zrc = x;
		let zic = y;
		do {
			i++;
			let { zr, zi } = iterate(zrc, zic, -0.8, 0.156);
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
