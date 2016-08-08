import React from 'react';
import BrowserUtils from 'utils/BrowserUtils';
import IconConstants from 'constants/IconConstants';

import ActionButton from 'components/ActionButton';
import Dropdown from 'components/semantic/Dropdown';
import { MenuItemLink } from 'components/semantic/MenuItem';
import MenuIcon from 'components/menu/MenuIcon';


const getCloseAllItem = (sessions, closeAction) => {
	return (
		<MenuItemLink 
			key="close"
			onClick={ () => sessions.forEach(session => closeAction(session)) }
			icon={ IconConstants.REMOVE }
		>
			Close all
		</MenuItemLink>
	);
};

const SessionDropdown = ({ sessions, sessionMenuItemGetter, newButton, unreadInfoStore, closeAction }) => {
	// Don't add nesting for items to preserve Semantic UI's CSS
	// There should always be something to show if we are rendering the menu
	const hideStyle = { display: 'none' };

	const sessionMenuStyle = sessions.length === 0 ? hideStyle : null;

	let sessionMenuItems = null;
	if (sessions.length > 0) {
		sessionMenuItems = [ ...sessions.map(sessionMenuItemGetter), <div key="divider" className="ui divider"/>, getCloseAllItem(sessions, closeAction) ];
	}

	return (
		<Dropdown triggerIcon={ <MenuIcon urgencies={ unreadInfoStore ? unreadInfoStore.getTotalUrgencies() : null } />}>
		 	<div className="header" style={ newButton ? null : hideStyle }>
		 		New
		 	</div>
		 	{ newButton }
			<div className="ui divider" style={ newButton ? sessionMenuStyle : hideStyle }/>
			<div className="header" style={ sessionMenuStyle }>
				Current sessions
			</div>
			{ sessionMenuItems }
		</Dropdown>
	);
};

const CloseButton = ({ closeAction, activeItem }) => {
	if (!activeItem || BrowserUtils.useMobileLayout()) {
		return null;
	}

	return (
		<ActionButton 
			className="basic small item close-button"
			action={ closeAction } 
			itemData={ activeItem }
			icon="grey remove"
		/>
	);
};

const SessionItemHeader = ({ itemIcon, itemHeader, activeItem, actionMenu }) => {
	if (!activeItem) {
		return null;
	}

	return (
		<div className="session-header">
			{ itemIcon }
			{ itemHeader }
		</div>
	);
};

const TopMenuLayout = ({ children, ...props }) => (
	<div className="session-container vertical">
		<div className="ui main menu menu-bar">
			<div className="content-left">
				<SessionDropdown { ...props }/>
				<SessionItemHeader { ...props }/>
			</div>
			<CloseButton { ...props }/>
		</div>

		<div className="session-layout">
			{ children }
		</div>
	</div>
);

TopMenuLayout.propTypes = {
	activeItem: React.PropTypes.object,
	newButton: React.PropTypes.node,
	itemIcon: React.PropTypes.node,
	itemHeader: React.PropTypes.node,
	sessionMenuItemGetter: React.PropTypes.func.isRequired,
	sessions: React.PropTypes.array.isRequired,
	closeAction: React.PropTypes.func.isRequired,
};

export default TopMenuLayout;
