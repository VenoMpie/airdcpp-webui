'use strict';
import PropTypes from 'prop-types';
import React from 'react';

import Message from 'components/semantic/Message';
import MessageComposer from './MessageComposer';
import MessageView from 'components/messages/MessageView';

import ActiveSessionDecorator from 'decorators/ActiveSessionDecorator';
import LoginStore from 'stores/LoginStore';

import './chat.css';


class ChatLayout extends React.Component {
  static propTypes = {
    /**
		 * Access required for sending messages
		 */
    chatAccess: PropTypes.string.isRequired,

    session: PropTypes.any.isRequired,

    messageStore: PropTypes.object.isRequired,

    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.unsubscribe = props.messageStore.listen(this.onMessagesChanged);

    this.state = {
      messages: null,
    };
  }

  onMessagesChanged = (messages, id) => {
    if (id !== this.props.session.id) {
      return;
    }

    this.setState({ messages: messages });
  };

  onSessionActivated = (id) => {
    const { messageStore, actions } = this.props;
		
    if (!messageStore.isSessionInitialized(id)) {
      this.setState({ 
        messages: null 
      });

      actions.fetchMessages(id);
    } else {
      this.setState({ 
        messages: messageStore.getSessionMessages(id) 
      });
    }
  };

  componentDidMount() {
    this.onSessionActivated(this.props.session.id);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.session.id != nextProps.session.id) {
      this.onSessionActivated(nextProps.session.id);
    }
  }

  render() {
    const hasChatAccess = LoginStore.hasAccess(this.props.chatAccess);
    return (
      <div className="message-view">
        { !hasChatAccess && <Message description="You aren't allowed to send new messages"/> }
        <MessageView 
          className="chat"
          messages={ this.state.messages }
          session={ this.props.session }
        />
        { hasChatAccess && (
          <MessageComposer 
            session={ this.props.session }
            actions={ this.props.actions }
          />
        ) }
      </div>
    );
  }
}

export default ActiveSessionDecorator(ChatLayout, true);
