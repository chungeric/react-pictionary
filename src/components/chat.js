import React, { Component } from 'react';
import css from '../../styles/chat.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addPlayer, removePlayer, updatePlayers } from '../actions';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
    this.state = {
      sessionId: null
    };
  }

  componentDidMount() {

    // SELF CONNECTED
    this.props.socket.on('connect', () => {
      const sessionId = this.props.socket.id.slice(0,8);
      this.setState({ sessionId });

      // add to my player count in application state
      this.props.addPlayer();
    });


    // NEW USER (NOT SELF) CONNECTED
    this.props.socket.on('connected', ({ sessionId }) => {
      this.getLastMsgNode().insertAdjacentHTML('afterend',
        `<div class='message'><p>${ sessionId.slice(0,8) } connected.</p></div>`
      );

      // add to my player count in application state
      this.props.addPlayer();

      // send up to date number of players to everyone, so everyone is up to date
      this.props.socket.emit('share-numplayers', ({ numPlayers: this.props.numPlayers }));

      // updates number of players online displayed
      this.updateNumOnline();
    });


    // UPDATE MY SOCKET'S NUMPLAYERS STATE
    this.props.socket.on('update-numplayers', ({ numPlayers }) => {
      this.props.updatePlayers(numPlayers);

      // updates number of players online displayed
      this.updateNumOnline();
    });


    // MESSAGE SENT BY ANOTHER PLAYER SHOULD BE DISPLAYED
    this.props.socket.on('message-sent', ({ message, sessionId }) => {
      this.getLastMsgNode().insertAdjacentHTML('afterend',
        `<div class='message'>
          <p><strong><span style="color: red;">&lt;${ sessionId.slice(0,8) }&gt;</span></strong>: ${ message }</p>
        </div>`
      );
    });


    // PLAYER DISCONNECTED
    this.props.socket.on('disconnected', ({ sessionId }) => {
      this.getLastMsgNode().insertAdjacentHTML('afterend',
        `<div class='message'><p>${ sessionId.slice(0,8) } disconnected.</p></div>`
      );

      // deducts from player count in application state
      this.props.removePlayer();

      // updates number of players online displayed
      this.updateNumOnline();
    });
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
        event.target.value = '';

        // trigger message-sent event
        this.props.socket.emit('message-sent', { message, sessionId: this.state.sessionId });
      }
    }
  }

  getLastMsgNode() {
    let msgNodes = document.querySelectorAll('.message');
    return msgNodes[msgNodes.length - 1];
  }

  updateNumOnline() {
    document.querySelector(".message > .online").innerHTML = `<p class="online">
      <strong><span style="color: #666;">${ this.props.numPlayers }</span></strong> players currently online.
    </p>`;
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
        <div className="messages-wrapper">
          <div className="messages">
            <div className="message">
              <p className="welcome">
                @: Welcome to the chat <strong><span style={ strongRed }>&lt;{ this.state.sessionId ? this.state.sessionId : '' }&gt;</span></strong>.
                Type something below and press enter to start chatting away!
              </p>
              <p className="online">
                <span style={ strongGrey }>{ this.props ? this.props.numPlayers : '' }</span> players currently online.
              </p>
            </div>
          </div>
        </div>
        <input id="chat-input" type="text" placeholder="Type your guess here..." onKeyPress={this.onMessageSubmit} />
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addPlayer, removePlayer, updatePlayers }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
