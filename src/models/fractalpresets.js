import MandelbrotLogic from './logic/mandelbrotlogic'

export default class FractalPresets {

	static Mandelbrot() {
		return {
			name: "Mandelbrot",
			logic: new MandelbrotLogic(),
		};
	}

	static All() {
		return [
			Mandlebrot(),
		];
	}
}
