export default class MandelbrotLogic {

	static Create(params) {
		const { coloringKey } = params;
		return {
			parameters: {
				colorFunc: MandelbrotLogic.ColoringMethods()[coloringKey],
			},
			getColorForPoint: (x, y, iterations, parameters) => {
				const iterate = (zr, zi, cr, ci) => {
					const z2r = (zr * zr) - (zi * zi);
					const z2i = 2 * zr * zi;
					const r = {
						zr: z2r + cr,
						zi: z2i + ci,
					};
					return r;
				};

				const testEscape = (r, i) => (r * r) + (i * i) >= 4;
				const { colorFunc } = parameters;

				let i = -1;
				let zrc = 0;
				let zic = 0;
				do {
					i++;
					const { zr, zi } = iterate(zrc, zic, x, y);
					zrc = zr;
					zic = zi;
				} while (!testEscape(zrc, zic) && i < iterations);

				const factor = 255 / iterations;
				const base = colorFunc(i, iterations, zrc, zic);
				return [
					Math.trunc(base * factor),
					Math.trunc(base * factor),
					Math.trunc(base * factor),
					255,
				];
			},
		};
	}

	static ColoringMethods() {
		return {
			raw: (n) => n,
			smooth: (n, max, zr, zi) => {
				const abszn = Math.sqrt((zr * zr) + (zi * zi));
				return max + (1 - (Math.log(Math.log(abszn)) / Math.log(2)));
			},
		};
	}
}
