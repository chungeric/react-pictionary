import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Switch,
  Route,
  withRouter,
} from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import Game from './Game';
import '../../styles/app.scss';

// eslint-disable-next-line
class App extends Component {
  render() {
    return (
      <div className="app">
        <Switch>
          <Route exact path="/" render={routeProps => <Game {...routeProps} />} />
          {/* <Route path="/game" render={routeProps => <Game {...routeProps} />} /> */}
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { socket: state.socket };
}
export default withRouter(connect(mapStateToProps)(App));
