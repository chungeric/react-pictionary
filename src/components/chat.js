import React, { Component } from 'react';
import css from '../styles/chat.scss';
import io from 'socket.io-client';

class Chat extends Component {

  constructor(props) {
    super(props);
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on('connect', () => {
      this.setState({ sessionId: this.socket.id.slice(0,8) });
    });
    this.socket.on('connected', ({ sessionId }) => {
      $(".message:last-of-type").after(
        `<div class='message'><p>${sessionId} connected.</p></div>`
      );
    });
    this.socket.on('message-sent', ({ message, sessionId }) => {
      $(".message:last-of-type").after(
        `<div class='message'><p>${sessionId}: ${message}</p></div>`
      );
    });
  }

  onMessageSubmit(event) {
    if (event.key == 'Enter') {
      let message = event.target.value;
      if (message !== '') {
        $(".message:last-of-type").after(
          `<div class='message'><p>${this.state.sessionId}: ${message}</p></div>`
        );
        event.target.value = '';

        // trigger message-sent event
        this.socket.emit('message-sent', { message, sessionId: this.state.sessionId });
      }
    }
  }

  render() {
    return (
      <div className="chat">
        <div className="messages-wrapper">
          <div className="messages">
            <div className="message">
              <p>@: Welcome to the chat. Type something below and press enter to start chatting away!</p>
            </div>
          </div>
        </div>
        <input id="chat-input" type="text" placeholder="Type your guess here..." onKeyPress={this.onMessageSubmit} />
      </div>
    );
  }
}

export default Chat;
