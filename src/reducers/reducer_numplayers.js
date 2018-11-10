import _ from 'lodash';

import { ADD_PLAYER, REMOVE_PLAYER, UPDATE_PLAYERS } from '../actions/types';

export default function(state = 0, action) {
  switch(action.type) {
    case ADD_PLAYER:
      return _.add(state, 1);
    case REMOVE_PLAYER:
      return _.subtract(state, 1);
    case UPDATE_PLAYERS:
      return action.payload;
    default:
      return state;
  }
}
