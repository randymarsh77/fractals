import MandelbrotLogic from './logic/mandelbrotlogic';
import JuliaLogic from './logic/julialogic';

export default class FractalPresets {

	static Mandelbrot() {
		return {
			label: 'Mandelbrot',
			key: 'mandelbrot',
			logic: {
				create: (parameters) => MandelbrotLogic.Create(parameters),
			},
		};
	}

	static Julia() {
		return {
			label: 'Julia',
			key: 'julia',
			logic: {
				create: (parameters) => JuliaLogic.Create(parameters),
			},
		};
	}

	static RawColoring() {
		return {
			label: 'Raw Grayscale Interpolation',
			key: 'raw',
		};
	}

	static SmoothColoring() {
		return {
			label: 'Smooth Grayscale Interpolation"',
			key: 'smooth',
		};
	}

	static AllFractals() {
		return [
			FractalPresets.Mandelbrot(),
			FractalPresets.Julia(),
		];
	}

	static AllColoringMethods() {
		return [
			FractalPresets.RawColoring(),
			FractalPresets.SmoothColoring(),
		];
	}
}
