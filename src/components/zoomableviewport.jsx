import React from 'react';
import { autobind } from 'core-decorators';

@autobind
export default class ZoomableViewport extends React.Component {

	componentWillMount() {
		const { resolution, viewport } = this.props;
		this.setState({
			resolution,
			viewport,
			scale: 1.0,
		});
	}

	componentWillReceiveProps(nextProps) {
		const { resolution, viewport } = nextProps;
		this.setState({
			resolution,
			viewport,
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.scale === 1.0;
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
					left: e.pageX,
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

	handleMouseUp() {
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
		const newHeight = (maxY - minY) * (height / resolution.height);

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
		const ZOOM_STEP = 0.01;
		e.preventDefault();

		let { scale } = this.state;
		const shouldRenderSoon = scale === 1.0;
		const zoomingOut = e.deltaX > 0 || e.deltaY > 0;
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
			const containerRect = this.container.getBoundingClientRect();
			const zoomAtPointFromTopLeft = {
				x: e.pageX - containerRect.left,
				y: e.pageY - containerRect.top,
			};
			setTimeout(() => {
				if (this.state.scale === 1.0) {
					return;
				}

				const { scale: finalScale, resolution, viewport } = this.state;
				const { width, height } = resolution;
				const { minX, minY, maxX, maxY } = viewport;

				const oldWidth = maxX - minX;
				const oldHeight = maxY - minY;
				const newWidth = (maxX - minX) * finalScale;
				const newHeight = (maxY - minY) * finalScale;

				const relativeZoomX = zoomAtPointFromTopLeft.x / width;
				const relativeZoomY = zoomAtPointFromTopLeft.y / height;

				const absoluteZoomX = minX + (relativeZoomX * oldWidth);
				const absoluteZoomY = maxY - (relativeZoomY * oldHeight);

				const newMinX = absoluteZoomX - (relativeZoomX * newWidth);
				const newMaxY = absoluteZoomY + (relativeZoomY * newHeight);

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

	render() {
		const { dragState } = this.state;
		return (
			<div
				ref={(x) => { this.container = x; }}
				className="fill"
				onWheel={this.handleMouseWheel}
				onMouseDown={this.handleMouseDown}
				onMouseMove={this.handleMouseMove}
				onMouseUp={this.handleMouseUp}>
				{this.props.children}
				{ dragState ? <div className="dragBox" style={dragState.style} /> : null }
			</div>
		);
	}
}
