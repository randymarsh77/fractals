import React from 'react';
import { render } from 'react-dom';
import CanvasRenderTarget from './components/canvasrendertarget';
import ControlPanel from './components/controlpanel';
import IsWorkingIndicator from './components/isworking/isworkingindicator';
import Fractal from './models/fractal';
import ZoomableViewport from './components/zoomableviewport';
import './styles.less';

class App extends React.Component {

	componentWillMount() {
		let resolution = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		let viewport = this.adjustViewportForResolution({
			minX: -2.0,
			maxX: 2.0,
			minY: -2.0,
			maxY: 2.0,
		}, resolution);

		let fractalParams = {
			resolution,
			viewport,
			iterations: 100,
			workers: 4,
		};

		this.setState({
			fractal: new Fractal(fractalParams, this.handleRenderStateChanged.bind(this)),
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
		window.addEventListener("keyup", this.handleKeyUp.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize.bind(this));
		window.removeEventListener('keyup', this.handleKeyUp.bind(this));
	}

	componentDidUpdate() {
		const { fractal, fractalParams } = this.state;
		fractal.updateParameters(fractalParams);
	}

	handleResize(e) {
		let { dirty } = this.state;
		if (dirty) {
			return;
		}

		this.setState({
			dirty: true,
		});

		setTimeout(() => {
			let resolution = {
				width: window.innerWidth,
				height: window.innerHeight,
			};

			let { fractalParams: oldFractalParams } = this.state;
			let { viewport: oldViewport } = oldFractalParams;

			this.setState({
				dirty: false,
				fractalParams: {
					...oldFractalParams,
					resolution: {
						width: window.innerWidth,
						height: window.innerHeight,
					},
					viewport: this.adjustViewportForResolution(oldViewport, resolution),
				},
			});
		}, 1000);
	}

	adjustViewportForResolution(viewport, resolution) {
		const { width, height } = resolution;
		const vpWidth = viewport.maxX - viewport.minX;
		const vpHeight = viewport.maxY - viewport.minY;

		let resolutionRatio = width / height;
		let vpRatio = vpWidth / vpHeight;

		let scaleFactor = resolutionRatio / vpRatio;

		let newWidth = vpWidth * scaleFactor;
		let xCenter = viewport.minX + vpWidth / 2;

		let newHeight = vpHeight;
		let yCenter = viewport.minY + vpHeight / 2;

		let adjusted =  {
			minX: xCenter - newWidth / 2,
			maxX: xCenter + newWidth / 2,
			minY: yCenter - newHeight / 2,
			maxY: yCenter + newHeight / 2,
		};

		return adjusted;
	}

	setViewport(viewport) {
		this.setState({
			fractalParams: {
				...this.state.fractalParams,
				viewport,
			},
		});
	}

	handleFractalParamsChanged(fractalParamsDiff) {
		let { fractalParams } = this.state;
		console.log('new', Object.assign(fractalParams, fractalParamsDiff));
		this.setState({
			fractalParams: Object.assign(fractalParams, fractalParamsDiff),
		});
	}

	handleControlStateChanged(controlStateDiff) {
		let { controlState } = this.state;
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
			let { controlState } = this.state;
			controlState.visible = !controlState.visible;
			this.setState({
				controlState,
			});
		}
	}

	render () {
		return (
			<div>
				<ZoomableViewport onViewportChanged={this.setViewport.bind(this)} viewport={this.state.fractalParams.viewport} resolution={this.state.fractalParams.resolution}>
					<CanvasRenderTarget resolution={this.state.fractalParams.resolution} dataSource={this.state.fractal} />
				</ZoomableViewport>
				{ this.state.isWorking ? <IsWorkingIndicator /> : null }
				<ControlPanel
					controlState={this.state.controlState}
					onControlStateChanged={this.handleControlStateChanged.bind(this)}
					fractalParams={this.state.fractalParams}
					onFractalParamsChanged={this.handleFractalParamsChanged.bind(this)} />
			</div>
		);
  }
}

render((
	<App className="fill" />
), document.getElementById('app'));
