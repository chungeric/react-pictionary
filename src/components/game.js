import React, { Component } from 'react';
import css from '../styles/game.scss';

class Game extends Component {

  render() {
    return (
      <div className="game col-md-7">
        <canvas width="500" height="500"></canvas>
      </div>
    );
  }
}

export default Game;
