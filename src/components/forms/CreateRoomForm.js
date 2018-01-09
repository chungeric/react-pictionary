import React, { Component } from 'react';


class CreateRoomForm extends Component {
  render() {
    return (
      <form method="POST" action="/newroom">
        <div className="form-group">
          <label htmlFor="username">Your username:</label>
          <input id="username" name="username" className="form-control"></input>
        </div>

        <div className="form-group">
          <label htmlFor="roomName">Room name:</label>
          <input id="roomName" name="roomName" className="form-control"></input>
        </div>

        <div className="form-group">
          <label htmlFor="roomPass">Room password:</label>
          <input id="roomPass" name="roomPass" className="form-control"></input>
        </div>

        <button type="submit" className="btn btn-primary">Create Room</button>
      </form>
    );
  }
}

export default CreateRoomForm;
