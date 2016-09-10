export default class JuliaLogic {

	static Create() {
		return {
			getColorForPoint(x, y, iterations) {
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

				let i = -1;
				let zrc = x;
				let zic = y;
				do {
					i++;
					const { zr, zi } = iterate(zrc, zic, -0.8, 0.156);
					zrc = zr;
					zic = zi;
				} while (!testEscape(zrc, zic) && i < iterations);

				const factor = 255 / iterations;
				return [
					Math.trunc(i * factor),
					Math.trunc(i * factor),
					Math.trunc(i * factor),
					255,
				];
			},
		};
	}
}