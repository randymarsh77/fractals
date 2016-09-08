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

	handleMouseDown(e) {
		const { dragState } = this.state;
		if (dragState) {
			return;
		}

		this.setState({
			dragState: {
				origin: {
					x: e.pageX,
					y: e.pageY,
				},
				style: {
					left:e.pageX,
					top: e.pageY,
					width: 0,
					height: 0,
				},
			},
		});
	}

	handleMouseMove(e) {
		const { dragState } = this.state;
		if (!dragState) {
			return;
		}
		const { origin } = dragState;
		this.setState({
			dragState: {
				origin,
				style: {
					left: Math.min(e.pageX, origin.x),
					top: Math.min(e.pageY, origin.y),
					width: Math.abs(e.pageX - origin.x),
					height: Math.abs(e.pageY - origin.y),
				},
			},
		});
	}

	handleMouseUp(e) {
		const { dragState, viewport, resolution } = this.state;
		if (!dragState) {
			return;
		}

		this.setState({
			dragState: undefined,
		});

		const { left, top, width, height } = dragState.style;
		const { minX, minY, maxX, maxY } = viewport;
		const newWidth = (maxX - minX) * (width / resolution.width);
		const newHeight = (maxY - minY) * ( height / resolution.height);

		const newMinX = minX + ((left / resolution.width) * (maxX - minX));
		const newMaxY = maxY - ((top / resolution.height) * (maxY - minY));

		this.props.onViewportChanged({
			minX: newMinX,
			maxX: newMinX + newWidth,
			minY: newMaxY - newHeight,
			maxY: newMaxY,
		});
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
		const { dragState } = this.state;
		return (
			<div
				ref="container"
				className="fill"
				onWheel={this.handleMouseWheel.bind(this)}
				onMouseDown={this.handleMouseDown.bind(this)}
				onMouseMove={this.handleMouseMove.bind(this)}
				onMouseUp={this.handleMouseUp.bind(this)}>
				{this.props.children}
				{ dragState ? <div className="dragBox" style={dragState.style} /> : null }
			</div>
		);
	}
}
