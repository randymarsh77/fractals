import React from 'react';
import { autobind } from 'core-decorators';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Form,
	FormRow,
	FormField,
	FormInput,
} from 'elemental';

@autobind
export default class ControlPanel extends React.Component {

	componentWillMount() {
		this.setStateFromProps(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.setStateFromProps(nextProps);
	}

	setStateFromProps(props) {
		const { controlState, renderSettings } = props;
		const { visible } = controlState;
		this.setState({
			visible,
			...renderSettings,
		});
	}

	toggleVisible() {
		const { visible } = this.state;
		const newVisible = !visible;
		const newState = {
			visible: newVisible,
		};
		this.props.onControlStateChanged(newState);
	}

	onIterationsValueChanged(e) {
		this.props.onRenderSettingsChanged({
			iterations: Number(e.target.value),
		});
	}

	onWorkersValueChanged(e) {
		this.props.onRenderSettingsChanged({
			workers: Math.min(128, Math.max(1, Number(e.target.value))),
		});
	}

	render() {
		return (
			<Modal isOpen={this.state.visible} backdropClosesModal>
				<ModalHeader
					text="Explore Fractals"
					showCloseButton
					onClose={this.toggleVisible} />
				<ModalBody>
					<h1>Overview</h1>
					<p>
						<b>Show or hide this panel with 'r'.</b>
					</p>
					<p>
						Show or hide fractal settings with 'f'.
						Pinch to zoom at the cursor.
						Drag a box to define a new viewport.
						Shift+Click+Drag will pan the image.
						Pro tip: fullscreen your browser window.
					</p>
					<h1>Settings</h1>
					<Form type="horizontal">
						<FormRow>
							<FormField width="one-quarter" label="Min X">
								<FormInput type="number" defaultValue={this.state.viewport.minX} disabled />
							</FormField>
							<FormField width="one-quarter" label="Max X">
								<FormInput type="number" defaultValue={this.state.viewport.maxX} disabled />
							</FormField>
							<FormField width="one-quarter" label="Min Y">
								<FormInput type="number" defaultValue={this.state.viewport.minY} disabled />
							</FormField>
							<FormField width="one-quarter" label="Max Y">
								<FormInput type="number" defaultValue={this.state.viewport.maxY} disabled />
							</FormField>
						</FormRow>
						<FormField label="Iterations">
							<FormInput
								type="number"
								defaultValue={this.state.iterations}
								onChange={this.onIterationsValueChanged} />
						</FormField>
						<FormField label="Background Workers">
							<FormInput
								type="number"
								defaultValue={this.state.workers}
								onChange={this.onWorkersValueChanged} />
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
