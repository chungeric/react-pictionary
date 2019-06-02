import React, { Component } from 'react';
import '../../styles/chat.scss';
import { connect } from 'react-redux';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputFocusOut = this.onInputFocusOut.bind(this);
    this.pinChat = this.pinChat.bind(this);
    this.state = {
      sessionId: null,
      chatPinned: false
    };
  }

  componentDidUpdate(prevProps) {
    const { socket: oldSocket } = prevProps;
    const { socket: newSocket } = this.props;
    if ((oldSocket === null) && newSocket !== null && oldSocket !== newSocket) {
      // SELF CONNECTED
      newSocket.on('connect', () => {
        const nameSpace = newSocket.nsp;
        const sessionId = newSocket.id.replace(`${nameSpace}#`, '').slice(0, 4);
        this.setState({ sessionId });
      });

      // NEW USER (NOT SELF) CONNECTED
      newSocket.on('connected', ({ sessionId }) => {
        this.getLastMsgNode().insertAdjacentHTML(
          'afterend',
          `<div class='message'><p>${sessionId.slice(0, 4)} connected.</p></div>`
        );
      });

      // MESSAGE SENT BY ANOTHER PLAYER SHOULD BE DISPLAYED
      newSocket.on('message-sent', ({ message, sessionId }) => {
        this.getLastMsgNode().insertAdjacentHTML(
          'afterend',
          `<div class='message'>
            <p><strong><span style="color: red;">&lt;${sessionId.slice(0, 4)}&gt;</span></strong>: ${message}</p>
          </div>`
        );
      });

      // PLAYER DISCONNECTED
      newSocket.on('disconnected', ({ sessionId }) => {
        this.getLastMsgNode().insertAdjacentHTML(
          'afterend',
          `<div class='message'><p>${sessionId.slice(0, 4)} disconnected.</p></div>`
        );
      });
    }
  }

  onInputFocus = () => {
    document.getElementsByClassName('chat')[0].style.height = '100%';
  }

  onInputFocusOut = () => {
    document.getElementsByClassName('chat')[0].style.height = '42px';
  }

  onMessageSubmit(event) {
    const { sessionId } = this.state;
    const { socket } = this.props;
    if (event.key === 'Enter') {
      const message = event.target.value;
      if (message !== '') {
        this.getLastMsgNode().insertAdjacentHTML(
          'afterend',
          `<div class='message'>
            <p><strong><span style="color: red;">&lt;${sessionId}&gt;</span></strong>: ${message}</p>
          </div>`
        );
        this.updateScroll();
        // eslint-disable-next-line
        event.target.value = '';
        // Trigger message-sent event
        socket.emit('message-sent', { message, sessionId });
      }
    }
  }

  pinChat = () => {
    const element = document.getElementsByClassName('chat')[0];
    const { chatPinned } = this.state;
    this.setState({ chatPinned: !chatPinned });
    element.classList.toggle('open');
  }

  getLastMsgNode = () => {
    const msgNodes = document.querySelectorAll('.message');
    return msgNodes[msgNodes.length - 1];
  }

  updateScroll = () => {
    const element = document.getElementsByClassName('messages-wrapper')[0];
    element.scrollTop = element.scrollHeight;
  }

  render() {
    const { chatPinned, sessionId } = this.state;
    const { numPlayers } = this.props;
    const strongRed = {
      color: 'red',
      fontWeight: 'bold'
    };
    const strongGrey = {
      color: '#666',
      fontWeight: 'bold'
    };
    return (
      <div className="chat">
        <input
          type="button"
          className="pin-chat"
          onMouseDown={this.pinChat}
          value={chatPinned ? 'Unpin' : 'Pin'}
        />
        <div className="messages-wrapper">
          <div className="messages">
            <div className="message">
              <p className="title">
                Welcome to
                <span>scribbz</span>
              </p>
              <p className="welcome">
                @: Welcome to the chat&nbsp;
                {/* eslint-disable-next-line */}
                <strong><span style={strongRed}>&lt;{sessionId || ''}&gt;</span></strong>.
                Type something below and press enter to start chatting away!
              </p>
              <p className="online">
                <span style={strongGrey}>{ this.props && numPlayers ? numPlayers : 0 }</span>
                &nbsp;players currently online.
              </p>
            </div>
          </div>
        </div>
        <div className="input-wrapper">
          <input
            id="chat-input"
            type="text"
            placeholder="Type your guess here..."
            onKeyPress={this.onMessageSubmit}
            onFocus={this.onInputFocus}
            onBlur={this.onInputFocusOut}
            // eslint-disable-next-line
            autoFocus
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    socket: state.socket,
    numPlayers: state.numPlayers
  };
}
export default connect(mapStateToProps, {})(Chat);
