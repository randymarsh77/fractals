import React from 'react';
import { autobind } from 'core-decorators';

@autobind
export default class CanvasRenderTarget extends React.Component {

	componentWillMount() {
		this.setState({
			dirty: true,
		});
		this.setStateFromProps(this.props);
	}

	componentDidMount() {
		this.updateCanvas();
	}

	componentWillReceiveProps(nextProps) {
		this.setStateFromProps(nextProps);
	}

	componentDidUpdate() {
		this.updateCanvas();
	}

	setStateFromProps(props) {
		const { dirty, dataSource: oldDataSource } = (this.state || {});
		const { resolution, dataSource } = props;
		const { width, height } = resolution;
		const subscription = this.updateSubscriptionIfNecessary(dataSource);
		this.setState({
			dirty: dirty || dataSource !== oldDataSource,
			width,
			height,
			subscription,
			dataSource,
		});
	}

	updateSubscriptionIfNecessary(newDataSource) {
		const { dataSource: oldDataSource, subscription: oldSubscription } = (this.state || {});
		if (this.canvas && (oldDataSource !== newDataSource || !oldSubscription)) {
			if (oldSubscription) {
				oldSubscription.dispose();
			}

			if (newDataSource) {
				const subscription = newDataSource.observeRenderSettingsChanged(() => {
					newDataSource.render(this.canvas);
				});

				return subscription;
			}
		}

		return oldSubscription;
	}

	updateCanvas() {
		const { width, height, dirty, dataSource } = this.state;
		const canvas = this.canvas;
		if (canvas.width !== width || canvas.height !== height) {
			canvas.width = width;
			canvas.height = height;
		}
		if (dirty) {
			this.setState({
				dirty: false,
			});
			dataSource.render(canvas);
		}
	}

	render() {
		return <canvas ref={(x) => { this.canvas = x; }} className="fill" />;
	}
}
