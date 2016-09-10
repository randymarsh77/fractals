import MandelbrotLogic from './logic/mandelbrotlogic';
import JuliaLogic from './logic/julialogic';

export default class FractalPresets {

	static Mandelbrot() {
		return {
			name: 'Mandelbrot',
			logic: MandelbrotLogic.Create(),
		};
	}

	static Julia() {
		return {
			name: 'Julia',
			logic: JuliaLogic.Create(),
		};
	}

	static All() {
		return [
			FractalPresets.Mandelbrot(),
			FractalPresets.Julia(),
		];
	}
}
