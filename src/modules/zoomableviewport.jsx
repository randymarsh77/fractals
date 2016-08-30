import React from 'react';

export default class ZoomableViewport extends React.Component {

	componentWillMount() {
		let { resolution, viewport } = this.props;
		this.setState({
			resolution,
			viewport,
			scale: 1.0,
		});
	}

	componentWillReceiveProps(nextProps) {
		let { resolution, viewport } = nextProps;
		this.setState({
			resolution,
			viewport,
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.scale === 1.0;
	}

	isNegative(n) {
		return ((n = +n) || 1 / n) < 0;
	}

	handleMouseWheel(e) {
		let ZOOM_STEP = .01;
		e.preventDefault();

		let { scale } = this.state;
		let shouldRenderSoon = scale === 1.0;
		let zoomingOut = !this.isNegative(e.deltaX) || !this.isNegative(e.deltaY);
		if (zoomingOut) {
			scale += ZOOM_STEP;
		} else {
			scale -= ZOOM_STEP;
		}
		scale = scale < 0 ? 0 : scale;
		this.setState({
			scale,
		});

		if (shouldRenderSoon) {
			const containerRect = this.refs.container.getBoundingClientRect();
			const zoomAtPointFromTopLeft = {
				x: e.pageX - containerRect.left,
				y: e.pageY - containerRect.top,
			};
			setTimeout(() => {
				if (this.state.scale === 1.0) {
					return;
				}

				let { scale, resolution, viewport } = this.state;
				let { width, height } = resolution;
				let { minX, minY, maxX, maxY } = viewport;

				let oldWidth = maxX - minX;
				let oldHeight = maxY - minY;
				let newWidth = (maxX - minX) * scale;
				let newHeight = (maxY - minY) * scale;

				let relativeZoomX = zoomAtPointFromTopLeft.x / width;
				let relativeZoomY = zoomAtPointFromTopLeft.y / height;

				let absoluteZoomX = minX + (relativeZoomX * oldWidth);
				let absoluteZoomY = maxY - (relativeZoomY * oldHeight);

				let newMinX = absoluteZoomX - relativeZoomX * newWidth;
				let newMaxY = absoluteZoomY + relativeZoomY * newHeight;

				this.setState({
					scale: 1.0,
				});

				this.props.onViewportChanged({
					minX: newMinX,
					minY: newMaxY - newHeight,
					maxX: newMinX + newWidth,
					maxY: newMaxY,
				});

			}, 1000);
		}
	}

	render () {
		return (
			<div ref="container" className="fill" onWheel={this.handleMouseWheel.bind(this)}>
				{this.props.children}
			</div>
		);
	}
}
