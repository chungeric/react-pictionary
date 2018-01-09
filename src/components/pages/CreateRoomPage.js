import React, { Component } from 'react';
import CreateRoomForm from '../forms/CreateRoomForm';

class CreateRoomPage extends Component {
  render() {
    return (
      <div>
        <h2>Create Room</h2>
        <CreateRoomForm />
      </div>
    );
  }
}

export default CreateRoomPage;
