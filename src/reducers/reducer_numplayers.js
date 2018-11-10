import _ from 'lodash';

import { REMOVE_PLAYER, UPDATE_PLAYERS } from '../actions/types';

export default function(state = 0, action) {
  switch(action.type) {
    case REMOVE_PLAYER:
      return _.subtract(state, 1);
    case UPDATE_PLAYERS:
      return action.payload;
    default:
      return state;
  }
}
