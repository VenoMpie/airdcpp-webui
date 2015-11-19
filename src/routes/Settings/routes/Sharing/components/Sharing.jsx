'use strict';

import React from 'react';
import GridLayout from 'routes/Settings/components/GridLayout';

const Sharing = React.createClass({
	render() {
		const menuItems = [
			{ title: 'Directories', url: 'directories' },
			{ title: 'Share profiles', url: 'profiles' },
			{ title: 'Refresh options', url: 'refresh-options' },
		];

		const advancedMenuItems = [
			{ title: 'Sharing options', url: 'sharing-options' },
			{ title: 'Hashing', url: 'hashing' },
		];

		return (
			<GridLayout 
				menuItems={ menuItems } 
				advancedMenuItems={ advancedMenuItems }
				id="sharing"
				icon="tasks"
				{...this.props}
			/>
		);
	},
});

export default Sharing;
