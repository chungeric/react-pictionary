import { combineReducers } from 'redux';
import SocketReducer from './reducer_socket';
import StrokeReducer from './reducer_strokes';
import NumPlayersReducer from './reducer_numplayers';

const rootReducer = combineReducers({
  socket: SocketReducer,
  numPlayers: NumPlayersReducer,
  strokes: StrokeReducer
});

export default rootReducer;
