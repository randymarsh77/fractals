import MandelbrotLogic from './logic/mandelbrotlogic'
import JuliaLogic from './logic/julialogic'

export default class FractalPresets {

	static Mandelbrot() {
		return {
			name: "Mandelbrot",
			logic: new MandelbrotLogic(),
		};
	}

	static Julia() {
		return {
			name: "Julia",
			logic: new JuliaLogic(),
		};
	}

	static All() {
		return [
			Mandlebrot(),
			Julia(),
		];
	}
}
