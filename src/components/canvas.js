import React, { Component } from 'react';
import css from '../../styles/canvas.scss';
import Chat from './chat';
import Timer from './timer';
import PlayerHandler from './playerHandler';
import { connect } from 'react-redux';
import { storeStroke, clearStrokes } from '../actions';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.findNewCoords = this.findNewCoords.bind(this);
    this.onClearBtnClick = this.onClearBtnClick.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
    this.updateCanvasDimensions = this.updateCanvasDimensions.bind(this);
    this.state = {
      ctx: null,
      x: 0,
      y: 0,
      pressed: false
    };
  }

  componentDidMount() {
    this.props.socket.on('draw', ({ x, y, e }) => {
      this.draw(x, y, e);
    });

    let canvas = document.getElementById("canvas");
    const ctx = this.setupCanvas(canvas);
    this.setState({ ctx });

    this.props.socket.on('clear-canvas', () => {
      this.clearCanvas();
    });

    window.addEventListener('resize', this.updateCanvasDimensions);
  }

  setupCanvas(canvas) {
    this.addCanvasEventListener("mousedown", canvas);
    this.addCanvasEventListener("mouseup", canvas);
    this.addCanvasEventListener("mousemove", canvas);
    this.addCanvasEventListener("mouseout", canvas);
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
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
      this.props.storeStroke(x, y, 'start');
      console.log(this.props.strokes);
    }
    else if (e == "mousemove") {
      ctx.lineTo(x, y);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();
      this.props.storeStroke(x, y, 'move');
      console.log(this.props.strokes);
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
      this.props.socket.emit('draw', { x, y, e });
    }

    if (e == "mouseout" || e == "mouseup") {
      this.draw(x, y, e);
      this.props.socket.emit('draw', { x, y, e });
      this.setState({pressed: false});
    }

    if (e == "mousemove" && pressed) {
      x = mouse.offsetX;
      y = mouse.offsetY;
      this.setState({ x, y });
      this.draw(x, y, e);
      this.props.socket.emit('draw', { x, y, e });
    }
  }

  onClearBtnClick() {
    this.clearCanvas();
    // Clear strokes in redux state
    this.props.clearStrokes();
    // Emit clear-strokes event to all connected sockets
    this.props.socket.emit('clear-canvas');
  }

  clearCanvas() {
    let { ctx } = this.state;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Clear strokes in redux state
    this.props.clearStrokes();
  }

  updateCanvasDimensions() {
    var { ctx } = this.state;
    var drawing = ctx.getImageData(0,0,ctx.canvas.parentElement.clientWidth,ctx.canvas.parentElement.clientWidth);
    ctx.canvas.width = ctx.canvas.parentElement.clientWidth;
    ctx.canvas.height = ctx.canvas.parentElement.clientHeight;
    ctx.putImageData(drawing,0,0);
    this.setState({ ctx });
  }

  render() {
    return (
      <div className="canvas">
        <div className="canvas-wrapper">
          <PlayerHandler />
          <Chat />
          {/* <Timer /> */}
          <canvas id="canvas"></canvas>
          <div className="palette">
            <button className="clear-btn" onClick={this.onClearBtnClick}>Clear</button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    socket: state.socket,
    strokes: state.strokes
  };
}

export default connect(mapStateToProps, { storeStroke, clearStrokes })(Canvas);
