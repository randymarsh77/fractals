import React from 'react';

export default class CanvasRenderTarget extends React.Component {

	componentWillMount() {
		this.setStateFromProps(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.setStateFromProps(nextProps);
	}

	setStateFromProps(props) {
		let { dataSource: oldDataSource } = (this.state || {});
		let { resolution, dataSource } = props;
		let { width, height } = resolution;
		const subscription = this.updateSubscription(this.refs.canvas, oldDataSource, dataSource);
		this.setState({
			width,
			height,
			subscription,
			dataSource,
		});
	}

	componentDidMount() {
		this.updateCanvas();
		const { dataSource } = this.state;
		dataSource.render(this.refs.canvas);

		const subscription = this.updateSubscription(this.refs.canvas, undefined, dataSource);
		this.setState({
			subscription,
		});
	}

	updateSubscription(target, oldDataSource, dataSource) {
		if (oldDataSource !== dataSource) {
			if (oldDataSource) {
				const { subscription } = this.state;
				subscription.dispose();
			}

			if (dataSource && target) {
				const subscription = dataSource.observeParametersChanged(() => {
					dataSource.render(target);
				});

				return subscription;
			}
		}

		return undefined;
	}

	componentDidUpdate() {
		this.updateCanvas();
	}

	updateCanvas() {

		const { width, height } = this.state;
		let canvas = this.refs.canvas;
		if (canvas.width !== width || canvas.height != height) {
			canvas.width = width;
			canvas.height = height;
		}
	}

	render () {
		return <canvas ref="canvas" className="fill" />;
	}
}
