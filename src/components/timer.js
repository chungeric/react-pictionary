import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addPlayer, removePlayer, updatePlayers } from '../actions';



class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timerFlag: false,
      timer: 10
    };
  }

  componentDidMount() {

    // Starts timer for 1st player that connects
    this.props.socket.on('update-player-count', ( total ) => {

      if (total == 1) {
        console.log('timer1');
        this.gameTimer = setInterval( () => {
          let { timer } = this.state;
          if (timer == 0) {
            timer = 10;
          }
          timer--;
          this.props.socket.emit('timer', timer );
          this.setState({ timer });
          console.log(this.state.timer);
        }, 1000);

        this.setState({ timerFlag: true });
      }
    });

    // Starts timer for any subsequent player connections
    this.props.socket.on('timer', ( time ) => {

      if (this.state.timerFlag == false) {
        console.log('timer2');
        let timer = time;
        this.gameTimer = setInterval( () => {

          if (timer == 0) {
            timer = 10;
          }
          timer--;
          this.props.socket.emit('timer', timer);
          this.setState({ timer });
          console.log(this.state.timer);

        }, 1000);

        this.setState({ timerFlag: true });
      }

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

export default connect(mapStateToProps, mapDispatchToProps)(Timer);
