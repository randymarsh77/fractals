import React from 'react';
import { render } from 'react-dom';
import { autobind } from 'core-decorators';
import CanvasRenderTarget from './components/canvasrendertarget';
import ControlPanel from './components/controlpanel';
import IsWorkingIndicator from './components/isworking/isworkingindicator';
import Fractal from './models/fractal';
import FractalPresets from './models/fractalpresets';
import FractalSettings from './components/fractalsettings';
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

		const renderSettings = {
			resolution,
			viewport,
			iterations: 100,
			workers: 4,
		};

		const fractalSettings = {
			type: FractalPresets.AllFractals()[0],
			coloring: FractalPresets.AllColoringMethods()[0],
		};

		this.setState({
			fractalSettings,
			fractal: new Fractal(fractalSettings, renderSettings, this.handleRenderStateChanged),
			renderSettings,
			dirty: false,
			isWorking: false,
			controlState: {
				visible: true,
			},
			fractalSettingsPanelState: {
				visible: false,
			},
		});
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize);
		window.addEventListener('keyup', this.handleKeyUp);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
		window.removeEventListener('keyup', this.handleKeyUp);
	}

	componentDidUpdate() {
		const { fractal, renderSettings } = this.state;
		fractal.updateRenderSettings(renderSettings);
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

			const { renderSettings: oldRenderSettings } = this.state;
			const { viewport: oldViewport } = oldRenderSettings;

			this.setState({
				dirty: false,
				renderSettings: {
					...oldRenderSettings,
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
		const { renderSettings } = this.state;
		this.setState({
			renderSettings: {
				...renderSettings,
				viewport: Utility.AdjustViewportForResolution(viewport, renderSettings.resolution),
			},
		});
	}

	handleRenderSettingsChanged(diff) {
		const { renderSettings } = this.state;
		this.setState({
			renderSettings: Object.assign(renderSettings, diff),
		});
	}

	handleFractalSettingsChanged(diff) {
		const { fractalSettings: oldFractalSettings, renderSettings } = this.state;
		const fractalSettings = Object.assign(oldFractalSettings, diff);
		this.setState({
			fractalSettings,
			fractal: new Fractal(fractalSettings, renderSettings, this.handleRenderStateChanged),
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
		if (e.key === 'r') {
			const { controlState } = this.state;
			controlState.visible = !controlState.visible;
			this.setState({
				controlState,
				fractalSettingsPanelState: { visible: false },
			});
		} else if (e.key === 'f') {
			const { fractalSettingsPanelState } = this.state;
			fractalSettingsPanelState.visible = !fractalSettingsPanelState.visible;
			this.setState({
				controlState: { visible: false },
				fractalSettingsPanelState,
			});
		}
	}

	render() {
		return (
			<div>
				<ZoomableViewport
					onViewportChanged={this.setViewport}
					viewport={this.state.renderSettings.viewport}
					resolution={this.state.renderSettings.resolution}>
					<CanvasRenderTarget
						resolution={this.state.renderSettings.resolution}
						dataSource={this.state.fractal} />
				</ZoomableViewport>
				{ this.state.isWorking ? <IsWorkingIndicator /> : null }
				<ControlPanel
					controlState={this.state.controlState}
					onControlStateChanged={this.handleControlStateChanged}
					renderSettings={this.state.renderSettings}
					onRenderSettingsChanged={this.handleRenderSettingsChanged} />
				<FractalSettings
					panelState={this.state.fractalSettingsPanelState}
					onPanelStateChanged={this.handleFractalSettingsPanelStateChanged}
					settings={this.state.fractalSettings}
					onSettingsChanged={this.handleFractalSettingsChanged} />
			</div>
		);
	}
}

render((
	<App className="fill" />
), document.getElementById('app'));
