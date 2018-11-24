import React, { Component } from 'react';
import Canvas from './canvas';
import { removePlayer, updatePlayerCount } from '../actions';
import css from '../../styles/app.scss';
import { connect } from 'react-redux';

class App extends Component {
  componentDidMount() {
    this.props.socket.on('update-player-count', ( total ) => {
      this.props.updatePlayerCount(total);
    });
    this.props.socket.on('disconnected', (data) => {
      this.props.removePlayer();
    });
  }
  render() {
    return (
        <div className="app">
          <div className="wrapper">
            <Canvas/>
          </div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return { socket: state.socket };
}
export default connect(mapStateToProps, {
  removePlayer,
  updatePlayerCount
})(App);
