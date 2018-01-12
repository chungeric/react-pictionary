import React, { Component } from 'react';
import css from '../styles/game.scss';
import io from 'socket.io-client';

class Game extends Component {
  constructor(props) {
    super(props);
    this.findNewCoords = this.findNewCoords.bind(this);

    this.state = {
      ctx: null,
      x: 0,
      y: 0,
      pressed: false
    };
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on('draw', (data) => {
      console.log("draw event received on client");
      this.draw(data.x, data.y, data.e);
    });

    this.addCanvasEventListener("mousedown");
    this.addCanvasEventListener("mouseup");
    this.addCanvasEventListener("mousemove");
    this.addCanvasEventListener("mouseout");

    this.setState({ctx: document.getElementById("canvas").getContext("2d")});
  }

  addCanvasEventListener(event) {
    const canvas = document.getElementById("canvas");
    canvas.addEventListener(event, (e) => {
      this.findNewCoords(event, e);
    });
  }

  draw(x, y, e) {
    const { ctx } = this.state;
    if (e == "mousedown") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
    else if (e == "mousemove") {
      ctx.lineTo(x, y);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    else if (e == "mouseout" || e == "mouseup" ) {
      ctx.closePath();
    }
  }

  findNewCoords(e, mouse) {
    let { ctx, pressed, x, y } = this.state;

    if (e == "mousedown") {
      x = mouse.offsetX;
      y = mouse.offsetY;
      pressed = true;
      this.setState({ x, y, pressed });
      this.draw(x, y, e);
      this.socket.emit('draw', { x, y, e });
    }

    if (e == "mouseout" || e == "mouseup") {
      this.draw(x, y, e);
      this.socket.emit('draw', { x, y, e });
      this.setState({pressed: false});
    }

    if (e == "mousemove" && pressed) {
      x = mouse.offsetX;
      y = mouse.offsetY;
      this.setState({ x, y });
      this.draw(x, y, e);
      this.socket.emit('draw', { x, y, e });
    }
  }

  render() {
    return (
      <div className="game col-md-7">
        <canvas id="canvas" width="500" height="500"></canvas>
      </div>
    );
  }
}

export default Game;
