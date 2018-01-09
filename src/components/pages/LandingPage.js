import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class LandingPage extends Component {
  render() {
    return (
      <div>
        <h2>Landing Page</h2>
        <Link to="/createroom" replace >Create Room</Link>
        <Link to="/joinroom" replace >Join Room</Link>
      </div>
    );
  }
}

export default LandingPage;
