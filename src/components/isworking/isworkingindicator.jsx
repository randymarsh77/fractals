import React from 'react';

export default class IsWorkingIndicator extends React.Component {

	render() {
		return (
			<div className="spinner-container">
				<div className="spinner-frame">
					<div className="spinner-cover" />
					<div className="spinner-bar" />
				</div>
			</div>
		);
	}
}
