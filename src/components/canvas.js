import React, { Component } from 'react';
import css from '../styles/canvas.scss';
import io from 'socket.io-client';

class Canvas extends Component {
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

    this.socket.on('draw', ({ x, y, e }) => {
      this.draw(x, y, e);
    });

    let canvas = document.getElementById("canvas");
    const ctx = this.setupCanvas(canvas);
    this.setState({ ctx });

  }

  setupCanvas(canvas) {
    this.addCanvasEventListener("mousedown", canvas);
    this.addCanvasEventListener("mouseup", canvas);
    this.addCanvasEventListener("mousemove", canvas);
    this.addCanvasEventListener("mouseout", canvas);
    let parent = canvas.parentNode.getBoundingClientRect();

    canvas.width = parent.width;
    canvas.height = parent.height;
    return canvas.getContext("2d");
  }

  addCanvasEventListener(event, canvas) {
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
      <div className="canvas">
        <canvas id="canvas" width="100%" height="100%"></canvas>
      </div>
    );
  }
}

export default Canvas;
