import React, { Component } from 'react';
import Chat from './chat';
import Canvas from './canvas';
import css from '../../styles/app.scss';

class App extends Component {

  render() {
    return (
        <div className="app">
          <Canvas />
          <Chat />
        </div>
    );
  }
}

export default App;
