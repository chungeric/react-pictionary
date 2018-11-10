import React, { Component } from 'react';
import Canvas from './canvas';
import css from '../../styles/app.scss';
import { connect } from 'react-redux';

class App extends Component {
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

export default App;
