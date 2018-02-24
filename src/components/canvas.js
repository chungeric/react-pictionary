import React, { Component } from 'react';
import css from '../../styles/canvas.scss';
import Chat from './chat';
// import io from 'socket.io-client';
import { connect } from 'react-redux';
import { startTimer } from '../lib/timer';

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
      pressed: false,
      timerFlag: false,
      timer: 10
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

    /* TIMER STUFF */

    this.props.socket.on('connect', () => {
      console.log(this.props.numPlayers);
      if (this.props.numPlayers == 2 && !this.state.timerFlag) {

        this.setState({ timerFlag: true });

        this.gameTimer = setInterval( () => {
          let { timer } = this.state;
          if (timer == 0) {
            timer = 10;
          }
          timer--;
          // this.props.socket.emit('timer', { timer });
          this.setState({ timer });
          console.log(this.state.timer);

        }, 1000);
      }
    });

    this.props.socket.on('new-player-connected', ({ time }) => {
      if (this.state.timerFlag == false) {
        this.gameTimer = setInterval( () => {
          let { timer } = this.state;
          if (timer == 0) {
            timer = 10;
          }
          timer--;
          this.props.socket.emit('timer', { timer });
          this.setState({ timer });
          console.log(this.state.timer);

        }, 1000);

        this.setState({ timerFlag: true });
      }
    });


    // this.props.socket.on('timer', ({ timer }) => {
    //   if (this.state.timerFlag == false) {
    //     startTimer(timer);
    //     console.log(timer);
    //   }
    //
    //   this.setState({ timerFlag: true });
    //
    //   // this.setState({ timer });
    //   // console.log(this.state.timer);
    // });

    this.props.socket.on('connected', () => {

      // if we are the only one connected when someone else connects
      // start timer
      if (this.props.numPlayers == 2 && !this.state.timerFlag) {

        this.setState({ timerFlag: true });
        // this.props.socket.emit('flag');

        this.gameTimer = setInterval( () => {
          let { timer } = this.state;
          if (timer == 0) {
            timer = 10;
          }
          timer--;
          // this.props.socket.emit('timer', { timer });
          this.setState({ timer });
          console.log(this.state.timer);

        }, 1000);
      } else if (this.props.numPlayers > 2) {
        this.props.socket.emit('new-player-connected', { timer: this.state.timer });
      }
    });

    this.props.socket.on('flag', () => {
      this.setState({ timerFlag: true });
    });
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
      // this.socket.emit('draw', { x, y, e });
      this.props.socket.emit('draw', { x, y, e });
    }

    if (e == "mouseout" || e == "mouseup") {
      this.draw(x, y, e);
      // this.socket.emit('draw', { x, y, e });
      this.props.socket.emit('draw', { x, y, e });
      this.setState({pressed: false});
    }

    if (e == "mousemove" && pressed) {
      x = mouse.offsetX;
      y = mouse.offsetY;
      this.setState({ x, y });
      this.draw(x, y, e);
      // this.socket.emit('draw', { x, y, e });
      this.props.socket.emit('draw', { x, y, e });
    }
  }

  onClearBtnClick() {
    this.clearCanvas();
    this.props.socket.emit('clear-canvas');
  }

  clearCanvas() {
    console.log('clear');
    let { ctx } = this.state;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
          <Chat />
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
    numPlayers: state.numPlayers
  };
}

export default connect(mapStateToProps)(Canvas);
