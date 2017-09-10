import PropTypes from 'prop-types';
import React from 'react';
import isEqual from 'lodash/isEqual';

import { PriorityEnum } from 'constants/PriorityConstants';

import TableDropdown from 'components/semantic/TableDropdown';
import { MenuItemLink } from 'components/semantic/MenuItem';
import EmptyDropdown from 'components/semantic/EmptyDropdown';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';


class PriorityMenu extends React.Component {
  static propTypes = {
    /**
		 * Priority object
		 */
    itemPrio: PropTypes.object.isRequired,

    /**
		 * Item with priority properties
		 */
    item: PropTypes.object.isRequired,

    prioAction: PropTypes.func.isRequired,
  };

  setPriority = (priorityId) => {
    this.props.prioAction(this.props.item, priorityId);
  };

  setAutoPriority = () => {
    this.setPriority(PriorityEnum.DEFAULT);
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps.item.priority, this.props.item.priority);
  }

  getPriorityListItem = (priority) => {
    return (
      <MenuItemLink 
        key={ priority.id }
        active={ this.props.item.priority.id === priority.id } 
        onClick={ () => this.setPriority(priority.id) }
      >
        { priority.str }
      </MenuItemLink>
    );
  };

  getChildren = () => {
    let children = Object.keys(PriorityEnum.properties).map(prioKey => this.getPriorityListItem(PriorityEnum.properties[prioKey]));
    children.push(<div key="divider" className="ui divider"/>);
    children.push(
      <MenuItemLink 
        key="auto"
        active={ this.props.itemPrio.auto } 
        onClick={ this.setAutoPriority }
      >
				Auto
      </MenuItemLink>
    );

    return children;
  };

  render() {
    let caption = this.props.itemPrio.str;
    if (this.props.itemPrio.auto) {
      caption += ' (auto)';
    }

    if (!LoginStore.hasAccess(AccessConstants.QUEUE_EDIT)) {
      return (
        <EmptyDropdown
          caption={ caption }
        />
      );
    }

    return (
      <TableDropdown 
        caption={ caption } 
        className="priority-menu"
      >
        { this.getChildren }
      </TableDropdown>
    );
  }
}

export default PriorityMenu;