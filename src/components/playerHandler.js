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
      this.props.socket.emit('share-numplayers', ({ numPlayers: this.props.numPlayers }));
    });

    this.props.socket.on('disconnect', () => {

      this.props.removePlayer();

    });

    this.props.socket.on('disconnected', () => {

      this.props.removePlayer();

    });

    this.props.socket.on('update-numplayers', ({ numPlayers }) => {

      this.props.updatePlayers(numPlayers);
      
    });


  }

  render() {
    return null;
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

export default connect(mapStateToProps, mapDispatchToProps)(PlayerHandler);
