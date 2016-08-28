import React from 'react';
import { render } from 'react-dom';
import Fractal from './modules/fractal'
import ZoomableViewport from './modules/zoomableviewport';

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

		this.setState({
			resolution,
			viewport,
			dirty: false,
		});
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize.bind(this));
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

			this.setState({
				dirty: false,
				resolution: {
					width: window.innerWidth,
					height: window.innerHeight,
				},
				viewport: this.adjustViewportForResolution(this.state.viewport, resolution),
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
			viewport,
		});
	}

	render () {
		return (
			<ZoomableViewport onViewportChanged={this.setViewport.bind(this)} viewport={this.state.viewport} resolution={this.state.resolution}>
				<Fractal viewport={this.state.viewport} resolution={this.state.resolution} />
			</ZoomableViewport>
		);
  }
}

render((
	<App className="fill" style={{"height" : "100%", "width" : "100%"}} />
), document.getElementById('app'));
