import React, { Component } from 'react';
import css from '../styles/chat.scss';

class Chat extends Component {
  render() {
    return (
      <div className="chat">
        <input type="text" placeholder="Type your guess here..."  />
      </div>
    );
  }
}

export default Chat;
