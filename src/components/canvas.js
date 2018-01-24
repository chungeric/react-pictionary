import React, { Component } from 'react';
import css from '../../styles/canvas.scss';
// import io from 'socket.io-client';
import { connect } from 'react-redux';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.findNewCoords = this.findNewCoords.bind(this);
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

    // this.props.socket.on('connect', () => {
    //   if (this.props.numPlayers > 2) {
    //     this.setState({ timerFlag: true });
    //   }
    // });
    //
    // this.props.socket.on('timer', ({ timer }) => {
    //   this.setState({ timer });
    //   console.log(this.state.timer);
    // });
    //
    // this.props.socket.on('connected', () => {
    //   // if we are the only one connected when someone else connects
    //   // start timer
    //   if (this.props.numPlayers == 1 && !this.state.timerFlag) {
    //     this.setState({ timerFlag: true });
    //     this.props.socket.emit('flag');
    //
    //     this.gameTimer = setInterval( () => {
    //       let { timer } = this.state;
    //       if (timer == 0) {
    //         timer = 10;
    //       }
    //       timer--;
    //       this.props.socket.emit('timer', { timer });
    //       this.setState({ timer });
    //       console.log(this.state.timer);
    //
    //     }, 1000);
    //   }
    // });
    //
    // this.props.socket.on('flag', () => {
    //   this.setState({ timerFlag: true });
    // });
  }

  setupCanvas(canvas) {
    this.addCanvasEventListener("mousedown", canvas);
    this.addCanvasEventListener("mouseup", canvas);
    this.addCanvasEventListener("mousemove", canvas);
    this.addCanvasEventListener("mouseout", canvas);

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

  render() {
    return (
      <div className="canvas">
        <canvas id="canvas" width="700" height="496"></canvas>
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
