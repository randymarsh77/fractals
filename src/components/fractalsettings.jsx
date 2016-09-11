import React from 'react';
import { autobind } from 'core-decorators';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Form,
	FormField,
	FormSelect,
} from 'elemental';
import FractalPresets from './../models/fractalpresets';

@autobind
export default class FractalSettings extends React.Component {

	componentWillMount() {
		const fractals = FractalPresets.AllFractals();
		const colorings = FractalPresets.AllColoringMethods();
		this.setState({
			fractals,
			colorings,
			typeOptions: fractals.map((x) => ({
				label: x.label,
				value: x.key,
			})),
			coloringOptions: colorings.map((x) => ({
				label: x.label,
				value: x.key,
			})),
		});
		this.setStateFromProps(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.setStateFromProps(nextProps);
	}

	setStateFromProps(props) {
		const { panelState, settings } = props;
		const { visible } = panelState;
		this.setState({
			visible,
			...settings,
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

	handleFractalTypeChanged(e) {
		const { fractals } = this.state;
		const newType = fractals.filter((x) => x.key === e)[0];
		this.props.onSettingsChanged({
			type: newType,
		});
	}

	handleColoringMethodChanged(e) {
		const { colorings } = this.state;
		const newColoring = colorings.filter((x) => x.key === e)[0];
		this.props.onSettingsChanged({
			coloring: newColoring,
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
						<b>Show or hide this panel with 'f'.</b>
					</p>
					<p>
						Show or hide render settings with 'r'.
						Change the fractal type.
						Change the coloring method.
						Different fractals have different modifiable parameters.
						Pro tip: fullscreen your browser window.
					</p>
					<h1>Settings</h1>
					<Form type="horizontal">
						<FormSelect
							label="Type"
							options={this.state.typeOptions}
							onChange={this.handleFractalTypeChanged} />
						<FormSelect
							label="Color"
							options={this.state.coloringOptions}
							onChange={this.handleColoringMethodChanged} />
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
