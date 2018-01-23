import React, { Component } from 'react';
import css from '../../styles/chat.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addPlayer, removePlayer, updatePlayers } from '../actions';

class Chat extends Component {

  constructor(props) {
    super(props);
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('connect', () => {
      const sessionId = this.props.socket.id.slice(0,8);
      this.setState({ sessionId });
      $(".message:first-of-type").append(
        `<p>
          @: Welcome to the chat <strong><span style="color: red;">&lt;${sessionId}&gt;</span></strong>.
          Type something below and press enter to start chatting away!
        </p>`
      );

      // add to player count in application state
      this.props.addPlayer();
      console.log(this.props.numPlayers);
    });

    this.props.socket.on('connected', ({ sessionId }) => {
      $(".message:last-of-type").after(
        `<div class='message'><p>${sessionId.slice(0,8)} connected.</p></div>`
      );
      this.props.addPlayer();
      console.log(this.props.numPlayers);
      this.props.socket.emit('share-numplayers', ({ numPlayers: this.props.numPlayers }));
    });

    this.props.socket.on('update-numplayers', ({ numPlayers }) => {
      this.props.updatePlayers(numPlayers);
      console.log(this.props.numPlayers);
    });

    this.props.socket.on('message-sent', ({ message, sessionId }) => {
      $(".message:last-of-type").after(
        `<div class='message'>
          <p><strong><span style="color: red;">&lt;${sessionId.slice(0,8)}&gt;</span></strong>: ${message}</p>
        </div>`
      );
    });

    this.props.socket.on('disconnected', ({ sessionId }) => {
      $(".message:last-of-type").after(
        `<div class='message'><p>${sessionId.slice(0,8)} disconnected.</p></div>`
      );
      this.props.removePlayer();
      console.log(this.props.numPlayers);
    });
  }

  onMessageSubmit(event) {
    if (event.key == 'Enter') {
      let message = event.target.value;
      if (message !== '') {
        $(".message:last-of-type").after(
          `<div class='message'>
            <p><strong><span style="color: red;">&lt;${this.state.sessionId.slice(0,8)}&gt;</span></strong>: ${message}</p>
          </div>`
        );
        event.target.value = '';

        // trigger message-sent event
        // this.socket.emit('message-sent', { message, sessionId: this.state.sessionId });
        this.props.socket.emit('message-sent', { message, sessionId: this.state.sessionId });
      }
    }
  }

  render() {
    return (
      <div className="chat">
        <div className="messages-wrapper">
          <div className="messages">
            <div className="message">

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
