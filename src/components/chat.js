import React, { Component } from 'react';
import css from '../../styles/chat.scss';
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

  componentDidMount() {
    // SELF CONNECTED
    this.props.socket.on('connect', () => {
      const sessionId = this.props.socket.id.slice(0,4);
      this.setState({ sessionId });
    });

    // NEW USER (NOT SELF) CONNECTED
    this.props.socket.on('connected', ({ sessionId }) => {
      this.getLastMsgNode().insertAdjacentHTML('afterend',
        `<div class='message'><p>${ sessionId.slice(0,4) } connected.</p></div>`
      );
    });

    // MESSAGE SENT BY ANOTHER PLAYER SHOULD BE DISPLAYED
    this.props.socket.on('message-sent', ({ message, sessionId }) => {
      this.getLastMsgNode().insertAdjacentHTML('afterend',
        `<div class='message'>
          <p><strong><span style="color: red;">&lt;${ sessionId.slice(0,4) }&gt;</span></strong>: ${ message }</p>
        </div>`
      );
    });

    // PLAYER DISCONNECTED
    this.props.socket.on('disconnected', ({ sessionId }) => {
      this.getLastMsgNode().insertAdjacentHTML('afterend',
        `<div class='message'><p>${ sessionId.slice(0,4) } disconnected.</p></div>`
      );
    });
  }

  onInputFocus(event) {
    document.getElementsByClassName('chat')[0].style.height = "100%";;
  }
  onInputFocusOut(event) {
    document.getElementsByClassName('chat')[0].style.height = "42px";;
  }

  updateScroll() {
    var element = document.getElementsByClassName('messages-wrapper')[0];
    element.scrollTop = element.scrollHeight;
  }

  onMessageSubmit(event) {
    if (event.key == 'Enter') {
      let message = event.target.value;
      if (message !== '') {
        this.getLastMsgNode().insertAdjacentHTML('afterend',
          `<div class='message'>
            <p><strong><span style="color: red;">&lt;${ this.state.sessionId }&gt;</span></strong>: ${message}</p>
          </div>`
        );
        this.updateScroll();
        event.target.value = '';

        // trigger message-sent event
        this.props.socket.emit('message-sent', { message, sessionId: this.state.sessionId });
      }
    }
  }

  pinChat() {
    var element = document.getElementsByClassName('chat')[0];
    var { chatPinned } = this.state;
    this.setState({ chatPinned: !chatPinned });
    element.classList.toggle("open");
  }

  getLastMsgNode() {
    let msgNodes = document.querySelectorAll('.message');
    return msgNodes[msgNodes.length - 1];
  }

  render() {
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
          value={this.state.chatPinned ? 'Unpin' : 'Pin'}/>
        <div className="messages-wrapper">
          <div className="messages">
            <div className="message">
              <p className="title">
                React Pictionary
              </p>
              <div className="welcome">
                @: Welcome to the chat <strong><span style={ strongRed }>&lt;{ this.state.sessionId ? this.state.sessionId : '' }&gt;</span></strong>.
                Type something below and press enter to start chatting away!
              </div>
              <p className="online">
                <span style={ strongGrey }>{ this.props ? this.props.numPlayers : 0 }</span> players currently online.
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
