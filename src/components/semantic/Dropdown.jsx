import React from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

const Dropdown = React.createClass({
	propTypes: {
		/**
		 * Node to render as caption
		 */
		caption: React.PropTypes.node,

		/**
		 * Dropdown icon to display
		 * If caption isn't specified, the icon will be used as main trigger
		 */ 
		triggerIcon: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.node,
		]),

		/**
		 * Direction to render
		 */
		direction: React.PropTypes.string,

		/**
		 * Returns DOM node used for checking whether the dropdown can fit on screen
		 */
		contextGetter: React.PropTypes.func,

		/**
		 * Render as button
		 */
		button: React.PropTypes.bool,
	},

	componentDidMount() {
		const dom = ReactDOM.findDOMNode(this);

		const settings = {
			direction: this.props.direction,
			action: 'hide',
		};

		if (this.props.contextGetter) {
			settings['context'] = this.props.contextGetter();
		}

		$(dom).dropdown(settings);
	},

	getDefaultProps() {
		return {
			caption: null,
			className: '',
			triggerIcon: 'angle down',
			direction: 'auto',
		};
	},

	render: function () {
		const className = classNames(
			'ui',
			'dropdown',
			'item',
			this.props.className,
			{ 'labeled button': this.props.button },
			'icon',
		);

		let icon = this.props.triggerIcon;
		if (typeof icon === 'string') {
			icon = <i className={ this.props.triggerIcon + ' icon' }></i>;
		}

		return (
			<div className={ className }>
				{ this.props.caption }
				{ icon }
				<div className="menu">
					{ this.props.header ? (
						<div className="header">
							{ this.props.header }
						</div>
					) : null }
					{ this.props.children }
				</div>
			</div>
		);
	}
});

export default Dropdown;
