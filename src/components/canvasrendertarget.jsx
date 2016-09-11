import React from 'react';

export default class CanvasRenderTarget extends React.Component {

	componentWillMount() {
		this.setStateFromProps(this.props);
	}

	componentDidMount() {
		this.updateCanvas();
		const { dataSource } = this.state;
		dataSource.render(this.canvas);

		const subscription = this.updateSubscription(this.canvas, undefined, dataSource);
		this.setState({
			subscription,
		});
	}

	componentWillReceiveProps(nextProps) {
		this.setStateFromProps(nextProps);
	}

	componentDidUpdate() {
		this.updateCanvas();
	}

	setStateFromProps(props) {
		const { dataSource: oldDataSource } = (this.state || {});
		const { resolution, dataSource } = props;
		const { width, height } = resolution;
		const subscription = this.updateSubscription(this.canvas, oldDataSource, dataSource);
		this.setState({
			width,
			height,
			subscription,
			dataSource,
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

	updateCanvas() {
		const { width, height } = this.state;
		const canvas = this.canvas;
		if (canvas.width !== width || canvas.height !== height) {
			canvas.width = width;
			canvas.height = height;
		}
	}

	render() {
		return <canvas ref={(x) => { this.canvas = x; }} className="fill" />;
	}
}
