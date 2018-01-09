import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage';
import CreateRoomPage from './components/pages/CreateRoomPage';
import JoinRoomPage from './components/pages/JoinRoomPage';


class App extends Component {

  render() {
    return (
      <div className="container">
        <Route path="/" exact component={ LandingPage } />
        <Route path="/createroom" exact component={ CreateRoomPage } />
        <Route path="/joinroom" exact component={ JoinRoomPage } />
      </div>
    );
  }
}

export default App;
