import { UPDATE_PLAYER_COUNT, REMOVE_PLAYER } from '../actions/types';

export default function (state = 0, action) {
  switch (action.type) {
    case UPDATE_PLAYER_COUNT: {
      return action.payload;
    }
    case REMOVE_PLAYER: {
      const newState = state - 1;
      return newState;
    }
    default: {
      return state;
    }
  }
}
