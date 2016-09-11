import React from 'react';
import { render } from 'react-dom';
import { autobind } from 'core-decorators';
import CanvasRenderTarget from './components/canvasrendertarget';
import ControlPanel from './components/controlpanel';
import IsWorkingIndicator from './components/isworking/isworkingindicator';
import Fractal from './models/fractal';
import FractalPresets from './models/fractalpresets';
import Utility from './models/utility';
import ZoomableViewport from './components/zoomableviewport';
import './styles.less';

@autobind
class App extends React.Component {

	componentWillMount() {
		const resolution = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		const viewport = Utility.AdjustViewportForResolution({
			minX: -2.0,
			maxX: 2.0,
			minY: -2.0,
			maxY: 2.0,
		}, resolution);

		const fractalParams = {
			resolution,
			viewport,
			iterations: 100,
			workers: 4,
		};

		const type = FractalPresets.Julia();

		this.setState({
			type,
			fractal: new Fractal(type, fractalParams, this.handleRenderStateChanged.bind(this)),
			fractalParams,
			dirty: false,
			isWorking: false,
			controlState: {
				visible: true,
			},
		});
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize.bind(this));
		window.addEventListener('keyup', this.handleKeyUp.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize.bind(this));
		window.removeEventListener('keyup', this.handleKeyUp.bind(this));
	}

	componentDidUpdate() {
		const { fractal, fractalParams } = this.state;
		fractal.updateParameters(fractalParams);
	}

	handleResize() {
		const { dirty } = this.state;
		if (dirty) {
			return;
		}

		this.setState({
			dirty: true,
		});

		setTimeout(() => {
			const resolution = {
				width: window.innerWidth,
				height: window.innerHeight,
			};

			const { fractalParams: oldFractalParams } = this.state;
			const { viewport: oldViewport } = oldFractalParams;

			this.setState({
				dirty: false,
				fractalParams: {
					...oldFractalParams,
					resolution: {
						width: window.innerWidth,
						height: window.innerHeight,
					},
					viewport: Utility.AdjustViewportForResolution(oldViewport, resolution),
				},
			});
		}, 1000);
	}

	setViewport(viewport) {
		const { fractalParams } = this.state;
		this.setState({
			fractalParams: {
				...fractalParams,
				viewport: Utility.AdjustViewportForResolution(viewport, fractalParams.resolution),
			},
		});
	}

	handleFractalParamsChanged(fractalParamsDiff) {
		const { fractalParams } = this.state;
		this.setState({
			fractalParams: Object.assign(fractalParams, fractalParamsDiff),
		});
	}

	handleFractalTypeChanged(newType) {
		const { fractalParams } = this.state;
		this.setState({
			type: newType,
			fractal: new Fractal(newType, fractalParams, this.handleRenderStateChanged.bind(this)),
		});
	}

	handleControlStateChanged(controlStateDiff) {
		const { controlState } = this.state;
		this.setState({
			controlState: Object.assign(controlState, controlStateDiff),
		});
	}

	handleRenderStateChanged(renderState) {
		const { rendering } = renderState;
		this.setState({
			isWorking: rendering,
		});
	}

	handleKeyUp(e) {
		if (e.key === 'c') {
			const { controlState } = this.state;
			controlState.visible = !controlState.visible;
			this.setState({
				controlState,
			});
		}
	}

	render() {
		return (
			<div>
				<ZoomableViewport
					onViewportChanged={this.setViewport}
					viewport={this.state.fractalParams.viewport}
					resolution={this.state.fractalParams.resolution}>
					<CanvasRenderTarget
						resolution={this.state.fractalParams.resolution}
						dataSource={this.state.fractal} />
				</ZoomableViewport>
				{ this.state.isWorking ? <IsWorkingIndicator /> : null }
				<ControlPanel
					controlState={this.state.controlState}
					onControlStateChanged={this.handleControlStateChanged}
					fractalParams={this.state.fractalParams}
					onFractalParamsChanged={this.handleFractalParamsChanged} />
			</div>
		);
	}
}

render((
	<App className="fill" />
), document.getElementById('app'));
