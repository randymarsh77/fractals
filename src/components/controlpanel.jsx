import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'elemental';
import { Form, FormRow, FormField, FormInput } from 'elemental';

export default class ControlPanel extends React.Component {

	componentWillMount() {
		this.setStateFromProps(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.setStateFromProps(nextProps);
	}

	setStateFromProps(props) {
		const { controlState, fractalParams } = this.props;
		const { visible } = controlState;
		this.setState({
			visible,
			...fractalParams,
		});
	}

	toggleVisible() {
		const { visible } = this.state;
		let newVisible = !visible;
		let newState = {
			visible: newVisible,
		};
		this.props.onControlStateChanged(newState);
	}

	onIterationsValueChanged(e) {
		this.props.onFractalParamsChanged({
			iterations: Number(e.target.value),
		});
	}

	onWorkersValueChanged(e) {
		this.props.onFractalParamsChanged({
			workers: Math.min(128, Math.max(1, Number(e.target.value))),
		});
	}

	render() {
		return (
			<Modal isOpen={this.state.visible} backdropClosesModal>
				<ModalHeader text="Explore Fractals" showCloseButton onClose={this.toggleVisible.bind(this)} />
				<ModalBody>
					<h1>Overview</h1>
					<p>Show or hide this panel with 'c'. Pinch to zoom at the cursor. Drag a box to define a new viewport. Shift+Click+Drag will pan the image. Pro tip: fullscreen your browser window.</p>
					<h1>Settings</h1>
						<Form type="horizontal">
							<FormRow>
								<FormField width="one-quarter" label="Min X">
									<FormInput type="number" defaultValue={this.state.viewport.minX} />
								</FormField>
								<FormField width="one-quarter" label="Max X">
									<FormInput type="number" defaultValue={this.state.viewport.maxX} />
								</FormField>
								<FormField width="one-quarter" label="Min Y">
									<FormInput type="number" defaultValue={this.state.viewport.minY} />
								</FormField>
								<FormField width="one-quarter" label="Max Y">
									<FormInput type="number" defaultValue={this.state.viewport.maxY} />
								</FormField>
							</FormRow>
							<FormField label="Iterations">
								<FormInput type="number" defaultValue={this.state.iterations} onChange={this.onIterationsValueChanged.bind(this)} />
							</FormField>
							<FormField label="Background Workers">
								<FormInput type="number" defaultValue={this.state.workers} onChange={this.onWorkersValueChanged.bind(this)} />
							</FormField>
							<FormField offsetAbsentLabel>
								<Button submit>Apply</Button>
							</FormField>
						</Form>
				</ModalBody>
				<ModalFooter>
					<Button type="primary">Got it. Show me the fractal!</Button>
				</ModalFooter>
			</Modal>
		);
	}
}
