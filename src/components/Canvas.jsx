import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../../styles/canvas.scss';
import Chat from './Chat';
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
    const canvas = document.getElementById('canvas');
    const ctx = this.setupCanvas(canvas);
    this.setState({ ctx });
    window.addEventListener('resize', this.updateCanvasDimensions);
  }

  componentDidUpdate(prevProps) {
    const { socket: oldSocket } = prevProps;
    const { socket: newSocket } = this.props;
    if ((oldSocket === null) && newSocket !== null && oldSocket !== newSocket) {
      newSocket.on('draw', ({ x, y, e }) => {
        this.draw(x, y, e);
      });
      newSocket.on('clear-canvas', () => {
        this.clearCanvas();
      });
    }
  }

  onClearBtnClick() {
    const { clearStrokes: clearStrokesAction, socket } = this.props;
    this.clearCanvas();
    // Clear strokes in redux state
    clearStrokesAction();
    // Emit clear-strokes event to all connected sockets
    socket.emit('clear-canvas');
  }

  setupCanvas(canvas) {
    const theCanvas = canvas;
    this.addCanvasEventListener('mousedown', theCanvas);
    this.addCanvasEventListener('mouseup', theCanvas);
    this.addCanvasEventListener('mousemove', theCanvas);
    this.addCanvasEventListener('mouseout', theCanvas);
    theCanvas.width = theCanvas.parentElement.clientWidth;
    theCanvas.height = theCanvas.parentElement.clientHeight;
    return theCanvas.getContext('2d');
  }

  /* ------------------------------------------------------------------------
    Add mouse events to the canvas
  ------------------------------------------------------------------------ */
  addCanvasEventListener(event, canvas) {
    canvas.addEventListener(event, (e) => {
      this.findNewCoords(event, e);
    });
  }

  /* ------------------------------------------------------------------------
    Draw function - draws line on canvas based on mouse positions
  ------------------------------------------------------------------------ */
  draw(x, y, e) {
    const { storeStroke: storeStrokeAction } = this.props;
    const { ctx } = this.state;
    if (e === 'mousedown') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      storeStrokeAction(x, y, 'start');
    } else if (e === 'mousemove') {
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();
      storeStrokeAction(x, y, 'move');
    } else if (e === 'mouseout' || e === 'mouseup') {
      ctx.closePath();
    }
  }

  /* ------------------------------------------------------------------------
    Detect mouse movement events
  ------------------------------------------------------------------------ */
  findNewCoords(e, mouse) {
    const { socket } = this.props;
    if (socket) {
      let { pressed, x, y } = this.state;
      if (e === 'mousedown') {
        x = mouse.offsetX;
        y = mouse.offsetY;
        pressed = true;
        this.setState({ x, y, pressed });
        this.draw(x, y, e);
        socket.emit('draw', { x, y, e });
      }

      if (e === 'mouseout' || e === 'mouseup') {
        this.draw(x, y, e);
        socket.emit('draw', { x, y, e });
        this.setState({ pressed: false });
      }

      if (e === 'mousemove' && pressed) {
        x = mouse.offsetX;
        y = mouse.offsetY;
        this.setState({ x, y });
        this.draw(x, y, e);
        socket.emit('draw', { x, y, e });
      }
    }
  }

  /* ------------------------------------------------------------------------
    Clear the canvas on all connected sockets
  ------------------------------------------------------------------------ */
  clearCanvas() {
    const { ctx } = this.state;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  /* ------------------------------------------------------------------------
    Update canvas dimensions on resize -- still WIP
  ------------------------------------------------------------------------ */
  updateCanvasDimensions() {
    const { ctx } = this.state;
    const drawing = ctx.getImageData(
      0, 0,
      ctx.canvas.parentElement.clientWidth,
      ctx.canvas.parentElement.clientWidth
    );
    ctx.canvas.width = ctx.canvas.parentElement.clientWidth;
    ctx.canvas.height = ctx.canvas.parentElement.clientHeight;
    ctx.putImageData(drawing, 0, 0);
    this.setState({ ctx });
  }

  render() {
    return (
      <div className="canvas">
        <div className="canvas-wrapper">
          <Chat />
          <canvas id="canvas" />
          <div className="palette">
            <button type="button" className="clear-btn" onClick={this.onClearBtnClick}>Clear</button>
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
