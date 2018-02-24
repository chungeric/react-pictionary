import React, { Component } from 'react';
// import Chat from './chat';
import Canvas from './canvas';
import css from '../../styles/app.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addPlayer, removePlayer, updatePlayers } from '../actions';

class App extends Component {

  componentDidMount() {

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
  return {
    socket: state.socket,
    numPlayers: state.numPlayers
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addPlayer, removePlayer, updatePlayers }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
