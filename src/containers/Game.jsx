import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import Canvas from '../components/Canvas';
import { removePlayer, updatePlayerCount, createSocket } from '../actions';

class Game extends Component {
  componentDidMount() {
    const socket = io('/game');
    this.props.createSocket(socket);
  }

  componentDidUpdate(prevProps) {
    const { socket: oldSocket } = prevProps;
    const { socket: newSocket } = this.props;
    if ((oldSocket === null) && newSocket !== null && oldSocket !== newSocket) {
      newSocket.on('update-player-count', (total) => {
        this.props.updatePlayerCount(total);
      });
      newSocket.on('disconnected', (data) => {
        this.props.removePlayer();
      });
    }
  }

  render() {
    const { socket: socketFromProps } = this.props;
    return (
      <div className="wrapper">
        <Canvas />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { socket: state.socket };
}

export default connect(mapStateToProps, {
  removePlayer,
  updatePlayerCount,
  createSocket,
})(Game);
