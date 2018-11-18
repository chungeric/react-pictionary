import { UPDATE_PLAYER_COUNT } from '../actions/types';

export default function(state = 0, action) {
  switch(action.type) {
    case UPDATE_PLAYER_COUNT:
      return action.payload;
    default:
      return state;
  }
}
