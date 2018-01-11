import React, { Component } from 'react';
import Chat from './chat';
import Game from './game';

class App extends Component {
  render() {
    return (
      <div>
        <Game />
        <Chat />
      </div>
    );
  }
}

export default App;
