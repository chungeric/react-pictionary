import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addPlayer, removePlayer, updatePlayers } from '../actions';

class PlayerHandler extends Component {
  componentDidMount() {
    this.props.socket.on('connect', () => {
      this.props.addPlayer();
    });

    this.props.socket.on('connected', () => {
      this.props.addPlayer();
    });

    this.props.socket.on('update-player-count', ( total ) => {
      this.props.updatePlayers(total);
    });

    this.props.socket.on('disconnect', () => {
      this.props.removePlayer();
    });

    this.props.socket.on('disconnected', () => {
      this.props.removePlayer();
    });
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return { socket: state.socket };
}
export default connect(mapStateToProps, {
  addPlayer,
  removePlayer,
  updatePlayers
})(PlayerHandler);
