import React, { Component } from 'react';
import css from '../styles/game.scss';

class Game extends Component {
  constructor(props) {
    super(props);
    this.findNewCoords = this.findNewCoords.bind(this);

    this.state = {
      ctx: null,
      currX: 0,
      currY: 0,
      prevX: 0,
      prevY: 0,
      pressed: false
    };
  }

  componentDidMount() {
    this.setState({ctx: document.getElementById("canvas").getContext("2d")});
    this.addCanvasEventListener("mousedown");
    this.addCanvasEventListener("mouseup");
    this.addCanvasEventListener("mousemove");
    this.addCanvasEventListener("mouseout");
  }

  addCanvasEventListener(event) {
    canvas.addEventListener(event, (e) => {
      this.findNewCoords(event, e);
    });
  }

  draw() {
    const { ctx, currX, currY, prevX, prevY } = this.state;
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  }

  findNewCoords(e, mouse) {
    let { ctx, pressed, currX, currY, prevX, prevY } = this.state;
    let dot_flag = false;

    if (e == "mousedown") {
      prevX = currX;
      prevY = currY;
      currX = mouse.offsetX;
      currY = mouse.offsetY;
      pressed = true;
      dot_flag = true;
      if (dot_flag) {
        this.drawDot(ctx, currX, currY);
        dot_flag = false;
      }
      this.setState({ prevX, prevY, currX, currY, pressed });
    }

    if (e == "mouseout" || e == "mouseup") {
      this.setState({pressed: false});
    }

    if (e == "mousemove" && pressed) {
      prevX = currX;
      prevY = currY;
      currX = mouse.offsetX;
      currY = mouse.offsetY;
      this.setState({ prevX, prevY, currX, currY });
      this.draw();
    }
  }


  drawDot(ctx, x, y) {
    ctx.beginPath();
    ctx.fillRect(x, y, 2, 2);
    ctx.stroke();
    ctx.closePath();
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
