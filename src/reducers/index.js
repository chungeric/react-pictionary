import { combineReducers } from 'redux';
import SocketReducer from './reducer_socket';
// import StrokeReducer from './reducer_strokes';

const rootReducer = combineReducers({
  socket: SocketReducer
});

export default rootReducer;
