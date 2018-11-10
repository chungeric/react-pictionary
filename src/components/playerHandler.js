import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removePlayer, updatePlayers } from '../actions';

class PlayerHandler extends Component {
  componentDidMount() {
    this.props.socket.on('update-player-count', ( total ) => {
      console.log('UPDATE!!!!');
      this.props.updatePlayers(total);
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
  removePlayer,
  updatePlayers
})(PlayerHandler);
