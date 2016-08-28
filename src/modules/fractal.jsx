import React from 'react';
import FractalRenderer from './fractalrenderer';
import RenderPool from './renderpool';

export default class Fractal extends React.Component {

	componentWillMount() {
		this.setStateFromProps(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.setStateFromProps(nextProps);
	}

	setStateFromProps(props) {
		let { resolution, viewport } = this.props;
		let { width, height } = resolution;
		this.setState({
			width,
			height,
			viewport,
			iterations: 100,
			renderpool: new RenderPool(width, height, (w, h) => new FractalRenderer().getRenderer()),
		});
	}

	componentWillUpdate(nextProps, nextState) {
		let { renderpool } = this.state;
		if (renderpool) {
			renderpool.dispose();
		}
	}

	componentDidMount() {
		this.updateCanvas();
	}

	componentDidUpdate() {
		this.updateCanvas();
	}

	updateCanvas() {
		if (!this.state.viewport) {
			return;
		}

		const { width, height, viewport, iterations, renderpool } = this.state;
		let canvas = this.refs.canvas;
		if (canvas.width !== width || canvas.height != height) {
			canvas.width = width;
			canvas.height = height;
		}
		let ctx = canvas.getContext('2d');

		renderpool.render({ viewport, iterations }, (data, bounds) => {
			let { x, y, width: bWidth, height: bHeight } = bounds;
			let imageData = ctx.createImageData(bWidth, bHeight);
			for (let i = 0; i < bWidth * bHeight * 4; i++) {
				imageData.data[i] = data[i];
			}
			ctx.putImageData(imageData, x, y);
		});
	}

	render () {
		return <canvas ref="canvas" className="fill" style={{"height" : "100%", "width" : "100%"}}/>;
	}
}
